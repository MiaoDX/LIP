---
refactor_scope: draft-queue-review-evidence
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: draft queue review evidence

## Status

DONE

## Target

Keep the current draft queue review surfaces aligned with the actual checked-in
drafts so monthly cleanup decisions do not start from stale status or misleading
article-length evidence.

## Accepted Severities

- P1: live source drift in the current draft indexes.
- P1: false-confidence risk in the generated quality report metric.
- P2: local test coverage needed to keep the metric stable.

## Accepted Cleanup Checklist

- Replace stale draft index wording that still says the cross-instance
  collaboration draft is only 95 characters.
- Make the English draft index carry the same current editorial status.
- Count mixed Chinese/English article length with `Intl.Segmenter` and label the
  generated report column as `词数` instead of `字数`.
- Add a focused quality-check regression for CJK/mixed-language word counting.
- Regenerate `.quality-report.md` with the current metric.

## Parked Cross-Seam / Future Ideas

- Do not promote, rewrite, or delete drafts in this slice; publication readiness
  is an editorial decision.
- Do not broaden the quality score rubric beyond fixing the misleading length
  count.

## Evidence Ladder

- L0: targeted `rg` for stale draft status and report terminology.
- L1: `node scripts/quality-check.test.mjs`.
- L1: `npm run test:scripts`.
- L1: `npm run link:check`.
- L2: `npm run build:all` if this slice is followed by more build-affecting
  changes before commit.

## Stop Condition

Stop when the draft indexes no longer contradict the current draft content, the
quality report uses a CJK-aware word metric, the report has been regenerated,
and the focused script tests pass.

## Execution Log

- 2026-06-08: Gate created from fresh saturation audit. The materiality gate
  accepted this as live source drift plus false-confidence cleanup.
- 2026-06-08: Updated both draft indexes, switched quality-report length
  evidence to CJK-aware `词数`, added a focused regression test, and
  regenerated `.quality-report.md`.
