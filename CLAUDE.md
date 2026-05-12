# CLAUDE.md

Repo-level notes for Claude Code sessions.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `MiaoDX/LIP` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default Matt Pocock triage label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo: use root `CONTEXT.md` and `docs/adr/` when present. See `docs/agents/domain.md`.

## Standalone HTML deployment

GitHub Pages is built by `.github/workflows/deploy.yml`. VitePress handles Markdown, but standalone HTML decks are copied into `.vitepress/dist/` by `scripts/publish-rules.mjs` after `npm run docs:build`.

Site navigation, sidebar groups, and Marp scan directories live in `site-map.mjs`. Update that module instead of duplicating section lists in VitePress config or build scripts.

Run `npm run quality:check` after source-layout changes. It updates `.quality-report.md` and checks that generated publish output has not been committed as source.

### Canonical source locations

- `presentations/`: general standalone decks. `npm run publish:copy` copies direct files and asset folders into `/LIP/share/`.
- `ai-coding/<slug>/index.html`: AI Coding project decks that live beside research/source material. `npm run publish:copy` copies `index.html` plus `images/`, `screenshots/`, and `assets/` into `/LIP/ai-coding/<slug>/`.
- `public/consult/`: consult pages and downloads. `npm run publish:copy` copies HTML into `/LIP/consult/`; keep PDFs and downloads there for VitePress public passthrough.

### Path rules

- Shared standalone deck behavior lives in `assets/deck-runtime.js`. From an AI Coding deck, load it with `../../assets/deck-runtime.js`; from a `presentations/` deck, load it with `../assets/deck-runtime.js`.
- Keep deck assets inside the deck's own source directory, usually `images/`.
- Use relative paths from the HTML file, for example `images/slide-1.png`.
- Do not put presentation assets under `public/share/`; `/LIP/share/` must be generated from `share/*.md` and `presentations/`.
- Do not recreate a parallel root `consult/` tree; `public/consult/` is the canonical consult source.
- Do not depend on sibling folders or `raw.githubusercontent.com` for presentation images unless that dependency is intentional.
- Never edit `.vitepress/dist/` directly; update the canonical source and `scripts/publish-rules.mjs` instead.

Current canonical source: `ai-coding/ultrathink-to-goal/index.html`, with assets in `ai-coding/ultrathink-to-goal/images/`.

### Slide copy punctuation

For visible text inside standalone slide decks, prefer fragment-style copy without unnecessary sentence-ending `。`, `.`, or `；`. Keep punctuation when it is part of a quote, URL, version number, decimal, filename, code snippet, or when speaker notes/transcripts need normal prose punctuation.

### Visual verification

Before declaring deck changes done, render the slide(s) in a real browser at both viewports. Static HTML inspection misses CSS layout regressions (especially `.slide-2col` grid vs flex confusion).

Use the `/browse` skill. On Ubuntu 23.10+ the headless sandbox is blocked by AppArmor; fall back to `browse --headed` (needs `DISPLAY`).

Two viewports — both required, they catch different bugs:

- **Laptop**: `1440x900` (target talk projection; above all `@media` breakpoints).
- **Mobile**: `390x844` (iPhone-class; exercises the `(max-width: 900px)` responsive branch).

To jump to slide N (the runtime hides non-active slides via opacity 0):

```js
var s=document.querySelectorAll('.slide');
s.forEach(x=>x.classList.remove('active'));
s[N].classList.add('active');
```

For batch screenshots, first inject `'.slide{transition:none !important;}.slide:not(.active){visibility:hidden !important;opacity:0 !important;}'` to bypass the 0.45s fade.

## Known gotchas

### Deck `.slide-2col` is grid, not flex

`.slide-2col` uses `grid-template-columns: 2fr 1fr` by default. Setting `flex: 0 0 X%` on `.col-l` / `.col-r` is silently ignored — override `grid-template-columns` on the parent instead. Also: `.col-r` is `display: flex` (row); multiple stacked children need `display: block` or `flex-direction: column`. These bugs render fine in a static check but produce overlapping or squashed columns at 1440x900. Always verify decks via `/browse`.

### GitHub MCP: review thread resolution

`mcp__github__resolve_review_thread` (and `pull_request_review_write` with `method=resolve_thread`) requires the thread's GraphQL node ID (`PRRT_xxx`).

**Problem:** The `mcp__github__pull_request_read` wrapper with `method=get_review_comments` returns thread metadata (`is_resolved`, `is_outdated`, `is_collapsed`, `comments`) but strips the thread-level `id` field. Comment node IDs (`PRRC_xxx`) are not interchangeable with thread IDs.

**Workaround:** When you need to resolve threads, list the addressed comments with their `discussion_r<comment_id>` deep-links and ask the user to resolve manually in the GitHub UI. Don't burn cycles trying to construct PRRT_ IDs from PRRC_ IDs — they're independent.

Discovered in PR [#13](https://github.com/MiaoDX/LIP/pull/13) (2026-04-25).
