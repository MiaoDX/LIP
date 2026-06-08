---
refactor_scope: orphan-public-lobster-assets
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: orphan public lobster assets

## Status

DONE

## Target

Remove the stale `public/images/lobster/` passthrough asset bundle after the
affected low-cost deck copies moved to deck-local asset folders.

## Materiality

- P2: stale public surface. The three `public/images/lobster/*.png` files still
  publish as root passthrough assets even though current deck sources reference
  `presentations/*-assets/` copies instead.
- Leaving the old public URLs reachable makes future agents wonder whether
  root-absolute deck image references are still supported after
  `refactor-standalone-root-asset-refs.md` closed that migration.

## Accepted Cleanup Checklist

- Confirm no current non-plan source references `/images/lobster` or
  `public/images/lobster`.
- Remove only the orphaned `public/images/lobster/` images.
- Keep the deck-local `presentations/*-assets/` copies intact.

## Evidence Ladder

- L0: targeted `rg` for root lobster asset references outside `docs/plans/`.
- L1: `npm run test:publish-rules`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.
- L2: confirm `.vitepress/dist/images/lobster/` is absent after rebuild.

## Stop Condition

Stop when no current source references the root public lobster asset bundle,
the public passthrough copies are gone from rebuilt output, and repository gates
still pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found the old passthrough
  asset files still tracked while current decks use deck-local copies.
- 2026-06-08: Removed the orphaned public lobster images, kept deck-local
  copies intact, and verified rebuilt output no longer contains
  `.vitepress/dist/images/lobster/`.
