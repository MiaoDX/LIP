---
title: "Weekly Robotics #358 — Digest for Xiaomi Robotics EI Team"
date: 2026-04-28
issue: 358
tags: [robotics, embodied-ai, vln, ros2]
---

# Weekly Robotics #358

## 🔑 Top picks this week

### VLA Foundry — Vision-Language-Action Model Training Framework
**Relevance: 9/10 | Embodied AI / VLA**

VLA Foundry is an open-source framework from TRI-ML that unifies LLM, VLM, and VLA training in a single codebase. Unlike most open-source VLA efforts that focus only on the action fine-tuning stage, VLA Foundry provides a shared training stack with end-to-end control — from language pretraining all the way to action-expert fine-tuning. Supports both from-scratch training and pretrained backbones from Hugging Face.

**Why it matters for Xiaomi EI:** The unified training pipeline could significantly streamline VLA research. If we're building or iterating on embodied action models, this framework reduces the integration overhead of stitching together incompatible pretraining stages. Worth a deep dive before starting any new VLA training run.

🔗 [Source](https://tri-ml.github.io/vla_foundry/) · [GitHub](https://github.com/tri-ml/vla_foundry)

---

### NCore — NVIDIA's Open-Source Neural 3D Reconstruction & Simulation Platform
**Relevance: 8/10 | Simulation / ROS2 / Data Pipeline**

NCore is NVIDIA's open-source Python-based platform providing data representations, APIs, and tools for neural 3D reconstruction and simulation, with a focus on robotics and autonomous vehicle data. It natively supports modern neural rendering approaches and serves as a data infrastructure layer for physics-based simulation.

**Why it matters for Xiaomi EI:** Simulation-to-real gap is a core challenge in robot learning. NCore's focus on neural 3D reconstruction could enable richer environment representations for training. The AV focus is also relevant given that both AV and robotics share sensor-fusion and world-modeling pipelines.

🔗 [Source](https://research.nvidia.com/labs/sil/projects/ncore/) · [GitHub](https://github.com/nvidia/ncore)

---

### Sony AI Table Tennis Robot ("Ace") — Event Camera for Spin Detection
**Relevance: 7/10 | Embodied Perception / Manipulation**

Sony AI developed a robot manipulator on a gantry that achieves outstanding table tennis performance. The system uses multiple RGB cameras at 200Hz, with the standout innovation being the use of an event camera to measure ball spin — a genuinely novel sensor application for high-speed manipulation.

**Why it matters for Xiaomi EI:** Event cameras are underutilized in robotics manipulation pipelines. This demo shows that edge cases like fast-spinning objects (which blur in standard cameras) can be handled with event-based sensing. If our robot platforms encounter similar high-speed, partial-occlusion scenarios, event cameras could be a key sensor upgrade.

🔗 [Source](https://www.youtube.com/watch?v=EH8kZDc7OLk)

---

## 📦 Worth watching

### reBot-DevArm — $1,200 Open-Source 6 DoF Robot Arm (SeeedStudio)
A cost-efficient open-source 6 DoF arm at $1,200 with a 4.5 kg weight and 1.5 kg payload. The weight-to-payload ratio (3:1) is impressive for development platforms. Good candidate for research曙 idesk setups or低成本 manipulation experiments. [GitHub](https://github.com/Seeed-Projects/reBot-DevArm)

### WebODM — Drone Mapping Software
Open-source photogrammetry toolkit for drone-captured imagery. If your team is building spatial awareness or 3D mapping capabilities, WebODM provides an end-to-end pipeline from imagery to 3D point clouds and models. Relevant for outdoor robot navigation and environment modeling. [webodm.org](https://webodm.org/)

### Pudu Robotics Raises ~$150M, Targets Industrial Applications
Pudu Technology's $150M funding round values the company at $1.5B+. The company is pivoting from service robots (food service, hospitality) toward industrial applications. This signals intensifying competition in the Chinese industrial robotics market and potentially more open-source or partnership opportunities as Pudu scales its industrial portfolio. [Source](https://www.therobotreport.com/pudu-robotics-raises-nearly-150m-targets-industrial-applications/)

---

## 📅 Notable events

| Event | Date | Location | Notes |
|-------|------|----------|-------|
| Actuate Global — London | Apr 30, 2026 | London, UK | Foxglove-backed community meetup |
| Hands on Workshop: Scaling VLA Models with Ray | Apr 30, 2026 | Pittsburgh, USA | Directly relevant to VLA training at scale |
| Actuate Global — Paris | May 04, 2026 | Paris, France | Community meetup |
| Actuate Global — Zurich: Field Session | May 06, 2026 | Zurich, Switzerland | Hands-on robotics session |
| NextGen Robotics LIVE | May 06, 2026 | Odense, Denmark | Denmark's robotics hub |
| Actuate Global — Munich | May 07, 2026 | Munich, Germany | Community meetup |
| Open Hardware Summit | May 22–23, 2026 | Berlin, Germany | Open-source hardware |
| **Robotics Summit & Expo 2026** | **May 27–28, 2026** | **Boston, USA** | **High priority — major US robotics conference** |

**Recommendation:** The **Robotics Summit & Expo 2026** (May 27–28, Boston) is the highest-signal event for Xiaomi EI. If budget allows, attending or monitoring publications from this event is strongly advised.

---

## 💡 Quick take

This week's issue is VLA-heavy, continuing a clear trend from recent issues. VLA Foundry is the most important item — it's a serious attempt at building a unified, open-source VLA training stack, and teams starting new action model research should evaluate it before building custom pipelines.

On the industry side, Pudu's $150M raise and pivot to industrial applications underscores that Chinese robot companies are aggressively moving up the value chain. The table tennis robot's use of event cameras for spin detection is a practical example of how unconventional sensors can solve real-world perception problems that plague standard RGB approaches.

For simulation, NCore's emphasis on neural 3D reconstruction over traditional mesh-based methods suggests the field is converging on differentiable, learned representations as the foundation for sim-to-real transfer. Teams investing in physics simulation should monitor this space closely.