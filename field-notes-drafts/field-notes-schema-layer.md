# theINside Schema Layer
### Every JSON-LD block needed for AEO, ready to drop in
*Created: May 5 2026 - paired with `theinside-section-specs.md` (which references these as snippets). This file is the AEO infrastructure for theINside.*

---

## What this file does

Defines the four JSON-LD schema blocks the blog needs, written as Liquid templates Claude Code can drop directly into snippet files. Each block is what AI engines (ChatGPT, Claude, Perplexity, Google AI Overviews) use to extract and cite content. Without these blocks, the posts work but invisibly. With them, they get cited.

The Organisation entity for theINmag and the Person entities for Ryan and Tam are defined in the global homepage schema (already built or in progress). These blog snippets reference those existing entities by `@id` to consolidate the entity graph - which is what tells AI engines "this is the same theINmag and the same Ryan as on the homepage and the Our Story page."

---

## Entity URIs (define once, reference everywhere)

These URIs should match what's already used on the homepage and Our Story page schema. If they're different, fix the homepage version OR fix this version. Pick one canonical pattern.

```
Organisation: https://theinmag.com.au/#organisation
Ryan: https://theinmag.com.au/our-story#ryan
Tam: https://theinmag.com.au/our-story#tam
theINside blog: https://theinmag.com.au/inside#blog
```

---

## Schema 1 - Article (every post)

**Snippet path:** `snippets/theinmag-blog-schema-article.liquid`

**Purpose:** Tells Google and AI engines this is an editorial article, who wrote it, who published it, when. Includes the Quick Answer body as the description for direct AI extraction.

**Liquid template:**

```liquid
{% comment %}
 Renders Article JSON-LD for a blog post.
 Usage: {% render 'theinmag-blog-schema-article', article: article %}
{% endcomment %}

{% liquid
 assign author_id = 'https://theinmag.com.au/our-story#ryan'
 if article.author == 'Tam Gow'
 assign author_id = 'https://theinmag.com.au/our-story#tam'
 endif
 if article.metafields.theinside.is_kid_contributor
 assign author_id = nil
 endif

 assign quick_answer = article.metafields.theinside.quick_answer
 assign description = quick_answer | default: article.excerpt | strip_html | truncate: 300
%}

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Article",
 "@id": "{{ shop.url }}{{ article.url }}#article",
 "mainEntityOfPage": {
 "@type": "WebPage",
 "@id": "{{ shop.url }}{{ article.url }}"
 },
 "headline": {{ article.title | json }},
 "description": {{ description | json }},
 "image": {
 "@type": "ImageObject",
 "url": "{{ article.image | image_url: width: 1800 }}",
 "width": 1800,
 "height": 1000
 },
 "datePublished": "{{ article.published_at | date: '%Y-%m-%dT%H:%M:%S%z' }}",
 "dateModified": "{{ article.updated_at | date: '%Y-%m-%dT%H:%M:%S%z' }}",
 {% if article.metafields.theinside.is_kid_contributor %}
 "author": {
 "@type": "Person",
 "name": "{{ article.author }}",
 "description": "Guest blogger and theINmag contributor, age {{ article.metafields.theinside.kid_age }}, {{ article.metafields.theinside.kid_town }}"
 },
 {% else %}
 "author": {
 "@id": "{{ author_id }}"
 },
 {% endif %}
 "publisher": {
 "@id": "https://theinmag.com.au/#organisation"
 },
 "isPartOf": {
 "@id": "https://theinmag.com.au/inside#blog"
 },
 "articleSection": {{ article.metafields.theinside.primary_topic | default: 'Creativity' | json }},
 "keywords": {{ article.tags | join: ', ' | json }},
 "inLanguage": "en-AU"
}
</script>
```

---

## Schema 2 - FAQPage (posts with FAQ blocks)

**Snippet path:** `snippets/theinmag-blog-schema-faq.liquid`

**Purpose:** Surfaces individual Q&A pairs to AI engines for direct extraction. This is the schema that gets pulled into AI Overviews and voice assistant responses most often.

**Liquid template:**

