---
refactor_scope: quality-check-clean-output
status: DONE
accepted_severities:
  - P1
last_verified: null
---

# Refactor Scope: quality check clean output

## Status

DONE

## Target

Make `npm run quality:check` fail when required built-output checks are skipped
because `.vitepress/dist` is absent.

## Accepted Severities

- P1: `quality:check` currently exits 0 while reporting SKIP for the built
  standalone publish output and public operational doc boundary gates when
  `.vitepress/dist` does not exist.

## Architecture Packet

Zoom-out map: `quality:check` combines source-layout checks, scoped link checks,
and built-output checks into `.quality-report.md` and its CLI exit code.

Eng-review recommendation: Treat non-PASS gate statuses as failing verifier
states unless a future command explicitly introduces an advisory-only gate.

Public contract / boundary: `npm run quality:check` is documented as a
source-layout gate in `AGENTS.md` and `docs/agents/standalone-decks.md`.

Data flow: `main()` builds gate rows, writes the quality report, then derives
the process exit code from gate statuses.

Accepted seam: `scripts/quality-check.mjs` exit-code behavior and regression
coverage in `scripts/quality-check.test.mjs`.

Rejected alternatives: Do not remove the SKIP rows; they are useful report
detail. Do not fold `docs:build` into `quality:check`; `build:all` already owns
the full build order.

Verification ladder: L1 CLI regression test, L1 direct clean-output command,
L1 normal script test suite, L2 full build.

Stop condition: Stop when SKIP no longer exits green, the regression test
protects the behavior, and `build:all` still passes with real built output.

## Accepted Cleanup Checklist

- Make skipped quality gates fail the CLI instead of exiting green.
- Add regression coverage for `.vitepress/dist` absent.
- Add the new regression to `npm run test:scripts`.
- Update this gate to DONE after verification.

## Parked Cross-Seam / Future Ideas

- Broad whole-site dead-link crawling remains parked.
- Refactoring all gate scripts into a shared verifier framework is parked until
  multiple scripts need the same abstraction.

## Evidence Ladder

- L1: `node scripts/quality-check.test.mjs`
- L1: `npm run test:scripts`
- L1: `npm run quality:check`
- L2: `npm run build:all`

## Stop Condition

Stop when the accepted checklist is complete, verification passes, and the
remaining observations are only future cleanup ideas outside this seam.

## Execution Log

- 2026-06-08: Gate created after reproducing `npm run quality:check` exiting 0
  with `.vitepress/dist` temporarily absent while the report showed two SKIP
  rows.
- 2026-06-08: Updated `quality:check` so every non-PASS gate status fails the
  CLI, added `scripts/quality-check.test.mjs`, and wired it into
  `npm run test:scripts`.
- 2026-06-08: Verification passed:
  - `node scripts/quality-check.test.mjs`
  - `npm run test:scripts`
  - `npm run quality:check` with `.vitepress/dist` temporarily absent exited 1
  - `npm run build:all`
