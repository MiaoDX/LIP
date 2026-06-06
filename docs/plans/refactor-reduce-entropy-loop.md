---
refactor_scope: reduce-entropy-loop
status: CONTINUE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: null
---

# Refactor Scope: reduce entropy loop

## Status

CONTINUE

## Target

Run a second five-round entropy-reduction loop across public doc boundaries,
published stale pages, operating specs, link verification, and the root content
map.

## Accepted Severities

- P1: Agent-operational or process docs accidentally published as public site
  content.
- P1: Stale public pages that point readers to the wrong repo or workflow.
- P1: Public navigation or first-read docs that can drift without a local gate.
- P2: Content-map drift that makes the next human or agent rediscover current
  repo shape.

## Accepted Cleanup Checklist

- Round 1: Fence root and `docs/**` operational Markdown from VitePress public
  output, and add a quality gate for accidental publication.
- Round 2: Retire stale `public/draft/index.html` content that still points to
  `claw-agents-shared`.
- Round 3: Move the Agent Radar operating spec out of the public `share/`
  surface and into agent runbooks.
- Round 4: Add a scoped local link gate for public navigation and first-read
  Markdown links.
- Round 5: Refresh the root README content map to match the current site and
  source-layout conventions.

## Parked Cross-Seam / Future Ideas

- Historical articles, decks, and transcripts intentionally mention
  `claw-agents-shared`; do not rewrite them as repo guidance.
- Broad dead-link validation across all historical content remains parked; this
  loop only gates public navigation and first-read docs.
- `ai-coding/roboharness-self-evaluating-agents/export-navy.html` is a local
  launcher with no current public route; leave it alone unless deck ownership
  asks for a source-layout change.

## Evidence Ladder

- L0: stale-path and output-boundary `rg` / `find` checks for each edited
  surface.
- L1: `npm run test:publish-rules`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop after exactly five second-loop rounds, with the checklist complete, each
coherent slice committed, evidence commands passing, and any remaining ideas
recorded as parked.

## Execution Log

- 2026-06-06: Gate created for five-round reduce-entropy loop.
- 2026-06-06: Round 1 replaced stale `claw-agents-shared` submodule workflow
  guidance in `README.md` with current standalone `MiaoDX/LIP` guidance.
- 2026-06-06: Round 2 aligned latest-month links in `README.md`, `index.md`,
  and `site-map.mjs` with the April 2026 monthly page.
- 2026-06-06: Round 3 made `.quality-report.md` timestamp-stable when report
  content is unchanged.
- 2026-06-06: Round 4 removed
  `ai-coding/roboharness-self-evaluating-agents/notes-test-delete.txt`.
- 2026-06-06: Round 5 removed unused `scripts/quality-check.sh`.
- 2026-06-06: Verification:
  - stale-path `rg` checks
  - `npm run test:publish-rules`
  - `npm run quality:check`
  - second `npm run quality:check` stability check
  - `npm run publish:copy && npm run publish:check`
- 2026-06-06: Second loop reopened with five accepted rounds from the entropy
  audit batch.
- 2026-06-06: Second loop Round 1 fenced operational Markdown from public
  VitePress output with `srcExclude`, added the `Public operational doc
  boundary` quality gate, verified `npm run build:all`, `npm run quality:check`,
  and confirmed no `AGENTS.html`, `CLAUDE.html`, `JJ_MIGRATION.html`,
  `docs/agents`, or `docs/plans` output remains in `.vitepress/dist`.
- 2026-06-06: Second loop Round 2 removed stale `public/draft/index.html`;
  `rg` showed no current in-repo consumers beyond this loop gate.
