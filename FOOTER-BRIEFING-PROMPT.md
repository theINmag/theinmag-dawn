# Claude Code Briefing Prompt - theINmag site-wide footer build
### Paste this at the start of a fresh Claude Code session
*Created: May 5 2026. Use after the homepage Section 10 FAQ session has been committed and pushed. Reference samples (Mintt Studio / Bobbie / OLIPOP footers) need to be dropped into the new session's project knowledge before the prompt is pasted.*

---

## How to use this file

1. Finish the current Claude Code session. Commit. Push to GitHub. Close the terminal session.
2. Open a fresh Claude Code session in the same repo.
3. Drop the three footer reference screenshots into the project knowledge:
 - `reference/footers/mintt-footer.png` (clean dark, typographic columns)
 - `reference/footers/bobbie-footer.png` (bold colour, email signup prominence)
 - `reference/footers/olipop-footer.png` (organic curve top, multi-column legal)
4. Paste everything below the divider as the opening message.

---

## The prompt itself (copy from here)

Hi Claude Code. We're building the site-wide footer for theINmag.

Before you write a single line of code, please do these in order:

**Step 1 - Read the spec docs.** Read these files in this exact order. Don't skip ahead. Don't skim:

1. `/Users/ryangow/.claude/projects/-Users-ryangow-theinmag-shopify/memory/MEMORY.md` and follow the links - especially Shopify schema gotchas, Liquid array index, Dawn empty-div hide, Files API for large media, theINmag socials.
2. `theinmag-dawn/CLAUDE.md` (the project brain - current state of the build, conventions, what's done)
3. `theinmag-dawn/theinmag-design-tokens.md` (colours, fonts, spacing, button specs - source of truth)
4. `theinmag-dawn/theinmag-design-principles.md` (the why behind every visual decision)
5. `theinmag-dawn/homepage-build-spec.md` - the **Footer** section near the bottom is the master spec. Read the full doc for context but the Footer section is the operative one.
6. `theinmag-dawn/templates/index.json` (current homepage section order so you understand the page the footer will sit beneath)
7. `theinmag-dawn/sections/header-group.json` and `theinmag-dawn/sections/theinmag-header.liquid` (the existing header is the closest pattern - inherit the typographic and spacing language)
8. The three footer reference screenshots in `theinmag-dawn/reference/footers/` (Mintt / Bobbie / OLIPOP)

Then run `git log --oneline -5` from `theinmag-dawn/` to confirm tree state.

**Step 2 - Tell me you've read them.** Once read, give a 4-5 sentence summary of: what the footer needs to do, what's locked vs flexible, what visual register inherits from the homepage, and which of the three reference samples informs which part of the build. If your summary doesn't match the docs we'll talk before any code gets written.

**Step 3 - Confirm the build order.** I think the build order should be:

1. Build the section file: `sections/theinmag-footer.liquid` (uses Dawn's footer-group.json or replaces it).
2. Wire it into `sections/footer-group.json` (replacing Dawn's stock footer the same way the header was replaced).
3. Custom CSS goes in `assets/theinmag-base.css` (footer-specific styles scoped to `.theinmag-footer-*`) OR in the section's own `{%- stylesheet -%}` block - your call, recommend whichever is cleaner.
4. Newsletter form: build a custom inline form posting to Klaviyo (NOT the Klaviyo popup - the popup gets removed in this session because the footer signup replaces it).
5. Test on Pixel 6 viewport (412px), then tablet (768px), then desktop (1440px).

Confirm this is the order, or propose a different one.

**Step 4 - Working rhythm we follow.**

- **One section at a time.** Build the footer Liquid file, push to unpublished theme #185478775100 on `theinmag.myshopify.com` (NEVER the published Horizon theme), I review on theme dev at 127.0.0.1:9292, we iterate, commit, push to GitHub.
- **For speculative experiments**, push to the unpublished theme without committing first. I eyeball, then commit only after I approve.
- **Treat `shopify theme dev` as the authoritative schema validator**, not `shopify theme push` - push will report success on schemas that dev catches.
- **One Terminal command at a time.** No `&&` chains. I'm new to Terminal.
- **Pixel 6 testing, not iPhone.** Real device, not just Chrome DevTools simulator.
- **No em dashes.** Anywhere. Hyphens only. Code comments, copy, theme editor labels, file names.
- **"Creation" not "work".** Sitewide locked decision.
- **All design tokens, no hardcoded values.** Every colour/spacing/font-size pulled from a CSS custom property defined in design tokens. If you're about to type `#5D3A7A`, stop and use `var(--color-purple-dark)` instead.
- **Stop me at 12 of 15 exchanges and break to a fresh chat.** Cap is a check-in trigger not a hard ceiling.
- **Confirm prompt specificity before writing code.** If a decision is ambiguous, ask before building.
- **Scan for kid-character placement opportunities** before writing code (per memory rule). Surface options before adding silently.

**Step 5 - Things that aren't your call.** A few decisions are locked. Don't propose changes to these unless I bring them up first:

- **Newsletter heading: "A monthly newsletter? Count me IN!"** (Post Regular, "IN" capitalised per brand pun)
- **Newsletter is the HEART of the footer** - prominent placement, replaces the Klaviyo popup, free e-mag delivered via Klaviyo welcome flow as signup incentive.
- **Background: inky purple-navy `#2A1F3D` with cream text.** This anchors the footer as a deliberate dark zone closing the page.
- **Nav columns (LOCKED order):**
 - Shop (links to /shop, list of product categories)
 - Who's it for? (Parents / Teachers / Homeschoolers / Kids - matches primary nav)
 - About (Our Story / Where we'll be next / Stockists / Schools / Contact)
 - Resources (Send IN / Gallery / Blog / Freebies)
- **Acknowledgement of Country:** preserved from current Wix site. Brief footer version surfaces above a link to dedicated `/acknowledgement` page with the full statement.
- **Social icons: Instagram, Facebook, YouTube** (URLs in memory under "theINmag socials"). Brand-coloured monochrome (cream on inky purple-navy), NOT platform default colours.
- **Legal links: Privacy Policy / Terms of Service / Refund Policy / Shipping Policy** (Shopify auto-pages, link to those URLs).
- **Copyright + ABN:** "© [current year] theINmag - made by Aussie kids, for Aussie kids" + ABN displayed beneath (per Australian small business compliance).
- **Padding: 4xl token (96px) desktop, 2xl (48px) mobile.**
- **"Made by kids, for kids" sticker** continues to be visible somewhere in the footer per existing brand convention (could be as a stamp adjacent to the wordmark / acknowledgement / signature line - your call).
- **Persistent CTA / sticker logos** stay top-left of the header on every page including pages with the footer.
- **No em dashes / "Subscription" / yellow as background field.** All the universal brand rules apply.

**Step 6 - Things you genuinely SHOULD push back on.** Where you have more expertise than me:

- **Klaviyo form integration.** If a custom inline form posting to Klaviyo's `/client/subscriptions` endpoint isn't the cleanest path, propose the right one. The Klaviyo popup gets removed regardless - the footer is the new signup surface.
- **Liquid block architecture.** If section blocks would let me reorder the columns / add a column without code edits, push that.
- **Mobile stacking order.** Newsletter at the top of the footer on mobile (not buried below nav links) per spec, but the rest of the order is your call.
- **Acknowledgement placement.** Spec says "above the link" but where exactly in the visual stack reads best is your call.
- **Performance.** Self-host any social SVGs rather than loading from external sources. Lazy-load decorative images.
- **Schema.** If the Organisation schema rendering in the footer needs tweaking for AEO, fix it. Sitelinks Searchbox JSON-LD is also worth considering on the newsletter form per the original spec.
- **Accessibility.** Form labels (visible or sr-only), keyboard nav for the social icons, focus states on all links and the submit button. Fix and tell me what you did.
- **Decorative shape language.** OLIPOP uses an organic curved top edge. theINmag's hand-drawn brand could earn a similar move (torn-paper edge or wave) - propose if it adds, skip if it's noise.

**Step 7 - Things still pending and we'll handle later.**

- **Klaviyo list ID** for the welcome flow / free e-mag - I'll provide once Klaviyo is wired up. For now, build the form pointing at a placeholder list ID you can swap.
- **Welcome flow copy** for the e-mag delivery - separate Klaviyo session.
- **Real ABN** - I'll provide for the copyright line.
- **`/acknowledgement` page** - separate page build, just link to it from the footer.
- **Custom social SVG icons** - if existing assets in `/assets/` don't fit, mock with simple SVG inline and I'll source proper assets after.

**Step 8 - Reference materials.**

Three footer reference screenshots are in `theinmag-dawn/reference/footers/`:

1. **Mintt Studio** (clean dark) - inherit the **column rhythm** and **typographic hierarchy** (caps headers, generous whitespace between columns). Don't inherit the small-tagline-next-to-logo layout - theINmag's signature is the made-by-kids sticker.
2. **Bobbie** (bold colour) - inherit the **email-signup prominence** (right-aligned on desktop, large-format input + pill button) and the **confident colour-as-background** approach. theINmag's inky purple-navy background plays the same role Bobbie's green plays.
3. **OLIPOP** (organic curve top) - inherit the **bottom-bar treatment** (copyright on left, multiple legal links inline on right) and consider the **organic top edge** as a transition from the FAQ section above. The B-Corp badge slot is also useful - we don't have B-Corp but we could use the slot for "Printed sustainably in Melbourne" or similar trust stamp.

Note: the existing `sections/theinmag-header.liquid` is the strongest in-repo reference. Footer should feel like the header's tonal counterweight - same typography family, same button language, same dark-zone palette.

**Step 9 - Skills (optional, decide together at the start).**

I want to talk about adding Skills before we build. Candidates I'd consider:

- A frontend / UI-UX skill for the layout work
- A Shopify Liquid / Online Store 2.0 skill for the section file architecture
- An accessibility skill for a11y review (especially the form)

Two or three max. Tell me which (if any) make a real difference for this build.

**Step 10 - Communication style I prefer.**

- Direct opinions with reasoning attached. "I'd do X because Y" beats "we could do X or Y, what would you prefer?"
- Push back when I'm wrong.
- Friend voice, not corporate. No "I'd be happy to help!"
- Smart brevity. Don't over-explain.
- No em dashes (chat AND code).

**Step 11 - Session limits.**

- I track exchanges. Flag at 12 of 15 max so we can wrap cleanly before context degrades.
- One specific task per session. This session = build the footer (section + snippets + form + CSS + wire-in). Klaviyo flow content, real ABN, social SVG sourcing, `/acknowledgement` page = separate sessions.
- Before we end the session: commit, push, write a one-line CLAUDE.md update if anything locked changes.

That's the brief. Take a moment to read the docs, then come back with your summary in Step 2.

---

## After the session

When the build session ends:

1. Confirm everything committed and pushed (Ryan does this manually - or Claude Code drives commits per CLAUDE.md).
2. Update CLAUDE.md only if a locked decision changes (otherwise the commit message captures the work).
3. Test the live unpublished theme on Pixel 6 separately.
4. Note small fixes for next session - DON'T spawn a fresh session to fix them immediately. Batch them.

The discipline that makes this work: one session, one task, clean handover.
