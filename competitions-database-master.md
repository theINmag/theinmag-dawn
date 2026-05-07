# theINmag - Aussie Kids Competitions Database (Master)

**Last researched:** 7 May 2026
**Researcher:** Claude (deep web sweep + brand-led second pass)
**For internal use:** Master source document for the theINmag Competitions page. Merges general comp research with deeper brand-led sweep. On-site copy will be tightened further during page build.

---

## How to use this document

Each competition follows a consistent block structure for easy conversion to a Shopify metaobject, JSON file, or Google Sheet (a CSV companion to this doc has been generated for that purpose).

**Block structure:**
- **Name** - competition name as the H3
- **Quick-see panel** - WHO / WHAT / WHEN / WHERE / COST
- **The pitch** - 1-3 sentences of warmth, opportunity-focused, in our voice
- **Tags** - filterable metadata (age, state, field, cost, format)
- **Website** - direct link
- **Socials** - Instagram and/or Facebook handles
- **Logo source** - URL to grab the logo from
- **Status** - Confirmed for 2026 / Annual but 2026 unconfirmed / Biennial / On hiatus
- **Cross-promo angle** - 🟢 Hot lead / 🟡 Worth a try / 🔴 Long shot, plus pitch direction (only on relevant brand-led comps)
- **Notes for build** - anything the page builder needs to know

**Tag taxonomy (use these exact strings for consistent filtering):**
- **Ages:** `ages-4-6`, `ages-7-9`, `ages-10-12`, `ages-13-16`, `all-ages`
- **States:** `national`, `nsw`, `vic`, `qld`, `wa`, `sa`, `tas`, `nt`, `act`, `regional-only` (paired with state)
- **Field:** `art`, `writing`, `poetry`, `photography`, `film`, `music`, `stem`, `coding`, `maths`, `science`, `performance`, `dance`, `comedy`, `spelling`, `reading`, `history`, `environment`, `culture`
- **Cost:** `free`, `paid` (specify amount in pitch), `paid-optional`
- **Format:** `online`, `postal`, `school-entry`, `individual-entry`, `team`

**Image storage recommendation:** Drive folder `Website design / Shopify Assets / Competitions / Logos /`. Filename convention: `comp-[slug]-logo.png` (e.g. `comp-young-archie-logo.png`). Logos to be batch-grabbed and TinyPNG'd by Ryan/Tam.

**A note on dates:** Specific dates are given where the source confirms them. For comps that shift annually, typical month or window is given with the latest confirmed 2026 dates. The page should ideally show "live now" / "opens in [X] days" / "closed for 2026" states based on these dates - logic for the builder.

---

## Categories in this database

1. **Art & Design** (29 comps) - the biggest category, including all brand-led comps and royal shows
2. **Writing & Storytelling** (15 comps) - short stories, poetry, picture books, comics
3. **Photography & Film** (6 comps)
4. **STEM, Maths & Problem-Solving** (9 comps)
5. **Performance, Music & Stage** (5 comps)
6. **Social Good & Environment** (4 comps - others cross-tagged into Art)

**Total: 68 competitions documented.**

---

# CATEGORY 1 - ART & DESIGN

Drawing, painting, illustration, sculpture, mixed media, colouring. The biggest category, and likely the most-trafficked tile on the page. Includes the brand-led sub-section, royal shows, civic comps, and international.

## 1A. Flagship art comps

---

### Young Archie

**Quick-see:** WHO: Aussie kids 5-18 in 4 age categories (5-8, 9-12, 13-15, 16-18) | WHAT: Portrait of someone special | WHEN: Entries open late Jan, close early March annually | WHERE: National | COST: Free

**The pitch:** The little sibling of the Archibald, Australia's most prestigious portrait prize. Kids paint, draw or pastel a portrait of someone who matters to them - a parent, a grandparent, a best friend - and finalists hang in the Art Gallery of NSW alongside the grown-ups. Winners get $200 cash, an art hamper, and serious bragging rights.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `free` `postal`

**Website:** https://www.artgallery.nsw.gov.au/art/prizes/young-archie/enter/
**Socials:** Instagram @artgalleryofnsw | Facebook /artgalleryofnsw
**Logo source:** https://www.artgallery.nsw.gov.au

**Status:** Confirmed annual. 2026 entries closed 2 March 2026, finalists announced 30 April 2026.
**Notes for build:** Hero this in the Art category - the most prestigious and recognised kids' art comp in Australia.

---

### Wild At Art

**Quick-see:** WHO: Australian kids 5-12 | WHAT: Threatened species artwork | WHEN: Annually, dates TBC for 2026 | WHERE: National | COST: Free

**The pitch:** Run by the Australian Conservation Foundation. Kids pick an Aussie threatened species, create art that tells its story, and help raise awareness for some of our most at-risk wildlife. Judges look for emotional connection over technical skill - exactly what kid art does best.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `environment` `free` `online`

**Website:** https://www.acf.org.au/get-involved/wild-at-art-competition
**Socials:** Instagram @auscon | Facebook /AustralianConservation
**Logo source:** https://www.acf.org.au

**Status:** Annual. 2025 entries closed; 2026 details to come.
**Notes for build:** Mark as "registrations opening soon" until ACF confirms 2026 dates.

---

### Operation Art

**Quick-see:** WHO: NSW students K-Year 10 (entered through schools) | WHAT: Original artwork to lift the spirits of kids in hospital | WHEN: Applications close late June for following year's exhibition | WHERE: NSW | COST: $100 per artwork (paid by school)

**The pitch:** A NSW classic with a beautiful purpose. Kids create artwork, and 50 pieces are gifted each year to The Children's Hospital at Westmead - actually hung in the wards to lift sick kids' spirits. Every entry is framed and exhibited in a NSW gallery. More than 10,000 visitors see the exhibitions each year.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `nsw` `art` `paid` `school-entry`

**Website:** https://artsunit.nsw.edu.au/program/operation-art
**Socials:** Via The Arts Unit
**Logo source:** https://artsunit.nsw.edu.au

**Status:** Confirmed for 2026 exhibition. Applications close Friday 26 June 2026 for 2027 exhibition.
**Notes for build:** Note clearly that this is a school-entered comp ($100/artwork to school), not a parent-entered one.

---

### Cossack Children's Art Awards

**Quick-see:** WHO: Kids 5-15 in three age groups (5-8, 9-11, 12-15), living in City of Karratha or surrounding regional WA towns | WHAT: Painted canvas (provided) | WHEN: Entries open 24 March, close 28 April or when full | WHERE: WA - regional only | COST: Free, canvas provided

**The pitch:** A regional WA gem. Each child gets a free 30x30cm canvas to paint, and finalists are exhibited at the Galbraith Store in Cossack alongside the famous Cossack Art Awards. Category winners receive $100, the overall winner takes home $300 plus a 50% framing discount. Plus art packs from paintbox for highly commendeds.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `wa` `regional-only` `art` `free` `postal`

**Website:** https://www.cossackartawards.com.au/childrens
**Socials:** Facebook /CossackArtAwards
**Logo source:** https://www.cossackartawards.com.au

**Status:** Confirmed for 2026. Exhibition runs 19 July - 9 August 2026.
**Notes for build:** Tag clearly as WA-only so non-WA families can filter out.

---

### Shaun Tan Award for Young Artists

**Quick-see:** WHO: WA students Years 1-12, judged in 5 age categories | WHAT: Original 2D artwork no bigger than 1m x 1.5m | WHEN: Opens 24 April, closes 18 May annually | WHERE: WA | COST: Free

**The pitch:** Named after picture book legend Shaun Tan (The Arrival, The Lost Thing). Winners' work hangs in a month-long public exhibition at Subiaco Library, professionally framed or mounted. The City of Subiaco picks up the framing tab. No AI-generated work allowed.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `wa` `art` `free` `postal`

**Website:** https://www.subiaco.wa.gov.au (search "Shaun Tan Award")
**Socials:** Instagram @cityofsubiaco | Facebook /cityofsubiaco
**Logo source:** https://www.subiaco.wa.gov.au

**Status:** Confirmed for 2026. Closes 18 May 2026.

---

### Nunga Kids Art Competition

**Quick-see:** WHO: Aboriginal and/or Torres Strait Islander children and young people | WHAT: Painting, drawing or photo on annual theme | WHEN: Annually, aligned with NAIDOC Week (early July) | WHERE: SA | COST: Free

