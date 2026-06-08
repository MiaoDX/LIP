---
refactor_scope: public-discussions-link-gate
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: public discussions link gate

## Status

DONE

## Target

Make the scoped local link gate cover the public `discussions/` archive without
failing on Markdown links embedded in examples.

## Materiality

- P2: false confidence. `README.md` describes `discussions/` as public
  Learn-in-Public context and VitePress builds it to `/discussions/*.html`, but
  the default link gate did not cover those pages.
- P2: recurring rediscovery. A direct `checkScopedLinks()` sweep over
  `discussions/` reported 19 missing links, but every one was a Markdown link
  inside a fenced or inline code example. That parser noise made the public
  archive look unsafe to add to the gate.

## Accepted Cleanup Checklist

- Ignore Markdown links inside fenced code blocks and inline code spans.
- Add regression coverage for code-example links.
- Derive scoped Markdown files from the public `discussions/` directory.
- Add regression coverage proving directory-scoped files are validated.

## Parked Cross-Seam / Future Ideas

- Do not add agent/process docs under `docs/agents/` or `docs/plans/` to the
  public link gate; VitePress excludes them from public output.
- Do not rewrite archival discussion content unless a real live link is broken.
- Do not replace VitePress `ignoreDeadLinks` in this slice; keep the repo-owned
  scoped gate as the explicit local signal.

## Evidence Ladder

- L0: `node scripts/markdown-route-utils.test.mjs`.
- L0: `node scripts/link-check.test.mjs`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when `discussions/` Markdown is included in the default scoped link gate,
code-example links do not trigger false positives, and verification passes.

## Execution Log

- 2026-06-08: Gate created after saturation audit found `discussions/` is
  public output but could not be added to scoped link validation without
  code-example false positives.
- 2026-06-08: Updated Markdown link extraction to ignore fenced code blocks and
  inline code spans containing Markdown-shaped links.
- 2026-06-08: Added directory-derived scoped Markdown files and enabled
  `discussions/` in the default link gate.
- 2026-06-08: Verification passed:
  - `node scripts/markdown-route-utils.test.mjs`
  - `node scripts/link-check.test.mjs`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
