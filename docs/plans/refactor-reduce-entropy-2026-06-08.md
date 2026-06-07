---
refactor_scope: reduce-entropy-2026-06-08
status: ACTIVE
accepted_severities:
  - P1
  - P2
last_verified: null
---

# Refactor Scope: reduce entropy 2026-06-08

## Status

ACTIVE

## Target

Continue the reduce-entropy loop after the completed 2026-06-06 gates, focusing
only on current material drift that can still mislead future readers or agents.

## Accepted Candidates

1. P1: First-read pages describe April 2026 as the latest/current month even
   though no May or June monthly report exists.
2. P1: Roadmap status wording mixes completed queue bookkeeping with draft
   publication readiness, and a pending identity-crisis task points to a stale
   filename while the real story already exists.
3. P2: `assets/sharing-20260321/` is a stale March sharing bundle outside the
   current standalone deck source layout.
4. P2: `bestpractice/weekly-robotics/index.md` says the digest is
   auto-generated every Friday, but the newest checked-in issue is May 8, 2026.

## Accepted Cleanup Checklist

- Replace time-relative "latest/current month" wording with explicit April 2026
  wording unless a new monthly report is actually added.
- Make roadmap draft entries describe queue tracking instead of completed
  publication, and point the identity-crisis follow-up at the existing story.
- Remove or re-home the stale March sharing bundle after confirming no in-repo
  consumer remains.
- Clarify the Weekly Robotics feed status unless a live generator is restored.

## Parked Items

- Do not rewrite historical articles, transcripts, old discussions, templates,
  or consult-page placeholder content without a task-specific owner.
- Do not reopen the 2026-06-06 publish ownership and architecture-hardening
  gates unless current verification contradicts their DONE state.

## Evidence Ladder

- L0: targeted `rg`, `find`, `cmp`, and publish-target checks for each edited
  surface.
- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all` after all accepted edits in this gate.

## Stop Condition

Stop when accepted candidates have either been executed or explicitly parked
because fresh evidence shows they are not material. The loop may stop before all
candidate slots are used when the next saturation audit returns no P1 or
material P2 work.

## Execution Log

- 2026-06-08: Gate created from the fresh reduce-entropy audit.
- 2026-06-08: Started the current-truth doc cleanup by replacing
  time-relative April monthly report labels, clarifying draft queue semantics
  in both roadmaps, pointing the identity-crisis follow-up at the existing
  story, and adding the missing English draft queue row for the GSD rug-pull
  draft.
