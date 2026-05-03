# theINmag Homepage Build Spec
### The detailed homepage section-by-section, anchored to getmaude.com structural reference
*Created: May 3 2026 - first draft, expect to iterate with Claude Code in the next session*

---

## What this document is and why it exists

This is the detailed structural spec for the theINmag homepage. It supersedes the homepage section of theINmag_Sitemap_v2_2.md where the two conflict.

**Why a separate doc?** The homepage is the most important page on the site - it sets the visual grammar every other page inherits. Mapping it section-by-section to getmaude.com's structural reference deserves more space than the sitemap can offer without bloating it.

**Why getmaude.com?** Per the project brief, Maude is THE primary structural reference. Their visual grammar (split-screen heroes, big photography over copy, horizontal scrolling press band, full-bleed audience tiles) is what gives theINmag's content the premium frame it deserves.

**Reference screenshots:** stored at `theinmag-dawn/reference/maude/`. Each section below references the specific screenshot it maps to.

---

## Visual DNA - non-negotiables

These rules apply across every section on the homepage. Locked.

- Split-screen patterns - paired image blocks side-by-side on desktop, stacked on mobile
- Big photography carrying the brand - kid creations and real photos do the heavy lifting, copy plays support
- Generous whitespace between sections - never crowded, always breathing
- Mobile is THE design target - desktop is the bonus layer
- Trust signals everywhere - named kid attributions, real testimonials, press logos, ratings
- Minimal copy per section - smart brevity, no fluff, every word earns its place
- All animation respects `prefers-reduced-motion`
- All buttons follow the locked sticker convention (yellow primary, outlined purple secondary, press-down on hover)

---

## Locked content (do not change without explicit Ryan instruction)

- **Hero headline:** "The magazine for creative kids"
- **Hero subhead:** "Where Aussie kids get published - no ads, just creativity"
- **Primary CTA label:** "Grab a membership" (yellow stamp)
- **Secondary CTA label:** "Send IN content" (outlined white on photo background; outlined purple is the default everywhere else)
- **Audience tile labels:** Parents / Teachers / Homeschoolers / Kids (drop the "For" on tiles, keep "For" in nav dropdown)
- **Announcement bar message 1:** "Get ready - Mag [X] dropping in [N] days" (auto-calculated, days only - never hours/minutes)
- **Announcement bar message 2:** "Free shipping on orders over $40" (threshold editable in admin)
- **Section 6 heading:** "Meet Tam, co-founder of theINmag"
- **Section 6 sub-heading:** "Take a peek inside Mag[X] with Tam" (auto-pulls issue number)
- **Section 9 heading:** "Hey adults, come hang with us!"
- **Section 10 heading:** "What we get asked the most"
- **FAQ questions (5, locked order):** see Section 10 - doubt → trust → use → commercial → frequency
- **FAQ answers:** verbatim text locked in Section 10
- **Membership variant names (locked):** 4-Issue Membership / 8-Issue Membership / Rolling Membership
- **Footer newsletter heading:** "A monthly newsletter? Count me IN!"

---

## Section-by-section structure

### Section 0 - Site-wide announcement bar
**Reference:** No Maude equivalent. Site-wide layout component (lives in the layout, not just the homepage). Documented here because it sits above the hero in the visual stack.

**Position:** Sticky strip at the very top of every page. Above the header/nav.

**Pattern:** Two cycling messages with smooth fade transitions.

**Message 1 - Countdown to next issue (auto-calculated):**
- Display: "Get ready - Mag [X] dropping in [N] days"
- More than 1 day: shows day count
- Day of release: switches to "Mag [X] is here!" with CTA link to the product
- **Days only - no hours/minutes mode.** Reasoning: kids who haven't received their mag yet on the exact hour would be disappointed by an hour-precise countdown that ticks past zero. Coarser granularity is kinder to the audience.
- Reads `next_release_date` Shopify metafield (set per release in admin: e.g. `2026-06-10` for Mag10)
- Mag number also driven by metafield/section setting so the bar auto-updates per release - no template edit when Mag 11, 12, etc. drop

**Message 2 - Free shipping promo:**
- Display: "Free shipping on orders over $40"
- Threshold lives in section schema as a setting (changeable in Shopify admin without code edits)
- Optional CTA link to /shop

**Cycle behaviour:**
- Each message visible for ~6 seconds
- Smooth opacity fade between (0.4s ease)
- Pause cycle on hover so visitors can finish reading
- Respects `prefers-reduced-motion`: instant swap with no fade

**Style (using design tokens):**
- Background: inky purple-navy `#2A1F3D`
- Text: cream `#FBF6EA`
- Font: Inter 500, 14px
- Padding: 10-12px vertical desktop, 8-10px mobile, generous horizontal
- Small × dismiss button on the right - cookie-remembered for 7 days

**Schema settings:**
- Toggle on/off per message
- Editable text per message (so promos can be swapped without code)
- Date picker for `next_release_date`
- Issue number text field (e.g. "10")
- Free shipping threshold (number, default $40)
- CTA URL on each message (optional)

**AEO note:** The announcement bar itself isn't AEO-relevant. But the `next_release_date` metafield it reads is the same data feeding the homepage's Latest Issue logic and the Mag10 launch email cadence - one field, multiple uses.

---

