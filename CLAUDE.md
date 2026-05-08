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

## Reference files (read these first)

Three companion files live in this folder. Read them before any design or content decision:

- `theinmag-design-tokens.md` - colours, type, spacing, shadows, button specs, animation, image specs, brand language. The technical reference.
- `theinmag-design-principles.md` - the philosophy behind decisions. Read when judgment is needed (clarity vs personality, speed vs richness, etc.).
- `theinmag-page-playbook.md` - **the senior front-end designer's playbook for every new page.** Bridges principles to execution, anchored to the three hero pages (homepage, competitions, field notes). Read end-to-end at the start of every new page session. Treat those three pages as the quality bar; the send-in funnel is a recent build and a useful pattern source but is NOT at the same polish level — don't lift its visual register as a reference.

The brief and sitemap live in the Claude Project knowledge, not in this folder. Reference them when needed but they're not always loaded.

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
5. **Read `theinmag-page-playbook.md` end-to-end at the start of every new page session.** It's the bridge from principles → execution, anchored to the four hero pages we built at elite quality (homepage, competitions, field notes, send-in). Pre-build checklist, quality bar, anti-patterns, section starter templates all live here.
6. **Read `theinmag-pattern-library.md` before any new work.** It catalogues every section + snippet, captures mobile patterns / Liquid / JS / schema gotchas, and holds page recipes. Run `git log --oneline -10` and compare to its Maintenance log — if commits exist that aren't logged there yet, integrate them into the doc before starting new work, and add a fresh log entry at session end.
7. Read companion files (design tokens + design principles) when judgment is needed. Read `homepage-build-spec.md` when working on any homepage section, `blog-post-build-spec.md` when working on the article template.

---

*CLAUDE.md last updated: May 7 2026 - added page-playbook reference (companion files + session-start step 5). The playbook is the new "before any new page" doc, anchored to the three hero pages (homepage, competitions, field notes) as the quality bar. Send-in is a recent build and pattern source but NOT a quality reference. Pattern-library + tokens + principles still apply. Fonts locked (Post Regular + Inter), design audit complete. Hero headline aligned to homepage build spec ("The magazine for creative kids"). Git ownership note: Claude Code commits/pushes from here forward.*