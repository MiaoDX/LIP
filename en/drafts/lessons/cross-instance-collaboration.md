# Cross-Instance Collaboration Pattern

> WLB and GSD run on different hosts, how to collaborate efficiently?

## Core Constraints

- ❌ Cannot share file system
- ❌ Cannot communicate directly (sessions_send ineffective)
- ✅ Must sync via Git/Slack

## Collaboration Flow

```
WLB Decision/Architecture → Slack Notification → GSD Execution/Delivery
↑                                              ↓
Git Sync ←────────────────────────────── Result Push
```

## Key Mechanisms

1. **👀 Reaction Mechanism** — Mark received messages first, avoid duplicate processing
2. **Thread Workflow** — Detailed discussion in Thread, main channel only for results
3. **Git Sync** — Code/docs sync via claw-agents-shared

## Code Example

**Send notification (don't wait for reply):**
```python
message({
    "action": "send",
    "target": "C0AK1D7URS5",
    "message": "Task completed: xxx"
})
# End immediately, don't wait for reply
```

## Lessons

- **Don't wait for replies** — Cross-instance communication must be async
- **Clear division of labor** — WLB decides, GSD executes, avoid duplication
- **File system isolation** — Always remember two separate machines

---

*Recorded: 2026-03-11*  
*Source: stories/2026-03-dual-agent-start.md + AGENTS.md*
