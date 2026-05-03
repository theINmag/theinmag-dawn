# theINmag Design Principles
### The why behind every visual and structural decision
*Updated: May 3 2026 — original 15 principles plus audit findings baked in*
*Living document — add to it as new principles prove themselves*

This file sits alongside CLAUDE.md (the project brain) and theinmag-design-tokens.md (the technical tokens) in the theme folder. Where design tokens tell Claude Code WHAT to use (hex codes, font sizes, spacing), this file tells us WHY certain decisions get made.

Read it before any major design call. Reference it in build prompts when judgment is needed. Add to it whenever a new principle proves itself.

---

## How to use this document

These are principles, not rules. Apply them with judgment. The brief, sitemap, and design tokens still cover the specifics. This document covers the philosophy that shapes every page.

When a build decision feels uncertain, ask: which principle applies here? If two principles conflict (clarity vs personality, speed vs richness), name the tension explicitly in the build prompt and make a deliberate call.

---

## Principle 1 — Nobody reads. They scan.

Visitors don't read websites. They skim headlines, glance at images, look for proof they're in the right place. Every page should be designed to be understood by someone moving through it at speed.

What this means in practice: lead with the headline that answers "am I in the right place?" before anything else. Bold the key points. Short paragraphs. Make the important stuff impossible to miss. If a section requires a paragraph to explain why it's good, the section is probably wrong.

Test: cover the body copy with your hand. Can you understand the page from headlines, images, and CTAs alone? If not, the structure isn't doing enough work.

---

## Principle 2 — The blink test (halo effect)

Visitors judge the entire business in roughly half a second based on how the site looks. A professional first impression makes everything else read as more credible — testimonials feel real, products feel quality, copy feels trustworthy. A cheap-looking first impression colours everything afterwards with skepticism.

What this means in practice: above-the-fold matters more than anything else on a page. Hero image quality, headline clarity, CTA prominence, no clutter, intentional whitespace. If the first half-second doesn't communicate "this is a real, considered, high-quality thing," nothing below that fold will recover the impression.

Test the homepage and every audience page on a fresh device with no context. Look at it for half a second, then close it. Did it feel professional? Did it feel like theINmag specifically?

---

## Principle 3 — Stock photos are a trust killer

Visitors instantly recognise stock imagery. The team high-fiving in the boardroom, the smiling diverse group looking at a laptop — everyone knows it's not real. The moment that registers, a small voice says "what else here isn't real?" and skepticism colours the rest of the visit.

theINmag's competitive moat: real kid creations, real photos of Ryan and Tam and Nora and the van, real moments. In a world being flooded with AI-generated perfection, intentional imperfection becomes the strongest trust signal we have.

What this means in practice: never use stock imagery, even as placeholder. If a real photo doesn't exist yet, leave the slot empty or use illustrated kid creations. Slightly messy desk shots beat polished ones. The grain of a real photo of Nora in the van beats any agency-shot family scene. Authenticity is the brand.

---

## Principle 4 — Clarity is good design, not the enemy of it

Pretty websites don't convert — clear ones do. A site can be the most beautiful, award-winning thing on the internet, but if a visitor can't figure out what it does and how to act within seconds, it has failed at its job.

What this means in practice: when a design choice and a clarity choice conflict, clarity wins every time. The hero CTA should be obvious. The next step should be visible. The value proposition should be answerable in one sentence by anyone who lands on the page. Beauty serves clarity, never the other way around.

The locked hero headline "Publishing creative Aussie kids." (four words, gerund) is the worked example. It answers what theINmag does in four words. No marketing-speak, no clever metaphor, no need to read the next line to understand. That's the bar.

