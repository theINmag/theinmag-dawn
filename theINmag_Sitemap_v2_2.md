# theINmag — Site Map & Page Architecture (v2.2)
### The structural blueprint for the Shopify rebuild
*Updated May 3 2026 — supersedes v1, v2.0, and v2.1. v2.2 locks two corrections: (1) homepage hero copy returned to proven Wix headline "The magazine for creative kids", (2) homepage Section 1 anchored to getmaude.com split-screen pattern (was "floating kid creations either side"). All earlier versions archived for reference.*

---

## What changed since v1

For full audit, see Part 4. The headline shifts:

**v2.2 corrections (May 3 2026):**
- Homepage hero copy LOCKED to "The magazine for creative kids" + "Where Aussie kids get published - no ads, just creativity" (proven Wix copy converting at ~6%). Earlier "Aussie kids fill every page" subhead RETIRED.
- Homepage Section 1 (hero) anchored to getmaude.com split-screen pattern. Was previously specced as "floating kid creations either side of headline" - replaced with two paired image blocks each with own headline + subhead + CTA.
- Maude reference re-anchored across the document. Screenshots stored at theinmag-dawn/reference/maude/.
- homepage-build-spec.md (in theme folder) added as the detailed homepage spec - supersedes Part 2 Section 1 of this document where they conflict.

**v2.1 additions (workshops & travel):**
- New page **`/where-we-are`** — header "Where we'll be next" — combines live travel map + workshop booking flows + reviews + request-a-session form
- Tucked under **About** dropdown in primary nav (alongside Our Story, Stockists, Schools, Contact)
- Through-line preview tiles added to For Parents, For Teachers, For Homeschoolers, For Kids, Our Story — each with audience-specific link copy
- Travel Agent flagged as future infrastructure (post-launch); manual itinerary updates initially
- Privacy boundary: regional + monthly only on the public map, never specific towns or addresses

**v2.0 changes:**

