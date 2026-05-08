# theINmag Pattern Library
### The how-to-build doc for everything in this theme
*Created 2026-05-07. Living document — update at the start of every session before any new work begins.*

---

## How to use this doc

This is the fourth foundation doc in `theinmag-dawn/`. Read it cold before any build session. It covers **how to assemble** — what already exists, which patterns to reuse, which gotchas have already cost time. The other three docs cover different ground:

| Doc | What it covers | When to read |
|---|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Project brain, locked brand rules, session-start checklist | Always loaded — read every session start |
| [`theinmag-design-tokens.md`](theinmag-design-tokens.md) | Hex codes, font sizes, spacing, button specs | Any visual decision needing exact values |
| [`theinmag-design-principles.md`](theinmag-design-principles.md) | The WHY behind every decision | Judgment calls, design tradeoffs |
| **`theinmag-pattern-library.md`** (this doc) | Section catalog, mobile patterns, Liquid/JS recipes, page recipes | Every build session, keep open while working |

**Don't duplicate the other three.** This doc references them but doesn't rehash hex codes (tokens) or philosophy (principles). It maps **the how**.

### Update protocol

Every new session starts with: read this doc, then check `git log --oneline -10` against the **Maintenance log** at the bottom. Anything new since the last entry → integrate it before any new work. Patterns that proved useful, sections that got built, gotchas that cost time, brand decisions that landed — all go in here. After the session's main work is done, log the session in the Maintenance log.

A new entry deserves a slot if it would help a future session. Tweaking copy in an existing section doesn't qualify. Building a new section, discovering a new pattern, or revising a brand-locked rule does.

---

## Table of contents

