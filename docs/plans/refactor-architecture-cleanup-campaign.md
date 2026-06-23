---
refactor_scope: architecture-cleanup-campaign
status: CONTINUE
accepted_severities:
  - P1
  - P2
campaign_overlay: true
last_verified: 2026-06-23
---

# Architecture Cleanup Campaign

## Scope

Repeated behavior-preserving refactor slices that make the repository smaller,
truer, and easier to navigate. Prefer deleting stale surfaces, merging duplicate
owners, moving callers to canonical owners, removing compatibility shims, and
bounded module deepening.

## Verification Inventory

- `npm run typecheck`
- `npm run test:publish-rules`
- `npm run test:scripts`
- `npm run link:check`
- `npm run build:all`
- `git diff --check`
- Standalone deck visual proof is required only for deck source changes.

## Current Quality Signal

- Script modules own overlapping route/path and filesystem traversal helpers.
- Refactor ledger shows prior one-shot gates are complete; active campaign state
  should stay compact.

## Architecture Pressure

Route, publish, link, and quality gates should expose one obvious owner for each
repo concept. Tests should prove current owners instead of keeping stale private
names alive.

## Accepted Checklist

- Move public route candidate logic to the Markdown route utility owner and
  migrate link checking to that owner.
- Merge duplicate local filesystem helper modules only when a focused slice can
  preserve behavior and reduce caller knowledge.
- Continue fresh discovery after the clear queue is exhausted.

## Surface Metrics

- Stale surfaces removed: 0
- Duplicate concept owners merged: 0
- Current callers migrated to one owner: 1
- Tests/docs updated away from stale names: 1
- New owners added: 0
- Public contracts touched: 0

## Parked Gates

- None yet.

## Stop Condition

Stop only after two consecutive fresh discovery handoffs after the latest commit
find no clear safe P1/P2 slice after shrink attempts, or when the next useful
slice requires a public migration decision or unavailable proof.

## Evidence

- 2026-06-23: Baseline focused proof passed:
  `node scripts/markdown-route-utils.test.mjs && node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`
  and `npm run typecheck`.
- 2026-06-23: Moved public route candidate generation from link checking to the
  Markdown route utility owner. Focused proof passed:
  `node scripts/markdown-route-utils.test.mjs && node scripts/link-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
