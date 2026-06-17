---
refactor_scope: script-dead-surfaces
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: script dead surfaces

## Status

DONE

## Target

Remove stale script helper APIs and imports that have no in-repo callers after
the previous publish/link-check hardening passes.

## Accepted Severities

- P1: source-of-truth drift in public script modules that can make future agents
  preserve unused helper behavior as if it were still part of the active model.
- P2: small dead-code cleanup inside the script owner boundary.

## Accepted Cleanup Checklist

- Remove the unused `routeToMarkdownFile` wrapper from
  `scripts/markdown-route-utils.mjs` and its direct test assertions.
- Remove unused private helpers from `scripts/link-check.mjs`.
- Remove unused imports from script modules touched by the dead helpers.
- Remove unused exported publish helper APIs with no in-repo callers.

## Parked Cross-Seam / Future Ideas

- Broad route normalization changes stay parked; current slashless directory
  behavior is already covered by `scripts/link-check.test.mjs`.
- Content rewrites and historical link cleanup stay outside this code slice.

## Evidence Ladder

- L0: `rg` for removed helper names.
- L1: `npm run test:scripts`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the accepted dead surfaces are gone, no in-repo references remain,
script tests pass, the full build gate passes, and no route behavior has been
changed beyond deleting unreachable helper APIs.

## Execution Log

- 2026-06-17: Gate created for a deletion-first script cleanup slice.
- 2026-06-17: Removed the stale route wrapper, unused link-check helpers, unused
  imports, and the unused publish helper export. Verified with:
  - `rg -n "routeToMarkdownFile\b|function isDir\b|markdownFilesInDir\b|collectExpected\b" scripts`
  - `npm run test:scripts`
