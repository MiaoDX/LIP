---
refactor_scope: ultrathink-deck-count
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: Ultrathink deck count

## Status

DONE

## Target

Align the AI Coding Ultrathink project README with the actual standalone deck
and transcript page count.

## Accepted Severity

- P2: `ai-coding/ultrathink-to-goal/README.md` said the current deck had 46
  pages while `transcript.md` said 44 and the HTML source contains 44 slide
  containers. Future speakers or agents could rehearse against the wrong source
  state.

## Accepted Cleanup Checklist

- Count the actual slide containers in `index.html`.
- Update the README status line to the actual 44-page deck count.
- Leave the transcript unchanged because it already matches the source deck.

## Evidence Ladder

- L0: `rg -c "<div class=\"slide( |\"|>)" ai-coding/ultrathink-to-goal/index.html`
- L0: `rg -n "当前 46 页|当前 44 页" ai-coding/ultrathink-to-goal`
- L1: `npm run link:check`

## Stop Condition

Stop when README and transcript agree with the counted deck source.

## Execution Log

- 2026-06-08: Counted 44 slide containers in `index.html` and updated the
  README status line from 46 pages to 44 pages.
