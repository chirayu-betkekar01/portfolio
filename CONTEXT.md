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
| Visual style | **"Refined Light"** since 2026-11-05: same palette and type as the earlier editorial/Swiss build, restructured into rounded panels with a flowchart per project (see below) |
| Deployment target | Vercel (static site, zero-config) |
| Project video links (placeholders in source, no real URLs) | Omitted from the site for now |
| Missing outcome metric on 1st project (source had `[Time saved, consistency, quality, metrics]`) | Replaced with a qualitative, non-fabricated outcome line |
| Profile photo | User provides `assets/headshot.png` (PNG for the alpha channel: it is a background-free cutout); site falls back to a "CB" initials badge if the file is missing (inline `onerror` handler on the `<img>`, not a JS-attached listener — avoids a race condition where the image fails before the listener attaches) |

### Redesign note

An earlier version of this site (still in the sibling folder `Portfolio Website\`, no "2") used a warm-paper palette with large rounded cards, soft drop shadows, and a teal→sand→coral gradient. **That build was deliberately not carried over.** The layout and content are the same; everything visual was rewritten. If you are looking at the old folder, this one supersedes it.

### Redesign 2026-11-05: "Refined Light"

The user asked for a more modern look and "a more visual way to look at my projects", pointing at a
dark product-page flowchart (icon, bold title, grey subtitle, ↓, highlighted middle card, split into
two cards). Three directions were mocked up on a design canvas: A "Refined Light", B "Dark Flow" (closest
to the reference), C "Node Canvas" (n8n-style horizontal pipelines). **The user picked A.**

What changed, what did not:
- **Content and copy: unchanged.** Every sentence on the old site is still there, verbatim blocks included.
- **Palette and fonts: unchanged.** Same canvas, ink, soft ink and single vermilion accent; same
  Inter Tight / Inter / IBM Plex Mono. New surface tokens (`--surface`, `--surface-2`, `--surface-3`)
  carry the panels.
- **Structure: new.** Floating pill nav, a bento hero (headline card, portrait card, "Now" card),
  everything in rounded white panels.
- **No black fills (user rule, 2026-11-05).** The first build used solid ink (`#111`) for the primary
  buttons, the "Now" card, the Gmail contact row, the flywheel hub and each flowchart's key step. The
  user asked for the black fill to go "everywhere, even in the flowcharts". Now: primary buttons and
  the skip link are vermilion (white text 4.5:1), the Now card and Gmail row are plain white panels,
  the hub is an outlined circle with ink "GTM", and the key step is accent-tinted with an accent
  border. Ink stays for text, outlines and the small flywheel arrowheads only. Don't reintroduce
  ink-filled surfaces.
- **Projects: new flowcharts.** Each project is a two-column panel: Problem/Solution/Outcome on the
  left, a vertical "How it works" flowchart on the right. The step that does the work is
  `.node-key`: accent tint, 1.5px accent border, accent icon. Flowchart node labels ("Company website", "Hours to
  minutes", the six MEDDIC dimension names) are short phrases condensed from each card's own
  Solution/Outcome copy; nothing new is claimed.
- **The flywheel stays.** The user was explicit when two mockups swapped it for stage cards: "The
  Flywheel is important." Geometry, labels, links and the `.fw-static` click-through are untouched;
  only colors changed (neutral segments, outlined hub with ink "GTM"). The old "Select a stage →"
  hint first became `.stage-links` (text links that jumped like the segments); later the same day the
  segments became a stage **filter** with a filter bar, and the hint came back as one line (see
  "Stage → project mapping").

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

- **Palette ("Clay & Sand", since 2026-11-08):** sand canvas `#faf6ef`, white panels, inset sand `#f0e8da`, warm ink `#221a12`, soft ink `#5d5448`, rules `#e7dfd0` / `#d2c7b4`, idle flywheel band `--band` `#ebe3d5`. A **single** accent, terracotta `#a94c25`, defined once as `--accent`; its tints are `color-mix()`es of it. The favicon carries the same colors. Chosen from a seven-theme lab (current vermilion, Cobalt, Forest, Teal, Plum, Clay & Sand, Rose), all light; dark themes were ruled out by the user. Previous palette: canvas `#fafaf8`, ink `#111111`, vermilion `#d6412b`.
- **Fonts:** "Inter Tight" (display headings, tight leading, negative tracking) + "Inter" (body) + "IBM Plex Mono" (eyebrows, section numerals, dates, tags), loaded via Google Fonts.
- **Shape language (since 2026-11-05):** rounded white panels with a 1px hairline border on the
  off-white canvas, radii from tokens (`--r-xl` 28px hero/flywheel/projects, `--r-lg` 24px, `--r-md`
  18px nodes and tiles), pills at 999px. Still **no drop shadows**. Every section eyebrow is numbered
  `01`–`04` in mono behind a small accent dot. (Before the redesign: no radius at all, structure from
  hairline rules only.)
- **Accent contrast:** `#a94c25` is 5.2:1 on the canvas and white on it is 5.6:1 (vermilion was 4.3 and 4.5).
  Small text still stays in ink. The accent is for fills, icons, the large "Tech." and white-on-accent labels.
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
- **Responsive:** under 900px the bento hero, flywheel block, project panels and about grid stack to
  one column and certs go 2-up; under 760px the pill nav collapses to a hamburger dropdown (the "Say
  hello" button hides; About Me is in the menu) and roles/education/skills go single column; certs go
  1-up under 560px; under 420px the two agent chips in project 01 stack with a downward arrow; the
  four outer state labels are hidden below 380px (they'd render at ~8px).

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

Ten logos: four companies, two schools, four certification vendors. The sources were wildly
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
| Database Republic | grey two-line wordmark on white (`assets/dbrepublic.png`, 364x118, gitignored original). Cropped to content (317x81) and white knocked out to transparency **in headless Chromium** (no image library on this machine), **whole lockup kept, dashed rule included**. Shown at 172x44: only 1.84x, because the source is small. A larger logo file would sharpen it |

### Headshot
`assets/headshot.png`, shown at **340px** standing on an accent-tinted card in the bento hero
(since 2026-11-05; 220px before). **Background-free cutout**, which is why it uses
`object-fit: contain`: `cover` would crop into its transparent margins. The `CB` fallback badge now
sits inside the same tinted card, so it no longer needs its own border.

**Delivered 2026-09-20.** Chirayu cut it out himself and supplied `Chirayu.png` in the repo root;
it was copied to `assets/headshot.png` unmodified. 500x500 RGBA, verified transparent by sampling
corner alpha in a canvas rather than trusting that RGBA implies a real cutout (it does not: an alpha
channel can be fully opaque). Corners read alpha 0, roughly half the pixels are opaque, and the one
opaque corner is the jacket shoulder reaching the frame edge. The original studio source
(`1720487131212.jpeg`, 800x800 on a grey gradient) is still in the root.

500px against the 340px box is **1.47x, under the 2x floor**. At 250px (which held 2x) the head sat
small in a large empty card, so the size won and the trade-off is recorded here: sharp on standard
screens, slightly soft on retina. **Open item: ask for a 700px+ export of the same cutout**; dropping
it in needs no CSS change.

The inline `onerror` on the `img` still falls back to the `CB` badge, and `verify.py` branches on
`HEADSHOT.exists()`, so both paths stay tested.

**Rule learned the hard way:** never crop a wordmark down to its symbol. It happened on UW, GCP and
SPIT and the user reversed all three. If a logo's text is too small at the target size, make the
logo bigger — do not drop the name.

`OIP.jpeg` in the repo root is an unused duplicate of the eco mark (left in place; it is the user's
file to remove).

**Stage → project mapping: a filter, since 2026-11-05.** The user asked for the stages to *filter* the
projects, with a way back to all of them. Which stage a project belongs to lives on the card itself,
as `data-stage` on each `article.project` — that is the one edit site (the `EDIT ME` comment above
the segments points to it). `main.js` only reads it, so adding a project to a stage needs no JS change.

| Stage | Projects (`data-stage`) | Card ids |
|---|---|---|
| Attract | Automated Product Briefs & ICP Definitions; SQL-MQL Jury | `#p-icp`, `#p-jury` |
| Engage | Call-to-CRM Agent Pipeline; CaseCraft; RFP Bid Qualification; MEDDIC Dashboard from Sales Call Transcripts | `#p-calltocrm`, `#p-casecraft`, `#p-rfp`, `#p-meddic` |
| Delight | PLG GTM Workflow | `#p-plg` |

**Interaction:**
- Clicking a segment (`.fw-link[data-stage]`) hides every card of another stage (`hidden` attribute;
  `.project[hidden]` needs its own `display: none` because `.project` sets `display: grid`), keeps
  that segment red (`.is-active`), scrolls the filter bar into view and moves focus to the matching
  filter button, so keyboard users are one Tab from the cards. Clicking the active segment again
  shows all projects.
- The **filter bar** (`#projectFilter`, between the flywheel panel and the cards) has buttons for
  All projects, Attract, Engage and Delight, each with a count that `main.js` computes from
  `data-stage`. Buttons are `aria-pressed` toggles. **"All projects" is the way back.** A polite live
  region (`#filterStatus`) announces "Showing 2 Attract projects" and so on.
- Hover and focus still invert a segment (neutral grey → vermilion, label → white). No lift or glow.
- **Without JS** the bar is hidden (`.js` gate, like `.reveal`), all cards show, and each segment's
  `href` (the stage's first card: `#p-icp`, `#p-calltocrm`, `#p-plg`) still works as a plain jump.

**Replaced:** the earlier jump-and-flash behavior (scroll to one card, 2px accent outline for 1.6s)
and the `.stage-links` rows under the caption, one per project. Filtering covers both, so the
caption now ends with a one-line hint: "Select a stage to filter the projects below". Card numbers
(01–04) stay fixed when filtered.

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
Seven cards, each with Problem / Solution / Outcome + tech tags and a "How it works" flowchart. Order
on the page: ICP (01, Attract), SQL-MQL Jury (02, Attract), PLG (03, Delight), Call-to-CRM (04, Engage;
added 2026-11-14), CaseCraft (05, Engage; added 2026-11-07), RFP Bid Qualification (06, Engage; added
2026-11-10), MEDDIC (07, Engage). **The Engage order was set by the user on 2026-11-15:** Call-to-CRM,
CaseCraft, RFP, MEDDIC. Keep it. The list below is numbered by when each card was added, not by page order.
The SQL-MQL Jury card was added 2026-11-05 and is described at the end of this list.

1. **Automated Product Briefs & ICP Definitions** — tags: Claude Skills, Flask, Notion
   (repo `icp-product-workstation`)
   - Problem: Reps burned hours researching prospect companies and drafting ICP docs from scratch, with inconsistent quality across reps.
   - Solution (**corrected 2026-11-05**): two Claude Skills behind a Flask workstation. One turns a
     company's website into a product brief, the next turns that brief into an ICP with buyer
     personas, and each draft is reviewed and edited (by hand or with AI) before it's pushed to Notion.
     The card used to say "a chain of Claude agents in n8n" with an ICP of "buying signals and a
     scoring guide", carried over from the Notion source. The user confirmed the repo is right: it's
     Claude Skills with Flask, no n8n. Flowchart: Company website → Two Claude Skills (key step) →
     Review in the Flask workstation → Notion pages (Product Briefs and ICP Summaries) + Hours to minutes.
   - Outcome: Multi-hour research task cut to minutes; every rep starts from the same solid baseline instead of a blank page.

2. **PLG GTM Workflow** — tags: Lead Scoring, Automation, GTM
   - Problem: In a self-serve motion, the hard part is knowing who to reach, when, and how.
   - Solution: Scores each lead on ICP fit + product usage, routes it to the right motion, hands the rep a context note to act on.
   - Outcome: Less time hunting for the right accounts, more time on outreach backed by real context.

3. **MEDDIC Dashboard from Sales Call Transcripts** — tags: Claude, HubSpot, Sales Ops
   - Problem: Reps under-document deals after calls, leaving MEDDIC fields empty and CRM data patchy.
   - Solution: Claude reads every call transcript, scores each of the six MEDDIC dimensions for confidence/completeness, writes results into HubSpot as custom fields — no manual entry.
   - Outcome: Every deal gets a consistently filled MEDDIC profile; managers get a real read on qualification quality vs. deal closure.

4. **SQL-MQL Jury** (`#p-jury`, Attract) — tags: Claude, HubSpot, Python. Title shortened from
   "SQL-MQL Jury: Why Sales Rejects MQLs" and Problem/Solution/Outcome trimmed to match the other
   cards' length, both at the user's request (2026-11-05).
   Source: the user's own project at `Desktop\SQL-MQL Jury` (Python CLI + small Flask UI). Copy was
   drafted from reading its README and code (`analyze/adjudicate.py`, `agent_tools.py`,
   `synthesize.py`, `stats.py`, `redact.py`), and the user asked for it to be added directly.
   - What the code does: extracts the MQL cohort and rejection records from HubSpot, redacts PII from
     rep notes, computes rejection rates by source and rep (z-score outliers) and time-to-rejection,
     then a Claude agent (via OpenRouter, max 3 tool calls per case) labels each rejection as
     `mql_definition_issue`, `sales_inconsistency`, `process_timing_issue` or `legitimate_rejection`,
     calling `get_engagement_timeline`, `get_deal_notes` or `get_company_firmographics` when unsure. A
     second Claude call writes the executive summary and recommendations.
   - **No metrics on the card, deliberately.** Every run so far is on a seeded HubSpot test portal
     (`scripts/seed_dev_data.py` plants storylines), so its numbers (e.g. 62.5% paid-search rejection)
     are demo data. The Outcome describes what the tool delivers, not results. Add real numbers only
     if the user supplies them from a production run.

5. **CaseCraft** (`#p-casecraft`, Engage, added 2026-11-07) — tags: Claude, React, FastAPI.
   Links: **Live demo** `https://case-craft-six.vercel.app/` (user-supplied; confirmed live, `/api/library`
   serves all 12 drivers) and GitHub `chirayu-betkekar01/CaseCraft`. No walkthrough video exists. The live
   demo button reuses the accent-tinted `.project-link-video` style with a line-drawn external-link icon
   (`.link-icon-line`).
   Source: local folder `Desktop\GTM Business Case Project` (git remote is the CaseCraft repo, in sync).
   Copy drafted from its README, docs and `value_drivers.yaml`; the user asked for it to be added.
   - What it does: a rep enters deal basics and picks from 12 value drivers (Cost Savings, Productivity
     Gains, Risk Reduction; built around a security platform, vendor-neutral as "the Platform"). A
     deterministic Python calculator registry recomputes ROI, payback, TCO and a cash-flow curve on
     every input change with no LLM. Claude (Opus via OpenRouter) is used only to read a pasted or
     uploaded call transcript and suggest drivers with the verbatim supporting line. One-page PDF export.
   - "Minutes instead of days" in the Outcome is the README's own claim ("CaseCraft compresses that to
     minutes"). No other figures; all numeric defaults in the app are illustrative.
   - Not built yet (per README): company lookup and an LLM-written narrative.
   - Messaging (rewritten 2026-11-07, user-directed): seller-first framing around the champion and the CFO.
     The AI is positioned as reading transcript context to speed up the build, and the card deliberately does
     not sell "AI makes the numbers" or "no AI in the math". Templating is a talking point: one reusable
     library of 12 drivers (the repo's `docs/value-driver-library.md` calls it "a structured, reusable data
     asset") serves every customer, with only the inputs swapped. Key flowchart node: "Reusable case template".

6. **RFP Bid Qualification** (`#p-rfp`, Engage, added 2026-11-10) — tags: Claude, Next.js. (Slack removed from the
   tag, Solution text and flowchart on 2026-11-15 at the user's request; don't add it back.)
   Links: **Live demo** `https://rfp-bid-qualification.vercel.app/` (confirmed live; serves the
   "Tallyhouse RFP Review" demo sign-in, which lists every demo account so a visitor can click straight
   in) and GitHub `chirayu-betkekar01/rfp-bid-qualification` (public). No walkthrough video yet.
   Source: local folder `Desktop\RFP Project` (v1, deployed 2026-11-10). Copy drafted from its git
   history and `web/README.md`. Its own `CLAUDE.md` is the **original week-by-week plan** (draft answers,
   Checkpoints A-D, planted errors, Word/Excel export) and is out of date: v1 pivoted to bid
   qualification, so don't take claims from it without checking the code.
   - What v1 does: a Python pipeline parses the RFP PDF with section/page refs; Claude (Sonnet via
     OpenRouter, zero-retention routing) extracts one line item per obligation with a Mandatory / Good to
     Have / Optional priority, reads the scoring facts (budget, incumbent, category, users) with quotes,
     and suggests Yes/No/Maybe per item from the 97-row answer library, citing library IDs (stale and
     unprofiled sources flagged). In the Next.js review app (Postgres on Supabase) the proposal manager
     fixes the list and assigns owners, then sends out; experts get a personal link, see the
     suggestion (never pre-selected), answer with a note on No/Maybe, can forward. `lib/scoring.ts`
     scores 100 points from `config/vendor.yaml` (bid at 65+); out-of-category is an automatic hard
     fail, a mandatory No on a known gap (FedRAMP, on-prem, HIPAA BAA, EU residency, CJIS) is a
     *possible* hard fail the manager confirms. The manager records bid/no-bid with a written reason.
   - The vendor (Tallyhouse CRM) is fictional; the card doesn't name it.
   - Outcome metric: "96% of the requirements in a 94-row answer key" is the Tulsa eval run in
     `eval/runs.csv` (recall 0.9574, extract prompt v4, 90 of 94 key rows matched). Tulsa RFP 26-901 is
     a real public RFP; the answer key is the user's own. No time-saved figures: the drafting-time
     baseline is still an open decision in that repo.

7. **Call-to-CRM Agent Pipeline** (`#p-calltocrm`, Engage, added 2026-11-14) — tags: Claude, Fathom, HubSpot.
   Links: "Watch walkthrough" (Google Drive …/1LnM_1xb4E-TdySxOHEy3QspwrKayqj1M, added 2026-11-15) and
   GitHub `chirayu-betkekar01/call-to-crm` (public).
   Source: local folder `Desktop\Transcript People Agent` (git remote is the call-to-crm repo). Copy drafted
   from its README and code; the user asked for it to be added in the same format as the other projects.
   - What it does: three independent agents that share a `core/` and pass a JSON handoff file. Agent 1
     (attendee reconciler) reads a Fathom or .txt transcript and works out everyone involved: speakers,
     silent invitees, people who joined uninvited, and people only mentioned. Nicknames are merged, and bots
     and fictional names are dropped. Agent 2 tags buyer-side people Decision Maker / Champion / Blocker
     from behavior on the call, and code keeps a role only if its evidence quote is verbatim in the
     transcript. Agent 3 infers the buyer's domain from invitee emails, fills missing contact fields
     through a swappable provider (mock by default, Hunter on its free plan, Apollo needs a paid plan),
     then syncs to HubSpot: dry run by default, fills only empty fields, never creates deals, finds the
     deal through HubSpot associations, and applies contact-to-deal buying-role labels.
   - **No metrics on the card, deliberately.** Verified end to end on a seeded HubSpot test portal with a
     sample transcript and mock enrichment data, so there are no real results to quote. Same rule as
     SQL-MQL Jury: add numbers only if the user supplies them from a real run.
   - Flowchart: transcript, then Agent 1, then Agent 2 as the key step (role chips), then Agent 3, then a
     split into "Labeled buying group" and "Traceable roles". All node labels come from the card's copy.

### 2. What I've Done (from Notion "Work Experience" + "Education")
Timeline, most recent first. Each role's heading is the **job title only**: the company name that
used to follow it (`.role-org`) was removed 2026-11-05 at the user's request, since the logo above
the dates already names the company (and its alt text carries the name for screen readers).

- **AI Consultant — Database Republic** · Aug 2026 → Present · US, Remote (added 2026-11-05;
  **bullets are the user's own copy, verbatim**. Supplied as "Aug. 2026 – Current", normalized to the
  site's "Aug 2026 → Present" date-pill format. Also listed first in the hero "Now" card.)
  - Architected event-driven automation pipelines in n8n, integrating client systems through REST APIs and webhooks with custom Python steps, cutting admin effort from 3 hours to 10 minutes.
  - Embedded LLM APIs (OpenAI, Claude) to draft personalized follow-ups, lifting inbound conversion.
- **Chief of Staff — OpenEXA** · Apr 2026 → Jul 2026 · US, Remote (end date supplied 2026-11-05)
  - Built email outreach automation to scale founder/VC fundraising conversations.
  - Reworked the pitch deck's messaging, talk track, and storyboarding.
  - Built an agentic workflow to demo trading strategies for crypto ETF funds.
- **Value Engineer — Ecosystems.io** · Jul 2025 → Apr 2026 · US, Remote (dates corrected 2026-11-05; previously shown as Apr 2026 → Present)
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

  Note: since 2026-11-05 skills render as sentence-case `.pill`s, not uppercase `.tag`s, so "n8n"
  keeps its casing naturally. Project tech tags are still uppercase `.tag`s; no project tag currently
  needs `.tag-verbatim` (n8n left the ICP card when it was corrected), but the class stays for the next
  brand whose casing matters. "Modeling" uses the American spelling to match the rest of the site.
- **Certifications:** their own full-width panel below Technical/Business, as four per-vendor
  tiles (logo in a fixed 52px row, then the cert names as plain text). Vendor prefixes are dropped from
  the cert names because the logo carries them. HubSpot is first, as requested.

  | Vendor | Certifications |
  |---|---|
  | HubSpot | Sales Hub · Revenue Operations |
  | AWS | Certified Cloud Practitioner · Associate Data Engineer |
  | GCP | Associate Cloud Engineer |
  | Tableau | Desktop Specialist |

  Cert names stay **neutral** (no vermilion): with four colored logos in the row, accent-colored
  names competed with them.

### 4. About Me (from Notion "Contact", renamed and expanded)
Section id is `#about`. Eyebrow reads `04 ABOUT`.

**Bio, two paragraphs.** The user chose flowing prose over People/Tech/Data pillar blocks, so the
hero announces the three and the bio carries the substance without repeating the framing:

1. Experience and the two disciplines: presales at Quantiphi, value engineering at Ecosystems.io,
   Chief of Staff at OpenEXA, closing on the translation theme.
2. "That mix is the point..." on holding the technical and commercial sides at once.

**Both are the user's copy as supplied 2026-09-20. Do not reword.** One approved revision since: on
2026-11-05 paragraph 1 was updated for Database Republic (option "B" of two drafts, chosen by the
user): the role list now ends "Chief of Staff work at OpenEXA, and now AI consulting at Database
Republic", and a sentence was added after the value-engineering line: "Consulting is where I build it
end to end: automation pipelines that connect a client's systems, with LLMs drafting the follow-ups."
Paragraph 2 is untouched. The current text is again verbatim, approved copy. Longer drafts on cloud/AI and on
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

- ~~Real video-walkthrough links~~ **Done 2026-11-05.** Each card with a public repo now has a
  `.project-links` row directly under its `h3`: "Watch walkthrough" (Google Drive video, accent-tinted)
  and "GitHub" (the repo). Links were taken from each repo's own README and confirmed to load without
  a login. All open in a new tab with `rel="noopener noreferrer"` and a descriptive `aria-label`.

  | Card | Video | Repo |
  |---|---|---|
  | ICP | drive …/19kLitw8x6sduKSRzboefs_cK5NU4p4Pf | `chirayu-betkekar01/icp-product-workstation` |
  | PLG | drive …/1flAnsCRhlrGUrxmgMVUbhgaoRUfLEE5b | `chirayu-betkekar01/PLG-GTM-Demo` |
  | MEDDIC | drive …/1yymJQFpajdgqF2F32QFcTpcXSzRJDn3z | `chirayu-betkekar01/MEDDIC-Workflow` |
  | SQL-MQL Jury | none | not on GitHub (its local folder has a `.env` with live keys; check `.gitignore` before ever publishing it) |
  | CaseCraft | none (has a **Live demo** link instead: case-craft-six.vercel.app) | `chirayu-betkekar01/CaseCraft` |
  | RFP Bid Qualification | none (**Live demo**: rfp-bid-qualification.vercel.app) | `chirayu-betkekar01/rfp-bid-qualification` |
  | Call-to-CRM Agent Pipeline | drive …/1LnM_1xb4E-TdySxOHEy3QspwrKayqj1M | `chirayu-betkekar01/call-to-crm` |

- ~~ICP card said n8n~~ **Resolved 2026-11-05:** the user confirmed it's Claude Skills with Flask; the
  card's tags, Solution and flowchart were corrected to match the repo (see What I've Built, item 1).
- Git init + connect to Vercel for actual deployment (not yet done). **Before deploying, deal with
  the stray files in the repo root** — `Notion Chirayu Pdf.pdf`, `Hubspot-Flywheel-Explained-768x494.webp`,
  `OIP.jpeg`, `Chirayu.png` and `1720487131212.jpeg` are working source material, not site assets, and a static host will serve them at
  a public URL. Either move them out of the deploy root or add a `.vercelignore`.
- Decide whether to retire the old `Portfolio Website\` folder now that this one supersedes it.
- A **700px+ export of the headshot cutout** (see Headshot: 340px display is under 2x).
- `verify.py` is referenced throughout this file but is not in the repo. The 2026-11-05 redesign was
  checked with an equivalent 46-check Playwright run (all passing) that also lives outside the repo.

### Closed 2026-11-15
- Engage cards reordered at the user's request to Call-to-CRM (04), CaseCraft (05), RFP (06), MEDDIC (07).
  The Engage flywheel link's no-JS href now points to `#p-calltocrm`.
- Call-to-CRM card got its "Watch walkthrough" link (Google Drive, confirmed public).
- Slack removed from the RFP card (tag, Solution text, flowchart node).

### Closed 2026-11-14
- Call-to-CRM Agent Pipeline added as project 07 (Engage) with a GitHub link and a flowchart. Engage now
  has four projects, so the filter bar reads Engage 4 and All projects 7. HTML only, so no cache-bust
  (still `?v=15`). Checked with Playwright: zero U+2014 in the card, filter counts, Engage filter, link
  target, no page errors, and desktop and 390px screenshots.

### Closed 2026-11-10
- RFP Bid Qualification added as project 06 (Engage) with Live demo + GitHub links and a flowchart.
  Engage now has three projects, so the filter bar reads Engage 3 and All projects 6. HTML only, so
  no cache-bust (still `?v=15`).

### Closed 2026-11-08
- Palette switched to "Clay & Sand" (user picked it from a theme lab of light-only options). Tokens on
  `:root`, the `.fw-seg` idle stroke moved to a new `--band` token, the button hover fallback and the
  favicon updated. Layout and copy unchanged. Cache-bust `?v=15`.

### Closed 2026-11-07
- CaseCraft added as project 05 (Engage) with Live demo + GitHub links and a flowchart. Engage now
  has two projects, so the filter bar reads Engage 2 and All projects 5. Cache-bust `?v=14`.
- Removed the "GTM operator" chip from the top-left of the hero portrait card (user request), along
  with its `.chip` CSS. The portrait card is now just the tinted background and the headshot. The
  phrase still appears where the user wrote it, in the flywheel caption. Cache-bust `?v=13`.

### Closed 2026-11-05
- Database Republic (AI Consultant, Aug 2026 → Present) added as the newest role and to the hero
  "Now" card. Cache-bust `?v=7`. The About bio is the user's verbatim copy and does not mention this
  role; changing that is the user's call.
- Dates corrected: Ecosystems.io Jul 2025 → Apr 2026, OpenEXA Apr 2026 → Jul 2026. Both left the
  "Now" card, which now lists Database Republic only.
- About bio paragraph 1 revised to include Database Republic (user approved draft "B"; see About Me).
- "Refined Light" redesign shipped to the working tree (see Redesign 2026-11-05). Cache-bust `?v=6`.
- Flowchart added to all three projects; flywheel kept, restyled, plus `.stage-links` text twins.
- Verified: content counts, all images load, zero U+2014 in text/title/meta/aria/desc, every flywheel
  label inside its band, segment and stage-link jumps (scroll, focus, flash, flash clears), Enter on a
  segment, nav active state, no horizontal overflow at 1440/900/375/340, hamburger open/close at
  375/340, state labels hidden at ≤380, reveal completes on scroll, no-JS renders visible, no
  console errors.

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
