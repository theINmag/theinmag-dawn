# theINmag Design Tokens
### Single source of truth for every visual decision in the Shopify build
*Updated: May 3 2026 — full rewrite after design audit of mag08 + live site*
*Supersedes all previous versions*

This file is referenced in CLAUDE.md and read by Claude Code at the start of every build session. Update it when decisions change. Stale tokens cause inconsistent builds.

---

## How to read this document

Every colour and type choice is followed by a one-line "why" so the system stays trustworthy even for anyone making decisions visually. Ryan is colourblind — every important text-on-colour pairing meets WCAG AA contrast (4.5:1 for body, 3:1 for large text). These ratios are pre-validated. Don't introduce new colour pairings without validating contrast first.

---

## Colour system

theINmag's brand is genuinely a multi-colour palette where colours work as friendly background fields, not just accents. Every saturated colour has a soft companion. The pairings are the system — that's what makes the brand feel coherent across so many colours rather than chaotic.

### The colour pairs (LOCKED — this is THE core principle)

Every coloured section uses one of these pairings. Light tone for backgrounds, dark companion for text and emphasis on top. Never mix companions across pairs.

#### Purple pair (the primary brand pair)
    Light lavender:    #E8DEEF   (background fields, soft cards)
    Dark purple:       #5D3A7A   (headings, emphasis, button hover state)
    Contrast ratio:    8.2:1 (passes AA and AAA)
    Why:               Purple is the dominant brand colour. Lavender is calm, dark purple is confident. The pair feels like the print mag.

#### Coral pair (for warmth, energy, "hey adults" sections)
    Light salmon:      #FBE0D6   (background fields)
    Dark coral:        #C9543E   (headings, emphasis)
    Contrast ratio:    4.6:1 (passes AA)
    Why:               Salmon and coral together = warm, friendly, slightly energetic. Used for sections that need a heartbeat (testimonials, hero adult sections).

#### Peach pair (for shop/product moments)
    Light peach:       #FCDDB8   (background fields)
    Dark sandy orange: #D9783A   (headings, emphasis, badges)
    Contrast ratio:    4.5:1 (passes AA, just)
    Why:               Peach is the magazine's "Have a go" colour. Inviting, low-pressure, gets used on product features.

#### Mint pair (for kids' content, gallery, fresh moments)
    Light mint:        #D6EAD9   (background fields)
    Dark sage:         #4A7C5C   (headings, emphasis)
    Contrast ratio:    5.1:1 (passes AA)
    Why:               Mint and sage are the magazine's nature colours. Use on Gallery, For Kids, anything that should feel fresh and growing.

#### Cream pair (the workhorse — body text, default backgrounds)
    Cream:             #FBF6EA   (default page background, calm sections)
    Inky purple-navy:  #2A1F3D   (default body text, default heading colour where pairs don't apply)
    Contrast ratio:    13.4:1 (passes AAA)
    Why:               Cream is warmer than white, less aggressive than pure paper-white. Inky purple-navy is warmer than #1a1a1a and reads better against cream. This is the universal pair — works everywhere, never wrong.

#### Sky pair (used sparingly, for callouts and links)
    Sky blue:          #C9E5E8   (callout backgrounds, light feature blocks)
    Dark teal:         #2D6878   (callout text, link colour)
    Contrast ratio:    5.4:1 (passes AA)
    Why:               Used rarely on purpose — sky is the magazine's accent for special moments. The dark teal is also the default link colour throughout the site.

### Accent colours (use sparingly, like stamps)

#### theINmag yellow (the signature stamp)
    Yellow CTA fill:    #F9C23C
    Text on yellow:     #2A1F3D (the inky purple-navy)
    Yellow shadow:      #D4A02E
    Contrast ratio:     9.1:1 on yellow (passes AAA)
    Why:                Yellow is the brand's signature stamp colour. Used for CTAs, the "made by kids, for kids" sticker, and small attention moments. NEVER use yellow as a big background field — it's a stamp, not a wall.

#### Cherry magenta (rare inline emphasis only)
    Cherry:             #B8265E
    Why:                The magazine's hand-lettered emphasis colour ("DRAWING!", "LOUDER!"). On the website, use only for occasional inline emphasis spans inside body copy. Never as a background or button colour. Maximum 1-2 spans per page.

