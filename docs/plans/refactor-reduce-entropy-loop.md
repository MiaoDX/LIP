---
refactor_scope: reduce-entropy-loop
status: DONE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: reduce entropy loop

## Status

DONE

## Target

Run five bounded entropy-reduction rounds across repo navigation, human/agent
doc boundaries, verification noise, and confirmed leftover files.

## Accepted Severities

- P1: Human-facing or agent-facing source-of-truth drift that points future work
  to the wrong repo, month, or workflow.
- P1: Verification commands that produce meaningless git churn during normal
  audit use.
- P2: Confirmed leftover files or wrappers with no in-repo consumers.

## Accepted Cleanup Checklist

- Round 1: Replace stale root README submodule/upstream workflow guidance with
  current standalone LIP repo guidance.
- Round 2: Align root and English latest-month entry links with the current
  April 2026 monthly page.
- Round 3: Make `npm run quality:check` stable by preserving the previous report
  timestamp when gate content has not changed.
- Round 4: Remove `ai-coding/roboharness-self-evaluating-agents/notes-test-delete.txt`.
- Round 5: Remove unused `scripts/quality-check.sh` wrapper and rely on the
  canonical npm script.

## Parked Cross-Seam / Future Ideas

- `public/draft/index.html` still describes `claw-agents-shared` draft review
  material. It may be historical or intentionally published; treat as a separate
  content-owner decision.
- A broader dead-link checker is still useful, but this loop is bounded to
  deterministic local checks.
- Historical articles, decks, and transcripts intentionally mention
  `claw-agents-shared`; do not rewrite them as repo guidance.

## Evidence Ladder

- L0: stale-path `rg` checks for each edited surface.
- L1: `npm run test:publish-rules`.
- L1: `npm run quality:check`.
- L2: `npm run publish:copy && npm run publish:check`.

## Stop Condition

Stop after exactly five accepted rounds, with the checklist complete, evidence
commands passing, and any remaining ideas recorded as parked.

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
