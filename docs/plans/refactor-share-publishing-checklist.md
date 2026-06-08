---
refactor_scope: share-publishing-checklist
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: share publishing checklist

## Status

DONE

## Target

Align `share/README.md` publishing checklists with the current build gate
contract used by root agent guidance and standalone deck runbooks.

## Accepted Severities

- P1: live source drift or real workflow friction in publishing instructions.

## Accepted Cleanup Checklist

- Replace checklist steps that tell maintainers to run `npm run quality:check`
  as the main pre-push gate.
- Make `npm run build:all` the canonical local verification step for Markdown
  share articles, general HTML decks, and AI Coding deck projects.
- Keep `npm run quality:check` documented only as a focused rerun after build
  output already exists.

## Parked Cross-Seam / Future Ideas

- Do not rewrite historical share content or presentation copy in this slice.
- Do not change script behavior; the current script contract is already covered
  by the completed quality-check gate.

## Evidence Ladder

- L0: targeted `rg` over publishing guidance for stale `quality:check`
  checklist steps.
- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when `share/README.md` no longer presents `npm run quality:check` as the
primary publishing gate, the accepted evidence commands pass, and any remaining
mentions of `quality:check` clearly describe the focused rerun contract.

## Execution Log

- 2026-06-08: Gate created after saturation audit found `share/README.md`
  still telling maintainers to run `npm run quality:check` directly, while
  root and standalone deck guidance say clean-checkout verification should run
  `npm run build:all`.
- 2026-06-08: Updated all three share publishing checklists to run
  `npm run build:all` as the canonical local gate and describe
  `npm run quality:check` only as a focused rerun after build output exists.
  Verification passed:
  - `rg -n "运行 npm run quality:check|npm run quality:check|npm run build:all" share/README.md README.md AGENTS.md docs/agents/standalone-decks.md templates/README.md`
  - `npm run test:scripts`
  - `npm run build:all`
