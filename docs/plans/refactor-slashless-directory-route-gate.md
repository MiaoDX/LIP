---
refactor_scope: slashless-directory-route-gate
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: slashless directory route gate

## Status

DONE

## Target

Make the scoped link gate reject slashless links to directory-backed VitePress
index routes.

## Materiality

- P1: false confidence. Markdown links like `[Part A](/ai-coding)` passed
  `npm run link:check` because `ai-coding/index.md` existed.
- VitePress rendered that source link as `/LIP/ai-coding.html`, while the real
  generated route is `/LIP/ai-coding/index.html` from `ai-coding/index.md`.
  The gate stayed green even though first-read home-page links could resolve to
  missing output.

## Accepted Cleanup Checklist

- Treat `/section/` as a directory-index route and `/section` as a file-backed
  route in local route candidates.
- Fix current first-read body links that target directory indexes without a
  trailing slash.
- Add regression coverage for slashless directory links.

## Evidence Ladder

- L0: `node scripts/markdown-route-utils.test.mjs`.
- L0: `node scripts/link-check.test.mjs`.
- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when slashless directory-index links fail the scoped link gate, current
first-read links render to existing directory routes, and repo verification
stays green.

## Execution Log

- 2026-06-08: Gate created after saturation audit found first-read links in
  `index.md` and `en/index.md` rendering to missing `*.html` paths while the
  scoped link checker still passed.
- 2026-06-08: Tightened route candidates so slashless routes validate
  file-backed Markdown only, kept trailing-slash routes for directory indexes,
  and fixed the current home-page body links to directory routes.
- 2026-06-08: Verification passed:
  - `node scripts/markdown-route-utils.test.mjs`
  - `node scripts/link-check.test.mjs`
  - `npm run test:scripts`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
