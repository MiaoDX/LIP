---
refactor_scope: codebase-architecture-hardening
status: DONE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: codebase architecture hardening

## Status

DONE

## Goal

Deepen the repo modules that publish and verify the LIP site so source layout changes fail fast before GitHub Pages deploys stale or broken output.

## Current State

- This gate is complete.
- The implementation finished in five passes and the accepted checklist is
  represented by the current publish, quality, Marp, Slidev, and deploy
  scripts.
- No active architecture-hardening task remains in this gate.

## Architecture Vocabulary

- **Module**: the publish rules, quality gate, and slide builders.
- **Interface**: npm scripts, CLI commands, exported verifier functions, and source-layout conventions in `AGENTS.md`.
- **Seam**: source files and folders are transformed into `.vitepress/dist` through build scripts.
- **Adapter**: each publish rule maps one canonical source location into one generated output location.

## Completed Issues

1. `publish:check` only verifies that standalone publish targets exist. It can pass when copied files or asset directories are stale.
2. The local asset checker only reads `src` and `href`, so local references in `srcset`, CSS `url(...)`, or `@import` can miss the quality gate.
3. `slides:build` encodes a relative Slidev output path whose meaning depends on whether Slidev resolves from the deck root or package root.
4. Marp slide output uses only the markdown basename as the slug, so two decks with the same basename would silently overwrite each other.
5. `publish:copy` verifies stale standalone outputs after the fact, but it does not own a sync manifest, so removed source files can leave old generated files behind.
6. Local reference validation covers CSS embedded in HTML, but standalone external `.css` files can still hide missing `url(...)` assets or `@import` files.
7. The deploy workflow duplicates the local build sequence instead of calling the `build:all` interface, so local and CI verification can drift.

## Acceptance Criteria

- `npm run publish:check` reports stale standalone outputs as failures.
- `npm run quality:check` includes stale standalone outputs in the quality gate.
- Local reference validation covers HTML attributes, `srcset`, CSS `url(...)`, and CSS `@import`.
- `npm run slides:build` targets `.vitepress/dist/slides/slidev`.
- Marp build fails with a clear error if two scanned decks resolve to the same output slug.
- `npm run publish:copy` removes stale files that were previously copied from standalone sources without deleting adjacent VitePress-generated output.
- Local reference validation also scans standalone `.css` files under the canonical source roots.
- GitHub Pages deployment uses `npm run build:all` as the single build interface.
- Verification commands pass after generated output is refreshed.

## Parked Cross-Seam / Future Ideas

- Further broad dead-link crawling remains outside this gate.
- Future standalone deck visual QA belongs to the deck-specific runbook and
  `/browse` evidence, not this publish-script hardening gate.

## Pass Log

- Pass 1: deepened standalone publish verification and added regression coverage.
- Pass 2: moved Slidev output handling into a build module with an absolute output path, and added Marp slug collision protection.
- Pass 3: deepened standalone publish copy into a manifest-backed sync so removed sources clean up their generated files.
- Pass 4: extended local reference validation to standalone CSS files so copied stylesheets cannot hide missing assets.
- Pass 5: routed GitHub Pages deployment through `npm run build:all` so CI and local builds share the same interface.

## Evidence Ladder

- L1: `npm run test:publish-rules`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop because the accepted architecture-hardening issues have been implemented,
the current scripts own the canonical behavior, and remaining cleanup ideas are
outside this gate.