### Pattern overlay tones (for soft visual depth)

Used as semi-transparent shapes layered behind solid colour fields — the "wave" or "blob" shapes seen across the homepage.

    Purple wave:       #C9B5DB at 60% opacity (sits on lavender background)
    Coral wave:        #F5C7B5 at 70% opacity (sits on salmon background)
    Peach wave:        #F8C99E at 70% opacity (sits on peach background)
    Mint wave:         #B8DCC0 at 70% opacity (sits on mint background)
    Sky wave:          #B5DDE1 at 70% opacity (sits on sky blue background)
    Why:               These create depth without adding new colours. Same family as the background, just slightly more saturated. Always sit behind content, never compete with it.

### Critical rules (LOCKED)

- ALWAYS use a pair together. Light background, dark companion for text/accents on top.
- NEVER mix pair members across pairs. Don't put dark purple on a peach background — use the dark sandy orange for that. The pairings ARE the system.
- Yellow is a stamp colour, never a background field.
- Cream and inky purple-navy are universal — they work with any pair as a fallback.
- All text-on-colour combinations must hit WCAG AA contrast minimum. The pairs above are pre-validated. New pairings require validation at contrastchecker.com or similar.

---

## Typography

The brand has three distinct type roles. Match each role to the right font.

### Heading font (display, hero, section titles)

    Font:              Post Regular
    Source:            Self-hosted from /assets/ — see "Font loading" below
    Licence:           Pixel Surplus Web Font Licence, 0-10k pageviews/month tier
    Purchased:         May 3 2026, $64 USD
    Designer:          Javier Guaschetti
    Distributor:       Pixel Surplus (pixelsurplus.com)
    Licence proof:     Google Drive — Website design / Shopify Assets / 23. theINmag - Licences / POST/
    Files in repo:     /assets/post-webfont.woff2 (primary)
                       /assets/post-webfont.woff (fallback)
    Fallback stack:    'Post Regular', 'Caveat', Georgia, serif
    Letter-spacing:    0
    Line-height:       1.15 (tight for impact)
    Weight:            400 (single weight — Post Regular is one cut only)
    Usage:             H1, H2, hero text, section titles, large emphasis moments
    Why:               Post Regular is the same hand-lettered font Lou uses across the print magazine. Print and web now feel like the same brand. Self-hosted for performance and licence compliance.

### Body font (paragraphs, descriptions, list items, most UI)

    Font:              Inter
    Source:            Google Fonts
    Loaded weights:    400 (regular), 500 (medium), 600 (semibold), 700 (bold)
    Subset:            Latin only (performance)
    Fallback stack:    'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif
    Why:               Inter is the most-tested screen-reading font of 2026. Designed specifically for UI. Neutral and professional, lets Post Regular's personality lead. Excellent at every size, native OpenType features (proper number alignment, small caps), very fast loading. The "professional friend" voice in font form.

### Heading sizes (clamp for responsive)

    H1: clamp(32px, 6vw, 56px)    line-height: 1.1   letter-spacing: 0     [Post Regular]
    H2: clamp(26px, 4.5vw, 40px)  line-height: 1.15  letter-spacing: 0     [Post Regular]
    H3: clamp(22px, 3.5vw, 30px)  line-height: 1.2   letter-spacing: 0     [Inter 600]
    H4: clamp(18px, 2.5vw, 22px)  line-height: 1.3   letter-spacing: 0     [Inter 600]
    H5: 16px                      line-height: 1.4   letter-spacing: 0.02em [Inter 600 ALL CAPS]

H1 + H2 use Post Regular for personality. H3-H5 use Inter semibold for hierarchy without overload. Stops the page from looking like a hand-lettered scribble at every level.

### Body sizes

    Body large:    18px   line-height: 1.7   (default body, longer paragraphs)
    Body regular:  16px   line-height: 1.6   (cards, captions, secondary text)
    Body small:    14px   line-height: 1.5   (legal, footer, micro-text)
    Caption:       13px   line-height: 1.5   letter-spacing: 0.02em (kid attributions, image credits)
    
    Min font size on mobile: 14px. Anything smaller fails accessibility.

