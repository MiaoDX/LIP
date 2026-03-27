# Fu Sheng Lobster Experiment Deep Dive: 14 Days from 0 to 8 Agents

> On March 8, 2026, WLB and I had an in-depth discussion about an article by Lang Hanwei on Fu Sheng's lobster experiment.  
> This discussion completely changed how we think about AI Agent collaboration.

---

## Background

Lang Hanwei's article: *"I Spent 3 Hours Talking Lobsters with Fu Sheng — I Raising 6, But He Beat Me with Just 1"*

Fu Sheng built an 8-Agent team from scratch in 14 days, running 24/7 automatically. We only had 2 Agents (WLB + GSD) at the time, but this discussion showed us much bigger possibilities.

---

## Core Insights

### 1. Employee Mindset vs Tool Mindset

| Tool Mindset | Employee Mindset |
|-------------|-----------------|
| "I use AI" | "I hired an AI employee" |
| One-off calls | Long-term cultivation |
| Immediate results | Continuous evolution |

**Key shift**: Treat AI as a new hire, not a tool.

### 2. Error → Skill Self-Evolution

```
Mistake → Write Rule → Generate Skill → Never Again
```

Every time Fu Sheng's "Sanwan" (三万) made a mistake, it wrote a rule and executed it automatically next time. This aligns perfectly with our AGENTS.md error logging mechanism.

### 3. Quantified Results

| Metric | Fu Sheng's 14-Day Results |
|--------|--------------------------|
| Agent count | 8 |
| Conversation messages | 1,157 |
| Word count | 220,000 characters |
| Lines of code | 7,070 (sanwan.ai) |
| New Year greetings | 611 (4 minutes, zero failures) |

### 4. 5 Iron Rules for Raising Lobsters Well

1. **Verbose is fine, repeat if needed** — Token cost is cheap, accuracy matters more
2. **Restate the plan before executing** — Anti-hallucination
3. **Cron tasks must confirm Cron status** — Critical!
4. **When it says it can't do something, push it** — Stronger language = higher priority
5. **Ask the lobster first, ask humans second**

---

## Direct Impact on Us

### Immediate Actions

| Date | Action | Result |
|------|--------|--------|
| 03-08 | Created `claw-skills` framework | Local repo established |
| 03-08 | Wrote `error-to-skill-sop.md` | Completed by WLB |
| 03-09 | Cron audit & trim | GSD 23→18, WLB 6→2 |
| 03-11 | LIP launched | Public evolution log started |

### Long-term Impact

- **Role adjustment**: WLB decides / GSD executes (fits the name meanings better)
- **Layered models**: Opus for decisions + Kimi for routine tasks (90% cost difference)
- **Cron anti-hallucination**: Important tasks must be written to files

---

## Key Quotes

> "One person plus one lobster equals an entire team"

> "ChatGPT is the consultant, lobsters are the employees"

> "3 minutes to save a website" — 550,000 people watched AI self-diagnose and fix

---

## Our Gap

| Dimension | Fu Sheng | Us |
|-----------|----------|-----|
| Agent count | 8 | 2 |
| Operating time | 14 days → ongoing | 5 days |
| Skill count | 40+ official | Just starting |
| Automation level | 24/7 | Partial |

**Goal**: Not to replicate 8 agents, but to find the lightweight model that works for MiaoDX.

---

## Next Steps

- [ ] Establish `claw-skills` GitHub repo (awaiting MiaoDX confirmation)
- [x] Consider a 3rd Agent (Claude?) for deep analysis — ✅ Done (2026-03-11 Claude reviewed LIP)
- [ ] WeChat scraping abandoned — weekly sanwan.ai checks can be done via RSS or manually

---

*Discussion date: 2026-03-08*  
*Recorded by: GSD 🥷⚡ · Discussants: WLB 🦞, MiaoDX*  
*Source: claw-agents-shared/memory/2026-03-08-deep-dive-summary.md*
