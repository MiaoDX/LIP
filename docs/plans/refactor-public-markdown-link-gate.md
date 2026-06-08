---
refactor_scope: public-markdown-link-gate
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: public Markdown link gate

## Status

DONE

## Target

Make `npm run link:check` validate every tracked Markdown source that VitePress
publishes, instead of relying on an expanding curated list of first-read and
sidecar pages.

## Materiality

- P1: false confidence. VitePress builds many Markdown sidecar pages under
  `ai-coding/`, `share/`, `slides/`, `templates/`, and similar public surfaces,
  but the scoped link gate had to be manually expanded from 50 to 107 files as
  new false-green gaps were discovered.
- P1: recurring rediscovery. After the code-example parser fix, all tracked
  public Markdown sources are link-clean, so keeping a curated subset would
  preserve a known blind spot without reducing noise.

## Accepted Cleanup Checklist

- Derive default Markdown link-check inputs from tracked `*.md` files.
- Exclude only Markdown sources that VitePress should not publish:
  `AGENTS.md`, `CLAUDE.md`, `.quality-report.md`, `docs/agents/**`, and
  `docs/plans/**`.
- Keep explicit `scopedMarkdownFiles` overrides for focused tests and ad hoc
  debugging.
- Add regression coverage proving default mode includes public sidecar Markdown
  and excludes private plan/runbook Markdown.

## Parked Cross-Seam / Future Ideas

- Do not check `docs/agents/**` or `docs/plans/**` local links in this public
  gate; those are agent/process docs excluded from VitePress output.
- Do not make this an external-link crawler.
- Do not change VitePress `ignoreDeadLinks` in this slice.

## Evidence Ladder

- L0: `node scripts/link-check.test.mjs`.
- L0: `node scripts/markdown-route-utils.test.mjs`.
- L1: `npm run link:check`.
- L1: `npm run test:scripts`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the default scoped link gate derives its Markdown inputs from the
tracked public Markdown source set, all evidence commands pass, and the default
file count reflects the public source set rather than a curated subset.

## Execution Log

- 2026-06-08: Gate created after saturation audit found 140 tracked public
  Markdown sources were link-clean while the default link gate still covered a
  manually curated 107-file subset.
- 2026-06-08: Replaced the curated default Markdown list with tracked Markdown
  discovery plus explicit public-output exclusions for agent/process docs and
  the generated quality report.
- 2026-06-08: Added regression coverage proving default mode checks tracked
  public sidecar Markdown while excluding `docs/plans/**`.
- 2026-06-08: Verification passed:
  - `node scripts/link-check.test.mjs`
  - `node scripts/markdown-route-utils.test.mjs`
  - `npm run link:check`
  - `npm run test:scripts`
  - `npm run quality:check`
  - `npm run build:all`
