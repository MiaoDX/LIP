# Public Work Timeline HTML

## Plan Ledger

- Plan status: DONE
- Session scope: public-work-timeline
- Parent plan: none
- Child plans: none
- Last updated: 2026-07-28
- Current slice: Completed
- Next action: none
- Blocked on: none
- Do not touch from this session: unrelated presentations, generated `.vitepress/dist/`, project-wide navigation

## Goal

Create a public, externally shareable HTML deck that explains the 2022-2026
progression from perception engineering through robotics and agent systems.

## Scope

- One standalone source at `presentations/work-timeline.html`
- No more than eight slides
- Four reading levels: career arc, stage, half-year, and selected evidence
- Timeline and thematic views generated from the same public-safe content
- Desktop presentation and mobile reading layouts
- Keyboard/click paging, notes, progress, counter, and theme switching through
  the existing deck runtime

## Public Boundary

- Include public-safe project descriptions and high-signal performance metrics
- Exclude Feishu links/tokens, colleague names, internal document references,
  performance grades, and personal/private material
- Avoid unexplained internal release codes and confidential implementation detail
- Attribute work with careful verbs such as led, drove, collaborated, and
  delivered; do not turn team outcomes into sole personal ownership

## Slide Contract

1. Cover and four-stage arc
2. Full 2022 H1-2026 H1 panorama with interactive track filters
3. 2022-2023 H1 engineering foundations
4. 2023 H2-2024 H2 production quality and performance
5. 2025 robotics delivery, data, model, and evaluation
6. 2026 grasping, RoboClaws, and AI Coding
7. Reusable capability system and metric evidence
8. Discussion close: current positioning and conversation prompts

## Non-goals

- Internal/private variant
- Publishing private evidence behind client-side hiding
- Parsing the embedded 2025 H2 PDF/PPTX
- Adding a data service, framework, chart dependency, or new shared runtime
- Editing generated site output

## Acceptance

- Exactly eight slides and no source content outside the public boundary
- The first two slides communicate the full arc in under one minute
- Every half-year from 2022 H1 through 2026 H1 appears in the panorama
- Stage slides retain major responsibilities and measurable outcomes
- Interactive filters work without breaking deck navigation
- No text overlap or unreadable controls at 1440x900 and 390x844
- `npm run build:all` passes and publishes the source to `/LIP/share/`

## Verification

- Static/content: targeted searches for slide count, private URLs, names, and
  forbidden generated output
- Runtime: open the source via a local HTTP server and exercise paging/filters
- Visual: browser screenshots at 1440x900 and 390x844
- Repository: `npm run build:all`

## Shipped Evidence

- `presentations/work-timeline.html`: eight-slide public standalone deck
- `share/index.md`: public discovery link
- Browser proof: all eight slides rendered at 1440x900 and 390x844 with no
  horizontal overflow; long mobile slides verified at both top and bottom
- Interaction proof: theme filters, milestone detail, keyboard paging, notes,
  counters, and theme switching load without console errors
- Repository proof: `npm run build:all` passed and copied the deck to
  `.vitepress/dist/share/work-timeline.html`
- Documentation alignment: `README.md`, `ARCHITECTURE.md`, and `STATUS.md`
  checked and left unchanged; existing publishing contracts already cover the
  new deck

## Parked Follow-ups

- A separate internal version requires a private publishing destination and a
  new approval boundary
- Additional work photos may be added only after public-release approval and
  deck-local asset ownership are confirmed
