---
refactor_scope: ultrathink-readme-directory-links
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: Ultrathink README directory links

## Status

DONE

## Target

Keep the public Ultrathink project README from linking to source directories
that do not have VitePress index routes.

## Materiality

- P2: false confidence and workflow friction. `ai-coding/ultrathink-to-goal/README.md`
  is built to `/ai-coding/ultrathink-to-goal/README.html`, but links like
  `./research/`, `./screenshots/`, and `./scripts/` resolve as public directory
  routes with no `index.html`.
- `npm run link:check` passed because this canonical project README was not in
  the default scoped link set.

## Accepted Cleanup Checklist

- Keep non-indexed source folders as visible labels instead of public links.
- Link the scripts entry to its actual `scripts/README.md` route.
- Add the canonical Ultrathink project README to the scoped link gate.

## Parked Cross-Seam / Future Ideas

- Do not add generated directory indexes for research, screenshots, or scripts
  in this slice.
- Do not change the standalone deck HTML.
- Do not broaden the gate to every AI Coding sidecar Markdown file until a
  separate material failure justifies that surface.

## Evidence Ladder

- L0: scoped check for `ai-coding/ultrathink-to-goal/README.md`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the README has no links to missing directory routes, the default
scoped link gate covers it, and verification passes.

## Execution Log

- 2026-06-08: Gate created after saturation audit found public README directory
  links that worked as source-folder hints but rendered to missing site routes.
- 2026-06-08: Changed non-indexed `research/` and `screenshots/` entries to
  source-folder labels, linked the scripts entry to `scripts/README.md`, and
  added the canonical README to the default scoped link gate.
- 2026-06-08: Verification passed:
  - scoped check for `ai-coding/ultrathink-to-goal/README.md`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
