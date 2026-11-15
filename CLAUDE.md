# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Chirayu Betkekar's single-page portfolio: plain HTML/CSS/JS with no framework, no package.json, and no build step. The whole site is `index.html`, `css/style.css`, `js/main.js` and `assets/`. It deploys to Vercel as a static folder.

**`CONTEXT.md` is the authoritative design log.** It records every content and visual decision, the flywheel geometry math, the logo processing, and bugs that were already found. Read the relevant part before changing anything non-trivial, and add to it when you make a decision worth keeping (it is git-tracked, and `.vercelignore` keeps it off the live site).

## Running and verifying

- Serve locally with `python -m http.server` from the repo root, then open `http://localhost:8000`. Opening `index.html` straight from disk mostly works, but use a server when testing.
- **Cache busting:** `index.html` links `css/style.css?v=N` and `js/main.js?v=N`. Bump both `N` values whenever you change CSS or JS, or the browser will serve stale files.
- There is no lint or test tooling in the repo. CONTEXT.md describes a Playwright suite (`verify.py`, about 111 checks, run against `http.server`), but that file is **not committed**. If you write browser checks, the testing gotchas in CONTEXT.md still apply: `inner_text()` returns CSS-uppercased text, flywheel arcs have to be clicked at computed band coordinates (the bbox center is the hollow hub), take screenshots in a `reduced_motion="reduce"` context, and don't trust clipped screenshots at `device_scale_factor=2` (they show a phantom SPIT crest).

## Content rules (user-imposed, non-negotiable)

- **Verbatim copy:** the hero subtext, the flywheel caption (two `<p>`s) and both About bio paragraphs are the user's own words. Do not edit, tighten or "improve" them. Other copy was paraphrased from a Notion export and can be edited, but don't invent facts or metrics.
- **No em dashes (U+2014)** anywhere a visitor reads or hears: body copy, `<title>`, meta description, `aria-label`, SVG `<desc>`. Code comments are exempt. Pick a colon, a period or a recast clause instead of swapping in commas, which produces comma splices.
- **No section leads:** each section header is eyebrow, then `h2`, then content. Don't add subtitle lines. `.lead` is used only by the hero.
- **No black fills:** never fill a surface with ink (`#111`), whether a button, card, contact row, flowchart node or the flywheel hub. Use white panels, accent tints, or the accent itself for primary buttons. Ink is for text, outlines and the flywheel arrowheads.
- **Never crop a logo's wordmark down to its symbol.** If the text is too small, make the logo bigger.
- Project tech `.tag`s are CSS-uppercased. To keep a brand's own casing (for example `n8n`), add `.tag-verbatim` and leave the shared `.tag` rule alone. Skill `.pill`s are sentence case.
- Color that is only decorative goes on a class (like the hero's `.accent` on "Tech."), not on `<em>`, so screen readers don't announce emphasis.

## Architecture worth knowing before editing

- **Design tokens** live on `:root` in `style.css`. There is exactly one accent color, `--accent` (terracotta `#a94c25`, from the "Clay & Sand" palette adopted 2026-11-08), and small text stays in ink (the accent is 5.2:1 on the canvas, white on it is 5.6:1). It is used for fills, icons, the large "Tech." and white-on-accent labels. The current look is "Refined Light" (2026-11-05): rounded white panels (`.panel`, radii from `--r-xl`, `--r-lg` and `--r-md`) with 1px hairline borders on the off-white canvas, pills, and **no drop shadows**. Hover states change color only, with no lift, scale or glow.
- **Project panels** (`article.project`) have two columns: Problem/Solution/Outcome text, then a "How it works" flowchart built from flex `.node`s, `.flow-arrow`s and `.flow-split` rows. The step that does the work is `.node-key` (accent tint with an accent border). Node labels are condensed from that project's own copy, so don't add claims the copy doesn't make.
- **Progressive enhancement:** an inline script in `<head>` adds `.js` to `<html>`, and `.reveal` elements are hidden only under `.js`. Keep that scoping so a JS failure never leaves the page blank. `main.js` reveals them with `IntersectionObserver`, and also handles nav highlighting and the mobile menu.
- **Flywheel (section 01)** is core to the site and stays in any redesign. Restyle it, but never replace it with something simpler. It is hand-built inline SVG (viewBox `0 0 480 480`, center 240,240). The rings are stroked `<circle>`s using `stroke-dasharray` and `rotate()`, not path sectors. The stroke is both the visible band and the click target. Decorative layers sit in `.fw-static` with `pointer-events="none"` and are painted before the three `<a class="fw-link">` segments. Label positions and font sizes were set by checking each text bbox's corners against the band radii, so if you move or resize a label, redo that check (CONTEXT.md has the numbers).
- **The flywheel filters the projects; the stage lives on the card.** Each `article.project` carries `data-stage` (`attract`, `engage` or `delight`), and that attribute is the only place a project's stage is set. Clicking a segment (`.fw-link[data-stage]`) hides the other stages' cards, keeps the segment red (`.is-active`), and scrolls to the filter bar (`#projectFilter`). The bar has All/Attract/Engage/Delight `aria-pressed` buttons with counts computed from `data-stage`, plus a live status line. "All projects", or clicking the active segment again, shows everything. `.project[hidden]` needs its own `display: none` because `.project` is `display: grid`. Without JS the bar is hidden and each segment's `href` (its stage's first card) is a plain anchor jump, so keep those hrefs pointing at real cards.
- **Logos are pre-processed assets.** Each `assets/logo-*.png` is already cropped to its content, exported at 3x, and has a transparent background, so the CSS only sets the size. To change a logo, regenerate the PNG; don't crop or blend it in CSS. The raw originals are gitignored and exist only on the local machine.
- **Headshot** `assets/headshot.png` is a transparent cutout shown at 340px on a tinted card, so it uses `object-fit: contain`. The 500px source is under 2x at that size, and a larger export is an open item. The inline `onerror` on the `<img>` (deliberately not a JS listener, which would race) switches to the bordered `CB` initials badge.
- **Responsive breakpoints:** 900px (the bento hero, flywheel, project panels and about grid stack), 760px (the pill nav becomes a hamburger dropdown), 560px, 420px, and 380px (outer flywheel state labels are hidden).

## Repo hygiene

The repo root holds personal working files that the site doesn't use (the Notion PDF, the flywheel reference `.webp`, `Chirayu.png`, `OIP.jpeg`). They are gitignored. Don't reference them from the site or move them into `assets/`, and leave deleting them to the user.
