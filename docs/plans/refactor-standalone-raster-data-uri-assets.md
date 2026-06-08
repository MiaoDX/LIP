---
refactor_scope: standalone-raster-data-uri-assets
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: standalone raster data URI assets

## Status

DONE

## Target

Move real raster images out of published standalone HTML sources and into local
asset files, then make the publish/source ownership gate reject future raster
data URI drift.

## Accepted Severities

- P1: false-green source ownership checks and workflow friction in published
  standalone source files.

## Accepted Cleanup Checklist

- Extract current raster `data:image/*;base64` payloads from `presentations/`
  and `public/consult/` standalone HTML sources into adjacent asset folders.
- Replace each HTML data URI with a local relative asset reference.
- Add a source ownership check so `npm run publish:check`,
  `npm run quality:check`, and `npm run build:all` fail on real raster data
  URIs in standalone source roots.
- Cover the new check in `scripts/publish-rules.test.mjs`.

## Parked Cross-Seam / Future Ideas

- Do not redesign the affected decks or consult pages in this slice.
- Do not ban the short inline SVG placeholders in `templates/deck/index.html`;
  those are documented as temporary labels, not real raster assets.

## Evidence Ladder

- L0: data URI inventory before and after extraction.
- L1: `npm run test:publish-rules`.
- L1: `npm run test:scripts`.
- L2: `npm run build:all`.

## Stop Condition

Stop when current published standalone source roots have no raster
`data:image/*;base64` payloads, the ownership gate rejects a synthetic raster
data URI, existing standalone output copies the new asset folders, and all
evidence commands pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found 59 real raster data
  URIs across four published standalone source files, totaling about 9.6 MB of
  HTML text, despite the deck template telling authors not to inline real
  images as base64 data URIs.
- 2026-06-08: Extracted all 59 raster payloads into adjacent asset directories:
  `presentations/lowcost-multiplatform-multiagent-deploy-assets/`,
  `presentations/claws-civilization-assets/`,
  `presentations/meetup_260426-assets/`, and
  `public/consult/zhenfund-token-grant-pitch-assets/`.
- 2026-06-08: Added a source ownership check that rejects raster base64 data
  URIs in standalone HTML roots, plus a publish-rules fixture covering consult
  child asset directory copying.
- 2026-06-08: Verified `rg -n "data:image/(png|jpe?g|webp|gif);base64"
  presentations public/consult ai-coding --glob "*.html"` returned no hits,
  and a byte-equivalence script confirmed all 59 extracted files match the
  previous `HEAD` data URI payloads.
- 2026-06-08: Verified `npm run test:publish-rules`,
  `npm run test:scripts`, and `npm run build:all`; `publish:copy` reported
  the new presentation asset directories and
  `.vitepress/dist/consult/zhenfund-token-grant-pitch-assets`.
- 2026-06-08: Rendered affected pages/decks in browser at `1440x900` and
  `390x844`, including the slides/sections that contain the extracted raster
  assets. Screenshot evidence was captured under `/tmp/lip-raster-visual` and
  `/tmp/lip-meetup-selector`.
