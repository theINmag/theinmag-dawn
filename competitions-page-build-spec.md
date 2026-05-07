# Competitions page - build spec

This is the build brief for theINmag's competitions hub - a single landing page where Aussie kids, parents and teachers can discover real competitions to enter. It's the "open doors" page for the whole site: not a feed, not a blog, an opportunity directory. Inspiration sits somewhere between the blog index (editorial polish) and a wall-art product index (browsable, filterable, alive).

**Read these first (in order):**
1. `CLAUDE.md` - brand fundamentals, safety rules, session-start checklist
2. **`theinmag-pattern-library.md`** - the cornerstone style guide. Every pattern this page needs (specificity prefix, scroll-snap rails, full-bleed mobile, headroom header, kid-pattern library §9) is already documented. Read it before you write a single rule.
3. `theinmag-design-tokens.md` - colours, type, spacing, shadows
4. `theinmag-design-principles.md` - philosophy when judgment is needed
5. **`competitions-database-master.md`** - the 68-competition source document. Tag taxonomy, block structure, category breakdown all live here.
6. **`competitions-database.csv`** - the same 68 competitions in flat-file form for whichever data architecture we pick.
7. Memory files (auto-loaded): `feedback_premium_photo_text`, `feedback_kid_characters`, `reference_kid_character_pattern`, `feedback_inter_for_blog_titles`, `feedback_shopify_schema_url_default`, `feedback_dawn_empty_div_hide`, `feedback_match_section_bg_to_artwork_ground`

**Where it lives:**
- New section: `sections/theinmag-competitions.liquid` (single big section, like the editorial index)
- Wired up via `templates/page.competitions.json` (or whatever Ryan names the page; default to handle `/pages/competitions`)
- Linked from primary nav under "Get Involved" (or wherever the sitemap currently puts it - check `theINmag_Sitemap_v2_2.md`)

---

## Page intent (one sentence)

A static, browsable directory of real Aussie competitions for kids - filterable by age / state / field / cost / format - so a parent or teacher can land here and find something to enter inside 30 seconds.

The whole point: kids being PUBLISHED in theINmag is one path to creative recognition. Entering competitions is another. This page makes the second path effortless.

---

## The shape (top to bottom)

### Section 1 - The three big buttons (entry choice)

Three large, sticker-style, kid-art-flavoured buttons sitting on a kid-pattern background. The user picks one to filter the rest of the page:

- **Art** (filters to art / photography / film / dance / performance / music)
- **Writing** (filters to writing / poetry / reading / spelling)
- **Everything** (no filter - shows the full 68)

**Behaviour:**
- Each button is fat (~140px tall), playful, slightly hand-drawn feel - sticker shadow, slight rotation per button (one tilts -2deg, one 0, one +1.5deg).
- On hover (desktop): scale + bounce.
- On click: bounce *off* the page (scale-up briefly then translate-up + fade) while the page below smoothly scrolls into view. Spring easing - cubic-bezier(.34, 1.56, .64, 1) or similar overshoot.
- The selected category becomes the pre-filled value of the category dropdown in Section 2.
- The buttons collapse to a small inline tab strip at the top of the filter bar after first selection (so the user can re-pick without scrolling back).
- `prefers-reduced-motion: reduce` - skip the bounce; just fade.

**Typography:** Post Regular for the button word, lowercase, no period (per `theinmag-pattern-library.md` §7). Inter for any small subtext.

### Section 2 - Filter bar

A horizontal bar with these controls (left to right):

- **Search** - free-text across name + pitch + tags. Debounce 200ms.
- **Category** dropdown - pre-filled from the button choice. Options: Art, Writing, Photography & Film, STEM & Maths, Performance & Music, Social Good, Everything.
- **Age** dropdown - 4-6 / 7-9 / 10-12 / 13-16 / All ages.
- **State** dropdown - National / NSW / VIC / QLD / WA / SA / TAS / NT / ACT.
- **Cost** dropdown - Free / Paid / Paid-optional / Any.
- **Format** dropdown - Online / Postal / School-entry / Individual / Team / Any.
- **Clear filters** text link (right side).

The bar **sticks to the top of the viewport on scroll** (sticky, top: var(--header-height)). The headroom header pattern (§5.1) auto-hides the chrome above it, but the filter bar stays visible while the list scrolls beneath it.

