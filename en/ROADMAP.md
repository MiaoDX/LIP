# LIP Roadmap

> All planned content, completion status, and priorities. Claude / MiaoDX can review and adjust anytime.

**Last Updated:** 2026-03-15
**Maintainers:** WLB 🦞 + GSD 🥷⚡ + Coach 🎯

---

## Completed ✅

### Core Structure
- [x] `README.md` — Navigation + reading recommendations (2026-03-11, 03-15 updated)
- [x] `JJ_MIGRATION.md` — jj migration announcement

### now/ (Monthly Reports)
- [x] `now/2026-03.md` — Dual Agent launch monthly report

### stories/ (Cases)
- [x] `2026-03-dual-agent-start.md` — Complete dual Agent launch pitfall log
- [x] `openclaw-01-deployment.md` — Deployment pitfalls
- [x] `openclaw-02-configuration.md` — Configuration optimization
- [x] `openclaw-03-best-practices.md` — Best practices
- [x] `openclaw-01-deployment.md` → `openclaw-02-configuration.md` → `openclaw-03-best-practices.md` — Consolidated into [openclaw/](/openclaw/)
- [x] `fusheng-lobster-experiment.md` — Fu Sheng's lobster experiment
- [x] `gateway-6hour-outage.md` — 6-hour outage post-mortem
- [x] `wechat-scraping-war.md` — WeChat scraping battle

### lessons/ (Experience)
- [x] `cross-instance-collaboration.md` — Cross-instance collaboration
- [x] `error-to-skill-evolution.md` — Error→Skill self-evolution
- [x] `gateway-resilience.md` — Three-layer protection architecture
- [x] `cron-anti-hallucination.md` — Cron anti-hallucination
- [x] `azure-config-incident.md` — Azure config incident post-mortem

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

### P1 — Content Quality (Align with OPC G1 Community Reputation)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| **Deduplicate 4 duplicate groups** | WeChat×4, Azure×4, Cron×2, Three-layer protection×2 → one sentence + link | GSD | ⏳ |
| `stories/identity-crisis.md` | GSD/WLB identity confusion crisis (good material) | WLB | ⏳ |
| `lessons/model-selection-guide.md` | Model selection decision tree | GSD | ⏳ |
| Enrich `gateway-6hour-outage.md` | Add narrative, quantify losses | GSD | ⏳ |
| Update `now/2026-03.md` | P0 completion milestone + Meetup record | WLB | ⏳ |

### P1 — Talk Monetization (Align with OPC G2)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| Meetup recording transcription | Transcribe + summary | GSD | ⏳ |
| Meetup content→community posts | Break into community-shareable snippets | GSD | ⏳ |
| `drafts/proposals/talk-template.md` | Talk template (in claw-agents-shared) | WLB | ⏳ |

### P1 — Website (Align with OPC G3)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| VitePress deployment improvement | GitHub Pages + navigation optimization | GSD | ⏳ |
| `drafts/proposals/website-plan.md` | Website content planning (in claw-agents-shared) | WLB | ⏳ |
| **English version** | Add English translation with language switch | GSD+WLB | ✅ |

### P2 — Follow-up Optimization

| Task | Description | Suggested Assignee |
|------|-------------|-------------------|
| Expand `resources/config-guide.md` | Currently only 35 lines | WLB |
| `discussions/meta/style-guide.md` | LIP writing style guide | WLB |
| `lessons/web-search-three-layers.md` | Web search three-layer architecture | WLB |
| Label pseudocode in openclaw-02/03 | Concept examples need clear labeling | GSD |
| Unify discussions/ structure | File/folder rules | GSD |
| Unify model names | kimi-k2.5 vs kimi-coding/k2p5 | GSD |

### Unmerged Branches

| Branch | Content | Status |
|--------|---------|--------|
| `claude/review-new-content-R7Euz` | Round 2 deep review + 2 new lessons + README/ROADMAP changes | Pending review |
| `claude/web-version-s2urG` | VitePress web version + GitHub Pages deployment | Pending review |
| `claude/debug-deployment-issue-pMSyx` | Share page navigation fix | Pending review |

---

## Rules

1. **New content first in drafts** (claw-agents-shared/drafts/), MiaoDX confirms before pushing to LIP
2. **Deduplication principle**: Same event keeps only one complete version, others use one sentence + link
3. **Skip sensitive sources** (Azure models, API channels, etc.)
4. **Mark ✅ after completion**

---

*Coach will check execution progress at next review.*