**The pitch:** Run by the Commissioner for Aboriginal Children and Young People in SA. A safe, celebrated space for First Nations kids to express themselves through creative artwork on the year's National Aboriginal and Torres Strait Islander Children's Day theme. All artwork displayed at the Commissioner's office during NAIDOC Week.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `sa` `art` `culture` `free`

**Website:** https://cacyp.com.au/nungakidsartcompetition/
**Logo source:** https://cacyp.com.au

**Status:** Annual. 2026 details to be confirmed.

---

## 1B. Brand-led kids art comps

The juiciest section for cross-promotion. Most of these brands run a comp at least annually and would benefit from theINmag exposure. Cross-promo angle scoring shows where the warm leads sit.

---

### Faber-Castell Create Your Mark

**Quick-see:** WHO: K-Year 6 Aussie kids | WHAT: Original artwork using Faber-Castell products on annual theme | WHEN: Annually, school-aligned (typically Term 3 entry, October announcements) | WHERE: National | COST: Free

**The pitch:** A whole-class crowd-pleaser. Faber-Castell partners with Cool Australia to build a curriculum-aligned brief for Aussie classrooms - kids create using Faber-Castell products around themes like "Create Your Mark For A Brighter Future." The school of the most inspiring entries scores $1,500 worth of Faber-Castell products. Plus a class prize. Schools and teachers can bulk-upload up to 60 entries at a time.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `school-entry` `online`

**Website:** https://createyourmark.com.au/
**Socials:** Instagram @fabercastellaustralia | Facebook /fabercastellaustralia
**Logo source:** https://www.faber-castell.com.au

**Status:** Annual. 2026 dates to confirm - typically launches Term 3.
**Cross-promo angle:** 🟢 Hot lead. Faber-Castell already markets to schools, teachers and parents - identical audience overlap. Pitch: "We're listing your Create Your Mark comp prominently on theINmag's competitions page for free. Want to explore a deeper collaboration - product features in the mag, comp prize sponsorship?"
**Notes for build:** Lead with this one in the brand-led section.

---

### Spencil Art Prize

**Quick-see:** WHO: Aussie kids in two categories - Young Stars (8 and under), Shooting Stars (9-13) | WHAT: Open theme artwork | WHEN: Closes early March annually | WHERE: National | COST: Free

**The pitch:** Run by Aussie kids' stationery brand Spencil. Major Prize Packs worth $400 each plus 20 runner-up prizes and weekly staff picks. The prize pack includes Get Arty Colouring Sets, Silky Crayons, art smock, sketchbook and more - so the prize itself is fuel for the next masterpiece.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `free` `online`

**Website:** https://spencil.com.au/artprize/
**Socials:** Instagram @spencil_au | Facebook /Spencil
**Logo source:** https://spencil.com.au

**Status:** Confirmed annual. 2026 entries closed 4 March 2026.
**Cross-promo angle:** 🟢 Hot lead. Spencil is owned by Aussie parents, sells to school families, and has a kid-creativity angle that's almost identical to ours. Their weekly staff picks are exactly what theINmag could amplify. Pitch: "We could feature weekly Spencil Art Prize finalists in our IG stories during entry period. Mutual audience boost."

---

### Banabae - We Are All Artists

**Quick-see:** WHO: Aussie kids (no strict age cap, primary-aimed) | WHAT: Original artwork - drawing, painting, collage | WHEN: Closes late April annually | WHERE: National | COST: Free

**The pitch:** The dream prize for any kid who loves clothes and creativity. Banabae - the Aussie kids' clothing brand - turns the winner's artwork into a real product in their next collection. Winner takes home a $500 voucher plus their design printed onto actual Banabae wares. Four runners-up get $50 vouchers each. The "your kid's art becomes a real thing" angle is identical to our "your kid's art in a real magazine" angle.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://banabae.com/blogs/on-the-blog/
**Socials:** Instagram @banabae | Facebook /banabae
**Logo source:** https://banabae.com

**Status:** Annual. Theme changes each year. 2026 details to be confirmed.
**Cross-promo angle:** 🟢 Hot lead. Identical brand DNA - Aussie, kid-creativity-led, "your kid's creation becomes something real," ethical/sustainable values. Tier 1 outreach target. Pitch: "We've featured your We Are All Artists comp prominently on our competitions page. Would love to talk about cross-promotion - would you be open to featuring theINmag in your next email or post?"

---

### Camp Australia Big Art Comp

**Quick-see:** WHO: Kids attending Camp Australia OSHC (Junior 7 and under, Senior 8 and over) | WHAT: Term-themed artwork (changes each term) | WHEN: Quarterly - one comp per school term | WHERE: National (where Camp Australia operates OSHC) | COST: Free

**The pitch:** Australia's biggest OSHC provider runs a national art comp every single term. Hundreds of kids enter each round. Past prizes have included custom hoodies featuring kids' own artwork, LEGO Creative Happy Boxes, $50 Art Shed vouchers, and a Grand Prize trophy designed by The Brickman himself (Ryan McNaught of LEGO Masters). Real artist Kerry Evitts judges each round.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free`

**Website:** https://campaustralia.com.au/big-art-comp/
**Socials:** Camp Australia on Facebook
**Logo source:** Camp Australia logo from website

**Status:** Confirmed - quarterly, one per school term.
**Cross-promo angle:** 🟡 Worth a try. Massive captive OSHC audience. They run their own Rocketeers Film Festival too - both content-heavy programs that need stories of kid creativity. theINmag could pitch as content partner.
**Notes for build:** Note that this comp is exclusive to kids attending Camp Australia OSHC - filter accordingly.

---

### Eckersley's Kids Colouring Competition

**Quick-see:** WHO: Aussie kids in two categories - 7 and under, 8-12 | WHAT: Colour in their themed colouring sheet (different theme each round) | WHEN: Multiple times per year - typically Easter, school holidays, Christmas | WHERE: National (in-store and online) | COST: Free

**The pitch:** Eckersley's Art & Craft is Australia's beloved 60-year-old art supplies chain. Kids pick up a free colouring sheet at any Eckersley's store (or download it online), colour it in any way they like - pencils, paints, crayons, anything goes - and submit. Winners scoop $50 Eckersley's gift cards. Multiple winners per round - 2 per store, 2 from online entries, 4 from Instagram entries.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free`

**Website:** https://www.eckersleys.com.au/competitions
**Socials:** Instagram @eckersleys | Facebook /Eckersleys
**Logo source:** https://www.eckersleys.com.au

**Status:** Annual rolling - multiple comps throughout the year.
**Cross-promo angle:** 🟢 Hot lead. Eckersley's is the Aussie art store, with 27 physical stores. Pitch: "We feature your colouring comps year-round on theINmag. Could we explore a Mag Submission Box at your stores? Or you stock theINmag at the counter?"

---

### Eckersley's Art & Craft Prize

**Quick-see:** WHO: Open to all - check current year for kids' categories | WHAT: Original artwork | WHEN: Annually | WHERE: National | COST: Paid (entry fee)

**The pitch:** Launched 2025 to celebrate Eckersley's 60th anniversary. National exhibition at Hazelhurst Arts Centre in September. While the headline prize targets adult artists, this one's worth tracking for any youth/junior categories that may be added.

**Tags:** `ages-13-16` `national` `art` `paid` `online`

**Website:** https://www.eckersleys.com.au/eckersley-s-art-craft-prize
**Socials:** As above
**Logo source:** As above

**Status:** Annual since 2025. Check current year for kids' divisions.

---

### Staedtler Secondary School Artist of the Year

**Quick-see:** WHO: Aussie secondary school students | WHAT: Original artwork (any medium) | WHEN: Annually, typically running Term 2 with voting in June | WHERE: National | COST: Free

**The pitch:** Staedtler runs an annual high-school comp with a $5,000 prize pool. Weekly random draw of $200 Staedtler art packs throughout the entry period. Plus a People's Choice voting round. Three professional Australian artists judge.

**Tags:** `ages-13-16` `national` `art` `free` `online`

**Website:** https://au.competitions.staedtler.com/
**Socials:** Staedtler Australia on Facebook/Instagram
**Logo source:** Staedtler red/black logo

**Status:** Confirmed annual.
**Cross-promo angle:** 🟡 Worth a try. Big global brand - probably overkill for a small partnership but worth a feature. List their comp prominently and let them notice us first.
**Notes for build:** Slightly older audience than our 4-13 core, but the 13-16 tag covers it.

---

### Staedtler World Kids Colouring Day

**Quick-see:** WHO: Kids 3-12 | WHAT: Colouring on annual theme - 2026 theme is "Football, Friends & Colouring Fun" | WHEN: Annually, entries open March-May, World Kids Colouring Day is 6 May | WHERE: International (Aussie kids can enter) | COST: Free

