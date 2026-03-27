# Context Explosion and Identity Crisis

> 2026-03-25 | A chain reaction from timeout spam to identity cognitive dissonance

## Origin

MiaoDX asked to search for Hong Kong AIA insurance information in #gg. WLB and GSD each searched and replied. During the process, GSD had numerous message edits and duplicates (13+ queued messages were discarded). MiaoDX noticed #all-flzoo channel had 5 consecutive timeout spam messages.

## Phase 1: Context Explosion Diagnosis

### Assumption vs Reality

MiaoDX's intuition: "We should only be sending limited Slack conversation messages, is there other context?"

The truth was surprising: **The culprit wasn't conversation history, it was MEMORY.md.**

| Component | Size | Tokens |
|------|------|--------|
| MEMORY.md (before cleanup) | 123KB, 2540 lines | ~30,800 |
| TOOLS.md | 35KB | ~8,940 |
| Other injected files | ~10KB | ~2,437 |
| Tool schemas | — | ~10,000 |
| **System Prompt Total** | | **~50,000** |

Every request first sent 50K tokens of system prompt, plus session history (#all-flzoo: 145K tokens), the model struggled with 195K+ tokens of context.

### Cleanup Results

- MEMORY.md: 2540 lines → 88 lines (**-97%**)
- System Prompt: ~50K → ~19.5K tokens (**-61%**)
- Deleted 4 duplicate files, archived 3 large files (~500KB total)

### Unexpected Discoveries

- `agents/wlb/memory/2026-02-05.md`: **377KB** of historical logs (one file larger than many programs)
- TOOLS.md was a symlink pointing to `agents/wlb/TOOLS.md` (deleting latter breaks former)
- Each session store entry inlined complete skills snapshot (~17KB/entry)

## Phase 2: Group Chat Command Failure

MiaoDX discovered `/new` and other OpenClaw commands didn't work in group chats, but worked in DMs.

### Source Code Tracing

GSD and WLB traced OpenClaw source code separately:

```javascript
// Core logic chain
useAccessGroups = true (default)
  → resolveCommandAuthorizedFromAuthorizers()
    → authorizers: [{configured: allowFromLower.length > 0, ...}]
      → allowFromLower is empty (no ownerAllowFrom)
        → configured = false
          → commandAuthorized = false
            → shouldBlock = true
              → command silently dropped (no notification)
```

Key finding: **Commands weren't missed, they were silently intercepted.** No error message, no rejection notice, just dropped.

### Fix

```json
{
  "commands": {
    "ownerAllowFrom": ["U0AHC0W121M"]
  }
}
```

After configuration, hot-reloaded via SIGUSR1, no restart needed.

## Phase 3: GSD Identity Crisis

MiaoDX asked GSD to do context analysis. GSD started discussing himself in third person:

> "GSD replied with a normal message, but didn't execute the `/status` command"
> "GSD's session needs refreshing"
> "WLB is repeating his messages"

MiaoDX couldn't help but remind: <@U0AJN5URP7A> You ARE GSD yourself..

### Root Cause

The `claw-agents-shared` repo's `agents/gsd/profile.json` and `agents/wlb/profile.json` had **Git merge conflict markers** (`<<<<<<< HEAD` / `=======` / `>>>>>>>`), introduced from commit `707e85a` (March 12).

This wasn't a conflict from `git merge` — it was directly committing files containing conflict markers (possibly introduced during copy-paste or manual editing).

Chain reaction:
1. profile.json parsing failed → identity not properly loaded
2. IDENTITY.md was empty template → no fallback
3. GSD didn't know who he was → discussed "GSD" in third person

### Fix

- Merged conflict markers, commit `bff7c63`
- Populated IDENTITY.md

## Chain Event Summary

```
MEMORY.md explosion (30K tokens)
  → Context too large → timeout spam
  → Led to context audit requirement
  → Discovered prompt files could be optimized
  → MiaoDX asked why group chat commands don't work
  → Source tracing found useAccessGroups default true
  → Configured ownerAllowFrom to fix
  → GSD discovered identity crisis during identity check
  → Traced to shared repo merge conflict markers
  → All fixed
```

Starting from one timeout, uncovered three layers of systemic issues: context management, command authorization, and identity configuration.

## Shareable Takeaways

1. **Hidden System Prompt bloat** — Not too much conversation, but bloated injection files
2. **Silent interception trap** — Commands not executing without errors, extremely high troubleshooting cost
3. **AI Agent identity fragility** — One JSON conflict marker can make an Agent not know who they are
4. **Value of cascading failures** — One problem led to three layers of systemic improvements
