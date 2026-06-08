---
refactor_scope: template-source-ownership
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: template source ownership

## Status

DONE

## Target

Make the standalone source ownership gate validate the canonical deck template
starter, while ignoring commented example attributes inside that template.

## Materiality

- P2: false confidence. `AGENTS.md`, `docs/agents/standalone-decks.md`, and
  `templates/README.md` tell agents to start new decks from
  `templates/deck/index.html`, but `npm run publish:check` only validates
  `presentations`, `ai-coding`, and `public/consult` local refs.
- P2: recurring rediscovery. The template intentionally contains commented
  example refs like `src="images/your-shot.png"`; without a comment-aware check,
  agents have to rediscover why the canonical starter cannot simply join the
  source-ownership gate.

## Accepted Cleanup Checklist

- Add `templates` to standalone source local-reference roots.
- Ignore HTML comments before extracting real `src`, `href`, `poster`, and
  `srcset` refs.
- Add regression coverage proving commented template examples are ignored and
  real missing template refs are rejected.

## Parked Cross-Seam / Future Ideas

- Do not publish `templates/deck/index.html`; it remains a starter source, not
  a public deck.
- Do not replace the template's inline SVG placeholder in this slice; existing
  guidance already parks placeholder SVGs as intentional.

## Evidence Ladder

- L1: `npm run test:publish-rules`
- L1: `npm run test:scripts`
- L1: `npm run publish:check`
- L2: `npm run build:all`

## Stop Condition

Stop when the template is covered by the source ownership gate, commented
example attributes do not create false positives, real missing template refs do
fail the gate, and all evidence commands pass.

## Execution Log

- 2026-06-08: Gate created after saturation audit found the canonical deck
  starter was outside source-ownership local ref checks.
- 2026-06-08: Added `templates` to source ownership local-reference roots,
  stripped HTML comments before extracting asset refs, and added regression
  coverage for ignored commented examples plus real missing template runtime
  refs.
- 2026-06-08: Verification passed:
  - `npm run test:publish-rules`
  - `npm run publish:check`
  - `npm run test:scripts`
  - `npm run build:all`
