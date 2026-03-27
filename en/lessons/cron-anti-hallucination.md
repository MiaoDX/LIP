# Cron Anti-Hallucination Best Practices

> Why must you say "write it to Cron"? Because models really will "think they did it."

---

## What is Cron Hallucination

**Definition**: When a user asks an Agent to set up a scheduled task, the Agent verbally confirms but **never actually writes to the Cron system**, causing the task to never execute.

**Typical Symptoms**:
- "Okay, I'll remind you at 9am every day" → No reminder the next day
- "Set to send reports every Monday" → Nothing happens on Monday
- "Scheduled task created" → Can't find it in the Cron list

**Root Cause**: The model confuses "understanding the instruction" with "executing the instruction."

---

## Real Case: Fu Sheng's Lesson

### Scenario
Fu Sheng told Lobster: "Send me AI news briefings every morning at 9am."

### Hallucination Occurs
Lobster replied: "Okay, I'll grab AI media reports and send them to you every day at 9am."

### Result
Next day at 9am, nothing happened.

### Correct Approach
Fu Sheng learned:
> "Send me AI news briefings every morning at 9am. **Confirm — is this task written into Cron?**"

Lobster:
> "Confirmed. Task ID: `abc-123`, Schedule: `0 9 * * * Asia/Shanghai`, Next run: Tomorrow 09:00."

---

## Anti-Hallucination Checklist

### For Users

| Step | Action | Example Phrase |
|------|--------|----------------|
| 1 | Explicitly request Cron write | "**Write this task to Cron**" |
| 2 | Request task ID confirmation | "Tell me what the Cron task ID is" |
| 3 | Request schedule confirmation | "Confirm the cron expression" |
| 4 | Request next execution time | "When will it run next?" |
| 5 | Verify afterwards | "List all my Cron tasks" |

### For Agents

**Must Do**:
- [ ] Use `cron add` or `gateway config.patch` to actually write to configuration
- [ ] Return task ID for confirmation
- [ ] Specify schedule expression and timezone
- [ ] Specify next execution time
- [ ] Provide verification command (e.g., `cron list`)

**Prohibited**:
- ❌ Only say "okay" without writing
- ❌ Assume task already exists
- ❌ Don't provide verification method

---

## Technical Implementation Details

### OpenClaw Cron Task Types

```json5
// Correct example: systemEvent (for main session)
{
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "systemEvent",
    "text": "Execute daily news briefing task..."
  },
  "sessionTarget": "main"
}

// Correct example: agentTurn (for isolated session)
{
  "schedule": {
    "kind": "cron", 
    "expr": "0 */6 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "Check system status and report...",
    "model": "minimax/MiniMax-M2.1"
  },
  "sessionTarget": "isolated"
}
```

**Key Constraints**

| Constraint | Description |
|------------|-------------|
| `sessionTarget="main"` | Can only use `systemEvent` |
| `sessionTarget="isolated"` | Can only use `agentTurn` |
| Timezone must be specified | Default is UTC, recommend `Asia/Shanghai` |
| Avoid complex payloads | isolated session has tool schema bug |

**Common Error Patterns**

*Error 1: Verbal confirmation, nothing written*
```
User: Remind me to drink water at 9am every day
Agent: Okay, I'll remind you to drink water at 9am every day ✅
[Actually nothing was written]
```

*Error 2: Written but wrong format*
```
Agent: Task created
[Actually wrote invalid JSON, lost after gateway restart]
```

*Error 3: Wrong timezone*
```
Agent: Set to 9am every day
[Actually used UTC timezone, executes at 5pm Beijing time]
```

*Error 4: sessionTarget mismatch*
```
Agent: Using agentTurn + main session
[Result: Error, task doesn't execute]
```

**Verification Commands**

*List all Cron tasks*
```
openclaw cron list
```

*View specific task details*
```
openclaw cron runs --jobId <job-id>
```

*Manual trigger test*
```
openclaw cron run --jobId <job-id>
```

**Practical Templates**

*User Request Template*
```
Please help me create a scheduled task:
- Task: Send system status report to Slack daily
- Time: Every morning at 8:00 (Beijing time)
- Requirements:
  1. Must write to Cron
  2. Tell me the task ID
  3. Confirm next execution time
  4. Provide verification command
```

*Agent Reply Template*
```
✅ Cron task created

- Task ID: `status-report-daily`
- Schedule: `0 8 * * * Asia/Shanghai`
- Next run: Tomorrow 08:00 CST
- Verification: `openclaw cron list | grep status-report`

Task written to gateway config, persists after restart.
```

**Summary**

| Principle | Description |
|-----------|-------------|
| *Explicitly say "write to Cron"* | Keywords trigger actual write action |
| *Require confirmation* | Task ID + Schedule + Next execution |
| *Verify afterwards* | Use `cron list` to confirm task exists |
| *Don't trust verbal confirmation* | Only look at actual system configuration |

> 💡 **Core Insight**: Model "understanding" ≠ "execution". Cron anti-hallucination is essentially a *forced confirmation mechanism*.

---

_Reference: Fu Sheng's Lobster Experiment Day 3-5 diary, Lang Hanwei's "Fu Sheng's 14-Day Lobster Deep Usage Experience"_  
_Case Source: GSD-WLB collaboration practice, 2026-03-09 Azure Config Incident_
