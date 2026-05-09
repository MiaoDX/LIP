# AGENTS.md

Repo-level instructions for coding agents.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `MiaoDX/LIP` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default Matt Pocock triage label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: use root `CONTEXT.md` and `docs/adr/` when present. See `docs/agents/domain.md`.

## Standalone HTML deployment

Some pages are standalone HTML apps/decks and are copied into the built VitePress site by `scripts/publish-rules.mjs`, which is called from `.github/workflows/deploy.yml`. Do not edit `.vitepress/dist/` or any generated output directly.

Site navigation, sidebar groups, and Marp scan directories live in `site-map.mjs`. Update that module instead of duplicating section lists in VitePress config or build scripts.

Run `npm run quality:check` after source-layout changes. It updates `.quality-report.md` and checks that generated publish output has not been committed as source.

### Canonical source locations

- General share decks live in `presentations/`.
  - Put `*.html` directly in `presentations/`.
  - Put small sibling assets directly in `presentations/`, or larger grouped assets in `presentations/<deck-assets>/`.
  - `npm run publish:copy` publishes these to `/LIP/share/`.
  - Do not put presentation assets under `public/share/`; `/LIP/share/` must be generated from `share/*.md` and `presentations/`.

- AI Coding project decks with research/source material live in `ai-coding/<slug>/`.
  - The canonical HTML entry is `ai-coding/<slug>/index.html`.
  - Local assets must live under `ai-coding/<slug>/images/`, `ai-coding/<slug>/screenshots/`, or `ai-coding/<slug>/assets/`.
  - `npm run publish:copy` publishes these to `/LIP/ai-coding/<slug>/`.

- Consult pages live in `public/consult/` and publish to `/LIP/consult/`.
  - Do not recreate a parallel root `consult/` tree.

### Path rules

- Shared standalone deck behavior lives in `assets/deck-runtime.js`. From an AI Coding deck, load it with `../../assets/deck-runtime.js`; from a `presentations/` deck, load it with `../assets/deck-runtime.js`.
- In `ai-coding/<slug>/index.html`, prefer relative asset paths like `images/slide-1.png`.
- Do not reference sibling project folders, such as `../other-talk/images/foo.png`, from a standalone deck. Copy the asset into the deck's own asset folder instead.
- Avoid `raw.githubusercontent.com` for deck images unless the external dependency is intentional. Local repo assets are more reliable for GitHub Pages and offline rehearsal.

### Visual verification

Before declaring deck changes done, render the slide(s) in a real browser at both viewport sizes — laptop is what the live audience sees, mobile is what people who skim later see.

Use the `/browse` skill. On Ubuntu 23.10+ the headless sandbox may be blocked by AppArmor; fall back to `browse --headed` (needs `DISPLAY`).

Two checks:

- **Laptop**: viewport `1440x900` — standard 16:10 projector / talk recording size, also above the deck's `@media (max-width: 900px)` and `@media (max-height: 760px)` breakpoints.
- **Mobile**: viewport `390x844` — iPhone-class, exercises the `(max-width: 900px)` responsive branch.

Open the deck via `file:///<repo>/ai-coding/<slug>/index.html`. To activate a specific slide N (the runtime keeps only `.active` visible):

```js
var s=document.querySelectorAll('.slide');
s.forEach(x=>x.classList.remove('active'));
s[N].classList.add('active');
```

For batch screenshots, inject `'.slide{transition:none !important;}.slide:not(.active){visibility:hidden !important;opacity:0 !important;}'` first — otherwise the 0.45s opacity transition can capture mid-fade residue from the previous slide.

Common layout gotchas this catches:

- `.slide-2col` is CSS **grid** (`2fr 1fr` default), not flex. `flex` values on `.col-l/.col-r` are silently ignored; override `grid-template-columns` on the parent instead.
- `.col-r` defaults to `display: flex` (row). Multiple stacked children need `display: block` or `flex-direction: column`.
- Wide screenshots in `cover` mode crop heavily. Prefer aspect ratios between 0.7-1.5 (W:H) and the `.screenshot.tall` + `.ss-frame` fade-clip pattern.

### Current important deck

`ai-coding/ultrathink-to-goal/index.html` is the canonical source for the "从 Ultrathink 到 Goal" presentation. Its website assets belong in `ai-coding/ultrathink-to-goal/images/`. Do not recreate a second copy under `presentations/` or `share/`.
