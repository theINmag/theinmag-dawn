# theINside Visual Style Guide
### How design tokens render on the blog
*Created: May 5 2026 - anchored to the homepage build at 127.0.0.1:9292 as the in-house reference. This document tells Claude Code how to apply the design tokens specifically to blog elements so the blog feels like an editorial extension of the homepage, not a separate template.*

---

## What this document is for

The design tokens file (`theinmag-design-tokens.md`) defines colours, fonts, spacing as raw values. The design principles file defines the philosophy. This file is the bridge - it tells Claude Code "for the blog index card, use this exact combination of token values, this typography stack, this spacing rhythm, this hover state."

If the design tokens and this guide conflict, tokens win (tokens are the single source of truth for colour values etc.). Where this guide adds specifics not covered by tokens, this guide is the reference.

---

## Inheriting from the homepage

The homepage build sets the visual register the blog follows. Specifically:

**The cream-on-cream card pattern.** Homepage product cards (Membership / Single issue / Build a bundle) sit on a cream `#FBF6EA` panel, with an even lighter cream interior. Blog cards inherit this exact pattern.

**Post Regular for headlines, Inter for body.** Big chunky hand-drawn caps for top-of-page headlines (matching "THE MAGAZINE FOR CREATIVE KIDS"). Sentence-case lowercase Post Regular for blog post titles. Inter regular for all body copy and supporting text.

**Cursive accents for personality moments.** The "made by kids, for kids" sticker uses a small cursive style. On the blog, this style appears in: section labels ("more for you.", "from the founders.", "field notes from..."), the optional sticker top-left of the index header, and inline pull-quote attributions.

**Yellow CTAs `#F9C23C`, dark text `#1a1a1a`.** Always with the rounded-pill button shape from the homepage. Hover state: purple `#7B4F9E` background, white text. Same convention as homepage "GRAB A MEMBERSHIP" / "SEND IN CONTENT" buttons.

**Generous whitespace.** Homepage sections are visibly breathing - never crowded. The blog inherits this. Minimum vertical spacing between sections: `64px` (3xl token) on desktop, `48px` (2xl) on mobile.

**Real photography always.** The split-screen hero on the homepage works because both images are real (kid reading the mag, kid creation art). The blog cover images follow the same rule - real attributed kid creations, never stock, never AI.

---

## Homepage screenshot reference (May 5 2026)

The blog inherits its visual register directly from the homepage build at `127.0.0.1:9292`. Five reference screenshots are stored at `theinmag-dawn/reference/homepage/` showing the actual rendered state. Specific patterns to inherit verbatim:

**The yellow cursive sticker in the top-left.** "MADE BY KIDS, FOR KIDS" in Caveat-style script on a yellow circular blob, top-left of the header. This sticker stays put on every page including the blog index and post pages - it's a brand-anchor element. Do not remove it on the blog.

**Cursive accents punctuate everything.** Caveat appears in: the announcement bar's "GET READY" lead-in, the days countdown number, the "SEND IN CONTENT" yellow sticker button, kid creation captions ("PEPE B. | EPSOM VIC, AGE 10"), the "MEET TAM" section heading on a peach paint-swatch backing, the "DESIGNED WITH YOU IN MIND" overlay on the audience tiles, "Seen IN" before each press logo, "EMPOWERING" and "SUPPORTING" callouts in the trust band copy. The pattern: Caveat is the brand's voice-of-warmth — used for moments that need to feel hand-touched, never for body copy or extended reading.

**On the blog specifically, Caveat appears in:**
- The "more for you." section heading (Post Regular for the body of the heading, but consider a small Caveat accent line above it)
- Cover image captions on post pages — "WATERCOLOUR BY ELI, AGE 8, CASTLEMAINE VIC. SENT IN FOR MAG07." in caps Caveat at 14px is exactly the homepage's kid-creation caption pattern (see Pepe B. caption in screenshot 2)
- Topic tag styling on post cards — small caps Caveat as an alternative to Inter caps for added warmth
- Optional "from the founders" rail label
- Newsletter signup heading-of-the-heading ("a monthly newsletter?" cursive over "count me IN!" Post Regular)

