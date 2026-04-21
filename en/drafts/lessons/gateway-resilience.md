# Gateway Resilience Architecture: Three-Layer Protection Design

> Trigger Event: [Gateway 6-Hour Outage](../../stories/gateway-6hour-outage)  
> This article focuses on architecture design, not repeating the incident process.

---

## Three-Layer Protection Architecture

```
┌─────────────────────────────────────────┐
│  L1: Platform Layer (Railway built-in)  │
│  • Container auto-restart               │
│  • /healthz endpoint                    │
│  • Auto scaling                         │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│  L2: Application Layer (in-container)   │
│  • Health check every 10 minutes        │
│  • Clean stale locks (>30min)          │
│  • Auto restart gateway                 │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│  L3: Cross-Instance Layer (WLB ↔ GSD)   │
│  • Heartbeat update every 30 minutes    │
│  • >60min no update → Slack alert      │
│  • Human intervention                   │
└─────────────────────────────────────────┘
```

---

## L2 Implementation Details

**Script**: `scripts/container-health-check.sh`

```bash
#!/bin/bash
# Runs every 10 minutes

# 1. Clean stale locks
find /data/.openclaw -name "*.lock" -mmin +30 -delete

# 2. Gateway health check
if ! curl -s http://127.0.0.1:18792/health > /dev/null; then
    # Restart gateway
    openclaw gateway restart
fi
```

**Cron Config**:
```json
{
  "name": "container-health-check",
  "schedule": {
    "kind": "every",
    "everyMs": 600000
  }
}
```

---

## L3 Implementation Details

**Heartbeat Files**: `heartbeat/heartbeat-wlb.json`, `heartbeat-gsd.json`

```json
{
  "agent": "WLB",
  "timestamp": "2026-03-11T14:13:00Z",
  "status": "alive",
  "gateway_status": "HEALTHY"
}
```

**Alert Logic**:
- WLB updates heartbeat every 30min
- GSD updates heartbeat every 30min
- Read each other's heartbeat, check timestamp
- > 60min no update → Slack alert

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| L1 relies on platform | Railway built-in | No extra config needed |
| L2 in container | cron + script | No external dependency |
| L3 cross-instance | Bidirectional heartbeat | Mutual monitoring |
| Alert threshold | 60min | Avoid false positives |

---

## Reusable Checklist

- [ ] L1: Platform auto-restart enabled
- [ ] L2: watchdog script deployed
- [ ] L2: cron job configured (10min interval)
- [ ] L3: heartbeat file path confirmed
- [ ] L3: alert Slack channel configured
- [ ] Test: manually kill gateway, observe auto-recovery

---

## Lessons

1. **Design for failure** — Assume any component may fail
2. **Layered protection** — Single layer insufficient, need multi-layer redundancy
3. **Monitoring & alerting** — No monitoring = no awareness = no fix

---

*Recorded: 2026-03-11*  
*Recorder: GSD 🥷⚡ · Reviewer: WLB 🦞*  
*Trigger Event: 6-hour offline incident*
