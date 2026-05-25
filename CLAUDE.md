# theINmag Shopify Theme - CLAUDE.md

This file is read by Claude Code at the start of every build session. Keep it under 800 words - every word costs context tokens. Update when decisions change. A stale CLAUDE.md is worse than none.

---

## Project

Migrating theINmag (theinmag.com.au) from Wix to Shopify during housesit starting May 1 2026.
Base theme: Dawn (clean install, version controlled in this repo).
Brand: Australia's magazine made by kids, for kids. 100% kid-created, ad-free, sustainably printed.
Hero headline (LOCKED): "The magazine for creative kids" with subhead "Where Aussie kids get published - no ads, just creativity". Full hero spec in `homepage-build-spec.md`.
Three goals: (1) lift conversion from 6% to 8-10%, (2) increase professionalism and joy, (3) offer more products with easier purchase paths.
Critical deadline: site live before mid-June 2026 (Queensland trip + Dept of Education promo).

---

## Current build state (as of 25 May 2026)

Canonical sources: read `../theinmag-docs/build-state.md` (the "you are here" snapshot) AND `../theinmag-docs/pre-launch-roadmap.md` (the staged where-we-are / how-far-to-go status) at session start. Theme: **Dawn `185478775100` is LIVE/published** (Horizon unpublished, rollback; password protection ON until DNS-switch launch). Snapshot:

- **Stages 1-7, 13 DONE.** Membership PDP, Build a Bundle, Single Issue PDPs, /shop (Session 1), Cart, Checkout, Filemonk digital delivery all live. Mags (Mag01-Mag10) + Digital Stack + Snack Pack share ONE template `templates/product.single-mags.json` (loops `single-issues`, swaps client-side - do NOT make per-mag templates).
- **Membership:** Combo CUT from launch (Print/Digital only). **Rolling subscription LIVE** via Appstle (billing realigned to drop-1st each cycle; see `new-issue-release-checklist.md`).
- **Gallery LIVE:** `/pages/gallery` reads a Cloudflare Worker feed (`/gallery-data.json`). Ingestion pipeline = `theinmag-gallery-sweep` Cloudflare cron Worker (replaced Make.com). Moderation via the ANCHOR Worker (`theinmag-gallery-review`). 1,623 `gallery_submission` metaobjects live.
- **Also live:** Freebies (`/pages/freebies`, 35 freebies), Partnerships form, Stockists (9, daily sync), About, 3 of 4 audience pages (Parents/Teachers/Homeschoolers).
- **Cadence:** Rolling members billed the **1st** of Feb/Jun/Oct; mags posted the **10th**, delivered ~the **15th** (Mag10 = billed Jun 1 / posted Jun 10 / arrives ~Jun 15). Don't conflate billing (1st) with delivery (~15th).
- **Next / open (launch-blocking):** /shop Session 2 closers · Stage 12 (Snack Pack bundle + Locations) · schools Order Printer + e2e test · policy pages · 404 branded · AEO pass · URL redirects · subscriber migration · DNS cutover. **For Kids + Media pages, Stage 8/11/14, Combo = post-launch.** Full list in `pre-launch-roadmap.md`.

---

## Reference files (read these first)

The master design reference lives in the sibling `../theinmag-docs/` repo. Read it before any design or content decision:

- **`../theinmag-docs/theinmag-design-system.md`** — **THE primary design reference.** ~18,000 words across 9 sections: brand DNA + voice + tiers, system primitives (code-grounded tokens), page anatomy, cornerstone deep dives, signature moves, **§6 the 28-archetype prescriptive library** (the lookup when building a new section), §7 31-question decision tree, §8 anti-patterns, §9 maintenance protocol. **Walk §7 → §6 → build → §7 Q24-31 quality bar before ship.** Created 2026-05-13.
- **`../theinmag-docs/theinmag-pattern-library.md`** — code-level companion. Schema gotchas, Liquid recipes, JS patterns, section catalog with file paths. Cross-referenced from §6 archetypes for implementation specifics. Read before pushing a new section file.

The brief and sitemap live in the Claude Project knowledge (sitemap also at `../theinmag-docs/theINmag_Sitemap_v2_2.md`). Reference them when needed.

