# Active Capsule: Architecture Cleanup Campaign

Source gate: `docs/plans/refactor-architecture-cleanup-campaign.md`

Latest user intent: high-autonomy architecture cleanup campaign with verified,
atomic refactor slices.

Current slice: commit verified public route candidate generation move.

Last proof: `node scripts/markdown-route-utils.test.mjs && node
scripts/link-check.test.mjs` passed; `npm run typecheck` passed; `git diff
--check` passed.

Next candidate: shrink duplicate filesystem helper ownership into a safe slice
only if it reduces caller knowledge without changing public publish/link
behavior.

Next proof: focused script tests for touched modules, `npm run typecheck`, `git
diff --check`.

Parked work: none yet.

Stop condition: stop only after two consecutive fresh discovery handoffs after
latest commit find no clear safe P1/P2 slice after shrink attempts, or when the
next useful slice needs public migration or unavailable proof.
