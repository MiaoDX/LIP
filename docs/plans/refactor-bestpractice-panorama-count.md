---
refactor_scope: bestpractice-panorama-count
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: bestpractice panorama count

## Status

DONE

## Target

Align the Best Practice first-read panorama summary with the current
`bestpractice/panorama.md` source table.

## Accepted Severities

- P1: public first-read source-of-truth drift around current article/index
  counts.

## Accepted Cleanup Checklist

- Count the current overseas and domestic company rows in
  `bestpractice/panorama.md`.
- Update `bestpractice/index.md` so its panorama link and summary match the
  current source table.

## Parked Cross-Seam / Future Ideas

- Do not refresh the panorama company list or external links in this slice.
- Do not add another generated metadata system for this one count.

## Evidence Ladder

- L0: table-row count from `bestpractice/panorama.md`.
- L1: `npm run link:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the Best Practice first-read page no longer contradicts the current
panorama table counts and evidence commands pass.

## Execution Log

- 2026-06-08: Gate created after the saturation audit found
  `bestpractice/index.md` still saying 25 companies while the current panorama
  table contains 19 overseas and 12 domestic companies.
- 2026-06-08: Updated the Best Practice first-read panorama summary to 31
  companies, split as 19 overseas plus 12 domestic.
- 2026-06-08: Verification passed:
  - table-row count from `bestpractice/panorama.md`
  - `npm run link:check`
  - `npm run build:all`