### Hand-lettered emphasis (rare)

For magazine-style "DRAWING!" or "LOUDER!" inline emphasis effects:

    Font:        Caveat (Google Fonts, marker-style)
    Color:       #B8265E (cherry magenta)
    Size:        slightly larger than surrounding text (1.15em)
    Weight:      700 (bold)
    Why:         Caveat gives "I'm a real person, lettering this in" energy. Use sparingly — 1-2 spans per blog post maximum, never in headlines, never as a substitute for proper Post Regular headings.

### Font loading strategy

Post Regular is self-hosted (we paid for the licence, files are in /assets/). Inter and Caveat load from Google Fonts. The @font-face declaration for Post Regular goes in /assets/theinmag-base.css. Use font-display: swap on every font so text shows in the fallback while the custom font loads — never blocks rendering.

---

## Button system (LOCKED)

theINmag buttons are hand-drawn-feeling sticker shapes with a soft drop shadow. They look like things a kid stuck on the page. This is the live Wix convention and we keep it.

### Primary CTA — the yellow stamp button

    Background:        #F9C23C (theINmag yellow)
    Text colour:       #2A1F3D (inky purple-navy)
    Text style:        Post Regular, uppercase, 16-18px depending on context
    Letter-spacing:    0.02em
    Padding:           14px 28px (mobile) / 16px 32px (desktop)
    Border-radius:     32px (generous pill shape — feels like a sticker)
    Shadow:            0 4px 0 #D4A02E (solid offset, not blurred — sticker effect)
    Border:            none (the shadow does the visual lifting)
    Hover state:       Background shifts to #5D3A7A (dark purple), text shifts to #FFFFFF
    Hover transform:   translateY(2px) AND shadow becomes 0 2px 0 #4A2D62 (button "presses down")
    Transition:        all 0.15s ease
    Why:               This convention exists on the live site, customers expect it, conversion is at 6%. Don't break what's working. The press-down effect makes the button feel responsive and physical.

### Secondary CTA — the outlined purple button

    Background:        transparent
    Text colour:       #5D3A7A (dark purple)
    Border:            2px solid #5D3A7A
    Text style:        Inter 600, uppercase, 14-16px
    Padding:           12px 24px (mobile) / 14px 28px (desktop)
    Border-radius:     32px (matches primary)
    Hover state:       Background fills #5D3A7A, text becomes #FFFFFF
    Transition:        all 0.2s ease
    Why:               Where a yellow stamp would be too loud (multiple CTAs on a page, lower-priority actions), the outlined purple keeps the sticker shape but quieter.

### Tertiary — text link only

    Text colour:       #2D6878 (dark teal — the link colour from the sky pair)
    Text decoration:   underline (thin, 1px)
    Hover:             Text shifts to #5D3A7A (dark purple), underline thickens to 2px
    Why:               For inline links inside body copy. Never use as primary CTA.

### Critical button rules (LOCKED)

- Yellow is RARE. One yellow stamp per section, max two per page above the fold. Yellow's power comes from scarcity.
- Hover transforms (translateY) must respect prefers-reduced-motion. Disable the press-down effect for users who've requested it.
- Buttons always have at least 44px touch target on mobile (current padding hits this).
- Button text is always Post Regular (uppercase) for primary CTAs, Inter 600 (uppercase) for secondary. Never mix.

---

## Spacing scale

Every layout decision uses one of these tokens. Don't introduce new values.

    xs:    4px     (icon padding, tag inner spacing)
    sm:    8px     (button inner gaps, small UI gaps)
    md:    16px    (card padding, paragraph margins)
    lg:    24px    (section inner padding, list spacing)
    xl:    32px    (component spacing within sections)
    2xl:   48px    (between major content blocks)
    3xl:   64px    (section padding top/bottom on desktop)
    4xl:   96px    (between major page sections on desktop)
    5xl:   128px   (extra-large hero sections, very rare)

Mobile values: most spacing scales down by ~30% on mobile (Pixel 6 width 412px). Use clamp() in CSS where possible to interpolate smoothly.

---

## Border radius

