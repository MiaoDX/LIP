---
refactor_scope: meetup-shared-repo-resource
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: Meetup shared repo resource

## Status

DONE

## Target

Remove a dead public GitHub resource link from the March 2026 multi-agent
meetup recap while preserving the historical article body.

## Accepted Severity

- P2: the article is linked from the current share indexes and its related
  resources section pointed readers at `github.com/MiaoDX/claw-agents-shared`,
  which now returns 404.

## Accepted Cleanup Checklist

- Keep historical body references to the Git-based shared-repo pattern.
- Replace the dead related-resource link with a note that the shared record
  repository is no longer a public resource entry.
- Apply the same fix to the duplicate meetup recap source.

## Parked Items

- Do not rewrite older talks, proposals, or drafts that mention
  `claw-agents-shared` as historical context.
- Do not broaden this slice into a full historical external-link crawl.

## Evidence Ladder

- L0: `curl -I -L https://github.com/MiaoDX/claw-agents-shared`
- L0: `rg -n "\\[MiaoDX/claw-agents-shared\\]|github.com/MiaoDX/claw-agents-shared" share`
- L1: `npm run link:check`

## Stop Condition

Stop when current meetup article resources no longer link readers to the dead
shared-repo URL and scoped local links still pass.

## Execution Log

- 2026-06-08: Confirmed the public GitHub URL returns 404, then replaced the
  related-resource link in both duplicate meetup recap sources with an explicit
  non-public historical note.