Mobile: the bar collapses behind a single "Filter" button that opens a bottom-sheet drawer with all the same controls, plus an "Apply" button. The search field sits permanently visible above the button.

### Section 3 - The two-column scroll zone (the heart of the page)

This is the section Ryan flagged as unusual: **the background does not scroll** while the content scrolls inside it. Think "static stage, moving content."

**Background:**
- A randomised kid-pattern from §9 of the pattern library (one of three pre-approved options - confirm with Ryan which three).
- Full-viewport. `position: sticky; top: 0; height: 100vh` on a wrapper, OR a fixed-position layer scoped to this section's bounds via `position: sticky` on a parent and `position: absolute; inset: 0` on the pattern with `clip-path` containment. Pick whichever holds up better on iOS Safari (sticky-clip is safer, fixed-position breaks on iOS within a transformed ancestor).
- The pattern itself is translucent (opacity ~0.18) so the white tile content reads cleanly on top.
- One of the three randomised patterns picked per page-load (hashed by date so it's stable for the day - same idea as `theinmag-mission.liquid` random-of-three but daily-stable rather than per-load).

**Foreground content** (scrolls over the static background):

A 2/3 + 1/3 grid:

#### Left column (2/3 width) - the chronological competition list

- A vertical stack of **competition tiles**, sorted by closing date (soonest first), with closed comps pushed to the bottom under a "Closed for 2026" subheading.
- Each tile = horizontal layout: **logo/cover image (left, ~30%) + info (right, ~70%)**. Roughly 1.6x the height of a blog index card so the info has room.
- Tile styling: white surface, soft shadow (token), 24px border-radius, 24px padding, 16px gap between tiles.
- Tile content (right side):
  - Topic chip (top, small caps, Inter, coloured per category - art=coral, writing=mint, photography=sky, stem=purple, performance=peach, social-good=cream)
  - Title (Inter 700, sentence case, lowercase, no period - per `feedback_inter_for_blog_titles`)
  - One-line pitch summary (Inter 400, ~2 lines max, line-clamp)
  - Quick-see strip: closing date • cost • state • age • format - Inter small caps, separated by ` · `
  - State badge: **live now** (green dot) / **opens in N days** (amber) / **closed for 2026** (grey). Computed from CSV `Closing date 2026` field.
  - "Enter →" button (right side, vertically centred) - opens the competition's external website in a new tab. `rel="noopener noreferrer"`.
- Click anywhere on the tile = open the comp website in a new tab. The button is just visual emphasis.

**The "click-click scroll feel"** Ryan asked for:
- CSS `scroll-snap-type: y mandatory` on the list, `scroll-snap-align: start` on each tile - this gives the wheel-of-pegs feel for free.
- Optional enhancement: a tiny tactile click sound on snap (Web Audio, ~80Hz pluck, -24dB). Toggle off by default - confirm with Ryan whether to ship sound at all (audio cues are polarising).
- `prefers-reduced-motion: reduce` - drop the snap entirely, plain scrolling.

#### Right column (1/3 width, sticky) - the rotating featured tile

- A single tile that's bigger and louder than the list tiles. Hero-card energy.
- Sticky to the top of the column (`position: sticky; top: calc(var(--filter-bar-height) + 24px)`).
- **Rotates every 10 seconds** through a curated list (admin-picked, configured via section settings - block-type "featured comp" with a pointer to one of the 68 entries by ID).
- Smooth crossfade transition (300ms opacity).
- Pause rotation on hover (so the user can read it).
- This is the spotlight - typically the brand-led / cross-promo / 🟢 hot-lead comps from the master MD.
- Same tile language as left-column but bigger image (cover on top, info below) and includes the full pitch (3 sentences) rather than the 1-line summary.
- Heading above it: small Post Regular wordmark "spotlight" or "featured" (lowercase, no period).

#### Below the right column - the "missed one?" form

- Card with the heading "have we missed a competition?" (Inter 700, sentence case, no period).
- Short copy: "Tell us about it. We'll add it next sweep."
- "Suggest a comp" button - opens a **lightbox modal** with a JotForm-embedded form (or Shopify contact form fallback). Form fields: comp name, website, age range, state, your name (adult), your email (adult), short pitch.
- Per CLAUDE.md: form is adult-only - the field labels make that explicit, and we never collect contactable details from kids.
- Lightbox closes on backdrop click + ESC.

### Section 4 - Page footer transition (small)

- A single closing line: "fresh comps added every fortnight. last updated [DATE]." (Inter, sentence case, italic, centred, small).
- Pulls `last_updated` from a section setting (set once per refresh sweep).
- Below that, the global footer takes over.

---

## Data architecture - the call to make

The 68 competitions need to live somewhere. **Three options to discuss with Ryan before coding:**

| Option | Pros | Cons |
|---|---|---|
| **A. Shopify metaobjects** (one definition `competition` with all CSV fields as fields) | Editable in admin, queryable via Liquid, future-proof, links to images via Shopify Files | Setup overhead - 25+ field definitions to create. Ryan or I would need to drive Chrome MCP through admin (we've done it before, see `feedback_shopify_schema_url_default`) |
| **B. Section blocks** (each comp = a block in the section schema, fields filled in theme editor) | No metaobject setup; ships fast | Schema has a hard block limit (50 - we have 68); admin UX gets clunky past 30 blocks; theme settings file balloons |
| **C. JSON file in `/assets/` + Liquid include** | Fastest to ship; full data control via the .csv → JSON conversion | No admin editing - any edit needs a code push; logos still need Shopify Files anyway; not Ryan-editable |

**Recommendation pre-Ryan:** Option A. The block limit kills B, and C costs us Ryan's editing autonomy long-term. The metaobject setup is one painful afternoon and we never have to think about it again. But this is Ryan's call.

If Option A: image fields point to Shopify Files entries (logos go in the Drive folder per the master doc, get TinyPNG'd, then bulk-uploaded to Shopify Files - separate task).

---

## Tile state logic (closing date computation)

Per CSV `Closing date 2026` column. Three states, computed in Liquid:

```liquid
{%- assign close_date = comp.closing_date_2026 | date: '%s' -%}
{%- assign now_ts = 'now' | date: '%s' -%}
{%- assign days_until = close_date | minus: now_ts | divided_by: 86400 -%}

{%- if days_until > 30 -%}
  {%- assign comp_state = 'opens-in' -%}
{%- elsif days_until > 0 -%}
  {%- assign comp_state = 'live-now' -%}
{%- else -%}
  {%- assign comp_state = 'closed' -%}
{%- endif -%}
```

(Adjust as needed - some comps have rolling/annually-shifting dates and the CSV says "TBC". Those = "registrations opening soon" state, fourth state.)

Closed comps still render (good for SEO and "see last year's winners" energy) but are demoted to a separate stack at the bottom with reduced opacity.

---

## Mobile considerations (mobile-first per CLAUDE.md)

- **Three buttons** stack vertically (each ~80px tall instead of 140), tap-targets stay generous.
- **Filter bar** collapses to a single "Filter" pill button at top right; opens a bottom-sheet drawer (full-width modal slides up from bottom). Search input stays inline above the pill.
- **2/3 + 1/3 grid** stacks: featured tile sits *between* the buttons and the list, then the chronological list runs full-width below it.
- **Static background** still applies on mobile but at lower opacity (~0.12) and `background-size: 200% auto` so the pattern reads at thumb-size.
- **Click-click scroll**: scroll-snap stays on; sound stays off on mobile by default (mobile sound = annoying).
- Apply the specificity-prefix pattern from §3.1 of the pattern library on every mobile rule. (We've burned hours on this before - don't skip the prefix.)

---

## Tag taxonomy reference (from master MD)

Already established and locked. Use these exact strings:

- **Ages:** `ages-4-6`, `ages-7-9`, `ages-10-12`, `ages-13-16`, `all-ages`
- **States:** `national`, `nsw`, `vic`, `qld`, `wa`, `sa`, `tas`, `nt`, `act`, `regional-only` (paired with state)
- **Field:** `art`, `writing`, `poetry`, `photography`, `film`, `music`, `stem`, `coding`, `maths`, `science`, `performance`, `dance`, `comedy`, `spelling`, `reading`, `history`, `environment`, `culture`
- **Cost:** `free`, `paid`, `paid-optional`
- **Format:** `online`, `postal`, `school-entry`, `individual-entry`, `team`

Filters in the UI map to these tag groups. Multi-tag entries (e.g. `ages-7-9 ages-10-12`) match either filter selection.

---

## Brand voice (locked - per CLAUDE.md)

- **No em dashes anywhere.** Hyphens only.
- **Sentence case headings, lowercase, no trailing period.** Use the strip-period filter from §4.1 of pattern library.
- **"Creation" not "work"** - if any UI copy says "your creative work", change to "your creation".
- **Smart brevity** - tile pitch lines max 2 lines, button labels one word, dropdown options as short as possible.
- **"theINmag"** keeps its specific casing wherever it appears in copy.
- **Adult-only on every form** - never collect contactable details from kids. The "missed one?" form labels make this explicit.

---

## AEO / schema requirements

Per CLAUDE.md:

- **ItemList JSON-LD** for the page (the 68 comps, each with name + URL + description + state). This is a real SEO win - Google can render a competitions list on the SERP.
- **Event schema per competition** (within the ItemList): `@type: Event`, `name`, `startDate` (closing date as proxy), `location` (state), `eligibleRegion`, `audience.suggestedMinAge` / `suggestedMaxAge`, `offers.price` (if free, 0; if paid, the amount).
- **BreadcrumbList**: Home > Competitions.
- **H2 phrased as a question** somewhere on page - candidate: "what competitions are open right now?" as the heading above the chronological list.
- **FAQPage JSON-LD** for the bottom of the page with 4-5 Qs ("how do I enter a kids' art competition in Australia?", "are these competitions free?", "can my school enter on my child's behalf?", etc.) - copy in `competitions-database-master.md` under section "FAQ block draft" (CHECK - if not there, draft and ask Ryan).
- **og:image** = a static editorial illustration showing the page concept (kid pattern + comp tiles), or a hero composition. Confirm with Ryan.
- robots.txt + llms.txt already allow the AI crawlers.

---

## Out of scope (don't build now)

- Per-competition detail pages (would be a separate template - revisit if SEO data shows kids searching for individual comp names through us).
- Comp submission tracking / "I entered this!" badge system.
- Calendar view / iCal export.
- Email reminders for closing dates (later, via Klaviyo, separate project).
- User accounts / favourites - we don't have logged-in kids and won't.
- Comments or reviews on comps (off-brand).
- Print-CSS optimisation.

---

## What I'd like Claude to do first

1. Read this file, then **`theinmag-pattern-library.md` end to end** (cornerstone), then `CLAUDE.md`, then design tokens + principles.
2. Read `competitions-database.csv` and `competitions-database-master.md` to ground all subsequent design choices in the actual data.
3. Run the session-start checklist from CLAUDE.md item §123-124 - especially the pattern-library Maintenance log diff.
4. **Confirm three calls with Ryan before writing any code:**
   - **Data architecture** - Option A (metaobjects), B (section blocks), or C (JSON in /assets). Recommendation is A, but flag the metaobject setup overhead.
   - **Click-click scroll feel** - CSS scroll-snap only (free, smooth, ships now), or scroll-snap + tiny audio cue (heavier, more on-brand, polarising). Default to A for ship; B as a follow-up.
   - **Featured tile rotation** - rotate through an admin-curated list (Ryan picks the order), random rotation (no curation), or algorithmic (date proximity / category match). Recommend admin-curated for editorial control.
5. Confirm with Ryan **which three kid-patterns** from §9 of the pattern library should rotate as the static background.
6. Plan in checklist form. Build the section. Wire it via `templates/page.competitions.json`. Test on Pixel 6 before desktop (per CLAUDE.md mobile-first rule). Commit at meaningful checkpoints.

---

## Reference quote from Ryan (decision context)

> "I'm picturing this whole page not moving which seems strange. I haven't seen this done before. What I mean by that is the background remains static until they get to the very very bottom competition and then it'll scroll down to the next section or our footer depending on what we decide."

This is the design north star for Section 3 - the static-stage, moving-content feel. If during build it isn't holding up (iOS Safari weirdness, performance, accessibility), come back to Ryan rather than abandoning the concept silently.

---

*Spec last updated: 2026-05-07. Source data: 68 competitions documented across 6 categories. Pattern library is the cornerstone reference - read it first.*
