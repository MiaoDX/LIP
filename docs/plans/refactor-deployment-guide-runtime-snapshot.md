---
refactor_scope: deployment-guide-runtime-snapshot
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: deployment guide runtime snapshot

## Status

DONE

## Target

Remove false current-state wording from the public OpenClaw deployment guide
while preserving the March 19 runtime details as a dated historical snapshot.

## Accepted Severities

- P1: `resources/deployment-guide-v2.md` is linked from the main sidebar and
  has an appendix titled `当前运行状态`, but the appendix itself is a
  2026-03-19 volatile snapshot.

## Accepted Cleanup Checklist

- Retitle the appendix as a dated runtime snapshot.
- Rephrase the warning so readers know the table is not live operational truth.
- Preserve the table values as historical deployment context.

## Parked Cross-Seam / Future Ideas

- Do not update model/provider names or deployment instructions from external
  sources in this slice.
- Do not remove the whole appendix unless a content owner decides the historical
  snapshot has no reader value.

## Evidence Ladder

- L0: targeted search for `当前运行状态` in first-read docs.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the deployment guide no longer presents the March 19 runtime table as
current state, scoped links pass, full build passes, and remaining deployment
guide freshness questions are parked.

## Execution Log

- 2026-06-08: Gate created after saturation audit found stale current-state
  wording in `resources/deployment-guide-v2.md`.
- 2026-06-08: Retitled the appendix from `当前运行状态` to
  `2026-03-19 运行快照` and clarified that the table records a historical
  deployment snapshot, not live operational truth.
- 2026-06-08: Verification passed:
  - `rg -n "当前运行状态|2026-03-19 运行快照|历史快照|最后更新：2026-03-19" README.md index.md en/index.md resources en/resources openclaw en/openclaw site-map.mjs docs/plans docs/agents`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
