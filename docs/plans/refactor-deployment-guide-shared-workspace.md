---
refactor_scope: deployment-guide-shared-workspace
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: deployment guide shared workspace

## Status

DONE

## Target

Keep the current public OpenClaw deployment guide from sending readers toward a
retired private shared repository while preserving the dated March deployment
snapshot as historical evidence.

## Accepted Severities

- P1: `resources/deployment-guide-v2.md` is linked from README, `resources/`,
  and the VitePress sidebar as a current deployment guide, but its dual-agent
  setup section used `claw-agents-shared/` and
  `/data/workspace/claw-agents-shared` as live-looking commands even though the
  public GitHub URL now returns 404.

## Accepted Cleanup Checklist

- Make the current setup instructions describe a user-owned private shared
  repository, not the retired project-specific repo name.
- Keep `claw-agents-shared` only in the dated 2026-03-19 runtime snapshot where
  it describes historical state.
- Verify current local links and public output gates still pass.

## Parked Cross-Seam / Future Ideas

- The broader guide still contains March 2026 model and platform details by
  design; those already carry dated/stability labels and should be refreshed
  only by an OpenClaw deployment owner.
- Historical talks and discussions can keep `claw-agents-shared` references
  when they describe March 2026 events.

## Evidence Ladder

- L0: targeted `rg` confirming live setup commands no longer name the retired
  repo, while the dated appendix keeps the historical label.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when the current setup section is generic, the historical appendix remains
explicitly dated, and the repository gates pass.

## Execution Log

- 2026-06-08: Confirmed `github.com/MiaoDX/claw-agents-shared` returns 404,
  while the linked OpenClaw docs and Railway template are reachable.
- 2026-06-08: Replaced the live-looking shared-repo setup path with a generic
  user-owned private repo example and kept the retired repo name only in the
  historical runtime snapshot.
