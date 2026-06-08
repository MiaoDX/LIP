---
refactor_scope: duplicate-meetup-share-article
status: DONE
accepted_severities:
  - P2
last_verified: 2026-06-08
---

# Refactor Scope: duplicate meetup share article

## Status

DONE

## Target

Remove a byte-for-byte duplicate public share article while preserving the old
public route as a pointer to the canonical page.

## Accepted Severities

- P2: `share/meetup-beijing-2026-03.md` and
  `share/meetup-multiagent-practice.md` had identical SHA-256 content, but only
  `/share/meetup-beijing-2026-03` is linked from the Chinese and English share
  indexes. Because both files had `marp: true`, the duplicate also produced two
  public VitePress pages and two Marp outputs for one article.

## Accepted Cleanup Checklist

- Keep `share/meetup-beijing-2026-03.md` as the canonical full article.
- Replace `share/meetup-multiagent-practice.md` with a short pointer to the
  canonical route so existing external URLs remain useful.
- Remove the duplicate Marp output by making the pointer page non-Marp.

## Parked Cross-Seam / Future Ideas

- Do not rewrite historical March meetup copy as part of this slice.
- Broader duplicate detection can be revisited if more exact content clones
  appear; this pass fixes the confirmed duplicate.

## Evidence Ladder

- L0: `sha256sum` before the edit confirmed exact duplicate content.
- L0: `npm run marp:build` should no longer build
  `meetup-multiagent-practice.html`.
- L1: `npm run link:check`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop when there is one canonical full article, the old route points to it, the
duplicate Marp output is gone, and repository gates pass.

## Execution Log

- 2026-06-08: Confirmed the two share Markdown files had identical SHA-256
  content and that only `/share/meetup-beijing-2026-03` is linked from share
  indexes.
- 2026-06-08: Replaced the unlinked duplicate with a short canonical pointer.
