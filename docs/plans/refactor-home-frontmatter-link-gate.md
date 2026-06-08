---
refactor_scope: home-frontmatter-link-gate
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: home frontmatter link gate

## Status

DONE

## Target

Make `npm run link:check` validate first-read VitePress frontmatter links, not
only Markdown body links and `site-map.mjs` routes.

## Materiality

- P1: false confidence. `index.md` and `en/index.md` put hero action and
  feature routes in YAML frontmatter `link:` fields, which render in the first
  viewport.
- Before this slice, `scripts/link-check.mjs` read Markdown body links and
  config `link`/`url` fields, but not Markdown frontmatter. A broken home-page
  action could pass `npm run link:check`, `quality:check`, and `build:all`.

## Accepted Cleanup Checklist

- Extract local `link:` and `url:` fields from leading Markdown frontmatter.
- Validate those links with the same local route resolver used for body links.
- Add regression coverage for missing and valid frontmatter routes.

## Evidence Ladder

- L0: `node scripts/markdown-route-utils.test.mjs`.
- L0: `node scripts/link-check.test.mjs`.
- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when broken frontmatter links fail the scoped link gate, current home-page
frontmatter links pass, and the existing repo verification commands stay green.

## Execution Log

- 2026-06-08: Gate created after saturation audit found first-viewport home
  page routes in frontmatter outside the current scoped link parser.
- 2026-06-08: Added frontmatter `link:` / `url:` extraction, wired it into
  the scoped link gate, and covered missing and valid frontmatter routes in the
  link-check tests.
- 2026-06-08: Verification passed:
  - `node scripts/markdown-route-utils.test.mjs`
  - `node scripts/link-check.test.mjs`
  - `npm run test:scripts`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