### Section 1 - Split-screen hero
**Reference:** `/reference/maude/Maude desktop hero (full split-screen visible).jpg`, `/reference/maude/Maude mobile hero (Chrome DevTools → mobile view → screenshot).jpg`

**Pattern (LOCKED May 3 2026 evening - Option A, mirrors Maude exactly):** Two paired image blocks side-by-side on desktop, stacked vertically on mobile. ALL text content (headline + subhead + both CTAs) sits on the LEFT image only. The right image is pure photography, no text overlay. Text is left-aligned, white, positioned in the lower-left third of the left image. Concentrating text on one side and letting the other breathe is the Maude move that drives the premium blink-test impression.

**Left image - "Kids reading it" (carries all text + CTAs):**
- Background: full-bleed real photo of a kid reading the mag (`HERO_kid-reading-mag.jpg` in `/assets/`)
- Dark gradient scrim from the lower-left corner so white text passes WCAG AA contrast regardless of photo brightness
- Headline (overlay, white): "The magazine for creative kids" - Post Regular, large, left-aligned
- Subhead (overlay, white): "where Aussie kids get published - no ads, just creativity" - Inter regular, smaller, left-aligned, lowercase to match the live Wix site's wording exactly
- Primary CTA: "Grab a membership" (yellow stamp - softer than "Get the Membership", confirmed May 3 2026)
- Secondary CTA: "Send IN content" (outlined white - documented adaptation of the outlined-purple secondary for dark photo backgrounds)

**Right image - "Kids in it" (image-only, no overlay text):**
- Background: full-bleed striking kid creation in warm palette (`HERO_kid-creation-art.jpg` in `/assets/`)
- No headline, no subhead, no CTA, no overlay - pure photography
- The right image's job is to balance the left visually and signal "this is what gets published" without competing with the left's text

**Mobile behaviour:** stacks vertically. Left image on top with all text + CTAs in its lower-left. Right image immediately below, still image-only. Headlines scale via Post Regular's clamp(). CTAs stack vertically full-width on mobile.

**Animation:** subtle scroll reveal as user enters the page (fade up, 0.4s ease, both blocks together so they feel paired rather than sequential). Respects prefers-reduced-motion.

**Trust micro-bar:** sits below both blocks as a full-width strip (no split). Peach background, dark sandy orange text - this is the first place the homepage's locked peach accent introduces itself. Copy: "Printed sustainably in Australia · 100% kid-created · Always ad-free · Tri-annual"

**AEO:** Organisation schema (Ryan + Tam as Person entities), BreadcrumbList schema. H1 is the locked hero headline ("The magazine for creative kids"). Image alt text descriptive and keyword-aware on both images.

---

### Section 2 - Featured products row
**Reference:** `/reference/maude/maude-products-desktop.png`, `/reference/maude/maude-products-mobile.png`

**Pattern:** 4 products in a clean horizontal row on desktop, 2 columns on mobile. Maude-style minimal cards.

**The "busy image" problem:** theINmag's product photography is richer than Maude's studio-clean shots. Solution: generous card padding (24-32px) inside cream `#FBF6EA` cards, plus consistent square crop discipline across all product images. The card breathing room calms the busy-ness; the consistent crop creates rhythm down the row.

**Each card contains:**
- Square product image, full-bleed of card interior (with card padding around it)
- Product name (Inter 600, sentence case)
- Judge.me star rating + review count (small, immediately below name)
- One-line product tagline (e.g. "120 pages, made by Aussie kids, ages 5-13")
- Price (or "From $X" for variant products)
- "Add to cart" button appears on hover (desktop only); always visible on mobile

**Default product order:**
1. Membership (highest value, shown first)
2. Mag10 (or current latest issue)
3. Snack Pack
4. Build a Bundle

**Mobile behaviour:** 2x2 grid, full-width cards. Cards taller because content stacks differently. Touch targets minimum 44px.

**Animation:** scroll reveal with stagger (0.1s between cards). Subtle card lift on hover (transform: translateY(-4px), shadow shifts to card-hover token).

**AEO:** Product schema for each product (price, availability, image, aggregateRating). Section heading "What families are reading" or similar (question-format H2 per AEO rules - workshop with Claude Code).

---

### Section 3 - Press logos band
**Reference:** `/reference/maude/maude-press-band.png` (try to capture mid-scroll if possible)

**Pattern:** Horizontal infinitely-scrolling band: "featured in [LOGO]" repeated across the screen.

**Logo specs:**
- Source files: 600x200px PNG, transparent background, monochrome `#2A1F3D`
- Stored at `/assets/press-logos/`
- Naming: `press-[publication-name].png` (lowercase, hyphens)
- Display height: ~60px desktop, ~50px mobile (the 3x source handles retina)
- Aim for 6-8 logos populated at launch

