---
refactor_scope: index-coverage-gate
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: index coverage gate

## Status

DONE

## Target

Make first-read index coverage a checked script gate so current article files do
not silently disappear from public entry pages.

## Accepted Severities

- P1: false-green verification where `link:check` and `quality:check` pass
  while a first-read index omits current article files.
- P2: target-local maintainability cleanup needed to keep the coverage rule
  explicit and testable.

## Accepted Cleanup Checklist

- Add a small source-backed index coverage check for top-level public article
  sections.
- Exclude intentional support, pointer, and index files explicitly.
- Wire the check into the existing scoped link gate so `npm run link:check`,
  `npm run quality:check`, and `npm run build:all` all share the same signal.
- Add regression coverage showing an omitted article file fails the gate.

## Parked Cross-Seam / Future Ideas

- Do not generate public index pages from manifests in this slice.
- Do not require English mirrors for every Chinese article; `en/` is explicitly
  an entry plus translated-content mirror, not a complete duplicate.
- Do not force known historical pointer routes, such as
  `share/meetup-multiagent-practice.md`, into public indexes.

## Evidence Ladder

- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the index coverage check catches omitted current article files,
respects intentional exclusions, is covered by tests, and all evidence commands
pass.

## Execution Log

- 2026-06-08: Gate created after the Best Practice index drift was fixed
  manually while existing script gates had stayed green.
- 2026-06-08: Added explicit first-read index coverage rules to
  `scripts/link-check.mjs` for current top-level article sections and existing
  translated article sections.
- 2026-06-08: Added regression coverage proving an omitted article fails the
  scoped link gate while intentional support pages can be excluded.
- 2026-06-08: Verification passed:
  - `npm run test:scripts`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
