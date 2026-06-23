---
status: done
source_gate: docs/plans/refactor-architecture-cleanup-campaign.md
updated: 2026-06-23
---

# Architecture Cleanup Campaign Capsule

## Current Slice

Campaign saturated after two consecutive no-clear discovery handoffs.

## Last Proof

Fresh discovery handoff 2 after commit `faf8278` found no clear safe P1/P2
slice after shrink attempts. Materiality gate returned `stop_recommended: true`
for an empty candidate set.

## Next Candidate

None.

## Next Proof

Final focused proof: `npm run test:scripts` and `git diff --check`.

## Parked Gates

- Broad public publish-rule shape changes: no current stale public contract or
  false-green proof found.
- Generic script splitting: low value unless it removes a duplicate owner or
  stale surface.
- External-nav behavior in `.vitepress/config.mts` / theme runtime: parked as
  runtime-facing behavior that needs a separate product/browser gate.

## Stop Condition

Stop only after two consecutive fresh discovery handoffs after the latest commit
find no clear safe P1/P2 slice after shrink attempts, or when the next useful
slice requires a public migration decision or unavailable proof.
