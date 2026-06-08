---
refactor_scope: bestpractice-index-coverage
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: bestpractice index coverage

## Status

DONE

## Target

Make `bestpractice/index.md` a reliable public first-read index for the current
checked-in Best Practice article set.

## Accepted Severities

- P1: live source drift or first-read index drift that hides current articles.
- P2: target-local ordering or metadata drift that makes the index contradict
  its own maintenance contract.

## Accepted Cleanup Checklist

- Add missing current articles from `bestpractice/*.md` to the public article
  table when they are real analyses, not support pages.
- Preserve `ai-lab-actions`, `panorama`, and `weekly-robotics` as support/index
  surfaces instead of forcing them into the article table.
- Reorder the table by `Discussed` date so it matches the page's stated
  maintenance rule.
- Verify the index covers all current article files except the intentionally
  excluded support/index surfaces.

## Parked Cross-Seam / Future Ideas

- Do not create a generated article registry in this slice; a direct table is
  enough for the current repo size.
- Do not rewrite article bodies or refresh external source facts while fixing
  the index.

## Evidence Ladder

- L0: targeted coverage script proving no article file is missing from
  `bestpractice/index.md`.
- L1: `npm run link:check`.
- L2: `npm run build:all` if the focused link gate or source changes suggest a
  broader build risk.

## Stop Condition

Stop when every current Best Practice analysis article is linked from
`bestpractice/index.md`, excluded support pages are named in this gate, the
table order matches the page contract, and the focused evidence commands pass.

## Execution Log

- 2026-06-08: Gate created after the reduce-entropy audit found four current
  Best Practice article files absent from the public article table.
- 2026-06-08: Added the missing AlphaEvolve, Mistral CLI, and NVIDIA Dynamo
  articles to `bestpractice/index.md`, then reordered the table by `Discussed`
  date to match its stated contract.
- 2026-06-08: Verification passed:
  - targeted coverage script for top-level `bestpractice/*.md` analysis
    articles, excluding `index`, `ai-lab-actions`, and `panorama`
  - `npm run link:check`
  - `npm run build:all`