theINmag's shapes are organic, slightly imperfect. Never sharp geometric corners.

    sm:        6px      (tags, small badges)
    md:        12px     (input fields, small cards)
    lg:        20px     (cards, image containers)
    xl:        28px     (large cards, feature blocks)
    button:    32px     (CTA buttons — generous pill shape)
    pill:      9999px   (avatars, audience tiles, pure pills)
    organic:   SVG masks for genuine torn-paper / hand-drawn edges (see "Shape language" below)

Why: 6px on tags is slightly more than the typical 4px to keep them feeling soft. 32px on buttons makes them feel sticker-like rather than corporate.

---

## Shadows

theINmag shadows are warm and soft, never harsh. Tinted with the brand purple instead of pure black.

    Card:              0 2px 12px rgba(123, 79, 158, 0.08)
    Card hover:        0 4px 20px rgba(123, 79, 158, 0.15)
    Button (sticker):  0 4px 0 #D4A02E (solid offset, not blurred)
    Button hover:      0 2px 0 #4A2D62 (button presses down)
    Modal:             0 8px 32px rgba(123, 79, 158, 0.18)

Why: tinted purple shadows feel warmer and more theINmag than pure rgba(0,0,0). The sticker shadow on buttons is the key differentiator from generic Shopify themes.

---

## Animation

    Standard transition:  0.15s ease       (most UI state changes)
    Hover transition:     0.2s ease        (button hover, card lift)
    Float (artwork):      3s ease-in-out infinite, translateY 0 to -10px
    Scroll reveal:        fade up, 0.4s ease, 0.1s stagger between elements
    Press-down (button):  translateY(2px) on hover/active
    Wiggle (kid art):     rotate -2deg to 2deg, 0.4s ease, on hover only

ALL decorative animation respects prefers-reduced-motion. If a user has it set, disable float, wiggle, scroll reveal, and press-down. Functional animations (loading spinners, cart drawer slide) can stay.

Test all animation on actual Pixel 6 before sign-off — never just desktop browser simulator.

---

## Shape language

theINmag uses soft, organic shapes throughout. Never sharp geometric. Stored as SVG.

    Location:           /assets/shapes/
    Naming convention:  theinmag-shape-[name].svg
    Examples:           theinmag-shape-wave-purple.svg
                        theinmag-shape-blob-coral.svg
                        theinmag-shape-cloud-mint.svg
                        theinmag-shape-squiggle-yellow.svg
                        theinmag-shape-torn-banner-peach.svg

These don't exist yet. Created or migrated as the build progresses. Naming convention locked now.

---

## Brand language (LOCKED — never deviate)

These rules apply across every page, every blog post, every email, every agent output.

### "Creation" not "work"

A girl in a school told us "art is not work" and that's brand-defining. Across the entire site:

    Wrong: "Send in your work"             Right: "Send IN your creation"
    Wrong: "Submit your artwork"           Right: "Submit your creation"
    Wrong: "Get your work published"       Right: "Get your creation published"

Universal across all categories — art, writing, photo, puzzle, joke, hobby. "Creation" works for everything.

### No em dashes

Hyphens only. Em dashes are one of the strongest "this was written by AI" tells in 2026. Apply across every word of copy, every blog post, every email template, every agent system prompt.

### Smart brevity

Short sentences. Punchy. Guy Raz / Axios newsletter energy. Professional friend tone, never corporate. Cutesy-but-not-over-the-top language welcomed.

### Capitalisation

Sentence case in headings ("Where kids get published") not Title Case ("Where Kids Get Published"). Exception: brand name "theINmag" keeps its specific casing.

The "IN" in theINmag, INkids, "send IN", "in-task" gets capitalised. It's the brand pun. Use it where natural, don't force it.

### Audience naming

URL slugs and external nav use universal language ("/for-kids", "For Kids"). The dropdown header is "Who's it for?". On the For Kids page itself, brand language is welcomed ("Hey INkids!"). Outside that one page, default to "kids" not "INkids".

### Hero headline (LOCKED)

The site-wide brand promise is "Publishing creative Aussie kids." Four words, gerund. Used as the primary hero headline on the homepage. Echoed in every audience page hero with audience-specific framing.

---

## Navigation language (LOCKED)

