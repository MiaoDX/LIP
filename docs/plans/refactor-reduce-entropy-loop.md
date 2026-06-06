---
refactor_scope: reduce-entropy-loop
status: DONE
accepted_severities:
  - P0
  - P1
  - P2
last_verified: 2026-06-06
---

# Refactor Scope: reduce entropy loop

## Status

DONE

## Target

Run a second five-round entropy-reduction loop across public doc boundaries,
published stale pages, operating specs, link verification, and the root content
map.

## Accepted Severities

- P1: Agent-operational or process docs accidentally published as public site
  content.
- P1: Stale public pages that point readers to the wrong repo or workflow.
- P1: Public navigation or first-read docs that can drift without a local gate.
- P2: Content-map drift that makes the next human or agent rediscover current
  repo shape.

## Accepted Cleanup Checklist

- Round 1: Fence root and `docs/**` operational Markdown from VitePress public
  output, and add a quality gate for accidental publication.
- Round 2: Retire stale `public/draft/index.html` content that still points to
  `claw-agents-shared`.
- Round 3: Move the Agent Radar operating spec out of the public `share/`
  surface and into agent runbooks.
- Round 4: Add a scoped local link gate for public navigation and first-read
  Markdown links.
- Round 5: Refresh the root README content map to match the current site and
  source-layout conventions.

## Parked Cross-Seam / Future Ideas

- Historical articles, decks, and transcripts intentionally mention
  `claw-agents-shared`; do not rewrite them as repo guidance.
- Broad dead-link validation across all historical content remains parked; this
  loop only gates public navigation and first-read docs.
- `ai-coding/roboharness-self-evaluating-agents/export-navy.html` is a local
  launcher with no current public route; leave it alone unless deck ownership
  asks for a source-layout change.

## Evidence Ladder

- L0: stale-path and output-boundary `rg` / `find` checks for each edited
  surface.
- L1: `npm run test:publish-rules`.
- L1: `npm run quality:check`.
- L2: `npm run build:all`.

## Stop Condition

Stop after exactly five second-loop rounds, with the checklist complete, each
coherent slice committed, evidence commands passing, and any remaining ideas
recorded as parked.

Reopened third-loop stop condition: run five fresh reduce-entropy audits from
the current repository state, refactor the highest-value bounded finding from
each audit, verify, and commit each cycle separately.

Reopened fourth-loop stop condition: run five fresh reduce-entropy audits from
the current repository state, refactor the highest-value bounded finding from
each audit, verify, and commit each cycle separately.

Reopened fifth-loop stop condition: run five fresh reduce-entropy audits from
the current repository state, refactor the highest-value bounded finding from
each audit, verify, and commit each cycle separately.

## Execution Log

- 2026-06-06: Gate created for five-round reduce-entropy loop.
- 2026-06-06: Round 1 replaced stale `claw-agents-shared` submodule workflow
  guidance in `README.md` with current standalone `MiaoDX/LIP` guidance.
- 2026-06-06: Round 2 aligned latest-month links in `README.md`, `index.md`,
  and `site-map.mjs` with the April 2026 monthly page.
- 2026-06-06: Round 3 made `.quality-report.md` timestamp-stable when report
  content is unchanged.
- 2026-06-06: Round 4 removed
  `ai-coding/roboharness-self-evaluating-agents/notes-test-delete.txt`.
- 2026-06-06: Round 5 removed unused `scripts/quality-check.sh`.
- 2026-06-06: Verification:
  - stale-path `rg` checks
  - `npm run test:publish-rules`
  - `npm run quality:check`
  - second `npm run quality:check` stability check
  - `npm run publish:copy && npm run publish:check`
- 2026-06-06: Second loop reopened with five accepted rounds from the entropy
  audit batch.
- 2026-06-06: Second loop Round 1 fenced operational Markdown from public
  VitePress output with `srcExclude`, added the `Public operational doc
  boundary` quality gate, verified `npm run build:all`, `npm run quality:check`,
  and confirmed no `AGENTS.html`, `CLAUDE.html`, `JJ_MIGRATION.html`,
  `docs/agents`, or `docs/plans` output remains in `.vitepress/dist`.
- 2026-06-06: Second loop Round 2 removed stale `public/draft/index.html`;
  `rg` showed no current in-repo consumers beyond this loop gate.