This is especially true on Tier 1 conversion pages (homepage, shop, product pages, schools). On Tier 3 brand pages (Our Story, Where we'll be next), there's more room for personality and considered design moments — but even there, clarity comes first.

---

## Principle 5 — Every word earns its place

Most websites use twice as many words as they need. Visitors read websites like they're scanning a newspaper, not reading an essay. Reams of body copy go unread. The shorter version usually communicates more, not less.

What this means in practice: write the section, cut it in half, then cut it in half again. What remains is closer to what visitors actually need. If removing a sentence doesn't make the page worse, remove it. Smart brevity isn't a stylistic choice for theINmag — it's a structural one.

This pairs with the no-em-dashes rule and Guy Raz energy already locked in the design tokens. Punchy. Direct. Professional friend, not corporate brochure.

---

## Principle 6 — Be bold about who you are and what you charge

Hiding pricing wastes everyone's time. Visitors who can't afford it get filtered into a sales call that goes nowhere. Visitors who can afford it get frustrated by the friction of having to ask. Showing prices (or at least a starting-from number) attracts the right people and gracefully repels the wrong ones.

What this means in practice: theINmag prices are visible everywhere they apply. Membership pricing on the product page. Schools pricing tiers on /schools. Workshop pricing on /where-we-are. Single-issue and shipping costs visible on the product page, not hidden until checkout (this is also the cart-abandonment fix — 48% of cart abandonment is unexpected costs).

A site that repels the wrong people is a site that converts the right ones better. That's not a flaw, that's good design.

---

## Principle 7 — Look like theINmag, not like a kids' magazine

If the site looks like every other Australian kids' publication, it gets priced like every other Australian kids' publication. The visual personality is the differentiator: real kid creations as the design system, the warm purple and yellow palette, hand-drawn illustrated shapes, named kids and locations, the van photos, Ryan and Tam's voices.

What this means in practice: every page should pass the "would this work for any kids' publication?" test. If yes, it's not theINmag enough yet. If a section could appear unchanged on Scholastic AU's website, that section needs more theINmag in it — more named kid attributions, more kid creation imagery, more voice, more specifics.

In a world of AI-generated content with the same plastic look, the sites that stand out are the ones that feel human and have a point of view. theINmag has both. Use them.

---

## Principle 8 — Speed is invisible to you, painful to visitors

Sites built and tested on a MacBook Pro with office wifi feel fast to the builder. The same site loaded on a phone with two bars of signal in a regional Australian town is a different experience entirely. Every unnecessary animation, every uncompressed image, every bloated app costs real money — visitors who bounce before the page finishes loading.

What this means in practice: PageSpeed Insights mobile score 70+ is the floor, not the goal. Test on actual devices, on actual mobile networks, not just desktop simulators. Compress every image (TinyPNG already done as of May 1). Audit every Shopify app for performance impact before installing. If an animation or feature drops the mobile score below 70, cut it.

Speed is also an AEO signal — slow sites get crawled less, ranked lower, and cited less by AI engines. Fast site = better SEO, better AEO, better conversion, better trust. There's no upside to slow.

---

## Principle 9 — Animation should serve the content, not perform itself

Over-the-top animation impresses other designers. For everyone else, it's a distraction. Tools like Spline and Rive have made wild 3D effects accessible to everyone, which means everyone is using them, which means they no longer signal quality. They signal a designer trying too hard.

What this means in practice: subtle wins. A button that responds gently on hover. Content that fades in naturally as you scroll. A kid creation that floats softly up and down. These are the right moments. If the animation is what visitors notice instead of the offer, the priority is wrong.

This is already in the design tokens — float animation, scroll reveal, prefers-reduced-motion respected, sticker button press-down. The principle behind it: animation amplifies the content, never replaces it. If you remove an animation and the page is worse for it, the animation belongs. If the page is the same or better without it, cut it.

---

## Principle 10 — Design for the customer, not for yourself

Business owners (and designers) obsess over their own preferences — colours they personally like, layouts that impress their friends, copy that sounds clever to them. The customer doesn't share those preferences. The customer cares about one thing: can you solve my problem?

What this means in practice: every page decision should be tested against "does this serve the audience this page is for?" The For Parents page should serve parents, not be a showcase of theINmag's design capabilities. The For Teachers page should serve teachers, not Ryan's aesthetic preferences. Once Growth Agent has data, let conversion rate decide between options — not gut feel, not what looks coolest in screenshots.

This is why the Layout A vs B vs C A/B test matters. The right answer isn't what we think looks best. It's what visitors respond to.

---

## Principle 11 — Fewer, better pages beat more, mediocre pages

Every page added is another click, another decision, another chance for visitors to get lost or give up. Most websites don't need more pages — they need fewer, better ones. When the next logical step from the homepage isn't obvious, that confusion costs conversions.

What this means in practice for theINmag: the 21-page sitemap is structurally sound because each page serves a distinct audience or function. The principle isn't "have fewer pages" — it's "make sure each page has one clear job and doesn't try to do three."

Test for every page: what's the single primary action this page should drive? If a page has three competing CTAs of equal weight, narrow it to one primary and one secondary. If a section doesn't serve the page's primary job, move it or cut it.

---

## Principle 12 — The About page is real estate, not a résumé

Our Story / About is typically the second-most-visited page on any website. Most are wasted on company history written like a CV — "founded in 2015, we believe..." — that nobody cares about. Visitors come to the About page for one thing: reassurance. Are these people credible? Do they understand my problem? Have they solved it before?

What this means in practice for /our-story: lead with the transformation theINmag creates, not the founding date. The "two former teachers in a van" headline is good because it's specific and human. The "Where the money goes" section (all proceeds reinvested) is brand truth that builds trust faster than any paragraph about values. Numbers and faces beat company-speak every time.

Specifically: real photos of Ryan and Tam and Nora over polished headshots. Real metrics where they exist (subscriber count, mags published, kids featured). The packaging crew kid nephews are gold — keep them. The young-photo-plus-adult-photo device on the team grid is the kind of small, considered thing that builds trust without saying anything.

---

## Principle 13 — A great website attracts the right people by repelling the wrong ones

Trying to appeal to everyone results in resonating with nobody. Being explicit about who theINmag is for, what it costs, and who it's not for is a feature, not a bug. The Partnerships page already does this with "Who we don't work with." That section should be a model for how confident the rest of the site is.

What this means in practice: don't soften the brand to be safer. theINmag is ad-free, all proceeds reinvested into the next print, made by Aussie kids for Aussie kids. That's specific. It excludes some buyers (parents who want curriculum-first content, anyone wanting to advertise to kids). Good. The right buyers see those specifics and feel exactly the right thing: this is for me.

---

## Principle 14 — Launch is the starting line, not the finish

Most builds treat launch as the goal. Months of work, then a launch, then a long silence. The real work starts after launch — gathering data, testing, optimising, driving traffic. A site that launches and then sits is treated as a brochure. A site that's iterated continuously becomes a conversion machine.

What this means in practice for theINmag: the Growth Agent strategy already plans this. Lucky Orange recordings from Day 1. Native A/B testing once data exists. Klaviyo flow performance reviewed monthly. Conversion rate tracked weekly. The 90-day post-launch metrics in the brief aren't aspirational — they're the actual job.

The corollary: Week 2.5 launch isn't "done." It's the moment the real optimisation work begins. Plan capacity for that, not just the build.

---

## Principle 15 — Sell the result, not the thing

Nobody wakes up wanting to buy a magazine. Parents wake up wanting their kid to feel proud and creative and seen. Teachers wake up wanting engaged students. Homeschool families wake up wanting authentic learning that doesn't feel forced. The website's job isn't to sell theINmag — it's to sell what theINmag does for the people who buy it.

What this means in practice: every product page, every audience page, every CTA should lead with the transformation. "Where Aussie kids get published" leads with the kid being seen. "Finally, a magazine that makes your kid want to CREATE — not just consume" leads with the parent's win. "An authentic teaching tool your class will actually love" leads with the teacher's win.

Features (120 pages, ad-free, sustainably printed) earn their place lower on the page as proof. The headline always sells the result.

---

## Principle 16 — Colour pairs are the system (NEW from May 3 design audit)

theINmag's brand isn't a four-colour palette. It's six colour pairs, each pair a soft background tone with a saturated companion for text and accents on top. Mixing companions across pairs breaks the system instantly — dark purple text on a peach background reads wrong even if both colours are "from the brand."

What this means in practice: every coloured section uses one pair. Page builds always specify which pair a section uses (purple pair, mint pair, peach pair, etc.) before any other styling is decided. Yellow is excluded from pairs — it's a stamp colour, used only on small sticker-style CTAs and badges, never as a section background.

This is what makes the brand feel coherent across so many colours rather than chaotic. The six pairs (plus yellow stamp + cherry magenta emphasis) are pre-validated for WCAG AA contrast. Don't introduce new pairings without contrast validation.

Why this is a principle, not just a token: the design tokens file lists the pairs, but the principle is the architectural approach. Any future colour decisions (new section types, new audience pages, future product categories) should default to picking a pair, not picking individual colours.

---

## Principle 17 — Kid creations are the design system (NEW from May 3 design audit)

Most kids' brands use illustrations. theINmag uses real kid creations as the visual layer of the site itself. Not "decorated with kids' work" — the kids' work IS the design. Hero sections lead with named kid art. Audience pages feature kid creations as the dominant visual. The Gallery is functional infrastructure that doubles as social proof. Every product page features creations from inside that issue.

What this means in practice: when designing any new section, the first question is "which kid creation lives here?" not "what illustration should we add?" If a section can't be anchored by a real kid creation, the section is probably wrong for theINmag. The named attribution ("Maya, age 9 — Fremantle WA") is the trust signal that turns decoration into proof.

This is theINmag's competitive moat. AI can generate infinite illustrations. AI cannot generate authentic, named, attributed Australian kid creativity. Lean into the thing nobody can copy.

---

## Principle 18 — Sticker buttons, not corporate buttons (NEW from May 3 design audit)

The yellow CTA button on the live Wix site has a soft drop shadow and feels hand-drawn. It looks like something a kid stuck on the page. That detail is doing significant brand work — it's the small moment where the site visibly differentiates from every generic Shopify theme on the internet.

What this means in practice: theINmag buttons keep the sticker convention. Solid offset shadow (not blurred), generous pill border-radius (32px), Post Regular uppercase text on yellow, press-down translate effect on hover. Specs are locked in the design tokens. Don't replace with conventional flat or material-design buttons even if a future theme update makes that easier.

Why this matters: in a Shopify ecosystem where 90% of stores use the same button conventions, the sticker button is one of the cheapest possible ways to feel handmade and intentional. Tiny detail, massive brand cohesion payoff.

---

## Principle 19 — Contrast pairing in typography (NEW from May 3 font decision)

theINmag pairs Post Regular (high-personality, hand-lettered, chalky) with Inter (high-neutrality, screen-optimised, professional). This is "contrast pairing" — pairing a personality font with a neutral font so each does its job without competing. The opposite approach — pairing Post Regular with another warm/playful font — is "sympathy pairing" and risks the whole site feeling one-note.

What this means in practice: Post Regular owns the headlines and hero moments. Inter does everything else — body, subheadings, buttons (secondary), forms, navigation. If a future font decision tempts the site toward another characterful body font, default no. The neutral body is what lets the playful headlines feel like considered choices rather than the default temperature of the whole site.

This is also why the site can afford to have so much personality elsewhere (illustrated shapes, kid art, colour pairs, sticker buttons). Inter as the steady undercurrent is what makes everything else readable as intentional rather than chaotic.

---

## The respect principle that ties them all together

Every principle above is a form of respect. Respecting the visitor's time by being clear. Respecting their intelligence by not padding the copy or hiding the price. Respecting their goals by showing them exactly how theINmag helps them get there. Respecting their devices by being fast. Respecting their attention by not making them work.

A great website isn't built on tricks. It's built on respect. theINmag's voice — professional friend, smart brevity, named kid attributions, the warmth of real people — is already a respect-first voice. The design should match it.

---

## Tensions to navigate (not resolve)

Some principles pull against each other. Calling them out so we know to make deliberate calls when they meet.

Personality vs clarity. theINmag's character (illustrated shapes, kid creations everywhere, playful animations) is part of its differentiation. But personality at the cost of clarity costs conversions. When they conflict, clarity wins on Tier 1 pages (homepage, shop, products, schools) and personality gets more room on Tier 3 pages (Our Story, Where we'll be next, For Kids).

