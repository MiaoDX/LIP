---
refactor_scope: unused-theme-components
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-17
---

# Refactor Scope: unused theme components

## Status

DONE

## Target

Delete unused custom VitePress theme components.

## Accepted Severities

- P1: dead registered components make the theme API look broader than the
  current content actually uses.
- P2: remove private component files and registrations with no in-repo callers.

## Accepted Cleanup Checklist

- Delete `Incident`, `PullQuote`, and `TwoCol` component registrations.
- Delete the unused component source files.
- Verify no tracked source content still uses those component tags.

## Parked Cross-Seam / Future Ideas

- Redesigning prose callouts or adding a new component system remains parked
  until content actually needs it.

## Evidence Ladder

- L0: `git grep` for component tag/import usage.
- L1: `npm run typecheck`.
- L2: `npm run docs:build`.

## Stop Condition

Stop when the unused files and registrations are gone, no tracked source caller
remains, and typecheck plus docs build pass.

## Execution Log

- 2026-06-17: Gate created after source search found only self-documenting
  comment usage in the three component files.
- 2026-06-17: Deleted the unused component files and removed their theme
  registrations. Verified with:
  - `git grep -n -E "<Incident|</Incident|<PullQuote|</PullQuote|<TwoCol|</TwoCol|from './components/(Incident|PullQuote|TwoCol)\\.vue'|app\\.component\\('(Incident|PullQuote|TwoCol)'" -- ':!node_modules' ':!.vitepress/dist'` (expected no matches)
  - `npm run typecheck`
  - `npm run docs:build`
