---
refactor_scope: link-check-duplicate-config-scan
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: link check duplicate config scan

## Status

DONE

## Target

Remove the duplicate text-regex config scan from `scripts/link-check.mjs`.
`site-map.mjs` is already imported as structured data, so nav and sidebar route
validation should come from `navByLocale` and `sidebar`, not a second regex over
the same file.

## Accepted Severities

- P1: duplicate source-of-truth route validation can make future changes
  preserve a stale regex path as if it were a separate required contract.
- P2: internal dead-option cleanup inside the link-check script boundary.

## Accepted Cleanup Checklist

- Delete `SCOPED_CONFIG_FILES`, `FIELD_LINK_RE`, `configLinks`, and
  `checkConfigFile`.
- Remove the `scopedConfigFiles` option from `checkScopedLinks`.
- Keep structured nav/sidebar route validation through `configuredRoutes()` and
  direct configured-route existence checks.
- Update tests that still pass `scopedConfigFiles: []`.

## Parked Cross-Seam / Future Ideas

- Broader link-check folder coverage and route normalization stay parked.
- Public route behavior for Markdown/frontmatter links stays unchanged.

## Evidence Ladder

- L0: `rg` for removed config-scan names.
- L1: `npm run test:scripts`.

## Stop Condition

Stop when the duplicate config-scan path is gone, no in-repo references remain,
script tests pass, and `checkScopedLinks()` still validates structured
site-map routes plus scoped Markdown links.

## Execution Log

- 2026-06-17: Gate created for duplicate route-checking model removal.
- 2026-06-17: Removed the text-regex config scan, replaced it with structured
  configured-route checks, and updated tests to inject `configuredRouteLinks`
  when isolating Markdown behavior. Verified with:
  - `rg -n "SCOPED_CONFIG_FILES|FIELD_LINK_RE|configLinks|checkConfigFile|scopedConfigFiles" scripts/link-check.mjs scripts/link-check.test.mjs`
  - `npm run test:scripts`
