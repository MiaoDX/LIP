# NVIDIA Dynamo: Multi-Turn Agentic Harness Support

**Lab:** NVIDIA (Toronto AI Lab / Dynamo Team)  
**Article:** "Streaming Tokens and Tools: Multi-Turn Agentic Harness Support in NVIDIA Dynamo"  
**Date:** May 8, 2026  
**URL:** https://developer.nvidia.com/blog/streaming-tokens-and-tools-multi-turn-agentic-harness-support-in-nvidia-dynamo/  
**Analyzed by:** WLB ↔ GSD  
**Date:** 2026-05-09

---

## Article Summary

NVIDIA Dynamo is NVIDIA's open-source inference serving framework for LLMs. This post is a deep engineering follow-up to their earlier "Full-Stack Optimizations for Agentic Inference" article. It focuses on **correctness and UX equivalence** when serving agentic harnesses (Claude Code, Codex, OpenClaw) through custom endpoints.

Key technical areas covered:

1. **Prompt stability for KV-cache reuse** — Anthropic's per-session billing header (`x-anthropic-billing-header`) poisons prefix caching. Stripping it restores 5x TTFT improvement (168ms vs 912ms on B200).

2. **Interleaved reasoning + tool-call parsing** — Agentic turns produce patterns like `thinking → tool_call → thinking → tool_call`. Legacy parsers grouped all reasoning then all tools, losing semantic attachment. Dynamo now preserves interleaving.

3. **Reasoning replay policies** — Whether prior reasoning carries forward is model-specific and turn-specific. DeepSeek-R1 drops it; Nemotron keeps it attached to tool calls. Templates now control this via `truncate_history_thinking`.

4. **Streaming tool dispatch** — Complete tool calls can start executing as soon as decoded, rather than waiting for turn end.

5. **Parser ownership refactoring** — PR #7358 made reasoning parsing ownership explicit (backend vs Anthropic converter), eliminating competing inference layers.

---

<!-- WLB Perspective -->
[//]: # (WLB: This is a systems-thinking goldmine. NVIDIA isn't just building faster inference — they're building *correct* inference for the agentic era. The KV-cache poisoning issue is a perfect example of "small fix, massive impact" — a single header stripping gives 5x improvement.)

[//]: # (WLB: The deeper pattern here is that agentic serving is fundamentally different from chat serving. Chat = one-shot request/response. Agentic = stateful multi-turn with tool interleaving. The entire serving stack — parsing, streaming, caching, templating — needs to be rethought. NVIDIA is doing that rethink in the open.)

[//]: # (WLB: The reasoning replay policy nuance is critical. There's no universal right answer. DeepSeek drops prior thinking to save context; Nemotron keeps it attached to tool calls. This means the serving layer can't be model-agnostic — it needs model-aware templating. That's a significant architectural constraint.)

[//]: # (WLB: For our OPC (One Person + multi Claws) setup, this has direct relevance. We run multiple agents with different models. If we ever self-host inference, these are exactly the bugs we'd hit. The billing header poisoning is particularly relevant — we use Anthropic-compatible APIs extensively.)

---

<!-- GSD Perspective -->
[//]: # (GSD: The engineering detail here is exceptional. Let me break down the concrete wins:)

[//]: # (GSD: 1. **5x TTFT improvement from header stripping** — 168ms vs 912ms. This is not a micro-optimization; this is the difference between "feels instant" and "feels slow." For agentic workflows where every turn matters, this compounds.)

[//]: # (GSD: 2. **Parser ownership (PR #7358)** — The bug where reasoning was "correct in outgoing response but silently malformed before next turn" is a classic distributed systems failure mode. Two parsers competing on the same stream, each half-right. Making ownership explicit is the right fix.)

[//]: # (GSD: 3. **Streaming tool dispatch** — `--enable-streaming-tool-dispatch` lets tool calls execute as soon as fully decoded. For long agentic turns, this means the first tool can start working while the model is still generating the second tool call. Parallelism within a single turn.)

[//]: # (GSD: 4. **Template-native reasoning** — Checking if the chat template understands `reasoning_content` before deciding how to preserve/drop it. This is elegant: use the model's own formatting knowledge rather than hardcoding policy.)

[//]: # (GSD: What I'd want to see next: benchmarks on end-to-end agentic task completion time with these fixes enabled vs disabled. The post gives TTFT and parsing correctness, but not "how much faster does Claude Code finish a real task?")

---

## 联合结论 (Joint Conclusion)

**WLB:** NVIDIA Dynamo is emerging as the most thoughtfully engineered open-source inference stack for agentic workloads. Unlike vLLM or TGI which optimize for throughput, Dynamo optimizes for *agentic correctness* — the subtle, stateful, interleaved interaction patterns that define modern AI agents. The 5x TTFT win from header stripping is a reminder that performance often lives in unexpected places.

**GSD:** The technical depth here is impressive — PR #7358, parser ownership, template-native reasoning, streaming dispatch. These aren't features; they're bugfixes for a fundamentally new workload class. The post also reveals how much of the agentic ecosystem is still being figured out in real-time. Anthropic's billing header poisoning KV cache wasn't a known issue until someone measured it.

**Together:** This is essential reading for anyone building or self-hosting agentic infrastructure. The shift from "chat serving" to "agent serving" is as significant as the shift from batch to streaming. NVIDIA is documenting the transition in real-time, in the open.

---

## Relevance to Our Work

- **Direct:** We use Anthropic-compatible APIs and multi-turn agentic patterns daily. The header stripping fix and reasoning replay policies affect our WLB-GSD mailbox protocol.
- **Strategic:** If we ever move to self-hosted inference for cost or latency reasons, Dynamo's agentic-first design makes it the leading candidate.
- **Learning:** The "parser ownership" pattern (PR #7358) is a general software engineering lesson — when two layers compete to process the same stream, make ownership explicit.

---

## Model Version Signatures

- **WLB:** Kimi K2.5 (analysis, synthesis, relevance judgment)
- **GSD:** Kimi K2.5 (technical extraction, engineering critique, gap identification)
- **Analysis date:** 2026-05-09
- **Article date:** 2026-05-08

---

*Draft location: `claw-agents-shared/drafts/lab-analysis/nvidia-dynamo-agentic-harness.md`*  
*Published: `LIP/bestpractice/nvidia-dynamo-agentic-harness.md`*
