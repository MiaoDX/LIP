---
refactor_scope: standalone-root-asset-refs
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: standalone root asset refs

## Status

DONE

## Target

Make published standalone HTML sources use local relative asset references
instead of site-root image paths that can resolve outside the GitHub Pages
`/LIP/` base path.

## Accepted Severities

- P1: false-green standalone publish checks; source ownership can pass while a
  published standalone page references `/images/...` from the domain root
  instead of `/LIP/images/...` or a deck-local asset.

## Accepted Cleanup Checklist

- Move the three lobster images used by the legacy low-cost deck copies into a
  local deck asset folder.
- Replace root-absolute `/images/lobster/...` references in the affected
  standalone HTML sources with local relative asset references.
- Add a source ownership check that rejects root-absolute asset refs in
  standalone HTML/CSS source roots.
- Cover the new check in `scripts/publish-rules.test.mjs`.

## Parked Cross-Seam / Future Ideas

- Do not consolidate duplicate published deck aliases in this slice; keep the
  existing published URLs stable.
- Do not redesign or modernize the legacy low-cost deck copies.
- Do not deduplicate all shared QR/screenshot assets; per-deck locality can be
  intentional and needs a separate ownership decision.

## Evidence Ladder

- L0: inventory root-absolute asset refs before and after.
- L1: `npm run test:publish-rules`.
- L1: `npm run test:scripts`.
- L2: `npm run build:all`.
- L2: browser screenshots of affected legacy decks at `1440x900` and
  `390x844`.

## Stop Condition

Stop when standalone source roots have no root-absolute image/script/style
asset refs, the source ownership gate rejects a synthetic root-absolute asset
ref, affected legacy deck images render from deck-local assets, and evidence
commands pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found two published legacy
  low-cost deck HTML sources referencing `/images/lobster/...`. The VitePress
  site base is `/LIP/`, so those paths can resolve to the domain root on GitHub
  Pages while `publish:check` still passes.
- 2026-06-08: Copied the three lobster images into
  `presentations/low-cost-multi-agent-deployment-assets/` and
  `presentations/lowcost-multiplatform-multiagent-deploy-v1-assets/`, then
  replaced the root-absolute image refs with deck-local relative paths.
- 2026-06-08: Added a source ownership check for root-absolute standalone asset
  refs, with regression coverage for SVG/HTML `href` and CSS `url(...)` refs.
- 2026-06-08: Verified no root-absolute standalone asset refs remained in
  `presentations/`, `public/consult/`, or `ai-coding/`; copied deck-local
  image files match the previous public originals byte-for-byte.
- 2026-06-08: Verified `npm run test:publish-rules`,
  `npm run test:scripts`, and `npm run build:all`; `publish:copy` reported
  both new low-cost legacy deck asset directories.
- 2026-06-08: Rendered the affected legacy deck slides containing the moved
  images at `1440x900` and `390x844`; screenshot evidence was captured under
  `/tmp/lip-root-asset-visual-exact`.
