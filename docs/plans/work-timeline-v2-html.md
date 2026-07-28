# Public Work Timeline V2

## Plan Ledger

- Plan status: DONE
- Session scope: public-work-timeline-v2
- Parent plan: `docs/plans/work-timeline-html.md`
- Child plans: none
- Last updated: 2026-07-28
- Current slice: Completed
- Next action: none
- Blocked on: none
- Do not touch from this session: v1 deck, generated `.vitepress/dist/`, unrelated presentations

## Goal

Create a separate public v2 of the work timeline that expands the most recent
half-year through three connected layers: robot body, agent brain, and AI-native
engineering infrastructure.

## Scope

- Reuse `presentations/work-timeline.html` as the visual and runtime baseline
- Publish the new source as `presentations/work-timeline-v2.html`
- Keep exactly eight slides
- Refine the 2026 milestone on the interactive panorama
- Replace slide 6 with a three-lane 2026 H1-to-now zoom
- Replace slide 7 with the end-to-end relationship between GR00T manipulation,
  Roboclaws, and Executor
- Update slide 8 discussion prompts for external technical conversations
- Add a separate discovery entry under `share/index.md`

## Public Boundary

- Describe the three repositories through public-safe capability outcomes
- Distinguish simulator or digital-twin evidence from hardware proof
- Keep the historical first-version grasp metric scoped to that milestone
- Exclude private URLs, credentials, people, performance grades, internal
  platform configuration, unpublished provider details, and commit counts

## Acceptance

- Exactly eight slides and no changes to the v1 source
- Slide 2 remains the macro timeline, slide 6 is the 2026 zoom, and slide 7 is
  the current system view
- Recent work reads as one connected system rather than three repository lists
- No overlap or horizontal overflow at `1440x900` and `390x844`
- Filters, milestone details, paging, notes, counter, and themes still work
- `npm run build:all` passes and copies v2 to `/LIP/share/`

## Verification

- Static public-boundary and slide-count searches
- Browser interaction and console checks
- Every slide at `1440x900` and `390x844`, including mobile scroll bottoms
- `npm run build:all`

## Shipped Evidence

- `presentations/work-timeline-v2.html`: separate eight-slide public v2 source
- `share/index.md`: separate public discovery entry without replacing v1
- Static proof: eight slides, no v1 diff, no sensitive-marker findings, and no
  whitespace errors
- Browser proof: all slides rendered at `1440x900` and `390x844` with no
  horizontal overflow; changed slides and the expanded panorama were inspected
  at mobile top and bottom
- Interaction proof: keyboard paging, counter/hash updates, theme filters,
  2026 milestone details, notes, and theme switching work without console errors
- Repository proof: `npm run build:all` passed and copied the source to
  `.vitepress/dist/share/work-timeline-v2.html`
- Documentation alignment: `share/index.md` updated; `README.md`,
  `ARCHITECTURE.md`, and `STATUS.md` checked and left unchanged because their
  existing publishing contracts already cover the v2 deck

## Parked Follow-ups

- Real work photos or screenshots require explicit public-release approval
- Hardware claims require separate live evidence and are not implied by v2