**The painterly orange backing behind the logo.** The "theINmag" wordmark sits on a hand-painted orange brush stroke. This is a recurring motif - the same brush-stroke-as-backing pattern appears behind "MEET TAM" (peach), behind cursive labels, behind callout phrases. On the blog, the "more for you." section heading could optionally use this same backing for the "you." part. Use sparingly - one or two instances per page maximum.

**Decorative kid creation anchors.** The trust band uses Pepe B's pink-and-green pea-fairy as a left-side anchor. The standards/impact/story section uses Ella S's cat illustration. The Meet Tam section uses Elsie W's dingo creation. Pattern: a single attributed kid creation as a decorative anchor for any section that's heavy on text. The blog inherits this - long-form post bodies can have a single small kid creation anchored mid-page (50-80px wide, attribution caption underneath, decorative not load-bearing).

**Announcement bar persists on the blog.** The dark purple (`#2A1F3D` or close) announcement bar with "GET READY - Mag10 dropping in 35 days · Free shipping on orders over $40 🚩" cycles on every page including blog index and post pages. Do not hide it on the blog.

**Header chrome is identical.** Same yellow sticker top-left, same nav (note: nav currently reads "Blog" — see briefing prompt for the rename to "theINside"), same orange-painted logo, same Shop link, cart icon, yellow "SEND IN CONTENT" sticker button. Header is global, never altered per page.

---

## Typography stack

```
Heading font (post titles, section headings):
 font-family: 'Post Regular', 'Fraunces', Georgia, serif
 font-weight: 400
 letter-spacing: -0.02em
 line-height: 1.15

Body font (post body, captions, supporting text):
 font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
 font-weight: 400
 letter-spacing: normal
 line-height: 1.8

Cursive accent font (section labels, sticker text):
 font-family: 'Caveat', cursive
 font-weight: 500
 letter-spacing: 0.01em
```

**Size scale on the blog:**

| Element | Desktop | Mobile | Font |
|---|---|---|---|
| Index header tagline ("theINside") | 56px | 40px | Post Regular |
| Index subhead | 22px | 18px | Inter regular |
| Section label ("more for you.") | 28px | 22px | Post Regular |
| Featured post title | 48px | 32px | Post Regular |
| Post page title | 56px | 36px | Post Regular |
| Post H2 | 32px | 24px | Post Regular |
| Post H3 (rare) | 22px | 20px | Post Regular |
| Post body | 18px | 17px | Inter regular |
| Post card title | 22px | 20px | Post Regular |
| Post card excerpt | 15px | 14px | Inter regular |
| Topic tag (above title) | 13px caps | 12px caps | Inter 600, letter-spacing 0.08em |
| Byline | 14px | 13px | Inter regular |
| Read time | 13px | 12px | Inter regular, color text-muted |
| Caption (under cover image) | 13px | 12px | Inter regular, color text-muted |
| FAQ question | 18px | 17px | Inter 600 |
| FAQ answer | 16px | 15px | Inter regular |
| Quick Answer label | 13px caps | 12px caps | Post Regular, letter-spacing 0.1em |
| Quick Answer body | 17px | 16px | Inter regular |

---

## Colour application

