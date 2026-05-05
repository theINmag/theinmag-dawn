# theINside Section Specifications
### Liquid section files Claude Code needs to build, with theme editor schemas
*Created: May 5 2026 - paired with `theinside-blog-build-spec.md` (the master spec) and `theinside-visual-style-guide.md` (the visual rendering reference). This file is the technical translation: which files to create, what their schemas expose, what metafields posts need.*

---

## What this file covers

Three things, in this order:

1. **Section file inventory** - every Liquid section file Claude Code needs to create, with its purpose
2. **Section schemas** - the theme editor schema for each section (what Ryan can configure without code)
3. **Article metafields** - the metafields each blog post needs so the sections render correctly

This file does NOT cover layout / styling / token application - that's all in the visual style guide. This file is purely the technical scaffold.

---

## File structure expected

```
sections/
 theinmag-blog-index-header.liquid
 theinmag-blog-index-filters.liquid
 theinmag-blog-index-featured.liquid
 theinmag-blog-index-grid.liquid
 theinmag-blog-index-founders-rail.liquid
 theinmag-blog-index-newsletter.liquid
 theinmag-blog-index-topics.liquid

 theinmag-blog-post-header.liquid
 theinmag-blog-post-cover.liquid
 theinmag-blog-post-byline.liquid
 theinmag-blog-post-quick-answer.liquid
 theinmag-blog-post-body.liquid
 theinmag-blog-post-inline-cta.liquid
 theinmag-blog-post-faq.liquid
 theinmag-blog-post-closing-cta.liquid
 theinmag-blog-post-more-for-you.liquid
 theinmag-blog-post-newsletter.liquid

snippets/
 theinmag-blog-card.liquid (used by index grid AND more-for-you)
 theinmag-blog-byline.liquid (used by post page AND cards)
 theinmag-blog-schema-article.liquid
 theinmag-blog-schema-faq.liquid
 theinmag-blog-schema-breadcrumb.liquid
 theinmag-blog-schema-collection.liquid

templates/
 blog.json (the index page template)
 article.json (the post page template)

assets/
 theinside-base.css (blog-specific styles, scoped)
 theinside-filters.js (filter pill behaviour, URL state)
```

---

## Index page sections

### `theinmag-blog-index-header.liquid`

