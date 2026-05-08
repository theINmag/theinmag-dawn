# theINmag Build - Session Log
### Dated summaries of every working session
*Started: May 6 2026*

Append a 3-5 line entry at the end of every working session. Newest at top. This is the lightweight "what did I do today" log — the journal is for architectural decisions, this is for the time-stamped narrative.

---

## May 8 2026 - Field notes v3 follow-up + header dropdown fix
- Defined 6 article metafields in admin via Chrome MCP (`faq_items`, `closing_cta_label`/`url`, `cover_image_alt`/`caption`, `inline_cta_items`). Wired in-post FAQ accordion + FAQPage JSON-LD reading `article.metafields.field_notes.faq_items`. Heading "Got questions?", centred, no top rule.
- Byline architecture split: visible byline keeps Ryan G./Tam B. (section settings); JSON-LD Person uses legal name (Ryan Gow/Tam Gow) + `@id` anchored to `/our-story#ryan` and `#tam` for entity consolidation. New `{ryan,tam}_legal_name` + `_person_id` section settings cover both.
- Action 5 reverted: splitting `templates/article.json` into a named variant silently broke every existing post (all fell back to Dawn-stock layout). Restored the default to wire `theinmag-article`. Saved as memory.
- Header INfo dropdown was being clipped behind the hero. Root cause: Dawn's `.shopify-section-group-header-group { z-index: 4 }` overrode our single-class section CSS in the cascade. Fix: 2-class specificity `.shopify-section.theinmag-header-section` + `isolation: isolate` + `overflow: visible`. Also added "Competitions for Kids" as first item in INfo dropdown linked to `/pages/competitions`.
- Doc updates: `blog-post-build-spec.md` got the inline-CTA-off rule (Field Notes never carries inline CTAs) + SEO writing-session rule (two meta description drafts per post, 150-160 chars). `theinside-drafts/` renamed to `field-notes-drafts/` (18 files, history preserved via `git mv`). 3 memories saved (template split gotcha, theme dev schema cache, Dawn header-group z-index trap). Pushed `--theme=185478775100` clean.

---

## May 7 2026 - Contact page build
- Built `/pages/contact` end-to-end in one session. Four new sections (`theinmag-contact-hero`, `theinmag-contact-form`, `theinmag-contact-router`, `theinmag-contact-social`) + wired `templates/page.contact.json`.
- Form uses Shopify-native `{% form 'contact' %}` so submissions route to heyhey@theinmag.com.au via admin notification email. Three fields only (name / email / message), honeypot trap on `contact[website]`, success state replaces form with custom yellow-tick "Got it!" block in the same column slot.
- Verified locally on `shopify theme dev` (port 9292). Page returns HTTP 200, all four sections render, mailto link present, social URLs match brief.
- Outstanding from Ryan: drop `theinmag-van-contact.jpg` into `/assets/` (placeholder shows until then), set page title + meta description in admin Online Store → Pages → Contact, run a real form submission to confirm inbox routing.
- Two brief deviations flagged: success CTA URL points at `/blogs/field-notes` (the live blog handle since 2026-05-06) instead of brief's `/blogs/inside`; the visible label kept as "Read theINside" per brief copy. YouTube URL uses `@Branchingout-tnr` per brief, overriding the older `@theINmag/videos` in memory.
- Mobile viewport test pending — Chrome MCP couldn't emulate sub-1500px inner width. Desktop layout verified at 1512px; mobile rules are mobile-first defaults so should hold but Ryan should sanity-check on the actual phone.
- Pattern library §1.5 + §1.6 + §14 maintenance log updated.

---

## May 6 2026 - Consolidation session
- Reviewed scattered chat history May 1-3 across ~8 chats (most happening outside the project)
- Generated this consolidation: build-state.md, build-journal.md, session-log.md, subscriber-migration-plan.md, url-redirect-plan.md
- Confirmed all decisions still locked: hero copy, Membership naming, Pixel 6 testing, Post + Inter + Caveat fonts
- Flagged that brief v6 + sitemap v2.2 + updated tokens/principles need swapping into project files panel (manual step)
- No code changes today. All in-context, doc-only consolidation.
- **Files to update in project knowledge:** swap in v6 brief, swap in v2.2 sitemap (already done), swap in updated design tokens with locked Membership reference. Add the five new consolidation files.

## May 3 2026 - Homepage spec + brief v6 + design tokens lock
- Locked Post Regular + Inter + Caveat font stack across CLAUDE.md and design tokens
- Created `assets/theinmag-base.css` with `@font-face` for Post Regular and design token CSS variables
- Edited `layout/theme.liquid` to load Inter + Caveat (Google Fonts) and link to theinmag-base.css
- Visually verified fonts render correctly in browser preview
- Caught and resolved the duplicate Skeleton folder issue (wrong-theme download)
- Pushed Dawn theme to Shopify as unpublished (Horizon stays published, password-protected)
- Generated 6 updated docs in chat: brief v6, sitemap v2.2, design tokens, principles, homepage-build-spec, TOMORROW_PROMPT
- Locked file editing rule: always paste live file contents before find-and-replace
- Wrote homepage-build-spec.md — Sections 1-5 detailed (split-screen hero, products row, press band, audience tiles, founders + philosophy)
- Sections 6-15 of homepage TBD for next session

## May 2 2026 - Theme pull + dev server + GitHub
- Set up Shopify trial: Basic plan, theinmag.myshopify.com, AUD/Melbourne/kg, ABN, sender email = heyhey
- Pulled Dawn theme to `/Users/ryangow/theinmag-shopify/theinmag-dawn`
- Initialised Git repo, first commits, pushed to GitHub as private repo (account theINmag)
- Started local dev server: `shopify theme dev --store theinmag.myshopify.com`
- First Dawn render in browser confirmed at `http://127.0.0.1:9292`
- Saved baseline screenshot of "Dawn before any theINmag changes"

## May 1-2 2026 - Wix data backup + URL audit
- Drive folder structure created: `Shopify Assets / 22. Wix Export` with 5 subfolders
- Wix products exported (34 products) — saved to `1. Products/`
- Wix customers exported (4,358 contacts, 1,788 email subscribers) — saved to `2. Customers/`
- Wix orders: baseline screenshot only (412 orders / $27,079 / 30 days). Full export deferred to Matrixify.
- Wix blog confirmed empty — no migration
- URL audit spreadsheet built — 32 URLs mapped to Shopify equivalents with priorities
- QR code column added — physical QR codes can't be updated, those redirects are highest priority
- Subscriber discovery: under-1-year-old Wix store means everyone who bought is still active. Subscriber audit is critical pre-import.
- Decision: Matrixify for full migration (~$25 USD), not Wix native

## May 1 2026 - Stage 1 technical setup
- Installed Node.js v24.15.0
- Installed Shopify CLI 3.94.3 via npm
- Installed Claude Code 2.1.126 via npm
- Installed Shopify AI Toolkit MCP via `claude mcp add` command — configured globally for every session
- Confirmed GitHub Desktop installed and signed in (account already existed, username theINmag)
- All five Stage 1 setup steps complete

---