**Format:** alternating "featured in" body text + logo image. Both items spaced consistently (large gap between each "featured in [LOGO]" pair so the band doesn't feel cramped).

**Animation:** slow horizontal scroll, never frantic. Pause on hover. Direction: right to left. Speed: tuned so a logo takes ~4-5 seconds to cross the viewport. **Respects prefers-reduced-motion** - if user has it set, the band becomes a static centred row of all logos (no scrolling at all).

**Mobile behaviour:** same scroll behaviour, slightly reduced gap between logos to keep multiple visible at once. Still pause on touch.

**Background:** cream `#FBF6EA`, generous vertical padding (3xl token = 64px desktop). The band sits in its own quiet section with whitespace either side - don't crowd it with adjacent content.

---

### Section 4 - Audience category tiles
**Reference:** `/reference/maude/maude-tiles-desktop.png`, `/reference/maude/maude-tiles-mobile.png`

**Pattern:** 4 full-bleed image tiles in a 2x2 grid on desktop, single column on mobile. Each tile is its own clickable card linking to the relevant audience page.

**Each tile contains:**
- Background: kid creation OR real photo of audience using the mag (e.g. teacher with classroom, parent reading with kid, homeschool family at kitchen table, kid drawing)
- Single-word label, top-left, large text in Post Regular (drop the "For" - just "Parents", "Teachers", "Homeschoolers", "Kids")
- Whole tile is clickable - links to /for-parents, /for-teachers, /for-homeschoolers, /for-kids respectively
- Subtle zoom on hover (transform: scale(1.02), 0.3s ease) - respects prefers-reduced-motion
- No additional copy on the tile - the image and label do the work

**Mobile behaviour:** single column, tiles stack vertically. Each tile maintains full-bleed treatment. Label position consistent.

**Aspect ratio:** tiles are roughly square on desktop (allows the 2x2 to feel balanced). On mobile, tiles can be slightly taller to give photography room.

**Why drop the "For":** Single-word labels carry their own meaning when paired with strong photography. "Teachers" lands harder than "For Teachers" because there's no preposition between the audience and the word. The dropdown nav can keep "For Parents" because dropdowns benefit from prepositional clarity, but the homepage tiles don't need it.

---

### Section 5 - Founders + philosophy block
**Reference:** `/reference/maude/maude-founders-philosophy.png` (Ryan to add)

**Pattern:** Maude-style split layout. Large founder photo on the right (real photo of Ryan, Tam, and Nora, ideally with the van or in-context with the mag). Vertical stack of large text links on the left, each linking to or revealing a short story about a different aspect of theINmag's why.

**Why this section earns its place on the homepage:**
A real photo of the founders is one of the strongest trust signals theINmag has. The "professional friend" voice gets a face. The story (two former teachers in a van publishing kids' creativity) is genuinely moving and hard for AI-generated content farms to fake. Maude proves the pattern converts - elevating it from About page to homepage drives emotional connection right where conversion decisions get made.

**Left column - the anchor links (large Inter regular weight, vertically stacked):**
- "our philosophy" - the three pillars (creativity drives learning, open tasks make learning stick, kids deserve a voice)
- "our standards" - what we never compromise on (no ads, kid-led content, sustainably printed, all proceeds back into the next print)
- "our impact" - the real outcomes (kids seeing themselves in print, schools using it as a teaching tool, families bonding over it)
- "our story" - the founding, the why, two former teachers turned publishers

These four anchor labels are LOCKED to match the Maude pattern. They use universal language that lets the content underneath do the heavy lifting - easier for visitors to scan, easier to evolve the storytelling without renaming sections later.

Note on typography: Maude uses a clean sans-serif here (not their display font). theINmag follows the same logic - use Inter regular weight for the anchor labels, NOT Post Regular. The hand-lettered Post is for personality moments; this section is reflective and editorial, so Inter carries it better.

**Right column - the founders photo:**
- Real photo of Ryan, Tam, and Nora (and ideally the van or a strong in-context environment)
- Full-bleed of the right column on desktop
- Stacks above the text links on mobile (photo on top, links below)
- HERO_-prefixed in the assets folder, e.g. HERO_founders-van-with-nora.jpg
- **[TBD - awaiting Tam selection]** - Tam to choose the specific photo from existing photo library or schedule a new shoot if nothing in-library hits the brief

**The four short paragraphs (one per anchor) - all TBD:**
Each anchor reveals a 40-60 word paragraph when clicked. All four currently TBD - awaiting Tam input.
- [TBD - 40-60 words] "our philosophy" - the three pillars (creativity drives learning, open tasks make learning stick, kids deserve a voice)
- [TBD - 40-60 words] "our standards" - what we never compromise on (no ads, kid-led content, sustainably printed, all proceeds back into the next print)
- [TBD - 40-60 words] "our impact" - the real outcomes (kids seeing themselves in print, schools using it as a teaching tool, families bonding over it)
- [TBD - 40-60 words] "our story" - the founding, the why, two former teachers turned publishers

**Interaction pattern (click-to-reveal accordion):**
- Each anchor label is a clickable accordion trigger
- On click, the corresponding short paragraph reveals underneath the label with a smooth slide-down animation (~0.3s ease)
- Only one anchor revealed at a time - clicking another collapses the open one and opens the new one
- The active/open anchor shifts colour from muted (default state) to bright/active (the "selected" state)
- All four anchors also link through to /our-story with appropriate URL anchor (e.g. /our-story#our-philosophy) so visitors who want the full long-form version can click through after reading the short reveal
- Subtle scroll reveal for the whole section as it enters viewport

This click-to-reveal pattern is the magic of Maude's version - the messaging is hidden until invited, which respects the visitor's attention and rewards engagement. Don't auto-rotate, don't auto-open. Always start with all four collapsed.

**Default state on page load:** all four anchors visible as muted text, none revealed. The first time the visitor scrolls into the section, a subtle pulse animation on "our philosophy" hints that they're tappable (one-time only, dismisses after first click anywhere in the section). Respects prefers-reduced-motion.

**Background:** dark feature treatment - either deep purple `#5D3A7A` or the inky purple-navy `#2A1F3D`, with cream text. This visually separates the section from the lighter cream of the rest of the homepage and gives the founder photo and emotional storytelling the gravitas it deserves. Confirm with Tam which dark colour reads better against the chosen photo.

**AEO:** Person schema for Ryan and Tam (matches /our-story page). Organisation schema reinforces Ryan and Tam as founders.

**Mobile behaviour:** photo on top (full-width, slightly cropped to maintain emotional eye contact), then anchor links stacked vertically below, each tap-revealing its paragraph inline. Plenty of vertical breathing room between each anchor.

---

### Section 6 - Meet Tam + current issue
**Reference:** `/reference/maude/Maude desktop messaging.jpg` and `/reference/maude/Maude desktop founder image and messaging.jpg`. Adapted to put a video front-and-centre rather than a static photo. Folds together what the sitemap originally specced as Section 4 (latest issue feature) and Section 5 (Tam's peek-inside video) - one combined section instead of two.

**Pattern:** Maude-style split layout. Video on the left (the dominant moment), current-issue cover + intro copy on the right. Video does the personality work; the cover provides a "sneaky" but high-impact product placement.

**Why this section earns its place:**
- Tam's voice is one of theINmag's strongest trust signals (mum-to-mum, teacher-to-parent)
- The current cover is the most desirable single visual asset for the brand and deserves high-prominence placement
- A video here gives parents a real face and a real preview before any commitment - kills hesitancy

**Left column - Tam's "peek inside" video:**
- Shopify-native video upload (preferred over YouTube/Vimeo embed for performance and brand control - no YouTube branding bar, no related videos appearing on pause)
- Runtime: 60-90 seconds, swapped per issue release
- Auto-loaded via metafield link so new issue = new video, no template edit needed
- Custom poster frame (a still from the video, NOT a default Shopify gradient placeholder)
- Plays on click only - no auto-play. Respects prefers-reduced-motion (no auto-play in any case)
- Subtle play-button overlay in cream/yellow on the poster

**Right column - Current issue feature:**
- Section heading (Post Regular, large): "Meet Tam, co-founder of theINmag"
- Sub-heading (Inter regular, 18px): "Take a peek inside Mag[X] with Tam"
- Mag number auto-pulled from current-issue product reference - latest = newest
- Cover image (square crop, full-width of column with sticker-style soft drop shadow)
- 1-2 sentence intro: **[TBD - workshop with Tam, 30-40 words max]** - in Tam's voice, leading with a "look what's inside" angle not a "buy now" angle
- Primary CTA: "Get Mag [X]" (yellow stamp button, links to current-issue product page)
- Optional small "NEW THIS MONTH" sticker badge top-right of the cover (yellow stamp circle, Post Regular text)

**Mobile behaviour:**
- Stacks vertically: video on top (full-width, maintains 16:9 aspect), then cover + intro + CTA below
- Cover image at ~70% column width centred, so it doesn't dominate while keeping detail visible
- CTA full-width

**Animation:**
- Subtle scroll reveal as section enters viewport (fade up, 0.4s ease)
- Cover image: gentle hover scale(1.02) on desktop (mirrors the audience tile pattern)
- Respects prefers-reduced-motion

**Colour pair:** Mint pair (light mint background `#D6EAD9`, dark sage `#4A7C5C` for headings) - fresh, growing, "just dropped" energy. The yellow CTA stamp on this background pops cleanly.

**Auto-update mechanism:**
- Shopify metafield `current_issue` (product reference) - points to the latest mag product
- Section reads cover image from this product's primary image
- Section reads issue number from a `issue_number` metafield on the product (e.g. "10")
- Section reads video URL from a `peek_inside_video` metafield on the product
- When Mag11 is added and tagged as `current_issue`, the section updates automatically - no theme edit

**AEO:**
- VideoObject schema for the embedded video
- Product schema reinforced (cover image + name + price + link)
- Person schema for Tam (matches /our-story page)

---

### Section 7 - Reviews (Judge.me-powered)
**Reference:** No direct Maude equivalent. Design fresh, anchored to brand tokens. Sits directly under Section 6.

**Pattern:** Three featured review cards in a row on desktop, single column stack on mobile. Aggregate rating header at the top of the section. Cards use sticker-style rounded shapes with each card sitting on a different colour-pair background to visually distribute the brand palette across the section.

**Why this approach (Shopify best practice for homepage reviews):**
- 3 cards is the sweet spot for social proof without overwhelm. Below 3 looks thin; above 5 competes with the rest of the page and adds load weight
- Aggregate rating (e.g. "★ 4.9 - 247 reviews") does heavier social proof lifting than card count - the number scales as the business grows
- Auto-rotating carousels test poorly (accessibility issues, motion-sensitivity, attention-yanking). Static beats carousel for conversion
- Curated quality > rotated quantity: theINmag's emotionally-weighted reviews (the hospital story, Trent the teacher, the mum whose son found his picture) outperform any generic "great mag!" line - we feature the strongest 3

**Aggregate rating header:**
- Large display: ★ [4.9] - [247] reviews (aggregate auto-pulled from Judge.me)
- The numerical rating uses cherry-magenta `#B8265E` accent for emphasis on the rating count
- Aggregate stars in yellow `#F9C23C` per design tokens
- Stars rendered as SVG (not emoji) for crisp display and brand consistency

**Each review card:**
- Sticker-shape rounded corners (radius xl = 28px per design tokens)
- Soft shadow (Card token: 0 2px 12px rgba(123, 79, 158, 0.08))
- Background: each card uses a different colour pair (suggested launch combination: purple / mint / peach)
- Star rating top of card (yellow sticker stars)
- Review excerpt (Inter regular, 17-18px, generous line-height)
- Attribution line at bottom: "Sarah, mum of 2 - Hobart TAS" (Inter 500, 13px, slightly muted - mirrors the kid attribution pattern from elsewhere on site)
- Optional small reviewer-supplied photo (real, never stock - skip if no photo available)

**Mobile behaviour:**
- Single column, cards stack vertically with consistent gap (lg token = 24px)
- Aggregate rating header centred
- Cards same sticker-shape treatment, full width

**Animation:**
- Scroll reveal with stagger (0.1s between cards)
- Subtle card lift on hover (transform: translateY(-4px), shadow shifts to card-hover token)
- Respects prefers-reduced-motion

**CTA below the cards:**
- Outlined purple secondary button: "Read all [X] reviews"
- Links to /reviews (or scrolls down to embedded Judge.me full feed if a /reviews page isn't built)
- Review count auto-pulled from Judge.me

**AEO:**
- Review schema on each card (author, datePublished, reviewBody, reviewRating)
- aggregateRating schema on the parent section element
- Feeds Google's rich result eligibility for review stars in search

**Auto-update mechanism (per CLAUDE.md key integrations):**
- Inbox Manager Agent flags reviewable emails/DMs
- Ryan approves
- Auto-formatted and added to Judge.me
- Featured 3 selection refreshed quarterly (manual curation - Growth Agent surfaces top performers)

---

### Section 8 - Latest blog posts (theINside)
**Reference:** `/reference/maude/Maude blog index.jpg` and `/reference/maude/Maude blog post.jpg`. Maude's clean 3-up grid is the model.

**Pattern:** Three post cards horizontal on desktop, single column stack on mobile. Maude-style minimal cards with strong featured imagery and editorial typography.

**Section heading:** "What's on theINside" (declarative). Question-format AEO alternative: "What are kids creating right now?" - workshop final wording before build.

**Each card contains:**
- Featured image (1800x1000 per design tokens, lazy-loaded after the first card)
- Date stamp (Inter 500, 13px, slightly muted)
- Post title (Inter 600, 20-22px, sentence case, max 2 lines with ellipsis if needed)
- Excerpt (Inter regular, 16px, max 2 lines with ellipsis, 1.5 line-height)
- "Read more" inline link (Inter 600, dark teal `#2D6878`, underline thickens to 2px on hover)

**Placeholder strategy until blog content exists:**
- Use kid artwork from existing assets folder as featured images (theINmag's design system - Principle 17: kid creations as the visual layer)
- If only 1-2 real posts exist at launch, fill the third with "Coming soon - subscribe to be first to read" treatment rather than removing the section
- Don't ship empty cards - the visual rhythm matters

**Mobile behaviour:**
- Single column, cards stack vertically
- Featured image full-width within card
- Generous spacing between cards (xl token = 32px)

**Animation:**
- Scroll reveal with stagger (0.1s between cards)
- Card lift on hover (transform: translateY(-4px), shadow shifts to card-hover token) on desktop
- Featured image subtle scale(1.02) on hover within card frame
- Respects prefers-reduced-motion

**Colour pair:** Cream pair (default) - keeps the editorial feel calm and lets the featured imagery do the colour work.

**CTA below the cards:**
- Outlined purple secondary button: "See all posts"
- Links to /theinside (slug to be confirmed)

**AEO:**
- Article schema for each card (headline, datePublished, author, image, articleSection)
- Each card link uses semantic `<article>` wrapper
- The cards drive internal link equity to blog posts

---

### Section 9 - Instagram feed (Instafeed by Mintt)
**Reference:** No Maude equivalent. Design fresh.

**Pattern:** 4-6 most recent posts in a clean grid (4-up on desktop, 2-column on mobile). Auto-pulled from theINmag's Instagram via the Instafeed by Mintt app.

**Section heading:** "Hey adults, come hang with us!" (existing live-site copy - aligns with the "professional friend" tone)

**Why Instafeed by Mintt (locked May 3 2026):**
- Free tier covers 50 posts and unlimited views
- 4.9 stars on Shopify App Store (~12,000 reviews as of May 2026)
- Reels supported (auto-pulled in alongside static posts)
- Customisable layout - we can match the brand tokens with custom CSS
- One of the smallest performance footprints in this category (lazy-loading, Instagram Graph API done correctly)
- Auto-updates as posts publish - zero manual maintenance
- There is no native Shopify Instagram feed; Shopify deliberately doesn't ship one because Meta's API keeps changing

**Account requirement:**
- Instagram Business or Creator account (confirmed in place)

**Display:**
- 4-6 most recent posts (configurable via app settings)
- Square crops, consistent grid rhythm
- Hover (desktop): subtle dark overlay with like + comment counts (cream text)
- Tap (mobile): opens the post on Instagram in a new tab

**CTA below the grid:**
- Outlined purple secondary button: "Follow @theinmag"
- Direct link to the Instagram profile
- Opens in new tab (target="_blank" rel="noopener noreferrer")

**Mobile behaviour:**
- 2x2 or 2x3 grid (2 columns) - fits standard mobile width without horizontal scroll
- Touch targets minimum 44px
- Lazy-load posts below the fold

**Animation:**
- Scroll reveal with stagger (0.1s between tiles)
- Hover overlay fade (0.2s ease) on desktop
- Respects prefers-reduced-motion - skip hover overlay animations

**Colour pair:** Cream pair background. The Instagram imagery brings its own colour - the cream lets it lead.

**Performance checkpoint (mandatory per CLAUDE.md "no app without PageSpeed check first"):**
- Benchmark mobile PageSpeed BEFORE Instafeed install
- Install Instafeed
- Re-run PageSpeed mobile
- If score drops below 70 on mobile: revisit (try alternate config, swap to Reputon Instagram Feed, OR fall back to a manual 4-image static tile with weekly update)
- Document baseline + post-install scores for future reference

**Fallback if Instafeed disappoints:**
- Reputon Instagram Feed (similar pattern, slightly heavier)
- Manual 4-image tile (lose auto-update, save all the weight)

**AEO:** No specific schema required. Social proof signal lives in the visual rhythm of fresh content.

---

### Section 10 - FAQ
**Reference:** No direct Maude equivalent. Design fresh, anchored to brand tokens. AEO-critical (FAQPage schema is one of the strongest rich-result drivers and CLAUDE.md treats AEO as non-negotiable).

**Pattern:** Accordion-style, all collapsed on page load, multiple-can-be-open (so visitors can compare answers across questions). FAQPage JSON-LD schema applied for AEO.

**Section heading:** "What we get asked the most" (declarative)

**Brand-voice principle for FAQ questions (apply across the site):**
The QUESTION text uses customer search language (e.g. "Will my child's work actually get published?") while the ANSWER body uses brand language (e.g. "creations from real Aussie kids"). This matches search intent in the question for AEO/SEO discoverability while reinforcing brand voice in the answer for trust. Apply this same dual-voice approach to FAQs on other pages.

**Five questions, locked order (sales funnel logic: doubt → trust → use → commercial → frequency):**

1. Will my child's work actually get published?
2. How does theINmag choose what goes in each issue?
3. How are families actually using it at home?
4. Is the Membership basically the same as a subscription?
5. How often does a new issue come out?

**Card/block design:**
- Each question collapsed by default, full-width row
- Question typography: Inter 600, 18px on mobile / 20px desktop, sentence case
- Caret/chevron icon right-aligned, rotates 0-180deg on expand
- On expand: smooth slide-down ~0.3s ease, answer reveals beneath
- Answer typography: Inter regular, 16px body size, line-height 1.7 (per design tokens body large)
- Generous left padding so answer text aligns slightly indented under question
- Border-bottom thin (1px) between rows for clean separation

**Background:** Cream pair `#FBF6EA`. Optional alternative: cream with soft purple-wave-pattern overlay for visual depth without competing with answer text.

**Animation:**
- Caret rotates 0-180deg on expand
- Answer slide-down with opacity fade, 0.3s ease
- Respects prefers-reduced-motion: instant expand with no slide animation

**Mobile behaviour:**
- Same accordion, full-width questions stack vertically
- Touch targets minimum 44px (current spacing well above this)

**CTA below the FAQs:**
- Outlined purple secondary button: "More questions? Get in touch"
- Links to /contact

**AEO requirements:**
- FAQPage JSON-LD schema with each Question and acceptedAnswer
- All 5 questions are already in question format (no rephrasing required)
- Each question becomes an H3 in the rendered HTML

**Verbatim answer text (LOCKED, polished from Tam/Ryan drafts in May 3 2026 evening session):**

**Q1 - Will my child's work actually get published?**

> Unfortunately, not every kid who submits gets in.
>
> We receive thousands of submissions each issue, and around 300 make it into the magazine. Every page of theINmag is filled entirely with creations from real Aussie kids - so when your child submits, they're being seriously considered for the next issue.
>
> The number one thing we look for? Effort. Personality and heart matter more than technical polish.
>
> Best tip: encourage them to submit something they're truly proud of.

**Q2 - How does theINmag choose what goes in each issue?**

> Every piece of content in theINmag is submitted by a real Aussie kid. We don't write any of it ourselves.
>
> Our team of teachers and artists reviews each submission with genuine care - looking for creativity, personality and heart rather than technical perfection. We celebrate all abilities, all ages, all art forms.
>
> If your child has something they're proud of, or something they're curious about, that's exactly what we want to see.

**Q3 - How are families actually using it at home?**

> Every family finds their own rhythm.
>
> Some pull it out after school, flip to a random page, and ask "what does this make you want to create?" - and the pencils come out.
>
> Others use it as a screen-free wind-down, a school-holidays ritual, or a bedtime read.
>
> Plenty of kids just flick through for inspiration, planning what they'll send IN for the next issue.
>
> However it lands in your home, it tends to spark something.

**Q4 - Is the Membership basically the same as a subscription?**

> Same idea, different feel.
>
> Members never miss an issue - and they're among the first kids to get the new mag when it drops.
>
> Three options:
> - 4-Issue Membership - paid upfront, shipping included
> - 8-Issue Membership - paid upfront, shipping included
> - Rolling Membership - auto-debits before each issue, with a heads-up email beforehand
>
> The result: a real reason for your kid to get excited about the postie again.

**Q5 - How often does a new issue come out?**

> Three times a year - February, June and October.
>
> We wait for kids' creations to come in, and the three-issues-a-year rhythm works beautifully.
>
> Get the Membership and it arrives automatically. No need to remember to order. Members also save a few dollars per issue.

---

### Footer (site-wide layout component)
**Reference:** `/reference/maude/Maude desktop footer.jpg`. Maude's clean, multi-column footer is the model.

**Pattern:** Multi-column layout on desktop (4-5 columns), stacked vertically on mobile. Newsletter signup is the heart of the footer (replaces the homepage inline form per spec direction May 3 2026 - puts the newsletter on every page rather than just the homepage).

**Components (top to bottom on mobile, columns on desktop):**

**Newsletter signup (heart of the footer):**
- Heading: "A monthly newsletter? Count me IN!" (Post Regular, "IN" capitalised per brand pun)
- Sub-line: brief value statement - "Behind-the-scenes, kids' work, and a free e-mag on signup"
- Inline custom form (NOT the Klaviyo popup - this REPLACES the popup so we're not double-asking)
- Email field + first name (optional)
- Submit button: yellow primary "Sign me up"
- GDPR-friendly opt-in checkbox (required)
- Free e-mag offered as signup incentive (delivered via Klaviyo welcome flow)

**Nav columns:**
- Shop (link to /shop, list of product categories)
- Who's it for? (Parents / Teachers / Homeschoolers / Kids - matching primary nav structure)
- About (Our Story / Where we'll be next / Stockists / Schools / Contact)
- Resources (Send IN / Gallery / Blog / Freebies)

**Acknowledgement of Country:**
- Preserved from current site
- Links to dedicated /acknowledgement page (full statement)
- Brief footer version surfaces above the link

**Social icons:**
- Instagram (linked, opens in new tab)
- Facebook (if active)
- TikTok (if active)
- Brand-coloured monochrome icons (cream on inky purple-navy), not the platform's default colours

**Legal links:**
- Privacy Policy
- Terms of Service
- Refund Policy
- Shipping Policy

**Copyright + ABN:**
- Copyright line: "© [current year] theINmag - made by Aussie kids, for Aussie kids"
- ABN displayed beneath (per Australian small business compliance)

**Background:** Inky purple-navy `#2A1F3D` with cream text. Generous padding (4xl token = 96px desktop, 2xl = 48px mobile).

**Mobile behaviour:**
- All columns stack vertically with clear separation
- Newsletter signup remains prominent at the TOP of the footer (not buried below nav links)
- Acknowledgement of Country full-width row
- Social icons centred row
- Legal links wrap as a centred line

**AEO:**
- Organisation schema continues to render in the footer (consistent across pages)
- Sitemap link in footer (helps Googlebot)
- Sitelinks Searchbox JSON-LD potential for the newsletter form

**Note:** Full footer build is its own session. Documenting here so the homepage spec captures the full visual stack the homepage hands off into.

---

## Implementation notes

- Build sections in order, one at a time, with review on the dev server between each
- All sections use design tokens for colours, fonts, spacing, buttons, shadows
- Custom CSS goes in section-level Custom CSS boxes or `assets/theinmag-base.css`
- All sections prefixed `theinmag-` (e.g. `sections/theinmag-hero.liquid`)
- Each section needs a settings schema so Ryan can swap content via Shopify theme editor without code edits
- Image alt text always descriptive and keyword-aware (drives AEO)
- Test on actual Pixel 6 after every section build, not just desktop simulator

---

## Outstanding questions to resolve before building

**Hero (Section 1):**
- [x] Pattern locked May 3 2026 evening: text on left image only (Maude pattern), right image is pure photography. No right-block headline needed.
- [x] Two hero images live in `/assets/` with HERO_ prefix: `HERO_kid-reading-mag.jpg` + `HERO_kid-creation-art.jpg`
- [x] CTA labels locked: "Grab a membership" (primary) / "Send IN content" (secondary)
- [x] Trust micro-bar copy locked: "Printed sustainably in Australia · 100% kid-created · Always ad-free · Tri-annual"

**Press band (Section 3):**
- [x] 6 press logos saved to `/assets/press-logos/` at correct dimensions (600x200 PNG, transparent)
- [ ] Identify the unidentified press logo (currently `media-assets (5).png`)
- [ ] Rename press logos from `media-assets (X).png` to `press-[publication-name].png`
- [ ] Resolve Shopify subdirectory issue: flatten `/assets/press-logos/` files to `/assets/press-*.png` directly OR use Files API
- [ ] Aim for 8 logos before launch (currently 6)

**Audience tiles (Section 4):**
- [ ] Audience tile photography decisions - which 4 images carry the four labels best?

**Founders + philosophy (Section 5):**
- [ ] Founders photo selection (Ryan + Tam + Nora, ideally with the van) - awaiting Tam input
- [ ] Four short paragraphs (40-60 words each) drafted for: our philosophy / our standards / our impact / our story - awaiting Tam input
- [ ] Confirm dark background colour - deep purple `#5D3A7A` or inky purple-navy `#2A1F3D` (depends on chosen photo)

**Meet Tam + current issue (Section 6):**
- [ ] Tam intro copy (30-40 words) - workshop with Tam
- [ ] Initial Mag10 peek-inside video uploaded and `peek_inside_video` metafield set
- [ ] Custom video poster frame extracted from video
- [ ] `current_issue` product reference set in Shopify admin
- [ ] `issue_number` metafield populated (e.g. "10")

**Reviews (Section 7):**
- [ ] Initial 3 featured reviews curated and added to Judge.me before launch (suggested: hospital story + Trent the teacher + one parent voice)
- [ ] Decide which 3 colour pairs the launch cards use (suggested: purple / mint / peach to spread the palette)
- [ ] Confirm /reviews page exists at launch OR "Read all" scrolls to embedded full feed

**Latest blog posts (Section 8):**
- [ ] Final section heading wording (declarative "What's on theINside" or question-format "What are kids creating right now?")
- [ ] Identify 3 launch posts OR placeholder card treatment using kid artwork
- [ ] Kid artwork selection for placeholder featured images
- [ ] Decide blog URL slug (/theinside vs /blog vs /journal)

**Instagram feed (Section 9):**
- [ ] Run PageSpeed mobile baseline before Instafeed install
- [ ] Install Instafeed by Mintt and connect the @theinmag account
- [ ] Re-run PageSpeed mobile and document delta (target 70+ on mobile)
- [ ] Custom-CSS the Instafeed grid to match brand spacing/radius/shadows
- [ ] Confirm exact Instagram handle for the "Follow" CTA

**FAQ (Section 10):**
- [ ] Final section heading wording confirmation ("What we get asked the most" - default)
- [x] All 5 question/answer pairs locked verbatim in spec

**Announcement bar (Section 0):**
- [ ] `next_release_date` metafield set in Shopify admin (initial value: `2026-06-10` for Mag10)
- [ ] Issue number setting initialised
- [ ] Free shipping threshold confirmed ($40 default)
- [ ] Decide whether dismiss button stays (cookie-remembered for 7 days)

**Reference materials:**
- [x] Reference folder created at `/reference/maude/`
- [x] 12 Maude screenshots in place (hero, products, press, tiles, founders, footer, blog, messaging - desktop + mobile mostly covered)
- [ ] Optional: product detail page (PDP) screenshot for product-page work
- [ ] Optional: mobile versions of press band, founders, footer, blog

**Hero v1 archive:**
- [x] `theinmag-hero.liquid` renamed to `theinmag-hero-v1-archived.liquid`
- [x] Schema name updated to "theINmag hero (v1 archived)"
- [x] Removed from `templates/index.json`

---

## Change log

- May 3 2026 (late evening) - **Section 1 hero v2 locked + built.** Pattern decision: Option A (Maude exact pattern) - text + CTAs concentrate on left image, right image is pure photography. Right-block headline TBD removed. Headline stays "The magazine for creative kids" (Post Regular, white, left-aligned), subhead "where Aussie kids get published - no ads, just creativity" (Inter, white, lowercase to match live Wix site). CTA labels softened: "Grab a membership" (was "Get the Membership"), "Send IN content" (was "See Inside" / "Send IN your creation"). Trust micro-bar copy refined: "Printed sustainably in Australia · 100% kid-created · Always ad-free · Tri-annual". New CSS variant `theinmag-btn--secondary-on-image` (outlined white) for secondary CTAs on dark photo backgrounds - outlined purple stays the default everywhere else. Trust strip uses peach pair (`#FCDDB8` bg, `#D9783A` text) - first appearance of the locked homepage peach accent. Built as `sections/theinmag-hero.liquid`, wired into `templates/index.json` as the first section.

- May 3 2026 (evening) - **Major spec expansion.** Sections 6-10 + Footer + Section 0 (site-wide announcement bar) all specified in detail. Sitemap reconciliation: original 15 sections collapsed to 10 + footer (sitemap Sections 4 + 5 folded into our Section 6 "Meet Tam + current issue"; sitemap Section 13 newsletter moved to footer; sitemap Sections 7 gallery + 8 how-it-works + 9 featured kids carousel deferred or dropped). FAQ section question count changed from sitemap-default 4 to 5; new question added: "How are families actually using it at home?" Order rationale: doubt → trust → use → commercial → frequency. All FAQ answers drafted by Ryan/Tam and polished to brand voice in this session, locked verbatim. New principle introduced: question-voice-vs-answer-voice (questions in customer search language for AEO match, answers in brand language for trust). Instagram feed app locked: Instafeed by Mintt with PageSpeed checkpoint required per CLAUDE.md. Announcement bar locked to days-only countdown (no hours/minutes - kid-first reasoning). Membership variant names locked: 4-Issue / 8-Issue / Rolling Membership. Hero v1 archived: `theinmag-hero.liquid` renamed to `theinmag-hero-v1-archived.liquid` and removed from `templates/index.json`. Reference folders created and populated: `/reference/maude/` (12 screenshots), `/assets/press-logos/` (6 of target 8 logos at 600x200 PNG).

- May 3 2026 (afternoon update 2) - Section 5 anchor labels LOCKED to match Maude pattern: "our philosophy / our standards / our impact / our story". Interaction pattern updated to click-to-reveal accordion (only one open at a time). Typography clarified: Inter regular for anchor labels, not Post Regular.
- May 3 2026 (afternoon) - Section 5 (founders + philosophy) added after spotting the Maude pattern. Photo requirements specified, dark-background treatment proposed.
- May 3 2026 - first draft created. Sections 1-4 specified in detail. Sections 5+ flagged for next-session work.
