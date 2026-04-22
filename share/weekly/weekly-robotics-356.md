---
title: "Weekly Robotics #356 — Digest for Xiaomi Robotics EI Team"
date: 2026-04-17
issue: 356
tags: [robotics, embodied-ai, vln, ros2, drone, sensor-fusion]
---

# Weekly Robotics #356

*April 13, 2026 | Curated for Xiaomi Robotics Embodied Intelligence Team*

_原始来源: <https://weeklyrobotics.com/weekly-robotics-356>_

---

## Executive Summary

This week's most useful signal for embodied AI is not a single flashy model, but steady maturation across the robotics stack: navigation without GPS, production-grade ROS 2 sensor fusion, more efficient trajectory generation, and more explicit safety-oriented computer architecture. For Xiaomi Robotics, the two most actionable items are HUNT and FusionCore, because they map directly to indoor navigation and deployable state-estimation infrastructure.

**Focus areas this week:** Navigation without absolute positioning, multi-sensor state estimation, trajectory optimization, safety-critical design.

---

## 🔥 Critical Deadlines

- **Apr 15**: Robotics & Physical AI day (Mashup) — Malmö, Sweden
- **Apr 23**: Actuate Global — San Francisco: Industry Night
- **Apr 30**: Hands-on Workshop: Scaling VLA Models with Ray — Pittsburgh, high relevance for embodied AI work
- **Apr 30**: Actuate Global — London: Community Meetup
- **May 4**: Actuate Global — Paris: Community Meetup
- **May 6**: NextGen Robotics LIVE — Odense, Denmark
- **May 6**: Actuate Global — Zurich: Field Session
- **May 7**: Actuate Global — Munich: Community Meetup
- **May 22-23**: Open Hardware Summit — Berlin, Germany
- **May 27-28**: Robotics Summit & Expo 2026 — Boston, major industry event

---

## 🎯 Key Highlights for Embodied AI Teams

### Navigation & Mobile Robotics
• **HUNT** — GPS-denied drone navigation using instantaneous relative frames rebuilt from onboard signals (inertial, barometric, visual) ([VLN] [High Relevance])
  → _原始来源: <https://www.weeklyrobotics.com/articles/2026_04_07_rethinking_drone_autonomy_gps_denied/>_
  → _Why it matters to Xiaomi:_ Highly relevant to indoor VLN and embodied navigation where absolute positioning is weak or unavailable.
• **MIGHTY** — Hermite spline-based efficient trajectory planning with spatiotemporal optimization ([Planning] [Medium Relevance])
  → _原始来源: <https://aeroastro.mit.edu/news-impact/mighty-hermite-spline-based-efficient-trajectory-planning/> | 论文: <https://arxiv.org/abs/2511.10822> | 视频: <https://www.youtube.com/watch?v=Pvb-VPUdLvg>_
  → _Why it matters to Xiaomi:_ Useful reference for manipulator and mobile robot motion planning where smoothness and efficiency both matter.
### Manipulation
• *No notable manipulation-specific tools this week*

### AI Integration
• **NASA Artemis II Fault-Tolerant Computer** — "Fail silent" redundant architecture for deep-space reliability ([Safety] [Medium Relevance])
  → _原始来源: <https://cacm.acm.org/news/how-nasa-built-artemis-iis-fault-tolerant-computer/>_
  → _Why it matters to Xiaomi:_ Strong systems-design reference for humanoid robots and any robotics system operating close to people, where fault containment matters more than raw performance.

### Simulation
• *No notable simulation-specific tools this week*

### Other Notable Tools
• **FusionCore** — ROS 2 UKF-based sensor-fusion SDK with support for 3D, GNSS, IMU, wheel encoders, and more ([Localization] [Very High Relevance])
  → _原始来源: <https://discourse.openrobotics.org/t/fusioncore-which-is-a-ros-2-jazzy-sensor-fusion-package-robot-localization-replacement/53502> | 代码: <https://github.com/manankharwar/fusioncore>_
  → _Why it matters to Xiaomi:_ Closest to immediate engineering reuse, especially for CyberOne-style ROS 2 systems and state estimation pipelines.
• **What I learned from making my own drone (Part I)** — Practical lessons on IMUs, DShot, and PID implementation from a drone builder ([DIY] [Low Relevance])
  → _原始来源: <https://nbelakovski.substack.com/p/what-i-learned-from-making-my-own>_
• **LS3 Boston Dynamics Mini Resin Printing** — Community project building a tiny replica of Boston Dynamics' AlphaDog with moving parts ([Community] [Low Relevance])
  → _原始来源: <https://www.reddit.com/r/robotics/comments/1sj8q52/ls3_boston_dynamics_mini_resin_printing/>_

---

## 📅 Notable Events

| Event | Date | Location | Relevance |
|-------|------|----------|-----------|
| **Robotics & Physical AI day (Mashup)** | Apr 15 | Malmö, Sweden | Medium — Physical AI focus |
| **Actuate Global — San Francisco: Industry Night** | Apr 23 | San Francisco | Medium — Industry networking |
| **Actuate Global — London: Community Meetup** | Apr 30 | London | Medium — Community event |
| **Hands-on Workshop: Scaling VLA Models with Ray** | Apr 30 | Pittsburgh | High — VLA scaling directly relevant to our embodied AI work |
| **Actuate Global — Paris: Community Meetup** | May 4 | Paris | Medium — Community event |
| **NextGen Robotics LIVE** | May 6 | Odense, Denmark | Medium — Robotics event |
| **Actuate Global — Zurich: Field Session** | May 6 | Zurich | Medium — Field session |
| **Actuate Global — Munich: Community Meetup** | May 7 | Munich | Medium — Community event |
| **Open Hardware Summit** | May 22-23 | Berlin | Medium — Open hardware focus |
| **Robotics Summit & Expo 2026** | May 27-28 | Boston | High — Major industry event |

---

## 💡 Quick Take

The strongest signal this week is convergence. Navigation, fusion, planning, and safety are all becoming less academic and more deployable. That is exactly the phase where a robotics team should pay attention, because the best gains now often come not from a brand-new model, but from stitching together a tighter and more reliable system.

**Action items:**
1. Evaluate FusionCore for CyberOne state estimation integration
2. Study HUNT's relative frame approach for indoor VLN scenarios
3. Monitor ICRA 2026 program for embodied AI sessions

---

*Generated by GSD | [View all Weekly Robotics digests](/bestpractice/weekly-robotics/)*
