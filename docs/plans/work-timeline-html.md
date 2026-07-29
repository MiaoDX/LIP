# Public Work Timeline HTML

## Plan Ledger

- Plan status: DONE
- Session scope: public-work-timeline
- Parent plan: none
- Child plans: none
- Last updated: 2026-07-29
- Current slice: Completed
- Next action: none
- Blocked on: none
- Do not touch from this session: unrelated presentations, generated `.vitepress/dist/`, project-wide navigation

## Goal

Create a public, externally shareable HTML deck that explains the 2021-2026
progression from perception engineering through robotics and agent systems,
with a focused zoom into the most recent half-year.

## Scope

- One standalone source at `presentations/work-timeline.html`
- No more than eight slides
- Four reading levels: career arc, capability line, stage, and selected evidence
- Career and thematic views generated from the same public-safe content
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
- Present Executor as a multi-contributor team platform begun in 2023 and
  extended for robotics and Agent workflows in 2026, not as a new solo project

## Slide Contract

1. Cover and four-stage arc
2. Four capability lines across four stages: engineering, verification,
   organization, and the emerging AI Coding line
3. 2022-2023 H1 engineering foundations
4. 2023 H2-2024 H2 production quality through three trigger, decision, and
   lasting-mechanism cases
5. 2025 robotics delivery, data, model, and evaluation
6. 2026 H1-to-now decision matrix: constraint, decision, and evidence for robot
   body, agent brain, and infrastructure
7. Three current capability layers with explicit evidence levels: open
   decision, deterministic action, and evidence at scale
8. Discussion close: control boundaries, evidence levels, and reusable workflows

## Non-goals

- Internal/private variant
- Publishing private evidence behind client-side hiding
- Parsing the embedded 2025 H2 PDF/PPTX
- Adding a data service, framework, chart dependency, or new shared runtime
- Editing generated site output

## Acceptance

- Exactly eight slides and no source content outside the public boundary
- The first two slides communicate the full arc in under one minute
- The capability matrix starts at 2021.08 and makes the four-stage progression
  legible without interaction
- Stage slides retain major responsibilities and measurable outcomes
- Slides 4 and 6 expose the decisions behind outcomes, not only chronology
- Slides 6 and 7 distinguish scoped hardware proof, simulation proof, and team
  platform evidence
- Executor retains the infrastructure position while its 2023 team origin and
  2026 extension boundary remain explicit
- No text overlap or unreadable controls at 1440x900 and 390x844
- `npm run build:all` passes and publishes the source to `/LIP/share/`

## Verification

- Static/content: targeted searches for slide count, private URLs, names, and
  forbidden generated output
- Runtime: open the source in a browser and exercise paging, notes, and themes
- Visual: browser screenshots at 1440x900 and 390x844
- Repository: `npm run build:all`

## Shipped Evidence

- `presentations/work-timeline.html`: the single eight-slide public standalone
  deck, including the four-line capability view and decision-led recent work
- `share/index.md`: public discovery link
- Browser proof: all eight slides rendered at 1440x900 and 390x844 with no
  horizontal overflow; the capability matrix and decision/system slides were
  verified at mobile top and bottom
- Interaction proof: keyboard paging, notes, counters, and theme switching load
  without console errors
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
