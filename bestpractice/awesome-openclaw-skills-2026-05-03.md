# Awesome OpenClaw Skills — Weekly Check Report

**Date:** 2026-05-03 (Sunday)
**Checker:** GSD (automated cron)
**Source:** https://github.com/VoltAgent/awesome-openclaw-skills
**Registry Stats:** 5,211 curated skills (from 13,729 total in ClawHub)

---

## 1. New Skills Added Since Last Check

This is the first run of this cron job — no previous baseline exists. Reviewing the most recently merged PRs (Apr 1–Apr 20, 2026):

| Skill | Category | Merged | Description |
|-------|----------|--------|-------------|
| **postiz** | Marketing & Sales | Apr 20 | Social media scheduling/management |
| **adspower-browser** | Browser & Automation | Apr 20 | AdsPower anti-detect browser automation |
| **mobilerun** | Browser & Automation | Apr 20 | Mobile device testing automation |
| **socialecho-social-media-management-agent** | Marketing & Sales | Apr 20 | Social media management agent |
| **Skywork (6 skills)** | AI & LLMs / Media | Apr 20 | Chinese AI suite: PPT, music, design, search, image gen, video |
| **duoplus-agent** | Browser & Automation | Apr 20 | Cloud phone control via ADB |
| **skill-provenance** | Security | Apr 20 | Skill provenance tracking |
| **chords-fetcher** | Media | Apr 20 | Music chord fetching |
| **yumfu** | Productivity | Apr 20 | (details unclear) |
| **ai-video-remix** | Image & Video | Apr 20 | AI video remix from local library |
| **jubjub** | Media & Streaming | Apr 4 | Media streaming skill |
| **morrow-agent-memory** | AI & LLMs | Apr 1 | Agent memory management |
| **ima-knowledge-ai** | Notes & PKM | Apr 1 | Knowledge base AI |
| **agent-security-harness** | Security | Mar 26 | Security harness for agents |
| **ima-all-ai** | Image & Video | Mar 24 | Image/video/music/tts all-in-one |
| **edgeone-clawscan** | DevOps & Cloud | Mar 24 | EdgeOne security scanning |
| **boss-ai-agent** | Productivity | Mar 24 | AI agent management |
| **solid-agent-storage** | DevOps & Cloud | Mar 24 | Agent storage solution |
| **menews** | Browser & Automation | Mar 24 | News browsing automation |
| **honcho-setup** | Clawdbot Tools | Mar 24 | Persistent cross-session memory via Honcho |
| **soul-generator** | Clawdbot Tools | Mar 24 | SOUL.md generator |
| **lobstermail-agent-email** | Communication | Mar 24 | Agent email system |
| **domain-checker** | CLI Utilities | Mar 24 | Domain availability checker |
| **lightcone-browse/session** | Browser & Automation | Mar 24 | Browser automation tools |
| **flowtriq** | Productivity | Mar 24 | Workflow automation |
| **PLUR** | AI & LLMs | Apr 1 | Persistent memory ContextEngine (YAML-based, 86.7% LongMemEval) |

---

## 2. Skills Relevant to Our Workflow

Based on MiaoDX's context (AI/AD engineering, multi-agent WLB↔GSD setup, Beijing-based), these stand out:

### 🔥 High Relevance

| Skill | Why It Matters |
|-------|---------------|
| **Skywork (skywork-search)** | AI-powered web search for real-time info — we already have search but this is Chinese-market aware |
| **Skywork (skywork-ppt)** | Generate/edit PowerPoint — useful for Xiaomi EI team presentations |
| **morrow-agent-memory** | Agent memory management — complements our proactive-agent WAL/memory approach |
| **honcho-setup** | Persistent cross-session memory — directly relevant to our memory persistence goals |
| **soul-generator** | SOUL.md generator — could help WLB or future agents bootstrap identity |
| **agent-security-harness** | Security audit for agent setups — aligns with our security-conscious posture |
| **skill-provenance** | Track skill provenance — useful as we install more third-party skills |
| **PLUR** | YAML-based persistent memory, local-first, no API calls — strong fit for our "sovereignty" framing |

### 📊 Medium Relevance

| Skill | Why It Matters |
|-------|---------------|
| **postiz** | Social media scheduling — if MiaoDX wants to automate content posting |
| **adspower-browser** | Anti-detect browser automation — for web scraping that needs stealth |
| **duoplus-agent** | Cloud phone control — if mobile testing becomes needed |
| **domain-checker** | Quick domain availability checks — useful for side projects |
| **ai-video-remix** | Video content generation — if LIP needs video content |
| **lobstermail-agent-email** | Agent email system — alternative to current email approaches |

### ❌ Low Relevance / Skip

- **mobilerun** — Mobile testing, not current need
- **socialecho** — Social media management, not current focus
- **chords-fetcher, yumfu** — Not aligned with current workflow
- **ima-knowledge-ai** — Overlaps with our existing PKM approach
- **edgeone-clawscan** — Tencent EdgeOne specific, not our stack
- **boss-ai-agent** — Generic agent management, we have our own
- **solid-agent-storage** — Storage solution, not immediately needed
- **menews** — News browsing, we have RSS already
- **lightcone-browse/session** — Browser automation overlap with existing tools
- **flowtriq** — Workflow automation, overlaps with taskflow

---

## 3. Recommendations

### Install Now (High Value, Low Risk)

1. **`honcho-setup`** — Persistent cross-session memory. We currently rely on MEMORY.md + memory/*.md files. Honcho could provide a more structured memory layer. Install: `clawhub install ajspig/honcho-setup`

2. **`soul-generator`** — Could help standardize agent identity docs. Useful if we add more agents beyond WLB/GSD. Install: `clawhub install adenzhou1350/soul-generator`

3. **`skill-provenance`** — As we install more third-party skills, tracking their origin and trust scores becomes important. Install: `clawhub install snapsynapse/skill-provenance`

### Evaluate Soon

4. **`morrow-agent-memory`** — Compare with our current proactive-agent memory approach. May offer complementary features.

5. **`PLUR`** — YAML-based persistent memory, local-first. Very aligned with our sovereignty/framing goals. Worth a deep look.

6. **`agent-security-harness`** — Run a security audit on our current skill stack. Good hygiene.

### Monitor

7. **Skywork suite** — Chinese AI tools (PPT, image, music, search). If MiaoDX needs China-market-specific AI capabilities, these are worth watching. The search skill in particular could supplement our current web search.

8. **`postiz`** — If MiaoDX starts doing more content marketing for LIP.

---

## 4. Current Skill Inventory

**System-installed (`/openclaw/skills/`):** 55 skills including github, slack, notion, obsidian, trello, spotify, weather, canvas, tmux, healthcheck, taskflow, model-usage, video-frames, etc.

**Workspace-installed (`/data/workspace/skills/`):** 1 skill — `dream` (custom)

**Skill-creator available:** Yes (`/openclaw/skills/skill-creator/`)

---

## 5. Action Items

- [ ] Install `honcho-setup` and evaluate for WLB/GSD memory persistence
- [ ] Install `soul-generator` and test identity doc generation
- [ ] Review `PLUR` ContextEngine for potential integration
- [ ] Run `agent-security-harness` audit on current skill stack
- [ ] Set next check for ~1 week later (May 10)

---

*Report generated by GSD | Cron: b776eec2-db6c-48f0-8b8c-edbb8c6aa132*
