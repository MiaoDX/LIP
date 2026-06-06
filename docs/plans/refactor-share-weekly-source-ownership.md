---
refactor_scope: share-weekly-source-ownership
status: DONE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: share weekly source ownership

## Status

DONE

## Target

Make standalone HTML under `/share/weekly/` publish from the canonical standalone source surface, `presentations/weekly/`, instead of keeping tracked HTML directly under `share/`.

## Accepted Severities

- P0: `share/index.md` links to `/share/weekly/weekly-robotics-356-personalized.html`, but the final `npm run build:all` output does not contain that file.
- P1: `npm run publish:check` passes even when tracked nested `share/**/*.html` bypasses the canonical standalone publish rules.
- P2: `share/README.md` and `scripts/publish-rules.mjs` describe `presentations/` as the canonical standalone HTML source, but `share/weekly/*.html` violates that shape.

## Accepted Cleanup Checklist

- Move `share/weekly/weekly-robotics-356-personalized.html` to `presentations/weekly/weekly-robotics-356-personalized.html`.
- Keep the existing public URL `/share/weekly/weekly-robotics-356-personalized.html` working through the existing presentations publish adapter.
- Extend source ownership checks so nested `share/**/*.html` is rejected.
- Add a regression test for nested `share/**/*.html` ownership detection.
- Verify the final build output contains both weekly HTML files.

## Parked Cross-Seam / Future Ideas

- README `claw-agents-shared` / submodule-oriented agent notes were cleaned up in `docs/plans/refactor-reduce-entropy-loop.md`.
- A broader built-site dead-link checker may be useful, but this slice only fixes the confirmed weekly standalone HTML break.

## Evidence Ladder

- L1: `npm run test:publish-rules`
- L2: `npm run publish:copy && npm run publish:check`
- L2: `npm run build:all`
- L2: direct file existence checks in `.vitepress/dist/share/weekly/`

## Stop Condition

Stop when the accepted checklist is complete, all evidence commands pass, and `.vitepress/dist/share/weekly/` contains both `weekly-robotics-356.html` and `weekly-robotics-356-personalized.html` after `npm run build:all`.

## Execution Log

- 2026-06-06: Gate created from confirmed `share/weekly` publish failure.
- 2026-06-06: Moved `weekly-robotics-356-personalized.html` from `share/weekly/` to `presentations/weekly/`.
- 2026-06-06: Extended publish source ownership checks to reject nested `share/**/*.html`.
- 2026-06-06: Added regression coverage for nested generated share HTML.
- 2026-06-06: Updated `quality:check` to ignore tracked generated paths that have already been removed in the working tree.
- 2026-06-06: Verified:
  - `npm run test:publish-rules`
  - source ownership direct check
  - `npm run quality:check`
  - `npm run build:all`
  - `.vitepress/dist/share/weekly/weekly-robotics-356.html` exists
  - `.vitepress/dist/share/weekly/weekly-robotics-356-personalized.html` exists
