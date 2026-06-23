---
status: active
source_gate: docs/plans/refactor-architecture-cleanup-campaign.md
updated: 2026-06-23
---

# Architecture Cleanup Campaign Capsule

## Current Slice

Run fresh discovery handoff 1 after the initial queue is exhausted.

## Last Proof

Moved repeated script test command, module URL, temp workspace, cwd restore, and
cleanup setup to `scripts/test-workspace.mjs`; removed stale fake `site-map.mjs`
writes from build-script tests. Focused proof passed: `npm run test:scripts`
and `git diff --check`.

## Next Candidate

Fresh reduce-entropy discovery from current `HEAD`.

## Next Proof

High-noise summary, targeted source/reference searches, materiality gate for any
new candidates, and focused proof for any selected slice.

## Parked Gates

- Broad public publish-rule shape changes: no current stale public contract or
  false-green proof found.
- Generic script splitting: low value unless it removes a duplicate owner or
  stale surface.

## Stop Condition

Stop only after two consecutive fresh discovery handoffs after the latest commit
find no clear safe P1/P2 slice after shrink attempts, or when the next useful
slice requires a public migration decision or unavailable proof.
