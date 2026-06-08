---
refactor_scope: slidev-build-clean-output
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: Slidev build clean output

## Status

DONE

## Target

Make focused Slidev builds explicit about external output cleanup so local and
CI logs do not imply stale generated slide files may survive.

## Accepted Severities

- P1: `npm run slides:build` writes to `.vitepress/dist/slides/slidev`, outside
  the Slidev project root. Vite warned that this output directory would not be
  emptied, creating false-green ambiguity for focused Slidev rebuilds.

## Accepted Cleanup Checklist

- Keep the wrapper clearing the Slidev output directory before invoking Slidev.
- Add script coverage proving stale Slidev output is removed and current output
  is generated.
- Configure Slidev's Vite build with `emptyOutDir: true` so the actual build log
  no longer reports the external output directory as unmanaged.
- Include the new coverage in `npm run test:scripts`.

## Parked Cross-Seam / Future Ideas

- Broader Slidev asset-size tuning is unrelated to stale-output confidence and
  remains parked.
- The `docs:build` path already clears the whole VitePress dist tree; this slice
  hardens the focused Slidev interface.

## Evidence Ladder

- L1: `node scripts/build-slidev.test.mjs`.
- L1: `npm run slides:build`.
- L1: `npm run test:scripts`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the Slidev builder syncs its output directory, the focused regression
test passes, the Vite warning is gone, and full repo gates pass.

## Execution Log

- 2026-06-08: Confirmed the wrapper already deletes the Slidev output directory,
  but Vite still warned that the external `outDir` would not be emptied.
- 2026-06-08: Added a Slidev-local Vite config for `emptyOutDir: true`, made the
  wrapper testable via `SLIDEV_CMD`, and added stale-output regression coverage.
