---
status: active
source_gate: docs/plans/refactor-architecture-cleanup-campaign.md
updated: 2026-06-23
---

# Architecture Cleanup Campaign Capsule

## Current Slice

Shrink repeated script test workspace setup into a bounded internal helper if a
safe slice remains after route-policy ownership is consolidated.

## Last Proof

Moved scoped index and index coverage policy from `scripts/link-check.mjs` to
`site-map.mjs`. Focused proof passed:
`node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`,
`npm run typecheck`, and `git diff --check`.

## Next Candidate

Shrink repeated script test workspace setup into a bounded internal helper if a
safe slice remains after route-policy ownership is consolidated.

## Next Proof

Focused proof depends on the accepted helper scope; likely
`node scripts/build-slides.test.mjs && node scripts/build-slidev.test.mjs &&
node scripts/link-check.test.mjs && node scripts/publish-rules.test.mjs`,
`npm run typecheck`, and `git diff --check`.

## Parked Gates

- Broad public publish-rule shape changes: no current stale public contract or
  false-green proof found.
- Generic script splitting: low value unless it removes a duplicate owner or
  stale surface.

## Stop Condition

Stop only after two consecutive fresh discovery handoffs after the latest commit
find no clear safe P1/P2 slice after shrink attempts, or when the next useful
slice requires a public migration decision or unavailable proof.
