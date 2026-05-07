# theINside Blog Build Spec
### The complete framework for Claude Code to build the blog
*Created: May 5 2026 - anchored to getmaude.com/blogs/themaudern as the structural reference, theINmag homepage visual language as the in-house style anchor*
*Updated: May 5 2026 - final consolidation. This document is the single source of truth for the blog build. Read this first, ask before deviating.*

---

## What Claude Code reads, in what order

If you are Claude Code starting a session on this build, read in this order:

1. `/CLAUDE.md` (root project brain)
2. `/theinmag-design-tokens.md` (visual tokens - colours, fonts, spacing)
3. `/theinmag-design-principles.md` (the why behind every decision)
4. `/theinside-blog-build-spec.md` ← this document
5. `/theinside-visual-style-guide.md` (the bridge between tokens and blog rendering)
6. `/theinside-section-specs.md` (Liquid section specifications)
7. `/theinside-schema-layer.md` (every JSON-LD block needed)
8. The 14 post markdown files in `/posts/` (6 full drafts + 8 placeholder outlines)

This document anchors everything. Where this document and the design tokens conflict on visual decisions, the tokens win. Where this document and the brand brief conflict on voice or strategy, this document wins (it's downstream and more recent).

---

## The job, in one sentence

Build the theINside blog (index page at `/inside` + post template at `/inside/[handle]`) as the editorial home of theINmag, anchored visually to getmaude.com/blogs/themaudern, written in the voice of "a friend who knows what they're talking about", optimised for AEO citation, and engineered around email capture as the primary conversion goal.

---

## What's already locked (do not change without explicit Ryan instruction)

Decisions made in previous sessions. These are settled. If anything in this document or the post drafts contradicts a lock, the lock wins.

- **Blog name:** theINside (NOT bloggINs, NOT generic "Blog" - even if older site nav reads "Blog", correct it during this build)
- **Newsletter name:** theINside scoop (with the Klaviyo welcome flow auto-firing a free e-mag download as the first email)
- **Newsletter cadence:** monthly, not weekly
- **URL slug:** `/inside`
- **Post URL pattern:** `/inside/[handle]`
- **Recommendation block name:** "more for you." (lowercase, full stop)
- **"More for you" structure:** three curated posts, each with a one-line italic connective sentence, picks defined in post front matter (not algorithmic)
- **Audience filter pills:** All / For Parents / For Teachers / For Homeschoolers / For Kids
- **Audience tagging logic:** posts can carry multiple audience tags. Filtering by an audience pill returns every post that includes that audience in its tags (single-audience posts AND multi-audience crossovers)
- **Cover images:** real attributed kid creations from the magazine, with a visible caption underneath the image AND attribution in alt text
- **Post titles:** sentence-case lowercase, ending with a full stop ("why kids stop creating around age 8.")
- **No em dashes anywhere:** hyphens only
- **Voice:** "a friend who knows what they're talking about" - closer than Maude's slightly distanced editorial register
- **AEO infrastructure:** every post gets Article + FAQPage + BreadcrumbList + Person schema; Quick Answer block at the top; question-format H2s throughout
- **Closing CTA:** one nudge per post, never three
- **Author bylines:** named (Ryan or Tam, with role), never "theINmag team" as default
- **Reading level on kid-facing posts:** real Grade 4-5

---

## The visual anchor - your homepage is the in-house reference

Now that the homepage is taking shape, the blog inherits its visual language. Specifically:

- **Cream cards on warm cream background.** The product cards on the homepage (Membership / Single issue / Build a bundle) sit on `#FBF6EA` with subtle warm shadow. Blog post cards use the same treatment.
- **Post Regular headline font, full caps and lowercase mixed cursive accents.** "THE MAGAZINE FOR CREATIVE KIDS" headline uses the chunky hand-drawn caps. Smaller accents like "made by kids, for kids" use the cursive lowercase. Blog post titles use Post Regular, sentence-case, lowercase - matching the editorial register Maude uses but in your typeface.
- **Yellow primary CTAs (`#F9C23C`), purple hover state.** "GRAB A MEMBERSHIP" / "SEND IN CONTENT" / "GRAB THE LATEST ISSUE" - same convention on the blog. "Send IN your creation" CTAs at the bottom of posts inherit this exactly.
- **The "Made by kids, for kids" sticker pattern.** That floating sticker top-left of the homepage is a pattern element that should appear somewhere on the blog index - possibly as "field notes from the road" sticker top-left of the index header, in the same yellow circle style.
- **Press band treatment.** The "Seen IN [LOGO] · Seen IN [LOGO]" horizontal scrolling band on the homepage is a pattern Claude Code should be aware of - we don't repeat it on the blog index, but the visual rhythm of "small label · big logo · small label · big logo" is reusable elsewhere if needed.
- **The audience tile language.** Single-word labels (Parents / Teachers / Homeschoolers / Kids) overlaid on full-bleed real photos. The blog audience filter pills inherit this concise language but render as filter pills, not full-bleed tiles.
- **The dark purple feature treatment.** The "our standards / our impact / our story" section uses deep purple `#5D3A7A` background with cream text. Blog posts that need a visually distinct feature block (e.g. the inline "carry the idea further" block) use a light purple `#f0eaf8` for warmth, not the dark feature purple - the dark treatment is reserved for high-emotional-weight Tier 3 brand moments.

What this means in practice: **the blog should feel like an editorial extension of the homepage, not a separate template.** A visitor scrolling from the homepage to the blog should feel they're still in the same magazine. Same Post Regular headlines. Same yellow CTAs. Same warm cream-and-purple palette. Same hand-drawn sticker accents. Same generous whitespace.

---

## Audience filter - the through-line architecture

Every post carries one or more audience tags from this set: `kids` / `parents` / `teachers` / `homeschoolers`. A post can carry as many as fit. Examples of crossover behaviour:

- A post on creativity loss → tagged `parents` + `teachers` + `homeschoolers` (universal in three of the four audiences)
- A post on running an open numeracy task → tagged `teachers` + `homeschoolers` (with secondary `parents` for the engaged ones)
- A post on what to draw when bored → tagged `kids` + `parents` (parents read these over the kid's shoulder)

When a user taps an audience pill, the grid filters to every post with that audience in its tags. This means the Teachers view and the Parents view will share many posts - that's correct. Real audiences overlap. The architecture reflects that.

The "All" pill returns every post on the site, default sorted by recency.

Filter state is URL-reflected (`/inside?audience=parents`) so URLs are bookmarkable and shareable. Important for SEO - filtered URLs become indexable category pages.

A second filter - secondary topic chips - sits below the audience pills:
Creativity / Wellbeing / Numeracy / Literacy / Photography / Behind the Mag / Kid Spotlights / Open Tasks

Topic chips are smaller, less prominent, optional. Tapping one filters the grid. URL-reflected: `/inside?audience=teachers&topic=numeracy`.

---

## Cover images - the rule and the workflow

Every cover image is a real kid creation, pulled from the issues of theINmag, attributed in:

1. **Alt text** (for screen readers, AEO, and accessibility): "Watercolour of a magpie sent IN by Eli, age 8, Castlemaine VIC. Mag07."
2. **Visible caption underneath the image** (small grey text, sentence case): "Watercolour by Eli, age 8, Castlemaine VIC. Sent IN for Mag07."

Why this matters:
1. Strongest brand signal we have. Every post visually proves the magazine is real, made by Aussie kids with real names and real towns. AI-generated competitors cannot replicate this.
2. Small feedback loop. A kid whose creation appears as a blog cover image gets an extra dose of being-seen. The parent gets an extra reason to subscribe. The mag earns its own marketing.

Filename convention: `BLOG_[descriptor]-[kid-first-name]-age[X]-[town].jpg` (e.g. `BLOG_magpie-watercolour-eli-age8-castlemaine.jpg`).

Resolution: 1800 x 1000px, JPG, under 400KB after TinyPNG compression.

For posts where no kid creation fits the topic - e.g. a "behind Mag10" process post - use real photos of Ryan, Tam, Nora, the van, the laptop, or printed proofs. Never stock. Never AI-generated.

---

## Voice - the rules every post follows

Non-negotiable. Apply in the section file copy, the post drafts, the FAQ blocks, the empty states, and any agent-generated content.

1. **No em dashes.** Hyphens only. Em dashes are the strongest "AI wrote this" signal in 2026.
2. **A friend who knows what they're talking about.** Not a journalist. Not a textbook. Not a brand. Direct, warm, slightly funny when it fits, never preachy.
3. **Smart brevity.** Short sentences. Punchy. No three-line paragraphs unless absolutely necessary. Read like Axios newsletter or Guy Raz.
4. **Creativity leads, learning follows.** Never lead a post with curriculum, learning outcomes, or pedagogy. Lead with the kid, the creation, the moment. Learning shows up as a by-product.
5. **"Creation" not "work".** Locked sitewide.
6. **Named kid attributions where they fit.** "Maya, age 9, sent IN a watercolour..." - specifics build trust faster than abstractions.
7. **Real anecdotes from the road, the classroom, or the kitchen table.** A line that only Ryan or Tam could have written is the line that proves it isn't AI-generated.
8. **Sentence-case lowercase post titles, with a full stop.** "why kids stop creating." not "Why Kids Stop Creating".
9. **Question-format H2s.** Every H2 phrased as a question. Drives AEO.
10. **One nudge, not three.** End with a single CTA. Don't pile up "subscribe AND submit AND share."
11. **Humour where it fits.** Movie quotes, kid jokes, the occasional self-deprecating line about the van. Not stand-up, but not po-faced either.
12. **Curriculum-agnostic framing for teaching posts.** Australia uses multiple state curriculums. Default phrasing: "your curriculum, wherever you teach." Specific descriptors only as one possible example.
13. **Reading level for kid-facing posts:** real Grade 4-5. When in doubt, the simpler word wins.

---

## Post template - section by section

Every post page renders these sections in this order. Section files follow the `theinmag-` prefix convention.

### Section 1 - Topic tag + Title (`theinmag-blog-post-header.liquid`)

- Small topic tag above title (e.g. "Creativity" / "Numeracy")
- Sentence-case lowercase title in Post Regular, large
- No huge "blog post" header label. The title IS the header.

### Section 2 - Cover image (`theinmag-blog-post-cover.liquid`)

- Full-width 1800 x 1000px, lazy-loaded
- Alt text from post metafield `cover_image_alt`
- Visible caption from post metafield `cover_image_caption`, small grey text, sentence case, sits immediately below image

### Section 3 - Byline block (`theinmag-blog-post-byline.liquid`)

- Author avatar (40x40px circle) - Ryan or Tam, real photo
- Author name + role (e.g. "Ryan - Co-founder, theINmag. Former numeracy specialist.")
- Date published
- Read time (auto-calculated from word count at ~200 words per minute, or manually overridden via metafield)

For kid guest posts: byline becomes "Maya, age 9 - Guest blogger and theINmag contributor. Fremantle WA." No avatar (locked privacy rule). Replaced by a small piece of their creation as the author thumbnail.

### Section 4 - Quick Answer block (`theinmag-blog-post-quick-answer.liquid`)

- Cream `#FBF6EA` background
- Small "Quick answer" label (Post Regular, all caps, small)
- 40-60 word answer block, slightly indented, no quote marks
- This block is what AI engines extract for AI Overviews. The schema layer mirrors this content into the Article description.

### Section 5 - Body (`theinmag-blog-post-body.liquid`)

- Renders the post body markdown / rich text
- H2s automatically rendered in Post Regular sentence-case lowercase
- Body copy in Inter 18px, line-height 1.8
- Inline links underlined, brand purple `#7B4F9E` colour, hover state slightly darker
- Pull quotes (when used) in Post Regular with subtle left border accent in brand purple

### Section 6 - Inline "carry the idea further" block (`theinmag-blog-post-inline-cta.liquid`)

- Light purple `#f0eaf8` background, slight rounded corners (8px)
- Heading: "Carry the idea further."
- 1-2 items: a Membership / freebie / back-issue Mag / competition
- Each item: small thumbnail + title + 12-word descriptor + link
- Only renders if metafield `inline_cta_items` is populated for that post
- For posts with no relevant product, falls back to inline theINside scoop signup prompt instead

### Section 7 - FAQ block (`theinmag-blog-post-faq.liquid`)

- Heading: "Frequently asked questions" in Post Regular
- Each Q&A: question in **bold**, answer in regular weight
- Minimum 3 Q&As
- Q in the way real parent/teacher/kid would ask it
- A in 30-60 words
- FAQPage JSON-LD schema injected, matching the visible block exactly

### Section 8 - Closing CTA (`theinmag-blog-post-closing-cta.liquid`)

- Single yellow button (or italic link if a softer nudge is needed)
- Button label from post metafield `closing_cta_label`
- Destination from post metafield `closing_cta_url`
- One nudge. Never three.

### Section 9 - "more for you." (`theinmag-blog-post-more-for-you.liquid`)

- Heading: "more for you." (lowercase, full stop, Post Regular)
- Three curated post cards in a row (desktop) / stacked (mobile)
- Each card: cover image + topic tag + title + italic one-line connective sentence + author byline
- Picks read from post metafield `more_for_you` (array of three post handles + connective sentences)
- Hand-curated per post, not algorithmic
- Subtle card lift on hover (translateY -4px, shadow shifts to card-hover token)

### Section 10 - theINside scoop signup (`theinmag-blog-post-newsletter.liquid`)

- Heading: "theINside scoop - count me IN."
- Subhead: "One monthly email. Three creative ideas, one kid spotlight, plus a free e-mag the moment you sign up."
- Email field + yellow submit button ("Send me the scoop")
- Klaviyo embed, segment tag: `theinside-scoop`
- Welcome flow auto-fires the free e-mag download link

### Section 11 - Footer

Site footer (already built, inherits from the global theme).

---

## Blog index page - section by section

`/inside` renders these sections in this order.

### Section 1 - Header (`theinmag-blog-index-header.liquid`)

- Optional sticker top-left ("field notes from the road" in yellow circle, matching homepage sticker style - keeps visual continuity)
- Tagline: "theINside" in Post Regular, large
- One-line subhead: "Field notes from the road, the classroom, and the kitchen table."
- No explanatory paragraph. Maude doesn't have one. We don't either.

### Section 2 - Audience filter pills (`theinmag-blog-index-filters.liquid`)

- Sticky on scroll
- Five pills horizontally: All / For Parents / For Teachers / For Homeschoolers / For Kids
- Active pill: yellow `#F9C23C` background, dark `#1a1a1a` text
- Inactive pill: transparent background, dark `#1a1a1a` outline (1.5px), dark text
- Hover state: outlined purple `#7B4F9E`
- Mobile: pills in single horizontal row, scroll-snap if they overflow viewport
- Default state: "All" active
- Filter state URL-reflected (`?audience=parents`)

Below the audience pills, a thinner row of secondary topic chips:
Creativity / Wellbeing / Numeracy / Literacy / Photography / Behind the Mag / Kid Spotlights / Open Tasks

- Smaller, less prominent
- Same active/inactive treatment but lighter
- Multiple selectable (act as combined filter alongside audience)
- URL-reflected (`?audience=teachers&topic=numeracy`)

### Section 3 - Featured post (`theinmag-blog-index-featured.liquid`)

- Full-width
- One post - the most recent feature-worthy post (manually flagged via metafield `is_featured: true`, only one post can carry this flag at a time)
- Layout: cover image full-bleed, overlay or beneath: topic tag → title → one-line excerpt → byline → read time
- Whole block clickable
- This is editorial real estate. Manual at launch. Growth Agent eventually rotates based on engagement.

### Section 4 - Latest posts grid (`theinmag-blog-index-grid.liquid`)

- 3-column grid on desktop, 1-column on mobile
- Each card:
 - Cover image (1800 x 1000px, lazy-loaded, with subtle border radius matching design tokens "Large" 12px)
 - Topic tag (small, above title)
 - Sentence-case lowercase title
 - One-line excerpt (max 14 words)
 - Byline + read time
 - Whole card clickable, hover lift (translateY -4px, shadow shifts to card-hover token)
- Cards sit on cream `#FBF6EA` background - matches the homepage product cards
- Default sort: most recent first
- Pagination: load 9 posts initially, "Load more" button reveals 9 more (NOT infinite scroll - kills the footer and hurts AEO crawl efficiency)
- Empty state (when filter returns nothing): friendly copy "Nothing here yet - but we're always writing. Try another filter, or [sign up to the scoop](#newsletter) and we'll let you know when something new lands."

### Section 5 - "From the founders" rail (`theinmag-blog-index-founders-rail.liquid`)

- Optional section, sits between latest posts and newsletter signup
- Heading: "from the founders." in Post Regular
- Two cards: most recent Ryan post + most recent Tam post
- Each card: cover image + small founder avatar in corner + title + one-line excerpt + "by Ryan" / "by Tam" with role
- Reinforces named-author E-E-A-T at every visit

### Section 6 - theINside scoop signup (`theinmag-blog-index-newsletter.liquid`)

Same pattern as the per-post newsletter signup. Repeated here so visitors who scroll the index without clicking a post still hit the conversion point.

### Section 7 - Topic chip cloud (`theinmag-blog-index-topics.liquid`)

- Optional discovery layer at the foot of the index
- Heading: "browse by topic."
- Same chips as the secondary topic filter, presented as a more visual cloud
- Tapping a chip filters the grid above (scrolls back up)

---

## The four-post numeracy cluster (Posts 2 / 2b / 2c / 2d)

Per the previous session's discussion, the original Post 2 (~1,100 words) is being split into four focused posts of ~600-700 words each. This is the cornerstone teacher-credibility series for theINside.

Series title (visible only as connective text, not a separate landing page): "running open numeracy tasks"

**Post 2** - the mindset reset. Why open tasks aren't Plan B. The intro post.
**Post 2b** - the planning craft. The four anticipations + private differentiation.
**Post 2c** - the trajectory of learning. Why one-off open tasks lose punch.
**Post 2d** - what happens in the room. Launch / check-ins / Learning Pit / teacher-as-thinker.

Each post links forward in series via the closing CTA, AND each post's "more for you" picks include the next two posts in the series. This creates a strong cluster Claude Code should treat as a coherent unit.

Drip strategy: Post 2 publishes at launch. Posts 2b / 2c / 2d drip at one-week intervals. Once all four are live, the cluster becomes the canonical theINside resource on open numeracy task practice.

---

## Schema requirements (every post)

Locked from the brief, restated as the build reference. Full JSON-LD blocks are in `/theinside-schema-layer.md`.

- **Article schema** - author Person entity (Ryan or Tam, or kid contributor), publisher Organisation entity (theINmag), datePublished, dateModified, image, headline, description (mirrors Quick Answer block)
- **FAQPage schema** - matching the visible FAQ block exactly
- **BreadcrumbList schema** - Home > theINside > [Topic] > [Post title]
- **Person schema** for Ryan/Tam authors - links to the same Person entity used on /our-story (entity consolidation across the site)

For the index page:
- **CollectionPage schema** - wraps the blog as a coherent editorial collection
- **BreadcrumbList schema** - Home > theINside

---

## Quoting practitioners playbook

Quoting real experts builds expertise signal (E-E-A-T), increases AI citation likelihood, and gives the post intellectual weight.

**Australian voices preferred, always.**
- Numeracy / maths education: Peter Sullivan (ACU/Monash), Doug Clarke (ACU), Catherine Pearn, Kim Beswick
- Questioning techniques in primary classrooms: Martin Renton
- Productive struggle / pedagogy: James Nottingham (Learning Pit framework - UK-based but household name in Australian schools)
- Parenting / wellbeing: Maggie Dent, Steve Biddulph, Justin Coulson
- Education / learning: Pasi Sahlberg (Southern Cross University), Stephen Dinham, Linda Graham
- Homeschooling: Beverley Paine, Christine Brandenburg
- Creativity / arts: Anne Bamford

**International voices we lean on when no Australian equivalent exists:**
- Carol Dweck (mindset)
- Jo Boaler (maths)
- Howard Gardner (children's art development)
- Lucy Calkins (writing instruction)
- John Holt (interest-led learning)
- George Land (creativity research)

**Permission and fair dealing.** Australian copyright law allows fair dealing for "criticism or review" - short quotes from published work, properly attributed, are fine. Rules:
- Quote sparingly (a line or two, never paragraphs)
- Always attribute fully (name, work the quote is from, link if possible)
- Don't imply endorsement they haven't given
- Tag them on social when the post launches - courtesy plus distribution

This is general guidance, not legal advice. For substantial quotes (>30 words from a single source), get a quick lawyer check.

---

## The post inventory at launch

14 posts total. 6 full drafts ready for editing. 8 placeholder outlines ready for commissioning.

**Full drafts (in `/posts/`):**

1. `theinside-post-01-why-kids-stop-creating.md` - parents/teachers/homeschoolers, creativity, ~580 words, Ryan
2. `theinside-post-02-numeracy-task-great-place-to-start.md` - teachers/homeschoolers/parents, numeracy, ~620 words, Ryan (the mindset reset)
3. `theinside-post-02b-planning-craft.md` - teachers/homeschoolers, numeracy, ~700 words, Ryan (the four anticipations + private differentiation)
4. `theinside-post-02c-trajectory-of-learning.md` - teachers/homeschoolers, numeracy, ~640 words, Ryan (sequenced learning, the running-100m worked example)
5. `theinside-post-02d-what-happens-in-the-room.md` - teachers/homeschoolers, numeracy, ~700 words, Ryan (launch / check-ins / Learning Pit)
6. `theinside-post-03-things-to-draw.md` - kids/parents, creativity, ~450 words, Ryan

**Placeholder outlines (in `/posts/placeholders/`):**

7. `theinside-post-04-what-is-a-rich-open-task.md` - Ryan
8. `theinside-post-05-homeschool-without-burnout.md` - Tam
9. `theinside-post-06-same-thing-on-repeat.md` - Tam
10. `theinside-post-07-behind-mag10.md` - Ryan
11. `theinside-post-08-noticing-things.md` - Tam
12. `theinside-post-09-kids-jokes-learning.md` - Ryan or Tam
13. `theinside-post-10-case-for-boredom.md` - Tam
14. `theinside-post-11-inquiry-learning-australia.md` - Ryan (politically charged - hold until Posts 4 + 2 cluster are published)

Each placeholder file contains: title, audience tags, topic tags, author, ~150-word concept summary, suggested expert quotes, and three "more for you" picks. Enough for Claude Code to render the index without empty cards, AND enough for the writer (Ryan, Tam, or future Blog Agent) to commission the post when ready.

---

## What you do with this document

If you're Ryan reviewing: read this, push back on anything that doesn't feel right, then drop the whole `/posts/` folder + this spec + the visual style guide + the section specs + the schema layer into the Claude Code session as project knowledge.

If you're Claude Code building: read this first. Read the design tokens. Read the visual style guide. Read the section specs. Build section files in the order listed in "Post template - section by section" and "Blog index page - section by section". Schema layer last. Test on Pixel 6 simulator after every section. Commit before each new section starts.

---

## Change log

- May 5 2026 (final consolidation) - single source of truth document. All previous decisions locked in. Visual anchor section added now that homepage screenshots exist. Four-post numeracy cluster locked. "More for you." block locked. 8 placeholder outlines specified for launch readiness.