**Deprecated** (superseded by `theinmag-design-system.md`, kept on disk for historical reference only):
- `../theinmag-docs/theinmag-design-tokens.md`
- `../theinmag-docs/theinmag-design-principles.md`
- `../theinmag-docs/theinmag-page-playbook.md`

Don't read the deprecated three unless explicitly asked. Their values may drift from the master doc; the master doc was rebuilt from observed CSS 2026-05-13 and is the source of truth.

---

## Brand fundamentals (locked, do not deviate)

- "Creation" not "work" everywhere - a girl in a school said "art is not work" and that's brand-defining.
- No em dashes anywhere. Hyphens only. Em dashes are an AI tell.
- Smart brevity. Short sentences. Guy Raz / Axios newsletter energy. Professional friend tone.
- Sentence case headings. Brand name "theINmag" keeps its specific casing - the IN stays capitalised.
- Never collect contactable details from kids. Adults only on every form.
- Never use "subscription" in product names. The recurring product is "theINmag Membership."
- Real kid creations are the design system. Named attribution always: "Maya, age 9 - Fremantle WA."

---

## Type system

- Headings: Post Regular (self-hosted from /assets/, Pixel Surplus Web Font Licence purchased May 3 2026, $64 USD, 0-10k pageviews/month tier, designer Javier Guaschetti, licence proof in Drive: Website design / Shopify Assets / 23. theINmag - Licences / POST/).
- Body: Inter (Google Fonts, weights 400/500/600/700, Latin subset only).
- Emphasis spans (rare): Caveat (Google Fonts).
- Wordmark: SVG asset, not a font.
- Full type spec in design tokens.

---

## Colour system