Richness vs speed. Real kid creations, real photos, animated GIFs of inside pages, video content — all build trust and personality, all cost load time. Compress aggressively. Test on actual devices. If a section drops mobile PageSpeed below 70, the section gets simplified.

Brand voice vs SEO. Blog posts need question-format H2s and FAQPage schema for AEO, but they also need to read like Ryan or Tam wrote them. The fix isn't to choose — it's to write the question-format H2s in Ryan or Tam's voice. "Why do kids stop creating?" passes both tests. "What is creative learning?" only passes the SEO one.

Featured kids vs site speed. The named-kid attributions are the brand's most powerful trust device. Every single page should have at least one. But the gallery and product pages can't load every image at once. Lazy-load aggressively, prioritise above-the-fold attribution visibility, accept that below-the-fold attributions can fade in as the visitor scrolls.

Colour richness vs cohesion. theINmag has six colour pairs plus accents. That's a lot. The risk: every page tries to use every pair and the site looks chaotic. The fix: each page picks 2-3 pairs maximum and sticks to them. **Homepage uses cream (universal base) + peach (the warm orange wash from the live Wix site that's converting at 6%) + purple as a rare accent + yellow stamp on primary CTAs.** For Parents uses cream + coral. For Kids uses cream + mint + yellow. The cream pair is universal — it lives on every page.

---

## Adding to this document

When a new principle proves itself — through a build decision, a Growth Agent finding, an A/B test result, a customer comment — add it here with the reasoning. Keep the format consistent: name the principle, explain why, explain what it means in practice for theINmag.

Date the additions. Over time, this becomes a record of how theINmag's design philosophy was shaped by real evidence rather than designer preferences.

---

*Original 15 principles sourced from a 750-website designer YouTube transcript, May 2026. Principles 16-19 added May 3 2026 from full design audit of mag08 + live Wix site + Post Regular/Inter font system decision. May 3 2026 (evening): homepage palette locked to cream + peach + purple + yellow stamp under "Colour richness vs cohesion" — peach replaces the earlier "cream + purple + one accent" framing based on Ryan's reference to the live Wix site's warm orange wash. Living document — add to it as cornerstone principles emerge.*