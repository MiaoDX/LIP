# NVIDIA: Building for the Rising Complexity of Agentic Systems with Extreme Co-Design

**Source:** [NVIDIA Technical Blog](https://developer.nvidia.com/blog/building-for-the-rising-complexity-of-agentic-systems-with-extreme-co-design/)  
**Published:** May 5, 2026  
**Lab:** NVIDIA  
**Topic:** Agentic AI Infrastructure / Extreme Co-Design

---

## Article Summary

NVIDIA's latest technical blog analyzes how agentic AI systems fundamentally break conventional inference economics, and proposes "extreme co-design" — a platform-level approach where specialized hardware (7 chips) and software stack work together to solve the throughput-interactivity-cost bottleneck that makes agentic systems economically challenging at scale.

Key data points:
- Anthropic estimates multi-agent systems consume **15x more tokens** than standard chat
- A real Claude Code session: **283 requests** (58 main-agent + 225 sub-agent) over **33 minutes**, context growing from 15K to 156K tokens before compaction
- Prompt caching at 95% hit rate reduces input cost by ~85%; without it, cost would be **6x higher**
- Vera Rubin NVL72 targets **400+ tokens/sec per user** on trillion-parameter MoE models with 400K context

---

## WLB Perspective

<!-- WLB: This is a strategic framing piece, not a product announcement. NVIDIA is positioning itself as the infrastructure layer for the "agentic chapter" of AI — a much larger TAM than the chatbot era. The key insight is that agents aren't just more compute; they're a different *shape* of compute. The article's three-part structure (token consumption → economics → infrastructure) is a classic problem-solution narrative, but the data backing it (real Claude Code traces) makes it credible.

What's striking is the explicit acknowledgment that "one processor isn't enough." This is NVIDIA admitting that even their own GPUs have limits, and the answer is platform-level specialization. The seven-chip stack (Vera Rubin NVL72 + Vera CPU + Groq 3 LPX + NVLink 6 + ConnectX-9 + BlueField-4 + Spectrum-X) reads like a deliberate response to the "one big GPU" criticism that has been brewing in the AI infra space.

The mention of "context rot" and the need for deliberate compaction events is notable — it's an admission that infinite context scaling isn't the answer, which somewhat undermines the 400K context bragging point. The real play here is KV cache management and prompt caching as a *systems problem*, not an API feature.

Strategic takeaway: NVIDIA is building the narrative that agentic AI requires a full-stack platform purchase, not just GPU rentals. This shifts the competitive frame from "who has the best GPU" to "who has the best agentic platform." That's a much stickier position. -->

---

## GSD Perspective

<!-- GSD: The engineering here is genuinely impressive. The real Claude Code trace (Figure 4) is the most valuable part — 283 requests, context growing to 156K, compaction down to 20K. This is what agentic workloads actually look like, and it's nothing like batch inference.

The token economics breakdown is sobering: 95% cache hit rate = 85% cost reduction. Without prompt caching, agentic systems are basically unaffordable at scale. The fact that coding agents sustain 95-98% cache hit rates is a key insight — it means the "agentic infra" problem is solvable *if* you have the right KV cache management.

The hardware stack is the headline, but the software pieces are what make it real:
- Dynamo + AFD (Attention-FFN Disaggregation) for splitting work across processors
- Cache programmability exposed to the agent harness
- NVFP4 for lower precision overhead on MoE
- TRT-LLM WideEP for large expert parallelism
- Speculative decoding for latency reduction

The 400+ tokens/sec target on trillion-parameter MoE with 400K context is ambitious. If they hit it, this changes the game — agents become viable products, not expensive experiments.

One concern: the article leans heavily on "co-design" as a buzzword. The actual technical details of how these 7 chips coordinate are thin. The Groq 3 LPX mention is interesting — SRAM-first architecture for low-jitter token generation — but there's no data on how it integrates with the rest of the stack. This feels like a positioning piece ahead of deeper technical dives.

Practical takeaway for our own work: prompt caching and KV cache management are the highest-leverage infra investments for agentic systems. Everything else (bigger GPUs, more FLOPs) is secondary. -->

---

## 联合结论

**WLB + GSD:** This article marks NVIDIA's strategic pivot from "we sell GPUs" to "we sell agentic platforms." The framing is strong, the data is real, and the hardware stack is ambitious.

**Where we agree:**
- Agentic workloads are structurally different from chat/batch inference — the 15x token multiplier and the Claude Code trace prove it
- Prompt caching / KV cache management is the critical infra layer, not raw FLOPs
- The throughput-interactivity-cost triangle is the real bottleneck

**Where we differ:**
- WLB sees this as a narrative play to increase platform stickiness and TAM; GSD sees genuine engineering innovation but wants more technical depth on chip-to-chip coordination
- WLB is skeptical about the 400K context claim given the admission that context rot requires compaction; GSD thinks 400K is a ceiling, not a floor, and compaction is a feature, not a bug

**For our own work:**
- Prioritize prompt caching infrastructure in our agentic stack
- Monitor NVIDIA Dynamo as a potential open-source serving layer
- The "sub-agent delegation" pattern described here mirrors our own WLB↔GSD architecture — validation that the approach is industry-aligned

---

## Model Signatures

- **WLB:** anthropic_kimi/k2.6 (reasoning: off)
- **GSD:** anthropic_kimi/k2.6 (reasoning: off)
- **Drafted:** 2026-05-07 11:05 AM CST
- **Source article:** May 5, 2026

---

*Part of the LIP (Learn In Public) lab analysis series.*
