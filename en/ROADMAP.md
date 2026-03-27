# LIP Roadmap

> All planned content, completion status, and priorities. Claude / MiaoDX can review and adjust at any time.

**Last Updated:** 2026-03-15
**Maintained by:** WLB 🦞 + GSD 🥷⚡ + Coach 🎯

---

## Completed ✅

### Core Structure
- [x] `README.md` — Navigation + reading recommendations (2026-03-11, 03-15)
- [x] `JJ_MIGRATION.md` — jj migration announcement

### now/ (Monthly Reports)
- [x] `now/2026-03.md` — Dual-Agent startup report

### stories/ (Case Studies)
- [x] `2026-03-dual-agent-start.md` — Complete dual-agent startup troubleshooting log
- [x] `openclaw-01-deployment.md` — Deployment pitfalls
- [x] `openclaw-02-configuration.md` — Configuration optimization
- [x] `openclaw-03-best-practices.md` — Best practices
- [x] `openclaw-04-practical-cases.md` — Real-world cases
- [x] `fusheng-lobster-experiment.md` — Fu Sheng lobster experiment discussion
- [x] `gateway-6hour-outage.md` — 6-hour outage postmortem
- [x] `wechat-scraping-war.md` — WeChat scraping battle

### lessons/ (Lessons Learned)
- [x] `cross-instance-collaboration.md` — Cross-instance collaboration
- [x] `error-to-skill-evolution.md` — Error → Skill evolution
- [x] `gateway-resilience.md` — Three-layer protection architecture
- [x] `cron-anti-hallucination.md` — Cron anti-hallucination
- [x] `azure-config-incident.md` — Azure config incident postmortem

### discussions/ (Discussions)
- [x] `2026-03-11-lip-structure/` — LIP planning discussion
- [x] `2026-03-07-gsd-launch.md` — GSD birth day
- [x] `2026-03-09-cron-audit.md` — Cron audit
- [x] `2026-03-11-claude-review/` — Claude review suggestions
- [x] `2026-03-14-document-audit.md` — Document audit report
- [x] `meta/agent-registry.md` + `meta/decision-log.md`

### presentations/ (Talks)
- [x] `low-cost-multi-agent-deployment.html` — Meetup talk (2026-03-15)
- [x] Lobster game image embedding (3 lobster images)

---

## Pending ⏳

### P1 — Content Quality (aligned with OPC Goal 1: Community Reputation)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| **Deduplicate 4 groups** | WeChat×4, Azure×4, Cron×2, 3-layer×2 → one-liner + link | GSD | ⏳ |
| `stories/identity-crisis.md` | GSD/WLB identity confusion crisis (great material) | WLB | ⏳ |
| `lessons/model-selection-guide.md` | Model selection decision tree | GSD | ⏳ |
| Enrich `gateway-6hour-outage.md` | Add narrative, quantify losses | GSD | ⏳ |
| Update `now/2026-03.md` | P0 completion milestones + Meetup notes | WLB | ⏳ |

### P1 — Speaking Revenue (aligned with OPC Goal 2)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| Meetup recording transcription | Transcribe + summarize | GSD | ⏳ |
| Meetup content → community posts | Split into shareable segments | GSD | ⏳ |
| `drafts/proposals/talk-template.md` | Talk template (in claw-agents-shared) | WLB | ⏳ |

### P1 — Website (aligned with OPC Goal 3)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| VitePress deployment polish | GitHub Pages + navigation optimization | GSD | ⏳ |
| `drafts/proposals/website-plan.md` | Website content plan (in claw-agents-shared) | WLB | ⏳ |

### P2 — Follow-up Optimizations

| Task | Description | Suggested Assignee |
|------|-------------|-------------------|
| Expand `resources/config-guide.md` | Currently only 35 lines | WLB |
| `discussions/meta/style-guide.md` | LIP writing style guide | WLB |
| `lessons/web-search-three-layers.md` | Web search three-layer architecture | WLB |
| Annotate pseudo-code in openclaw-02/03 | Mark concept examples clearly | GSD |
| Unify discussions/ structure | File/folder conventions | GSD |
| Standardize model names | kimi-k2.5 vs kimi-coding/k2p5 | GSD |

### Unmerged Branches

| Branch | Content | Status |
|--------|---------|--------|
| `claude/review-new-content-R7Euz` | Round 2 deep review + 2 new lessons + README/ROADMAP changes | Pending review |
| `claude/web-version-s2urG` | VitePress web version + GitHub Pages deployment | Pending review |
| `claude/debug-deployment-issue-pMSyx` | Share page navigation fix | Pending review |

---

## Rules

1. **Draft new content first** (claw-agents-shared/drafts/), push to LIP after MiaoDX confirmation
2. **Deduplication principle**: One full version per incident, others get one-liner + link
3. **Skip sensitive sources** (Azure model details, API channels, etc.)
4. **Check ✅ when done**

---

*Coach reviews progress on next check-in.*
