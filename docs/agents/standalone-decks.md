# Standalone Decks

Standalone HTML apps and decks are copied into the built VitePress site by `scripts/publish-rules.mjs`, which is called from `.github/workflows/deploy.yml`. Do not edit `.vitepress/dist/` or generated publish output directly.

Site navigation, sidebar groups, and Marp scan directories live in `site-map.mjs`. Update that module instead of duplicating section lists in VitePress config or build scripts.

Run `npm run build:all` after source-layout changes. For a focused rerun, use
`npm run quality:check` only after `.vitepress/dist` has already been built and
standalone output has been copied; it updates `.quality-report.md` and checks
that generated publish output has not been committed as source.

## Deck template

Start every new HTML/PPT deck from `templates/deck/index.html`; see `templates/README.md`. It carries the shared theme tokens, style switching, paging, image pop-up, speaker notes, and common slide layouts.

After copying the template, adjust the `assets/deck-runtime.js` relative path for the destination depth.

## Canonical source locations

General share decks live in `presentations/`.

- Put `*.html` directly in `presentations/`.
- Put small sibling assets directly in `presentations/`, or larger grouped assets in `presentations/<deck-assets>/`.
- `npm run publish:copy` publishes these to `/LIP/share/`.
- Do not put presentation assets under `public/share/`; `/LIP/share/` must be generated from `share/*.md` and `presentations/`.

AI Coding project decks with research/source material live in `ai-coding/<slug>/`.

- The canonical HTML entry is `ai-coding/<slug>/index.html`.
- Local assets must live under `ai-coding/<slug>/images/`, `ai-coding/<slug>/screenshots/`, or `ai-coding/<slug>/assets/`.
- `npm run publish:copy` publishes these to `/LIP/ai-coding/<slug>/`.

Consult pages live in `public/consult/` and publish to `/LIP/consult/`.

- Do not recreate a parallel root `consult/` tree.
- Keep PDFs and downloads there for VitePress public passthrough.

## Path rules

- Shared standalone deck behavior lives in `assets/deck-runtime.js`. From an AI Coding deck, load it with `../../assets/deck-runtime.js`; from a `presentations/` deck, load it with `../assets/deck-runtime.js`.
- In `ai-coding/<slug>/index.html`, prefer relative asset paths like `images/slide-1.png`.
- Keep deck assets inside the deck's own source directory, usually `images/`.
- Do not reference sibling project folders, such as `../other-talk/images/foo.png`, from a standalone deck. Copy the asset into the deck's own asset folder instead.
- Avoid `raw.githubusercontent.com` for deck images unless the external dependency is intentional. Local repo assets are more reliable for GitHub Pages and offline rehearsal.

## Current important deck

`ai-coding/ultrathink-to-goal/index.html` is the canonical source for the "从 Ultrathink 到 Goal" presentation. Its website assets belong in `ai-coding/ultrathink-to-goal/images/`. Do not recreate a second copy under `presentations/` or `share/`.

## Slide copy punctuation

For visible text inside standalone slide decks, prefer fragment-style copy without unnecessary sentence-ending `。`, `.`, or `；`. Keep punctuation when it is part of a quote, URL, version number, decimal, filename, code snippet, or when speaker notes/transcripts need normal prose punctuation.

## Visual verification

Before declaring deck changes done, render the changed slide(s) in a real browser at both viewport sizes. Laptop is what the live audience sees; mobile is what people who skim later see.

Use the `/browse` skill. On Ubuntu 23.10+ the headless sandbox may be blocked by AppArmor; fall back to `browse --headed` when a display is available.

Required viewports:

- Laptop: `1440x900`, standard 16:10 projector and talk recording size, above the deck's `@media (max-width: 900px)` and `@media (max-height: 760px)` breakpoints.
- Mobile: `390x844`, iPhone-class, exercises the `(max-width: 900px)` responsive branch.

Open the deck via `file:///<repo>/ai-coding/<slug>/index.html`. To activate a specific slide N:

```js
var s = document.querySelectorAll('.slide')
s.forEach(x => x.classList.remove('active'))
s[N].classList.add('active')
```

For batch screenshots, inject this first so the opacity transition cannot capture mid-fade residue from the previous slide:

```js
'.slide{transition:none !important;}.slide:not(.active){visibility:hidden !important;opacity:0 !important;}'
```

Common layout gotchas:

- `.slide-2col` is CSS grid (`2fr 1fr` default), not flex. `flex` values on `.col-l` or `.col-r` are silently ignored; override `grid-template-columns` on the parent instead.
- `.col-r` defaults to `display: flex` in row direction. Multiple stacked children need `display: block` or `flex-direction: column`.
- Wide screenshots in `cover` mode crop heavily. Prefer aspect ratios between 0.7 and 1.5 (W:H) and the `.screenshot.tall` plus `.ss-frame` fade-clip pattern.
