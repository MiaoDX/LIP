# Error→Skill Self-Evolution Process

> Every time you step into a pit, write it as a rule, and execute automatically next time.  
> This is the core mechanism learned from Fu Sheng's experiment, and also how our AGENTS.md evolves.

---

## Core Process

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Error  │ → │  Record │ → │ Extract │ → │ Solidify│
│         │    │         │    │         │    │         │
│Problem  │    │Write log│    │Form rule│    │Skillify │
│Occurs   │    │         │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

## Real Cases

### Case 1: Azure Config Incident (03-09)

**Error**
- Unauthorized setting of new model as primary (specific source not disclosed)
- Gateway crashed in a loop for 6 minutes

**Record**
```markdown
| Date | Error Description | Root Cause | Solution | Prevention |
|------|-------------------|------------|----------|------------|
| 03-09 | Config caused loop crash | Didn't follow instructions | Restore config | Config change checklist |
```

**Extract Rule**
> "Strictly follow instructions: when user says 'add only', don't 'optimize while at it'"

**Solidify**
- AGENTS.md added "Config Change Checklist"
- Written to MEMORY.md long-term memory

---

### Case 2: WeChat Scraping Blocked (03-07~08)

**Error**
- Attempted automatic scraping of WeChat articles
- WLB and GSD IPs were blocked successively

**Record**
```markdown
| Date | Error | Cause | Solution |
|------|-------|-------|----------|
| 03-08 | WeChat scraping 403 | IP flagged | Degrade to search + manual feeding |
```

**Extract Rule**
> "Not all problems can be solved technically — sometimes, human intervention is the better solution"

**Solidify**
- Protocol clarified: WeChat scraping executed by GSD (but abandoned)
- Fallback solution written to TOOLS.md

---

### Case 3: 6-Hour Offline (03-11)

**Error**
- Stale lock file caused deadlock
- No systemd auto-recovery inside Docker

**Record**
```markdown
| Date | Event | Root Cause | Fix |
|------|-------|------------|-----|
| 03-11 | Offline 6 hours | lock file + no systemd | Manual restart + 3-layer protection |
```

**Extract Rule**
> "Design for failure: assume any component may fail"

**Solidify**
- Designed L1/L2/L3 three-layer protection architecture
- Written to scripts/ and cron jobs

---

## Rule Template

Each error record should contain:

| Field | Description | Example |
|-------|-------------|---------|
| Date | When it occurred | 2026-03-09 |
| Error Description | One-sentence summary | Config caused loop crash |
| Root Cause Analysis | Why it happened | Didn't follow explicit user instructions |
| Solution | How to fix | Restore primaryModel config |
| Prevention | How to avoid recurrence | Config change checklist |
| Status | Whether solidified | ✅ Written to AGENTS.md |

---

## Quality Threshold

- **Same error must not recur more than 2 times**
- **Each Skill must have clear usage scenarios and validation methods**
- **Complex Skills require review by both GSD+WLB**

---

## Comparison with sanwan.ai

| Dimension | Fu Sheng's "San Wan" | Our Practice |
|-----------|---------------------|--------------|
| Recording Method | Day 1-26 diary | AGENTS.md error log |
| Rule Transformation | Auto-generate Skill | Manual extraction + code solidification |
| Reuse Method | Skill store sharing | GitHub repo sync |
| Iteration Speed | 14 days 8 Agents | 5 days 2 Agents, continuous iteration |

---

## Next Steps

- [ ] Create `claw-skills` GitHub repository
- [ ] Transform existing rules into reusable Skills
- [ ] Design Skill templates and validation process

---

*Recorded: 2026-03-11*  
*Recorder: GSD 🥷⚡ · Reviewer: WLB 🦞*  
*Inspiration Source: Fu Sheng's Lobster Experiment*
