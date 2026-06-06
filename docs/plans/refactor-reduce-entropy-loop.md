---
refactor_scope: reduce-entropy-loop
status: DONE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: reduce entropy loop

## Status

DONE

## Target

Run repeated reduce-entropy loops across public doc boundaries, published stale
pages, operating specs, link verification, and the root content map.

This gate is complete. The detailed per-cycle execution log was compressed on
2026-06-06 after the sixth loop closed; the full historical diff remains in git
history.

## Completed Summary

- Removed stale root and submodule-oriented guidance from current repo docs.
- Fenced agent/process Markdown from public VitePress output.
- Moved Agent Radar operating notes out of public share content.
- Added scoped first-read link verification and expanded it across the main
  Chinese and English entry pages.
- Refreshed current public source-of-truth pages across README, home pages,
  AI Coding, OpenClaw/resources, roadmaps, weekly robotics, drafts, share, and
  English mirrors.
- Fixed standalone share/source ownership drift around weekly HTML output.
- Kept historical articles, talks, proposals, and transcripts intact when old
  repo names were part of the story rather than live guidance.

## Parked Cross-Seam / Future Ideas

- Historical articles, decks, and transcripts intentionally mention
  `claw-agents-shared`; do not rewrite them as repo guidance.
- Broad dead-link validation across all historical content remains parked; the
  current local gate protects public navigation and first-read docs.
- `ai-coding/roboharness-self-evaluating-agents/export-navy.html` is a local
  launcher with no current public route; leave it alone unless deck ownership
  asks for a source-layout change.

## Evidence Ladder

- L0: stale-path and output-boundary `rg` / `find` checks for each edited
  surface.
- L1: `npm run test:publish-rules`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop because six completed loops have already closed the accepted checklist and
the remaining observations are historical-content wording, future cleanup ideas,
or new slices that require their own gate.

## Execution Log

- 2026-06-06: Original multi-loop gate completed through six entropy-reduction
  loops with final verification passing:
  - `npm run build:all`
  - `npm run link:check`
  - `npm run test:publish-rules`
  - `npm run quality:check`
- 2026-06-06: Gate compressed to this summary because it was DONE and had
  become a historical log rather than an active source of truth.
