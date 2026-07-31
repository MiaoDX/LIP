# AGENTS.md

Repo-level startup instructions for coding agents.

## Read first

- `README.md` for project purpose, content map, and publishing conventions.
- `ARCHITECTURE.md` for source owners, build flow, and proof boundaries.
- `STATUS.md` for current maintenance focus, supported commands, and known blockers.
- `docs/agents/README.md` for repo-specific agent runbooks.
- `CONTEXT.md` and `docs/adr/` when present. Absence is not a problem; see `docs/agents/domain.md`.

## Project shape

- This is a VitePress/GitHub Pages docs repo for Learn In Public content, with standalone HTML decks and AI Coding project decks.
- Site navigation, sidebar groups, and Marp scan directories live in `site-map.mjs`. Update that module instead of duplicating section lists in VitePress config or build scripts.
- Standalone HTML publishing is owned by `scripts/publish-rules.mjs`, called from `.github/workflows/deploy.yml`. Do not edit `.vitepress/dist/` or other generated output directly.
- `interviews/` is a private submodule and must never enter public build output. It is optional for public-site work and requires repository access to initialize.

## Commands

- Install dependencies: `npm ci`
- Initialize private interview materials when authorized: `git submodule update --init interviews`
- Dev site: `npm run docs:dev`
- Full local/CI build and repo gates: `npm run build:all`
- Publish rule test: `npm run test:publish-rules`
- Script helper tests: `npm run test:scripts`
- Source-layout gate: `npm run build:all` in a clean checkout; use `npm run quality:check` only as a focused rerun after `.vitepress/dist` has been built/copied. It updates `.quality-report.md`.

## Agent runbooks

- Issue tracker: `docs/agents/issue-tracker.md`; use `gh` from repo root for `MiaoDX/LIP`.
- Triage labels: `docs/agents/triage-labels.md`.
- Domain docs: `docs/agents/domain.md`.
- LSP/MCP status: `docs/agents/lsp-mcp.md`.
- Standalone deck source, path, copy, template, punctuation, and visual verification rules: `docs/agents/standalone-decks.md`.

## Private interview materials

- Company-specific preparation lives in `interviews/external_interviews/<company-slug>/brief.md`.
- Reusable private facts and speaking scripts live in `interviews/external_interviews/_common/`.
- Optional company HTML stays inside its company directory with local assets and is opened locally; it is not published by LIP.
- Commit and push inside the submodule first, then commit the updated gitlink in LIP with a generic parent commit message.
- Do not reorganize legacy interview records or copy submodule content into `share/`, `presentations/`, `public/`, or other public source directories without explicit approval.

## Standalone deck rules

- Start new HTML/PPT decks from `templates/deck/index.html`; see `templates/README.md`.
- General share decks live in `presentations/`; AI Coding project decks live in `ai-coding/<slug>/index.html`; consult pages live in `public/consult/`.
- `ai-coding/ultrathink-to-goal/index.html` is the canonical source for the "从 Ultrathink 到 Goal" presentation; assets belong in `ai-coding/ultrathink-to-goal/images/`.
- Keep deck assets inside the deck's own source folder. Do not rely on sibling project folders or `raw.githubusercontent.com` unless that dependency is intentional.
- For deck changes, render affected slides via `/browse` at `1440x900` and `390x844` before declaring done.
- Visible slide copy should prefer fragment-style text without unnecessary sentence-ending `。`, `.`, or `；`.

## Preferred skills

- `$intuitive-init` for agent guidance initialization and refresh.
- `$intuitive-doc` for human-facing docs and doc drift.
- `$intuitive-tests` for test-suite structure and behavior-focused cleanup.
- `$intuitive-flow` as the default build/change entrypoint.
- `$intuitive-preflight` before vague or approval-sensitive work.
- `$intuitive-refactor` before broad architecture or refactor work.
- `$intuitive-reduce-entropy` for periodic repo maintenance.
- `$intuitive-squash` for cleaning local agent commit history before handoff.
