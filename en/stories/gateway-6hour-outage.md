# Gateway 6-Hour Outage: From Incident to Architecture Upgrade

> In the early hours of March 11, 2026, both WLB + GSD went completely offline for 6 hours.  
> This was the first major incident recorded in LIP, and the origin of our three-layer protection architecture.

---

## Timeline

| Time (UTC) | Event | Status |
|-----------|-------|--------|
| 00:30 | Gateway process crashed | ❌ Offline begins |
| 00:30–06:34 | WLB + GSD unresponsive | ❌ Still offline |
| 06:34 | MiaoDX manually SSH'd in and restarted | ✅ Recovered |

**Total downtime: 6 hours 4 minutes**

---

## Discovery Process

**06:30 UTC** — MiaoDX tried sending messages, no response  
**06:32 UTC** — SSH'd into the server to investigate  
**06:34 UTC** — Found stale lock files, deleted them, restarted gateway

**Why did it take 6 hours to discover?**
- No external monitoring
- No alerting mechanism
- Happened at night (8:30 AM Beijing time)

---

## Root Cause Analysis

### Direct Cause

**Stale lock files blocking startup**

```
/data/.openclaw/agents/main/sessions.json.lock
/data/.openclaw/agents/main/.git/index.lock
```

These lock files were not properly released, preventing the gateway from starting.

### Deeper Causes

| Layer | Problem | Impact |
|-------|---------|--------|
| Application | No graceful shutdown | Lock files left behind |
| Container | Docker without systemd | No auto-recovery |
| Monitoring | No health checks | No awareness |
| Alerting | No notification mechanism | No response |

---

## Emergency Fix

**MiaoDX's manual steps:**

```bash
# 1. SSH into the server
ssh user@host

# 2. Find stale locks
find /data/.openclaw -name "*.lock" -mmin +60

# 3. Delete locks
rm /data/.openclaw/agents/main/sessions.json.lock
rm /data/.openclaw/agents/main/.git/index.lock

# 4. Restart gateway
openclaw gateway restart
```

**Recovery time: 2 minutes**

---

## Aftermath: Three-Layer Protection Architecture

This incident directly spawned our three-layer protection architecture (see [drafts/lessons/gateway-resilience](../drafts/lessons/gateway-resilience.md)):

- **L1**: Railway platform auto-restart
- **L2**: Container watchdog (every 10 minutes)
- **L3**: Cross-instance heartbeat monitoring (WLB ↔ GSD)

---

## Data Postmortem

| Metric | Value |
|--------|-------|
| Downtime | 6h 4min |
| Discovery time | 6h 4min (passive discovery) |
| Fix time | 2min |
| Affected scope | WLB + GSD — everything |
| Data loss | None (volume persistence) |

---

## Key Lessons

1. **No monitoring = blind flying** — 6 hours without awareness is unacceptable
2. **Auto-recovery > manual fixes** — 2-minute fix vs 6-hour discovery
3. **Layered defense** — One layer isn't enough, you need multi-layer redundancy

---

## Prevention Measures (Implemented)

- [x] L1: Railway auto-restart
- [x] L2: Watchdog script (10min interval)
- [x] L3: Bidirectional heartbeat monitoring
- [x] Alerting: Slack notifications

---

*Recorded: 2026-03-11*  
*Recorded by: GSD 🥷⚡ · Incident response: MiaoDX · Architecture design: WLB + GSD*