**Purpose:** Renders the top header of `/inside` - optional sticker, large tagline, single-line subhead.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside header",
 "settings": [
 {
 "type": "checkbox",
 "id": "show_sticker",
 "label": "Show 'field notes' sticker",
 "default": true
 },
 {
 "type": "text",
 "id": "sticker_text",
 "label": "Sticker text",
 "default": "field notes from the road",
 "info": "Cursive text in the yellow sticker top-left. Keep it short."
 },
 {
 "type": "text",
 "id": "tagline",
 "label": "Page tagline",
 "default": "theINside",
 "info": "Large heading, sentence-case lowercase per brand"
 },
 {
 "type": "textarea",
 "id": "subhead",
 "label": "One-line subhead",
 "default": "Field notes from the road, the classroom, and the kitchen table."
 }
 ],
 "presets": [
 {
 "name": "theINside header"
 }
 ]
}
{% endschema %}
```

**Data dependencies:** None (all content set by editor).

---

### `theinmag-blog-index-filters.liquid`

**Purpose:** Sticky audience filter pills + secondary topic chips. Wires up the URL state via `theinside-filters.js`.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside filters",
 "settings": [
 {
 "type": "header",
 "content": "Audience pills"
 },
 {
 "type": "checkbox",
 "id": "show_audience_pills",
 "label": "Show audience filter pills",
 "default": true
 },
 {
 "type": "header",
 "content": "Topic chips"
 },
 {
 "type": "checkbox",
 "id": "show_topic_chips",
 "label": "Show secondary topic chips",
 "default": true
 },
 {
 "type": "text",
 "id": "topic_chips",
 "label": "Topic chips (comma-separated)",
 "default": "Creativity, Wellbeing, Numeracy, Literacy, Photography, Behind the Mag, Kid Spotlights, Open Tasks"
 }
 ],
 "presets": [
 {
 "name": "theINside filters"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- Reads URL params `?audience=` and `?topic=` to highlight active state
- Audience pill values are hardcoded: `all, parents, teachers, homeschoolers, kids`
- Topic chips slugify the editor-provided list (e.g. "Behind the Mag" → `behind-the-mag`)

**Behaviour notes:**
- Sticky positioning: `position: sticky; top: [main header height]; z-index: 10`
- Tapping a pill updates the URL via `history.pushState()` and triggers a re-filter of the grid below (no full page reload)
- Multiple topic chips can be active simultaneously; only one audience pill at a time

---

### `theinmag-blog-index-featured.liquid`

**Purpose:** Full-width featured post block. One post at a time, manually flagged via the post's `is_featured` metafield.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside featured post",
 "settings": [
 {
 "type": "checkbox",
 "id": "show_section",
 "label": "Show featured post section",
 "default": true
 },
 {
 "type": "paragraph",
 "content": "The featured post is whichever blog post has its 'is_featured' metafield set to true. Only one post should carry this flag at a time."
 }
 ],
 "presets": [
 {
 "name": "theINside featured post"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- Queries blog articles where `metafields.theinside.is_featured == true`
- Falls back to most recent post if no post is flagged
- Renders: cover image (full-width 16:9 ratio), topic tag, title, one-line excerpt, byline, read time

---

### `theinmag-blog-index-grid.liquid`

**Purpose:** The main post grid. Renders post cards, filtered by URL state. Uses the `theinmag-blog-card.liquid` snippet.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside grid",
 "settings": [
 {
 "type": "range",
 "id": "initial_post_count",
 "label": "Posts to load initially",
 "default": 9,
 "min": 3,
 "max": 18,
 "step": 3
 },
 {
 "type": "range",
 "id": "load_more_count",
 "label": "Posts to load on 'Load more' click",
 "default": 9,
 "min": 3,
 "max": 18,
 "step": 3
 },
 {
 "type": "text",
 "id": "load_more_label",
 "label": "Load more button text",
 "default": "Load more posts"
 },
 {
 "type": "header",
 "content": "Empty state"
 },
 {
 "type": "textarea",
 "id": "empty_state_copy",
 "label": "Empty state copy",
 "default": "Nothing here yet, but we're always writing. Try another filter, or sign up to the scoop and we'll let you know when something new lands."
 }
 ],
 "presets": [
 {
 "name": "theINside grid"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- Reads filter state from URL params (audience, topic)
- Excludes the post currently flagged as featured (avoid double-render)
- Filters by post audience tag matching URL param
- If multiple topic chips selected, post must match at least one
- Renders card via `theinmag-blog-card.liquid` snippet
- Sort: most recent first (by `published_at`)

---

### `theinmag-blog-index-founders-rail.liquid`

**Purpose:** "from the founders." horizontal rail showing most recent Ryan + most recent Tam post.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside founders rail",
 "settings": [
 {
 "type": "checkbox",
 "id": "show_section",
 "label": "Show founders rail",
 "default": true
 },
 {
 "type": "text",
 "id": "section_heading",
 "label": "Section heading",
 "default": "from the founders."
 }
 ],
 "presets": [
 {
 "name": "theINside founders rail"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- Queries most recent post by Ryan (where `author == 'Ryan Gow'`)
- Queries most recent post by Tam (where `author == 'Tam Gow'`)
- Renders two cards using `theinmag-blog-card.liquid` snippet
- Each card shows author avatar in corner

---

### `theinmag-blog-index-newsletter.liquid`

**Purpose:** theINside scoop signup, inline form. Same component used on post pages.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside scoop signup",
 "settings": [
 {
 "type": "text",
 "id": "heading",
 "label": "Heading",
 "default": "theINside scoop. Count me IN."
 },
 {
 "type": "textarea",
 "id": "subhead",
 "label": "Subhead",
 "default": "One monthly email. Three creative ideas, one kid spotlight, plus a free e-mag the moment you sign up."
 },
 {
 "type": "text",
 "id": "submit_label",
 "label": "Submit button label",
 "default": "Send me the scoop"
 },
 {
 "type": "text",
 "id": "klaviyo_list_id",
 "label": "Klaviyo list ID",
 "info": "Set after Klaviyo flow is built"
 }
 ],
 "presets": [
 {
 "name": "theINside scoop signup"
 }
 ]
}
{% endschema %}
```

---

### `theinmag-blog-index-topics.liquid`

**Purpose:** Optional topic discovery cloud at the foot of the index.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "theINside topic cloud",
 "settings": [
 {
 "type": "checkbox",
 "id": "show_section",
 "label": "Show topic cloud",
 "default": true
 },
 {
 "type": "text",
 "id": "section_heading",
 "label": "Heading",
 "default": "browse by topic."
 },
 {
 "type": "text",
 "id": "topics",
 "label": "Topics (comma-separated)",
 "default": "Creativity, Wellbeing, Numeracy, Literacy, Photography, Behind the Mag, Kid Spotlights, Open Tasks"
 }
 ],
 "presets": [
 {
 "name": "theINside topic cloud"
 }
 ]
}
{% endschema %}
```

**Behaviour:** Tapping a topic chip applies that topic filter and scrolls the page back to the grid section.

---

## Post page sections

### `theinmag-blog-post-header.liquid`

**Purpose:** Topic tag + post title at top of post.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post header",
 "settings": []
}
{% endschema %}
```

