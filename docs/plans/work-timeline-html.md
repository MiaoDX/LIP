# Public Work Timeline HTML

## Plan Ledger

- Plan status: DONE
- Session scope: public-work-timeline
- Parent plan: none
- Child plans: none
- Last updated: 2026-09-01
- Current slice: Completed
- Next action: none
- Blocked on: none
- Do not touch from this session: unrelated presentations, generated `.vitepress/dist/`, project-wide navigation

## Goal

Maintain a public, externally shareable HTML deck that explains the 2019-2026
progression from the first production-delivery experience through perception
engineering, robotics systems, data and evaluation, and model-to-robot work,
with a focused zoom into the most recent responsibilities.

## Scope

- One standalone source at `presentations/work-timeline.html`
- Exactly nine slides in the current public narrative
- Four reading levels: career eras, scope-expansion map, stage, and selected evidence
- Career and causal views generated from the same public-safe content
- Desktop presentation and mobile reading layouts
- Keyboard/click paging, notes, progress, counter, and theme switching through
  the existing deck runtime
- A separate public speaking script at `share/work-timeline-script.md`, with
  lead, hands-on, and data/evaluation routes that all close on slide 09

## Public Boundary

- Include public-safe project descriptions and high-signal performance metrics
- Exclude Feishu links/tokens, colleague names, internal document references,
  performance grades, and personal/private material
- Avoid unexplained internal release codes and confidential implementation detail
- Attribute work with careful verbs such as led, drove, collaborated, and
  delivered; do not turn team outcomes into sole personal ownership
- Distinguish direct team size from platform or mechanism impact range
- Distinguish action-level success, end-to-end task success, model-to-robot
  proof, and team-platform evidence

## Slide Contract

1. Cover and three career eras, beginning with the first production-delivery experience
2. 2019-2021 origin plus four scope expansions: new problem, system answer, and responsibility growth
3. 2021.08-2023 H1 engineering foundations and team building
4. 2023 H2-2025 H1 production quality, performance, and governance at scale
5. 2025 robotics integration, performance, testing, and delivery
6. 2025 H2 data production, model evaluation, and real-robot deployment loop
7. Evaluation evolution and Endless Testing, including explicit human fallback boundaries
8. 2026-to-now model post-training, real-robot adaptation, controlled Agent execution, and machine-verifiable acceptance
9. Discussion close: operating method, primary positioning, and next responsibility

## Non-goals

- Internal/private variant
- Publishing private evidence behind client-side hiding
- Parsing the embedded 2025 H2 PDF/PPTX
- Adding a data service, framework, chart dependency, or new shared runtime
- Editing generated site output
- Turning the public deck into a single fixed interview route; the script owns route selection

## Acceptance

- Exactly nine slides and no source content outside the public boundary
- The first two slides communicate the full arc in under one minute
- Slide 01 is explicitly understood as three career eras; slide 02 is four
  responsibility expansions, not a conflicting segmentation
- The causal map establishes the 2019-2021 production-delivery origin, then
  makes the four-stage progression from 2021.08 legible without interaction
- Stage slides retain major responsibilities and measurable outcomes
- Slides 4 and 6 expose the decisions behind outcomes, not only chronology
- Slides 6, 7, and 8 distinguish scoped hardware proof, simulation/evaluation
  proof, model-to-robot proof, and team-platform evidence
- Slide 9 closes every documented route and states robotics systems technical
  leadership as the primary direction, with data/evaluation and model
  post-training as technical depth
- No text overlap or unreadable controls at 1440x900 and 390x844
- `npm run build:all` passes and publishes the source to `/LIP/share/`

## Verification

- Static/content: targeted searches for slide count, private URLs, names, and
  forbidden generated output
- Cross-material: compare dates, role names, project names, metrics, and
  contribution boundaries with the Resume and speaking script
- Runtime: open the source in a browser and exercise paging, notes, and themes
- Visual: browser screenshots at 1440x900 and 390x844
- Repository: `npm run build:all`

## Shipped Evidence

- `presentations/work-timeline.html`: the nine-slide public standalone deck,
  including the first-production-delivery origin, four-stage causal map,
  Endless Testing, model-to-robot work, and a dedicated close
- `share/work-timeline-script.md`: public speaking routes and contribution
  boundaries aligned with all nine slides
- Browser proof: all nine slides rendered at 1440x900 and 390x844 with no
  horizontal overflow; causal-map and decision/system slides verified at mobile
  top and bottom
- Interaction proof: keyboard paging, notes, counters, and theme switching load
  without console errors
- Repository proof: `npm run build:all` passed and copied the deck to
  `.vitepress/dist/share/work-timeline.html`
- Documentation alignment: maintenance guidance keeps Resume, Work Timeline,
  and speaking scripts on one public-safe fact base

## Parked Follow-ups

- A separate internal version requires a private publishing destination and a
  new approval boundary
- Additional work photos may be added only after public-release approval and
  deck-local asset ownership are confirmed
- Route-specific URL parameters may be added later if interview use shows that
  manual navigation is too costly
