---
refactor_scope: typecheck-build-gate
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: typecheck build gate

## Status

DONE

## Target

Make the repo-local TypeScript/VitePress config check part of the canonical
script and full-build verification path.

## Materiality

- P1: live source drift. `docs/agents/lsp-mcp.md` tells agents to run
  `npx tsc --noEmit` for script and VitePress config changes, while
  `AGENTS.md`, `README.md`, and CI describe `npm run build:all` as the full
  local/CI gate.
- P1: false confidence. A future config or script type error could pass the
  documented full build path unless the agent remembered the extra manual
  command.

## Accepted Cleanup Checklist

- Add a first-class `npm run typecheck` command.
- Include `typecheck` in `npm run test:scripts`, and therefore in
  `npm run build:all`.
- Update the LSP/MCP runbook so agents use the canonical npm command and know
  the full verifier includes it.

## Parked Cross-Seam / Future Ideas

- Do not enable `checkJs` for all JavaScript in this slice; that would be a
  broader typing refactor.
- Do not add a separate CI step while GitHub Pages already calls
  `npm run build:all`.

## Evidence Ladder

- L0: `npm run typecheck`
- L1: `npm run test:scripts`
- L2: `npm run build:all`

## Stop Condition

Stop when typecheck is a named npm script, the script-helper and full-build
gates include it, docs no longer require an uncoupled `npx` command, and all
evidence commands pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found the TypeScript config
  verifier was documented in the LSP runbook but absent from the canonical
  full-build path.
- 2026-06-08: Added `npm run typecheck`, included it in
  `npm run test:scripts`, updated the LSP/MCP runbook, and verified:
  - `npm run typecheck`
  - `npm run test:scripts`
  - `npm run build:all`
