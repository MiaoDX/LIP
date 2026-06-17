---
refactor_scope: ultrathink-release-map-source
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: Ultrathink release map source

## Status

DONE

## Target

Remove the unreferenced generated-overlay HTML source
`ai-coding/ultrathink-to-goal/assets/claude-code-release-map-2026-05-11.html`
from the published Ultrathink AI Coding project assets.

## Accepted Severities

- P2: stale published asset surface. AI Coding `assets/` directories are copied
  to public output, but current source content references the final PNG and the
  candidates overlay source, not this HTML source.

## Accepted Cleanup Checklist

- Delete `assets/claude-code-release-map-2026-05-11.html`.
- Keep the referenced PNG, candidate PNGs, base images, and
  `assets/claude-code-release-map-candidates-2026-05-11.html`.
- Verify no source references to the deleted HTML filename remain outside this
  gate.

## Parked Cross-Seam / Future Ideas

- Do not prune Ultrathink image assets just because a filename has a low
  reference count. Several images are deck-local visual sources or research
  candidates, and deletion needs deck-specific visual/provenance proof.
- Do not consolidate legacy low-cost presentation variants in this slice; those
  are public URL/history decisions.

## Evidence Ladder

- L0: `git grep` for the deleted HTML filename.
- L1: `npm run test:publish-rules`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the unreferenced HTML source is gone, no source references to its
filename remain outside this gate, the referenced release-map artifacts remain,
and the repo gates pass.

## Execution Log

- 2026-06-17: Gate created after repo entropy discovery found the HTML source
  had no current source references by filename while
  `claude-code-release-map-candidates-2026-05-11.html` and the release-map PNGs
  remained referenced.
- 2026-06-17: Deleted
  `ai-coding/ultrathink-to-goal/assets/claude-code-release-map-2026-05-11.html`.
- 2026-06-17: Verification passed:
  - `git grep -n -F -- 'claude-code-release-map-2026-05-11.html' -- ':!node_modules' ':!.vitepress/dist' ':!docs/plans'`
  - `npm run test:publish-rules`
  - `npm run build:all`
