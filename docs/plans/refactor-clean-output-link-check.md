---
refactor_scope: clean-output-link-check
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: clean output link check

## Status

DONE

## Target

Make `npm run link:check` reliable before `.vitepress/dist` exists, matching
the order used by `npm run build:all` and CI.

## Accepted Severities

- P1: `link:check` can pass locally by reading stale `.vitepress/dist` output,
  while the same command fails in a clean checkout before `docs:build`.

## Accepted Cleanup Checklist

- Treat VitePress `.html` routes as valid when their Markdown source exists.
- Treat generated Marp HTML routes as valid from current Marp source, not only
  from prior `.vitepress/dist` output.
- Add regression coverage for source-backed `.html` routes with no dist output.
- Add regression coverage for Marp-generated HTML routes with no dist output.

## Parked Cross-Seam / Future Ideas

- Broad full-site link crawling remains outside this gate.
- English sidebar draft queue parity is parked unless future evidence shows
  real navigation drift beyond index coverage.

## Evidence Ladder

- L1: `npm run test:scripts`.
- L1: `npm run link:check` with `.vitepress/dist` temporarily absent.
- L1: `npm run link:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when `link:check` passes both with and without existing `.vitepress/dist`,
the script regression tests cover both source-backed `.html` and Marp-generated
HTML routes, `npm run build:all` passes, and remaining findings are parked.

## Execution Log

- 2026-06-08: Gate created from a fresh reduce-entropy saturation audit after
  reproducing a clean-output `link:check` failure.
- 2026-06-08: Updated `scripts/link-check.mjs` so VitePress `.html` links can
  resolve from their Markdown source before `.vitepress/dist` exists, and so
  `/slides/marp/<slug>.html` resolves from current Marp frontmatter sources.
- 2026-06-08: Added regression coverage for source-backed `.html` routes,
  Marp-generated HTML routes, and missing source-backed `.html` routes without
  relying on generated output.
- 2026-06-08: Verification passed:
  - `node scripts/link-check.test.mjs`
  - `node scripts/markdown-route-utils.test.mjs`
  - `npm run link:check` with `.vitepress/dist` temporarily absent
  - `npm run test:scripts`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