- **Freebies** moved into primary nav (was footer-only)
- **Audience nav** renamed to **"Who's it for?"**
- **Subscription** product structure replaced with **"Membership"** — three variants (4-issue, 8-issue, Rolling)
- **"Build a Bundle"** added as a new product type alongside Membership — mix-and-match conversion lift
- **Klaviyo popup scrapped** — replaced with strong inline forms across multiple pages
- **Single-tick consent** on Send IN form, with "all proceeds reinvested into the next print issue" framing
- **Blog named "theINside"** — URL slug `/inside`
- **"Work" replaced with "creation"** sitewide — brand-defining
- **Yellow primary buttons / purple hover** — preserves Wix expectation
- **Send IN celebration page lives on Shopify**, not JotForm (JotForm can't do confetti)
- **No kid newsletter, no kid contactable data** — locked
- **Three release dates** baked into Liquid (15 Feb / 15 Jun / 15 Oct) with auto "MagXX just dropped" 3-week window
- **Reviews migration** — manual import to Judge.me from existing emails/DMs is fine, standard practice
- **Schools** — Net 14 days, 5%/10% discount tiers, ship-before-pay default, our ABN/contact info on the form
- **Privacy/Terms/Child Safety** — single page, friendly tone, minion characters, smart brevity (not three pages)
- **Gallery** — AI auto-tagging for searchability, lightbox view, watermark + screenshot deterrents, no downloads, no cutoff for old work
- **Branching Out** — moved off For Parents, lives on Our Story + For Homeschoolers + footer
- **Press logos** — homepage + For Parents
- **Education Minister letters** — exclusive to For Teachers
- **Competitions in audience pages** — yes, framed for each audience
- **For INkids reworked substantially** — see Part 2

---

## How to read this document

Three sections after the prelude:

1. **The map** — every page on the new site, what it does, who it serves, where it links
2. **Page-by-page specs** — every page in detail
3. **The audit** — what's changed since v1, plus current Wix vs new Shopify
4. **The reasoning** — why these decisions, what to future-proof

The visual sitemap diagram is a separate file. Open both side-by-side.

---

## Three pillars — what every page must convey

Every page measured against these. Not loud. Not preachy. Woven in.

**Pillar 1 — Creativity drives real learning.**
When a kid writes a story, paints a picture, solves a maths puzzle their way, the learning happens because the creating is real. Lead with the creating. The learning shows up on its own.

**Pillar 2 — Rich, open tasks make learning stick.**
We never use the word inquiry on the site. We talk about open-ended tasks, real-world problems, things kids can take in their own direction. The mag is a conduit for this for parents, teachers, and homeschoolers.

**Pillar 3 — Kids deserve a voice.**
A place to be seen, heard, celebrated. Most kids' content is curated by adults for kids. We flip that. Kids make it. Other kids see it. Adults are honoured guests.

---

## The simple rule

Less words. More kid creations. Every page should look first, read second.

If a section requires a paragraph to explain why it's good, the section is wrong. Show the kid creation, name the kid, the rest takes care of itself.

---

# Part 1 — The Site Map

## Top-level navigation (LOCKED)

**Primary navigation (header, always visible):**
1. Shop
2. Who's it for? (dropdown: For Parents / For Teachers / For Homeschoolers / For Kids)
3. Send IN
4. Gallery
5. theINside (the blog)
6. Freebies
7. About (dropdown: Our Story / Where we'll be next / Stockists / Schools / Contact)

**Persistent CTA right of nav:** "Send IN" button — yellow primary, purple hover

**Footer navigation:** Competitions / Partnerships / Privacy & Terms / Child Safety / Acknowledgement of Country / Shipping & Returns / FAQ

---

## Every page on the new site

### TIER 1 — Conversion pages (revenue lives here)

| Page | URL | Purpose | Primary CTA |
|---|---|---|---|
| Homepage | / | Hero conversion | Get the Membership |
| Shop | /shop | Product discovery | Add to cart |
| Membership product | /products/membership | Subscription replacement, 3 variants | Add to cart |
| Build a Bundle | /products/build-a-bundle | Mix-and-match upsell | Add to cart |
| Single Issues collection | /collections/single-issues | Browse + collect | Add to cart |
| Snack Pack | /products/snack-pack | Sample + back-issue mover | Add to cart |
| Individual issue pages | /products/[handle] | Convert browse to buy | Add to cart |
| Schools | /schools | Invoice-based ordering | Request invoice |

### TIER 2 — Audience funnels (trust + education)

| Page | URL | Audience | Primary CTA |
|---|---|---|---|
| For Parents | /for-parents | Parents/grandparents | Get the Membership |
| For Teachers | /for-teachers | Teachers | Order for school |
| For Homeschoolers | /for-homeschoolers | Homeschool families | Get the Membership |
| For Kids | /for-kids | Kids 5-13 | Send IN your creation |

### TIER 3 — Brand & community (the soul)

| Page | URL | Purpose |
|---|---|---|
| Send IN | /send-in | The submission funnel |
| Send IN celebration | /submitted | Post-submission page (Shopify-built) |
| Gallery | /gallery | Live submissions, social proof |
| theINside (blog) | /inside | SEO + AEO + trust + voice |
| Blog post template | /inside/[handle] | Bite-sized editorial |
| Our Story | /our-story | Founders, mission, the van |
| Where we'll be next | /where-we-are | Travel map + workshop bookings + reviews |
| Freebies | /freebies | Lead magnet, brand sampler |
| Competitions | /competitions | Curated external comps |
| Stockists | /stockists | Map + become-a-stockist funnel |
| Partnerships | /partnerships | Brand collaborations (future-proof) |
| Contact | /contact | Direct enquiries |

### TIER 4 — Legal & housekeeping (footer only)

| Page | URL |
|---|---|
| Privacy + Terms + Child Safety (single page) | /privacy |
| Acknowledgement of Country | /acknowledgement |
| Shipping & Returns | /shipping |
| FAQs (master) | /faq |

---

## The through-lines (how pages connect)

This is the most important architectural element. The current Wix site is a series of dead-end pages. The new site is a web — every page knows what page should come next.

### Primary conversion paths

- **Shop pathway:** Home → Audience tile → Shop → Membership → Cart → Checkout
- **Trust pathway:** Home → Reviews → Our Story → Shop
- **Discovery pathway:** Home → Latest issue → Gallery → For Kids → Send IN
- **Education pathway:** Home → For Teachers → Schools → Invoice
- **SEO pathway:** Google → Blog post → relevant audience page → Shop
- **AEO pathway:** AI engine → Blog post / FAQ → relevant audience page → Shop

### Through-lines that auto-populate (built once, work forever)

A piece of content tagged `parents + writing + freebie` automatically appears on:
- For Parents page (audience tag)
- Freebies page (content type)
- Any blog post tagged similarly (related content section)

A new YouTube video tagged `educators + literacy + lesson` auto-populates on:
- For Teachers page
- The Branching Out section of Our Story
- Any blog post about classroom literacy

A blog post auto-populates on:
- theINside index
- Every audience page tagged in the post (different excerpts per audience)
- Newsletter monthly digest

### Cross-linking rules (every page enforces these)

1. Every page has a primary CTA above the fold (yellow button, purple hover)
2. Every page has a secondary "next-step" link near the bottom
3. Every page references at least 2 named kid attributions
4. Every audience page links to the other audience pages in the footer of its main content
5. Every blog post has a contextual product upsell, not a popup
6. Every product page has cross-sells from a different category

---

# Part 2 — Page-by-Page Specifications

## 1. Homepage (/)

**Structural reference: getmaude.com.** Section 1 (hero) follows Maude's split-screen pattern - two paired images side-by-side on desktop, stacked on mobile, each with its own headline + subhead + CTA. Audience tiles (Section 6) follow Maude's full-bleed category tile pattern with single-word labels. Press logos (Section 3) follow Maude's horizontal scrolling band. Maude desktop and mobile screenshots saved at theinmag-dawn/reference/maude/. Detailed homepage build spec lives at theinmag-dawn/homepage-build-spec.md, which supersedes this section where they conflict.

### Above the fold (mobile, no scrolling)
- Sticky announcement bar (cycles): Membership offer / "Mag10 just dropped" or "Mag10 drops in [X] days" (auto-calculated from Liquid metafield)
- Logo + nav (collapsed to hamburger on mobile)
- Headline: "The magazine for creative kids" (LOCKED May 3 2026 - proven Wix copy converting at ~6%)
- Subheadline: "Where Aussie kids get published - no ads, just creativity" (note: hyphen, NEVER em dash)
- Two CTAs: "Get the Membership" (yellow primary) / "See Inside" (outlined purple secondary)
- Trust micro-bar: "Made in Australia · 100% kid-created · Ad-free · Tri-annual"

Note on hero structure: previous version of this spec described floating animated kid creations either side of the headline. Replaced May 3 2026 with the Maude split-screen pattern - two paired image blocks (left = real photo of kid reading the mag, right = striking kid creation), each with its own headline and CTA. The two images tell the two halves of the brand promise: kids reading it, kids in it. See homepage-build-spec.md for full structural detail.

### Sections in scroll order

**Section 2 — Social proof bar**
Judge.me store rating + 2-3 short rotating testimonials. Mobile: stacked. Desktop: 3-up. **Reviews segment-aware** — Growth Agent picks top-performing review per audience signal (cookie/referrer); locked default rotation until agent has data.

**Section 3 — Press logos** ("As seen and heard on...")
Currently lives on shop page only. Adding to homepage as trust signal. Same logos, smaller render.

**Section 4 — Latest issue feature**
Cover image (zoom on hover, Maude-style) + animated GIF of inside pages + 3 highlight bullets + CTA to product page + countdown timer (auto-calculated from `next_release_date` metafield).

**Section 5 — Tam's "peek inside" video**
60-90 second video, changes per issue. Tam walks through her favourite bits. Heading: "Take a peek inside Mag[X] with Tam".

**Section 6 — Audience tiles (the funnel splitter)**
Four illustrated tiles, kid creations as background. Each links to the relevant audience page.
- For Parents
- For Teachers
- For Homeschoolers
- For Kids (this one slightly more colourful, more playful)

Note: per homepage-build-spec.md, the homepage tile labels drop the "For" - just "Parents", "Teachers", "Homeschoolers", "Kids" - matching Maude's single-word category tile pattern. The dropdown nav keeps "For Parents" etc. for clarity.

**Section 6a — Founders + philosophy block (added May 3 2026)**
Maude-style split layout. Large founder photo (Ryan, Tam, Nora, ideally with the van) on the right; vertical stack of large text anchor links on the left ("our philosophy" / "our standards" / "our impact" / "our story"). Click-to-reveal accordion - each anchor opens a short 40-60 word paragraph underneath when clicked, only one open at a time. Each anchor also links through to /our-story with appropriate URL anchor for the long-form version. Dark feature background (deep purple or inky purple-navy) with cream text - visually separates the section and gives the founder photo gravitas. One of theINmag's strongest trust signals elevated from the Our Story page to homepage. Anchor labels match Maude pattern - universal language lets the content underneath do the heavy lifting. See homepage-build-spec.md Section 5 for full structural detail.

**Section 7 — Live gallery preview**
6-8 most recent approved submissions in masonry grid, hover shows kid name + age + town. CTA: "See the full gallery →"

**Section 8 — How it works**
3-step illustrated: Make Something → Send It IN → It could land in print. (Note language: "could land", not "will be published" — honest, no implied guarantee.)

**Section 9 — Featured kids carousel**
Rotating "kids of the issue" — featured writer, artist, photographer, problem-solver from latest mag.

**Section 10 — Reviews (the real ones)**
The hospital story. Trent the teacher. The mum whose son found his picture. **Agent-driven freshness** — Inbox Manager Agent flags reviewable emails/DMs → you approve → auto-formatted and added to Judge.me → flows back to this carousel. No manual updating.

**Section 11 — Latest theINside posts**
3 most recent bite-sized posts. Maude-style cards.

**Section 12 — Instagram feed**
Live embed via Elfsight (4-6 most recent). "Hey adults, come hang with us!"

**Section 13 — Newsletter signup (custom on-brand inline)**
Replaces the Klaviyo popup. Strong inline form. Heading: "A monthly newsletter? Count me IN!" Free e-mag on signup.

**Section 14 — FAQ block (4 questions, FAQPage schema)**
1. Will my kid actually love this?
2. How does theINmag get made?
3. How do we get our kid published?
4. Is this a Membership or a one-off?

**Section 15 — Footer**
Acknowledgement of Country preserved and linked to dedicated page.

### What MOVES OFF the current homepage
- Contents/curriculum mapping (1100+ words) → For Teachers
- ON vs IN section → Our Story
- Free Fun PDF → Freebies (with the inline form, not Klaviyo popup)

### Through-line targets
Links to: Shop, every audience page, Gallery, theINside, Our Story, Send IN, Freebies, Newsletter signup. Every link is one click from the hero.

### AEO requirements
- Organisation schema (Ryan, Tam as Person entities)
- BreadcrumbList schema
- FAQPage schema (the 4 questions)
- llms.txt findable from /llms.txt

### Future-proofing
- Audience tiles built to easily add a 5th (For Libraries, For Booksellers)
- Featured kids carousel can become a permanent INkid Hall of Fame
- Tam's video swap-out built as a metafield, no template edits needed

---

## 2. Shop (/shop)

### Above the fold
- Heading: "INspire your kids"
- Subheadline: "Memberships, single issues, and a bit more."
- Trust micro-bar: "Free shipping over $40 · Sustainably printed in AUS · Ad-free always"
- 3 large illustrated collection tiles (Maude-style, hover zoom):
  - **Memberships** — the highest-value product. Tile reads: "The best way to read theINmag"
  - **Single Issues** — for newcomers and collectors. Tile reads: "Browse every issue ever made"
  - **Build a Bundle** — mix-and-match. Tile reads: "Make your own bundle"

(Snack Pack, Art Prints, Rich Learning Tasks — all hidden as future tiles, slot in when ready.)

### Sections below the fold

**Section 2 — Why a Membership?**
Quick visual: bundle price vs single-issue price. Save $X. Plus mag drops at your door. Plus never miss out.

**Section 3 — Featured product**
Mag10 (or current latest) — full Maude-style product feature. (Replacing v1's "Who made this?" map idea per feedback — too much production work.)

**Section 4 — All products grid**
Filterable. Filters: All / Membership / Build a Bundle / Single Issues / Digital / Snack Pack / Sold Out (digital available).
Sort: Featured / Newest / Bestsellers / Price low-high.
Each product card: cover image + title + price + variant indicator (Print / Digital) + add to cart on hover.

**Section 5 — Reviews (Judge.me group widget)**
"What families say about our printed mags" — Group 1 widget.

**Section 6 — Press & mentions**
Already-existing logos block. Keep.

**Section 7 — Shop FAQ**
Existing 9 questions (the voice is genuinely strong). Add:
- "What if I want to give it as a gift?"
- "Can I send a single issue to a different address than my own?" (the grandparent fix)
- "Got family overseas? Can you ship internationally?" — new framing per feedback: "Order digital here, then bundle it with a physical gift you send locally. Best of both."

**Section 8 — Newsletter + Footer**

### Membership — three variants (LOCKED)

Single product page (`/products/membership`) with variant selector:
- **4-Issue Membership** — pay upfront for 4 issues, best per-issue price for one-off
- **8-Issue Membership** — pay upfront for 8 issues, biggest saving
- **Rolling Membership** — auto-renews at each release (15 Feb / 15 Jun / 15 Oct), cancel anytime, softer commitment

**The Rolling Membership is new for theINmag.** Note the implementation requirements:
- Klaviyo flow specifically for Rolling renewal reminders ("your next Membership ships in 2 weeks — want to skip this issue?")
- Pause / cancel / skip-an-issue logic in customer accounts
- Pre-release address check email (currently in the brief) becomes critical for Rolling subscribers

### Variant decision (locked from v1)
Variants WITHIN the issue product page, not separate Print/Digital pages.

### The address confusion fix (locked)
Standard Shopify shipping + "Is this gift for someone else?" toggle revealing recipient fields. **Plus** new: gift note field, max 50 words, prints onto the AusPost shipping label via the Fulfilment Agent.

### The post-purchase upsell (locked)
"Can't wait for the postie? Grab the digital version now." One-tap, Sky Pilot delivers PDF immediately.

### Through-line targets
Links to: every product, every collection, audience pages (each product card has a "Who's this for?" micro-link), reviews, FAQ, Send IN, Freebies, Schools.

### Future-proofing
- Layout A vs B vs C — A/B test once Growth Agent has data
- Art Prints / Rich Learning Tasks tile slots already built, hidden via metafield
- International expansion: region selector at top of shop when viable

---

## 3. Individual Product Pages (/products/[handle])

### Above the fold
- Breadcrumb: Shop > [Collection] > [Product name]
- Large product image (zoom on hover/tap, Maude-style)
- Image carousel: cover, inside pages GIF, kid creators photo, kid quote
- Product title
- Price (with strike-through if on sale)
- Variant selector: Print / Digital (or for Membership: 4-issue / 8-issue / Rolling)
- Quantity selector
- "Is this a gift?" toggle (triggers recipient address + gift note flow)
- Add to Cart (yellow primary, purple hover)
- Buy with Shop Pay / Apple Pay / Google Pay
- Trust micro: "Free shipping over $40 · Ships in 1-2 days · 30-day refund guarantee"

### Sections below

**Section 2 — Inside this issue**
3-4 highlights. Each = image + 1 sentence. Featured Story / Featured Artist / Featured Puzzle / Featured Photo.

**Section 3 — From inside Mag[X]: a quick look**
4-5 image tiles from inside the mag (cover, art, story spread, puzzle, photo). The inside-pages animated GIF could fill this slot. **Replaces v1's "Who made this?" creator map** — per feedback, too much work for the value.

**Section 4 — Reviews**
Issue-specific reviews + Judge.me Group widget. Double social proof.

**Section 5 — You might also like**
Cross-sells: Membership (if viewing single issue) / Snack Pack (if viewing bundle) / matching digital (if viewing print).

**Section 6 — Product FAQ**
3-4 questions. "What age is this for?" / "What's the difference between this and a Membership?"

**Section 7 — Who's this for?**
Tile links to relevant audience pages.

### When sold out
Hero replaces "Add to Cart" with "This printed issue has sold out — but you can still read it digitally" + Digital variant selector + "Get the Digital Version" CTA. Sky Pilot delivers immediately. "Want to make sure you don't miss the next one?" → Membership CTA.

### AEO requirements
- Product schema (price, availability, image, reviews aggregateRating)
- BreadcrumbList schema
- FAQPage schema for product FAQs

---

## 4. For Parents (/for-parents)

### Above the fold
- Hero image: kid reading theINmag at a kitchen table, real moment, not posed
- Headline: "Finally, a magazine that makes your kid want to CREATE — not just consume."
- Subheadline: "Aussie kids fill every page. Yours could be next."
- CTA: "Get the Membership" (yellow) / "See What's Inside" (outlined purple)

### Sections

**Section 2 — Why parents love it (3 reasons, each with kid quote + creation visual)**
- Real kids, real creations, real inspiration
- No ads, no algorithms, no scrolling — just print or PDF
- Sustainably printed in Australia

**Section 3 — Press logos** (small section, trust signal — same as homepage)

**Section 4 — Common parent questions** (FAQPage schema)
- Will my child's creation actually get published?
- How are families using it at home?
- What age is theINmag for?
- Is it safe? What happens to my kid's data?
- Can I cancel a Rolling Membership?

**Section 5 — Real parent reviews** (Judge.me filtered to parent-tagged, Growth Agent prioritised)

**Section 6 — How families use it (auto-populated from theINside)**
Blog posts tagged `parents`. 3 most recent.

**Section 7 — Competitions for parents** *(NEW — adopted from feedback)*
Auto-populated competitions tagged `parents`, framed as "Great ones to do at home". 2-3 most relevant, current.

**Section 8 — Get them sending IN**
Light touch — don't make it feel like work for the parent. CTA: "Send IN their creation →"

**Section 9 — Newsletter signup** (custom inline form, on-brand)

**Section 10 — Bundle CTA + price comparison**

**Section 11 — Where we'll be next** *(NEW in v2.1 — light touch)*
A single line + small illustration of the van: "Want to spot us on the road? See where we're heading next →" links to /where-we-are.

Doesn't push parents into booking — just signals that the brand is real, in motion, and they might cross paths.

**Section 12 — Cross-link to other audience pages**

### Branching Out — REMOVED from this page per feedback

### Through-line targets
Membership, Send IN, Gallery, theINside (parent posts), Competitions (parent-framed), **Where we'll be next**, all other audience pages.

---

## 5. For Teachers (/for-teachers)

### Above the fold
- Hero image: classroom or small group reading theINmag
- Headline: "An authentic teaching tool your class will actually love."
- Subheadline: "Real student writing. Real student art. Real engagement — without a worksheet in sight."
- CTA: "Order for your school" (yellow, links to /schools) / "See the curriculum links" (in-page anchor)

### Sections

**Section 2 — Why teachers use theINmag (3 reasons)**
- Mentor texts kids actually want to read
- Visual prompts that drive open-ended discussion
- A pathway for student voice that goes beyond the classroom wall

**Section 3 — Backed by educators** *(NEW per feedback)*
Education Minister letters of support. 2-3 letter excerpts (with permissions) plus seal/signature. Massive credibility signal. Find existing letters when convenient — placeholder section until then.

**Section 4 — Curriculum links (the big move from homepage)**
Full mapping table from current homepage Contents section, restructured into clean accordion. Each section = name + Australian Curriculum links + 1 sample classroom lesson. Language: "rich, open tasks" not "inquiry."

**Section 5 — Classroom inspo (auto-populated)**
theINside posts + YouTube videos tagged `teachers`. The "for adults" YouTube lessons (planning structure breakdown) live here per feedback.

**Section 6 — Real teacher reviews** (Judge.me filtered, Trent's quote sits here)

**Section 7 — Competitions for teachers** *(NEW per feedback)*
Auto-populated, framed "Curriculum-linked competitions for upper primary".

**Section 8 — How to order for your school** (links to /schools)
- "Schools can pay by invoice — no card needed"

**Section 9 — Teacher resource pack** *(future)*
Ryan's existing 150-lesson-ideas document. Free download (Klaviyo-gated) or sent on order. Big design project for Claude later. **Placeholder section until rebuilt.**

**Section 10 — Free downloads for the classroom**
3-4 freebies from Freebies page, filtered teacher-relevant.

**Section 11 — Digital sharing rights** *(NEW per feedback)*
Explicitly emphasises: "Buy one digital copy, share with your team / your whole school under your licence terms." This is a teacher-specific value prop competitors don't match.

**Section 12 — Bring theINmag to your classroom** *(NEW in v2.1)*
Small section, big intent. One illustrated tile + a few lines of copy:

> "We run 2-hour incursions in schools across Australia. Real kid creations driving real engagement. Tailored to whatever unit you're teaching."

CTA: **"Book a workshop for your school →"** routes to /where-we-are.

The page handles the rest — the live travel map shows the school whether you'll be in their region, the booking enquiry form captures the details. From this audience page, the link feels like a natural value-add, not a pivot.

**Section 13 — Cross-link to other audience pages**

### Through-line targets
Schools, Freebies, theINside (teacher posts), Membership, Gallery, Competitions (teacher-framed), **Where we'll be next (workshops)**.

### Future-proofing
- Curriculum mapping needs annual review tied to ACARA updates
- "Resource Packs" tile slot built in, hidden until Rich Learning Tasks launch
- "Professional Development" path opens if Ryan and Tam ever do PD workshops

---

## 6. For Homeschoolers (/for-homeschoolers)

### Above the fold
- Hero: kid working at kitchen table or outdoors with theINmag
- Headline: "Learning that follows your kid's curiosity — not a timetable."
- CTA: "Get the Membership" / "Join the homeschool list"

### Sections

**Section 2 — Why homeschoolers love it (3 reasons)**
- Real kid voices = your kid sees they're not alone
- Open-ended prompts not lesson plans
- Made by educators, ad-free, thoughtfully curated

**Section 3 — How homeschool families use it** (auto-populated)
theINside posts tagged `homeschoolers`.

**Section 4 — Send IN: a brilliant homeschool task**
Light copy on submitting as self-directed task. Links to Send IN.

**Section 5 — Branching Out** *(MOVED HERE per feedback)*
Van life, child-led learning while travelling — genuine resonance with this audience. Embed Branching Out videos tagged `homeschoolers`. CTA: "Follow our journey →"

**Section 6 — Coming soon: Homeschool Resource Packs**
Email signup for future product. Klaviyo segment: `homeschool-resources-waitlist`.

**Section 7 — Real homeschool family reviews**

**Section 8 — Competitions for homeschoolers** *(NEW per feedback)*

**Section 9 — Bring theINmag to your community** *(NEW in v2.1)*
Small section, warm copy. Illustrated tile of Ryan and Tam with a homeschool group:

> "If your community meets up regularly, we might be able to drop in. Multi-age, kid-driven sessions tailored to whatever your group's into. ~$5 per family, paid on the day."

CTA: **"Book a session for your community →"** routes to /where-we-are.

**Section 10 — Cross-link to other audience pages**

---

## 7. For Kids (/for-kids) — substantially reworked per feedback

The most playful, animated, joy-forward page. Speaks directly TO the kid.

### The naming
URL `/for-kids` (universal). Page header: "Hey INkids!" Outside this page, default to "kids".

### Above the fold
- Hero animation: kid creations floating gently, slight wiggle on hover
- Big bold headline: "Hey! This is YOUR magazine."
- Subheadline: "Every page made by Aussie kids. Including, maybe, you?"
- Two big CTAs: "Send IN your creation" (yellow, huge) / "See what other kids made" (links to Gallery)

### Sections

**Section 2 — Recently submitted (live from Gallery)** *(REWORKED per feedback)*
Just live submissions, not "kids who made it into Mag09". Real-ish time. No manual curation. The Gallery's most recent approved submissions auto-populate here as a horizontal scrolling row. Names + ages + towns visible.

**Section 3 — What kind of stuff can I send?** *(REWORKED per feedback)*
Sliding tile carousel (saves vertical space on mobile). Each tile = a kid creation example + one-liner. **Tiles do NOT pre-select category** — single Send IN button at end of carousel routes to the universal form.
- Stories (Featured Story example)
- Drawings & Art (Art Hub example)
- Photos (Snaps example)
- Puzzles & Riddles (What's Not To Like example)
- Maths Problems (We Can Solve It example)
- Jokes
- Hobbies & Passions (HobbyTime example)
- Wonderings

**Section 4 — The Doodle Pad**
Local-only drawing canvas. No upload, no save to server, no account. Kid picks colours, brushes, undo. "Like what you made? Save it to your computer and send it IN." PNG download. Then link to Send IN.

**Section 5 — Kids' Corner** *(REWORKED per feedback)*
Tile grid of kid-submitted puzzles, jokes, riddles, word finds. **Two interaction modes per tile:**
- **Play on screen** (lightbox) — drag-and-drop word finds, click-the-pattern games, simple JavaScript puzzles
- **Print and play** (PDF download) — for puzzles that work better on paper

Kid picks. Same content, two delivery modes. Build 4-5 launchers, expand as kids submit.

**Section 6 — Colouring** *(REWORKED per feedback)*
- Two downloadable colouring sheets (current logo + kid-in-mag, the existing pair)
- Flick-through gallery of completed colourings other kids have submitted (uses gallery infrastructure)
- "Your turn" CTA → Send IN

**Section 7 — Hall of Fame**
Featured INkids — interview-style spotlights on kids published multiple times. No full faces. Their creations + name + age + town + creative-process quotes.

**Section 8 — Competitions for kids** (auto-populated, "You could WIN!" framing)

**Section 9 — Tips & tricks** *(REFINED per feedback)*
Lightbox popups, single tip per card. **Randomise on page refresh** — kid sees something new every visit. Build 10-12 tips at launch, add over time.

**Section 10 — Will we be in your area?** *(NEW in v2.1 — kid-fun framing)*
Small playful tile with the van: "Sometimes we drive around Australia in a van! See if we're heading near you →" links to /where-we-are.

Pure brand fun — the kid feels like they might spot the van one day. No commercial intent on this audience page; the parent comes back to the page later if they want to book.

**Section 11 — The send-in moment**
Big, bright, irresistible: "Ready? Send IN your creation."

### What we're saying NO to (locked)
- Voice notes (biometric data, hard to moderate)
- Links out to other kids' websites (replaced by on-site Kids' Corner)
- Open peer-to-peer canvas / chat / comments (moderation risk)

---

## 8. Send IN (/send-in) and the celebration page

### The form (JotForm, embedded)

Keep current JotForm. Improvements:

1. **Dynamic preview as kid types** — show name + age formatted as it would appear in the mag ("Jack K. | Cohuna VIC, age 12"). Done via JotForm Conditional Logic + Form Calculation Widget. Claude builds the exact configuration when we get to this page.

2. **The wheel — fixed.** Collapsed by default at top of form ("When will my creation be in the mag?" — tap to reveal). After submission, animates into focus on the celebration page.

3. **Single-tick consent** (LOCKED per feedback):

> ☐ I (parent/guardian) give permission for my child's creation to be considered for publication in theINmag, displayed on theINmag's website and social media, and — if selected as a print — used commercially with all proceeds reinvested into producing the next issue of the magazine.

The "all proceeds reinvested" framing is brand truth, visible on form not buried in fine print.

### The celebration page (/submitted) — Shopify-built

JotForm shows simple thank-you (current banana character + "thanks a bunch" works), with a "Yahoo! See what other kids made →" button that redirects to the Shopify-built celebration page.

The celebration page hosts:
- Confetti animation (Shopify-side, ~15kb JS library)
- The wheel showing the next mag drop date highlighted
- Kid creations bouncing around (CSS animation, respects `prefers-reduced-motion`)
- "Yahoo!" CTA → For Kids page
- Soft-link "While you wait, see what other kids made →" → Gallery

### NO Klaviyo trigger to kid (LOCKED per feedback)
We don't collect contactable details from kids. Period. The "thanks for sending IN" email goes to the parent who consented, only when their kid is actually published in print — not on every submission. This avoids the disappointment of letting kids down.

### Through-line targets
Routes inbound from every page. Outbound after submission to For Kids and Gallery.

### Future-proofing
Shopify-native form as JotForm replacement when budget allows — Q3-Q4 post-launch. JotForm cost is real, eventual saving is meaningful.

---

## 9. Gallery (/gallery) — Live Submissions Gallery

### Above the fold
- Headline: "Real kids. Real creations. Live from across Australia."
- Subheadline: "Every piece submitted, vetted, and shared."
- Filter bar: All / Art / Writing / Photos / Puzzles / Hobbies / Wonderings
- Search by location ("show me kids from Bendigo")
- **AI auto-tagged search** *(NEW per feedback)* — search "dogs" or "beach" or "robot" and find every submission with that subject across categories
- Sort: Most Recent / Random Shuffle / By Age

### The grid

Pinterest-style masonry grid. Variable heights. Lazy-loads. Confirmed Shopify Metaobjects handles 5,000+ items.

Each tile:
- The submission (image or rendered text card)
- Hover/tap: name + age + town overlay
- **Tap-through opens lightbox** *(NEW per feedback)*: full submission, kid's quote, "more from kids in [town]" link

### The text-only submission problem (existing flag)
Make.com workflow auto-generates a styled card image for text-only submissions before pushing to gallery.

### Vetting flow (LOCKED)
1. Kid submits via JotForm
2. Make picks up within 30 seconds
3. Claude API first-pass appropriateness check + AI auto-tagging (subject tags for searchability)
4. Auto-approved → pushed to Shopify Metaobjects → live
5. Flagged for review → Airtable for Ryan/Tam to review on phone
6. Auto-rejected (full faces, contact info, etc.) → quarantined, parent notified

### Image protection *(NEW per feedback)*
- **No download button** — locked
- **Right-click disabled** on gallery images
- **CSS `user-select: none`** on images
- **Watermark overlay** — small "theINmag" mark in corner of each displayed image
- **"No screenshots please — these creations belong to the kids"** message visible on gallery

Note: full screenshot prevention is technically impossible (every OS allows it). The combination above is the strongest realistic deterrent. Strongest actual protection is the moderation rule (only first name + initial + age + town, no faces, no contact info).

### Cutoff for old submissions *(per feedback)*
**No cutoff — but de-prioritised.** Old creations stay forever (the deal we made with families). But:
- Default sort = most recent first
- Featured carousel only shows last 12 months
- "Browse the archive" link for older

### What's NOT in the gallery (locked)
- No kid-to-kid commenting or messaging
- No likes or hearts
- No sharing buttons that auto-tag kids
- No download

### Through-line targets
Send IN (multiple times), individual product pages (filter by issue), audience pages, theINside.

---

## 10. theINside (/inside) — the blog (LOCKED naming)

### Blog Index Page

#### Above the fold
- Headline: "theINside"
- Tagline: "Field notes from inside the mag."
- Author tiles: Ryan and Tam, each with avatar + role + recent post count
- Filter: Topics (For Parents / For Teachers / For Homeschoolers / Behind the Mag / Kid Spotlights)

#### Sections
- Featured post (Maude-style: full-width image at top, title, excerpt, byline)
- Latest posts grid (3-column desktop, 1-column mobile)
- Subscribe box ("Get one good thing in your inbox each month")
- Archive by topic / by month / by author

### Blog Post Template (/inside/[handle])

1. **Title** — phrased as a question
2. **Featured image** — full-width, kid creation or real photo
3. **Byline** — named author, photo, date, **read time** *(LOCKED per feedback — "2 minute read" indicator)*
4. **Quick Answer** — 40-60 words, directly answers the title question
5. **Body** — 400-600 words, H2s as questions throughout
6. **Comparison table or callout** where the topic suits
7. **Internal links** — 2-3 contextual, descriptive anchor text
8. **FAQ block** — minimum 3 Q&As
9. **Natural CTA** — value-first, single nudge
10. **Related posts** — 3 auto-populated by tag overlap

### Schema (every post)
- Article schema with `author` populated to Ryan/Tam Person entity
- FAQPage schema matching FAQ block
- BreadcrumbList schema
- Publisher = theINmag Organisation entity

### Voice rules (non-negotiable, LOCKED)
- Posts must read like Ryan or Tam wrote them. Not polished marketing.
- Specific quirks, real anecdotes from the van, references to recent kid submissions, smart brevity
- Named author byline, never "theINmag team" by default
- Voice profile documents (Week 1 priority) are what protects this from drifting

### Future-proofing
- Kid guest blogger format: "Maya, age 9 — Guest blogger and theINmag contributor. Fremantle WA."
- Future contributors (teachers, librarians, illustrators) — each as a Person entity
- Eventual paid newsletter version if list grows enough

---

## 11. Competitions (/competitions) — REWORKED per feedback

theINmag does not run competitions. Curates external ones.

### Above the fold
- Headline: **"What are you into?"** *(LOCKED per feedback)*
- Subheadline: "Hand-picked competitions for Aussie kids — find one that fires you up."
- Two CTAs: "Submit a competition" (for organisers) / "See what's coming up" (in-page anchor)

### Sections

**Section 2 — Category tiles** *(simplified per feedback)*
Tiles: Art / Writing / STEM / Photography / Mixed / Other. Tap a tile to filter.

No more three-tab framing per audience on the comp page itself. The audience-specific framings happen IN the audience pages where preview cards link here. The Competitions page itself is universal.

**Section 3 — Coming up** *(NEW priority per feedback — chronological)*
Open competitions ordered by deadline, soonest first. Each entry:
- Brief writeup
- Who it's for (age range, location restrictions if any)
- Image/logo pulled from the comp's website
- Link to comp's socials and website
- Deadline date prominently displayed

**Section 4 — Closing soon**
Competitions with deadlines in next 14 days. Urgency drives traffic.

**Section 5 — Coming later**
Future competitions kids and parents and teachers can prepare for. Visible chronologically.

**Section 6 — Recent winners** *(future)*
Kid creations that won external comps. Big celebration energy. Initially hidden until winners exist.

**Section 7 — Submit a competition** *(NEW per feedback)*
For competition organisers. Simple form: organisation name, comp name, who it's for, deadline, link, image. Reduces theINmag's outreach work over time.

**Section 8 — Newsletter signup specific to comps**
"Get new comps delivered monthly" — Klaviyo segment: `competitions-list`. **Plus** dedicated Competitions section in the main monthly newsletter — 3 coming up soon.

### Auto-population
Research Agent finds new comps weekly. Pushes recommendations to dashboard. Ryan approves → pushed to Shopify Metaobjects via Make → appears here automatically.

### Through-line targets
Linked from: For Kids, For Parents, For Teachers, For Homeschoolers (each with audience-specific preview), theINside (when relevant), Newsletter (monthly comps roundup).

---

## 12. Our Story (/our-story)

### Above the fold
- Hero: photo of Ryan and Tam (and Nora, and the van) — real, joyful, not corporate
- Headline: "Made by two teachers in a van."
- Subheadline: "We started theINmag to give Aussie kids what we couldn't find — a place to be seen and heard."

### Sections

**Section 2 — How it started** (200 words max, smart brevity)

**Section 3 — Why "theINmag"** (the ON vs IN section, moved from homepage)

**Section 4 — Living the brief** *(MORE WEIGHT per feedback)*
Van life chapter. Travelling Australia. Working from anywhere. Nora the sidekick. Photos. Branching Out YouTube embed. Two CTAs side-by-side at end of section:
- **"Want to see how we actually do this from a van? Come hang out on YouTube →"** *(per feedback — strong soft CTA)*
- **"Want to spot us on the road? See where we'll be next →"** *(NEW in v2.1 — links to /where-we-are)*

**Section 5 — Where the money goes** *(NEW per feedback)*
The "all proceeds reinvested into the next print" brand truth. Honest, refreshing, builds enormous trust. Position before "Meet the team" — establishes the why.

**Section 6 — Meet the team**
Current grid moved here. Keep "young photo + adult photo" device. Add Nora.

**Section 7 — The packaging crew**
Kid nephews who pack orders. Keep — perfect.

**Section 8 — Acknowledgement of Country**
Elevated from footer-only. Proper section with First Nations kid artists featured. Links to dedicated Acknowledgement page.

**Section 9 — What we believe (the three pillars, gently)**

**Section 10 — Where we're headed**
Forward-looking note. Subscriber goal, more towns, the dream of art prints.

### AEO requirements
- Person schema for Ryan and Tam
- Organisation schema (theINmag entity, founded date, founders, social links)
- BreadcrumbList schema

### Through-line targets
Shop, Send IN, Branching Out, theINside, all audience pages, newsletter.

### Future-proofing
- "Press kit" download (B-roll, logos, founder quotes for journalists)

---

## 13. Where we'll be next (/where-we-are) — NEW in v2.1

The travel-and-workshops page. Single URL serves four jobs at once: brand storytelling (the van life made visible), workshop booking funnel for schools, workshop booking funnel for homeschool communities, and a demand-signal collector via the request-a-session form.

The page is named for the brand-warm framing ("Where we'll be next") rather than the functional one ("Workshops"). The travel content is the lure; the booking is the conversion. Every audience has a reason to land here.

### Above the fold

- Hero image: the van + Ryan + Tam + Nora (or current iteration), real, road-trip energy
- Headline: **"Where we'll be next"**
- Subheadline: "Two former teachers in a van. Three workshops. One country to crisscross."
- Trust micro-bar: "Schools · Homeschool communities · No two sessions the same"
- Two soft CTAs (anchor links, not separate buttons): "See where we're heading →" / "Want us to come?"

### Sections

**Section 2 — The live travel map**

Regional + monthly only — never specific towns or addresses. Privacy boundary is non-negotiable.

The map shows Australia coloured by approximate region with a date band per region. Examples:

- "Northern NSW coast — June to early July"
- "Brisbane area — July"
- "Queensland coast — August to November"
- "Tasmania — December to February"
- "Western Australia — 2027"

Each region tile, when tapped/hovered, expands to show:
- The rough timeframe
- 2-3 example towns we'll *probably* pass through (not exact, not committed)
- A button: "Want us nearby? Tell us →" → routes to booking flow

Below the map, the brand-warm copy:
> "If you spot the van, give us a wave. Toot your horn. Maybe even chuck us a sandwich. We're always happy to be spotted by people who get what we're doing."

This sets the tone — public-facing, warm, but no addresses, no "come visit us at this campsite tonight" energy.

**Section 3 — How it works (3-step)**

Illustrated, simple:
1. **See where we're heading.** (The map above.)
2. **Tell us you'd love a session.** (Forms below.)
3. **We confirm and lock it in.** (Manual at launch, agent-assisted later.)

**Section 4 — School workshops**

Header: **"For schools — bring theINmag to your classroom"**

What schools get:
- A 2-hour incursion led by Ryan (or both Ryan and Tam where logistics allow)
- Tailored to the unit you're running — persuasive writing, poetry, visual arts, a "your voice matters" inspiration session, or a custom focus
- Multi-class flexibility: combine groups into one big workshop, or run two 1-hour sessions deeper, or one 2-hour deep dive — the school decides
- Real published kid creations as the driver throughout — never generic activities
- A class set of mags left behind (negotiable, depending on numbers)

What it costs: **$250 for a 2-hour session** (current price — under-priced for the value, flagged for revisit post-launch when demand is visible)

CTA: **"Enquire about a school workshop →"** opens an inline enquiry form.

Form fields:
- School name
- Address (postcode minimum — used to match against travel route)
- Contact name + role
- Email + phone
- Year levels and approximate student count
- What you're hoping to focus on (free text, with example prompts)
- Preferred timeframe (free text, e.g. "September, ideally during our poetry unit")

On submission: form goes to Ryan via Slack/Email (Inbox Manager Agent picks it up). Ryan replies manually at launch. Future: Travel Agent cross-checks against itinerary, suggests yes/no/maybe, drafts the response.

**Section 5 — Homeschool sessions**

Header: **"For homeschool communities — bring theINmag to your group"**

The vibe: relaxed, multi-age, kid-driven. ~10am default, flexible to fit existing community meet-up days.

**A session might look like this** *(visual flow, not rigid agenda)*:

The 5-stage flow shown as a soft horizontal sequence (each stage a card with a one-line description and an example image):

1. **Mag flick-through.** Kids spot what they love.
2. **Build your cheat sheet.** Each kid writes their passions, interests, hobbies — the parents leave with a list that drives learning for months.
3. **Make a minion.** Kids draw their own minion character, taking inspiration from creations in the mag.
4. **Story time.** We read a story aloud — written by another Aussie kid.
5. **Build a story together.** Kids riff off each other, creating something out loud as a group.
6. **A maths lesson sent IN by a kid.** Multi-age, collaborative, more fun than it sounds.

Below the flow: "We adapt every session to the families coming. Tell us what your group's into and we'll shape it around that."

**What it costs:** roughly $5 per family, paid in cash or Square on the day. (Lower than schools because most families also buy a mag or sign up for a Membership on the day — the workshop pays for itself differently.)

CTA: **"Enquire about a homeschool session →"** opens an inline enquiry form.

Form fields:
- Your name
- Community/group name (if applicable)
- Suburb/town + postcode
- Email + phone
- Approximate group size (number of families + age range of kids)
- Preferred day of the week (some communities meet on a fixed day)
- What your group's into (free text)
- Preferred timeframe

On submission: same flow as schools. Ryan handles manually at launch.

**Section 6 — Request a session somewhere we're not heading**

Adopting your "have both" preference. The framing matters here — this isn't a promise, it's a demand signal.

Header: **"Want us in your area?"**
Subheadline: "We can't be everywhere — but where you ask actually shapes our route."

Form fields:
- Your name
- Suburb/town + postcode
- Email
- Are you a school, a homeschool community, or someone else? (radio)
- Tell us why theINmag would work in your community (free text)

On submission: data goes into the same backlog the Travel Agent will eventually use to inform routing decisions. Manual review at launch — Ryan reads, says yes/no/maybe in his head, may reach out.

The form copy explicitly says: "We can't promise anything, but every request shapes where we head next." Honest, no over-promising.

**Section 7 — Workshop reviews**

Filtered Judge.me reviews — workshop-tagged only.

Plus a CTA: "Had us at your school or community? Leave a review →"

A separate Judge.me product entity called "Workshops" holds these reviews. Schools and homeschool families review the SESSION as a Judge.me product (even though no money flowed through Shopify for it). This builds the social proof loop the page needs.

For early launch — manually solicit reviews from past workshop hosts. The brief mentions "we might even reach out to some sessions and get them to fill it in." Lock that in as a Day-1 outreach task.

**Section 8 — Coming soon: online sessions**

Single line + email signup. "One day we'll run online sessions for kids and families anywhere in Australia. Want to know when?" Klaviyo segment: `online-workshops-waitlist`.

Hidden until validated as a real product direction. Just the signup, no further content.

**Section 9 — Cross-links**

End of page links to: For Teachers / For Homeschoolers / Our Story / Membership. Anyone landing here who isn't ready to book gets a graceful next step.

### The Travel Agent (future infrastructure)

Building this post-launch, but architecting the data flow now so we don't rebuild later:

- Master itinerary lives in Google Calendar or Airtable (Ryan + Tam's source of truth)
- Workshop enquiries land in a dedicated "incoming requests" queue (Airtable)
- The agent reads both, cross-references location + date, recommends accept/decline/maybe with a draft response
- Ryan or Tam approves in 5 seconds, the agent does the rest (replies, calendar invite, payment instructions, post-session review request 2 weeks later)
- Aggregate request data over time becomes the routing input for next year's travel planning

Defer the build until the website is humming. Manual flow at launch is fine — most weeks won't have more than 2-3 enquiries to process.

### Privacy boundary (LOCKED)

The map is regional + monthly. Never:
- Specific addresses or coordinates
- Specific weeks of specific towns
- Real-time location ("we're at this caravan park tonight")
- Photos that geotag or reveal location specifics

The "give us a wave" copy makes it brand-warm without inviting drop-ins. If pressed by an enthusiastic visitor, default response is: "We'd love to meet you — book us into your school or community session and we'll make it happen properly."

### Through-line targets

Inbound — every audience page surfaces this with audience-specific copy:

| Audience page | Link copy |
|---|---|
| For Parents | "See where we're heading next →" |
| For Teachers | "Book a workshop for your school →" |
| For Homeschoolers | "Book a session for your community →" |
| For Kids | "Will we be in your area? →" |
| Our Story | "Follow our journey on the road →" |

Each of these is a single tile or footer link in the relevant audience page (NOT a major section — the audience pages stay focused on their primary conversion).

Outbound from /where-we-are: For Teachers, For Homeschoolers, Our Story, Membership, Newsletter signup.

### AEO requirements

- BreadcrumbList schema
- Event schema for confirmed upcoming sessions (when ones exist)
- FAQPage schema for "What does a homeschool session look like?", "What does a school workshop cost?", "Will you come to my area?"
- LocalBusiness or Organization schema with serviceArea covering Australia (broad) — helps with "kids' workshops Australia" type searches

### Future-proofing

- Online session product when ready (already has its waitlist signup slot)
- Multi-presenter expansion (when Ryan and Tam can split and cover more ground simultaneously)
- Workshop merchandise (custom mag bundles for sessions, signing copies, etc.)
- A "past sessions" archive page once enough have run — proof of consistency
- Integration with school booking platforms like CompassEducation when scale demands it

---

## 14. Freebies (/freebies)

### Above the fold
- Headline: "Ohh goodie!"
- Subheadline: "Bite-sized creative tasks pulled from the magazine. Yours, free."
- Filter: Category / Mag / Audience (parent / teacher / homeschooler / kid)

### Sections

**Section 2 — Freebies grid (mosaic, RANDOMISED on each page load)** *(NEW per feedback)*
Each load: top 12 freebies shown in random order. Filters override randomness when applied. Keeps the page fresh for returning visitors. No duplicate ordering.

Each freebie tile:
- Cover image (preview of the activity)
- Title
- Mag origin badge ("From Mag07")
- Audience tags
- Category tag
- Big "Download" button

**The download flow:**
- First download: inline form (email + first name). User added to Freebies segment + tagged by category.
- Subsequent downloads (cookied): instant, no form again.
- All goes into the standard Klaviyo welcome flow.

**Section 3 — "Want the whole magazine?"**
Soft sell to Membership.

**Section 4 — Newsletter signup with Freebies emphasis**

### Wix CMS migration *(NEW per feedback)*
When Matrixify export runs, Claude reads the full export and migrates every tag, alt text, image description, SEO field properly into Shopify metafields and image alt-text. Strong AEO play — every image with descriptive alt text is a chance for AI engines to surface theINmag.

### Through-line targets
Linked from: every audience page, theINside, homepage, every product page, newsletter.

---

## 15. Schools (/schools)

### Above the fold
- Headline: "Real student writing. Real student art. In your classroom."
- Subheadline: "theINmag for schools — easy invoicing, bulk pricing, no faff."
- Two CTAs: "Request an invoice" (yellow, primary) / "See pricing" (in-page anchor)

### Sections

**Section 2 — Why schools order theINmag**
Three reasons (each with short teacher quote).

**Section 3 — Pricing with discount tiers** *(LOCKED per feedback)*
- Single copy / class set: standard pricing
- **5 Memberships or more = 5% off**
- **10 Memberships or more = 10% off**
- Cap at 10% — no further discount tiers (protects margin)

**Section 4 — How school ordering works**
3-step illustrated:
1. Tell us what you need (form below)
2. We ship the mags AND send the invoice (Net 14 days)
3. School pays the invoice via the secure link

**Important:** ship-before-pay is the default. Net 14 timer starts at invoice send. Most schools prefer this — shows trust, mag arrival creates internal urgency.

**Section 5 — theINmag's information** *(NEW per feedback)*
Schools need our info to set us up as a vendor. Clearly listed, copy-pasteable:
- Business name: theINmag
- ABN: [Ryan's ABN]
- Postal address: [the van PO box or business address]
- Phone: [contact number]
- Contact name: [Ryan or Tam]
- Email: heyhey@theinmag.com.au
- Website: theinmag.com.au

**Section 6 — Request an invoice form**
Fields: school name, ABN (optional), billing address, shipping address (different if needed), contact name, email, phone, what you want to order (product picker + qty), purchase order number (optional).

On submit: Make.com → Shopify Draft Order created → invoice generated → emailed to school + Ryan notified.

**Section 7 — School testimonials** (Trent's quote, others as collected)

**Section 8 — Resources for teachers**
Cross-links to For Teachers and Freebies.

**Section 9 — Teacher resource pack** *(future)*
The 150-lesson-ideas document Ryan needs to find. Free download (Klaviyo-gated) or sent on order. Big design project for Claude later. **Placeholder until rebuilt.**

### Through-line targets
For Teachers, Membership, Stockists, Footer.

### Future-proofing
- Bulk pricing tier extends to library and bookshop trade pricing
- "Recurring school subscription" SKU built in but enabled on demand

---

## 16. Stockists (/stockists)

### Above the fold
- Headline: "Find theINmag near you"
- Subheadline: "Or become a stockist yourself."
- CTAs: "Find a stockist" (anchors to map) / "Become a stockist" (anchors to form)

### Sections

**Section 2 — Stockist map**
Interactive, filterable by state. Each pin: shop name, address, hours, what they stock, link to website.

**Section 3 — Featured stockists**
3-4 spotlight stockists with stories.

**Section 4 — Become a stockist**
Form fields: name, shop name, location, email, "tell us about your shop", "why does theINmag fit?"

**Section 5 — Download the media kit**
**v1 PDF for launch** — current numbers as a static document, updated quarterly.
**v2 (Month 4-6)** — Canva master file with Google Sheets integration auto-pulling live numbers (subscribers, distribution, demographics, press mentions). Faire integration extends from same data source.

Klaviyo email-gated download (segment: `media-kit-stockist`) so Ryan can follow up.

**Section 6 — FAQ for would-be stockists**

### Through-line targets
For Teachers (some shops sell to schools), Footer, Membership.

---

## 17. Partnerships (/partnerships)

The brief: "We don't really know where this will go." Building the page deliberately broad and open-ended.

### Above the fold
- Headline: "Let's make something kids will love"
- Subheadline: "theINmag works with carefully-chosen partners — brands, arts orgs, schools, libraries — who genuinely care about kids' creativity."
- CTA: "Start a conversation"

### Sections

**Section 2 — What partnership could look like** *(REFRAMED per feedback — open-ended)*

**Content partnerships:** Sponsored sections (clearly labelled, only with brands aligned to kids' creativity — art supply brands, book publishers, museums) / Co-created issues with arts orgs / Guest sections from authors and illustrators

**Audience partnerships:** Library bulk subscriptions / Hospital programs (organic story already happening — formalise it) / Dental and medical waiting rooms / After-school programs

**Mission-aligned cause partnerships:** Donations supporting kids' creativity / B-Corp alignment / First Nations kids program partnerships

**Revenue-direct:** Bulk corporate gifting / Co-branded merch with aligned kid brands

**Section 3 — Who we don't work with**
- No advertising of products to kids
- No data-collection partnerships
- No alignment with brands that conflict with kids' wellbeing

This section is a powerful trust signal for partners AND parents.

**Section 4 — Past collaborations** (initially hidden, activated when partnerships exist)

**Section 5 — Get in touch**
Form: name, organisation, role, type of partnership interested in (radio buttons), what you have in mind (free text), email, phone. Submits to `partnerships@theinmag.com.au` and Slack-notifies Ryan.

### Future-proofing
- B2B sales path opens off this page
- If a Brand Agent ever exists in the AI stack, this page is its inbox

---

## 18. Contact (/contact)

### Above the fold
- Headline: "Get IN touch"
- Subheadline: "We read every message. Usually reply within 2 business days."
- **Email visible directly on page:** heyhey@theinmag.com.au *(LOCKED per feedback)*

### Sections

**Section 2 — How can we help?**
4 pathways (specialist enquiries route correctly):
- "I want to order for my school" → /schools
- "I want to stock theINmag" → /stockists
- "I'm a brand or org wanting to partner" → /partnerships
- "I have something else to say" → general form below

**Section 3 — General enquiry form**
Name, email, subject (dropdown — Membership / Send IN / Wholesale / Press / Other), message. Honeypot for bots.

**Section 4 — Social channels**
Instagram, Facebook, YouTube — each shows a recent post preview.

**Section 5 — Address**
Postal address.

**Section 6 — FAQ for "before you contact us"**
Most-asked questions (Membership change, address change, missing issue, refund). Reduces inbox volume.

### Through-line targets
Routes inbound from every page footer + relevant CTAs.

---

## 19. Privacy + Terms + Child Safety (/privacy) — SINGLE PAGE per feedback

Per feedback: one page, three sections, friendly tone with humour and minion characters interspersed. People need to read this before submitting — three pages would be a barrier.

### Page structure

**Section 1 — Child Safety** (most important, leads the page)
Plain-English version of the protection commitments. What we do, what we never do, how parents can request removal. Minion characters around the dense text breaks.

**Section 2 — Terms & Conditions**
Site use, submission terms, purchase terms, refunds. **Update from current page:** replace COPPA reference (US law) with Australian Privacy Principles + Privacy Act 1988 (Cth). Add brief EU-specific clause (GDPR data minimisation + right to erasure) for international submissions. Note: Australian law applies because theINmag is Australian-registered, servers in Australia, jurisdiction specified Australian.

**Section 3 — Privacy Policy**
What data we collect, why, how long, who sees it, your rights, contact.

### Voice rules (LOCKED per feedback)
- Plain English, short sentences
- Real examples woven in
- Light humour where it doesn't dilute legal weight
- Minion characters as visual breaks
- Annual review and update with date stamp
- "Last updated" date at top

### International submissions
One document covers all. Australian law is the default. Brief EU clause inside the same page for European visitors. No country-specific separate documents.

### Through-line targets
Footer (always visible), Send IN form (consent linked here), checkout (T&Cs linked here), every form on the site.

### Future-proofing
- Annual review against evolving Australian law
- Children's Online Privacy Notice (kid-readable summary) — best practice in 2026 per OECD digital safety frameworks
- "Request your data" / "Request removal" form anchored on this page

---

## 20. Acknowledgement of Country (/acknowledgement)

Dedicated page. First Nations kid artwork featured (rotating quarterly or per-issue, drawn from the 5-6 sample artworks Ryan will provide). Honours the practice as living and growing.

### Through-line targets
Footer link. Linked from Our Story.

### Future-proofing
- Annual "First Nations kids issue" feature
- Partnerships with First Nations arts organisations

---

## 21. FAQ (/faq) — Master FAQ page

Consolidates all FAQ content from across the site. Searchable. FAQPage schema-marked.

Sections by topic:
- About theINmag
- Membership and orders
- Submitting creations
- Schools
- Privacy and safety
- Shipping and returns
- Digital vs print
- Build a Bundle and gifts

Each FAQ block FAQPage schema-marked. Internal anchor links so individual questions are URL-shareable.

---

# Part 3 — Audit (what changed in v2 + Wix vs Shopify)

## Changed since v1 (full list)

| Element | v1 | v2 (LOCKED) |
|---|---|---|
| Audience nav | "For You" | **"Who's it for?"** |
| Freebies | Footer-only | **Primary nav** |
| Subscription | "Subscription" placeholder | **"Membership"** (3 variants) |
| Bundle products | Single bundle | **Membership + Build a Bundle** |
| Klaviyo popup | Keep + inline | **Scrap popup, multiple inline forms** |
| Send IN consent | Three ticks | **Single tick all-in-one** |
| Revenue framing | TBD | **"All proceeds reinvested into next print"** |
| Blog name | "Blog" | **"theINside"** (URL `/inside`) |
| "Work" terminology | Used | **Replaced with "creation" sitewide** |
| Buttons | Generic primary | **Yellow / purple hover convention** |
| Send IN celebration | JotForm-side | **Shopify-built `/submitted` page** |
| Kid newsletter | Mentioned | **Removed entirely — never** |
| Release date | Manual | **Auto-cycle 15 Feb / 15 Jun / 15 Oct, "just dropped" 3-week window** |
| Reviews migration | Set up Judge.me | **Manual import from existing emails/DMs is fine** |
| Schools terms | Net 30/60 | **Net 14, ship-before-pay, 5%/10% discount tiers, our ABN/info on form** |
| Privacy/Terms | 3 pages | **1 page, friendly tone, minion characters** |
| Gallery | Open lightbox | **+ AI auto-tagging, watermark, screenshot deterrents, no downloads, no cutoff** |
| Branching Out | Multiple pages including For Parents | **Removed from For Parents, sits on Our Story + For Homeschoolers** |
| Press logos | Shop only | **+ Homepage + For Parents** |
| Education Minister letters | Not mentioned | **Exclusive to For Teachers** |
| Competitions on audience pages | Implied | **Explicitly added per audience, framed appropriately** |
| For Kids Section 2 | "Made it into Mag09" | **Just live submissions** |
| For Kids Section 3 | Tiles → pre-selected category | **Tiles inspire, single Send IN button** |
| Kids' Corner | TBD | **Lightbox play OR PDF download per puzzle** |
| Tips & tricks | Static | **Lightbox popups, randomised on refresh** |
| Freebies grid | Default order | **Randomised on every page load** |
| "Work" / "creation" | Inconsistent | **"Creation" everywhere — locked** |

## What stays from current Wix (good as-is)

- Acknowledgement of Country (elevated to dedicated page)
- Hospital story, Trent quote, "fridge is an art gallery" mum review — all preserved on relevant pages
- Team page with young/adult photo device — perfect, kept
- Packaging crew kids — perfect, kept
- First Nations kid artist feature — elevated and rotated
- Branching Out — repositioned (off For Parents, onto Our Story + For Homeschoolers)
- Newsletter signup wording — works as-is
- Shop FAQ content — strong voice, repurposed widely
- Featured kid attributions everywhere — the brand's most powerful device

## What dies

- Duplicate "Meet The Team" nav item
- Wix-template Competitions page (lorem ipsum)
- "Use this space to share reviews" placeholder on homepage
- External "kids' websites" links (replaced by Kids' Corner on-site)
- Generic Wix product page templates
- Snowy + Libby website credit in footer (phasing out)
- COPPA reference in privacy policy (US law, doesn't apply)
- Klaviyo popup (replaced by inline forms)
- Three-page privacy/terms split (consolidated to one)

## What's new (didn't exist on Wix)

- All four audience landing pages
- theINside (blog) — entirely new
- Live Submissions Gallery — entirely new
- Master FAQ page
- Press / Media kit (in Stockists)
- Membership product structure
- Build a Bundle product
- Soldout-to-digital upsell
- Mixed digital/physical bundle
- Post-purchase upsell
- Address fix at checkout (gift orders)
- Schools invoice flow
- Schools resource pack (future)
- Education Minister letters section
- Partnerships page
- Real Competitions Hub
- Stockists map
- Stockists media kit
- Acknowledgement of Country dedicated page
- Submission celebration page (Shopify-built)
- Doodle Pad
- Kids' Corner with on-screen + PDF play modes
- Tam's "peek inside" video on homepage
- Auto-cycling release date logic
- Custom inline newsletter forms (no popup)
- Randomised Freebies grid
- AI auto-tagging on Gallery
- **Where we'll be next page** *(v2.1)* — travel map + workshop bookings + reviews + request-a-session
- **School workshop enquiry form** *(v2.1)*
- **Homeschool session enquiry form** *(v2.1)*
- **Request-a-session demand-signal form** *(v2.1)*
- **Online sessions waitlist** *(v2.1, hidden until validated)*
- **Workshop reviews via Judge.me Workshops product entity** *(v2.1)*

---

# Part 4 — Decisions, recommendations, and reasoning

## Why these changes from v1

### Why "Membership" instead of "Subscription"

The word "subscription" carries stigma — people associate it with recurring charges they forgot to cancel. theINmag's tri-annual model means it's only billed 3 times a year (or 1-2 times for upfront bundles), which is materially different from a Netflix-style subscription, but the word still puts people off.

"Membership" reframes the relationship - the customer is *part of* something, not paying for a service. It carries warmth, belonging, and longevity in a way "Subscription" doesn't. Works in formal contexts ("Schools - order Memberships in bulk") and casual contexts equally well. The three-variant structure (4-Issue, 8-Issue, Rolling) covers every commitment level from try-it-once to never-think-about-it-again.

Note: "Letterbox Drop" was an interim name explored briefly in early May 2026 and scrapped quickly. The term is banned across all customer-facing copy, agent outputs, and internal documents going forward. Older project documents that still reference it should be ignored or updated.

### Why scrap the Klaviyo popup

Multiple inline signup forms across the site (homepage, Freebies, every audience page) catch engaged users naturally. The popup was the catch-all because most sites have weak inline forms. We're not building those weak forms. Net result: more signups, less annoyance, more on-brand.

### Why single-tick consent

Three ticks creates friction at the moment of submission. Parents tick once and move on, or get confused and abandon. One tick that bundles all three rights, with the brand-truth framing visible ("all proceeds reinvested into the next print"), is honest, fast, and builds trust rather than slowing it down.

### Why "creation" not "work"

A girl in a school told us "art is not work." She's right. "Work" implies labour, obligation, output for someone else. "Creation" implies joy, ownership, intrinsic motivation. theINmag's pillar is that kids create because they want to, not because they have to. The language should reflect that.

### Why the random Freebies grid

Returning visitors hit the page and see the same top 12 every time. Boring. Random ordering keeps it fresh, surfaces under-used freebies (every freebie gets a turn near the top), and encourages a habit of "I'll go check what's there today." Tiny code change, big retention payoff.

### Why ship-before-pay for schools

Schools have notoriously slow procurement. The mag arriving creates internal urgency that no email follow-up can match. The principal sees the mags, gets excited, walks the invoice down the hall to accounting. This is how you go from "we'll think about it" orders to "we've got it on our shelves" orders. Net 14 vs Net 30/60 also means cash arrives meaningfully faster.

---

## Future-proofing (LOCKED items + new)

### Build infrastructure now, fill content later

1. Library and bookshop wholesale (extends from Stockists, Faire integration Month 4)
2. Art Prints product line (collection slot mapped, Printful integration Month 2-3)
3. Rich Learning Tasks (collection slot mapped, infrastructure built Week 1)
4. Homeschool resource packs (landing slot built, hidden until ready)
5. Subscriber-only content (Shopify customer accounts + Klaviyo segmentation)
6. Print-on-demand merchandise (same Printful model)
7. theINmag YouTube three-lane structure (lessons-for-adults / lessons-for-kids / showcase) — auto-population infrastructure handles all three
8. Live events page (`/events` extends from Stockists' geographic infrastructure)
9. Teacher resource pack (Ryan's 150-lesson document — design project for Claude when found)
10. Stockist media kit v2 (Canva + Google Sheets live data, Month 4-6)
11. **Travel Agent** *(v2.1)* — itinerary management, workshop request triage, calendar coordination. Manual at launch, agent-assisted post-launch when site is humming.
12. **Online sessions product** *(v2.1)* — waitlist signup already on /where-we-are. Validate demand, build when ready.
13. **Workshop pricing review** *(v2.1)* — $250/2hr is under-priced for a school incursion. Revisit after first 6-12 months of bookings to set new price floor.

### Things to NOT build (LOCKED)

1. Forum or community features
2. Login-required member areas
3. Points/rewards/gamification
4. Auto-populated "trending" or "popular" sections among kids
5. Aggressive popups beyond the (now-scrapped) welcome
6. Voice notes from kids
7. External links to other kids' sites
8. Open peer-to-peer canvas / chat / comments
9. Kid newsletter / kid email list / any kid contactable data collection

---

## Through-line consistency check

Pick any two pages, trace the natural path. If more than 2 clicks, architecture has failed.

- Homepage → Buy Membership: 2 clicks
- For Teachers → Order for school: 2 clicks
- For Kids → Submit creation: 1 click
- theINside post → Buy Membership: 2 clicks
- Gallery → Submit your own: 1 click
- Stockist enquiry → Media kit: 1 click
- Schools page → Membership CTA: 2 clicks
- For Teachers → Book a workshop: 2 clicks
- For Homeschoolers → Book a session: 2 clicks
- Our Story → See where we're heading: 2 clicks (or 1 from the in-section CTA)
- /where-we-are → Membership CTA: 2 clicks (the page cross-links at the bottom)

All paths pass.

---

## Site-wide elements (every page must have)

1. Header: logo, primary nav, persistent yellow Send IN button
2. Sticky announcement bar: Membership offer / next mag countdown ("just dropped" 3-week window auto-applied)
3. Footer: full nav, forms, shop links, social, legal, Acknowledgement of Country (link to dedicated page), © year, "Made with care in Australia"
4. Cookie consent banner: Australian-Privacy-Principles compliant, decline-all most prominent
5. Mobile-first responsive: Pixel 6 testing baseline
6. Skip-to-content link
7. Schema markup: Organisation, BreadcrumbList minimum
8. Hover-zoom on every image (Maude-style, subtle)
9. At least one named kid attribution per page

---

## What this document does NOT cover

- Final Membership pricing
- Visual design tokens (separate file: `theinmag-design-tokens.md`)
- Specific Liquid template code (Claude Code writes during build)
- Klaviyo flow specifications (separate doc: `theINmag Klaviyo Strategy Guide`)
- Make.com automation specifications (separate doc: `theINmag AI Agent Strategy v4`)
- Voice profiles for Ryan and Tam (Week 1 priority, separate doc)
- Image asset library (audited and TinyPNG'd May 1 2026)

---

## Next actions

1. **Today/tomorrow** — Tam reviews v2 and annotates any disagreements
2. **Day 1 of Shopify build** — Use this sitemap as master reference. Build pages in tier order: Tier 1 (conversion) → Tier 2 (audience) → Tier 3 (brand) → Tier 4 (legal)
3. **Each session** — Open this doc + design tokens + relevant page section. Brief Claude Code on the exact section being built
4. **Update this doc** as decisions get made: Membership pricing finalised, A/B test results, page additions/removals

---

*Document version: v2.2, May 3 2026*
*Companion: theINmag Sitemap Diagram (SVG)*
*Companion: theinmag-design-tokens.md*
*Companion: theinmag-design-principles.md*
*Companion (new): theinmag-dawn/homepage-build-spec.md - supersedes homepage section of this document*
*Drop into "theINmag — Shopify Build" project*
*Replaces v1, v2.0, and v2.1*