**The pitch:** A global initiative by Staedtler that's been running for 18 years. Kids submit a drawing on the year's theme, and for every picture submitted Staedtler donates to a Plan International project supporting girls' education - in 2026 this funds education for girls in Malawi.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://www.staedtler.com/intl/en/company/about-staedtler/corporate-social-responsibility/world-kids-colouring-day/
**Socials:** Staedtler on Facebook/Instagram
**Logo source:** Staedtler logo

**Status:** Confirmed annual.

---

### Smiggle Christmas Card Competition

**Quick-see:** WHO: Aussie kids (broad age range) | WHAT: Design the front cover of a Smiggle Christmas card | WHEN: Annually around October-November | WHERE: National | COST: Free

**The pitch:** The cult Aussie kids' stationery brand runs an annual Christmas card design comp. Kids download a template, draw the front cover, colour it in - the winning design gets featured on actual Smiggle Christmas cards. Prizes typically include vouchers and Smiggle gear.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://www.smiggle.com.au/shop/en/smiggle/competitions
**Socials:** Instagram @smiggle | Facebook /Smiggle
**Logo source:** Smiggle pink/blue logo

**Status:** Annual seasonal.
**Cross-promo angle:** 🟡 Worth a try. Smiggle is huge with our age group, but corporate-managed and probably hard to break into. Worth listing prominently and reaching out for product features rather than partnership.

---

### Cartoon Chef Drawing Competition

**Quick-see:** WHO: Aussie kids (Year 1-6 mostly) | WHAT: Drawing comp with monthly themes | WHEN: Monthly | WHERE: National | COST: Free

**The pitch:** Run by Cartoon Chef - the kids' cartoon-drawing project that started as a regular feature in Auspac newspapers in 2011. Monthly drawing prompts, monthly winners. They also run an annual exhibition at the National Cartoon Gallery in Coffs Harbour. Cartoon Chef is a NSW Creative Kids Voucher provider.