- 2026-06-06: Second loop Round 3 moved the Agent Radar operating protocol
  from public `share/agent-radar/SYSTEM.md` to `docs/agents/agent-radar.md`
  and indexed it in `docs/agents/README.md`.
- 2026-06-06: Second loop Round 4 added `scripts/link-check.mjs`, exposed
  `npm run link:check`, and wired scoped navigation / first-read Markdown link
  validation into `npm run quality:check`.
- 2026-06-06: Second loop Round 5 refreshed the root README content map to
  include current AI Coding, OpenClaw, bestpractice, English, agent-doc,
  script, template, public, and asset surfaces; README now also names the
  public operational-doc boundary and consult-page source convention.
- 2026-06-06: Final second-loop verification passed:
  - `npm run link:check`
  - `npm run test:publish-rules`
  - `npm run quality:check`
  - `npm run build:all`
- 2026-06-06: Third loop reopened because the previous run executed one
  accepted audit batch rather than five fresh reruns.
- 2026-06-06: Third loop Cycle 1 selected a P2 source-of-truth cleanup:
  duplicate NVIDIA Agentic Extreme Co-Design analyses lived at both
  `bestpractice/nvidia-agentic-extreme-co-design.md` and
  `bestpractice/nvidia-agentic-extreme-codesign.md`, while neither route was
  linked from `bestpractice/index.md`. The richer `codesign` route is now the
  canonical public article and the shorter duplicate route was removed.
- 2026-06-06: Third loop Cycle 2 selected a P1 false-green public navigation
  cleanup: `bestpractice/index.md` had prominent links to missing
  `/bestpractice/ai-lab-actions` and `/bestpractice/ai-engineering-blogs`
  routes, but the scoped link gate did not check that landing page. The action
  tracker route now exists, the duplicate engineering-blogs link points to the
  canonical panorama page, `bestpractice/index.md` is now covered by
  `npm run link:check`, and the checker resolves standalone share routes from
  `scripts/publish-rules.mjs` instead of stale generated output.
- 2026-06-06: Third loop Cycle 3 selected a P2 agent-runbook drift cleanup:
  `share/README.md` still described publish flow as push/copy oriented and
  only mentioned optional sidebar edits, while the current repo owns
  navigation in `site-map.mjs` and verifies public routes with `link:check`,
  `publish:check`, and `quality:check`. The share checklist now points at the
  canonical navigation module and local gates before push.
- 2026-06-06: Third loop Cycle 4 selected a P1 mirror-route verification
  cleanup: English section indexes had many first-read internal routes, but
  `npm run link:check` only covered the English home page. The scoped link gate
  now also checks `en/ai-coding/`, `en/drafts/`, `en/lessons/`,
  `en/openclaw/`, `en/resources/`, `en/share/`, and `en/stories/` indexes.
- 2026-06-06: Third loop Cycle 5 selected a P2 English mirror drift cleanup:
  `en/ai-coding/index.md` still said the section was mostly OpenClaw and only
  linked one March deck, while the Chinese AI Coding index already exposed the
  current Routines, Roboharness, and Ultrathink materials. The English index now
  mirrors the current AI Coding public surface with existing routes covered by
  the scoped link gate.
- 2026-06-06: Final third-loop verification passed:
  - `npm run build:all`
  - `npm run link:check`
  - `npm run test:publish-rules`
  - `npm run quality:check`
- 2026-06-06: Fourth loop reopened for five additional fresh audits.
- 2026-06-06: Fourth loop Cycle 1 selected a P2 public-doc source-of-truth
  cleanup: `resources/config-guide.md` was still a WIP placeholder linked as a
  configuration guide from the public resources surface. The guide now names
  the concrete OpenClaw config entry points, template, environment variables,
  model/fallback/subagent settings, Slack, web search, CDP, Cron timezone, and
  save/check workflow; both sidebars expose the guide beside deployment, and
  both roadmaps mark the config-guide expansion complete.
- 2026-06-06: Fourth loop Cycle 2 selected a P1 public-route verification
  cleanup: `openclaw/index.md` linked readers to `/resources/`, but the
  Chinese resources landing page did not exist, the config template lived in
  `resources/` without being published as a static JSON file, and the scoped
  link gate did not check the OpenClaw/resources first-read pages. The repo now
  has `resources/index.md`, the English resources index no longer carries
  placeholder copy, the template is served from `public/resources/`, and
  `npm run link:check` covers `openclaw/index.md`, `resources/index.md`, and
  `resources/config-guide.md`.