| Element | Background | Text | Accent |
|---|---|---|---|
| Page background | `#FDFAF5` (warm off-white) | `#1a1a1a` | - |
| Post card | `#FBF6EA` (cream panel) | `#1a1a1a` | - |
| Cover image caption | transparent | `#6b6b6b` (text-muted) | - |
| Topic tag | transparent | `#7B4F9E` (purple) | - |
| Quick Answer block | `#FBF6EA` (cream) | `#1a1a1a` | left border 3px `#F9C23C` (yellow) |
| Inline "carry the idea further" | `#f0eaf8` (light purple) | `#1a1a1a` | - |
| Pull quote (when used) | transparent | `#1a1a1a` | left border 3px `#7B4F9E` (purple) |
| FAQ question | transparent | `#1a1a1a` | - |
| FAQ answer | transparent | `#1a1a1a` | - |
| "more for you." card | `#FBF6EA` (cream panel) | `#1a1a1a` | - |
| Newsletter signup block | `#f0eaf8` (light purple) | `#1a1a1a` | yellow CTA button |
| Active filter pill | `#F9C23C` (yellow) | `#1a1a1a` | - |
| Inactive filter pill | transparent | `#1a1a1a` | 1.5px outline `#1a1a1a` |
| Hover filter pill | transparent | `#7B4F9E` (purple) | 1.5px outline `#7B4F9E` |
| Active topic chip | `#7B4F9E` (purple) | `#FFFFFF` | - |
| Inactive topic chip | transparent | `#6b6b6b` | 1px outline `#ede8e0` |
| Inline link in body | inherit | `#7B4F9E` (purple) | underline 2px |

The dark feature treatment (`#5D3A7A` deep purple background with cream `#FDFAF5` text) is reserved for the homepage "our standards / our impact / our story" section AND high-emotional-weight Tier 3 brand moments. The blog does NOT use the dark feature treatment except possibly on a single section of the optional founders rail, AND only if it earns it. Default: keep the blog light, breathing, editorial.

---

## Spacing rhythm

Token reference (from design tokens file): `xs: 4 / sm: 8 / md: 16 / lg: 24 / xl: 32 / 2xl: 48 / 3xl: 64 / 4xl: 80`.

| Element | Spacing |
|---|---|
| Between page sections | `3xl` desktop / `2xl` mobile |
| Between post cards in grid | `xl` (gap) |
| Between cover image and byline | `lg` |
| Between byline and Quick Answer | `xl` |
| Between body paragraphs | `lg` |
| Around H2 in body (before/after) | `2xl` before / `lg` after |
| Around inline "carry the idea further" block | `2xl` top and bottom |
| Around FAQ block | `3xl` top, `2xl` bottom |
| Around closing CTA | `2xl` top, `2xl` bottom |
| Inside post cards (padding) | `lg` |
| Inside Quick Answer block (padding) | `lg` all sides |
| Inside inline CTA block (padding) | `xl` |
| Inside newsletter signup block (padding) | `2xl` |
| Filter pills row vertical padding | `md` |
| Between filter pill row and topic chip row | `md` |

---

## Border radius

| Element | Radius |
|---|---|
| Post cards | 12px (Large token) |
| Cover image on post page | 12px (Large) |
| Cover image inside cards | 8px (Medium) |
| Quick Answer block | 8px (Medium) |
| Inline CTA block | 8px (Medium) |
| Newsletter signup block | 12px (Large) |
| Filter pills | 9999px (Round) |
| Topic chips | 9999px (Round) |
| Buttons (CTAs) | 9999px (Round) |
| Author avatar | 9999px (circle) |

---

## Shadows

Inherits exactly from the design tokens:

```
Card resting state: 0 2px 12px rgba(123,79,158,0.08)
Card hover state: 0 4px 20px rgba(123,79,158,0.15)
Button: 0 2px 8px rgba(123,79,158,0.25)
```

Cards lift on hover via `transform: translateY(-4px)` AND the shadow shift, both transitioning over `0.2s ease`.

---

## Buttons

**Primary button (CTAs, closing nudges):**
- Background: `#F9C23C` (yellow)
- Text: `#1a1a1a` (dark)
- Padding: `12px 24px` mobile / `14px 32px` desktop
- Border-radius: 9999px (round pill)
- Font: Post Regular, all caps, letter-spacing 0.05em, 14-16px
- Hover: background `#7B4F9E` (purple), text `#FFFFFF` (white), transform translateY(-1px)
- Transition: 0.2s ease

