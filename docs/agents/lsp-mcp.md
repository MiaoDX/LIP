# LSP And MCP

This repo is primarily Markdown/content plus Node-based VitePress, Marp, Slidev, and publish-rule scripts.

## Underlying language server

`tsconfig.json` is the repo-local JavaScript/TypeScript language-server config. It covers:

- root ESM modules such as `site-map.mjs`
- `.vitepress/**/*.mts`
- `scripts/**/*.mjs`

Run `npm run typecheck` when changing TypeScript/VitePress config or JavaScript scripts that affect build behavior. `npm run test:scripts` and `npm run build:all` include this gate, so the normal full verifier catches config and script type drift.

## Agent-facing MCP

No Serena or equivalent MCP symbol server is checked into this repo today.

Do not add a guessed `.mcp.json`. Serena installation and activation depend on the host agent CLI and the current upstream Serena transport/setup instructions. If symbol-level MCP support is needed, confirm the current Serena setup path first, then add a repo-scoped config that contains no secrets.