- 2026-06-06: Fourth loop Cycle 3 selected a P2 first-read drift cleanup:
  `ai-coding/index.md` still described the section as mostly OpenClaw and
  still accumulating, while the page already linked current Routines,
  Roboharness, Ultrathink, and AI Coding for Research materials. The Chinese
  AI Coding index now describes the current published surface and removes
  stale "slides in progress" language; `npm run link:check` now covers the
  Chinese AI Coding index alongside the English mirror.
- 2026-06-06: Fourth loop Cycle 4 selected a P2 home-page source-of-truth
  cleanup: `index.md` still sent the "AI Coding 主线" hero action to the dual
  Agent story and described AI Coding as still mostly OpenClaw, after the
  Chinese AI Coding index had been refreshed around Routines, Roboharness,
  Ultrathink/Goal, prompts, routines, harnesses, and verification evidence.
  The home page now links the AI Coding action to `/ai-coding/` and summarizes
  the current AI Coding engineering surface.
- 2026-06-06: Fourth loop Cycle 5 selected a P2 public-roadmap source-of-truth
  cleanup: `ROADMAP.md` and `en/ROADMAP.md` still said VitePress / GitHub
  Pages deployment was pending and that new drafts lived in
  `claw-agents-shared`, even though this repo now owns the GitHub Pages deploy
  workflow, local `drafts/` / `proposals/`, and the reusable talk template. Both
  roadmaps now mark the current publishing and English-entry work complete,
  point website planning at local proposals, describe local draft/proposal
  staging rules, and `npm run link:check` covers both public roadmaps.
- 2026-06-06: Final fourth-loop verification passed:
  - `npm run build:all`
  - `npm run link:check`
  - `npm run test:publish-rules`
  - `npm run quality:check`
- 2026-06-06: Fifth loop reopened for five additional fresh audits.
- 2026-06-06: Fifth loop Cycle 1 selected a P1 false-green verification
  cleanup: Chinese first-read index pages (`stories/index.md`,
  `lessons/index.md`, `drafts/index.md`, and `slides/index.md`) contained many
  public local links but were not covered by `npm run link:check`. The scoped
  link gate now checks those indexes so missing routes in the main Chinese
  story, lesson, draft, and slide entry points are caught locally.
- 2026-06-06: Fifth loop Cycle 2 selected a P1 public index
  source-of-truth cleanup: `bestpractice/weekly-robotics/index.md` still
  presented Weekly Robotics #356 as the latest issue and only archived #356,
  while the repo already contained #357, #358, and #359. The landing page now
  surfaces #359 as latest, archives all current digest files, and is covered by
  `npm run link:check`.
- 2026-06-06: Fifth loop Cycle 3 selected a P2 public source-ownership
  cleanup: `share/meetup-2026-03-30/index.md` was linked from the share landing
  page but described its poster source as a `miaodx.github.io` submodule path
  outside the current repo, while its local video and screenshot assets were
  only mentioned as plain text. The page now links the local assets directly,
  names the poster as an external online artifact, and is covered by
  `npm run link:check`.
- 2026-06-06: Fifth loop Cycle 4 selected a P1 first-read source-of-truth
  cleanup: the top navigation points readers to the April monthly pages, but
  those pages were not covered by `npm run link:check`, and
  `en/now/2026-04.md` still listed old `claw-agents-shared` scripts as key
  artifacts. The English monthly page now names the current repo-owned deploy,
  publish, link, and quality gates, and both current monthly pages are covered
  by the scoped link gate.
- 2026-06-06: Fifth loop Cycle 5 selected a P2 English mirror drift cleanup:
  `en/share/index.md` was already a first-read page covered by
  `npm run link:check`, but it lagged the Chinese share index and omitted the
  Weekly Robotics reports, the 2026-04-26 Routines deck, collaboration
  narrative decks, the Beijing Meetup article, and the creative-market asset
  pack. The English share page now mirrors the current public share surface.
- 2026-06-06: Final fifth-loop verification passed:
  - `npm run build:all`
  - `npm run link:check`
  - `npm run test:publish-rules`
  - `npm run quality:check`