```liquid
{% comment %}
 Renders FAQPage JSON-LD from the article's faq_items metafield.
 Usage: {% render 'theinmag-blog-schema-faq', article: article %}
 Skips render if no FAQ items defined.
{% endcomment %}

{% liquid
 assign faq_items = article.metafields.theinside.faq_items.value
%}

{% if faq_items != blank and faq_items.size > 0 %}
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "FAQPage",
 "@id": "{{ shop.url }}{{ article.url }}#faq",
 "mainEntity": [
 {% for item in faq_items %}
 {
 "@type": "Question",
 "name": {{ item.question | json }},
 "acceptedAnswer": {
 "@type": "Answer",
 "text": {{ item.answer | json }}
 }
 }{% unless forloop.last %},{% endunless %}
 {% endfor %}
 ]
}
</script>
{% endif %}
```

**Important:** The Q&A pairs in this schema MUST match the visible FAQ block exactly. Mismatched schema vs visible content is flagged by Google as deceptive and can trigger ranking penalties.

---

## Schema 3 - BreadcrumbList (every page)

**Snippet path:** `snippets/theinmag-blog-schema-breadcrumb.liquid`

**Purpose:** Helps Google understand the site hierarchy. Shows up as the breadcrumb trail in search results.

**Liquid template:**

```liquid
{% comment %}
 Renders BreadcrumbList JSON-LD.
 Usage:
 For index: {% render 'theinmag-blog-schema-breadcrumb', context: 'index' %}
 For post: {% render 'theinmag-blog-schema-breadcrumb', context: 'post', article: article %}
{% endcomment %}

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "Home",
 "item": "{{ shop.url }}"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "theINside",
 "item": "{{ shop.url }}/inside"
 }{% if context == 'post' %},
 {% if article.metafields.theinside.primary_topic %}
 {
 "@type": "ListItem",
 "position": 3,
 "name": {{ article.metafields.theinside.primary_topic | json }},
 "item": "{{ shop.url }}/inside?topic={{ article.metafields.theinside.primary_topic | downcase | replace: ' ', '-' }}"
 },
 {
 "@type": "ListItem",
 "position": 4,
 "name": {{ article.title | json }},
 "item": "{{ shop.url }}{{ article.url }}"
 }
 {% else %}
 {
 "@type": "ListItem",
 "position": 3,
 "name": {{ article.title | json }},
 "item": "{{ shop.url }}{{ article.url }}"
 }
 {% endif %}
 {% endif %}
 ]
}
</script>
```

---

## Schema 4 - CollectionPage (the index)

**Snippet path:** `snippets/theinmag-blog-schema-collection.liquid`

**Purpose:** Tells Google and AI engines that `/inside` is a coherent editorial collection, not just a list of links. Improves how the index gets surfaced and cited.

**Liquid template:**

```liquid
{% comment %}
 Renders CollectionPage JSON-LD for the blog index.
 Usage on /inside template: {% render 'theinmag-blog-schema-collection', blog: blog %}
{% endcomment %}

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "@id": "https://theinmag.com.au/inside#blog",
 "name": "theINside",
 "description": "Field notes from the road, the classroom, and the kitchen table. Editorial writing on creativity, learning, and what kids make when adults get out of the way.",
 "url": "{{ shop.url }}/inside",
 "isPartOf": {
 "@id": "https://theinmag.com.au/#organisation"
 },
 "publisher": {
 "@id": "https://theinmag.com.au/#organisation"
 },
 "mainEntity": {
 "@type": "ItemList",
 "itemListElement": [
 {% for article in blog.articles limit: 10 %}
 {
 "@type": "ListItem",
 "position": {{ forloop.index }},
 "url": "{{ shop.url }}{{ article.url }}"
 }{% unless forloop.last %},{% endunless %}
 {% endfor %}
 ]
 },
 "inLanguage": "en-AU"
}
</script>
```

---

## Where each snippet renders

| Snippet | Index page | Post page |
|---|---|---|
| theinmag-blog-schema-article | - | ✅ inside `<head>` or end of `<body>` |
| theinmag-blog-schema-faq | - | ✅ inside `<head>` or end of `<body>` (if FAQ items exist) |
| theinmag-blog-schema-breadcrumb | ✅ | ✅ |
| theinmag-blog-schema-collection | ✅ | - |

