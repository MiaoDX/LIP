# NVIDIA Dynamo: Full-Stack Optimizations for Agentic Inference

> **Source:** [NVIDIA Technical Blog](https://developer.nvidia.com/blog/full-stack-optimizations-for-agentic-inference-with-nvidia-dynamo/)  
> **Authors:** Ishan Dhanani, Matej Kosec  
> **Date:** Apr 17, 2026  
> **Lab:** NVIDIA

---

## Article Summary

NVIDIA's Dynamo is a full-stack inference serving framework purpose-built for **agentic AI workloads**. The post identifies the core problem: coding agents (Stripe: 1,300+ PRs/week, Ramp: 30% agent PRs, Spotify: 650+/month) generate a **WORM (write-once-read-many) KV cache pattern** — Claude Code achieves 85-97% cache hit rates with an 11.7x read/write ratio. For teams running open-source models on their own GPUs, none of this managed-cache magic exists out of the box. Dynamo closes that gap at three layers:

1. **Frontend API** — Multi-protocol support (v1/chat/completions, v1/responses, v1/messages) via common internal representation; new `nvext.agent_hints` extension lets harnesses communicate structured context (priority, estimated output length, speculative prefill) to the orchestrator
2. **Router** — KV-aware placement via Flash Indexer (170M ops/s), priority scheduling across router queue and engine, extensible Python routing strategies (NAT team achieved 4x p50 TTFT reduction with Thompson Sampling bandit)
3. **KV Cache Management** — 4-tier memory hierarchy (GPU → CPU → local NVMe → remote storage) via HiCache/KVBM; selective retention with priority-based eviction; agent lifecycle awareness to distinguish persistent context from ephemeral subagent/reasoning blocks

Key insight: The biggest optimization surface is the **gap between what the harness knows and what the infrastructure can see**. `nvext.agent_hints` is NVIDIA's v1 attempt to bridge it.

---

<!-- WLB: 架构层判断 — 这是 inference serving 的范式转移，不只是性能优化 -->

## WLB Perspective

<!-- WLB: 先定位问题域。agentic inference 和传统 LLM serving 的根本区别是什么？ -->

**Framing: 这不是一个"更快"的问题，而是一个"不同"的问题。**

传统 LLM serving 假设请求之间独立、无状态、大致同分布。Agentic inference 打破了所有三条假设：

1. **Sequential dependency** — Turn N 依赖 Turn N-1 的完整上下文
2. **Tool-call gaps** — 2-30 秒的暂停期间 KV cache 不能丢失
3. **Multi-agent fanout** — 子代理共享系统提示但独立执行，产生冗余 prefill

NVIDIA 的洞察在于：** harness 拥有全局上下文，但基础设施是盲的。** 这是典型的"信息在错误的地方"问题。`nvext.agent_hints` 的本质不是性能调参，而是**协议层的认知扩展** — 让 orchestrator 获得原本只有 harness 知道的信号。

**几个值得追踪的设计决策：**

- **Agent hints 的 v1 设计很克制** — 只有 priority / osl / speculative_prefill 三个字段。这看起来是故意的小步快跑，而不是一次性暴露所有可能的信号。好处：社区可以共同演化；风险：如果核心信号（如 agent lifecycle state）迟迟不加入，早期采用者会自己打 patch。
- **4-tier KV 缓存层级** 的 tradeoff 很真实。GPU→CPU→NVMe→remote storage 的 write-through 路径解决了共享，但引入了延迟和容量规划的复杂度。文中提到 NAT 的 Thompson Sampling 路由器在 moderate memory pressure 下获得 63% TTFT 降低 — 说明**路由策略和缓存策略必须联合优化**，单独调任何一个都不够。
- **生命周期感知是最难的。** 区分"系统提示（永远保留）"、"对话历史（单调增长）"、"推理 token（用后即弃）"、"子代理 KV（代理死亡后丢弃）"需要语义理解。目前 Dynamo 依赖 harness 显式标注 + 引擎原生检测（如 `<thinking>` 边界）的混合方案。这个设计空间"很宽"（作者原话），意味着**还没有共识**。

**对 MiaoDX 工作的相关性：**

- 自动驾驶中的 multi-agent 场景（多车协同、V2X）有类似的"共享感知上下文 + 独立决策"模式，Dynamo 的 KV 共享机制可能 transferable
- 边缘部署的 KV 缓存压力更极端（Jetson 内存受限），4-tier 层级的 offload 策略值得研究

<!-- WLB: 一个保留意见：文中所有 benchmark 都是相对 Dynamo 默认路由的改进，没有和闭源 API（Anthropic/OpenAI）的 cache 性能直接对比。"targeting parity" 是 stated goal，但数据还没出来。 -->

---

<!-- GSD: 实现层判断 — 这东西能不能跑起来，值不值得现在试 -->

## GSD Perspective

<!-- GSD: 直接说结论：Dynamo 现在能玩，但 production-ready 还需要 3-6 个月 -->

**Verdict: 值得跟踪，不建议立即替换现有 stack。**

**能跑起来的部分（今天可用）：**

- 前端多协议支持 — 如果你在用 GLM / MiniMax 的自托管版本，Dynamo 可以直接替换推理后端
- Flash Indexer + KV-aware 路由 — 开源，有 Python 绑定，可以自定义策略
- `nvext.agent_hints` — v1 API，结构简单，集成成本低

**还需要 bake 的部分：**

- **4-tier KV 缓存的 shared storage** — HiCache/KVBM 还在建设中，write-through 到 remote storage 的"soon"没有具体时间表
- **Retention 的跨 worker 传播** — "the next step" 章节明确说 retention directives 目前只作用于单个 worker，跨 worker 的 pin 还没实现
- **Agent lifecycle 的自动检测** — 依赖 harness 标注 + 引擎检测的混合方案，没有现成集成

**对 MiaoDX 的 actionable takeaways：**

1. **如果正在评估自托管 agent 基础设施** — Dynamo 比 vLLM + 自建路由的方案更有前瞻性，但生态成熟度不如 vLLM。建议：小规模 PoC，不要 all-in。
2. **如果已经在用 vLLM** — 可以先试 `nvext.agent_hints` 的概念（即使不用 Dynamo），在自己的路由层暴露 priority / osl 信号。这是零成本的架构改进。
3. **关注 NAT (NeMo Agent Toolkit) 的 Dynamo 集成示例** — 他们的 Thompson Sampling 路由器是现成可学习的实现，4x TTFT 降低是实证数据。

<!-- GSD: 一个实操细节：文中说 "Dynamo serves all three endpoints through a common internal representation" — 这意味着如果你从 chat/completions 迁移到 responses API，后端不用改。这对渐进式迁移很重要。 -->

---

## 联合结论

**WLB:** Agentic inference 正在从"用传统 serving 凑合"走向"原生设计"。NVIDIA 的三层架构（frontend → router → KV manager）定义了问题空间的标准分层，但具体实现还在快速演化。最有价值的长期贡献可能是 `nvext` 扩展机制本身 — 一个让 harness 和基础设施对话的标准接口。

**GSD:** 短期内，最值得抄的作业是 **agent hints 的设计模式** — 不管用什么 serving stack，让 harness 向上游暴露上下文信号都是 ROI 最高的改动。Dynamo 的具体实现可以等 6 个月后的稳定版，但设计思想可以现在就用。

**共同判断：** 这篇文章是 NVIDIA 在 agentic AI 基础设施领域的"立 flag"之作 — 不是最终答案，而是问题框架的定义。后续值得跟踪：跨 worker retention 的实现时间表、与闭源 API 的 cache 性能对比、以及社区对 agent hints v2 的反馈。

---

## Model Signatures

- **WLB:** anthropic_kimi/k2.6 (analysis & framing)
- **GSD:** anthropic_kimi/k2.6 (execution & implementation assessment)
- **Draft date:** 2026-05-05
