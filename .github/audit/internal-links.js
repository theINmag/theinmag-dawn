#!/usr/bin/env node
/*
 * .github/audit/internal-links.js
 *
 * Scans every Liquid + JSON file in the theme for internal links
 * (hrefs, link/url/cta fields in section settings, JSON-LD breadcrumbs)
 * and cross-references each path against the live Shopify product and
 * collection inventory. Emits a Markdown report on stdout + writes
 * /tmp/link-audit-report.md and /tmp/link-audit-summary.json for the
 * workflow to consume.
 *
 * The audit methodology was first run by hand on 2026-05-26
 * (see ../theinmag-docs/internal-link-audit-2026-05.md). This
 * script automates re-running it monthly.
 *
 * Env vars (required):
 *   SHOPIFY_STORE_URL       e.g. theinmag.myshopify.com
 *   SHOPIFY_API_VERSION     e.g. 2026-04
 *   SHOPIFY_CLIENT_ID       Custom-app client ID (read_products + read_collections)
 *   SHOPIFY_CLIENT_SECRET   Custom-app client secret
 *
 * Optional:
 *   THEME_ROOT              path to the theme repo root (default cwd)
 *
 * Exit codes:
 *   0  = clean (no broken or suspicious findings)
 *   1  = findings present (workflow opens/updates GitHub Issue)
 *   2  = Shopify API unreachable
 *
 * Limitations:
 *   The audit app's scopes cover products + collections only. Pages,
 *   articles, blogs and menus aren't enumerable - those classes get
 *   "suspicious" status when the handle isn't in the hand-curated
 *   allow-list (KNOWN_PAGE_HANDLES / KNOWN_BLOG_HANDLES below). When
 *   a new page or blog goes live, add its handle there.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------

const THEME_ROOT = process.env.THEME_ROOT || process.cwd();
const SCAN_DIRS = ['sections', 'snippets', 'templates', 'layout'];

// Pages with custom templates (templates/page.<handle>.json) plus any
// non-templated handles confirmed to exist. Add new ones here when they
// land in admin.
const KNOWN_PAGE_HANDLES = new Set([
  'become-a-stockist',
  'behind-the-mag',
  'build-a-bundle',
  'competitions',
  'contact',
  'for-homeschoolers',
  'for-parents',
  'for-teachers',
  'freebies',
  'gallery',
  'legal',
  'membership',
  'partnerships',
  'reviews',
  'school-order',
  'send-in',
  'shipping-refunds',
  'shop',
  'stockists',
  // Default-template (no page.<handle>.json) but confirmed live:
  'child-safety-terms-conditions-privacy-policy',
]);

const KNOWN_BLOG_HANDLES = new Set([
  'field-notes',
]);

// Built-in Shopify routes - always considered valid.
const BUILT_IN_ROUTES = [
  /^\/$/,
  /^\/cart(\/|$|\.)/,
  /^\/checkout(\/|$|\?)/,
  /^\/search(\/|$|\?)/,
  /^\/account(\/|$|\?)/,
  /^\/collections\/all(\/|$|\?|#)/,
  /^\/policies\//,
  /^\/sitemap\.xml/,
  /^\/robots\.txt/,
  /^\/apps\//,
];

// Intentional dynamic sentinel URLs that the theme resolves at render time.
const SENTINELS = new Set([
  '/products/latest-mag', // resolves via shop.metafields.theinmag.promoted_issue_handle
]);

// ---------------------------------------------------------------------
// Shopify API
// ---------------------------------------------------------------------

async function getToken() {
  const r = await fetch(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    }
  );
  const data = await r.json();
  if (!data.access_token) {
    throw new Error('No access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function gql(token, query) {
  const r = await fetch(
    `https://${process.env.SHOPIFY_STORE_URL}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    }
  );
  return r.json();
}

async function pullPaged(token, queryFn, key) {
  let after = null,
    hasNext = true,
    all = [];
  while (hasNext) {
    const cursor = after ? `, after: "${after}"` : '';
    const result = await gql(token, queryFn(cursor));
    if (result.errors) throw new Error(JSON.stringify(result.errors));
    const slice = result.data[key];
    all.push(...slice.nodes);
    hasNext = slice.pageInfo.hasNextPage;
    after = slice.pageInfo.endCursor;
  }
  return all;
}

async function fetchInventory() {
  const token = await getToken();
  const products = await pullPaged(
    token,
    (c) =>
      `{ products(first: 100${c}) { pageInfo { hasNextPage endCursor } nodes { handle status } } }`,
    'products'
  );
  const collections = await pullPaged(
    token,
    (c) =>
      `{ collections(first: 100${c}) { pageInfo { hasNextPage endCursor } nodes { handle } } }`,
    'collections'
  );
  return {
    active: new Set(
      products.filter((p) => p.status === 'ACTIVE').map((p) => p.handle)
    ),
    nonActive: new Set(
      products.filter((p) => p.status !== 'ACTIVE').map((p) => p.handle)
    ),
    collectionHandles: new Set(collections.map((c) => c.handle)),
  };
}

// ---------------------------------------------------------------------
// Theme scanning
// ---------------------------------------------------------------------

function walkDir(dir, files) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fp, files);
    else files.push(fp);
  }
  return files;
}

function listThemeFiles() {
  const files = [];
  for (const d of SCAN_DIRS) walkDir(path.join(THEME_ROOT, d), files);
  return files;
}

const LINK_KEY_RE = /(link|url|href|cta|tile_link|button_link|action)/i;

function scanFile(file) {
  const findings = [];
  const isJson = file.endsWith('.json');
  const isLiquid = file.endsWith('.liquid');
  if (!isJson && !isLiquid) return findings;

  const src = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(THEME_ROOT, file);

  if (isJson) {
    // Shopify header-group / footer-group JSON files start with a /* ... */ block.
    const cleaned = src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch {
      return findings;
    }
    const walk = (obj, jsonPath) => {
      if (obj === null) return;
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => walk(v, `${jsonPath}[${i}]`));
      } else if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          walk(v, `${jsonPath}.${k}`);
          if (
            LINK_KEY_RE.test(k) &&
            typeof v === 'string' &&
            v.startsWith('/')
          ) {
            findings.push({
              file: relPath,
              line: null,
              url: v,
              context: jsonPath + '.' + k,
            });
          }
        }
      }
    };
    walk(data, '');
  }

  if (isLiquid) {
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      const hrefRe = /href=["'](\/[^"'#?{][^"']*)["']/g;
      let m;
      while ((m = hrefRe.exec(line)) !== null) {
        const url = m[1];
        // Skip protocol-relative URLs (//example.com) and any URL
        // containing Liquid expressions ({{...}} / {%...%}).
        if (url.startsWith('//')) continue;
        if (/[{}%]/.test(url)) continue;
        findings.push({
          file: relPath,
          line: i + 1,
          url,
          context: line.trim().slice(0, 100),
        });
      }
      const pathRe =
        /["'](\/(?:pages|products|collections|blogs)\/[a-z][a-z0-9\-_/]*)["']/g;
      while ((m = pathRe.exec(line)) !== null) {
        const url = m[1];
        if (url.startsWith('//')) continue;
        if (/[{}%]/.test(url)) continue;
        if (
          !findings.some(
            (f) => f.file === relPath && f.line === i + 1 && f.url === url
          )
        ) {
          findings.push({
            file: relPath,
            line: i + 1,
            url,
            context: line.trim().slice(0, 100),
          });
        }
      }
    });
  }

  return findings;
}

