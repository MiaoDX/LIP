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

## Completed Checklist

- Move public route candidate logic to the Markdown route utility owner and
  migrate link checking to that owner.
- Move Marp deck detection and output slug calculation to the Marp builder owner
  and migrate link checking to that owner.
- Move operational Markdown/public-output boundary lists to the site map owner,
  including `docs/status/**` active capsules.
- Move repeated filesystem existence, tolerant directory reads, and recursive
  file walks to `scripts/file-utils.mjs`.
- Move repeated build-script child process execution to
  `scripts/command-runner.mjs`.
- Ran fresh discovery after the clear queue was exhausted.

## Current Slice Queue

- Move Slidev generated route/source ownership from link checking to the Slidev
  build module. Done in `94d32c9`.
- Move scoped index and index coverage policy from link checking to the site
  map owner. Done in `02f5b3b`.
- Shrink repeated script test workspace setup into a bounded internal helper if
  a safe slice remains after the route-policy moves. Done in current slice.

## Surface Metrics

- Stale surfaces removed: 2 stale fake `site-map.mjs` test writes
- Duplicate concept owners merged: 8
- Current callers migrated to one owner: 22
- Tests/docs updated away from stale names: 8
- New owners added: 3 internal owners (`file-utils`, `command-runner`,
  `test-workspace`)
- Public contracts touched: 0; operational public-output boundary preserved

## Parked Gates

- Broad public publish-rule shape changes: parked because no current stale
  public contract or false-green proof was found.
- Generic additional script splitting: parked as low value because remaining
  candidates would mostly move code by size instead of reducing a live concept.

## Stop Condition

Stop only after two consecutive fresh discovery handoffs after the latest commit
find no clear safe P1/P2 slice after shrink attempts, or when the next useful
slice requires a public migration decision or unavailable proof.

## Evidence

- 2026-06-23: Fresh discovery after campaign restart found three eligible
  internal slices: Slidev generated route ownership, site-map index coverage
  ownership, and script test harness deepening. Materiality gate accepted all
  three as P1/P2 recurring rediscovery reductions.
- 2026-06-23: Moved Slidev generated route/source ownership from
  `scripts/link-check.mjs` to `scripts/build-slidev.mjs`. Focused proof passed:
  `node scripts/build-slidev.test.mjs && node scripts/link-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved scoped index and index coverage policy from
  `scripts/link-check.mjs` to `site-map.mjs`. Focused proof passed:
  `node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved repeated script test command, module URL, temp workspace,
  cwd restore, and cleanup setup to `scripts/test-workspace.mjs`; removed stale
  fake `site-map.mjs` writes from build-script tests. Focused proof passed:
  `npm run test:scripts` and `git diff --check`.
- 2026-06-23: Fresh discovery handoff 1 after commit `22dd7a6` found a safe P1
  tracked-file owner slice. Moved `git ls-files` command capture and parsing
  from link/quality gates to `scripts/file-utils.mjs`. Focused proof passed:
  `node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Fresh discovery handoff 1 after commit `8ebcbbf` found a safe P1
  publish-rule source root slice. Shared standalone source root constants
  between publish copy rules and source-ownership checks. Focused proof passed:
  `npm run test:publish-rules`, `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Baseline focused proof passed:
  `node scripts/markdown-route-utils.test.mjs && node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`
  and `npm run typecheck`.
- 2026-06-23: Moved public route candidate generation from link checking to the
  Markdown route utility owner. Focused proof passed:
  `node scripts/markdown-route-utils.test.mjs && node scripts/link-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved Marp deck detection and output slug calculation from link
  checking to the Marp builder owner. Focused proof passed:
  `node scripts/build-slides.test.mjs && node scripts/link-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved operational doc boundary lists to `site-map.mjs` and added
  `docs/status/**` to the agent/process-only boundary. Focused proof passed:
  `node scripts/link-check.test.mjs && node scripts/quality-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved repeated filesystem existence, directory read, and file walk
  helpers to `scripts/file-utils.mjs`. Focused proof passed:
  `node scripts/build-slides.test.mjs && node scripts/link-check.test.mjs &&
  node scripts/publish-rules.test.mjs && node scripts/quality-check.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Moved repeated build-script child process execution to
  `scripts/command-runner.mjs`. Focused proof passed:
  `node scripts/build-slidev.test.mjs && node scripts/build-slides.test.mjs`,
  `npm run typecheck`, and `git diff --check`.
- 2026-06-23: Fresh discovery handoff 1 after commit `1fbda4a` found no clear
  safe P1/P2 stale-surface deletion, duplicate-owner merge, canonical-owner
  move, or compatibility-shim removal. `npm run test:scripts` passed.
- 2026-06-23: Fresh discovery handoff 2 after commit `1fbda4a` found no clear
  safe P1/P2 slice after shrink attempts. `node scripts/link-check.mjs`,
  `npm run publish:check`, and `npm run quality:check` passed.
