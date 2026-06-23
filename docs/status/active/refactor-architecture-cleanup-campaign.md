---
status: active
source_gate: docs/plans/refactor-architecture-cleanup-campaign.md
updated: 2026-06-23
---

# Architecture Cleanup Campaign Capsule

## Current Slice

Run fresh discovery handoff 1 after tracked file owner migration.

## Last Proof

Moved `git ls-files` command capture and parsing from link/quality gates to
`scripts/file-utils.mjs`. Focused proof passed:
`node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`,
`npm run typecheck`, and `git diff --check`.

## Next Candidate

Fresh reduce-entropy discovery handoff after tracked file owner migration.

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
