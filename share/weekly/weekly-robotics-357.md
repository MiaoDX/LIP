---
title: "Weekly Robotics #357 — Digest for Xiaomi Robotics EI Team"
date: 2026-04-20
issue: 357
tags: [robotics, embodied-ai, vla, simulation, humanoid]
---

# Weekly Robotics #357

*April 20, 2026 | Curated for Xiaomi Robotics Embodied Intelligence Team*

_原始来源: <https://weeklyrobotics.com/weekly-robotics-357>_

---

## Executive Summary

This week is VLA-heavy. mimic-video claims 10x sample efficiency over traditional VLAs, Gemini Robotics ER 1.6 adds embodied reasoning via API, and Physical Intelligence's Pi0.7 demonstrates emergent behavior composition. On the hardware side, a Chinese humanoid broke the half-marathon world record, while simulation tooling (UnrealRoboticsLab) and data ethics (India's "hand farms") both advanced. The signal: embodied AI is moving from demo to deployable infrastructure faster than expected.

**Focus areas this week:** VLA architectures, embodied reasoning APIs, humanoid locomotion, simulation tooling, data ethics.

---

## 🔥 Critical Deadlines

• **Apr 23**: Actuate Global — San Francisco: Industry Night
• **Apr 30**: Hands-on Workshop: Scaling VLA Models with Ray — Pittsburgh
• **Apr 30**: Actuate Global — London: Community Meetup
• **May 4**: Actuate Global — Paris: Community Meetup
• **May 6**: NextGen Robotics LIVE — Odense, Denmark
• **May 6**: Actuate Global — Zurich: Field Session
• **May 7**: Actuate Global — Munich: Community Meetup
• **May 18**: Cracow Robotics & AI Meetup — Krakow, Poland
• **May 22-23**: Open Hardware Summit — Berlin, Germany
• **May 27-28**: Robotics Summit & Expo 2026 — Boston
• **Jun 1-5**: ICRA 2026 — Vienna

---

## 🎯 Key Highlights for Embodied AI Teams

### VLA & General Robot Control
• **mimic-video** — Video-Action Model (VAM) pairing pretrained video model with flow matching-based action decoder, achieving 10x sample efficiency and 2x convergence speed vs traditional VLAs ([VLA] [Very High Relevance])
  → _原始来源: <https://mimic-video.github.io/> | 论文: <https://arxiv.org/abs/2512.15692>_
  → _Why it matters to Xiaomi:_ If the 10x sample efficiency claim holds, this directly impacts how quickly we can train manipulation policies for CyberOne and other platforms.

• **Gemini Robotics ER 1.6** — Enhanced embodied reasoning model available via API, with gauge-reading and spatial reasoning capabilities ([Embodied Reasoning] [High Relevance])
  → _原始来源: <https://deepmind.google/blog/gemini-robotics-er-1-6/>_
  → _Why it matters to Xiaomi:_ API availability means we can benchmark against it quickly, and gauge-reading is a concrete industrial use case.

• **Pi0.7** — Physical Intelligence's steerable model with emergent behavior composition, generalizing to tasks not explicitly trained on ([Generalist Models] [High Relevance])
  → _原始来源: <https://www.pi.website/blog/pi07>_
  → _Why it matters to Xiaomi:_ Emergent composition is the holy grail for generalist robots — if this scales, it changes the training paradigm.

### Humanoid & Locomotion
• **Chinese humanoid half-marathon record** — Robot completed 13-mile race in 50:26, beating human world record ([Humanoid] [Medium Relevance])
  → _原始来源: <https://nypost.com/2026/04/19/world-news/chinese-robot-smashes-human-world-record-in-half-marathon/>_
  → _Why it matters to Xiaomi:_ Endurance locomotion is a different challenge than sprint demos. This suggests battery, thermal, and control systems are maturing.

### Simulation & Tools
• **UnrealRoboticsLab** — Unreal Engine 5 plugin embedding MuJoCo physics with drag-and-drop MJCF import, 40+ sensor types, Python policy integration ([Simulation] [High Relevance])
  → _原始来源: <https://github.com/URLab-Sim/UnrealRoboticsLab>_
  → _Why it matters to Xiaomi:_ UE5 + MuJoCo bridges the photorealistic rendering gap for sim-to-real transfer. Worth evaluating against our current Isaac Sim workflow.

### Data & Ethics
• **The Hidden "Hand Farms" of India** — How human motion capture datasets are collected at scale, including ethical dimensions ([Data] [Medium Relevance])
  → _原始来源: <https://quasa.io/media/the-hidden-hand-farms-of-india-fueling-the-ai-robot-revolution-with-human-motion>_
  → _Why it matters to Xiaomi:_ Our data pipeline strategy should account for provenance and ethics, especially as regulation tightens globally.

### Other Notable Tools
• **Robot golf (Stuff Made Here)** — One-DOF robot achieving surprisingly good golf results ([Entertainment] [Low Relevance])
  → _原始来源: <https://m.youtube.com/watch?v=2OfjZ3ORJfc>_

• **Mini Cheetah Fails** — Compilation of quadruped failures as engineering reality check ([Education] [Low Relevance])
  → _原始来源: <https://m.youtube.com/watch?v=nmViQ1T03Rk>_

• **Delivery robots fails** — Reddit compilation of real-world deployment issues ([Deployment] [Low Relevance])
  → _原始来源: <https://www.reddit.com/r/mildlyinfuriating/comments/1skq5jr/these_robots_are_drunk/>_

---

## 📅 Notable Events

| Event | Date | Location | Relevance |
|-------|------|----------|-----------|
| **Actuate Global — San Francisco: Industry Night** | Apr 23 | San Francisco | Medium — Industry networking |
| **Actuate Global — London: Community Meetup** | Apr 30 | London | Medium — Community event |
| **Hands-on Workshop: Scaling VLA Models with Ray** | Apr 30 | Pittsburgh | High — VLA scaling directly relevant to embodied AI |
| **Actuate Global — Paris: Community Meetup** | May 4 | Paris | Medium — Community event |
| **NextGen Robotics LIVE** | May 6 | Odense, Denmark | Medium — Robotics event |
| **Actuate Global — Zurich: Field Session** | May 6 | Zurich | Medium — Field session |
| **Actuate Global — Munich: Community Meetup** | May 7 | Munich | Medium — Community event |
| **Cracow Robotics & AI Meetup** | May 18 | Krakow, Poland | Medium — Regional meetup |
| **Open Hardware Summit** | May 22-23 | Berlin | Medium — Open hardware focus |
| **Robotics Summit & Expo 2026** | May 27-28 | Boston | High — Major industry event |
| **ICRA 2026** | Jun 1-5 | Vienna | Very High — Flagship robotics conference |

---

## 💡 Quick Take

Three signals this week point to the same trend: embodied AI is becoming a platform, not just a research topic. Gemini ER 1.6 is available via API. mimic-video claims 10x training efficiency. Pi0.7 shows emergent composition. The gap between "published" and "deployable" is narrowing fast. For Xiaomi, the actionable insight is: benchmark these platforms now, because the window for competitive differentiation is closing.

**Action items:**
1. Benchmark mimic-video against our current VLA pipeline for manipulation tasks
2. Evaluate Gemini Robotics ER 1.6 API for gauge-reading and spatial reasoning use cases
3. Test UnrealRoboticsLab as alternative to Isaac Sim for photorealistic sim-to-real
4. Monitor Pi0.7 for emergent behavior patterns relevant to generalist robot training

---

*Generated by GSD | [View all Weekly Robotics digests](/bestpractice/weekly-robotics/)*
