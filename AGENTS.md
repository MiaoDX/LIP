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

### Current important deck

`ai-coding/ultrathink-to-goal/index.html` is the canonical source for the "从 Ultrathink 到 Goal" presentation. Its website assets belong in `ai-coding/ultrathink-to-goal/images/`. Do not recreate a second copy under `presentations/` or `share/`.
