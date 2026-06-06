# LIP Roadmap

> All planned content, completion status, and priorities. Claude / MiaoDX can review and adjust anytime.

**Last Updated:** 2026-06-06
**Maintainers:** WLB 🦞 + GSD 🥷⚡ + Coach 🎯

---

## Completed ✅

### Core Structure
- [x] `README.md` — Navigation + reading recommendations (2026-03-11, 03-15 updated)
- [x] `JJ_MIGRATION.md` — jj migration announcement

### now/ (Monthly Reports)
- [x] `now/2026-03.md` — Dual Agent launch monthly report
- [x] `now/2026-04.md` — April governance-structure monthly report

### stories/ (Cases)
- [x] `2026-03-dual-agent-start.md` — Complete dual Agent launch pitfall log
- [x] OpenClaw deployment, configuration, and best-practice track — consolidated into [openclaw/](/openclaw/), the [deployment guide](/resources/deployment-guide-v2), and the [configuration guide](/resources/config-guide)
- [x] `fusheng-lobster-experiment.md` — Fu Sheng's lobster experiment
- [x] `gateway-6hour-outage.md` — 6-hour outage post-mortem
- [x] `wechat-scraping-war.md` — WeChat scraping battle

### lessons/ (Experience)
- [x] `error-to-skill-evolution.md` — Error→Skill self-evolution
- [x] `cron-anti-hallucination.md` — Cron anti-hallucination
- [x] `azure-config-incident.md` — Azure config incident post-mortem

### drafts/ (Awaiting Optimization)
- [x] `drafts/lessons/gateway-resilience.md` — Three-layer protection architecture, awaiting deeper analysis before publication
- [x] `drafts/lessons/cross-instance-collaboration.md` — Cross-instance collaboration, awaiting stronger reusable value before publication

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
- [x] `proposals/talk-template.md` — reusable talk template distilled from the 2026-03-15 Meetup retrospective

### resources/ (Resources)
- [x] `resources/config-guide.md` — OpenClaw configuration entry points, environment variables, models, Slack, search, CDP, Cron checklist

### Website and Publishing
- [x] VitePress + GitHub Pages deployment flow — `.github/workflows/deploy.yml` runs `npm run build:all` for docs, standalone pages, Marp, Slidev, and publish checks
- [x] English entry and language switch — `en/` mirror entry, English nav, and sidebar are wired

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

### P1 — Website (Align with OPC G3)

| Task | Description | Suggested Assignee | Status |
|------|-------------|-------------------|--------|
| Website content planning | Turn the G3 target in `proposals/2026-q2-okr.md` into an executable page plan | WLB | ⏳ |

### P2 — Follow-up Optimization

| Task | Description | Suggested Assignee |
|------|-------------|-------------------|
| `discussions/meta/style-guide.md` | LIP writing style guide | WLB |
| `lessons/web-search-three-layers.md` | Web search three-layer architecture | WLB |
| Unify discussions/ structure | File/folder rules | GSD |
| Unify model names | kimi-k2.5 vs kimi-coding/k2p5 | GSD |

### Unmerged Branches

There are currently no local `claude/*` unmerged branches. Historical Claude
review records remain in `discussions/2026-03-11-claude-review/` and are no
longer tracked as pending branches.

---

## Rules

1. **New content first in drafts** (this repo's `drafts/` or `proposals/`), then publish to the target section after MiaoDX confirms
2. **Deduplication principle**: Same event keeps only one complete version, others use one sentence + link
3. **Skip sensitive sources** (Azure models, API channels, etc.)
4. **Mark ✅ after completion**

---

*Coach will check execution progress at next review.*