- Six colour pairs (purple / coral / peach / mint / cream / sky) - every section uses a pair, light background + dark companion. Mixing companions across pairs breaks the system.
- Yellow (#F9C23C) is a stamp colour only - CTAs and badges, never a background field.
- All pairings pre-validated to WCAG AA contrast minimum. Ryan is colourblind - accessibility-first colour decisions are a feature.
- Full hex codes and contrast ratios in design tokens.

---

## Code conventions

- All custom sections: `theinmag-` prefix on filenames and CSS classes.
- CSS: custom properties only - no hardcoded colour values. Reference design tokens.
- Mobile-first always. Test on actual Pixel 6 before desktop. Never just desktop browser simulator.
- Never edit `theme.liquid` directly.
- All custom CSS in section-level Custom CSS boxes or `assets/theinmag-base.css`.
- All animations respect `prefers-reduced-motion`.
- Image alt text: always descriptive, always keyword-aware.

### Shopify CLI ops rules (locked 12 May 2026 after a real incident)

- `shopify theme push` runs from inside `theinmag-dawn/` cwd ONLY. Never from the parent folder. From the wrong cwd, the command silently DELETES the targeted file from the live theme.
- Single `--only` flag per command. Multiple `--only` flags in one command are unreliable.
- After every push, verify with `shopify theme pull --only [filename]` to confirm the file landed.
- If you're not sure which directory you're in, run `pwd` first.

See `../theinmag-docs/theinmag-shopify-bible.md` Part 14B for the failure-mode details and recovery procedure.

---

## AEO requirements (every page)

- H2 headings phrased as questions.
- FAQPage JSON-LD schema on all pages with FAQ content.
- Article schema on all blog posts with named author and Organisation.
- Organisation + Person schema on homepage and Our Story.
- BreadcrumbList schema on all pages.
- llms.txt at /llms.txt.
- robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended.

---

## Safety rules

- Always work on local draft via `shopify theme dev` - never the published theme.
- Push themes as unpublished only.
- Commit to GitHub before every session. One safe checkpoint per session start.
- Never delete files without explicit instruction from Ryan.
- Never modify `config/settings_data.json` without explicit instruction.
- Ryan is new to Terminal - assume nothing. One command at a time, never chained.

---

## Key integrations (configured during build)

Judge.me / Sky Pilot / Klaviyo / Make.com / JotForm / AusPost API / GA4 / Lucky Orange / Printful

---

## Never do

- Edit `theme.liquid` directly.
- Hardcode colour values.
- Add any app without checking PageSpeed Insights first (target 70+ on mobile).
- Lead with curriculum instead of creativity in any copy.
- Use em dashes.
- Use yellow as a background field.
- Mix colour pair members across pairs.
- Show specific addresses or real-time location of Ryan and Tam (regional + monthly only).
- Collect contactable details from kids.
- Use "Subscription" or "Letterbox Drop" in product names - it's "Membership."

---

## Session start checklist (every time)

1. Verify `theinmag-dawn/` git is clean and on `main`. Claude Code drives commits and pushes from here forward (origin: github.com/theINmag/theinmag-dawn). Commit at meaningful checkpoints, push at session end.
2. Track exchange count, flag at 12 of 15 max - break to fresh chat at the limit.
3. Confirm one specific task for this conversation.
4. Confirm prompt specificity before writing any code.
5. **Read `../theinmag-docs/theinmag-design-system.md` at the start of every new page or section session.** §1–§3 for foundation, §4 to identify which cornerstone the new work derives from, §5 for signature moves, **§6 for the prescriptive archetype recipe**, §7 for the build-time decision tree. Walk §7 questions in order before writing a section.
6. **Read `../theinmag-docs/theinmag-pattern-library.md` before any new work.** It catalogues every section + snippet, captures mobile patterns / Liquid / JS / schema gotchas, and holds page recipes. Run `git log --oneline -10` and compare to its Maintenance log — if commits exist that aren't logged there yet, integrate them into the doc before starting new work, and add a fresh log entry at session end.
7. Read page-specific specs when working on those pages: `../theinmag-docs/homepage-build-spec.md`, `../theinmag-docs/blog-post-build-spec.md`, `../theinmag-docs/membership-pdp-copy.md`, etc.

---

*CLAUDE.md last updated: 25 May 2026 - "Current build state" snapshot refreshed (Stages 1-7 + 13 done; Combo cut; Rolling subscription live; gallery + freebies + 3 audience pages live; Dawn theme `185478775100` published; drops on the 1st). Read build-state.md + the rewritten pre-launch-roadmap.md for the staged status. Prior: May 13 2026 - Reference-files section rewritten around the new master design system doc `../theinmag-docs/theinmag-design-system.md` (~18,000 words, 9 sections including a 28-archetype prescriptive library + 31-question decision tree). Supersedes `theinmag-design-tokens.md`, `theinmag-design-principles.md`, `theinmag-page-playbook.md` (deprecated, kept on disk for history). Pattern library stays alive as code-level companion. Workflow when building a new section: walk §7 decision tree → land on §6 archetype → use recipe + parent reference → §7 Q24-31 quality bar before ship. May 12 2026 - Membership PDP Stage 2a-2d snapshot added under "Current build state" (next target = Stage 2e Judge.me reviews; locked section order hero → ugc → pillars → pull_quote → reviews → faq → cross-sells). New "Shopify CLI ops rules" subsection under Code conventions captures the 12 May incident — push from inside `theinmag-dawn/` only (parent cwd silently DELETES the file from the live theme), single `--only` per command, verify with a pull after every push. May 8 2026 - planning docs split out of the theme repo into the sibling `../theinmag-docs/` folder so this repo contains only theme code. All companion-file references in this doc, plus comment-block spec pointers in section/snippet files, now use `../theinmag-docs/` paths. The `_tools/` build scripts (`build-competitions-data.py`, `audit-competitions.py`) were patched to know about the sibling layout (DOCS_ROOT for inputs/audit-outputs, THEME_ROOT for theme-bound outputs). Theme-code-only contents: assets/ config/ layout/ locales/ sections/ snippets/ templates/ + this CLAUDE.md, LICENSE.md, README.md, translation.yml, release-notes.md, .gitignore, .prettierrc.json, .theme-check.yml, .vscode/, .github/. Earlier (May 7): page-playbook added to companion files + session-start step 5; playbook is the "before any new page" doc anchored to homepage / competitions / field notes as the quality bar (send-in is pattern source, NOT a quality reference). Fonts locked (Post Regular + Inter). Hero headline locked: "The magazine for creative kids". Claude Code commits/pushes from here forward.*