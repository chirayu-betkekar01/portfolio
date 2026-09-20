# Portfolio Website — Build Context

This document captures the requirements, decisions, and content behind this site so it can be recreated or rebuilt from scratch if needed.

## Original request

Build a personal portfolio website with exactly 4 main sections:
1. **What I've Built**
2. **What I've Done**
3. **What I Know**
4. **About Me** (originally "How to Reach Me" — renamed, and a short bio added above the contact links)

Source content came from a Notion page (exported as PDF: `Notion Chirayu Pdf.pdf`, dropped into the project folder). Explicit instruction: **do not copy-paste content verbatim from the Notion page** — rewrite it in original phrasing.

## Decisions made

| Question | Decision |
|---|---|
| Content source | Notion page exported to PDF, read and paraphrased |
| Tech stack | Plain HTML/CSS/JS — no framework, no build step |
| Visual style | **Light editorial / Swiss** (redesigned — see below) |
| Deployment target | Vercel (static site, zero-config) |
| Project video links (placeholders in source, no real URLs) | Omitted from the site for now |
| Missing outcome metric on 1st project (source had `[Time saved, consistency, quality, metrics]`) | Replaced with a qualitative, non-fabricated outcome line |
| Profile photo | User provides `assets/headshot.png` (PNG for the alpha channel: it is a background-free cutout); site falls back to a "CB" initials badge if the file is missing (inline `onerror` handler on the `<img>`, not a JS-attached listener — avoids a race condition where the image fails before the listener attaches) |

### Redesign note