Primary nav order:
1. Shop
2. Who's it for? (dropdown: For Parents / For Teachers / For Homeschoolers / For Kids)
3. Send IN
4. Gallery
5. Blog
6. Freebies
7. About (dropdown: Our Story / Where we'll be next / Stockists / Schools / Contact)

Persistent CTA right of nav: "Send IN" button — yellow primary, purple hover.

---

## Voice profiles (placeholder until built Week 1)

Two distinct authorial voices on the blog and in customer comms:

Ryan — Smart brevity, Axios/Guy Raz energy, short punchy sentences, genuine pride in kids' creations, occasional gentle humour, professional friend.

Tam — Slightly warmer and nurturing, educational authority without being academic, excellent with parent and teacher audiences. Social Sands framework knowledge feeds into social content.

Voice profile documents to be built Week 1 from real exported emails, social captions, and DMs.

---

## AEO requirements (apply on every page)

- H2 headings phrased as questions
- FAQPage JSON-LD schema on all pages with FAQ content
- Article schema on all blog posts with named author and Organisation
- Organisation + Person schema on homepage and Our Story
- BreadcrumbList schema on all pages
- llms.txt at /llms.txt
- robots.txt allows: GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended

---

## Code conventions

- All custom sections: theinmag- prefix
- CSS: custom properties only, no hardcoded colour values (use the tokens above)
- Mobile-first always — test on actual Pixel 6 before desktop
- Test on multiple viewport widths: 375px (small iPhone), 390px (standard iPhone), 412px (Pixel 6)
- Never edit theme.liquid directly
- All custom CSS in section-level Custom CSS boxes or assets/theinmag-base.css
- Respect prefers-reduced-motion in all animations
- Image alt text: always descriptive, always keyword-aware (drives AEO)
- No em dashes anywhere — including code comments
- All text-on-colour pairings must hit WCAG AA contrast minimum (use tokens above which are pre-validated)

---

## Image asset specifications

- Hero / banner: 2400 x 900px, JPG, < 400KB after TinyPNG compression
- Product images (mag covers): 2048 x 2048px, JPG (square), < 300KB
- Collection / category tiles: 1800 x 1000px, JPG
- Blog featured images (Maudern-style): 1800 x 1000px, JPG
- Thumbnail / card images: 800 x 800px, JPG
- Logo (primary): 400 x 200px, transparent PNG
- Logo (white): 400 x 200px, transparent PNG
- Logo (icon/favicon): 200 x 200px, transparent PNG
- Background pattern tiles: 1200 x 1200px, PNG
- Large decorative backgrounds: 2400 x 2400px, PNG
- Character images: < 100KB after compression
- Hero-worthy kid art: prefix filename with HERO_

Asset library audit + TinyPNG compression done May 1 2026 — every image now within target weight.

---

## Reference sites (study throughout build)

1. getmaude.com / getmaude.com/blogs/themaudern — primary structural reference
2. whogivesacrap.org (AU) — reviews, subscriptions, animations
3. nuggetcomfort.com — kids brand, illustrations, motion
4. magicspoon.com — scroll-triggered animations
5. uppercasemagazine.com — magazine subscription model on Shopify

---

## Things to NEVER do (LOCKED)

- Use em dashes anywhere
- Use yellow as a background field (it's a stamp colour only)
- Mix colour pair members across pairs (e.g. dark purple text on a peach background)
- Lead with curriculum instead of creativity
- Say "work" instead of "creation"
- Collect contactable details from kids (only adults)
- Run advertising on the site
- Edit theme.liquid directly
- Hardcode colour values (always use the tokens)
- Use any text-on-colour pairing that fails WCAG AA contrast
- Add any app without checking PageSpeed Insights first (target: 70+ on mobile)
- Use the word "subscription" in customer-facing product names (use "Membership")
- Show specific addresses or real-time location of Ryan and Tam (regional + monthly only)

---

## Workshop pricing convention (current — flagged for review)

- School workshops: $250 for 2 hours (under-priced, revisit after first 6-12 months of bookings)
- Homeschool sessions: ~$5 per family, paid cash or Square on the day, separate from Shopify entirely
- Workshop bookings flow through enquiry forms, not direct Shopify checkout
- Reviews captured via a dedicated Judge.me product entity called "Workshops"

---