1. [Section catalog](#1-section-catalog)
2. [Snippet catalog](#2-snippet-catalog)
3. [Mobile playbook](#3-mobile-playbook)
4. [Liquid patterns](#4-liquid-patterns)
5. [JS patterns](#5-js-patterns)
6. [AEO / schema patterns](#6-aeo--schema-patterns)
7. [Editorial voice quick reference](#7-editorial-voice-quick-reference)
8. [Brand-locked decisions](#8-brand-locked-decisions)
9. [Kid pattern library (use kid creations as the design system)](#9-kid-pattern-library)
10. [Page recipes](#10-page-recipes)
11. [Open systems / WIP](#11-open-systems--wip)
12. [Code conventions](#12-code-conventions)
13. [Session-start protocol](#13-session-start-protocol)
14. [Maintenance log](#14-maintenance-log)

---

## 1. Section catalog

Every section file in `sections/` with a `theinmag-` prefix. Use this as the index when planning a page. Status: ● live, ◐ partial/wip, ○ archived.

### 1.1 Site chrome

| Section | Status | Where used | Notes |
|---|---|---|---|
| `theinmag-announcement-bar.liquid` | ● | site-wide (header-group) | Purple band ("GET READY — Mag10 dropping in 34 days · Free shipping over $40"). Not sticky — scrolls away naturally. Class `theinmag-announcement-section`. |
| `theinmag-header.liquid` | ● | site-wide (header-group) | Cream nav bar with sticker logo, INfo dropdown, Gallery, Field notes, Freebies, wordmark, cart, SEND IN CONTENT button. **Sticky lives on `.theinmag-header-section` (the schema-class wrapper), not on `.theinmag-header` itself** — `.theinmag-header` is `position: relative` inside the wrapper with cream bg. Important when applying transforms (see §3.3). |
| `theinmag-footer.liquid` | ● | site-wide (footer-group) | Newsletter signup + brand stack. Maude-influenced. |

### 1.2 Homepage sections

| Section | Status | Notes |
|---|---|---|
| `theinmag-hero.liquid` | ● | Locked headline "The magazine for creative kids" / sub "Where Aussie kids get published — no ads, just creativity". Split-screen + sticker. Tier 1 conversion surface. |
| `theinmag-hero-v1-archived.liquid` | ○ | Earlier hero pass. Don't delete (per CLAUDE.md "never delete without instruction"). Don't reference. |
| `theinmag-mission.liquid` | ● | "Made by kids, for kids" mission band with three product cards (Membership / Single issue / Build a bundle). **Reference for the kid-character random-of-three + scroll-pop pattern** (see `reference_kid_character_pattern` memory). |
| `theinmag-meet-tam.liquid` | ● | Founder section. Coral pair. |
| `theinmag-philosophy.liquid` | ● | Brand philosophy band. |
| `theinmag-audience-tiles.liquid` | ● | Four-up audience pillars (Parents / Teachers / Homeschoolers / Kids). |
| `theinmag-press-band.liquid` | ● | Press logo strip. |
| `theinmag-reviews.liquid` | ● | Continuous-dots pattern across into Meet Tam. Coral. |
| `theinmag-faq.liquid` | ● | Locked Q+As, accordion, FAQPage JSON-LD. |
| `theinmag-blog-feed.liquid` | ● | Four-up post card row anchoring the homepage to field notes. Audience chips filter cards in-place via JS (no nav). |

### 1.3 Blog space sections (`/blogs/field-notes`)

| Section | Status | Notes |
|---|---|---|
| `theinmag-blog-index-editorial.liquid` | ● | Top of blog index. Maude-style asymmetric grid: feature card + 2/3 left col (large + bottom-small) + 1/3 right col (small cards, parallax-translated on desktop ≥990px). Mobile: feature flush to header, intro reorders below feature, right col → horizontal scroll rail (see §3.4). Audience toggle (all/kids/adults) broadcasts via localStorage + `field-notes:audience-changed` event. |
| `theinmag-blog-index-feature-banner.liquid` | ● | Mid-blog-index Maude-style side-to-side photo with white text card. Audience-aware (responds to toggle). |
| `theinmag-blog-index-archive.liquid` | ● | Bottom of blog index. Search bar + 2-row scrollable rail of every published article. Live filter on title/topic/tags/excerpt. Falls back to `archive_card` block presets when no real articles exist. Top decorative kid-art (mint flower) anchored top-center. **Mobile: flower scales to 180% width with `top left` position, gradient fade pushed to 75-105vw.** |

### 1.4 Article template

| File | Status | Notes |
|---|---|---|
| `theinmag-article.liquid` | ● | Single-post template wired via `templates/article.json`. Two-column sticky hero (image left sticky, body right scrolls). Headroom site-header auto-hide. Quick read card (white tile, narrower than body, pulled from metafield). Top byline meta. About-author card with avatar+identity row + full-width bio. "Here's some more we thought you might enjoy" rec strip with 4-card waterfall (curated metafields → topic-match → recent → 4 placeholder cards). See [§9.4](#94-worked-recipe-single-article).

### 1.5 Custom page templates

| Section | Status | Notes |
|---|---|---|
| `theinmag-send-in-hero.liquid` | ● | Section 1 of `/pages/send-in`. Caveat eyebrow + Post Regular H1 + Inter subhead + one focused kid creation/character with named attribution + yellow sticker CTA anchored to `#send-in-form`. CTA scroll uses sticky-header-aware `scrollTo` ([§5.5](#55-sticky-header-aware-scrollto)). **Page-level JSON-LD** (BreadcrumbList Home → Send IN, plus WebPage with `mainEntityOfPage`) lives at the bottom of this section file because the hero is always present. Background `#FDFAF5`. |
| `theinmag-send-in-inspiration.liquid` | ● | Section 2 of `/pages/send-in`. Open masonry grid (no accordion, no category labels) of 8-12 real kid creation tiles via repeating `creation_tile` block. Layout uses CSS multi-column (2 / 3 / 4 cols across breakpoints) with `break-inside: avoid` for masonry without JS measuring. Tap-to-zoom inline lightbox: single overlay reused across tiles, ESC / outside-click / X to close, body-scroll lock, focus returns to the trigger. v1 ships with 8 placeholder blocks; **Phase 2** plan = auto-pull from gallery metaobjects (flagged in send-in brief). Background `var(--color-cream)` (`#FBF6EA`). |
| `theinmag-send-in-cycle.liquid` | ● | Section 3 of `/pages/send-in`. Single-row accordion (closed by default). Header is the question; panel reveals static wheel image (`assets/sendincontent_submissionwheel.jpg` per Ryan) alongside a soft three-paragraph explainer: "theINmag drops three times a year - Feb / Jun / Oct" + "submissions always open" + Membership-delivery angle. **Earlier build had dynamic "Mag XX, dropping DD Month YYYY" text** driven by an editor-set anchor + 120-day cutoff; Ryan pulled that on 2026-05-07 (too specific, creates a staleness risk if the anchor isn't bumped on release day). Reusable date-cycle pattern preserved at [§4.9](#49-liquid-cycling-drop-dates-from-an-anchor) for future surfaces. Background `#FDFAF5`. |
| `theinmag-send-in-form.liquid` | ● | Section 4 of `/pages/send-in`. JotForm jsform embed — script tag built from a `jotform_id` setting (default `232212492042848`). White card surface inside a cream section. Anchor ID `#send-in-form` plus `scroll-margin-top: 96px` so direct-link jumps clear the sticky header. `<noscript>` fallback links to JotForm directly. Background `var(--color-cream)`. |
| `theinmag-send-in-tips.liquid` | ● | Section 5 of `/pages/send-in`. Same accordion mechanics as the homepage FAQ (max-height transition + caret rotation). 8 default tip blocks via preset; kid-direct voice; quietly raises quality and reduces vetting (no faces, no traced work, full-quality images). No kid character. Background `#FDFAF5`. |
| `theinmag-send-in-faq.liquid` | ● | Section 6 of `/pages/send-in`. Mirrors `theinmag-faq.liquid` accordion + FAQPage JSON-LD but scoped to its own data attributes (`data-theinmag-send-in-faq`) so it can coexist with the homepage FAQ. 9 default Q+As via preset, no kid character, no contact CTA. Background `var(--color-cream)`. |
| `theinmag-competitions.liquid` | ● | Single-section page wired via `templates/page.competitions.json` (handle `/pages/competitions`). **Quiz-gate UX**: lands the user on a full-screen choice screen with three portrait tiles (art / writing / everything), each rendering a random kid character from the 13-image pool. After a tile click, the gate animates out (`is-leaving`) and the static stage reveals. Stage = 100vh both mobile and desktop, internal scroll on the list, 3-card "top picks" rotation (10s crossfade). On mobile: stage flattens via `display: contents` so featured-pick → filter → list flow as flex-ordered children; missed-a-comp card moves outside the stage to sit just above the footer transition. **Data**: 65 comps in `competitions-database.csv`; `_tools/build-competitions-data.py` regenerates `snippets/theinmag-competitions-data.liquid` (parallel arrays) + `assets/competitions.json` (canonical record). **Logos**: per-comp logo files live in `assets/logos/<id>.<ext>`; section renders `<img>` when present, falls back to a category-coloured letter placeholder when not. **Modal**: adult-only suggest-a-comp form with a kid character picked from the same pool when the modal opens (slight wobble). **JSON-LD**: ItemList of 65 Events + BreadcrumbList + FAQPage. **SEO**: visually-hidden H1 + intro paragraph carry the keyword load; visible page is intentionally minimal. |
| `theinmag-contact-hero.liquid` | ● | Section 1 of `/pages/contact`. Short lavender band (purple pair light bg + dark companion). H1 "Get IN touch" + subhead "We read every message. Usually reply within 2 business days." Caps at ~30vh desktop, less on mobile so the form below is the page's centre of gravity. **Page-level JSON-LD** (BreadcrumbList Home → Contact + WebPage) lives at the bottom of this file. Background `var(--color-lavender)` (`#E8DEEF`). |
| `theinmag-contact-form.liquid` | ● | Section 2 of `/pages/contact`. Two-column on desktop (form 55% left, image 45% right); single column mobile-first. Uses Shopify-native `{% form 'contact' %}` so submissions route to the store's notification email (heyhey@theinmag.com.au). Three fields only: `contact[name]` / `contact[email]` / `contact[body]`. Honeypot is `contact[website]`, visually-hidden + JS submit guard. **Three states**: default form / `form.errors` (errors above, form preserved via `form.name|email|body`) / `form.posted_successfully?` (form REPLACED with thank-you block in same column - yellow circle+tick SVG, "Got it!", primary CTA, "Send another message" link back to `page.url`). Image column uses image_picker first, falls back to `image_filename` (default `theinmag-van-contact.jpg`), final fallback is a styled lavender placeholder shown via JS `onerror`. Background `var(--color-cream)`. |
| `theinmag-contact-router.liquid` | ● | Section 3 of `/pages/contact`. Soft helper - three white tiles (schools / stockists / partnerships) with chevron arrows. NOT a hero; quiet bg `#FDFAF5`. All three target pages don't exist yet (May 2026); links wired anyway per build list. |
| `theinmag-contact-social.liquid` | ● | Section 4 of `/pages/contact`. The "Come hang with us!" POP moment. Three big tappable buttons (min-height 64px mobile / 72px desktop) filled with brand-companion darks: Instagram = `--color-purple-dark`, Facebook = `--color-teal-dark`, YouTube = `--color-sage-dark`. White Post Regular platform name + Inter handle. All open in new tab. Bg `#FDFAF5` so the saturated buttons carry the colour work. URL defaults stored as `text` settings (NOT `url` type - schema gotcha §4.5 - `url` defaults must be Shopify datasource paths). |

### 1.6 Templates

| Template | Type | Notes |
|---|---|---|
| `templates/index.json` | Homepage | Stitches all homepage sections together. |
| `templates/blog.json` | Blog index | Editorial → feature banner → archive. |
| `templates/article.json` | Article | Single section: `theinmag-article`. No blocks. |
| `templates/page.json` | Generic page | Default Dawn template, not yet customised. |
| `templates/page.contact.json` | Contact page | Wires the four `theinmag-contact-*` sections in order: hero → form → router → social. Handle `/pages/contact`. The simplest page on the site - single primary action is "send us a message", everything else is supporting. |
| `templates/page.send-in.json` | Send IN page | Wires the six `theinmag-send-in-*` sections in order: hero → inspiration → cycle → form → tips → faq. Handle `/pages/send-in`. Submission funnel — every "Send IN" CTA across the site lands here. |

---

## 2. Snippet catalog

| Snippet | Used by | Notes |
|---|---|---|
| `theinmag-editorial-card.liquid` | `theinmag-blog-index-editorial`, `theinmag-blog-index-feature-banner` | Single card renderer. Variants: `feature` (full-width photo with white-text overlay + scrim), `large_left`, `right_small`, `bottom_small`. Inputs: `block` (Shopify block) + `variant`. |
| `theinmag-article-rec-card.liquid` | `theinmag-article` | Single rec card for the "more for you" strip. Inputs: `rec` (Article object, required) + `blurb` (string, optional). Strips trailing period from `rec.title` for display (see [§4.1](#41-strip-trailing-period-from-lowercase-headings)). |
| `theinmag-competitions-data.liquid` | `theinmag-competitions` | **Auto-generated** by `_tools/build-competitions-data.py` from `competitions-database.csv`. Defines parallel arrays (`comp_ids`, `comp_names`, `comp_pitches`, `comp_logos`, etc.) keyed by index, plus `spotlight_ids` (locked 3-card editor-curated rotation, see [§8 brand-locked](#8-brand-locked-decisions)). Uses `include` (NOT `render`) on the consuming side so the arrays stay in scope. Pipe (`\|`) is the row delimiter; the script asserts no source field contains a pipe. **Re-run the script after any CSV edit OR any new logo file.** Logo files are auto-discovered by ID match in `assets/logos/`. |

---

## 3. Mobile playbook

theINmag is mobile-first. Expect breakpoints at **600px** (small mobile/tablet), **750px** (tablet), and **990px** (desktop). Below are the patterns that have already cost time at least once.

### 3.1 The specificity-prefix pattern (CRITICAL)

When a stylesheet has both desktop default rules AND a mobile media query in the same file, **source order matters when specificity ties**. If your `@media (max-width: 749px)` block sits BEFORE the desktop default rules in source, the desktop rules will silently win at the same specificity.

**Symptom**: Mobile override looks correct in DevTools but the desktop value is showing.

**Fix**: Bump the mobile rule's specificity by adding a parent-class prefix.

```css
/* WRONG — same specificity as desktop default later in file → desktop wins */
@media (max-width: 749px) {
  .theinmag-editorial__card--feature .theinmag-editorial__card-cover {
    border-radius: 0;
  }
}

/* later in file: */
.theinmag-editorial__card--feature .theinmag-editorial__card-cover {
  border-radius: 12px;  /* this wins despite being "default" */
}

/* RIGHT — parent prefix bumps mobile rule from 0,2,0 to 0,3,0 */
@media (max-width: 749px) {
  .theinmag-editorial__inner .theinmag-editorial__card--feature .theinmag-editorial__card-cover {
    border-radius: 0;
  }
}
```

**Rule of thumb**: every mobile-override selector in a section file gets the section's outer wrapper class prefixed. Costs nothing, prevents an entire class of bug. Existing implementation: `theinmag-blog-index-editorial.liquid` uses `.theinmag-editorial__inner` as the prefix on every mobile-override rule.

### 3.2 Full-bleed via negative margins (matching parent padding)

To make a child element extend past its parent's horizontal padding to the viewport edges, use a negative margin matching the parent's padding clamp value.

```css
.section { padding: ... clamp(16px, 3vw, 32px) ...; }
.section .full-bleed-child {
  margin-left: calc(-1 * clamp(16px, 3vw, 32px));
  margin-right: calc(-1 * clamp(16px, 3vw, 32px));
}
```

The clamp values must match exactly between parent padding and child margin. If they drift, the alignment breaks across breakpoints. Used in: feature card on mobile, right-col rail container on mobile.

### 3.3 Headroom (auto-hide header on scroll)

Site header auto-hides on scroll-down past ~80px, restores on scroll-up. **Scoped to article pages only** (the CSS lives in `theinmag-article.liquid`'s stylesheet, which only loads when that section renders).

Two non-obvious things learnt the hard way:

- **Transform target is the section wrapper, not the header element.** `.theinmag-header-section` (the schema-class outer wrapper) carries `position: sticky`. `.theinmag-header` (the inner) is `position: relative` inside, with the cream background. Transforming the inner only slid the contents up while the wrapper's reserved space stayed visible — looks like a "blank cream bar" mid-animation. Always transform the wrapper.
- **`overflow: clip` on the wrapper** prevents any overflowing children (e.g., the made-by-kids sticker which has `margin-bottom: -6px` to bleed past the header on every page) from looking like they're "lagging" during the transform animation.

Implementation lives in `sections/theinmag-article.liquid` — search for `is-headroom-hidden`. Uses a single rAF-throttled scroll listener that ALSO drives the hero-progress CSS custom property (see [§5.2](#52-scroll-driven-css-custom-properties)). Skip the whole thing under `prefers-reduced-motion`.

### 3.4 Horizontal scroll-snap rails

Used for the right-col cards on mobile in the editorial section. Pattern:

```css
.rail-container {
  display: flex;
  flex-direction: row;
  gap: clamp(14px, 2vw, 20px);
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  /* Bleed to viewport edges */
  margin-left: calc(-1 * clamp(16px, 3vw, 32px));
  margin-right: calc(-1 * clamp(16px, 3vw, 32px));
  padding: 4px clamp(16px, 3vw, 32px);
}
.rail-container::-webkit-scrollbar { display: none; }
.rail-card {
  flex-shrink: 0;
  width: 72vw;
  max-width: 280px;
  scroll-snap-align: start;
}
```

`width: 72vw` shows roughly one full card with a peek of the next, signalling "swipe right." Cards bleed to viewport edges via the same negative-margin trick as [§3.2](#32-full-bleed-via-negative-margins-matching-parent-padding).

### 3.5 Mobile section reordering with flex `order`

When desktop has a complex grid layout and mobile needs to reorder elements without changing the DOM, switch the parent to flex column on mobile and assign `order` values:

```css
@media (max-width: 749px) {
  .theinmag-editorial__inner {
    display: flex;
    flex-direction: column;
    gap: clamp(28px, 4vw, 48px);
  }
  .theinmag-editorial__card--feature { order: 1; }
  .theinmag-editorial__intro { order: 2; }
  .theinmag-editorial__grid { order: 3; }
}
```

Used to put the hero feature card at the top of the blog index on mobile (Maude pattern), with intro + audience tabs sliding below it.

### 3.6 Static-stage on mobile via `display: contents` flatten

When desktop has a 2-column grid that needs to become a single ordered flex column on mobile (without restructuring markup), wrap the inner containers in `display: contents` so their children participate directly in the parent's flex layout. Then assign `order` on each grandchild to control the mobile stack order.

```html
<section class="stage">
  <div class="filter-bar">…</div>
  <div class="grid">
    <div class="list-wrap">…</div>
    <div class="right-col">
      <div class="featured">…</div>
      <div class="missed">…</div>
    </div>
  </div>
</section>
```

```css
/* Mobile (default): stage = flex column, inner wrappers vanish */
.stage { display: flex; flex-direction: column; }
.grid, .right-col { display: contents; }

/* Order each grandchild as if it were a direct child of stage */
.featured    { order: 1; }
.filter-bar  { order: 2; }
.list-wrap   { order: 3; flex: 1 1 auto; min-height: 0; }
.missed      { order: 4; }

/* Desktop: revert to nested grid layout */
@media (min-width: 990px) {
  .stage { display: grid; grid-template-rows: auto 1fr; }
  .grid { display: grid; grid-template-columns: 2fr 1fr; }
  .right-col { display: flex; flex-direction: column; }
  .featured, .filter-bar, .list-wrap, .missed { order: initial; }
}
```

Why this matters: mobile and desktop want different element orders, but you don't want two markup copies. `display: contents` removes the wrapper from layout while keeping its children — they bubble up into the parent's flex container.

Reference implementation: `theinmag-competitions.liquid` uses this to put the top-pick card above the search/filter row on mobile while keeping the 2-column grid on desktop. Without it the pattern would require duplicate markup or absolute positioning.

Caveat: `display: contents` removes accessibility roles too. If the wrapper had a `role` attribute or was an aria landmark, you lose it. For purely-presentational wrappers (the case in the competitions section), no concern.

### 3.7 Hero-image-fills-screen height

To make a hero image take a specific viewport-height proportion (e.g., "75% of the phone screen so the next section's heading just peeks below"), use `height: Xvh` not `aspect-ratio`. Aspect ratio ties height to width and varies by phone width. `vh` is consistent.

```css
.feature-cover-mobile {
  aspect-ratio: auto;  /* clear the desktop's aspect-ratio */
  height: 75vh;
}
```

---

## 4. Liquid patterns

### 4.1 Strip trailing period from lowercase headings

theINmag rule (revised 2026-05-06): lowercase sentence-case headings end with NO terminal punctuation; question marks and exclamations preserved (see [§7](#7-editorial-voice-quick-reference)). User-typed titles in admin may include trailing periods — strip them in the template before rendering.

```liquid
{%- liquid
  assign display_title = article.title
  assign last_char = display_title | slice: -1
  if last_char == '.'
    assign trim_to = display_title | size | minus: 1
    assign display_title = display_title | slice: 0, trim_to
  endif
-%}
```

Use `display_title` everywhere — visible HTML, JSON-LD `headline`, JSON-LD breadcrumb `name`. Don't strip from `image.alt` (full natural language belongs in alt text).

Implementations: `sections/theinmag-article.liquid` (article hero), `snippets/theinmag-article-rec-card.liquid` (rec card titles).

### 4.2 Metafield resolution with namespace `field_notes`

Article metafields live under namespace `field_notes` (underscore — Shopify metafield namespaces don't allow hyphens, see `project_field_notes_rename` memory). Access pattern:

```liquid
{%- assign quick_answer = article.metafields.field_notes.quick_answer -%}
{%- assign primary_topic = article.metafields.field_notes.primary_topic -%}
```

Always provide a fallback for fields users might not fill in:

```liquid
{%- assign topic = article.metafields.field_notes.primary_topic -%}
{%- if topic == blank -%}
  {%- assign topic = article.tags.first -%}
{%- endif -%}
```

The 13 article metafields (defined in admin Settings → Custom data → Articles) are:
`quick_answer`, `primary_topic`, `author_type`, `author_role_override`, `kid_first_name`, `kid_age`, `kid_region`, `recommendation_1_handle`, `recommendation_1_blurb`, `recommendation_2_handle`, `recommendation_2_blurb`, `recommendation_3_handle`, `recommendation_3_blurb`.

### 4.3 Articles-by-handle indexing (filters not allowed in brackets)

To resolve a post by handle, use `articles['blog-handle/article-handle']`:

```liquid
{%- assign rec_key = blog.handle | append: '/' | append: rec_handle -%}
{%- assign rec_article = articles[rec_key] -%}
```

**Don't pipe filters inside the bracket:**

```liquid
{# WRONG - throws "Expected close_square but found pipe" #}
{%- assign rec = articles[blog.handle | append: '/' | append: handle] -%}

{# RIGHT - assign first, index by bare variable #}
{%- assign key = blog.handle | append: '/' | append: handle -%}
{%- assign rec = articles[key] -%}
```

Same rule applies to any array index: `arr[var | filter]` fails, `arr[var]` works. See `feedback_liquid_array_index_no_filters` memory.

### 4.4 Random-pool selection (kid characters)

For a pool of N images where one is picked at page load, store URLs as `data-` attributes and pick in JS. Two variants in the codebase:

**Variant A — small fixed pool (≤3) defined via section settings**

```liquid
<span
  data-theinmag-kid-character
  data-character-count="{{ count }}"
  {% for i in (1..3) %}
    {%- assign img_key = 'kid_character_' | append: i -%}
    {%- assign url_value = section.settings[img_key] | image_url: width: 220 -%}
    {%- if url_value != blank -%}data-character-{{ i }}="{{ url_value }}"{%- endif -%}
  {% endfor %}
></span>
```

```js
var pool = [];
for (var i = 1; i <= 3; i++) {
  var url = el.getAttribute('data-character-' + i);
  if (url) pool.push(url);
}
if (pool.length) {
  el.style.backgroundImage = "url('" + pool[Math.floor(Math.random() * pool.length)] + "')";
}
```

Reference: `sections/theinmag-mission.liquid` (with scroll-pop animation). Static variant in `sections/theinmag-article.liquid` for kid contributor avatars. See `reference_kid_character_pattern` memory.

**Variant B — bigger pool (N up to 30) defined by filename convention + count setting**

When the pool is large enough that listing each one in section settings is annoying admin UX, expose a single integer `character_count` setting and let Liquid iterate, building URLs from a known filename pattern.

```liquid
{%- liquid
  assign character_count = section.settings.character_count | default: 13
  assign character_prefix = section.settings.character_prefix | default: 'character-comp-'
  assign character_ext = section.settings.character_ext | default: '.png'
  capture character_attrs
    for i in (1..character_count)
      assign char_filename = character_prefix | append: i | append: character_ext
      assign char_url = char_filename | asset_url
      echo ' data-character-'
      echo i
      echo '="'
      echo char_url
      echo '"'
    endfor
  endcapture
-%}
<section data-theinmag-comps {{ character_attrs }}> ... </section>
```

JS reads them all into a pool. For multiple distinct picks (e.g. 3 different tiles each needing a unique character), use the Fisher-Yates shuffle in [§5.4](#54-distinct-pick-from-a-random-pool-fisher-yates).

Reference: `sections/theinmag-competitions.liquid` (13-character pool, 3 distinct picks per visit + 1 modal pick). The convention `character-comp-1.png` … `character-comp-13.png` lets Ryan add more by dropping a file in `/assets/` and bumping the integer setting.

### 4.5 Schema setting gotchas (upload-blocking)

Four Shopify schema rules that have all blocked uploads in the past:

1. **`url`-type defaults must be datasource paths** (`shopify://collections/all` etc.). For `/blogs/...` defaults, use `text` type, not `url`.
2. **Cannot have both `default` AND `presets` at section level.** If you set a section preset with settings, drop the section-level `default` keys.
3. **`type: header` content has a 50-char cap.** Splits or trims if longer.
4. **Text-input `"default": ""` (empty string) is rejected.** Omit the `default` key entirely if you want no default.

First two cascade into a misleading "section file does not exist" error. The other two surface directly. See `feedback_shopify_schema_url_default` memory.

### 4.6 Asset > 1MB → use Files API, not /assets

Large MP4s and PNGs in `/assets/` crash theme sync with a misleading HTTP 413 error. Upload via Shopify admin Files (Settings → Files), then reference the CDN URL in section settings. See `feedback_shopify_files_api_for_large_media` memory.

### 4.7 Filename-convention asset auto-discovery (no admin field)

When the same set of assets needs to be linked per-record (e.g. a logo per competition), DON'T add a per-record image picker setting in the schema — that scales badly and clutters the admin. Instead: name asset files by the record ID (`<id>.<ext>`) and detect them in the build step OR Liquid.

Build-step detection (Python):

```python
def find_logo_filename(comp_id):
    if not comp_id:
        return ""
    logos_dir = os.path.join(ROOT, "assets", "logos")
    for ext in (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"):
        candidate = os.path.join(logos_dir, comp_id + ext)
        if os.path.exists(candidate):
            return "logos/" + comp_id + ext
    return ""
```

Liquid-side render (with letter-placeholder fallback):

```liquid
<span class="tile-cover">
  {%- assign comp_logo = comp_logos[idx] -%}
  {%- if comp_logo != blank -%}
    <img src="{{ comp_logo | asset_url }}" alt="" loading="lazy">
  {%- else -%}
    <span class="tile-letter">{{ comp_letter }}</span>
  {%- endif -%}
</span>
```

Why: replacing or adding a logo is just dropping the file in `assets/logos/<id>.png` (or jpg, etc) and re-running the build script. **Same-extension swaps don't even need a script run** — Shopify's asset URL versioning bumps automatically.

Reference: `_tools/build-competitions-data.py` (`find_logo_filename` helper) + `sections/theinmag-competitions.liquid` (cover render).

### 4.8 Dawn's `div:empty { display: none }` gotcha

`assets/base.css` has `div:empty { display: none }` which collapses any decorative background-image-only `<div>` layer. If you write a `<div>` whose only purpose is to hold a background image (no children, no text), bump specificity with a parent class to override:

```css
.theinmag-section .my-decorative-div { display: block; }
```

Or use `<span>` (not affected). See `feedback_dawn_empty_div_hide` memory.

### 4.9 Liquid: cycling drop dates from an anchor

When a section needs to display "the next X" where X is a recurring event on a fixed schedule (mag drops on the 15th of Feb / Jun / Oct), don't make the editor enter every future occurrence. Take **one anchor** (next drop date + a serial number like the mag number) and walk forward in Liquid to derive future entries.

```liquid
{%- liquid
  assign anchor_drop = section.settings.next_mag_drop          # "2026-06-15"
  assign anchor_mag = section.settings.next_mag_number | plus: 0
  assign anchor_year = anchor_drop | date: '%Y' | plus: 0
  assign anchor_m = anchor_drop | date: '%m' | plus: 0
  assign anchor_pos = 0
  if anchor_m == 6
    assign anchor_pos = 1
  endif
  if anchor_m == 10
    assign anchor_pos = 2
  endif

  assign cutoff_ts = 'now' | date: '%s' | plus: 10368000   # today + 120 days

  assign next_iso = ''
  assign next_mag = anchor_mag
  for offset in (0..6)
    assign idx_pos = anchor_pos | plus: offset
    assign year_off = idx_pos | divided_by: 3
    assign month_idx = idx_pos | modulo: 3
    assign cand_year = anchor_year | plus: year_off
    if month_idx == 0
      assign cand_month = '02'
    elsif month_idx == 1
      assign cand_month = '06'
    else
      assign cand_month = '10'
    endif
    capture cand_iso
      echo cand_year
      echo '-'
      echo cand_month
      echo '-15'
    endcapture
    assign cand_ts = cand_iso | date: '%s' | plus: 0
    if next_iso == '' and cand_ts >= cutoff_ts
      assign next_iso = cand_iso
      assign next_mag = anchor_mag | plus: offset
    endif
  endfor
-%}
```

Why an anchor + walk rather than 6 separate settings: Ryan only ever updates ONE thing per cycle (3x/year). The position-index trick (`pos = year*3 + monthIdx`) lets Liquid arithmetic carry the year roll without conditionals. Liquid's `date` filter accepts ISO `YYYY-MM-DD` strings directly via `'%s'` to get unix timestamps for comparison.

Use a `[[ name ]]`-style placeholder + `replace` filter convention to let editors write copy with calculated values inline. **Do NOT use `{{ name }}` placeholders inside JSON template settings — Shopify reads them as dynamic source bindings and rejects the upload with `"Dynamic source 'X' is invalid"`.** Square brackets sidestep that parser entirely:

```liquid
{%- assign mag_token = '[[next_issue_label]]' -%}
{%- assign date_token = '[[next_issue_date]]' -%}
{%- assign rendered = explainer
  | replace: mag_token, mag_replacement
  | replace: date_token, next_iso_label -%}
```

Reference: pattern was originally built for `sections/theinmag-send-in-cycle.liquid` (commit history shows it). **Removed in deployment** on 2026-05-07 — Ryan pulled it because surfacing a specific "Mag 11, dropping 15 October 2026" line creates a staleness risk if the editor anchor isn't bumped on release day, and the brand voice prefers softer "every Feb / Jun / Oct" framing on the Send IN page. Pattern is preserved here as a known-working approach for any future surface where the staleness risk is acceptable (membership cycle copy, school-term countdown copy, anywhere `today + lead_time` needs to land on the next of a recurring event).

---

## 5. JS patterns

### 5.1 Headroom auto-hide header

See [§3.3](#33-headroom-auto-hide-header-on-scroll). Key implementation note: track `lastScrollY` only when an action fires (hide or show), not every rAF cycle. If you update it every cycle, slow scrolls accumulate small deltas that never cross the threshold and the header never hides.

```js
var lastScrollY = window.pageYOffset;
function update() {
  var currentY = window.pageYOffset;
  if (currentY <= 5) {
    siteHeader.classList.remove('is-headroom-hidden');
    lastScrollY = currentY;
  } else {
    var delta = currentY - lastScrollY;
    if (delta > 8) {
      siteHeader.classList.add('is-headroom-hidden');
      lastScrollY = currentY;          // anchor only on action
    } else if (delta < -8) {
      siteHeader.classList.remove('is-headroom-hidden');
      lastScrollY = currentY;          // anchor only on action
    }
    // else: do nothing, lastScrollY stays anchored at last decision
  }
}
```

Reference: `sections/theinmag-article.liquid` script block.

### 5.2 Scroll-driven CSS custom properties (hero-progress)

Drive multiple CSS effects (image brightness, overlay opacity, transform scale) from a single rAF-throttled scroll listener that writes one custom property:

```js
function update() {
  var rect = article.getBoundingClientRect();
  var travel = window.innerHeight * 0.3;
  var scrolled = Math.max(0, -rect.top);
  var progress = Math.min(1, scrolled / travel);
  article.style.setProperty('--hero-progress', progress.toFixed(3));
}
```

Then in CSS, every effect reads from `--hero-progress`:

```css
.cover-image {
  filter: brightness(calc(1 - var(--hero-darken) + (var(--hero-progress) * var(--hero-darken))));
  transform: scale(calc(1.04 - (var(--hero-progress) * 0.04)));
}
.overlay {
  opacity: calc(1 - var(--hero-progress));
  transform: translateY(calc(var(--hero-progress) * -32px)) scale(calc(1 + (var(--hero-progress) * 0.04)));
}
```

**Critical bug to avoid**: track the article element's `getBoundingClientRect().top`, not the sticky cover's. A sticky element's `rect.top` stays at 0 during the entire sticky-stuck phase — using it means progress only fires when sticky releases at the bottom, not as the user scrolls.

Reference: `sections/theinmag-article.liquid`.

### 5.3 Distinct-pick from a random pool (Fisher-Yates)

When N elements each need a different random pick from the same pool (no duplicates allowed across the N), shuffle the pool and take the first N. Pick-each-independently is the obvious mistake — duplicates happen at random.

```js
function shuffleArray(arr) {
  var out = arr.slice();
  for (var i = out.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

var pool = getCharacterPool(); // pool of 13 URLs
var slots = root.querySelectorAll('[data-choice-character]'); // 3 tiles
var distinct = shuffleArray(pool).slice(0, slots.length);
slots.forEach(function (el, idx) {
  if (distinct[idx]) el.style.backgroundImage = "url('" + distinct[idx] + "')";
});
```

Reference: `sections/theinmag-competitions.liquid` choice-tile character placement. Modal character still picks independently from the full pool — overlap with a tile is acceptable in that flow because they don't appear together.

Bug Ryan caught (and the reason this pattern exists): the original implementation called `pickRandom(pool)` once per tile, so two tiles could end up with the same character. Always think about whether the picks must be distinct *across* the N.

### 5.4 Choice-gate state machine (CSS-driven show/hide)

Two-screen flows (e.g. "pick a category" → "browse the category") can be modelled as a single section with a `data-state` attribute and CSS rules that toggle visibility. Avoid duplicate templates or routing.

```html
<section data-theinmag-comps data-choice-state="choosing">
  <header class="choice"> ... </header>
  <div class="stage"> ... </div>
</section>
```

```css
.theinmag-comps[data-choice-state="chosen"] .choice { display: none; }
.theinmag-comps[data-choice-state="choosing"] .stage { display: none; }

/* Animate the leaving screen first, then JS flips the state */
.choice.is-leaving {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}
```

```js
function commitChoice(category) {
  // 1. Apply category filter
  // 2. Run the bounce-out animation
  choiceSection.classList.add('is-leaving');
  // 3. Flip state after the animation completes
  setTimeout(function () { root.dataset.choiceState = 'chosen'; }, 350);
}
```

Reference: `sections/theinmag-competitions.liquid`. Page lands at `choosing`, transitions to `chosen` on tile click. Default-on-load is always `choosing` — refreshes restart the gate. If you ever need persistence across reloads, hook localStorage in the JS, but the simple "every visit starts fresh" UX has tested well so far.

### 5.5 Sticky-header-aware scrollTo

When JS scrolls the page to a target element, account for the sticky site header so the target lands BELOW the header, not behind it.

```js
function scrollToBelowHeader(targetEl) {
  var header = document.querySelector('.theinmag-header-section');
  var headerH = header ? header.offsetHeight : 0;
  var top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}
```

Why this matters: `.theinmag-header-section` is `position: sticky` (see [§3.3](#33-headroom-auto-hide-header-on-scroll) for related). When you scroll the page so a section's top sits at viewport y=0, the sticky header overlays the top ~80px. Anything in that band is hidden.

Reference: `sections/theinmag-competitions.liquid` `commitChoice()`. Without the headerH subtraction, the filter bar landed behind the header after a category pick — Ryan caught this in review.

### 5.6 React-friendly input setter (Shopify admin automation)

Shopify admin React inputs ignore plain `input.value = ...` writes. Use the native value setter:

```js
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
setter.call(target, 'new value');
target.dispatchEvent(new Event('input', { bubbles: true }));
target.dispatchEvent(new Event('change', { bubbles: true }));
```

Used to update metafield values via Chrome MCP `javascript_tool` injection when admin click-driving was unreliable. Note: Shopify metafields are rendered as `_ReadField` divs that swap to inputs only when an `_ActivatorButton` (with aria-label like `Edit Author role override metafield`) is clicked. Click the activator first, then run the setter.

---

## 6. AEO / schema patterns

Every page needs Article + BreadcrumbList JSON-LD per CLAUDE.md. theINmag uses **custom JSON-LD** rather than Dawn's `{{ article | structured_data }}` so we can control the author shape (Person with `sameAs` for Ryan/Tam, bare string for kids per brand-safety rule).

### 6.1 Article schema with author shape

```liquid
{%- liquid
  assign schema_description = quick_answer | strip_html | escape
  if schema_description == blank
    assign schema_description = article.excerpt | strip_html | escape
  endif
-%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": {{ display_title | json }},
  "description": {{ schema_description | json }},
  "datePublished": {{ article.published_at | date: '%Y-%m-%dT%H:%M:%S%z' | json }},
  "author":
    {%- if author_type == 'kid' -%}
      {{ kid_first_name | json }}
    {%- else -%}
      {
        "@type": "Person",
        "name": {{ author_name | json }},
        "jobTitle": {{ author_role | json }},
        "sameAs": [ {{ author_ig | json }}, {{ author_fb | json }}, {{ author_yt | json }} ]
      }
    {%- endif -%}
}
</script>
```

Brand-safety rule: kid contributors are bare-string author, no Person object. See `convention_quick_answer_block` memory.

### 6.2 BreadcrumbList

Three positions: Home → Field notes → [Article title]. Full URLs (use `request.origin | append: ...`).

### 6.3 Quick read content reused as schema description

The Quick read paragraph is the densest answer at the top of the post and is what AI engines quote. Reuse it as `description` in Article schema AND as the `<meta name="description">`. Same dense paragraph in three places (visible, schema, meta) → strong AEO signal. See `convention_quick_answer_block` memory.

### 6.4 Visually-hidden keyword-rich copy for SEO

When a page's visible chrome is intentionally minimal (e.g. the competitions choice screen — three big tiles + a tagline, nothing else above the fold), Google needs more text to rank for parent search queries. The fix: keep the visible page minimal, AND emit a richly-keyworded H1 + intro paragraph in the markup but visually hide them. Google reads them, users don't see them, no UX impact.

```liquid
<header class="choice">
  {%- comment -%} Indexable but not visible {%- endcomment -%}
  <h1 class="visually-hidden">Australian kids' competitions to enter in 2026</h1>
  <p class="visually-hidden">A free directory of {{ comp_size }} real Australian
    competitions for kids in 2026 - art competitions, writing competitions,
    photography and film, STEM and maths, performance and music, and social good.
    Filter by age (4-6, 7-9, 10-12, 13-16), state (NSW, VIC, QLD, WA, SA, TAS,
    NT, ACT, national), entry cost (free, paid, paid-optional) and format
    (online, postal, school-entry, individual, team). Updated monthly.</p>

  {%- comment -%} The visible UI {%- endcomment -%}
  <p class="tagline">{{ tagline_text }}</p>
  <div class="choice-grid"> ... </div>
</header>
```

Pair with a per-page `meta_description` set in admin (via the page's "Search engine listing" panel) that mirrors the same keywords in 150-160 chars. The combination — visible tagline + hidden H1/intro + meta description — gives Google three keyword-aligned signals without compromising the visual minimalism.

Important: this is an established SEO pattern, not keyword stuffing. The hidden text matches the page's actual content (the categories, ages, states, costs are all real filters). Google penalises hidden text only when it's *unrelated* to the visible content.

Reference: `sections/theinmag-competitions.liquid` (visually-hidden H1 + intro near top of choice section).

### 6.5 Auto-generated ItemList JSON-LD from a data array

When a page presents a directory of items (competitions, products, events), emit `@type: ItemList` JSON-LD with each item as an `Event` (or `Product` etc) so Google can show the list as a rich SERP feature.

```liquid
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Australian kids' competitions 2026",
  "numberOfItems": {{ comp_size }},
  "itemListElement": [
    {%- for id in comp_ids -%}
      {%- assign idx = forloop.index0 -%}
      {
        "@type": "ListItem",
        "position": {{ forloop.index }},
        "item": {
          "@type": "Event",
          "name": {{ comp_names[idx] | json }},
          "description": {{ comp_pitches[idx] | json }},
          "url": {{ comp_websites[idx] | json }}
          {%- if comp_closing_dates[idx] contains '-' -%}
          ,"endDate": {{ comp_closing_dates[idx] | json }}
          {%- endif -%}
          ,"location": { "@type": "Place", "name": {{ comp_wheres[idx] | json }} }
          ,"offers": {
            "@type": "Offer",
            "price": "{% if comp_cost_slugs[idx] == 'free' %}0{% else %}varies{% endif %}",
            "priceCurrency": "AUD"
          }
        }
      }{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ]
}
</script>
```

Use the `| json` filter on every dynamic value — it handles quote-escaping and Unicode safely. Conditional fields (e.g. `endDate`) should only emit when the underlying data is valid (here: only when the closing date contains a hyphen, indicating an ISO date rather than "TBC").

Reference: `sections/theinmag-competitions.liquid`. Combined with the `BreadcrumbList` and `FAQPage` schemas on the same page, the result is dense structured data that AEO crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended) consistently cite.

### 6.6 Existing schema implementations

| Section | Schema |
|---|---|
| `theinmag-faq.liquid` | FAQPage |
| `theinmag-article.liquid` | Article + BreadcrumbList |
| `theinmag-competitions.liquid` | ItemList (65 Events) + BreadcrumbList + FAQPage |
| (homepage / our-story when built) | Organisation + Person (Ryan/Tam) |

---

## 7. Editorial voice quick reference

The locked-rule cheat sheet. Anything written for the site should pass these.

| Rule | Why | Memory |
|---|---|---|
| **No em dashes anywhere.** Hyphens only. | Em dashes are a strong AI-tell in 2026. Applies to all copy, comments, schemas. | CLAUDE.md |
| **Sentence case headings.** Capital first letter only (except "theINmag" which keeps "IN" capitalised). | Brand voice. | CLAUDE.md |
| **Lowercase headings end with NO period.** Question marks and exclamations preserved. | Period feels redundant on a heading. Revised 2026-05-06 — supersedes earlier "lowercase end-with-full-stop is fine" rule. | `feedback_inter_for_blog_titles` |
| **"Creation" not "work"** everywhere. | Brand-defining quote from a kid: "art is not work." | CLAUDE.md |
| **H2s phrased as questions** where natural. | AEO requirement. "Why do kids stop creating?" passes. "What is creative learning?" technically passes but reads SEO-bait. | CLAUDE.md |
| **Smart brevity**, Axios/Guy Raz energy, short punchy sentences. | Brand voice. "Write the section, cut it in half, then cut it in half again." | Principles |
| **Never use "subscription"** in customer-facing product names — it's "Membership." | Locked product naming. | CLAUDE.md |
| **Never collect contactable details from kids.** Adults only on every form. Kid bottom-of-article cards don't link to "more from this kid" archives. | Locked brand-safety rule. | CLAUDE.md |
| **Named kid attributions always**: `Maya, age 9 - Fremantle WA`. First name + age + region only, never surnames or specific addresses. | Brand-safety + brand-defining trust signal. | CLAUDE.md |
| **"Quick read."** opens every blog post (40-60 word AEO snippet). | Locked editorial/AEO convention. Stored in `field_notes.quick_answer` metafield. | `convention_quick_answer_block` |
| **Author bylines named** (Ryan or Tam, never "theINmag team" as default). | Locked. | May 5 spec |
| **Author display names: "Ryan G." and "Tam B."** (with full stops as part of the initial). Note: those periods are NAME parts, not heading-end punctuation — don't strip them. | Locked 2026-05-06. | Section schema defaults |

### Heading typography

| Surface | Font | Why |
|---|---|---|
| Article hero post title (single-post overlay) | Inter 700 | Editorial professionalism on the single-post hero. Was Post Regular originally — Ryan ruled it too kiddy/casual in review. |
| Blog post titles in cards (homepage feed, blog index, related-posts) | Inter 700 | Editorial / journalistic surfaces. |
| Inside-article H2s | Inter 700 | Same reasoning. |
| Section identity / brand wordmarks (e.g. "field notes", "from the founders", page-level brand moments) | Post Regular | Brand-identity moments. |
| Recommendation strip heading ("here's some more we thought you might enjoy") | Inter 600 | Friendly editorial subhead, NOT a brand-identity wordmark. |

See `feedback_inter_for_blog_titles` memory for the full nuance.

---

## 8. Brand-locked decisions

Compact reference. Each is a "do not deviate without explicit Ryan instruction."

| Locked decision | Reference |
|---|---|
| Hero headline: "The magazine for creative kids" / sub: "Where Aussie kids get published — no ads, just creativity" | `homepage-build-spec.md` |
| Six colour pairs (purple/coral/peach/mint/cream/sky), pre-validated WCAG AA. Yellow is stamp-only, never bg. Cherry magenta is rare inline emphasis (1-2 spans/page max). | Tokens |
| Sticker buttons (yellow primary, outlined-purple secondary), generous 32px pill radius, solid offset shadow (not blurred), press-down translate on hover. | Tokens |
| Inter for body, Post Regular for headings (with the exceptions in §7). Caveat for rare hand-lettered emphasis (1-2 spans per blog post max). | Tokens |
| Real kid creations as design system. Every page anchored by at least one named kid creation. | Principles 17 |
| Min font on mobile: 14px. Anything smaller fails accessibility. | Tokens |
| All animations respect `prefers-reduced-motion`. | CLAUDE.md |
| Sentence-case lowercase post titles, no trailing period (revised 2026-05-06). | `feedback_inter_for_blog_titles` |
| Blog handle: `field-notes` (URL hyphen). Metafield namespace: `field_notes` (underscore). Different naming systems — don't mistype. | `project_field_notes_rename` |
| Kid contributors: kid-character illustration (NOT photo), bare-string author in JSON-LD, no archive link. | `feedback_kid_characters` + brand safety |
| Image reuse rule: anything in a hero on a page can't also appear as a blog/product card on the same page. | `feedback_no_image_reuse_same_page` |
| Section bg-color matches kid-art ground (don't re-export artwork to fight bg). | `feedback_match_section_bg_to_artwork_ground` |
| White-on-scrim over coloured pills on photographic surfaces. | `feedback_premium_photo_text` |
| **"Top picks"** for the rotating editor-curated comp card — NOT "spotlight" (too generic), NOT "featured" (sounds like in-magazine endorsement), NOT "sponsored" (paid-placement implication). Plural "top picks" signals a rotating collection without endorsement. | Competitions session 2026-05-07 |
| **Quiz-gate UX for content discovery**: when a directory has 3 broad axes the user can pick from upfront (e.g. art / writing / everything), use a full-screen choice screen as the first interaction rather than dumping the whole list. The choice fades out, the directory reveals. State machine via `data-choice-state` (see [§5.4](#54-choice-gate-state-machine-css-driven-show-hide)). | Competitions session |
| **Top-pick rotation cap = 3 cards**, 10s crossfade. More than 3 means the user waits too long for a card they saw earlier to come back. Hardcoded order in `_tools/build-competitions-data.py` (`SPOTLIGHT_ORDER`) so the rotation order is editorial, not auto-derived. | Competitions session |
| **Logos render as `<img>` when the file exists, else letter placeholder.** Logo files live in `assets/logos/<id>.<ext>`; auto-discovered by ID match. Replacements via same-extension swap need no rebuild; new logos or extension changes need `python3 _tools/build-competitions-data.py`. | [§4.7](#47-filename-convention-asset-auto-discovery-no-admin-field) |
| **Static-stage UX** = stage 100vh + internal-scroll on the list + sticky-feeling bg + missed/footer revealed on overscroll. Same on mobile + desktop. The bg image is daily-stable random across 3 pre-approved options. | [§3.6](#36-static-stage-on-mobile-via-display-contents-flatten) |
| **Missed-a-comp card visual differentiator**: sharp corners + offset purple shadow (`5px 5px 0 var(--purple-dark)`) + thin dark border. Stands out against the rounded tile language elsewhere on the page. Card narrower than tiles (`max-width: 320px`, centred). | Competitions session |
| **"Top picks" badge** (small cream pill with dark border, slight `-2deg` tilt) overlaid top-left of each rotating top-pick card cover. Editorial sticker, deliberately understated to avoid sponsored-content vibes. | Competitions session |

---

## 9. Kid pattern library

theINmag's competitive moat is **real kid creations** woven into the visual layer. Principle 17: "Kid creations are the design system." Principle 7: "Look like theINmag, not like a kids' magazine." Every page or section that calls for a background, decorative surface, or texture should default to a kid creation pulled from the magazine — never synthetic geometric patterns, stock textures, or AI-generated artwork. Ryan has hundreds of these from past mag issues and they're a renewable asset.

### The trigger (READ THIS WHEN PLANNING ANY NEW PAGE OR SECTION)

Anytime a new section or page calls for one of these:

- A section background that isn't a flat colour
- A decorative surface (banner top, footer texture, hero ground)
- An empty-state visual (between content blocks, in micro-pauses)
- A page-level texture, watermark, or wash
- A divider / break ornament between paragraphs in long copy

**Stop. Ask Ryan**, in this rough form:

> "This [section / page / surface] calls for a kid pattern background. Before I default to a flat colour, do you have a kid creation from the mag in mind? I can grab from the existing `/assets/` library (`blog-image-universal-*`, `section_background_*`, `HERO_*`) or you can upload a new one for this surface specifically."

Don't default to a flat colour bg without asking. Don't generate or fabricate a pattern. Don't repurpose a card cover image as a section bg without checking — the implied curatorial choice deserves a Ryan-yes. The kid creations ARE the design system; if a page can't be anchored by one, the page is probably wrong for theINmag.

### The existing kid-art library (already in `/assets/`)

| Filename pattern | Use |
|---|---|
| `blog-image-universal-01.jpg` … `blog-image-universal-19.jpg`+ | General-purpose kid creations for cards, placeholders, archive tiles. Pre-curated by Ryan, safe to grab without asking for card covers. |
| `section_background_*.jpg` (e.g. `section_background_searchblogs.jpg` — the mint flower at the top of the field-notes archive) | Section-anchored decorative artwork. Top-anchored at full width, gradient-fades into bg-color below. |
| `HERO_*.jpg` (e.g. `HERO_kid-creation-art.jpg`) | Hero-worthy kid creations. Reserved for top-of-page hero anchors. |
| `character-[surface]-1/2/3.png` (e.g. `character-mission-1.png` … `character-faq-1/2/3.png` … `character-philosophy-1/2/3.png` … `character-reviews-1/2/3.png`) | Kid-character illustrations for the random-of-three character pools. Per-surface — don't share pools across surfaces. |
| `meet-tam-poster.jpg`, `dotsforbehindtam.png`, `meet-tam-heading-shape.png` | Section-specific decorative assets, locked to Meet Tam. |

When a new pattern is uploaded, it should land in `/assets/` (or via Shopify Files API for >1MB files — see [§4.6](#46-asset--1mb--use-files-api-not-assets)) and get logged here so future-me can find it by purpose, not just by filename.

### Naming convention going forward

When Ryan uploads a new pattern, name it so future-me can find it by purpose, not by which mag it came from:

```
theinmag-pattern-[surface-or-purpose]-[descriptor].[ext]
```

Examples:
- `theinmag-pattern-watercolour-trees-bg.jpg` — full-width kid watercolour suitable as a section bg
- `theinmag-pattern-marker-doodle-divider.png` — narrow horizontal pattern between paragraphs
- `theinmag-pattern-paint-splatter-hero.jpg` — high-density splatter, hero-grade

The `mag-XX` source suffix is optional — only include it if the source is editorially relevant (e.g. you're building a "behind mag10" section anchored on mag10 art). Otherwise leave it out so the asset is reusable.

### Implementation modes

Different ways to deploy a kid pattern in the codebase. Each has its own technique — choose by what the surface needs.

**1. Section background, top-anchored, gradient-blends to bg-color**
The reference pattern. Kid art at top of section, fades into solid bg below. See `theinmag-blog-index-archive.liquid` for the canonical implementation.

```css
.section--has-bg {
  background-image:
    linear-gradient(to bottom, transparent 0, transparent 22vw,
                    var(--bg-color) 38vw, var(--bg-color) 100%),
    var(--bg-image);
  background-size: 100% 100%, 100% auto;
  background-position: top center, top center;
}
```

The bg-color **must match the artwork's natural ground colour** (per `feedback_match_section_bg_to_artwork_ground` memory). Sample the hex from the artwork's empty area; don't ask Ryan to re-export the artwork to fight a wrong bg.

**2. Full-bleed pattern surface (banners, CTA bands)**
Pattern fills the entire section, no fade. Use `background-size: cover` (crops to fill, preserves aspect) or `100% 100%` (stretches to fill, may distort). Cover is usually right.

**3. Decorative corner artwork (peek-from-edge)**
Pattern positioned at a corner with partial visibility — similar logic to the kid-character random-pool. Adds personality without competing for attention. Position with explicit `background-position` percentages, size with explicit pixel/clamp values.

**4. Repeating tile pattern**
For full-page wash backgrounds, use a tileable PNG with `background-repeat: repeat`. Best for subtle textures (specks, strokes, single-element patterns) — full kid drawings lose meaning when repeated. Tile size: 1200x1200px per design tokens.

**5. Inline mid-content punctuation (long-form blog posts)**
Small kid pattern between paragraphs in a long-form article. Centered, ~120-200px tall, no background. Functions like a print-mag's section break ornament. Use as an `<img>` inside the rich text body, OR as a Liquid-driven divider in the article template (future enhancement).

**6. Image-on-image overlay**
Kid pattern overlaid on photography with reduced opacity. Useful for hero bands where a real photo + kid-art layer creates depth (e.g. a Tam photo with kid-doodle overlay at 40% opacity).

### When to ask, when to grab

Quick decision tree to avoid asking unnecessarily AND to avoid grabbing without permission when the choice is curatorial.

- **Card cover image / blog post cover / archive tile** → grab from `blog-image-universal-*` library directly. Pre-curated, safe. No need to ask.
- **Section background anchor (page-defining decorative surface)** → **ASK Ryan first.** The choice has brand implications and he'll have a specific image in mind.
- **Hero of a new page** → **ASK Ryan, every time.** The hero kid creation is locked per page, and Principle 17 gives this hero status.
- **Author/character avatar replacement** → use the per-surface `character-*` pool. Don't repurpose `blog-image-universal-*` for avatars.
- **Decorative shape (wave, blob, cloud, squiggle, torn banner)** → see the abstract brand-shape library in design tokens (`theinmag-shape-*.svg`). These are NOT kid-art — they're abstract brand shapes. Different category. Don't conflate.
- **Empty state, success state, micro-illustration** → ASK. There's probably a kid drawing that fits the moment better than a flat icon.

### The reuse rule (LOCKED)

Per `feedback_no_image_reuse_same_page` memory: a kid creation in a hero on Page X cannot also appear as a card cover on Page X. Reads as oversight rather than considered selection. **Track which pattern is anchoring which page** when planning new pages — the [Page Recipe](#10-page-recipes) template has a slot for this.

---

## 10. Page recipes

### 10.1 The recipe template

When briefing a new page (or starting a new build session focused on a new page), fill this in first. The template forces the right questions early.

```markdown
## Page Recipe: [Page Name]

**URL:** `/path/to/page`
**Tier:** [1 conversion / 2 brand / 3 personality] (per Principles)
**Audience:** [parents / teachers / homeschoolers / kids / mixed]
**Primary action:** [What's the ONE thing this page should drive?]

### Visual
- **Colour pair:** [purple / coral / peach / mint / cream / sky]
- **Cream pair as base?** [yes/no — cream is universal]
- **Anchoring kid creation (hero):** [filename or description — ASK Ryan, see §9]
- **Anchoring kid pattern (section bg or decorative surface):** [filename or description, OR "ASK Ryan to upload" — see §9, never default to flat colour without asking]
- **Yellow stamp CTAs:** [count, max 1 above fold]

### Sections (top to bottom)
1. [section file] — [tunings, settings, blocks]
2. ...

### Mobile patterns to apply
- [ ] Specificity prefix (§3.1) on any mobile overrides
- [ ] Full-bleed via negative margins (§3.2) — yes/no
- [ ] Section reorder with flex `order` (§3.5) — yes/no
- [ ] Horizontal scroll-snap rail (§3.4) — yes/no
- [ ] Headroom header (§3.3) — yes/no (default: only on article pages)

### Metafields needed
- [namespace.key] — [type] — [what for]

### AEO / schema requirements
- [ ] Article schema (if blog post)
- [ ] FAQPage (if FAQ content)
- [ ] BreadcrumbList (always)
- [ ] Organisation/Person (if homepage or Our Story)
- [ ] H2s phrased as questions where natural
- [ ] llms.txt + robots.txt confirmed (already done at site level)

### Brand voice checklist
- [ ] No em dashes
- [ ] "Creation" not "work"
- [ ] Sentence case lowercase headings, no trailing periods
- [ ] Smart brevity passes ("can I cut this in half?")

### Locked decisions specific to this page
- ...

### Out of scope (don't build now)
- ...
```

### 10.2 Worked recipe: Homepage

(Already built — see `homepage-build-spec.md` for the full version. Here's the compressed pattern-library form.)

- **URL:** `/`
- **Tier:** 1 (conversion)
- **Audience:** mixed (parents primarily)
- **Primary action:** drive to membership / send-IN
- **Colour pair:** cream + peach + purple + yellow stamp (per Principles "Colour richness vs cohesion" tension)
- **Anchoring kid creation:** rotating in mission section (`reference_kid_character_pattern`)
- **Sections:** announcement-bar → header → hero → mission → audience-tiles → philosophy → meet-tam → reviews → blog-feed → press-band → faq → footer
- **Schema:** Organisation + Person on this page
- **Mobile:** standard responsive collapse, no special reorder needed
- **AEO:** H2s as questions, llms.txt allowed, FAQPage on the FAQ section

### 10.3 Worked recipe: Blog index (`/blogs/field-notes`)

- **URL:** `/blogs/field-notes`
- **Tier:** 2 (brand) — entry point to editorial
- **Audience:** mixed; **audience toggle** filters cards in-place (all/kids/adults). State persists in `localStorage` key `field-notes-audience`, broadcast via `field-notes:audience-changed` window event.
- **Colour pair:** cream + lavender (purple pair, light)
- **Anchoring kid creation:** mint kid-flower in archive section bg
- **Sections:** editorial → feature-banner → archive
- **Mobile reorder** (editorial section): feature card flush to header at 75vh + darker scrim → intro (FIELD NOTES + audience tabs) → grid (left col stacked + right col → horizontal rail). Specificity prefix `.theinmag-editorial__inner` on every mobile rule.
- **Mobile archive flower:** scaled to 180% width, `top left` position, gradient fade pushed to 75-105vw so flower bleeds behind first tile.
- **Locked:** "more for you." section heading is sentence-case Inter 600 ("here's some more we thought you might enjoy"), NOT Post Regular. Section identity "FIELD NOTES" wordmark stays Post Regular.

### 10.4 Worked recipe: Competitions page (`/pages/competitions`)

- **URL:** `/pages/competitions`
- **Tier:** 2 (brand) — opens-doors hub for "kid creativity beyond theINmag"
- **Audience:** parents + teachers (drives kids to enter; never collects kid contact details)
- **Primary action:** click through to a comp's external website
- **Colour pair:** cream (universal base) + per-tile category accent (art=coral, writing=mint, photo/film=sky, stem=purple, performance=peach, social-good=cream-warm)
- **Anchoring kid creation:** `section_background_competitions1.jpg`, `_2.jpg`, `_3.jpg` — daily-stable random pick (`'now' | date: '%j' | modulo: 3`). Cream wash at ~55% opacity overlays the bg so content reads cleanly on top (Ryan asked for the pattern to come through more — was 0.82, now 0.55).
- **Sections:** announcement-bar → header → competitions (single section, multi-zone) → footer
- **Page UX is a quiz gate, not a directory dump:** user lands on a full-screen choice screen with three portrait tiles (art / writing / everything). After clicking, the gate animates out (`is-leaving` class, ~350ms) and the static stage reveals. State machine via `data-choice-state` attribute on the section root (`choosing` → `chosen`). See [§5.4](#54-choice-gate-state-machine-css-driven-show-hide).
- **Static-stage technique:** stage = `height: 100vh; max-height: 100dvh` on **both** mobile and desktop. List has `overflow-y: auto` so it scrolls internally; when the user reaches the end, `overscroll-behavior-y: auto` lets page scroll resume so the missed-card and footer come into view. On desktop the stage is a 2-row grid (filter-bar + 2-col grid below); on mobile the stage is a flex column with `display: contents` flattening the inner wrappers (see [§3.6](#36-static-stage-on-mobile-via-display-contents-flatten)) so featured / filter / list become direct flex children with explicit `order` values (top-pick → filter → list).
- **Mobile patterns:**
  - [x] Specificity prefix `.theinmag-comps` on every mobile rule ([§3.1](#31-the-specificity-prefix-pattern-critical))
  - [x] `display: contents` flatten on inner wrappers for stage flex order ([§3.6](#36-static-stage-on-mobile-via-display-contents-flatten))
  - [x] Featured-card switches to landscape layout (image left, text right) inside a 30vh cap
  - [x] Tagline `white-space: nowrap` + smaller font (clamp 13/3.6vw/30) so it stays one line at common phone widths
  - [x] Missed-a-comp card has TWO markup copies: `--desktop` inside right-col, `--mobile` outside the stage just above the footer line. CSS toggles which shows
  - [x] Filter dropdowns hide behind a "filters" pill button on phone widths
- **Choice tile characters:** 13 PNG pool in `/assets/` (`character-comp-1.png` … `character-comp-13.png`). On page load, a Fisher-Yates shuffle picks 3 distinct ones for the three tiles ([§5.3](#53-distinct-pick-from-a-random-pool-fisher-yates)). Modal character picks independently from the same pool when the modal opens (slight wobble animation). Filename pattern surfaced as schema settings (`character_count`, `character_prefix`, `character_ext`) so adding more is a single integer change.
- **Top-pick rotation:** locked to **3 cards** in fixed editorial order (Micador → Banabae → Spencil), 10s opacity crossfade, paused on hover. Order is hardcoded in `_tools/build-competitions-data.py` `SPOTLIGHT_ORDER`. Each card has a small "top picks" sticker badge (cream pill, dark border, -2deg tilt) overlaying the cover top-left.
- **Tile cover render:** `<img>` when a logo file exists at `assets/logos/<id>.<ext>`, else a category-coloured letter placeholder. Auto-discovered by ID match in the build script ([§4.7](#47-filename-convention-asset-auto-discovery-no-admin-field)). Same logic for the top-pick cards (bigger logo, `clamp(120px, 16vw, 200px)`).
- **Missed-a-comp card:** sharp corners + offset purple shadow + thin dark border, narrow (`max-width: 320px`, centred). Distinct from the rounded tile language so it stands out as a different type of CTA. On desktop sits inside the right column under the top-pick rotation; on mobile lives outside the stage, between the list end and the footer transition line.
- **Data architecture:** Option C (CSV → JSON + Liquid snippet). **65 comps** currently. Migration map to Option A (Shopify metaobjects) lives in `competitions-page-build-spec.md`. The JSON file (`assets/competitions.json`) doubles as the canonical record.
- **Suggest-comp modal:** lightbox with adult-only fields per CLAUDE.md. Modal kid character drawn from the same 13-pool. Form action defaults to in-page success state; a JotForm endpoint can be wired via section setting `suggest_form_action`.
- **SEO**:
  - Visible page is intentionally minimal (tagline + 3 tiles)
  - Visually-hidden H1: "Australian kids' competitions to enter in 2026"
  - Visually-hidden intro paragraph carries every keyword parents search for (categories, age ranges, all states, cost types, format types) — see [§6.4](#64-visually-hidden-keyword-rich-copy-for-seo)
  - Page meta_description set in admin: "69 verified Australian kids' competitions for 2026..." (re-set when comp count changes)
  - Page title in admin: "Australian kids' competitions 2026 - art, writing, photography, more"
  - FAQ schema defaults are 5 keyword-aligned Q+A pairs targeting parent-search queries
- **Schema:** ItemList of 65 Events + BreadcrumbList + FAQPage (see [§6.5](#65-auto-generated-itemlist-json-ld-from-a-data-array)).
- **Sticky-header-aware scroll:** `commitChoice()` reads `.theinmag-header-section` offsetHeight and subtracts from the scroll target so the filter bar lands BELOW the sticky header, not behind it ([§5.5](#55-sticky-header-aware-scrollto)).
- **Operational tools:**
  - `_tools/build-competitions-data.py` — converts CSV → JSON + Liquid snippet. Re-run after any CSV change OR when a new logo file is added at a new extension
  - `_tools/audit-competitions.py` — combined logo-fetcher + link-verifier. Walks each comp's website, pulls og:image / apple-touch-icon / favicon (priority order), saves to `assets/logos/<id>.<ext>`. Outputs `comps-logos.csv` + `comps-link-audit.csv` for triage
- **Locked:** filter category slugs (`art / writing / photofilm / stem / performance / social-good`) match the Python script's `CATEGORY_MAP`. If you add a new category to the master CSV, update both the script's map AND the filter dropdown options in the section file.
- **Launch-day checklist:** open the page in admin → Template dropdown will list `competitions` once Dawn is the live theme → pick it, save. Done. Until then, preview via `?view=competitions` URL parameter.

### 10.5 Worked recipe: Single article (`/blogs/field-notes/[handle]`)

- **URL:** `/blogs/field-notes/[handle]`
- **Tier:** 2 (brand)
- **Audience:** post-specific (informed by `author_type` metafield)
- **Primary action:** read the post + click into "more for you" rec strip
- **Colour pair:** cream + ink (universal)
- **Anchoring kid creation:** `article.image` (canonical cover, used in hero overlay AND every card preview of this post)
- **Sections:** announcement-bar → header → article (the whole template) → footer
- **Layout:** desktop two-column sticky (image left sticky `top: 0; height: 100vh`, body right scrolls). Mobile: stacked.
- **Mobile patterns:**
  - [x] Headroom auto-hide header (§3.3) — scoped to article pages
  - [x] Hero-progress scroll JS (§5.2) drives image scale + brightness + overlay fade
  - [x] About-author card stacks (avatar+name top row, bio + actions full-width below)
- **Metafields (per post):** quick_answer, primary_topic, author_type, author_role_override, kid_first_name, kid_age, kid_region, recommendation_1_handle/blurb × 3
- **Schema:** Article (with Person author for Ryan/Tam, bare string for kids) + BreadcrumbList
- **Quick read block:** required at top of body (40-60 words). Pulled from `field_notes.quick_answer`. Reused as schema description.
- **Period strip** ([§4.1](#41-strip-trailing-period-from-lowercase-headings)) on article.title for hero overlay AND JSON-LD.
- **Recommendation waterfall** (4 cards): curated metafields → topic-match recent → any recent → 4 placeholder cards if blog has no other articles yet.

---

## 11. Open systems / WIP

Things that are referenced but not fully built, or built but not yet deployed.

| Item | Status | Notes |
|---|---|---|
| `/pages/ryan` author archive | Not built | About-author card "More from Ryan" link points here. Need a custom page with bio + curated post grid. |
| `/pages/tam` author archive | Not built | Same as above for Tam. |
| Kid character images for article author avatar | Schema-ready | Section settings `kid_character_1/2/3` + filenames. Pool of 3 images, JS picks one per post load. Ryan to upload. |
| Ryan/Tam avatar images | Schema-ready | Section settings `ryan_avatar` / `tam_avatar` + filename fallbacks. Ryan to upload. |
| Audience tag system | Half-wired | Audience toggle in editorial broadcasts via `field-notes:audience-changed`. Cards filter via `data-audience`. Not all sections respect this yet. |
| URL redirect `/blogs/theinside/*` → `/blogs/field-notes/*` | Verify in admin | Should be auto-created by Shopify on blog handle rename. Confirm in Online Store → Navigation → URL Redirects. |
| News blog (Dawn default) | Optional cleanup | Unused, deletable. Currently sits in admin as the silent fallback for any unknown `/blogs/...` handle. |

---

## 12. Code conventions

### File naming

- All custom sections: `theinmag-` prefix.
- Custom snippets: `theinmag-` prefix.
- CSS classes inside sections: `theinmag-[section]__[element]--[modifier]` (BEM, prefix-scoped).
- New sections always include a `theinmag-[name]-section` schema `class` for the wrapper (used for sticky positioning, etc.).

### CSS

- Custom properties only — no hardcoded colour values (use design tokens).
- Section-level `{%- stylesheet -%}` blocks for section-specific CSS (loads only when section renders — useful for scoping mobile overrides like headroom).
- Mobile-first: base styles assume mobile, enhance with `@media (min-width: ...)` for tablet/desktop.
- For mobile-overrides of desktop defaults: ALWAYS use the specificity-prefix pattern (§3.1).
- All decorative animation respects `prefers-reduced-motion: reduce`.

### Comments

- Default to no comments. Only comment WHY when non-obvious (a hidden constraint, a workaround for a specific bug, behavior that would surprise a reader).
- Don't comment WHAT — well-named identifiers do that.
- Don't reference current task or issue numbers (rots over time).

### Liquid

- Use `{%- liquid ... -%}` blocks for dense logic (cleaner than nested tags).
- Always provide blank-checks before rendering optional content.
- Strip whitespace-control hyphens (`{%- ... -%}`) on tags that shouldn't add output whitespace.

---

## 13. Session-start protocol

This doc is read every session start. The mechanism:

1. CLAUDE.md's session-start checklist references this doc.
2. On a new session, after reading CLAUDE.md / tokens / principles, read this doc.
3. Run `git log --oneline -10` and compare to the last entry in [§14](#14-maintenance-log) below.
4. If commits exist that aren't logged here yet, integrate them into the relevant catalog/pattern sections BEFORE starting any new work.
5. After the session's main work is complete, log the session in §14.

---

## 14. Maintenance log

Newest at top. Each entry: date, commit hash (or "uncommitted"), one-line summary of what was added to this doc.

- **2026-05-07** (uncommitted) — **Built the Contact page** (`/pages/contact`). Four new sections plus a fully-wired `templates/page.contact.json`: `theinmag-contact-hero` (lavender band, "Get IN touch", page-level BreadcrumbList + WebPage JSON-LD anchored here), `theinmag-contact-form` (two-column desktop, Shopify `{% form 'contact' %}` with three fields + honeypot, success state REPLACES form with yellow-tick "Got it!" block, errors above form preserve input), `theinmag-contact-router` (three soft tiles for schools / stockists / partnerships - target pages don't exist yet, links wired anyway per build list), `theinmag-contact-social` (the POP moment - "Come hang with us!" + three big brand-companion-filled buttons, Instagram=purple-dark / Facebook=teal-dark / YouTube=sage-dark). Form-state pattern is reusable for any future Shopify-native contact form: form / `form.errors` / `form.posted_successfully?` rendered in one column slot via if/else inside `{% form %}`. Van photo asset (`theinmag-van-contact.jpg`) not yet in `/assets/`; section renders styled lavender placeholder via `<img onerror>` until Ryan drops the file (or uploads via image_picker). NOT shipped on this page: newsletter signup (footer covers it), FAQ (deferred), postal address (deferred), phone, last-name field. Outstanding admin tasks: set page title "Contact theINmag | Get IN Touch" + meta description in admin Online Store → Pages → Contact (Shopify Page resource, not a theme template setting). Section catalog [§1.5](#15-custom-page-templates) extended with all four new sections; templates [§1.6](#16-templates) gets `page.contact.json`.
- **2026-05-07** (uncommitted) — **Created `theinmag-page-playbook.md`.** Senior front-end designer's playbook for every new page build. Distilled from the week shipping homepage / competitions / field notes at elite quality, plus the first pass of send-in. Captures the pre-build checklist, the quality-bar tests, anti-patterns paid for the hard way (the `--path` push gotcha, dynamic-source binding rejections, Post Regular fatigue, border-radius:50% on rectangular illustrated images, sticker-button discipline, etc.), and section starter templates. Anchored to the three hero pages as the standard for everything else on the site; send-in is included as a pattern source but explicitly flagged as NOT a quality reference. CLAUDE.md session-start checklist now references it as step 5. Reduces "did we already learn this lesson?" recall loops in future sessions.
- **2026-05-07** (uncommitted) — **Built the Send IN page** (`/pages/send-in`). Six new sections (hero / inspiration / cycle / form / tips / faq) plus `templates/page.send-in.json`. The page is the funnel target for every "Send IN" CTA across the site. Hero carries the page-level BreadcrumbList + WebPage JSON-LD because it's always present. Inspiration grid uses CSS multi-column for masonry without JS measuring + an inline lightbox (no library, ESC / outside-click / X to close). Cycle section pairs the existing `sendincontent_submissionwheel.jpg` with **dynamic Liquid date-math** (anchor + walk-forward, 120-day curation cutoff, derives next mag number and drop date automatically — one editor field per cycle). Form section embeds JotForm via `jsform` script (Ryan's call over iframe — cleaner appearance, auto-resizes), form ID `232212492042848`. Tips + FAQ accordions both reuse the homepage FAQ mechanics but scoped to their own data-attribute namespaces (`data-theinmag-send-in-tips`, `data-theinmag-send-in-faq`) so they coexist with the homepage FAQ without collisions. NO kid characters anywhere on this page (Ryan's call — funnel page, keep it focused). New pattern documented: [§4.9](#49-liquid-cycling-drop-dates-from-an-anchor) (Liquid drop-date cycling from an anchor + walk-forward — reusable for any recurring fixed-schedule "what's next" copy). Section catalog [§1.5](#15-custom-page-templates) extended with all six new sections; templates table [§1.6](#16-templates) gets `page.send-in.json`. Outstanding inputs Ryan still needs to paste in admin: hero image + alt + attribution; 8-12 inspiration tile images + captions; confirm `next_mag_number` / `next_mag_drop` are correct on release day.
- **2026-05-07** (a5d8006f) — **Competitions page review pass + new patterns.** Multi-commit session refining the competitions hub from MVP to launch-ready, with several reusable patterns extracted along the way. Head commits: `79a4e1cd` (choice gate + 13-character pool + tighter stage) → `d5736059` (top-pick badge, sticker missed-card, headings hidden) → `61a24595` (Fisher-Yates distinct picks, auto-fetched logos, link-audit, SEO uplift) → `eb5e75d2` (drop bunnings + micador, fix 2 URLs, refetch their logos) → `4641cd38` (24 manual logos, top-3 spotlight cap, CSV cleanup) → `8c7d5486` (mobile static-stage + tagline single-line + missed-card --mobile/--desktop variants) → `a5d8006f` (sticky-header-aware scrollTo). New patterns documented: [§3.6](#36-static-stage-on-mobile-via-display-contents-flatten) (display:contents flatten for mobile static-stage), [§4.4 Variant B](#44-random-pool-selection-kid-characters) (large-pool filename-convention), [§4.7](#47-filename-convention-asset-auto-discovery-no-admin-field) (filename auto-discovery for assets), [§5.3](#53-distinct-pick-from-a-random-pool-fisher-yates) (Fisher-Yates distinct pick), [§5.4](#54-choice-gate-state-machine-css-driven-show-hide) (choice-gate state machine), [§5.5](#55-sticky-header-aware-scrollto) (sticky-header-aware scrollTo), [§6.4](#64-visually-hidden-keyword-rich-copy-for-seo) (visually-hidden SEO copy), [§6.5](#65-auto-generated-itemlist-json-ld-from-a-data-array) (auto-generated ItemList JSON-LD). New brand-locked decisions: "top picks" naming + 3-card cap + missed-card visual differentiator + quiz-gate UX. New tooling: `_tools/audit-competitions.py` (combined logo-fetcher + link-verifier, stdlib only). Page recipe at [§10.4](#104-worked-recipe-competitions-page-pagescompetitions) fully rewritten to reflect the launch-ready state (65 comps, 3-card spotlight, character pool, logo+letter rendering, mobile static-stage, SEO uplift). Section catalog [§1.5](#15-custom-page-templates) entry expanded.
- **2026-05-07** (uncommitted, third pass) — **Built `theinmag-competitions.liquid` + page template.** New custom-page section. 69 Aussie kids' comps live in `competitions-database.csv`; a single-source converter (`_tools/build-competitions-data.py`) generates `assets/competitions.json` + `snippets/theinmag-competitions-data.liquid` (parallel-array Liquid via pipe-delimited splits). Static-stage technique (100vh + internal scroll on the list column) is the page's signature. Data architecture: Option C (ship-fast JSON + Liquid) per Ryan's call, with documented migration path to Option A (metaobjects). Spotlight rotation pool = 7 Tier-1 🟢 hot leads from the master MD initially. Mobile: featured tile reorders before list via flex `order`, filters hide behind a "filters" pill.
- **2026-05-07** (uncommitted, second pass) — **Added §9 Kid pattern library.** Per Ryan's prompt: every page or section that calls for a background, decorative surface, or texture should default to a kid creation pulled from the magazine — never synthetic geometric patterns or stock textures. Section captures: the trigger ("STOP and ask Ryan" before defaulting to flat colour), the existing `/assets/` library (blog-image-universal, section_background, HERO, character pools), naming convention going forward (`theinmag-pattern-[surface]-[descriptor]`), six implementation modes (top-anchored gradient blend, full-bleed, decorative corner peek, repeating tile, inline mid-content punctuation, image-on-image overlay), and a "when to ask, when to grab" decision tree (card covers safe to grab; section/hero anchors require Ryan-yes). The Page Recipe template now has a separate "Anchoring kid pattern" slot (distinct from the hero kid creation) so it's checked every time a new page is briefed.
- **2026-05-07** (uncommitted) — **Initial creation.** Captures the system state through commit `26d0a427` (Field notes article template + mobile blog index polish). Section catalog covers all 17 theinmag sections, 2 snippets, the 5 custom templates. Mobile playbook records the specificity-prefix pattern (real bug that cost a session round-trip), full-bleed negative-margin trick, headroom transform-target gotcha, scroll-snap rail recipe, flex-`order` reorder, and `vh` for hero height. Liquid section captures period-strip, namespace `field_notes`, articles[handle] indexing, kid-character random pool, schema gotchas, asset 1MB limit, Dawn `div:empty` rule. JS section captures headroom delta-anchoring, scroll-driven custom property pattern, React-friendly input setter for admin automation. Editorial voice cheat sheet covers all locked rules including the 2026-05-06 lowercase-no-period revision. Page recipes include the template + worked examples for homepage / blog index / single article.