**Data dependencies:**
- Topic tag from `article.metafields.theinside.primary_topic`
- Title from `article.title`

---

### `theinmag-blog-post-cover.liquid`

**Purpose:** Full-width cover image with caption.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post cover",
 "settings": []
}
{% endschema %}
```

**Data dependencies:**
- Image: `article.image` (Shopify's native article image field)
- Alt text: `article.metafields.theinside.cover_image_alt`
- Caption: `article.metafields.theinside.cover_image_caption`

---

### `theinmag-blog-post-byline.liquid`

**Purpose:** Author block with avatar, name, role, date, read time.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post byline",
 "settings": []
}
{% endschema %}
```

**Data dependencies:**
- Author name: `article.author` (Shopify native)
- Author role: `article.metafields.theinside.author_role`
- Author avatar: `article.metafields.theinside.author_avatar`
- Date: `article.published_at`
- Read time: `article.metafields.theinside.read_time` OR auto-calculated

For kid guest posts: detection via `article.metafields.theinside.is_kid_contributor == true` swaps the byline format and replaces avatar with creation thumbnail (`article.metafields.theinside.kid_creation_thumbnail`).

---

### `theinmag-blog-post-quick-answer.liquid`

**Purpose:** The 40-60 word quick answer block at the top of the post body.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Quick answer",
 "settings": [
 {
 "type": "text",
 "id": "label",
 "label": "Label text",
 "default": "Quick answer"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- Quick answer body: `article.metafields.theinside.quick_answer`
- Skips render if metafield empty (with a soft warning in the theme editor)

---

### `theinmag-blog-post-body.liquid`

**Purpose:** Renders the main post content from `article.content`.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post body",
 "settings": []
}
{% endschema %}
```

**Data dependencies:**
- `article.content` (Shopify native rich text)
- Custom CSS handles H2/H3 typography, link styling, pull quote treatment

---

### `theinmag-blog-post-inline-cta.liquid`

**Purpose:** "Carry the idea further." inline block. Falls back to inline newsletter prompt if no CTA items defined.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Inline CTA",
 "settings": [
 {
 "type": "text",
 "id": "heading",
 "label": "Heading",
 "default": "Carry the idea further."
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- `article.metafields.theinside.inline_cta_items` - JSON array of objects: `[{ "title": "...", "descriptor": "...", "image_url": "...", "link": "..." }]`
- If empty, render inline newsletter signup with abbreviated copy: "Want a monthly dispatch like this? Sign up to theINside scoop →"

---

### `theinmag-blog-post-faq.liquid`

**Purpose:** FAQ block matching the FAQPage JSON-LD schema.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post FAQ",
 "settings": [
 {
 "type": "text",
 "id": "heading",
 "label": "Heading",
 "default": "Frequently asked questions"
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- `article.metafields.theinside.faq_items` - JSON array: `[{ "question": "...", "answer": "..." }]`
- Renders Q in bold, A in regular weight, separated by `lg` spacing
- Injects matching FAQPage schema via `theinmag-blog-schema-faq.liquid` snippet

---

### `theinmag-blog-post-closing-cta.liquid`

**Purpose:** Single closing nudge.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "Post closing CTA",
 "settings": []
}
{% endschema %}
```

**Data dependencies:**
- Label: `article.metafields.theinside.closing_cta_label`
- URL: `article.metafields.theinside.closing_cta_url`
- Style: yellow primary button, centred

---

### `theinmag-blog-post-more-for-you.liquid`

**Purpose:** Three curated next-post recommendations.

**Theme editor schema:**

```liquid
{% schema %}
{
 "name": "More for you",
 "settings": [
 {
 "type": "text",
 "id": "heading",
 "label": "Heading",
 "default": "more for you."
 }
 ]
}
{% endschema %}
```

**Data dependencies:**
- `article.metafields.theinside.more_for_you` - JSON array of three objects: `[{ "post_handle": "...", "connective_sentence": "..." }]`
- Renders three cards via `theinmag-blog-card.liquid` snippet, each with the connective sentence rendered in italic between excerpt and byline
- If metafield is empty or has fewer than 3 picks, fall back to algorithmic: most recent posts sharing one or more audience tags with the current post (excluding the current post)

---

### `theinmag-blog-post-newsletter.liquid`

**Purpose:** theINside scoop signup at the foot of the post. Identical component to the index newsletter section.

Same schema as `theinmag-blog-index-newsletter.liquid`. Could be the same file referenced from both templates if Claude Code wants to consolidate.

---

## Snippets

### `theinmag-blog-card.liquid`

**Purpose:** Single post card. Used in index grid, "more for you", and founders rail.

**Inputs (passed via `render` tag):**
- `article` - the article object
- `show_connective` (bool) - whether to render an italic connective sentence
- `connective_sentence` (string) - the sentence itself, only rendered if `show_connective` true
- `show_author_avatar` (bool) - whether to overlay author avatar on the card (used by founders rail)

**Output:**
Renders the card markup as defined in the visual style guide.

---

### `theinmag-blog-byline.liquid`

**Purpose:** Reusable byline block.

**Inputs:**
- `article` - the article object
- `style` - `'full'` (post page) or `'compact'` (cards)

---

### `theinmag-blog-schema-*` snippets

Four snippets, one per schema type. Each takes the article (or page) object and renders the appropriate JSON-LD block. Full schema details in `theinside-schema-layer.md`.

---

## Article metafields (the post-level data shape)

Every blog post in Shopify needs the following metafields configured in the `theinside` namespace. Set up the metafield definitions FIRST (before importing or creating any posts), so the metafields are available in the post editor.

| Namespace | Key | Type | Description |
|---|---|---|---|
| theinside | audience_tags | List of single-line text | Audience tags: `parents`, `teachers`, `homeschoolers`, `kids`. Multiple allowed. |
| theinside | topic_tags | List of single-line text | Topic tags: `creativity`, `wellbeing`, `numeracy`, `literacy`, `photography`, `behind-the-mag`, `kid-spotlights`, `open-tasks`. |
| theinside | primary_topic | Single-line text | The single topic shown in the topic tag above the title (e.g. "Creativity"). |
| theinside | author_role | Single-line text | E.g. "Co-founder, theINmag. Former numeracy specialist." |
| theinside | author_avatar | File reference | Square headshot, 200x200px, real photo |
| theinside | read_time | Integer | Read time in minutes (override; otherwise auto-calculated) |
| theinside | cover_image_alt | Single-line text | Alt text including kid attribution |
| theinside | cover_image_caption | Single-line text | Visible caption under the cover image |
| theinside | quick_answer | Multi-line text | The 40-60 word Quick Answer block |
| theinside | is_featured | Boolean | True if this post is the current featured post (only one at a time) |
| theinside | inline_cta_items | JSON | Array: `[{title, descriptor, image_url, link}]` |
| theinside | faq_items | JSON | Array: `[{question, answer}]` |
| theinside | closing_cta_label | Single-line text | The label of the single closing CTA button |
| theinside | closing_cta_url | URL | The destination of the closing CTA |
| theinside | more_for_you | JSON | Array of 3: `[{post_handle, connective_sentence}]` |
| theinside | is_kid_contributor | Boolean | True for kid guest posts |
| theinside | kid_creation_thumbnail | File reference | Used in lieu of avatar for kid guest posts |
| theinside | kid_age | Integer | For kid guest posts |
| theinside | kid_town | Single-line text | For kid guest posts (e.g. "Fremantle WA") |

---

## Templates

### `templates/blog.json`

The page template for `/inside`. Composed of these sections in order:

1. theinmag-blog-index-header
2. theinmag-blog-index-filters (sticky)
3. theinmag-blog-index-featured
4. theinmag-blog-index-grid
5. theinmag-blog-index-founders-rail
6. theinmag-blog-index-newsletter
7. theinmag-blog-index-topics

### `templates/article.json`

The page template for `/inside/[handle]`. Composed of these sections in order:

1. theinmag-blog-post-header
2. theinmag-blog-post-cover
3. theinmag-blog-post-byline
4. theinmag-blog-post-quick-answer
5. theinmag-blog-post-body
 - (inline-cta and inline-newsletter rendered conditionally inside body or as a separate section after body - Claude Code's call based on what works best technically; my preference is a separate section that sits between body and FAQ)
6. theinmag-blog-post-inline-cta
7. theinmag-blog-post-faq
8. theinmag-blog-post-closing-cta
9. theinmag-blog-post-more-for-you
10. theinmag-blog-post-newsletter

---

## Build order Claude Code should follow

1. Set up metafield definitions in Shopify admin (Ryan does this manually first session, or Claude Code generates a metafields config file)
2. Build the snippets first (`theinmag-blog-card.liquid`, `theinmag-blog-byline.liquid`, schema snippets)
3. Build the post page sections in order (header → cover → byline → quick-answer → body → inline-cta → faq → closing-cta → more-for-you → newsletter)
4. Build the index page sections in order (header → filters → featured → grid → founders-rail → newsletter → topics)
5. Wire up `theinside-filters.js` for filter pill behaviour and URL state
6. Build `assets/theinside-base.css` with all blog-specific styles, scoped to `.theinside-*` classes
7. Configure `templates/blog.json` and `templates/article.json`
8. Test on Pixel 6 portrait at every step
9. Commit to GitHub at every section completion

After Section 1 of either page renders cleanly on mobile and desktop, Ryan reviews before moving on. After every section, commit. Two-conversation discipline - finish blog template, close session, fresh session for any later work.
