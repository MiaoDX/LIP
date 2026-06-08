---
refactor_scope: indexed-article-link-gate
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: indexed article link gate

## Status

DONE

## Target

Make the scoped link gate validate local links inside public Markdown routes
that are already governed by section index coverage.

## Materiality

- P1: false confidence. `bestpractice/index.md` linked
  `/bestpractice/anthropic-infrastructure-noise`, but that indexed article
  linked to missing `/bestpractice/anthropic-managed-agents-scaling`.
- `npm run link:check` still passed because default scoped validation checked
  section indexes and selected first-read docs, not every public article that
  index coverage already treats as current.

## Accepted Cleanup Checklist

- Derive scoped Markdown validation files from existing index coverage rules.
- Keep intentional support and pointer exclusions centralized in the coverage
  rules.
- Add regression coverage showing an indexed article body link fails the gate.
- Remove the current broken local next-article pointer.

## Parked Cross-Seam / Future Ideas

- Do not convert this into a full historical site crawler.
- Do not generate next/previous navigation in this slice.
- Do not require excluded support pages to pass public article body-link
  validation unless they become indexed routes.

## Evidence Ladder

- L0: `node scripts/link-check.test.mjs`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when indexed article body links are checked by the default scoped gate, the
current broken article link is removed, and the verification commands pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found an indexed
  Best Practice article with a broken local next link while `npm run link:check`
  passed.
- 2026-06-08: Added indexed article Markdown files to the default scoped link
  set by deriving them from existing index coverage rules, with regression
  coverage for a broken local link inside a listed article.
- 2026-06-08: Removed the nonexistent next-article pointer from
  `bestpractice/anthropic-infrastructure-noise.md`.
- 2026-06-08: Verification passed:
  - `node scripts/link-check.test.mjs`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
