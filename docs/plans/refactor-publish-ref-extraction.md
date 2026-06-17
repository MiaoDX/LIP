---
refactor_scope: publish-ref-extraction
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: publish ref extraction

## Status

DONE

## Target

Collapse duplicate standalone asset-reference extraction in
`scripts/publish-rules.mjs`.

## Accepted Severities

- P1: parallel scanner paths for local refs and root-absolute refs can drift and
  create false confidence in standalone source ownership checks.
- P2: private helper duplication inside the publish-rule script boundary.

## Accepted Cleanup Checklist

- Replace the separate local-ref and root-absolute-ref extraction helper
  families with one extracted ref list per source file.
- Keep exported publish-rule APIs and CLI behavior unchanged.
- Preserve existing source ownership coverage for missing assets, CSS imports,
  `srcset`, HTML comments, raster data URIs, placeholders, client-side
  passwords, and root-absolute standalone assets.
- Remove stale private helper references.

## Parked Cross-Seam / Future Ideas

- Shared filesystem helpers across `scripts/*.mjs` remain parked; that touches
  multiple script seams for a small deletion win.

## Evidence Ladder

- L0: `rg` for removed scanner helper names.
- L1: `npm run test:publish-rules`.
- L1: `npm run typecheck`.

## Stop Condition

Stop when the duplicate scanner path is gone, the accepted checklist is
complete, existing publish-rule tests and typecheck pass, and no stale helper
references remain.

## Execution Log

- 2026-06-17: Gate created for consolidating standalone asset-reference
  extraction.
- 2026-06-17: Replaced the parallel local/root-absolute scanner helper
  families with one `refsInSource` path. Verified with:
  - `rg -n "localRefsInCss|localRefsInHtml|rootAbsoluteAssetRefsInCss|rootAbsoluteAssetRefsInHtml|isRootAbsoluteAssetRef" scripts/publish-rules.mjs scripts/publish-rules.test.mjs` (expected no matches)
  - `node scripts/publish-rules.test.mjs`
  - `npm run typecheck`