**Tags:** `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://cartoonchef.com.au/
**Socials:** Cartoon Chef on Facebook
**Logo source:** Cartoon Chef logo

**Status:** Confirmed - monthly comp.
**Cross-promo angle:** 🟢 Hot lead. Small Aussie operator, kids' creativity focus, regular content cadence. Probably very approachable. Pitch: "We feature your monthly comps on theINmag. Could you write a guest blog post about teaching kids to draw cartoons? Or feature theINmag in your next Auspac syndication?"

---

### Boathouse Group Kids Colouring Competition

**Quick-see:** WHO: Aussie kids | WHAT: Colour in Boathouse-themed colouring sheet | WHEN: Seasonal - check site | WHERE: National (Boathouse venues across Sydney) | COST: Free

**The pitch:** The Boathouse Group runs Sydney's beloved waterfront eateries (Manly, Palm Beach, Shelly Beach, Balmoral). Their kids' colouring comp lands during school holidays with a kids hamper as the prize.

**Tags:** `ages-4-6` `ages-7-9` `national` `art` `free`

**Website:** Search "Boathouse colouring competition" or check schoolholidays.com.au
**Status:** Seasonal.
**Cross-promo angle:** 🟡 Worth a try. Local NSW play - might be a fit when Ryan/Tam are travelling through Sydney.

---

### Lime Tree Kids Colouring Competition

**Quick-see:** WHO: Aussie kids | WHAT: Colour in their seasonal sheet | WHEN: School holidays | WHERE: National (online) | COST: Free

**The pitch:** Lime Tree Kids is the Aussie online toy and craft store run by an Aussie mum. They run a seasonal colouring comp with a $100 voucher prize.

**Tags:** `ages-4-6` `ages-7-9` `national` `art` `free` `online`

**Website:** Lime Tree Kids site
**Socials:** Lime Tree Kids on Facebook/Instagram

**Status:** Seasonal.
**Cross-promo angle:** 🟢 Hot lead. Aussie family-run business - very theINmag-aligned. Could be a stockist of theINmag too. Worth a DM.

---

### Crayola Creative Acts of Color (Open Call)

**Quick-see:** WHO: Anyone, any age | WHAT: Any creative response - song, painting, recipe, dance, code, equation - inspired by Crayola's annual creative theme | WHEN: Year-round Open Call (currently active) | WHERE: International | COST: Free

**The pitch:** Crayola's "Creative Acts of Color" is an open call rather than a traditional comp - kids share their creative work on social tagged @Crayola and #StayCreative. Less about winning, more about being part of a global creative movement. Crayola also runs an annual Crayola Creativity Week (typically January) with classroom activities.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://www.crayola.com/news/blog/2025/06/26/crayola-launches-creative-acts-of-color-with-global-open-call
**Crayola Creativity Week:** https://creativity-week.squarespace.com/
**Socials:** Instagram @crayola | Facebook /crayola

**Status:** Ongoing.
**Notes for build:** Tag this as "year-round" rather than chronological - it doesn't need a deadline.

---

### Micador Brand Giveaways

**Quick-see:** WHO: Aussie families | WHAT: Various promotions and giveaways | WHEN: Rolling throughout the year | WHERE: National | COST: Free

**The pitch:** Aussie owned art supplies brand. Micador runs regular brand giveaways - "Win a Year of Micador," "Win a Year of early stART," etc. Sub-brands include early stART (toddlers), Micador jR. (kids), Micador (tweens) and Micador for Artists.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `art` `free` `online`

**Website:** https://micador.com.au/competitions
**Socials:** Micador on Facebook/Instagram
**Logo source:** Micador logo

**Status:** Rolling.
**Cross-promo angle:** 🟢 Hot lead. 100% Aussie-owned, kids' creativity focus, multiple sub-brands across our exact age range. Strong fit. Pitch: "We list your giveaways on theINmag year-round. Could we explore a product seeding partnership? Free Micador packs to our published kid contributors?"

---

### Bunnings Spring/Seasonal Art Competitions

**Quick-see:** WHO: School classes (varies by store) | WHAT: Themed artwork submitted by class | WHEN: Local-level, varies | WHERE: National (varies by store) | COST: Free, materials provided

**The pitch:** Bunnings doesn't run a national art comp consistently, but local stores run school-tied art comps - the Make Your Classroom Sing Like Spring comp gave participating schools MDF boards and Chubby Pencil paints, and prizes included garden beds, gardening mix, and $50 Bunnings vouchers. Worth flagging that families/teachers can ask their local store about upcoming comps.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `regional-only` `art` `free` `school-entry`

**Website:** Check your local Bunnings or https://www.bunnings.com.au/services/in-store/diy-workshops
**Status:** Sporadic, store-specific.
**Notes for build:** Best listed as a tip/opportunity rather than a single comp tile - "Ask your local Bunnings about seasonal art comps."

---

## 1C. Royal Show & Eisteddfod Junior Art

These are massive but underrated. Each Royal Show in Australia runs a junior art section with multiple categories. Hundreds of kids enter, and prizes plus exhibition slots are real. Fees are usually small ($2-10 per entry).

---

### Sydney Royal Easter Show - Arts & Crafts Junior Categories

**Quick-see:** WHO: Aussie kids - junior categories across all ages (typically 5+ to 18) | WHAT: 500+ competition categories across art, photography, pottery, cake decorating, woodwork, quilting, knitting, soft toys | WHEN: Entries open early in the year, judging in March-April for Easter Show | WHERE: NSW (entries from across Australia accepted) | COST: Paid (entry fees)

**The pitch:** Australia's biggest creativity showcase has been running since 1869 - approximately 5,500 exhibits across 500 categories. The Junior Art, Craft & Design competition has hundreds of classes for kids aged 2-20. Winning entries displayed in the Arts & Crafts Pavilion, the third-most-visited pavilion at the Easter Show. Real ribbons, real exhibition.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `paid` `postal`

**Website:** https://www.rasnsw.com.au/competitions/arts-and-crafts/arts-and-crafts-details/
**Socials:** Royal Easter Show on Facebook
**Logo source:** RAS NSW logo

**Status:** Confirmed annual.

---

### Royal Adelaide Show - Junior Art, Craft & Design

**Quick-see:** WHO: Kids 2-20 | WHAT: 250+ creative classes - art, craft, design, photography | WHEN: Entries early in the year, Show in September | WHERE: SA | COST: Paid (entry fees)

**The pitch:** Australia's largest annual junior art, craft and design display. Real prize money, real exhibition slots in the Goyder Pavilion. Categories cover painting, drawing, digital photography, pottery, sewing, and dozens more.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `sa` `art` `paid` `postal`

**Website:** https://www.theshow.com.au/competitions/junior-art-craft-design
**Socials:** Royal Adelaide Show on Facebook
**Logo source:** Royal Adelaide Show logo

**Status:** Confirmed annual.

---

### Royal Queensland Show (Ekka) - Junior Categories

**Quick-see:** WHO: Aussie kids | WHAT: 21,000+ competition entries across all categories - junior art divisions vary | WHEN: Show runs 8-16 August 2026 | WHERE: QLD | COST: Paid

**The pitch:** Queensland's biggest annual event runs one of the country's largest creative competition rosters. Junior art, photography, and craft categories sit alongside woodchop, giant vegetables and livestock. Quintessentially Aussie.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `qld` `art` `paid` `postal`

**Website:** https://www.ekka.com.au/
**Socials:** Ekka on Facebook/Instagram
**Logo source:** Ekka logo

**Status:** Confirmed for 2026.

---

### Other State Royal Shows (tip tile)

Royal Melbourne Show, Royal Perth Show, Royal Hobart Show, Royal Darwin Show and Canberra Show all run junior art categories. Recommendation for build: a single "Find your state's Royal Show" tip tile rather than 5 separate entries, with links to each.

---

## 1D. Civic & Council Art Comps

---

### NSW Children's Week Art Competition

**Quick-see:** WHO: Children and young people up to 18 living in NSW | WHAT: Portrait of someone who champions children's rights | WHEN: Entries close mid-October annually | WHERE: NSW | COST: Free

**The pitch:** Run by the NSW Advocate for Children and Young People. The 2025 theme was "Everyone should know about children's rights" based on Article 42 of the UN Convention on the Rights of the Child. Group entries allowed and encouraged. Three age categories with 1st, 2nd and 3rd place per category.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `nsw` `art` `culture` `free` `online`

**Website:** https://www.acyp.nsw.gov.au/get-involved/childrens-week-art-competition
**Socials:** ACYP on Facebook
**Logo source:** NSW Government / ACYP logo

**Status:** Confirmed annual. 2026 dates to confirm.

---

### Children's Rights Queensland Art Competition

**Quick-see:** WHO: Queensland kids and young people | WHAT: Artwork on rights/respect/love themes | WHEN: Annually | WHERE: QLD | COST: Free

**The pitch:** Run by Children's Rights Queensland in partnership with the Queensland Family and Child Commission. 2025 theme was "Every Queensland child is loved, respected and has their rights upheld." Over 300 entries received in 2025, with first/second/third place winners sharing $2,000+ in prizes across age groups.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `qld` `art` `culture` `free` `online`

**Website:** https://childrensrights.org.au/competitions/2025-child-rights-art-competition
**Socials:** Children's Rights Qld on social
**Logo source:** Children's Rights Qld logo

**Status:** Confirmed annual. 2026 details to confirm.

---

## 1E. International Comps Aussie kids can enter

---

### World Children's Picture Contest (Pentel)

**Quick-see:** WHO: Kids globally (typically 4-15) | WHAT: Painting on annual theme | WHEN: Entries open June, close October annually | WHERE: International (Australian kids welcome) | COST: Free

**The pitch:** Run by Pentel of Japan since 1970. One of the world's oldest and largest international kids' art comps - tens of thousands of entries from over 70 countries each year. Themes vary annually. International recognition for any Aussie kid who places.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `free` `postal`

**Website:** Check Pentel.com or via Australian art studios who facilitate entries
**Status:** Confirmed annual.

---

### International Festival of Owls Kids' Art Contest

**Quick-see:** WHO: Kids 18 and under | WHAT: Owl-themed artwork | WHEN: Entries close 15 January annually | WHERE: International (postal entries to USA) | COST: Free

**The pitch:** Started in 2004 as a small US festival comp, now over 2,000 entries from dozens of countries. Niche but enthusiastic - a perfect home for kids who love owls (and kids who love owls really love owls). No AI, no adult help. Original art, posted to Minnesota.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `free` `postal`

**Website:** https://www.festivalofowls.com/kids-art-contest.html
**Status:** Confirmed annual.

---

### Embracing Our Differences

**Quick-see:** WHO: Kids globally | WHAT: Art and writing on diversity/inclusion themes | WHEN: Entries close October annually | WHERE: International (US-based, accepts global entries) | COST: Free

**The pitch:** Florida-based but accepts entries globally. Theme is consistent: "Enriching Lives Through Diversity & Inclusion." Selected works displayed in an outdoor exhibition seen by 350,000+ visitors annually.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `culture` `free` `online`

**Website:** Embracing Our Differences website
**Status:** Confirmed annual.

---

### Save The Frogs! Art Contest

**Quick-see:** WHO: Kids globally (with junior and student categories) | WHAT: Frog-themed artwork on conservation | WHEN: Entries close November annually | WHERE: International | COST: Free

**The pitch:** Frog conservation through art. Junior (under 18) and student categories. Aussie kids welcome. Quirky, niche, surprisingly popular.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `environment` `free` `online`

**Status:** Confirmed annual.

---

# CATEGORY 2 - WRITING & STORYTELLING

Short stories, poetry, picture books, comics. theINmag's deepest natural overlap.

---

### Whitlam Institute What Matters? Writing Competition

**Quick-see:** WHO: Aussie students Years 5-12 (4 categories) | WHAT: Up to 600 words of prose or poetry on what matters to you | WHEN: Closes 15 May annually | WHERE: National | COST: Free

**The pitch:** A really special one. The Whitlam Institute asks kids one question - what matters? - and lets them answer however they want. Last year over 6,500 students entered. Year 5/6 winners get $350, a creative writing workshop, and an Allen & Unwin book pack. The overall winner takes home $1,500. Every entry is read by a real human.

**Tags:** `ages-10-12` `ages-13-16` `national` `writing` `poetry` `free` `online`

**Website:** https://www.whitlam.org/what-matters
**Socials:** Instagram @whitlam_institute | Facebook /WhitlamInstitute
**Logo source:** https://www.whitlam.org

**Status:** Confirmed for 2026. Closes 15 May 2026.

---

### NSW WriteOn Competition

**Quick-see:** WHO: NSW primary students Years 1-6 (including home-schooled) | WHAT: Imaginative text up to 500 words from provided stimulus | WHEN: Opens 23 March, closes 19 June 2026 | WHERE: NSW | COST: Free

**The pitch:** The annual creative writing comp run by the NSW Department of Education in partnership with the State Library. The 2026 stimulus: "It was a small thing, but it made a difference." Winning entries are published in the "Best of WriteOn" anthology - a real book, kids' words in print.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `nsw` `writing` `free` `school-entry` `online`

**Website:** https://www.nsw.gov.au/education-and-training/nesa/awards-and-events/writeon-competition
**Socials:** Via NESA
**Logo source:** NSW Government / NESA logo

**Status:** Confirmed for 2026. Closes 19 June 2026.

---

### Dorothea Mackellar Poetry Awards

**Quick-see:** WHO: Aussie students K-Year 12 | WHAT: Poem max 80 lines, any subject (optional theme) | WHEN: Closes 30 June annually | WHERE: National | COST: Paid (small fee)

**The pitch:** One of Australia's longest-running and most prestigious kids' poetry comps, named after the woman who wrote "My Country." 2026's optional theme is The Traveller. Cash prizes plus an annual anthology that publishes winners, runners-up, shortlisted and commended poems. Entries can be solo, group, or whole-class. No AI.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `writing` `poetry` `paid` `online`

**Website:** https://dorothea.com.au/entry-information/
**Socials:** Facebook /dorothea.poetry
**Logo source:** https://dorothea.com.au

**Status:** Confirmed for 2026. Closes 30 June 2026. Be transparent about the entry fee in the snippet.

---

### Better Read Kids Writing Competition

**Quick-see:** WHO: Kids 6-17 in three age categories (6-9, 10-12, 13-17) | WHAT: Short story, poem or comic, max 300 words | WHEN: Closes 1 August annually | WHERE: National | COST: Free

**The pitch:** Run by Sydney's beloved Better Read Than Dead bookstore. The 2026 theme is "metamorphosis." Every entry gets published in an anthology - so just by entering, kids become published writers. Category winners score a $100 Better Read voucher, runners-up get $50.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `writing` `poetry` `free` `online`

**Website:** https://www.betterreadkids.com/2026-writing-competition
**Socials:** Instagram @betterreadthandead | Facebook /betterreadthandead
**Logo source:** https://www.betterreadkids.com

**Status:** Confirmed for 2026. Closes 1 August 2026.

---

### Whitsunday Voices Short Story Competition

**Quick-see:** WHO: Students Grades 3-12 (5 grade categories) | WHAT: Short story on any topic | WHEN: Closes 30 April annually | WHERE: National | COST: Free

**The pitch:** Cash prizes for first, second and third place in each age category. Word limits step up with year level - 300-400 for Grades 3-4, up to 1,200 for Years 11-12. Pure creative freedom on subject matter. Strictly no AI.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `writing` `free` `online`

**Website:** https://www.whitsundayvoices.com.au/short-story-competition-copy
**Socials:** Whitsunday Voices Festival on Facebook
**Logo source:** https://www.whitsundayvoices.com.au

**Status:** Confirmed for 2026. Closed 30 April 2026.

---

### Laura Literary Awards (Prose & Poetry)

**Quick-see:** WHO: Primary students 5-12 in two categories (5-8, 9-12) | WHAT: Short story up to 800 words OR poem up to 60 lines | WHEN: Closes 8 May annually | WHERE: National | COST: Free for primary

**The pitch:** Run by the Rocky River Writers Club out of country SA. A lovely small-but-mighty comp with two streams - Prose and Poetry (CJ Dennis Poetry Awards). $25 to Junior winners, $15 to Junior Primary. Note: entries must be POSTED, not emailed.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `writing` `poetry` `free` `postal`

**Website:** https://rockyriverriters.club
**Logo source:** Rocky River Writers Club

**Status:** Confirmed for 2026. Closes 8 May 2026.
**Notes for build:** Important to flag the postal-only requirement clearly.

---

### Furphy Story Junior and Youth Competition

**Quick-see:** WHO: Kids up to 12 (Junior), regional VIC only - Goulburn Valley, Moira, Strathbogie, Mitchell, Murrindindi, Benalla or Campaspe Shires | WHAT: Short story (up to 2,000 words) or poetry (up to 20 lines) | WHEN: Closes 31 May annually | WHERE: VIC - regional only | COST: Free

**The pitch:** A regional Victoria gem. 1st prize $300, 2nd $100, 3rd $50 - in both story and poetry. Generous prize money for a regional comp.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `vic` `regional-only` `writing` `poetry` `free`

**Website:** https://www.furphystory.com.au
**Socials:** Furphy Story on Facebook
**Logo source:** https://www.furphystory.com.au

**Status:** Confirmed for 2026. Closes 31 May 2026.

---

### CBCA WA's Make Your Own Storybook Awards

**Quick-see:** WHO: WA students Pre-Primary to Year 8 | WHAT: Original handbound picture/story book up to 5,000 words | WHEN: Closes 5 June annually | WHERE: WA | COST: Free

**The pitch:** Make a real book - cover to cover, original text, original illustrations, hand-bound. Solo or duo. Run by the Children's Book Council of Australia (WA). The most "you've actually made a book" feel of any kids' comp out there. Strictly no AI.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `wa` `writing` `art` `free` `postal`

**Website:** https://wa.cbca.org.au/entry-information.html
**Socials:** CBCA WA on Facebook
**Logo source:** https://wa.cbca.org.au

**Status:** Confirmed for 2026. Closes 5 June 2026.

---

### Randolph Stow Young Writers Award

**Quick-see:** WHO: Midwest and Gascoyne WA students (Years 3-6 prose/poetry) | WHAT: Prose up to 1,200 words OR poetry (no word limit) | WHEN: Opens 20 April, closes 3 July | WHERE: WA - regional only | COST: Free

**The pitch:** Cash prizes for primary writers in regional WA. Winners get a perpetual trophy displayed in their school until end of Term 2 the following year. Two students from Years 6-11 also win passes to The Literature Centre's Young Writers Collective Program.

**Tags:** `ages-7-9` `ages-10-12` `wa` `regional-only` `writing` `poetry` `free`

**Website:** https://library.cgg.wa.gov.au/kids/randolph-stow-young-writers-awards.aspx
**Socials:** City of Greater Geraldton Library
**Logo source:** Geraldton Library logo

**Status:** Confirmed for 2026. Closes 3 July 2026.

---

### South Perth Young Writers Award (SPYWA)

**Quick-see:** WHO: Students Years 1-10 living or attending school in City of South Perth WA | WHAT: Short story up to 1,500 words | WHEN: Closes 18 May | WHERE: WA - regional only | COST: Free

**The pitch:** Shortlisted entrants score a one-on-one workshop with a published local author for tailored feedback. Finalists get prizes up to $150 and have their work published in a SPYWA Anthology - one copy gifted to each finalist, one to their school library, one held in City of South Perth Libraries.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `wa` `regional-only` `writing` `free`

**Website:** https://southperth.wa.gov.au/community/libraries/about-our-libraries/south-perth-young-writers-award
**Socials:** City of South Perth Libraries on Facebook
**Logo source:** City of South Perth logo

**Status:** Confirmed for 2026. Closes 18 May 2026.

---

### The Golden Pen (Scribblers Festival)

**Quick-see:** WHO: WA students Years 4-12 in three categories (Junior 4-6, Middle 7-8, Senior 9-12) | WHAT: Any format - poetry, prose, comics - up to 2,000 words or 6 A4 pages | WHEN: Closes 3 March annually | WHERE: WA | COST: Free

**The pitch:** Run by Scribblers Festival, Perth's kids' lit festival. The 2026 theme is Metamorphosis. Overall winner gets an e-reader and book pack ($249 value). Shortlisted entrants get 6-month book subscriptions. Bonus: classroom entries of 5+ can win a workshop with a Scribblers creative.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `wa` `writing` `poetry` `free` `online`

**Website:** https://www.scribblersfestival.com.au/golden-pen
**Socials:** Instagram @scribblersfestival
**Logo source:** Scribblers Festival logo

**Status:** Confirmed for 2026. Closed 3 March 2026.

---

### CYA Conference Hatchlings Award

**Quick-see:** WHO: Kids 8-18 | WHAT: Picture books, chapter books, middle grade or YA | WHEN: Closes mid-April annually | WHERE: National | COST: Free

**The pitch:** Run by the CYA Conference (Children's & Young Adults' writers conference). Solid cash prizes - $100 first, $60 second, $40 third. Categories vary by writing form, with word counts to match.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `writing` `free` `online`

**Website:** Search "CYA Conference Hatchlings"
**Socials:** CYA Conference on Facebook
**Logo source:** CYA logo

**Status:** Confirmed for 2026. Closed 12 April 2026.

---

### Book Links Short Story Writing Competition

**Quick-see:** WHO: Years 4-6 | WHAT: Short story 500-1,000 words | WHEN: Closes mid-September annually | WHERE: National | COST: Free

**The pitch:** A nice low-key one for upper primary writers. $100 prize plus the winning story published on the Book Links website. Open theme.

**Tags:** `ages-7-9` `ages-10-12` `national` `writing` `free` `online`

**Website:** https://booklinks.org.au/childrens-short-story-competition-guidelines/
**Socials:** Book Links Qld on Facebook
**Logo source:** Book Links logo

**Status:** Annual. 2026 dates to confirm.

---

### Just Write - For Kids (SA Public Libraries)

**Quick-see:** WHO: Children who are members of the SA Public Library network in two categories (9-10, 11-13) | WHAT: Short story | WHEN: Closes 18 January annually | WHERE: SA | COST: Free

**The pitch:** Run by Marion City Council's library network. First prize up to $200, second up to $100. Word limits 300-750 (9-10s) or 500-1,000 (11-13s). Open theme.

**Tags:** `ages-7-9` `ages-10-12` `sa` `writing` `free` `online`

**Website:** https://www.marion.sa.gov.au/venues-and-facilities/libraries/whats-on/just-write-for-kids
**Socials:** Marion Library on Facebook
**Logo source:** City of Marion logo

**Status:** Confirmed for 2026. Closed 18 January 2026.

---

### State Premier's Reading Challenges

**Quick-see:** WHO: All students K-Year 10 (varies by state) | WHAT: Read a set number of books from approved booklists | WHEN: Varies by state - typically Term 1 to Term 3 | WHERE: NSW, QLD, VIC, WA, SA, TAS | COST: Free

**The pitch:** Not a competition - a challenge. Hundreds of thousands of kids do this each year. Read enough books from your state's curated booklist and earn a certificate signed by the Premier. The vibe is participation, not winning - but it's a big motivating force for reluctant readers. Each state runs its own version with similar mechanics.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `nsw` `qld` `vic` `wa` `sa` `tas` `reading` `free` `school-entry`

**NSW:** https://online.education.nsw.gov.au/prc/home.html (Feb-Sep)
**QLD:** https://readingchallenge.education.qld.gov.au/ (Mar-Aug)
**WA:** https://www.premiersreadingchallenge.wa.edu.au/ (Mar-Jun 2026)
**SA:** https://premiersreadingchallenge.sa.edu.au/
**TAS:** Check DECYP website

**Status:** Confirmed for 2026 across all listed states.
**Notes for build:** Treat this as a single tile with state-by-state links rather than 5 separate listings.

---

# CATEGORY 3 - PHOTOGRAPHY & FILM

Photography, short film, animation, video. Smaller list but high-quality entries.

---

### Crikey! Magazine Photography Competition (Australia Zoo)

**Quick-see:** WHO: Three kids categories - Under 10, 11-14, 15-17 | WHAT: Wildlife/nature photography | WHEN: Annually, dates TBC | WHERE: National | COST: Free

**The pitch:** Run by Australia Zoo and the Irwin family. Big-ticket prizes: 2 nights at the Crocodile Hunter Lodge (over $1,800 value), Australia Zoo family passes, signed gift baskets. Robert Irwin started his photography career here as a junior finalist.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `photography` `environment` `free` `online`

**Website:** https://australiazoo.com.au/photography-competition/
**Socials:** Instagram @australiazoo | Facebook /australiazoo
**Logo source:** https://australiazoo.com.au

**Status:** Annual. 2026 entries window TBC.
**Notes for build:** Massive brand recognition - hero this one in Photography category.

---

### Australian Geographic Nature Photographer of the Year - Junior Category

**Quick-see:** WHO: Photographers under 18 (Junior category) | WHAT: Nature photography in ANZANG bioregion | WHEN: Entries open early December, close early February | WHERE: National (and NZ) | COST: $10 first image, $5 each additional (Junior pricing)

**The pitch:** The big one. Run by the South Australian Museum with Australian Geographic. Junior winners take home $500, runners-up $250, plus all finalists get exhibited at the SA Museum and Australian Museum. Up to 4 entries per kid across categories like Animals in Nature, Landscape, Threatened Species, Macro, Astrophotography. This is the comp Robert Irwin won as a kid.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `photography` `environment` `paid` `online`

**Website:** https://www.naturephotographeroftheyear.com.au
**Socials:** Instagram @ausgeo | Facebook /AustralianGeographic
**Logo source:** Australian Geographic logo + SA Museum logo

**Status:** Confirmed annual. 2026 entries closed 5 February 2026, winners announced 27 August 2026. 2027 entries likely open December 2026.

---

### Little Sydney Lives Photography Competition

**Quick-see:** WHO: Sydney kids 5-12 | WHAT: Photography of Sydney as you see it | WHEN: Annually, check site for 2026 dates | WHERE: NSW (Sydney) | COST: Free

**The pitch:** Run by City of Sydney as part of the Australian Life program. Kids capture Sydney through their own lens - phone snaps welcome, no fancy gear needed. From harbour sparkle to suburban stillness. Selected works exhibit outdoors in central Sydney.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `nsw` `regional-only` `photography` `free` `online`

**Website:** https://www.cityofsydney.nsw.gov.au/opportunities/enter-little-sydney-lives-photography-competition
**Socials:** City of Sydney on Instagram/Facebook
**Logo source:** City of Sydney logo

**Status:** Confirmed for 2026.

---

### Australian Museum Ocean Photography (Young Ocean Photographer)

**Quick-see:** WHO: Children 16 and under | WHAT: Photos of oceans, waterways and the environment | WHEN: Closes 3 May annually | WHERE: National | COST: Free

**The pitch:** Linked to the Australian Museum's Ocean Photographer of the Year program. Three winners receive OM System Tough TG-7 underwater cameras - actual gear they can use to take more photos.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `photography` `environment` `free` `online`

**Website:** Search "Australian Museum Ocean Photographer Young"
**Socials:** Australian Museum
**Logo source:** Australian Museum logo

**Status:** Confirmed for 2026. Closed 3 May 2026.

---

### Very Short Film Festival - Junior Category (VSFF)

**Quick-see:** WHO: Australian school students | WHAT: Short film under 5 minutes incorporating annual signature ("Thread" in 2026) | WHEN: Annually, festival in Hobart | WHERE: National | COST: Free

**The pitch:** Australia's coolest under-the-radar youth film festival. Selected films premiere at the VSFF Festival Weekend in Hobart, then tour nationally. The festival publishes a free step-by-step filmmaking guide. Phone footage is fine.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `film` `free` `online`

**Website:** https://veryshortfilmfestival.com.au/school-film-competition/
**Socials:** Instagram @veryshortfilmfestival
**Logo source:** VSFF logo

**Status:** Confirmed annual.

---

### Flickerfest FlickerUp (Australian National Youth Competition)

**Quick-see:** WHO: Australian secondary students and individuals 18 and under | WHAT: Short film under 35 minutes | WHEN: Annually - festival held in January at Bondi | WHERE: National | COST: Check site

**The pitch:** Australia's leading short film festival - and the Academy Award qualifying one. The youth competition (FlickerUp) screens at Bondi alongside the international films. Winning here is a proper foot in the door of the Aussie film industry.

**Tags:** `ages-13-16` `national` `film` `paid` `online`

**Website:** https://flickerfest.com.au/entries/
**Socials:** Instagram @flickerfest | Facebook /flickerfest
**Logo source:** Flickerfest logo

**Status:** Confirmed annual. Festival January each year.

---

# CATEGORY 4 - STEM, MATHS & PROBLEM-SOLVING

Maths, science, coding, engineering. The "creative thinking" category - perfect for kids who solve puzzles for fun.

---

### Australian Mathematics Competition (AMC)

**Quick-see:** WHO: Students Years 3-12 in 5 divisions, including Middle Primary (Years 3-4) and Upper Primary (Years 5-6) | WHAT: 60-minute maths problem-solving exam | WHEN: Closes early July annually | WHERE: National (and international) | COST: Paid (school entry)

**The pitch:** Australia's oldest and biggest maths comp - running since 1978. Over 250,000 entries annually. Every student gets an award (Participation, Proficiency, Distinction, High Distinction, Prize). Entered through schools. The pathway to the Australian Maths Olympiad starts here.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `maths` `stem` `paid` `school-entry`

**Website:** https://amt.edu.au/amc
**Socials:** Australian Maths Trust on Facebook
**Logo source:** Australian Maths Trust logo

**Status:** Confirmed for 2026. Paper entries close 3 July 2026.

---

### APSMO Maths Olympiad (Years 5-6)

**Quick-see:** WHO: High-achieving Years 5 and 6 students | WHAT: Four 30-minute contest papers spread across the year | WHEN: Contests run early Term 2 onwards | WHERE: National (and NZ) | COST: Paid (school entry)

**The pitch:** Designed for kids who light up at hard maths problems. Running since 1987. Four contests, 5 questions each, no calculator. Less about the answer, more about how creatively you got there.

**Tags:** `ages-10-12` `national` `maths` `stem` `paid` `school-entry`

**Website:** https://apsmo.edu.au/
**Socials:** APSMO on Facebook
**Logo source:** APSMO logo

**Status:** Confirmed annual. Also runs Maths Explorer (Years 3-4) and Maths Games (Years 5-6).

---

### Matific Maths Olympiad

**Quick-see:** WHO: Primary kids 4-13 | WHAT: Online maths competition over 5 days | WHEN: Registration June - August, competition mid-August | WHERE: National | COST: Free

**The pitch:** A 5-day-long online comp focused on participation, not excellence. Schools and kids earn stars by completing maths activities. Top schools win up to $1,500. Every student gets a certificate.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `national` `maths` `stem` `free` `online` `school-entry`

**Website:** https://www.matific.com/au/en-au/home/matific-olympiad/
**Socials:** Matific on Facebook
**Logo source:** Matific logo

**Status:** Confirmed annual. 2026 registration likely 15 June - 10 August.

---

### Big Science Competition (ASI)

**Quick-see:** WHO: Students Years 7-10 (international friendly) | WHAT: 50-minute online science questions in real-world contexts | WHEN: Annually, sitting period early-mid May | WHERE: National (and international) | COST: Paid (school entry)

**The pitch:** Run by Australian Science Innovations. 50 minutes, mixed format, problem-solving and critical thinking in real-life contexts. Pathway to the Australian Science Olympiads program.

**Tags:** `ages-13-16` `national` `science` `stem` `paid` `school-entry` `online`

**Website:** https://asi.edu.au/program/big-science-competition/
**Socials:** Australian Science Innovations on Facebook
**Logo source:** ASI logo

**Status:** Confirmed for 2026. Sitting period 4-15 May 2026.

---

### Think Science! Competition (ANSTO)

**Quick-see:** WHO: Students Years 3-10 | WHAT: Science inquiry project | WHEN: Annual, check site for current dates | WHERE: National | COST: Free

**The pitch:** Run by ANSTO (Australia's Nuclear Science and Technology Organisation). Free entry, generous prizes for winning schools. Designed to teach science inquiry skills in a fun way. Particularly strong at primary level.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `science` `stem` `free` `school-entry`

**Website:** https://www.ansto.gov.au/education/primary-school/think-science-competition
**Socials:** ANSTO on Facebook
**Logo source:** ANSTO logo

**Status:** Confirmed annual.

---

### Young ICT Explorers (YICTE)

**Quick-see:** WHO: Students Years 3-12 | WHAT: Tech project of any kind - app, robot, VR, recycling solution | WHEN: Registration closes 1 July, projects close 31 July annually | WHERE: National | COST: Free

**The pitch:** Founded by SAP and free to enter. Approximately $30,000 in cash prizes annually. Kids build real-world tech projects - from coding apps to designing tools for people with disabilities to building robots.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `coding` `stem` `free` `online`

**Website:** https://www.youngictexplorers.net.au/
**Socials:** Young ICT Explorers on Facebook
**Logo source:** YICTE logo

**Status:** Confirmed for 2026.

---

### FIRST LEGO League (Australia)

**Quick-see:** WHO: Discover (4-6), Explore (6-10), Challenge (9-16) | WHAT: Build, code and present a LEGO robot solving real-world challenges | WHEN: Season runs August-April | WHERE: National (and global) | COST: Paid (team registration)

**The pitch:** Where kids fall in love with engineering. Teams research a real-world problem, build a LEGO robot to solve missions, and present their solutions at competitions that escalate from regional to national to international.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `coding` `stem` `paid` `team` `school-entry`

**Website:** https://www.firstaustralia.org/first-lego-league
**Socials:** Instagram @firstaustralia
**Logo source:** FIRST LEGO League logo

**Status:** Confirmed for 2026-27 season.

---

### Prime Minister's Spelling Bee

**Quick-see:** WHO: Students Years 3-8 | WHAT: Online spelling competition with progressive rounds | WHEN: School round 20 July - 21 August 2026; National Final September 2026 | WHERE: National | COST: Free

**The pitch:** A national kids' spelling tradition. Three reading levels (Green Years 3-4, Orange 5-6, Red 7-8). Kids compete from school, with state finalists progressing to a national final. Past winners have met the actual Prime Minister.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `spelling` `free` `school-entry` `online`

**Website:** https://www.spelling-bee.com.au/
**Socials:** Kids News on Facebook
**Logo source:** PM's Spelling Bee logo

**Status:** Confirmed for 2026.

---

### NSW Premier's Spelling Bee

**Quick-see:** WHO: NSW students Years 3-6 (Junior and Senior categories) | WHAT: Spoken spelling competition | WHEN: School competitions Term 2-3, Regional finals Term 3, State Final October | WHERE: NSW | COST: Free

**The pitch:** The classic spoken spelling bee. Kids compete at class level, then school level, then regional level via video. Winners progress to State Finals at Penrith Performing & Visual Arts.

**Tags:** `ages-7-9` `ages-10-12` `nsw` `spelling` `free` `school-entry`

**Website:** https://artsunit.nsw.edu.au/program/nsw-premiers-spelling-bee
**Socials:** Via The Arts Unit
**Logo source:** Arts Unit logo

**Status:** Confirmed for 2026.

---

# CATEGORY 5 - PERFORMANCE, MUSIC & STAGE

Composing, performing, dancing, comedy. A perfect home for kids who love being onstage.

---

### Wakakirri National Story-Dance Festival

**Quick-see:** WHO: Australian school students K-Year 12 (entered as a school) | WHAT: 3-7 minute Story-Dance performance | WHEN: Performances in Term 3 annually | WHERE: National | COST: Paid (school entry)

**The pitch:** Australia's largest performing arts event for schools - over 10,000 students annually since 1992. Schools tell a story through dance, drama and music. The 2026 theme is "Guardians of Us." Performed in professional theatres, with regional video options. Less about technical dance, more about creative storytelling.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `performance` `dance` `paid` `school-entry` `team`

**Website:** https://www.wakakirri.com/
**Socials:** Instagram @wakakirri | Facebook /wakakirri
**Logo source:** Wakakirri logo

**Status:** Confirmed for 2026. Theme: "Guardians of Us."

---

### ACMF National Songwriting Competition

**Quick-see:** WHO: All school-aged children | WHAT: Original song | WHEN: Annually, check ACMF site | WHERE: National | COST: Free

**The pitch:** Run by the Australian Children's Music Foundation. Over $20,000 in prizes - all paid towards musical equipment or tuition (so prize money goes straight back into music). A breakthrough comp for any kid who writes songs in their bedroom.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `music` `free` `online`

**Website:** https://acmf.com.au/national-songwriting-competition/
**Socials:** Instagram @acmfaustralia
**Logo source:** ACMF logo

**Status:** Confirmed annual.

---

### Oz Schools Instrumental Championships (OSIC)

**Quick-see:** WHO: School-age piano, strings, drums and guitar students Prep-Year 12 | WHAT: Instrumental performance via state finals to national | WHEN: Qualifying period Aug-Aug, finals through year | WHERE: National | COST: Paid

**The pitch:** A national series of state championships culminating in a National Final. Kids qualify by audition, nomination, or by placing 1st-3rd in an Australian eisteddfod. Top placers go to State Finals at iconic venues.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `music` `paid`

**Website:** https://www.osic.com.au/
**Socials:** OSIC on Facebook
**Logo source:** OSIC logo

**Status:** Confirmed for 2026.

---

### ASME Young Composers Awards (state-based)

**Quick-see:** WHO: Composers 18 and under, primary or secondary school | WHAT: Original composition | WHEN: State-based, varies | WHERE: SA, QLD, others | COST: Paid (small fee)

**The pitch:** State-by-state competition for young composers. Multiple categories - solo instrument, ensemble, choir, rock/pop/EDM with or without lyrics. Winning compositions are performed live at the awards ceremony.

**Tags:** `ages-10-12` `ages-13-16` `sa` `qld` `music` `paid`

**Website:** https://www.asme.edu.au/qld/young-composers/
**Socials:** ASME on Facebook
**Logo source:** ASME logo

**Status:** Confirmed annual.

---

### Class Clowns

**Quick-see:** WHO: Aussie students Years 9-12 (14-18) | WHAT: 3-5 minute comedy act | WHEN: Heats in Term 1, National Grand Final at Melbourne Comedy Festival | WHERE: National | COST: Free

**The pitch:** Run by the Melbourne International Comedy Festival. A free workshop with a professional comedian, then perform at a real heat in front of a live audience. Past participants include Joel Creasey and Rhys Nicholson. Cash prize $1,500 for the National Grand Final winner plus $1,000 for their school.

**Tags:** `ages-13-16` `national` `comedy` `performance` `free`

**Website:** https://classclowns.com.au/the-comp
**Socials:** Class Clowns on Instagram
**Logo source:** Melbourne Comedy Festival logo

**Status:** Confirmed annual. 2026 registrations opened 20 October 2025.
**Notes for build:** Slightly above our core 4-13 audience, but sits in 13-16 tag.

---

# CATEGORY 6 - SOCIAL GOOD & ENVIRONMENT

Posters, campaigns, and creative briefs about water, sustainability, conservation.

---

### National Water Week Poster Competition

**Quick-see:** WHO: Preschool to Year 8, varies by state | WHAT: Poster on annual water theme | WHEN: Closes 9 September annually | WHERE: National - run by state water authorities | COST: Free

**The pitch:** Run by water authorities like Yarra Valley Water and Greater Western Water. The 2026 theme is "Water Heroes: Make Every Drop Count." Posters can be drawing, painting, mixed media or digital. Category winners progress to statewide finals during National Water Week (19-25 October).

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `environment` `free` `school-entry`

**Website:** https://www.nationalwaterweek.com.au
**Socials:** Yarra Valley Water on Facebook
**Logo source:** National Water Week logo

**Status:** Confirmed for 2026. Closes 9 September 2026.

---

### ResourceSmart Schools - Sustainability Through Your Own Lens

**Quick-see:** WHO: Victorian school students | WHAT: Photo + written reflection on annual sustainability theme | WHEN: Annual, check Sustainability Victoria for dates | WHERE: VIC | COST: Free

**The pitch:** Photo competition celebrating student creativity through imagery and written reflection. The 2026 theme: "Building a climate-ready future." Run by Sustainability Victoria.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `vic` `photography` `environment` `free` `school-entry`

**Website:** https://www.sustainability.vic.gov.au/about-us/what-we-do/resourcesmart-schools/resourcesmart-schools-awards-and-competitions/sustainability-through-your-own-lens-photography-competition
**Socials:** Sustainability Victoria
**Logo source:** Sustainability Victoria logo

**Status:** Confirmed annual.

---

### National Schools Poster Competition (NSPC) - SSSS

**Quick-see:** WHO: Students Years 3-12 (multiple stages) | WHAT: E-poster about an investigation | WHEN: Annually, registrations re-open 2026 | WHERE: National | COST: Free

**The pitch:** Project-based learning meets statistics, sustainability and STEM. Kids design and run their own investigation, then create a digital poster to share what they found. Cash prizes per division ($15-$40 individual). Optional second stream specifically for sustainability investigations.

**Tags:** `ages-7-9` `ages-10-12` `ages-13-16` `national` `science` `stem` `environment` `free` `online`

**Website:** https://ssapostercomp.info/
**Socials:** Statistical Society of Australia
**Logo source:** SSSS logo

**Status:** Annual. 2026 registration opening soon.

---

### NAIDOC Poster Competition (Schools editions)

**Quick-see:** WHO: National NAIDOC Poster Competition is 18+ only, but state and local school NAIDOC art competitions run for kids | WHAT: Artwork reflecting NAIDOC theme | WHEN: NAIDOC Week is 5-12 July 2026 | WHERE: Various - school and council level | COST: Free

**The pitch:** NAIDOC Week sparks dozens of school and council art competitions across Australia each year. The 2026 NAIDOC theme is "50 Years of Deadly." While the National poster comp itself is for 18+, search for your local council's NAIDOC art competition - most run kids' divisions.

**Tags:** `ages-4-6` `ages-7-9` `ages-10-12` `ages-13-16` `national` `art` `culture` `free`

**Website:** https://www.naidoc.org.au
**Socials:** NAIDOC Week on Facebook
**Logo source:** NAIDOC logo

**Status:** Annual. Search for local NAIDOC kids' comps.

---

# THE INMAG OWN BANNER (Per Ryan's instruction)

This sits separately from the competition list as a banner at the top of the page.

**Banner copy (draft):**

> **Remember - you can submit anything to theINmag, anytime. Your best stuff in print. Woah.**
> [Send IN your creation →]

(Tone notes: punchy, "woah" is on-brand, leads to the submission form. Treat as a hero band, not a competition tile.)

---

# REAL-TIME FEEDBACK FIELD (Per Ryan's instruction)

Per the brief, we want a small notes field at the bottom of the page (and ideally on each comp tile) where users can flag:
- "This comp has closed for good"
- "We've made a mistake"
- "We've missed a great competition"

**Suggested form fields (for JotForm or Shopify form):**
- Name (optional)
- Email (optional, for follow-up)
- Which competition? (dropdown of all listed comps + "I'm telling you about a new one")
- What's the issue? (text area)
- Submit

Pipe submissions into your existing JotForm setup so they land in the same inbox as kid submissions.

---

# CROSS-PROMOTIONAL OUTREACH PRIORITY LIST

For Tam's Instagram organic growth focus. Ranked by closest brand fit.

**Tier 1 - DM this week** (warmest leads, perfect alignment):
1. **Banabae** - identical brand DNA, "your kid's creation becomes real" angle, Aussie family-run
2. **Spencil** - Aussie kids' stationery, weekly staff picks they could amplify with us
3. **Eckersley's** - 60-year-old Aussie chain, 27 stores, possible mag stockist
4. **Faber-Castell Australia** - already markets to schools/teachers/parents, strong content fit
5. **Lime Tree Kids** - small Aussie family business, possible mag stockist

**Tier 2 - Email when there's bandwidth** (good fit, slower process):
6. **Micador** - 100% Aussie owned, multiple sub-brands across our age range
7. **Cartoon Chef** - small Aussie operator, regular content cadence, NSW Creative Kids voucher
8. **Camp Australia** - massive captive OSHC audience, content-hungry

**Tier 3 - Long shots / informational only** (big corporates, low partnership likelihood):
9. **Smiggle, Crayola, Staedtler** - global brands, list their comps prominently, let them notice

**The pitch template Tam can adapt for Tier 1:**

> Hi [name],
>
> I'm Tam, co-founder of theINmag - Australia's print and digital magazine made by kids, for kids. We've just launched our competitions page where we feature the best kids' creative comps in Australia, and your [Comp Name] is featured prominently.
>
> Our audience is families, teachers and homeschoolers across Australia who genuinely care about kids' creativity. Yours sounds the same, so I wanted to reach out about a possible collaboration. Two ideas:
>
> 1. Equal-value cross-promo - we feature your comp in our newsletter / IG, you feature theINmag in yours. No money exchanged, just amplifying each other's reach.
> 2. Something deeper - product features, joint comps, etc.
>
> Would love to chat if you're keen.
>
> Tam x

---

# RECOMMENDATIONS FOR BUILD

**1. Use a metaobject in Shopify, not a static page.** With 60+ comps and counting, you'll want each one as a record so you can sort, filter, mark as "closed for 2026," and add new ones without editing Liquid every time.

**2. Sort chronologically by closing date.** Build the page logic to filter out comps where the deadline has passed and show "next year" or "closed - opens again [date]."

**3. Filter UI:** Top-of-page filter chips for State, Field, Age, Cost. A South Australian parent should be able to tap "SA" + "Free" + "Art" and see only what's relevant.

**4. Grey out unconfirmed comps.** Tag each with a Status field and grey out the logo/desat the tile when it's unconfirmed.

**5. Logo grab list.** Once Tam batch-grabs the logos from the source URLs, drop them in `/Competitions/Logos/` in Drive. Estimate 45-60 mins for the lot. TinyPNG them all to under 100KB.

**6. Don't list everything.** The page works better with 50-60 strong, well-described comps than 100 thin ones. Anything flagged as "annual but 2026 unconfirmed" or council-level can go in a "More to explore" section.

**7. Honourable mentions** - smaller/sporadic comps to bundle into a single "More to explore" tile rather than full blocks:

- Black Swan Youth Prize (WA) - portraiture/heritage 12-19, $1,000 first prize
- Young Australian Art Awards (national, free)
- Doodle 4 Google (when running in AU)
- Texaco Children's Art Competition (international)
- Council-level World Environment Day Poster Comps
- Bluethumb / Eckersley's #MeMyselfAndArt rolling Instagram comp
- Local library comps (City of Yarra, Stonnington, Sydney etc.)
- Children's hospital art comps (Westmead, Royal Children's Melbourne)

The "More to explore" tile copy could be:
> *"Heaps of smaller, regional and seasonal comps run year-round. Worth checking your local council, library and Royal Show. Found a great one we should list? Let us know below."*

---

# WHAT I COULDN'T FULLY VERIFY

Honest list of things to double-check before publishing:

- 2026 dates for several biennial/sporadic comps (Wild At Art, Banabae, Crikey Magazine Photo)
- Exact entry fees for some paid comps (changes year to year)
- Whether Banabae's 2026 We Are All Artists has been announced yet
- 2026 Faber-Castell Create Your Mark theme and dates
- Whether Eckersley's runs separate Easter, mid-year, and Christmas colouring comps every year (looks like yes)
- Camp Australia Big Art Comp Term 1 2026 dates
- Council-level comps - too many to track individually

These are flags, not blockers - your audience will fill these gaps via the feedback form over time.

---

**End of master competitions database.**

Total competitions documented: 68
Categories: 6 (Art, Writing, Photography/Film, STEM, Performance, Social Good)
Brand-led comps: 14 (with cross-promo angle scoring)
Coverage: National + each major state, with regional-only comps tagged for filtering.

Companion file: `competitions-database.csv` - structured for direct import to Google Sheets.
