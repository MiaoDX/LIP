# CLAUDE.md

Repo-level notes for Claude Code sessions.

## Standalone HTML deployment

GitHub Pages is built by `.github/workflows/deploy.yml`. VitePress handles Markdown, but standalone HTML decks are copied into `.vitepress/dist/` after `npm run docs:build`.

### Canonical source locations

- `presentations/`: general standalone decks. The workflow copies direct files and asset folders into `/LIP/share/`.
- `ai-coding/<slug>/index.html`: AI Coding project decks that live beside research/source material. The workflow copies `index.html` plus `images/`, `screenshots/`, and `assets/` into `/LIP/ai-coding/<slug>/`.

### Path rules

- Keep deck assets inside the deck's own source directory, usually `images/`.
- Use relative paths from the HTML file, for example `images/slide-1.png`.
- Do not depend on sibling folders or `raw.githubusercontent.com` for presentation images unless that dependency is intentional.
- Never edit `.vitepress/dist/` directly; update the canonical source and the deploy copy rules instead.

Current canonical source: `ai-coding/ultrathink-to-goal/index.html`, with assets in `ai-coding/ultrathink-to-goal/images/`.

## Known gotchas

### GitHub MCP: review thread resolution

`mcp__github__resolve_review_thread` (and `pull_request_review_write` with `method=resolve_thread`) requires the thread's GraphQL node ID (`PRRT_xxx`).

**Problem:** The `mcp__github__pull_request_read` wrapper with `method=get_review_comments` returns thread metadata (`is_resolved`, `is_outdated`, `is_collapsed`, `comments`) but strips the thread-level `id` field. Comment node IDs (`PRRC_xxx`) are not interchangeable with thread IDs.

**Workaround:** When you need to resolve threads, list the addressed comments with their `discussion_r<comment_id>` deep-links and ask the user to resolve manually in the GitHub UI. Don't burn cycles trying to construct PRRT_ IDs from PRRC_ IDs — they're independent.

Discovered in PR [#13](https://github.com/MiaoDX/LIP/pull/13) (2026-04-25).