An earlier version of this site (still in the sibling folder `Portfolio Website\`, no "2") used a warm-paper palette with large rounded cards, soft drop shadows, and a teal→sand→coral gradient. **That build was deliberately not carried over.** The layout and content are the same; everything visual was rewritten. If you are looking at the old folder, this one supersedes it.

## File structure

```
Portfolio Website 2/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── headshot.png   ← user-provided cutout, transparent background
│   ├── favicon.svg    ← miniature flywheel mark
│   ├── logo-*.png     ← 10 pre-cropped logos (see below)
│   ├── icon-*.svg     ← LinkedIn / GitHub / Gmail contact icons
│   └── <originals>    ← unprocessed source logos, kept for regeneration
├── Hubspot-Flywheel-Explained-768x494.webp  ← reference only, not used by the site
├── Notion Chirayu Pdf.pdf                   ← source content
└── CONTEXT.md         ← this file
```

No build tooling, no package.json required — deploys to Vercel by pointing it at the folder root.

## Design system

- **Palette:** off-white canvas `#fafaf8`, ink `#111111`, soft ink `#5a5a55`, hairline rules `#e2e2dc` / `#cfcfc7`. A **single** accent, vermilion `#d6412b` — defined once as `--accent`, so changing that one line re-tints the whole site.
- **Fonts:** "Inter Tight" (display headings, tight leading, negative tracking) + "Inter" (body) + "IBM Plex Mono" (eyebrows, section numerals, dates, tags), loaded via Google Fonts.
- **Shape language:** no border-radius, no drop shadows. Structure comes from 1px hairline rules and whitespace. Sections are separated by rules rather than alternating background fills; every section is numbered `01`–`04` in mono.
- **Motion:** restrained. Scroll-reveal (fade + 16px translate) via `IntersectionObserver`, smooth-scroll nav with active-link highlighting, and flat color transitions on hover. No lift, no scale, no glow.
- **Cache busting:** `css/style.css` and `js/main.js` are linked with a `?v=N` query. Bump it when
  iterating — without it a browser will happily serve a stale stylesheet, which cost a review cycle
  once (the page looked broken purely because the old CSS was cached).
- **No section leads.** Removed 2026-09-20 at the user's request. Every section header is now
  eyebrow, then `h2`, then straight into content, with nothing standing between the heading and the
  substance. The `.lead` class survives because the hero still uses it; it is the only remaining
  instance. Do not reintroduce subtitle lines under section headings.
- **No em dashes.** A standing rule from the user (2026-09-20): U+2014 appears nowhere a visitor
  reads or hears. That covers body copy, the `<title>`, the meta description, and the screen-reader
  text (`aria-label`, SVG `<desc>`) that is easy to forget because it is invisible. Use a colon, a
  period, or a recast clause depending on the job the dash was doing; a blanket swap to commas
  produces comma splices. `verify.py` asserts zero U+2014 across all four surfaces so the rule
  cannot decay. Code comments are explicitly out of scope and still contain a few.
- **Progressive enhancement:** `.reveal` elements are only hidden under a `.js` class set by an inline script in `<head>`. If JS fails to load, the page renders fully visible instead of blank.
- **Responsive:** the four outer state labels are hidden below 380px (they'd render at ~8px); hamburger nav under ~760px; flywheel stacks above its caption under 900px; timeline/contact two-column grids collapse to one column; label sizes step down under 420px.

## The flywheel (What I've Built)

A HubSpot-style GTM flywheel sits at the top of section 01. The user supplied a raster HubSpot diagram
(`Hubspot-Flywheel-Explained-768x494.webp`), but it was **rebuilt as inline SVG** instead of embedded —
so it matches the palette, stays crisp, scales responsively, and each segment is natively clickable and
keyboard-focusable. The `.webp` remains in the folder purely as the visual reference.

**Structure** (viewBox `0 0 480 480`, center `(240,240)`), outside in:

| Ring | Geometry |
|---|---|
| Outer state ring | hairline r=192; labels STRANGERS/PROSPECTS/CUSTOMERS/PROMOTERS on the diagonals at r=228 |
| Stage band (clickable) | r=150, stroke-width 64 → spans 118–182 |
| Team ring | r=88, stroke-width 48 → spans 64–112; MARKETING/SALES/SERVICE |
| Hub | r=52, "GTM" |

**Geometry** — rings are `<circle>` elements using `stroke-dasharray`, not annular-sector paths.
The stroke *is* the band and *is* the hit area, so arc length is one number.

- Stage band: C = `2π·150 = 942.478`; one third `314.159`; with a 10-unit gap →
  `stroke-dasharray="304.16 638.32"`, `stroke-dashoffset="-5"`
- Team ring: the gap must be equal in **angle**, not in length, or the spokes visibly bend.
  Gap angle `3.8197°` (matching 10 units at r=150). C = `2π·88 = 552.920` →
  `stroke-dasharray="178.44 374.48"`, `stroke-dashoffset="-2.93"`
- Both rings share rotations about `(240,240)`: **`-150°`** (Attract / Marketing, top),
  **`-30°`** (Engage / Sales, lower right), **`90°`** (Delight / Service, lower left).
  Aligning the team ring with its stage — rather than offsetting it as the original does — produces
  three continuous radial spokes from hub to outer ring, which is what makes it read as a pinwheel.

**Clockwise arrows** sit on the outer ring at the three stage boundaries. The conversion that makes
them point the right way: with θ measured clockwise from 12 o'clock, `x = cx + r·sinθ`,
`y = cy − r·cosθ`, and the clockwise tangent is `(cosθ, sinθ)`. SVG `rotate(a)` maps `+x` to
`(cos a, sin a)`, so a triangle drawn pointing along `+x` rotates by **exactly θ** — no sign flip.
They're ink, not vermilion: the accent is reserved for hover, or three static marks read as three
hovered segments.

**Labels are straight mono caps**, never `<textPath>` (which flips upside-down on the lower two
segments). Sizes are tighter than they look, because horizontal text across a curved band is
constrained by its **bbox corners**, not its height:
- Stage labels 12px at (240,90), (369.9,315), (110.1,315) — at 16px, DELIGHT's corner pushed to
  r=188.6 and broke out of the 182 band edge
- Team labels 10px at (240,152), (316.2,284), (163.8,284)
- State labels 13px at r=228 — at r=213 their inner corners reached r=181.7 and collided with the
  outer ring
- All carry `pointer-events:none` so a click on a word falls through to the segment

**Not done:** the original's notched pinwheel segment shape. It requires switching from stroked
circles to filled `<path>` sectors, which changes the hit area and would put the verified click
behavior at risk for a cosmetic gain.

**Decorative rings never steal a click** — everything outside the three `<a>` elements is wrapped in
a `.fw-static` group with `pointer-events="none"` and `aria-hidden="true"`. Paint order is
decorations first, the three `<a>` groups last.

## Logos (experience, education, certifications)

Nine logos: three companies, two schools, four certification vendors. The sources were wildly
inconsistent — different aspect ratios, some with baked-in white or navy backgrounds, two with
taglines that turn to smudges at small sizes.

**They are pre-processed, not styled into shape.** A script measures each image's real content
bounds by scanning pixels on a canvas, crops to that region, scales to 3x the display size, and
knocks out the background to transparency. The result is `assets/logo-*.png`, and the CSS does
nothing but set width/height. The unprocessed originals stay in `assets/` so any of this can be
regenerated if a size changes.

This replaced an earlier approach that cropped via a CSS viewport (`overflow:hidden` + an absolutely
positioned, offset `<img>`) and hid white backgrounds with `mix-blend-mode: multiply`. Baking it into
the assets removed all of that CSS, dropped the OpenEXA `filter: invert(...)` chain, and cut the
logo payload from ~252 KB to **99 KB**.

Notable per-logo decisions:

| Logo | Decision |
|---|---|
| UW | **full horizontal lockup, text kept** — an early pass cropped to the "W" mark and the user asked for the text back (225x49) |
| Google Cloud | **symbol + "Google Cloud" wordmark, text kept** — an early pass cropped to the symbol alone and the user asked for the text back |
| Quantiphi | **tagline cropped off** ("Solving What Matters", y 729–857 of the source) |
| Tableau | the **"+ableau" wordmark only** — including the decorative plus-cluster squeezed the wordmark to ~9px cap height |
| OpenEXA | was white-on-navy; the knockout **bakes it to ink on transparent**, so it renders monochrome by nature of the source |
| SPIT | user supplied a replacement image with the wordmark beside the crest; used at full width, text kept (225x55) |

### Headshot
`assets/headshot.png`, shown at 220px in the hero. **Background-free cutout**, which is why
`.hero-portrait` carries no border and uses `object-fit: contain`: a cutout is meant to stand on the
canvas, and `cover` would crop into its transparent margins. The border lives on
`.portrait-fallback` instead, because the `CB` badge *is* a framed badge.

**Delivered 2026-09-20.** Chirayu cut it out himself and supplied `Chirayu.png` in the repo root;
it was copied to `assets/headshot.png` unmodified. 500x500 RGBA, verified transparent by sampling
corner alpha in a canvas rather than trusting that RGBA implies a real cutout (it does not: an alpha
channel can be fully opaque). Corners read alpha 0, roughly half the pixels are opaque, and the one
opaque corner is the jacket shoulder reaching the frame edge. The original studio source
(`1720487131212.jpeg`, 800x800 on a grey gradient) is still in the root.

500px against a 220px box is 2.27x, over the 2x floor the suite enforces but under the 3x the logo
assets use. Fine at this size; if the portrait is ever enlarged, ask for a larger export.

The inline `onerror` on the `img` still falls back to the `CB` badge, and `verify.py` branches on
`HEADSHOT.exists()`, so both paths stay tested.

**Rule learned the hard way:** never crop a wordmark down to its symbol. It happened on UW, GCP and
SPIT and the user reversed all three. If a logo's text is too small at the target size, make the
logo bigger — do not drop the name.

`OIP.jpeg` in the repo root is an unused duplicate of the eco mark (left in place; it is the user's
file to remove).

**Stage → project mapping.** This lives in `index.html`, on each segment's `href` — one obvious edit
site, marked with an `EDIT ME` comment. `main.js` only performs the jump; it never decides the
destination. To remap a stage, change only the `href` (and keep its `aria-label` in sync):

| Stage | Links to | Card id |
|---|---|---|
| Attract | Automated Product Briefs & ICP Definitions | `#p-icp` |
| Engage | MEDDIC Dashboard from Sales Call Transcripts | `#p-meddic` |
| Delight | PLG GTM Workflow | `#p-plg` |

Note this is **deliberately not** the order the cards appear in, which is exactly why the mapping is
data-driven rather than positional. An unknown id falls through to normal anchor behavior rather than
throwing.

**Interaction** — hover/focus inverts the segment (hairline grey → vermilion, label → canvas white)
rather than lifting or glowing. Clicking scrolls the target card into view, moves focus to it, and
flashes a tinted background with a 3px accent bar along its top edge for ~1.6s. The flash is a color
state change, not a motion-only cue, so it still communicates under `prefers-reduced-motion`.

## Section content (as paraphrased for the site)

### Hero
- No eyebrow. "Hi, I'm Chirayu" was removed 2026-09-20; the hero opens straight on the headline.
  The name is carried by the nav wordmark (bumped to `1.3rem` at the same time) and the `<title>`.
- Headline: **"People. Tech. Data."**, set one word per line via three `<span>`s that
  `.hero h1 span` makes block-level. The middle word carries `class="accent"` for the vermilion.
  A class, not `<em>`: the color is decorative, and `<em>` would have a screen reader announce
  emphasis that is not intended. This replaced the `.hero h1 em` rule, dead since the headline
  stopped being a sentence.
- Subtext: **the user's own copy, supplied verbatim 2026-09-20, do not reword.** "These three
  pillars define how I approach every customer conversation and business challenge. I enjoy working
  at the intersection of customer engagement, technology, and data to help organizations understand
  complex problems, demonstrate value, and accelerate growth." An adapted version was written first
  and he replaced it with this. The headline above it is still adapted; the distinction is per
  block, not per section.
- CTAs: "See what I've built" → `#built`, "Say hello" → `#about`
- Portrait: 220px, **no border**, `object-fit: contain`. See the headshot note under Logos.

### 1. What I've Built (from Notion "Systems and Automations")
Three cards, each with Problem / Solution / Outcome + tech tags:

1. **Automated Product Briefs & ICP Definitions** — tags: Claude, n8n, Notion
   - Problem: Reps burned hours researching prospect companies and drafting ICP docs from scratch, with inconsistent quality across reps.
   - Solution: A chain of Claude agents in n8n — one drafts a structured product brief from a company's website, a second infers an ICP (signals + scoring guide) from it — writing clean pages straight into Notion.
   - Outcome: Multi-hour research task cut to minutes; every rep starts from the same solid baseline instead of a blank page.

2. **PLG GTM Workflow** — tags: Lead Scoring, Automation, GTM
   - Problem: In a self-serve motion, the hard part is knowing who to reach, when, and how.
   - Solution: Scores each lead on ICP fit + product usage, routes it to the right motion, hands the rep a context note to act on.
   - Outcome: Less time hunting for the right accounts, more time on outreach backed by real context.

3. **MEDDIC Dashboard from Sales Call Transcripts** — tags: Claude, HubSpot, Sales Ops
   - Problem: Reps under-document deals after calls, leaving MEDDIC fields empty and CRM data patchy.
   - Solution: Claude reads every call transcript, scores each of the six MEDDIC dimensions for confidence/completeness, writes results into HubSpot as custom fields — no manual entry.
   - Outcome: Every deal gets a consistently filled MEDDIC profile; managers get a real read on qualification quality vs. deal closure.

### 2. What I've Done (from Notion "Work Experience" + "Education")
Timeline, most recent first:

- **Chief of Staff — OpenEXA** · Apr 2026 → Present · US, Remote
  - Built email outreach automation to scale founder/VC fundraising conversations.
  - Reworked the pitch deck's messaging, talk track, and storyboarding.
  - Built an agentic workflow to demo trading strategies for crypto ETF funds.
- **Value Engineer — Ecosystems.io** · Apr 2026 → Present · US, Remote
  - Cut sales cycle time 25%, grew average deal size 2.5x through value-selling.
  - Built AI-driven automation for benchmarking reports, discovery research, business overview briefs.
  - Engineered custom ROI/TCO models with Sales, Product, Marketing, Customer Success.
- **Presales Consultant — Quantiphi** · Jan 2022 → Mar 2024 · Mumbai, India
  - Translated business requirements into technical solutions, owning scope through delivery.
  - Led GTM for greenfield accounts with packaged offerings, opening pipeline in untapped segments.
  - Closed 30+ Gen AI engagements by aligning Solutions and Marketing on positioning.

Education (no years shown — deliberately removed; institution lines are fixed copy):
- **M.S., Business Analytics** — University of Washington - Foster School of Business, Seattle Washington, US
- **B.Tech, Electronics Engineering** — University of Mumbai - Sardar Patel Institute of Technology, Mumbai, Maharashtra, India

### 3. What I Know (from Notion "Skills" + "Certifications")
- **Technical:** Data Analytics, SQL, Python, APIs, n8n, Agentic Frameworks, Cloud (AWS, GCP), HubSpot, Salesforce
- **Business:** Presales Consulting, Go-to-Market, Stakeholder Management, ROI/TCO Modeling, Storytelling

  Note: tags are CSS-uppercased site-wide, so **"n8n" renders as "N8N"** — restoring the lowercase
  stylization would mean exempting that one tag from `text-transform`. "Modeling" uses the American
  spelling to match the rest of the site.
- **Certifications:** their own full-width block below Technical/Business, as four per-vendor
  mini-sections (logo, hairline rule, then neutral outlined tags). Vendor prefixes are dropped from
  the cert names because the logo carries them. HubSpot is first, as requested.

  | Vendor | Certifications |
  |---|---|
  | HubSpot | Sales Hub · Revenue Operations |
  | AWS | Certified Cloud Practitioner · Associate Data Engineer |
  | GCP | Associate Cloud Engineer |
  | Tableau | Desktop Specialist |

  Cert tags use the **neutral** hairline border, not the vermilion `tag-accent` — with four colored
  logos in the row, six vermilion pills competed with them.

### 4. About Me (from Notion "Contact", renamed and expanded)
Section id is `#about`. Eyebrow reads `04 ABOUT`.

**Bio, two paragraphs.** The user chose flowing prose over People/Tech/Data pillar blocks, so the
hero announces the three and the bio carries the substance without repeating the framing:

1. Experience and the two disciplines: presales at Quantiphi, value engineering at Ecosystems.io,
   Chief of Staff at OpenEXA, closing on the translation theme.
2. "That mix is the point..." on holding the technical and commercial sides at once.

**Both are the user's copy as supplied 2026-09-20. Do not reword.** Longer drafts on cloud/AI and on
the UW Foster M.S. were written here and then cut by him; the site is deliberately shorter than what
was drafted. Resist re-adding that material. The technical ground it covered is already on the page
in the Skills and Certifications sections.

No `.lead` here, in common with every other section (see the Design system note). The bio line that
used to point at the contact column went with it, so nothing now introduces the links and the
self-labeling rows carry themselves. Deliberate.

At two paragraphs the columns balance well (426px of bio against 362px of links), which they did
not at four.

**Two-column layout:** bio text left, branded contact links right (`.about-grid`, collapsing to one
column under 900px). Four rows, in this order:

| Row | Href | External |
|---|---|---|
| LinkedIn | `https://www.linkedin.com/in/chirayu-betkekar/` | yes |
| Gmail | `mailto:chirayubetkekar@gmail.com` | no |
| GitHub | `https://github.com/chirayu-betkekar01` | yes |
| Tableau Public | `https://public.tableau.com/app/profile/chirayu.betkekar/vizzes` | yes |

External links carry `target="_blank" rel="noopener noreferrer"`.

**Contact icon sourcing** — fetched directly, no manual download:
- LinkedIn — Bootstrap Icons (MIT). *Not* in Simple Icons; removed there over trademark policy.
- GitHub, Gmail — Simple Icons (CC0).
- Tableau — cropped from the local `tableau.jpg` to its **plus-cluster symbol**, not the "+ableau"
  wordmark, so all four sit as square marks at 24px.

Icons are full brand color (`#0A66C2` / `#EA4335` / `#181717` / Tableau's own), stored as
`assets/icon-*.svg` plus `assets/logo-tableau-mark.png`, and referenced as `<img>`.

The rows were restyled from the original full-width treatment: the old `.contact-list a` used a
`190px 1fr` grid with `clamp(1.4rem, 3vw, 2.1rem)` display type, which is far too large for a
half-width column. Now `24px 1fr` with a mono kind label above a 1.05rem value. The animated
hairline underline on hover is unchanged.
- Two-paragraph bio above the links: the presales → value engineering → Chief of Staff arc, the
  "translation" framing (capability → a number a buyer recognizes; manual process → something that
  runs itself), and the engineering-then-M.S.-Business-Analytics background. Paraphrased from
  existing hero/experience content — no new facts invented.
- Email: chirayubetkekar@gmail.com (mailto: link)
- LinkedIn: linkedin.com/in/chirayu-betkekar (opens in new tab)
- Line: "Got a GTM problem that needs a system? Let's talk." **Removed 2026-09-20** along with every
  other section lead; see the Design system note.

### Flywheel caption (section 01)
Eyebrow "Why a flywheel, not a funnel". **Copy is the user's own, supplied verbatim (2026-09-19) —
do not reword it.** It is split across two `<p>` elements at a sentence boundary purely for layout;
the wording is unchanged. First-person: funnels pour leads in the top and restart from zero each
quarter, while flywheels compound because happy customers become the referrals and proof that bring
in the next one. Closes on building systems that keep sales, marketing, and success aligned around
that effect, and on hunting unnecessary friction while leaving room for the judgment sales requires.

## Verification performed

Tested with a headless-browser (Playwright) script driving a local Python `http.server` — 111 checks, all passing:
- All 4 section headings and content counts (3 cards, 3 timeline entries, 2 education entries, 12 skill tags).
- Each flywheel segment maps to the right card, scrolls it into view, flashes it, and moves focus; the flash clears afterward.
- Segments are keyboard focusable and activate on Enter.
- **Every ring label's bbox corners measured against its own band's radii** — stage labels within
  118–182, team labels within 64–112, state labels clear of r=192. This is what caught both label
  collisions below.
- **Decorative rings assert as non-interactive** — nothing in `.fw-static` has pointer events or
  sits inside an `<a>`, so it can't steal a click from a stage.
- Company logos load, render at a consistent 24–28px optical height, and OpenEXA is not a dark tile.
- "About Me" heading and nav label present; no stale `#reach` links remain.
- Outer state labels are hidden at 375px and 340px.
- About: four contact rows in the right order, each href exact, external links carry `rel="noopener"`,
  all four icons load at a uniform 24px, two columns at desktop and one column at 375/340px.
- Nav click → smooth scroll → active-link highlight.
- Mailto and LinkedIn `href` values.
- 375px **and** 340px: no horizontal overflow, hamburger opens/closes, flywheel still works.
- `prefers-reduced-motion`: content visible, flywheel still navigates.
- No console or page errors; the only 404 is the intentionally absent `headshot.jpg`.

Bugs found and fixed during verification:
- **Blank page without JS.** `.reveal` started at `opacity:0` and only became visible via `IntersectionObserver`, so a JS failure would have left most of the site invisible. Now scoped to a `.js` class set by an inline script in `<head>`.
- **"DELIGHT" overhung the band** at 15px where the ring curves away; reduced to 13px.
- **Double hairline** between the flywheel block and the card grid; removed the redundant one.
- **Flash indicator crowded the flush-left first card** as a left bar; moved to the top edge.

Found in the second round (About Me / logos / flywheel rebuild):
- **Stage labels overflowed the band at 16px** — DELIGHT's bbox corner reached r=188.6 against a
  182 edge. Dropped to 12px.
- **State labels collided with the outer ring** at r=213 (inner corners reached r=181.7). Moved to r=228.
- Arrow directions were verified by rendering magnified crops of each arrowhead, not by eye at
  normal size — all three confirmed clockwise.

Found in the third round (education / certifications):
- **The cert grid overflowed on mobile** — it was a fixed `repeat(4, 1fr)` with no collapse. Now two
  columns under 900px, one under 760px.
- **`.cert-logo` never received the container rule**, so cert logos were not being clipped at all.
- Tableau's wordmark rendered at ~9px cap height beside HubSpot's ~20px; cropping out the decorative
  plus-cluster fixed the imbalance. The cert logo row is a fixed 34px grid track so the hairline
  rules stay aligned even though logo heights differ.

**A phantom bug worth not re-chasing:** a duplicate of the SPIT crest appears at the far right of
the education row in Playwright screenshots taken with `clip` or `locator.screenshot()` at
`device_scale_factor=2`. It is **not in the page** — `elementsFromPoint` finds nothing there, hiding
the source image doesn't remove it, and a plain full-viewport capture of the same region is empty.
It is a headless-Chromium rasterization artifact of the clipped-capture path. Diagnosing it as a
`mix-blend-mode` problem sent me through three wrong fixes; verify against an unclipped capture
before believing a visual artifact is real.

Four testing gotchas worth remembering:
- `inner_text()` returns **CSS-transformed** text, so an uppercased nav reads as "ABOUT ME". Use
  `text_content()` when asserting on source casing.
- An arc's bounding-box center is the hollow hub, so `locator.click()` misses the band entirely — click computed band coordinates instead.
- `scroll-behavior: smooth` makes Playwright's screenshot scrolling animate, producing torn/blank captures. Screenshot in a `reduced_motion="reduce"` context.

## Open items for next time

- A **light-background OpenEXA logo** would let it render in color (it is monochrome by nature of the white-on-navy source).
- Quantiphi's "Solving What Matters" tagline is still cropped off — a tagline rather than the company name, and unreadable at 24px.

- Real video-walkthrough links for the 3 "What I've Built" projects, if/when available.
- Git init + connect to Vercel for actual deployment (not yet done). **Before deploying, deal with
  the stray files in the repo root** — `Notion Chirayu Pdf.pdf`, `Hubspot-Flywheel-Explained-768x494.webp`,
  `OIP.jpeg`, `Chirayu.png` and `1720487131212.jpeg` are working source material, not site assets, and a static host will serve them at
  a public URL. Either move them out of the deploy root or add a `.vercelignore`.
- Decide whether to retire the old `Portfolio Website\` folder now that this one supersedes it.

### Closed 2026-09-20
- Hero headline replaced with the stacked "People. Tech. Data."; hero subtext rewritten.
- About bio rewritten to three paragraphs covering presales, value engineering, cloud, AI, experience.
- Portrait enlarged 96px to 220px, border moved to the fallback badge, `object-fit` to `contain`.
- All 13 rendered em dashes removed and a regression check added. See the Design system note.

### Closed 2026-09-19
- Flywheel caption replaced with the user's own copy (see above) — verbatim, do not reword.
- `04 CONTACT` eyebrow -> `04 ABOUT`, now the section carries a bio.
- `n8n` no longer uppercases. The site-wide uppercasing on `.tag` is deliberate; the new
  `.tag-verbatim` class opts a single tag out of it, for brands whose own casing is part of the
  name. Add the class rather than editing the shared `.tag` rule.
