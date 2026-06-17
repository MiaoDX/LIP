---
refactor_scope: stale-theme-css
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: stale theme CSS

## Status

DONE

## Target

Remove stale VitePress theme CSS selectors with no source callers.

## Accepted Severities

- P2: `.te-lang-switch` is an older language-switcher selector while the active
  layout uses scoped `.lang-switcher`.

## Accepted Cleanup Checklist

- Delete the unused `.te-lang-switch` global stylesheet block.
- Verify no tracked source caller remains.
- Keep the active `.lang-switcher` scoped styles in `Layout.vue`.

## Parked Cross-Seam / Future Ideas

- Full CSS usage analysis across standalone decks remains parked because those
  decks intentionally own local class systems.

## Evidence Ladder

- L0: `rg` for `.te-lang-switch`.
- L1: `npm run typecheck`.
- L2: `npm run docs:build`.

## Stop Condition

Stop when `.te-lang-switch` is gone, the active language switcher remains, and
typecheck plus docs build pass.

## Execution Log

- 2026-06-17: Gate created after search found `.te-lang-switch` only in the
  global theme stylesheet.
- 2026-06-17: Deleted the stale `.te-lang-switch` stylesheet block while
  leaving the active `.lang-switcher` scoped styles in `Layout.vue`. Verified
  with:
  - `git grep -n "te-lang-switch" -- ':!node_modules' ':!.vitepress/dist' ':!docs/plans'` (expected no matches)
  - `git grep -n "lang-switcher" -- .vitepress/theme/Layout.vue .vitepress/theme/style.css`
  - `npm run typecheck`
  - `npm run docs:build`
