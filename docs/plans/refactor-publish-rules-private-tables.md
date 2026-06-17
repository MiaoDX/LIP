---
refactor_scope: publish-rules-private-tables
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: publish rules private tables

## Status

DONE

## Target

Make `scripts/publish-rules.mjs` rule tables private when they have no in-repo
importers. The supported surface is the CLI plus exported functions used by
tests and quality gates.

## Accepted Severities

- P1: accidental exported configuration tables can be mistaken for stable
  public API by future script work.
- P2: small module-surface cleanup inside the standalone publish owner.

## Accepted Cleanup Checklist

- Remove `export` from `sourceOwnershipRules`.
- Remove `export` from `publishRules`.
- Confirm no in-repo imports reference either table directly.

## Parked Cross-Seam / Future Ideas

- Do not redesign publish rule schema or split the module.
- Keep existing exported functions and CLI behavior intact.

## Evidence Ladder

- L0: `rg` for direct table references outside `scripts/publish-rules.mjs`.
- L1: `npm run test:scripts`.

## Stop Condition

Stop when the two rule tables are private, no direct in-repo callers remain,
and script tests pass.

## Execution Log

- 2026-06-17: Gate created after export scan showed no direct in-repo callers.
- 2026-06-17: Made `sourceOwnershipRules` and `publishRules` private module
  constants. Verified with:
  - `rg -n "sourceOwnershipRules|import .*publishRules|\\{[^}]*publishRules[^}]*\\}\\s+from|\\.publishRules\\b" -g '!node_modules' -g '!docs/plans/*.md' .`
  - `rg -n "export const (sourceOwnershipRules|publishRules)" scripts/publish-rules.mjs`
  - `npm run test:scripts`