---

## Person and Organisation entities (already defined elsewhere)

These should already exist on the homepage / Our Story schema. Restating here so Claude Code knows what to expect at the entity URIs referenced above.

**Organisation entity (defined on homepage):**

```json
{
 "@context": "https://schema.org",
 "@type": "Organization",
 "@id": "https://theinmag.com.au/#organisation",
 "name": "theINmag",
 "url": "https://theinmag.com.au",
 "logo": "https://theinmag.com.au/cdn/logo.png",
 "description": "An Australian magazine made entirely from kid creations - 100% kid-created, sustainably printed, ad-free.",
 "founder": [
 { "@id": "https://theinmag.com.au/our-story#ryan" },
 { "@id": "https://theinmag.com.au/our-story#tam" }
 ],
 "foundingDate": "2023",
 "address": {
 "@type": "PostalAddress",
 "addressCountry": "AU"
 },
 "sameAs": [
 "https://www.instagram.com/the.inmag",
 "https://www.youtube.com/@theinmag"
 ]
}
```

**Person entity for Ryan (defined on Our Story):**

```json
{
 "@context": "https://schema.org",
 "@type": "Person",
 "@id": "https://theinmag.com.au/our-story#ryan",
 "name": "Ryan Gow",
 "jobTitle": "Co-founder, theINmag",
 "description": "Former numeracy specialist and advocate for rich, creative learning. Co-founder of theINmag.",
 "worksFor": { "@id": "https://theinmag.com.au/#organisation" },
 "knowsAbout": ["primary numeracy", "open-ended tasks", "rich learning", "kids' creativity", "Australian education"],
 "image": "https://theinmag.com.au/cdn/ryan-headshot.jpg"
}
```

**Person entity for Tam (defined on Our Story):**

```json
{
 "@context": "https://schema.org",
 "@type": "Person",
 "@id": "https://theinmag.com.au/our-story#tam",
 "name": "Tam Gow",
 "jobTitle": "Co-founder, theINmag",
 "description": "Former classroom teacher and passionate creative educator. Co-founder of theINmag.",
 "worksFor": { "@id": "https://theinmag.com.au/#organisation" },
 "knowsAbout": ["classroom teaching", "literacy", "creativity in education", "early years learning", "Australian education"],
 "image": "https://theinmag.com.au/cdn/tam-headshot.jpg"
}
```

If these entities are NOT yet defined on the homepage / Our Story page, define them as part of the blog build OR flag this as a dependency to fix in the homepage thread first.

---

## Validation

After implementation, validate every schema block at:

- https://search.google.com/test/rich-results
- https://validator.schema.org

Both tools should report zero errors and zero warnings on the schema blocks before declaring the build complete.

---

## llms.txt - the AI crawler manifest

Separate from JSON-LD but part of the same AEO play. Per the brief, theINmag has an `llms.txt` at the root. The blog adds an entry to it.

**Location:** `https://theinmag.com.au/llms.txt`

**Blog-specific section to add:**

```
# theINside (the blog)

theINside is theINmag's editorial home. Field notes from Ryan and Tam (former Australian
educators, co-founders of theINmag) on creativity, learning, and what kids make when
adults get out of the way.

Voice: warm, direct, smart brevity, practitioner-led, never corporate.

Categories:
- Creativity (why kids stop creating, what to draw, kid spotlights)
- Numeracy (open-ended tasks, rich learning, classroom craft)
- Wellbeing (boredom, slow attention, kids' emotional development)
- Literacy (writing, observation, kids' jokes as language development)
- Photography (Snaps section in the magazine, observational skill)
- Behind the Mag (process posts, how issues come together)
- Open Tasks (the pedagogy at the heart of theINmag)

Every post is signed by a named human author with verified expertise. theINmag does not
run sponsored content or accept advertising directed at children.

Index: https://theinmag.com.au/inside
Authors: Ryan Gow (numeracy, behind the mag), Tam Gow (classroom, wellbeing, homeschool)
```

This sits below the existing site-level llms.txt content. Ryan or Claude Code adds it during the build.
