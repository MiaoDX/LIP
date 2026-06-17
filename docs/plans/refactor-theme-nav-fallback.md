---
refactor_scope: theme-nav-fallback
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: theme nav fallback

## Status

DONE

## Target

Remove the duplicated hardcoded navigation fallback from
`.vitepress/theme/Layout.vue`.

## Accepted Severities

- P1: stale source-of-truth risk. Repo guidance says site navigation lives in
  `site-map.mjs`, but the theme still carries an older private fallback list.
- P2: compatibility fallback cleanup inside the VitePress theme boundary.

## Accepted Cleanup Checklist

- Make theme navigation come only from VitePress `themeConfig.nav`.
- Do not keep the older inline fallback route list.
- Keep normal configured navigation behavior unchanged.

## Parked Cross-Seam / Future Ideas

- Broader theme comments/style cleanup remains parked unless it blocks a
  concrete UI or build gate.

## Evidence Ladder

- L0: static search for the removed fallback route text.
- L1: `npm run typecheck`.
- L2: `npm run docs:build`.

## Stop Condition

Stop when the inline fallback nav is gone, the configured nav still builds from
`site-map.mjs`, typecheck and docs build pass, and no stale fallback route text
remains in `Layout.vue`.

## Execution Log

- 2026-06-17: Gate created for removing duplicated theme fallback navigation.
- 2026-06-17: Removed the inline fallback nav list so the theme uses
  `themeConfig.nav` from `site-map.mjs`. Verified with:
  - `rg -n "stories/2026-03-dual-agent-start|lessons/error-to-skill-evolution|now/2026-03|https://miaodx.com/" .vitepress/theme/Layout.vue` (expected no matches)
  - `npm run typecheck`
  - `npm run docs:build`