// ---------------------------------------------------------------------
// Classify each unique URL
// ---------------------------------------------------------------------

function stripQuery(url) {
  return url.split('?')[0].split('#')[0];
}

function classify(url, inv) {
  if (SENTINELS.has(url)) {
    return {
      status: 'sentinel',
      reason: 'Known dynamic sentinel (resolved by Liquid at render time)',
    };
  }

  for (const re of BUILT_IN_ROUTES) {
    if (re.test(url)) return { status: 'ok', reason: 'Shopify built-in route' };
  }

  const clean = stripQuery(url);

  let m = clean.match(/^\/products\/([a-z0-9\-]+)$/);
  if (m) {
    const h = m[1];
    if (inv.active.has(h))
      return { status: 'ok', reason: 'Active product' };
    if (inv.nonActive.has(h))
      return {
        status: 'broken',
        reason: 'Product exists but is not ACTIVE (DRAFT/ARCHIVED - 404s on storefront)',
      };
    return { status: 'broken', reason: 'No such product handle in this store' };
  }

  m = clean.match(/^\/collections\/([a-z0-9\-]+)$/);
  if (m) {
    const h = m[1];
    if (inv.collectionHandles.has(h))
      return { status: 'ok', reason: 'Existing collection' };
    return { status: 'broken', reason: 'No such collection handle' };
  }

  m = clean.match(/^\/pages\/([a-z0-9\-]+)$/);
  if (m) {
    const h = m[1];
    if (KNOWN_PAGE_HANDLES.has(h))
      return { status: 'ok', reason: 'Known page handle' };
    return {
      status: 'suspicious',
      reason: 'Unknown page handle - not in template list or known overrides',
    };
  }

  m = clean.match(/^\/blogs\/([a-z0-9\-]+)$/);
  if (m) {
    const h = m[1];
    if (KNOWN_BLOG_HANDLES.has(h))
      return { status: 'ok', reason: 'Known blog handle' };
    return { status: 'suspicious', reason: 'Unknown blog handle' };
  }

  m = clean.match(/^\/blogs\/([a-z0-9\-]+)\/([a-z0-9\-]+)$/);
  if (m) {
    const blog = m[1];
    if (!KNOWN_BLOG_HANDLES.has(blog))
      return {
        status: 'suspicious',
        reason: `Article in unknown blog "${blog}"`,
      };
    return {
      status: 'info',
      reason: 'Specific article (audit cannot enumerate articles - manual verify)',
    };
  }

  return { status: 'suspicious', reason: 'Unrecognised path pattern' };
}

