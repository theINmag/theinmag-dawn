# Blog post template - build spec

This is the build brief for theINmag's standard blog-post layout. Every field-notes article uses this template. Inspiration: Maude's editorial pattern at https://getmaude.com/blogs/themaudern/sex-across-language-barriers (Ryan has reference screenshots in the chat).

**Read these before starting:**
- `CLAUDE.md` (brand fundamentals, safety rules)
- `theinmag-design-tokens.md` (colours, type, spacing, shadows)
- `theinmag-design-principles.md` (philosophy)
- `homepage-build-spec.md` (for sibling pattern reference)
- Memory files (auto-loaded): `feedback_inter_for_blog_titles`, `reference_kid_character_pattern`, `feedback_kid_characters`, `feedback_premium_photo_text`, `project_field_notes_rename`

**Where it lives:**
- New section: `sections/theinmag-article.liquid` (replaces use of `main-article.liquid`)
- Wired up via `templates/article.json` (currently uses Dawn's default)
- Renders at `/blogs/theinside/<post-slug>` for now (handle becomes `field-notes` later, see memory)

---

## The shape

A two-column post layout. **Left column: cover image, sticky.** **Right column: article body, scrolls.**

### Hero state (top of page, before any scroll)

- **Left column** = cover image, full viewport height, fills its column edge-to-edge.
- The image is **slightly darkened** at hero state (~0.65-0.75 brightness OR a dark gradient scrim) so the white overlay text reads clean.
- **White overlay on the image:** post title (Post Regular, large), then byline (`By Ryan` / `By Tam` / kid attribution), then topic chip. White text + soft text-shadow (per `feedback_premium_photo_text` memory: white + scrim, never coloured pills).
- **Right column** = white/cream surface, holding the article body. At hero state the right column shows the *intro* / lede paragraph in larger pull-quote-ish type so the page reads as one composed editorial spread, not "image left, words right."

### Scroll state (as the user scrolls)

- The **white overlay on the image fades out and translates up** (~24px) as the user scrolls past ~50-80% of viewport height. Ease-out timing.
- The **image brightens** from darkened to full natural brightness over the same scroll range.
- The **left column stays sticky** (or `position: sticky; top: 0; height: 100vh`) so the image doesn't move while the right column scrolls.
- The **right column scrolls normally** with the article body.
- Sticky-left releases at the bottom of the article so the image doesn't overrun into the recommendations section below.
- **`prefers-reduced-motion: reduce`**: skip the fade/brighten. Image at full brightness from the start; overlay text stays visible until naturally scrolled past. No sticky parallax (let everything scroll normally).

### Image rules (locked)

**One canonical cover image per post.** That image is `article.image` (set in Shopify admin when creating/editing the post). It is used:
- Here on the post hero (left column)
- On the homepage `theinmag-blog-feed` cards
- On the field notes editorial / archive cards
- On the field notes feature banner (if this post is featured)
- In any future preview surface

Don't introduce a separate "hero image" vs "card image" picker - one source of truth so previews always match the post they link to. Aspect ratio: portrait (3:4) or square works best for the split-hero left column. Width 2400px+ recommended.

**No image reuse on the same surface** - per `feedback_no_image_reuse_same_page` memory. If this post is the day's feature banner, it can't also appear in the same page's archive grid as a card. The blog landing already accounts for this; just don't break it.

---

## Author block

Three author types:

| Type | Display | Photo | Schema |
|---|---|---|---|
| **Ryan** | "By Ryan" | small circular avatar (real photo) | `Person` schema with `sameAs` socials |
| **Tam** | "By Tam" | small circular avatar (real photo) | `Person` schema with `sameAs` socials |
| **Kid guest** | "By Maya, age 9 - Fremantle WA" | kid-character illustration (NOT a real photo - brand safety rule, locked) | bare author name string in Article schema; no Person schema |

The kid-character illustrations slot into the existing kid-character pattern (`sections/theinmag-mission.liquid` is the reference implementation - random-of-three pool, scroll-pop reveal). For the article author block we don't need scroll-pop; just a static character. Pool matched to author "voice" if helpful.

### Placement: TOP + BOTTOM (decided)

**TOP** (small chip, sits below the post title in the right column):
- avatar circle (~40px)
- "By Ryan" / "By Tam" / kid attribution
- topic + read time on the same row, separated by ` · `
- Inter, small caps where it adds editorial polish

Why: answers "who's talking?" before the reader commits. Strong E-E-A-T signal (Google rewards visible bylines explicitly now; AI search parses author for attribution). Magazine convention.

**BOTTOM** (richer "About the author" card, sits between article end and recommendations):
- bigger avatar (~88px)
- one-sentence bio
- link to author archive (`/blogs/theinside/tagged/ryan` or similar - decide handle in build)
- for kids: just first name + age + region + character illustration; no link to "more from this kid" because we don't surface kid history

Why: gives reader a destination after they finish ("more from this person"), and keeps the top byline lightweight. Two scales of attribution = covered both reader needs.

---

## Article body

- Width: optimal reading column ~62ch (clamp 56-68ch).
- Type: **Inter for body** (per `feedback_inter_for_blog_titles` memory - Post Regular is too kiddy for journalistic copy). Body 17-18px, line-height 1.65, paragraph spacing ~1.2em.
- **Title in hero overlay**: Post Regular (this IS a brand-identity moment, biggest type on the page).
- H2s in body: Inter 700, sentence case, **phrased as questions where it reads naturally** (CLAUDE.md AEO requirement).
- Pull-quotes: Caveat (rare emphasis), or Inter italic + heavier weight + indented, depending on what reads better when you ship it.
- Lists, blockquotes, inline links: keep them readable, not stylised - the article is the writing, not the chrome.
- **No em dashes anywhere** (CLAUDE.md). Hyphens only.

### Article meta to surface

- Published date (visible AND in `datePublished` schema)
- Updated date if `article.updated_at` differs meaningfully (in `dateModified` schema)
- Read time (compute from word count, ~225 wpm)
- Topic / primary tag (already wired through `article.metafields.theinside.primary_topic`)
- Audience tag (kids / adults / all) for the field-notes filter system

---

## Recommendations section (below article body)

- 3-4 related posts.
- Small, quiet - don't compete with the article. This is "what's next" not "buy more."
- Logic: same `primary_topic` first, then shared tag, then most recent. Fall back to recent published if nothing matches.
- Visual: reuse the `archive_card` pattern from the field notes archive section (white tile body, image cover, topic + title). Don't invent a new card.
- Heading: "keep reading." or "more field notes." (sentence case, Inter 700 or Post for the section heading - pick whichever lands).

---

## SEO / AEO requirements

Per CLAUDE.md, all theINmag pages need:

- **Article JSON-LD schema** with: headline, image (full URL), datePublished, dateModified, author (Person for Ryan/Tam with `sameAs` socials, name string for kids), publisher (Organisation theINmag), description (article excerpt or first paragraph).
- **BreadcrumbList JSON-LD**: Home > Field notes > [Article title].
- **H2s as questions** where natural.
- **Visible byline** matching schema author (already covered by top + bottom blocks).
- llms.txt + robots.txt allowing AI crawlers - already done at site level.
- Meta description = article excerpt (Shopify auto-handles unless overridden).
- og:image = the canonical cover image at correct dimensions.

---

## Out of scope (don't build these now)

- Comments (Shopify comments are off-brand; revisit later).
- Social share buttons (separate decision).
- Newsletter inline pop-up mid-article (separate decision; the footer newsletter already exists).
- Judge.me reviews on articles (Judge.me is for products).
- Print-CSS optimisation (later).
- Dark mode toggle (theme is light-first, no plan for dark).

---

## What I'd like Claude to do first

1. Read this file, then the three companion files (`CLAUDE.md`, `theinmag-design-tokens.md`, `theinmag-design-principles.md`).
2. Read the current `templates/article.json` and `sections/main-article.liquid` to understand the Dawn baseline being replaced.
3. Read the existing `theinmag-blog-index-editorial.liquid` and `theinmag-blog-index-archive.liquid` for type/colour conventions to match.
4. **Confirm with Ryan** before writing any code:
   - Sticky-left column vs scroll-pinned via JS (sticky is simpler; pinned via JS is smoother but heavier)
   - Whether the bottom "About the author" card should link to `/blogs/theinside/tagged/ryan` (Shopify tag pages) or a custom `/pages/ryan` author page (decide based on whether tag pages render decently in Dawn)
   - Top byline + topic + read time stacking - one row or two?
5. Plan in checklist form, then build the section, then wire it into `templates/article.json`.

Brand fundamentals to NOT deviate from (locked):
- "Creation" not "work" everywhere
- No em dashes - hyphens only
- Smart brevity - short sentences, professional friend tone
- Sentence case headings; "theINmag" keeps its specific casing
- Never collect contactable details from kids
- Real kid creations are the design system - named attribution always

When uncertain, ask Ryan rather than ship the wrong call - he'll tune live in the editor.
