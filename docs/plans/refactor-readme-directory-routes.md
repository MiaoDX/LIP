---
refactor_scope: readme-directory-routes
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: README directory routes

## Status

DONE

## Target

Make the README content map distinguish publishable site routes from source-only
directories, and make `npm run link:check` fail when a first-read page links a
directory that has no VitePress `index.md` route.

## Accepted Severities

- P1: `README.md` can link a directory such as `proposals/` while
  `npm run link:check` exits green even when no `proposals/index.md` or
  generated `proposals/index.html` route exists.

## Accepted Cleanup Checklist

- Add a real `proposals/` landing page for the public proposal documents.
- Keep README directory entries clickable only when they resolve to a
  publishable route or an intentional Markdown file.
- Treat relative directory links as routes that require `index.md`, not as
  valid links merely because a raw source directory exists.
- Add regression coverage for missing relative directory routes.
- Add proposal index coverage so future proposal files cannot silently miss the
  public landing page.

## Parked Cross-Seam / Future Ideas

- Do not create landing pages for every source-only folder just to make the
  README table prettier.
- Do not run a broad full-site crawler in this slice; scoped first-read link
  checking remains the intended gate.

## Evidence Ladder

- L0: targeted checks for `proposals/index.md` and README source-only directory
  links.
- L1: `node scripts/link-check.test.mjs`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L2: `npm run build:all`.

## Stop Condition

Stop when README no longer presents source-only folders as broken public routes,
`proposals/` has a real landing page, the missing-directory-route regression is
covered, and verification passes.

## Execution Log

- 2026-06-08: Gate created after reproducing that `README.md` linked
  `proposals/`, `proposals/index.md` and `.vitepress/dist/proposals/index.html`
  were absent, and scoped link checking still passed.
- 2026-06-08: Added `proposals/index.md`, changed README content-map entries
  so source-only folders are code paths instead of public links, and tightened
  relative directory link checking so a raw source directory no longer counts
  as a valid route.
- 2026-06-08: Preserved relative standalone deck directory links by resolving
  them through the existing standalone publish target map.
- 2026-06-08: Added `proposals/index.md` to the scoped index coverage rules so
  future proposal files must be linked from the proposal landing page.
- 2026-06-08: Verification passed:
  - `node scripts/link-check.test.mjs`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