**Secondary button (rare on blog - used for "Load more"):**
- Background: transparent
- Text: `#7B4F9E` (purple)
- Padding: same as primary
- Border: 1.5px solid `#7B4F9E`
- Border-radius: 9999px
- Font: Inter 600, 14-16px
- Hover: background `#7B4F9E`, text white

**Inline text link (within post body):**
- Color: `#7B4F9E`
- Text-decoration: underline, decoration-thickness 2px, decoration-skip-ink auto, underline-offset 3px
- Hover: color `#5D3A7A` (slightly darker purple)

---

## Animation

Inherits from design tokens. Specifically on the blog:

- **Card hover lift:** `transform: translateY(-4px)`, 0.2s ease, paired with shadow shift
- **Filter pill state change:** background and border colour transitions, 0.15s ease
- **Scroll reveal on cards:** fade-up, 0.4s ease, 0.1s stagger between cards (subtle, not theatrical)
- **Image hover zoom on cards:** `transform: scale(1.02)` on the cover image only (not the card itself), 0.3s ease

**`prefers-reduced-motion`** disables all decorative animations. Functional state changes (hover colours, focus rings) stay.

---

## Specific component renders

### Post card on the index grid

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ │ │
│ │ cover image │ │ ← 8px radius
│ │ (1800x1000 source, │ │
│ │ lazy-loaded) │ │
│ │ │ │
│ └─────────────────────────────┘ │
│ │
│ CREATIVITY │ ← topic tag, purple, caps
│ │
│ why your kid stops creating. │ ← Post Regular, sentence case
│ │
│ A confidence dip, not a │ ← excerpt, max 14 words
│ ceiling. The fix starts here. │
│ │
│ by Ryan · 3 min read │ ← Inter, muted text
└─────────────────────────────────┘
 12px border radius
 #FBF6EA cream background
 #FDFAF5 page background outside
```

### Quick Answer block

```
┌──────────────────────────────────────────┐
│ │ │
│ │ QUICK ANSWER │ ← caps, Post Regular, 13px
│ │ │
│ │ Around age 7 or 8, most kids start to │ ← Inter, 17px, line-height 1.7
│ │ self-edit harder. They notice their │
│ │ drawings don't match the picture in │
│ │ their head, and they quietly stop │
│ │ trying. The fix starts with the adult │
│ │ in the room. │
│ └────────────────────────────────────────┘
 left border: 3px solid #F9C23C
 background: #FBF6EA
 padding: 24px (lg token)
 border-radius: 8px
```

### "more for you." block

```
more for you. ← Post Regular, 28px

┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ cover img │ │ cover img │ │ cover img │
│ │ │ │ │ │
│ TOPIC │ │ TOPIC │ │ TOPIC │
│ Title here. │ │ Title here. │ │ Title here. │
│ │ │ │ │ │
│ *italic │ │ *italic │ │ *italic │
│ connective │ │ connective │ │ connective │
│ sentence.* │ │ sentence.* │ │ sentence.* │
│ │ │ │ │ │
│ by Ryan │ │ by Tam │ │ by Ryan │
└────────────────┘ └────────────────┘ └────────────────┘
3-up desktop, 1-up mobile
gap: 32px desktop, 24px mobile
italic connective in #6b6b6b text-muted
```

### Filter pills row

```
[ All ] [ For Parents ] [ For Teachers ] [ For Homeschoolers ] [ For Kids ]
 ↑ active = yellow fill, dark text
 others = transparent fill, dark outline 1.5px

Below, smaller, muted:
 Creativity · Wellbeing · Numeracy · Literacy · Photography · Behind the Mag · Kid Spotlights · Open Tasks