// ---------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------

function emitReport(findings, inv, fileCount) {
  const buckets = {
    broken: [],
    suspicious: [],
    sentinel: [],
    ok: [],
    info: [],
  };
  const byUrl = new Map();
  for (const f of findings) {
    if (!byUrl.has(f.url)) byUrl.set(f.url, []);
    byUrl.get(f.url).push(f);
  }
  for (const [url, locs] of byUrl) {
    const cls = classify(url, inv);
    buckets[cls.status].push({ url, locs, reason: cls.reason });
  }
  for (const k of Object.keys(buckets))
    buckets[k].sort((a, b) => a.url.localeCompare(b.url));

  const lines = [];
  const now = new Date().toISOString();
  lines.push(`# Internal link audit — ${now.slice(0, 10)}`);
  lines.push('');
  lines.push(
    `Scanned **${fileCount} files** across \`sections/\` \`snippets/\` \`templates/\` \`layout/\`. ` +
      `Cross-referenced against ${inv.active.size} active products, ${inv.nonActive.size} non-active products, ${inv.collectionHandles.size} collections.`
  );
  lines.push('');
  lines.push(
    `**${buckets.broken.length}** broken · **${buckets.suspicious.length}** suspicious · ${buckets.ok.length + buckets.info.length} clean · ${buckets.sentinel.length} sentinel${buckets.sentinel.length === 1 ? '' : 's'}`
  );
  lines.push('');

  if (buckets.broken.length) {
    lines.push('## 🔴 Broken (will 404 for customers)');
    lines.push('');
    for (const b of buckets.broken) {
      lines.push(`### \`${b.url}\``);
      lines.push(`**Why:** ${b.reason}`);
      lines.push('');
      lines.push(`**Used in ${b.locs.length} location${b.locs.length === 1 ? '' : 's'}:**`);
      for (const loc of b.locs) {
        const where = loc.line
          ? `\`${loc.file}:${loc.line}\``
          : `\`${loc.file}\` → ${loc.context}`;
        lines.push(`- ${where}`);
      }
      lines.push('');
    }
  }

  if (buckets.suspicious.length) {
    lines.push('## 🟡 Suspicious (verify manually)');
    lines.push('');
    lines.push(
      "These couldn't be verified via the API (audit app lacks pages/articles/menus scope). Most are likely fine, a few may have rotted. Confirm in admin or update `KNOWN_PAGE_HANDLES` / `KNOWN_BLOG_HANDLES` in the audit script."
    );
    lines.push('');
    for (const b of buckets.suspicious) {
      lines.push(
        `- \`${b.url}\` — ${b.reason} (${b.locs.length} usage${b.locs.length === 1 ? '' : 's'})`
      );
    }
    lines.push('');
  }

  if (buckets.sentinel.length) {
    lines.push('## ⚙️ Dynamic sentinels (intentional)');
    lines.push('');
    for (const b of buckets.sentinel) {
      lines.push(`- \`${b.url}\` — ${b.reason}`);
    }
    lines.push('');
  }

  if (
    buckets.broken.length === 0 &&
    buckets.suspicious.length === 0
  ) {
    lines.push('## ✅ No broken or suspicious links found');
    lines.push('');
    lines.push('Every internal link resolves to a real Shopify resource or a known route.');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    `<sub>Generated by \`.github/audit/internal-links.js\`. Re-run via the **Link audit** workflow's "Run workflow" button. To add a known page or blog handle to the allow-list, edit \`KNOWN_PAGE_HANDLES\` / \`KNOWN_BLOG_HANDLES\` in the script.</sub>`
  );

  return {
    markdown: lines.join('\n'),
    brokenCount: buckets.broken.length,
    suspiciousCount: buckets.suspicious.length,
  };
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

async function main() {
  let inv;
  try {
    inv = await fetchInventory();
  } catch (e) {
    console.error('Shopify API failed:', e.message);
    process.exit(2);
  }

  const files = listThemeFiles();
  const findings = [];
  for (const f of files) findings.push(...scanFile(f));

  const { markdown, brokenCount, suspiciousCount } = emitReport(
    findings,
    inv,
    files.length
  );

  // Write outputs for the workflow
  try {
    fs.writeFileSync('/tmp/link-audit-report.md', markdown);
    fs.writeFileSync(
      '/tmp/link-audit-summary.json',
      JSON.stringify(
        {
          brokenCount,
          suspiciousCount,
          generatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
  } catch (e) {
    // /tmp may not be writable in some sandboxes - non-fatal.
    console.error('Note: could not write /tmp outputs:', e.message);
  }

  console.log(markdown);

  process.exit(brokenCount + suspiciousCount > 0 ? 1 : 0);
}

main();
