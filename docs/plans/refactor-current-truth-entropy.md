---
refactor_scope: current-truth-entropy
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: current truth entropy

## Status

DONE

## Target

Remove current-truth drift found by the 2026-06-06 entropy audit without
rewriting historical articles or changing public site behavior beyond removing
stale operational notes.

## Accepted Severities

- P1: root or public-facing files that state stale workflow/source ownership.
- P1: verification lists that can pass green while first-read routes drift by
  omission.
- P2: local environment setup that differs from CI and makes agent runs less
  reproducible.

## Accepted Cleanup Checklist

- Retire `JJ_MIGRATION.md` as live root guidance and update roadmap references
  to treat it as historical, not current workflow.
- Remove stale `public/images/lobster/README.md` operational copy and gate
  accidental `public/**/*.md` passthrough notes.
- Make `scripts/link-check.mjs` derive first-read route coverage from
  `site-map.mjs` where practical instead of relying only on a hand-maintained
  list.
- Add a local Node version pin that matches CI's Node 22 runtime.
- Compress the completed reduce-entropy loop gate so current status is visible
  before historical detail.

## Parked Cross-Seam / Future Ideas

- Historical articles, slides, proposals, and discussions can keep references
  to `jj`, `jj-mailbox`, and `claw-agents-shared` when they describe events
  from that period.
- Broad full-site dead-link crawling remains parked; scoped link checking is
  still intentionally narrower than a historical content crawler.
- Broader README/public Markdown publication policy can be revisited later if
  more intentional public README pages appear.

## Evidence Ladder

- L0: targeted stale-path searches.
- L1: `npm run test:publish-rules`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the accepted checklist is complete, the evidence commands pass, and
remaining findings are only historical-content wording or future cleanup ideas.

## Execution Log

- 2026-06-06: Gate created from `$intuitive-reduce-entropy` audit batch.
- 2026-06-06: Retired `JJ_MIGRATION.md` as live root guidance and updated both
  roadmaps to describe the jj trial as historical context.
- 2026-06-06: Removed stale `public/images/lobster/README.md`, added a
  source-ownership gate for `public/**/*.md`, and added regression coverage.
- 2026-06-06: Updated scoped link checking to derive first-read coverage from
  `site-map.mjs` nav/sidebar routes; this expanded checked files from 30 to 49
  and caught/fixed two broken draft-story relative links.
- 2026-06-06: Added `.node-version` with Node 22 to match CI.
- 2026-06-06: Compressed the completed multi-loop reduce-entropy gate into a
  current-state summary.
- 2026-06-06: Verification passed:
  - `npm run test:publish-rules`
  - `npm run link:check`
  - `npm run quality:check`
  - `npm run build:all`
  - `find .vitepress/dist -path '*lobster*README*' -o -path '*JJ_MIGRATION*'`
  - `find public -name '*.md' -print`
