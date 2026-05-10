# Codebase Architecture Hardening

## Goal

Deepen the repo modules that publish and verify the LIP site so source layout changes fail fast before GitHub Pages deploys stale or broken output.

## Current State

- No `.planning/phases/*` execution source exists for this task.
- This plan is the pre-execution source of truth for the hybrid pipeline run.
- The user has already asked to execute, repeat the pass, and commit along the way.

## Architecture Vocabulary

- **Module**: the publish rules, quality gate, and slide builders.
- **Interface**: npm scripts, CLI commands, exported verifier functions, and source-layout conventions in `AGENTS.md`.
- **Seam**: source files and folders are transformed into `.vitepress/dist` through build scripts.
- **Adapter**: each publish rule maps one canonical source location into one generated output location.

## Big Issues To Fix

1. `publish:check` only verifies that standalone publish targets exist. It can pass when copied files or asset directories are stale.
2. The local asset checker only reads `src` and `href`, so local references in `srcset`, CSS `url(...)`, or `@import` can miss the quality gate.
3. `slides:build` writes Slidev output to `../.vitepress/dist`, outside the repo root when run from this package.
4. Marp slide output uses only the markdown basename as the slug, so two decks with the same basename would silently overwrite each other.

## Acceptance Criteria

- `npm run publish:check` reports stale standalone outputs as failures.
- `npm run quality:check` includes stale standalone outputs in the quality gate.
- Local reference validation covers HTML attributes, `srcset`, CSS `url(...)`, and CSS `@import`.
- `npm run slides:build` targets `.vitepress/dist/slides/slidev`.
- Marp build fails with a clear error if two scanned decks resolve to the same output slug.
- Verification commands pass after generated output is refreshed.

## Execution Notes

- Commit each coherent slice.
- Avoid touching unrelated content edits in `ai-coding/ultrathink-to-goal/` except generated publish output.
- Repeat the architecture audit after the first fixes and continue only if another big issue remains.
