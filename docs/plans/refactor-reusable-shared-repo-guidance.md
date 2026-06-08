---
refactor_scope: reusable-shared-repo-guidance
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: reusable shared repo guidance

## Status

DONE

## Target

Remove live-looking `claw-agents-shared` guidance from current reusable docs and
drafts while leaving historical event records unchanged.

## Accepted Severities

- P1: `bestpractice/google-reasoningbank-agent-self-evolving.md` is linked from
  the current best-practice index and told readers to create memory paths under
  `claw-agents-shared`, a retired private repo name whose public URL returns
  404.
- P1: `drafts/lessons/cross-instance-collaboration.md` and its English mirror
  are exposed from the draft sidebars and used `claw-agents-shared` in live
  sync commands, including a direct GitHub push URL to `MiaoDX/claw-agents-shared`.

## Accepted Cleanup Checklist

- Replace reusable best-practice memory examples with a generic user-owned
  shared repo path.
- Replace draft collaboration commands with generic private shared repo naming.
- Keep historical stories, presentations, discussions, and dated source notes
  unchanged when they describe March 2026 events.

## Parked Cross-Seam / Future Ideas

- Broader historical-content rewrites remain parked; old talks and stories may
  name `claw-agents-shared` as part of their original record.
- The cross-instance collaboration draft still needs an editorial publication
  decision, but that is not part of this entropy slice.

## Evidence Ladder

- L0: targeted `rg` confirming current reusable surfaces no longer present
  `claw-agents-shared` as live setup guidance.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when current reusable docs use generic shared-repo language, historical
references remain scoped to historical surfaces, and the repository gates pass.

## Execution Log

- 2026-06-08: Replaced best-practice ReasoningBank examples and action items
  with a generic team-owned shared repo.
- 2026-06-08: Replaced cross-instance collaboration draft commands and the
  English summary with generic private shared repo language.
