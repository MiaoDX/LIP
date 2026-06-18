---
refactor_scope: completed-refactor-ledger
status: DONE
accepted_severities:
  - P1
  - P2
last_verified: 2026-06-18
---

# Completed Refactor Ledger

## Status

DONE

## Purpose

This ledger replaces completed one-shot refactor gate files. Keep active or
reopened gates as their own `docs/plans/<slug>.md` files while work is in
progress; once a gate is done and the current repo state is the source of truth,
record it here and remove the standalone gate.

## Completed Gates

| Former file | Scope | Status | Last verified |
| --- | --- | --- | --- |
| `codebase-architecture-hardening.md` | codebase architecture hardening | DONE | 2026-06-06 |
| `refactor-agent-radar-current-state.md` | agent radar current state | DONE | 2026-06-08 |
| `refactor-bestpractice-index-coverage.md` | bestpractice index coverage | DONE | 2026-06-08 |
| `refactor-bestpractice-panorama-count.md` | bestpractice panorama count | DONE | 2026-06-08 |
| `refactor-clean-output-link-check.md` | clean output link check | DONE | 2026-06-08 |
| `refactor-consult-public-boundary.md` | consult public boundary | DONE | 2026-06-08 |
| `refactor-current-truth-entropy.md` | current truth entropy | DONE | 2026-06-06 |
| `refactor-deployment-guide-runtime-snapshot.md` | deployment guide runtime snapshot | DONE | 2026-06-08 |
| `refactor-deployment-guide-shared-workspace.md` | deployment guide shared workspace | DONE | 2026-06-08 |
| `refactor-draft-queue-review-evidence.md` | draft queue review evidence | DONE | 2026-06-08 |
| `refactor-duplicate-meetup-share-article.md` | duplicate meetup share article | DONE | 2026-06-08 |
| `refactor-home-frontmatter-link-gate.md` | home frontmatter link gate | DONE | 2026-06-08 |
| `refactor-index-coverage-gate.md` | index coverage gate | DONE | 2026-06-08 |
| `refactor-indexed-article-link-gate.md` | indexed article link gate | DONE | 2026-06-08 |
| `refactor-link-check-duplicate-config-scan.md` | link check duplicate config scan | DONE | 2026-06-17 |
| `refactor-marp-build-clean-output.md` | Marp build clean output | DONE | 2026-06-08 |
| `refactor-meetup-shared-repo-resource.md` | Meetup shared repo resource | DONE | 2026-06-08 |
| `refactor-orphan-public-lobster-assets.md` | orphan public lobster assets | DONE | 2026-06-08 |
| `refactor-public-discussions-link-gate.md` | public discussions link gate | DONE | 2026-06-08 |
| `refactor-public-markdown-link-gate.md` | public Markdown link gate | DONE | 2026-06-08 |
| `refactor-public-subindex-coverage.md` | public subindex coverage | DONE | 2026-06-08 |
| `refactor-publish-ref-extraction.md` | publish ref extraction | DONE | 2026-06-17 |
| `refactor-publish-rules-private-tables.md` | publish rules private tables | DONE | 2026-06-17 |
| `refactor-quality-check-clean-output.md` | quality check clean output | DONE | 2026-06-08 |
| `refactor-readme-directory-routes.md` | README directory routes | DONE | 2026-06-08 |
| `refactor-reduce-entropy-2026-06-08.md` | reduce entropy 2026-06-08 | DONE | 2026-06-08 |
| `refactor-reduce-entropy-loop.md` | reduce entropy loop | DONE | 2026-06-06 |
| `refactor-reusable-shared-repo-guidance.md` | reusable shared repo guidance | DONE | 2026-06-08 |
| `refactor-roboharness-export-launcher.md` | roboharness export launcher | DONE | 2026-06-17 |
| `refactor-script-dead-surfaces.md` | script dead surfaces | DONE | 2026-06-17 |
| `refactor-share-publishing-checklist.md` | share publishing checklist | DONE | 2026-06-08 |
| `refactor-share-weekly-source-ownership.md` | share weekly source ownership | DONE | 2026-06-08 |
| `refactor-slashless-directory-route-gate.md` | slashless directory route gate | DONE | 2026-06-08 |
| `refactor-slidev-build-clean-output.md` | Slidev build clean output | DONE | 2026-06-08 |
| `refactor-stale-theme-css.md` | stale theme CSS | DONE | 2026-06-17 |
| `refactor-standalone-raster-data-uri-assets.md` | standalone raster data URI assets | DONE | 2026-06-08 |
| `refactor-standalone-root-asset-refs.md` | standalone root asset refs | DONE | 2026-06-08 |
| `refactor-template-source-ownership.md` | template source ownership | DONE | 2026-06-08 |
| `refactor-theme-nav-fallback.md` | theme nav fallback | DONE | 2026-06-17 |
| `refactor-typecheck-build-gate.md` | typecheck build gate | DONE | 2026-06-08 |
| `refactor-ultrathink-deck-count.md` | Ultrathink deck count | DONE | 2026-06-08 |
| `refactor-ultrathink-readme-directory-links.md` | Ultrathink README directory links | DONE | 2026-06-08 |
| `refactor-ultrathink-release-map-source.md` | Ultrathink release map source | DONE | 2026-06-17 |
| `refactor-unused-layout-import.md` | unused layout import | DONE | 2026-06-17 |
| `refactor-unused-theme-components.md` | unused theme components | DONE | 2026-06-17 |
| `refactor-zhenfund-consult-public-proof.md` | ZhenFund consult public proof | DONE | 2026-06-08 |

## Active Gate Policy

- Create a dedicated `docs/plans/<slug>.md` only for active, reopened, or
  approval-sensitive work that needs a persistent stop condition.
- Do not keep a separate gate after it reaches `DONE` unless it still carries
  reusable architecture context that is not captured elsewhere.
- Prefer source files, tests, runbooks, and this ledger over completed gate
  archaeology when determining current behavior.

## Evidence

- 2026-06-18: Replaced completed one-shot gates with this ledger and removed the
  unused raw Slidev export npm script.
