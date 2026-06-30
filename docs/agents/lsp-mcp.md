# LSP And MCP

This repo is primarily Markdown/content plus Node-based VitePress, Marp, Slidev, and publish-rule scripts.

## Underlying language server

`tsconfig.json` is the repo-local JavaScript/TypeScript language-server config. It covers:

- root ESM modules such as `site-map.mjs`
- `.vitepress/**/*.mts`
- `scripts/**/*.mjs`

Run `npm run typecheck` when changing TypeScript/VitePress config or JavaScript scripts that affect build behavior. `npm run test:scripts` and `npm run build:all` include this gate, so the normal full verifier catches config and script type drift.

## Agent-facing MCP

Serena is initialized for this workspace through `.serena/project.yml`, and the
current Codex session can activate the `LIP` project with Serena `1.5.1` in
`codex` context.

There is still no checked-in `.mcp.json` host entry. Do not add a guessed one:
Serena installation and activation depend on the host agent CLI and the current
upstream Serena transport/setup instructions. If a shared host entry is needed,
confirm the current Serena setup path first, then add a repo-scoped config that
contains no secrets.

`.serena/project.local.yml`, `.serena/cache/`, and `.serena/memories/` are
local-only. Do not commit machine-local overrides, cache output, or session
memories.
