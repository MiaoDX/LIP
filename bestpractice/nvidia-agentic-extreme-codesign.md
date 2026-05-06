# NVIDIA: Building for the Rising Complexity of Agentic Systems with Extreme Co-Design

**Source**: [NVIDIA Technical Blog](https://developer.nvidia.com/blog/building-for-the-rising-complexity-of-agentic-systems-with-extreme-co-design/)  
**Date**: May 5, 2026  
**Authors**: Eduardo Alvarez, Benjamin Klieger, Graham Steele  
**Lab**: NVIDIA  
**Analyzed**: 2026-05-06

---

## Article Summary

NVIDIA's technical blog post analyzes the fundamental infrastructure shift required to support agentic AI systems. The core argument: agents consume **up to 15x more tokens** than standard chat (per Anthropic's multi-agent research), and conventional serving infrastructure breaks under this load. The solution is "extreme co-design" — a full-stack approach combining 7 specialized chips (Vera Rubin NVL72, Vera CPU, Groq 3 LPX, NVLink 6, ConnectX-9, BlueField-4, Spectrum-X) with software optimizations (Dynamo, NVFP4, TRT-LLM WideEP, speculative decoding) to deliver 400+ tokens/sec per user on trillion-parameter MoE models with 400K context.

Key sections:
1. **Transition from chatbots to agents**: How tool calling and agent chaining make workloads structurally probabilistic rather than linearly predictable
2. **Workload dynamics**: Real Claude Code session trace — 283 requests over 33 min, context growing from 15K to 156K tokens, 95-98% cache hit rates essential
3. **Performance requirements**: Agentic workloads sit on the high-interactivity, low-throughput side of the Pareto curve, making them economically challenging at scale
4. **Extreme co-design stack**: Hardware-software co-optimization across the entire platform

---

## WLB Perspective (Decision/Balance)

<!-- WLB: This is a strategic infrastructure analysis, not just a product announcement. NVIDIA is making a bet that agentic systems will drive the next wave of compute demand, and they're positioning the entire Vera Rubin platform around it. -->

### What matters for our work

**The token economics argument is the key insight.** Anthropic's 15x token multiplier isn't a bug — it's the defining characteristic of agentic systems. For our WLB-GSD duo, this means:

- **Context management is a first-class design concern**, not an afterthought. The "context rot" phenomenon (degraded output quality as context expands) is real and measurable. Our mailbox protocol with JSON message files and processed/new folders is actually a form of file-system statefulness — but we should be more intentional about compaction strategies.

- **Sub-agent delegation isn't just about parallelization** — it's about cost management. The article shows sub-agents start fresh contexts, reducing input token costs. This validates our delegation model (GSD handling execution, WLB handling analysis/planning) but suggests we should be more explicit about context handoff protocols.

- **The 95-98% cache hit rate target** is revealing. Prompt caching makes agentic workloads economically viable. For our setup, this translates to: keep system prompts stable, minimize tool output verbosity, and design for KV cache reuse across turns.

### Strategic observation

NVIDIA's "extreme co-design" is essentially admitting that general-purpose GPUs alone can't solve agentic inference. They're building a vertically integrated stack. For smaller teams, the implication is: **don't try to compete on infrastructure, compete on agent architecture design.** The hardware will get commoditized; the orchestration logic won't.

### Risk note

The article cites Stripe (1,300+ PRs/week from agents) and Ramp (30% of merged PRs from agents) as evidence of agentic scale. These are impressive but also selection-biased toward coding tasks with clear success criteria. Agentic systems for open-ended research or creative work may have very different token dynamics.

---

## GSD Perspective (Execution/Get Stuff Done)

<!-- GSD: This article is gold for execution-minded folks. It gives us concrete numbers and a real session trace we can learn from. -->

### Concrete takeaways for building

**1. The Claude Code trace is a goldmine of real data:**
- 33 min session, 283 requests, 58 main-agent turns + 225 sub-agent invocations
- Context growth: 15K → 156K → compaction → 20K → regrowth
- Main agent averaged ~85K tokens/turn in first 40 turns
- 3.5M input tokens processed before compaction, then another 1M after

**This tells us:** Our current mailbox messages should stay compact. A 156K context is expensive and degrades quality. The JSON protocol is good — structured, predictable size — but we should add explicit compaction triggers.

**2. The hardware stack breakdown is actually useful for reasoning about tradeoffs:**

| Component | What it solves | Our equivalent |
|-----------|---------------|----------------|
| Vera Rubin NVL72 | HBM capacity for long context | N/A — we use API providers |
| Vera CPU | Tool execution, KV cache offload | Our host machine does this |
| Groq 3 LPX | Low-jitter token generation | We rely on provider SLA |
| NVLink 6 / ConnectX-9 | Low-latency agent coordination | Network latency between our tools |
| BlueField-4 | Context memory storage | Local file system |
| Dynamo + AFD | Inference disaggregation | Our tool-call orchestration |
| NVFP4 | Lower precision, higher throughput | Model quantization choices |

**3. The "context rot" link to Chroma's research** is worth following up. If there's a measurable degradation curve, we should know where our threshold is.

### Implementation ideas

- **Add a `context_size` field to our mailbox protocol** — track it explicitly
- **Design a compaction strategy**: when context exceeds a threshold, summarize and archive
- **Tool output should be bounded**: the article notes "when tool output stays small" cache hit rates stay high. Our tool outputs (file reads, exec results) should have size limits
- **Consider sub-agent model downgrading**: smaller/cheaper models for narrow subtasks, reserving the "smartest model" for the primary agent

### One skeptic note

The "400+ tokens/sec per user on trillion-parameter MoE models with 400K context" claim is a platform marketing number. Real-world performance depends on workload mix, cache hit rates, and network conditions. Don't plan around peak specs.

---

## 联合结论 (Joint Conclusion)

**NVIDIA's extreme co-design thesis is both a product strategy and a validation of where agentic systems are heading.** The 15x token multiplier, context rot, and sub-agent delegation patterns aren't NVIDIA-specific — they're inherent to agentic architectures. 

**For our WLB-GSD setup:**
1. **Context is currency** — every token in the window has a cost (literal API cost + quality degradation). Design for compaction from day one.
2. **Delegation is cost optimization** — not just parallelization. The primary/sub-agent split should be intentional, with clear handoff contracts.
3. **Cache-friendly design wins** — stable system prompts, bounded tool outputs, and predictable context shapes make the economics work.
4. **Don't over-invest in infrastructure** — NVIDIA is solving the hardware layer. Our value is in the agent architecture and orchestration logic above it.

**Bottom line**: This article gives us a vocabulary and quantitative framework for thinking about our own agentic system design. The Claude Code trace alone justifies the read.

---

## Model Signatures

- **WLB analysis**: anthropic_kimi/k2.6 (reasoning: off)
- **GSD analysis**: anthropic_kimi/k2.6 (reasoning: off)
- **Draft date**: 2026-05-06
- **Analysis time**: ~8 minutes

---

## Related Readings

- [Anthropic: Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system) (cited in article)
- [NVIDIA: Full-Stack Optimizations for Agentic Inference with Dynamo](https://developer.nvidia.com/blog/full-stack-optimizations-for-agentic-inference-with-nvidia-dynamo/)
- [Chroma: Context Rot Research](https://www.trychroma.com/research/context-rot)
- [NVIDIA: Inside the Vera Rubin Platform](https://developer.nvidia.com/blog/inside-the-nvidia-vera-rubin-platform/)
