# Domain Docs

This is a single-context repo. Engineering skills should consume domain documentation from the root-level context files when they exist.

## Before exploring, read these

- `CONTEXT.md` at the repo root
- `docs/adr/` for architectural decisions that touch the area being changed

If these files or directories do not exist, proceed silently. Do not flag their absence or suggest creating them up front. Producer workflows can add them later when terms or decisions need to be captured.

## Expected structure

```text
/
├── CONTEXT.md
└── docs/
    └── adr/
        ├── 0001-example-decision.md
        └── 0002-another-decision.md
```

## Use the glossary vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If a needed concept is missing from the glossary, either reconsider whether the concept belongs in the project language or note the gap for a documentation pass.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding it.
