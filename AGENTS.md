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
- `sites/miaodx.com/` is the public personal-site submodule. It owns `miaodx.com`, including the homepage and Resume, and deploys independently from `MiaoDX/MiaoDX.github.io`.

## Commands

- Install dependencies: `npm ci`
- Initialize private interview materials when authorized: `git submodule update --init interviews`
- Initialize the public personal site: `git submodule update --init sites/miaodx.com`
- Dev site: `npm run docs:dev`
- Personal site and Resume preview: `npm run site:dev`
- Full local/CI build and repo gates: `npm run build:all`
- Publish rule test: `npm run test:publish-rules`
- Script helper tests: `npm run test:scripts`
- Source-layout gate: `npm run build:all` in a clean checkout; use `npm run quality:check` only as a focused rerun after `.vitepress/dist` has been built/copied. It updates `.quality-report.md`.

## Branch and push policy

- When the user authorizes a push and does not request a PR or review branch, finish the work on `main` and push it to `origin/main`. Do not leave completed work available only on `agent/*`, `claude/*`, or other topic branches.
- Use a separate remote branch only when the user explicitly requests a PR/review flow, branch protection requires it, or the work is intentionally experimental or incomplete. State that reason at handoff.
- If work starts in a non-`main` worktree, integrate it using the repository's linear-history rules, verify that `origin/main` contains the final tree, and clean up the temporary remote branch when it no longer preserves unique work.
- For submodule changes, commit and push inside the submodule first, then commit and push the parent gitlink. Never let parent `main` reference a submodule commit that its remote cannot fetch.
- Before pushing or fast-forwarding another worktree, inspect it for local commits and uncommitted changes. Do not overwrite a dirty worktree; use an isolated worktree and report the remaining local state.

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

## Personal site

- Homepage copy and layout live in `sites/miaodx.com/content.js` and `sites/miaodx.com/editorial.jsx`.
- Resume content lives in `sites/miaodx.com/resume/resume-data.js`; both web and print layouts consume it.
- The personal site is intentionally excluded from LIP builds. Preview it with `npm run site:dev` and verify its own GitHub Pages workflow separately.
- Commit and push inside `sites/miaodx.com/` first, then commit the updated gitlink in LIP. Do not edit the old sibling checkout as a second source.

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
