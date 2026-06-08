---
refactor_scope: zhenfund-consult-public-proof
status: DONE
accepted_severities:
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: ZhenFund consult public proof

## Status

DONE

## Target

Remove stale public-proof copy from the current ZhenFund consult pitch page.
`public/consult/` is published as static output, so claims on this page must not
point readers at a dead or no-longer-public evidence surface.

## Accepted Severity

- P1: the page said `github.com/MiaoDX/claw-agents-shared` was completely
  public, but that public URL now returns 404 while the consult page remains a
  live public output source.

## Accepted Cleanup Checklist

- Remove the dead public shared-repo URL from the ZhenFund consult pitch.
- Reword proof copy around currently published surfaces: `miaodx.com/LIP` and
  the screenshots embedded in the page.
- Keep historical `claw-agents-shared` mentions in older articles and decks
  unchanged when they describe events rather than current public proof.

## Parked Items

- Do not rewrite historical share articles or old talks in this slice.
- Do not publish private shared-memory repository details as a replacement proof
  surface.

## Evidence Ladder

- L0: `rg -n "claw-agents-shared|Shared Repo|完全公开|GitHub \\+ Slack" public/consult/zhenfund-token-grant-pitch.html`
- L1: `npm run link:check`
- L2: `npm run build:all`

## Stop Condition

Stop when the current public consult pitch no longer claims the dead shared repo
is public evidence, and focused searches confirm the remaining copy names only
current public proof surfaces.

## Execution Log

- 2026-06-08: Replaced the dead shared-repo proof claim with LIP plus embedded
  page screenshots, and clarified that Git is the shared-memory mechanism rather
  than a current public proof URL.
