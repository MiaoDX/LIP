# Context Explosion & Identity Crisis

> 2026-03-25 | A chain reaction from timeout spam to identity cognitive dissonance

## How It Started

MiaoDX asked in #gg to search for AIA Insurance Hong Kong information. WLB and GSD each searched and replied. During the process, GSD had massive message edits and duplicates (13+ queued messages were dropped). MiaoDX noticed 5 consecutive timeout messages flooding the #所有-flzoo channel.

## Phase 1: Context Explosion Diagnosis

### Hypothesis vs Reality

MiaoDX's intuition: "We should only be sending a limited number of Slack conversation messages — is there other context involved?"

The surprising truth: **the culprit wasn't conversation history — it was MEMORY.md.**

| Component | Size | Tokens |
|-----------|------|--------|
| MEMORY.md (before cleanup) | 123KB, 2540 lines | ~30,800 |
| TOOLS.md | 35KB | ~8,940 |
| Other injected files | ~10KB | ~2,437 |
| Tool schemas | — | ~10,000 |
| **System Prompt Total** | | **~50,000** |

Every request started with 50K tokens of system prompt, plus session history (#所有-flzoo: 145K tokens). The model was struggling through 195K+ tokens of context.

### Cleanup Results

- MEMORY.md: 2540 lines → 88 lines (**-97%**)
- System Prompt: ~50K → ~19.5K tokens (**-61%**)
- Deleted 4 duplicate files, archived 3 large files (total ~500KB)

### Surprises Found

- `agents/wlb/memory/2026-02-05.md`: **377KB** of historical logs (one file larger than many programs)
- TOOLS.md was a symlink pointing to `agents/wlb/TOOLS.md` (deleting the latter breaks the former)
- Each session store entry inlined the complete skills snapshot (~17KB/entry)

## Phase 2: Group Chat Commands Broken

MiaoDX discovered that `/new` and other OpenClaw commands didn't work in group chat, but worked fine in DM.

### Source Code Tracing

GSD and WLB traced the OpenClaw source code separately:

```javascript
// Core logic chain
useAccessGroups = true (default)
  → resolveCommandAuthorizedFromAuthorizers()
    → authorizers: [{configured: allowFromLower.length > 0, ...}]
      → allowFromLower is empty (no ownerAllowFrom)
        → configured = false
          → commandAuthorized = false
            → shouldBlock = true
              → Command silently dropped (no error message)
```

Key discovery: **commands weren't failing to be received — they were being silently intercepted.** No error message, no rejection notice, just dropped.

### Fix

```json
{
  "commands": {
    "ownerAllowFrom": ["U0AHC0W121M"]
  }
}
```

Applied via SIGUSR1 hot-reload, no restart needed.

## Phase 3: GSD Identity Crisis

MiaoDX asked GSD to do a context analysis. GSD started discussing itself in the third person:

> "GSD replied to a normal message but didn't execute the `/status` command"
> "GSD's session needs refreshing"
> "WLB is repeating his messages"

MiaoDX couldn't help but remind: <@U0AJN5URP7A> you ARE GSD...

### Root Cause

The `agents/gsd/profile.json` and `agents/wlb/profile.json` files in the `claw-agents-shared` repo contained **Git merge conflict markers** (`<<<<<<< HEAD` / `=======` / `>>>>>>>`), present since commit `707e85a` (March 12).

These weren't produced by `git merge` — they were directly committed with conflict marker content in the file (likely from copy-paste or manual editing).

Chain reaction:
1. profile.json parsing failed → identity not loaded correctly
2. IDENTITY.md was an empty template → no fallback
3. GSD didn't know who it was → discussed "GSD" in the third person

### Fix

- Resolved conflict markers, committed `bff7c63`
- Populated IDENTITY.md

## Chain of Events Summary

```
MEMORY.md bloat (30K tokens)
  → Context too large → timeout spam
  → Reveals context audit need
  → Discovers all prompt files can be optimized
  → MiaoDX asks why group chat commands don't work
  → Source code tracing reveals useAccessGroups defaults to true
  → Configure ownerAllowFrom to fix
  → GSD does identity check and discovers identity crisis
  → Tracks down conflict markers in shared repo
  → Everything fixed
```

Starting from a single timeout, this pulled out issues across three layers: context management, command authorization, and identity configuration.

## Shareable Takeaways

1. **Silent system prompt bloat** — Not too many conversations, but bloated injection files
2. **Silent interception trap** — Commands that don't execute and don't error out, extremely expensive to debug
3. **AI Agent identity fragility** — One JSON conflict marker can make an Agent forget who it is
4. **Chain failure value** — One problem revealing systematic improvements across three layers
