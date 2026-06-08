---
refactor_scope: public-subindex-coverage
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: public subindex coverage

## Status

DONE

## Target

Make scoped index coverage protect direct child `index.md` routes, not only
top-level Markdown article files, so public subindexes cannot silently disappear
from their owning landing pages.

## Accepted Severities

- P1: `npm run link:check` can pass while a public child index route is built
  but omitted from its parent section index.
- P2: current public subindexes `bestpractice/weekly-robotics/` and
  `share/agent-radar/` are discoverable through other paths or scoped checks,
  but not from their owning section landing pages.

## Accepted Cleanup Checklist

- Extend index coverage to include direct child directories containing
  `index.md`.
- Add regression coverage for omitted child index routes.
- Link `bestpractice/weekly-robotics/` from `bestpractice/index.md`.
- Link `share/agent-radar/` from Chinese and English share indexes.
- Keep intentional compatibility/pointer routes excluded explicitly.

## Parked Cross-Seam / Future Ideas

- Do not build a generated section registry in this slice.
- Do not force deeply nested project support pages into high-level indexes.
- Keep `share/meetup-multiagent-practice.md` excluded because it is a
  historical compatibility pointer, not a separate share item.

## Evidence Ladder

- L1: `node scripts/link-check.test.mjs`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when direct child index routes are covered by the scoped link gate, current
public subindexes are reachable from their section landing pages, intentional
pointer routes remain explicitly excluded, and verification passes.

## Execution Log

- 2026-06-08: Gate created after saturation audit found public built routes
  `bestpractice/weekly-robotics/` and `share/agent-radar/` were not linked from
  their owning section indexes while `npm run link:check` still passed.
- 2026-06-08: Extended index coverage to include direct child directories with
  `index.md`, with regression coverage for omitted child indexes.
- 2026-06-08: Linked `bestpractice/weekly-robotics/` from the Best Practice
  landing page and `share/agent-radar/` from both share indexes.
- 2026-06-08: Verification passed:
  - `node scripts/link-check.test.mjs`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
