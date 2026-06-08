---
refactor_scope: marp-build-clean-output
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: Marp build clean output

## Status

DONE

## Target

Make focused Marp builds remove stale generated slide files so local verification
matches the current `marp: true` source set.

## Accepted Severities

- P1: `npm run marp:build` scans current Marp sources and writes current output,
  but it did not clear `.vitepress/dist/slides/marp` first. If a source file
  stops being a Marp deck, focused reruns can leave the old public slide HTML in
  generated output even though the builder no longer reports that deck.

## Accepted Cleanup Checklist

- Clear the Marp output directory before generating current decks.
- Add script coverage proving stale Marp output is removed and current deck
  output is still generated.
- Include that coverage in `npm run test:scripts`.

## Parked Cross-Seam / Future Ideas

- VitePress `docs:build` already clears the whole dist tree, so full
  `npm run build:all` was not the failing path. This slice only hardens the
  focused Marp interface.
- PDF stale cleanup uses the same output directory and remains covered by the
  directory sync.

## Evidence Ladder

- L1: `npm run test:scripts`.
- L1: `npm run marp:build`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the Marp builder syncs its output directory, the regression test
passes, and full repo gates pass.

## Execution Log

- 2026-06-08: Confirmed `docs:build` clears full dist output, narrowing this to
  focused `npm run marp:build` false-green risk.
- 2026-06-08: Added output directory cleanup and script coverage for stale
  Marp HTML removal.