```

Active pill: `background #F9C23C`, `color #1a1a1a`, no outline. Inactive pill: transparent background, `color #1a1a1a`, `1.5px solid #1a1a1a` outline. Hover state: outline becomes purple, text becomes purple.

Padding: `8px 20px` mobile, `10px 24px` desktop. Gap between pills: `12px` mobile, `16px` desktop.

The whole row has `padding: 16px 0` and `position: sticky; top: [header height]; z-index: 10` so it stays accessible on scroll.

---

## Mobile-first behaviour

Per the design principles file (Principle 8: speed is invisible to you, painful to visitors), the blog is built mobile-first and tested on actual Pixel 6.

- Single-column post grid below 768px
- Featured post still full-width but with reduced padding
- Filter pills scroll horizontally if they exceed viewport width (scroll-snap-type: x mandatory)
- Topic chips wrap to multiple lines on mobile
- "more for you." stacks to single column
- "From the founders" rail stacks to single column
- Newsletter signup form: email field above button (stacked) on mobile
- Cover images on the post page: full-width edge-to-edge on mobile (no horizontal padding), regain padding from 768px up

---

## Empty states and edge cases

- **Index with no posts matching filter:** see spec ("Nothing here yet - but we're always writing...")
- **Post with no `inline_cta_items` set:** the inline "carry the idea further" block falls back to the inline newsletter signup prompt
- **Post with no `more_for_you` array set:** falls back to algorithmic recommendations (most recent posts sharing one or more audience tags) - but flag this as a content gap so the writer adds curated picks
- **Post with no FAQ block:** still injects a default FAQ JSON-LD with three placeholder Q&As about theINmag generally - better than no schema. Flag as a content gap.
- **Cover image fails to load:** fallback to the theINmag logo on a cream background. Alt text always serves the meaning.

---

## Performance budget

- Mobile PageSpeed Insights target: 70+ (per the brief - this is the floor, not the goal)
- Largest Contentful Paint (LCP): under 2.5s on 4G mobile
- Total page weight (post page): under 1.5MB including cover image
- Cover images: 1800x1000px source, JPG, under 400KB after TinyPNG
- Card thumbnails: served at 600x400px from the same source via Shopify's image_url filter
- Fonts: subset Latin only, preload Post Regular and Inter, font-display: swap
- Animations respect `prefers-reduced-motion`
- No third-party JS libraries beyond what Shopify Dawn ships with + Klaviyo (newsletter)

---

## Accessibility checklist

- All cover images have meaningful alt text (kid attribution included)
- Topic tags above titles have visual contrast ≥ 4.5:1 on cream background
- Filter pills have visible focus state (2px purple outline, offset 2px)
- Skip-to-content link present on every page
- All interactive elements have minimum 44x44px touch target on mobile
- FAQ accordions (if used) are keyboard-navigable with proper ARIA states
- Newsletter form has explicit label association, error states announced to screen readers
- Reading order logical (header → topic → title → cover → byline → quick answer → body → faq → cta → more for you → newsletter)

---

## Done check

Before declaring a section "built", Claude Code verifies:

1. ✅ Renders correctly on Pixel 6 portrait at 412px wide (the actual phone, not just the simulator)
2. ✅ Renders correctly at desktop 1440px wide
3. ✅ Renders correctly at intermediate 768px tablet width
4. ✅ All design tokens used (no hardcoded colour values, no hardcoded spacing in pixels - uses CSS custom properties)
5. ✅ Section file follows `theinmag-` prefix naming convention
6. ✅ Mobile-first CSS (default styles target mobile, media queries scale up)
7. ✅ Animations respect `prefers-reduced-motion`
8. ✅ All images have alt text
9. ✅ All interactive elements keyboard-accessible with visible focus state
10. ✅ Schema JSON-LD validates against Schema.org
11. ✅ Page weight under budget
12. ✅ No em dashes anywhere in copy or code comments

If any check fails, the section is not done. Fix before moving on.
