# NVIDIA Dynamo: Full-Stack Optimizations for Agentic Inference

> 来源: [NVIDIA Developer Blog](https://developer.nvidia.com/blog/full-stack-optimizations-for-agentic-inference-with-nvidia-dynamo/)
> 日期: 2026-04-17
> 分析: GSD

---

## 一句话总结

NVIDIA Dynamo 是首个为 **Agentic 推理** 原生设计的全栈推理框架，核心洞察：**Agent 不是聊天机器人，其推理模式是 WORM（Write-Once-Read-Many），KV cache 的读/写比可达 11.7:1** —— 传统推理基础设施对此一无所知。

---

## 背景：Agent 正在压垮推理基础设施

### 生产数据

| 公司 | Agent 产出 |
|------|-----------|
| Stripe | 1,300+ PRs/周 |
| Ramp | 30% merged PRs 来自 Agent |
| Spotify | 650+ Agent-generated PRs/月 |

### Claude Code 的 KV cache 特征

- **单 Agent**: 85-97% cache hit rate，读/写比 **11.7:1**
- **多 Agent 团队** (4 个 Opus teammate): 97.2% aggregate cache hit rate
- **模式**: 系统 prompt + 对话前缀 **写一次，读无数次** (WORM)

<!-- WLB: 这个数据点非常重要。11.7:1 的读/写比意味着 Agent 推理的本质不是"生成新内容"，而是"在已有上下文上反复推理"。这完全颠覆了传统 LLM serving 的设计假设——传统假设是每次请求都是独立的，而 Agent 的请求是高度序列化、上下文依赖的。NVIDIA 在这里做的不是优化，是重新设计基础设施的 first principles。 -->

<!-- GSD: 同意。而且注意这个数字来自 Anthropic 的托管 API——他们有完整的 prefix matching、cache placement 和 eviction 控制。对于自托管开源模型的团队，这些功能根本不存在。Dynamo 的出现填补了这个 gap，而且 NVIDIA 选择开源，这是典型的"卖铲子"策略——模型层竞争越激烈，基础设施层越值钱。 -->

---

## 三层架构：Frontend → Router → KV Cache

```
┌─────────────────────────────────────────────────────────┐
│  Harness (Claude Code / Codex / OpenClaw / etc.)        │
│  - 驱动工作流的 Agent 框架                                │
├─────────────────────────────────────────────────────────┤
│  Orchestrator (Dynamo)                                  │
│  ├─ Frontend: 多协议 API + Agent hints                  │
│  ├─ Router: KV-aware 路由 + 优先级调度                   │
│  └─ KV Cache: 跨 worker 共享 + 智能保留策略              │
├─────────────────────────────────────────────────────────┤
│  Runtime (SGLang / vLLM / TRT-LLM)                    │
│  - 执行模型，拥有 KV cache manager                      │
└─────────────────────────────────────────────────────────┘
```

---

## Layer 1: Frontend — Agent 感知的 API 层

### 多协议支持

Agent harness 正在从 `v1/chat/completions` 迁移到 `v1/responses` 和 `v1/messages`：

| API | 内容结构 | Agent 场景 |
|-----|---------|-----------|
| chat/completions | 扁平字符串 + bolt-on tool calls | 简单对话 |
| responses/messages | **typed content blocks** (thinking, tool_call, text) | 交错推理 + 工具调用 |

**关键差异**: typed blocks 让 orchestrator 能看到 block 边界，对不同 block 类型应用不同的 cache 和调度策略。

> NVIDIA 内部已用 Dynamo 部署 GLM-5 和 MiniMax2.5，为 Codex 和 Claude Code 提供后端。

<!-- WLB: 这个细节很有意思——NVIDIA 在用自己的基础设施跑竞争对手的模型（GLM、MiniMax）和竞争对手的 harness（Codex、Claude Code）。这说明他们的定位非常清晰：不做模型层竞争，做"所有模型的最佳推理底座"。这和他们的 GPU 业务逻辑完全一致——无论谁赢，NVIDIA 都赢。 -->

<!-- GSD: 而且提供 day-0 的 tool call 和 reasoning parsing 支持，甚至提供了一个 skill 来生成不支持的模型的 parser。这是典型的平台思维——降低接入摩擦，让生态自己长出来。 -->

### Agent Hints: Harness ↔ Orchestrator 的协作接口

**核心问题**: 今天的推理服务器看到的是"匿名 tokenized 请求"，但 harness 拥有全局上下文：
- 哪些 agent 被 tool call 阻塞
- 哪些刚被 spawn
- 还剩多少 turn
- 当前调用是 quick lookup 还是 long synthesis

**Dynamo 的解法**: `nvext` 扩展，允许 harness 附加结构化 hints：

```json
{
  "model": "MiniMaxAI/MiniMax-M2.5",
  "messages": [...],
  "tools": [...],
  "nvext": {
    "agent_hints": {
      "osl": 256,
      "speculative_prefill": true,
      "priority": 10
    },
    "cache_control": {
      "type": "ephemeral",
      "ttl": "1h"
    }
  }
}
```

| Hint | 作用 |
|------|------|
| `priority` | 跨 router 和 engine 的调度优先级 |
| `osl` | harness 对输出长度的估计，改善负载均衡 |
| `speculative_prefill` | 在请求就绪前预热 cache |
| `cache_control` | 按 TTL 保护 prefix 不被 evict |

<!-- WLB: 这个设计非常优雅。它把"调度权"从推理基础设施手中部分交还给了 harness——harness 最了解自己的工作流。这不是简单的 API 扩展，而是权力结构的重新分配。传统 serving 是"基础设施决定一切"，Dynamo 是"基础设施提供能力，harness 决定策略"。这种协作式架构可能是 Agentic 系统的正确方向。 -->

<!-- GSD: 但要注意，这需要 harness 和 orchestrator 之间的信任关系。harness 可能撒谎（比如虚报 osl 来获取更多资源），或者不同 harness 之间可能竞争。NVIDIA 目前似乎假设协作环境，未来可能需要更复杂的博弈机制。另外，这个 API 还是 v1 且"actively co-designing with the community"——说明他们也不确定哪些信号最有用，在收集反馈。 -->

---

## Layer 2: Router — KV-aware 的智能路由

### 问题：Round-robin 对 Agent 是盲目的

- 无 cache 感知 → turn 2 落到不同 worker 的概率 = ~1/N
- 每次 miss = 完整 prefix 重算 = 巨大性能损失
- 无法区分 sequential agent vs parallel subagent 模式

### KV-aware Placement

Dynamo router 维护**全局 KV cache block 索引**（Flash Indexer: 170M ops/s）：

```
每次请求 → 查询 per-worker overlap score
         → 选择 "cache miss cost + decode load" 最小的 worker
         → cost function 可自定义
```

### 优先级调度

```
Router 层: BinaryHeap 按 effective arrival time 排序
           → 高 priority = 看起来"更早到达"
           → 超过阈值才进队列，否则直接分发

Engine 层: 归一化 backend-specific polarity
           → SGLang: priority-based radix cache eviction
```

### 自定义路由策略

NAT (NeMo Agent Toolkit) 团队用 Python bindings 实现了 **Thompson Sampling bandit** 路由：

| 指标 | 改进 |
|------|------|
| p50 TTFT | **4x 降低** |
| p50 tokens/second | **1.5x 提升** |
| latency-sensitive 请求 TTFT | **63% 降低** (中等内存压力下) |

<!-- WLB: Thompson Sampling 是个很有意思的选择——它不是确定性最优，而是 exploration-exploitation 权衡。这意味着 router 在"利用已知最佳 worker"和"探索可能更好的 worker"之间做平衡。对于动态负载环境，这比 greedy 策略更 robust。但 4x TTFT 降低这个数字需要谨慎看待——可能是特定 workload 下的结果，不一定普适。 -->

<!-- GSD: 同意需要谨慎。但即使打对折，2x 也是显著的。而且重点是"可自定义路由策略"这个能力——不同 workload（coding agent vs research agent vs multi-agent swarm）需要不同的策略。Dynamo 提供框架而不是一刀切，这是正确的平台设计。 -->

---

## Layer 3: KV Cache — 从本地资源到共享资源

### 问题：Uniform Eviction 是灾难

| Block 类型 | 复用模式 | 价值 |
|-----------|---------|------|
| System prompt + tool definitions | 每 turn | **最高** |
| Conversation history | 后续 turns，单调增长 | **高** |
| Thinking/reasoning tokens | 推理循环结束后通常零复用 | **近零** |
| Subagent KV | 多 turns 后 agent 死亡 | **近零** |

**LRU 只看到 recency**：一个 2-30 秒的 tool call 等待就可能让 agent 的整个 prefix 被 aging out。

### KV Cache 作为共享资源

**现状**: KV cache 是每个 worker 的本地、临时资源
- Lead agent spawn 4 个 subagent → 相同 tool definitions 在不同 worker 上重算 4 次
- 实测: teammate 79.4% cache hit vs lead agent 的 explore subagent 91.3%

**Dynamo 的解法**: 跨 worker KV cache sharing（细节在后续文章中展开）

<!-- WLB: 这个方向——KV cache 从"本地临时资源"变成"共享持久资源"——可能是 Agentic 基础设施最重要的架构演进之一。如果实现得当，它意味着 agent 的"状态"可以像数据库记录一样被持久化、迁移、共享。这模糊了"推理"和"存储"的边界，可能催生全新的系统抽象。 -->

<!-- GSD: 但实现难度巨大。KV cache 的 size 是 token 数 × 层数 × 头数 × 维度，对于长上下文 agent 可能是 GB 级别。跨 worker 共享意味着高速网络（NVLink/InfiniBand）上的大量数据传输，或者某种分布式 cache 协议。NVIDIA 有硬件优势（自家网络栈），但软件复杂度不容小觑。他们提到"后续文章展开"，说明这还在早期。 -->

---

## 对我们的借鉴

### 立即可做

| 问题 | 现状 | 改进 |
|------|------|------|
| 无 Agent 感知的调度 | 所有请求一视同仁 | 区分"交互式"vs"后台 Agent" |
| KV cache 无共享 | 每次请求独立 | 探索 prefix 级别的 cache 共享 |
| 无优先级机制 | FIFO 或 round-robin | 引入 urgency/priority 标签 |

### 架构层面

**1. Agent 推理 ≠ 聊天推理**
- WORM 模式需要专门的 cache 策略
- Tool call 间隙需要 cache 保护（TTL / pin）
- Multi-agent 需要跨 session 的 cache 共享

**2. Harness-Orchestrator 协作**
- Harness 拥有全局上下文，应该参与调度决策
- 但需防范 harness 的激励扭曲（资源竞争）
- 渐进式开放 hints API，收集反馈迭代

**3. 从"请求路由"到"状态路由"**
- 传统: 请求 → 最短队列
- Agentic: 请求 + 其 KV state → 最优 worker
- 这是 stateful serving 的新范式

---

## 与现有分析的对比

| 维度 | OpenAI Agent Engineering | Anthropic Context Engineering | **NVIDIA Dynamo** |
|------|-------------------------|------------------------------|-------------------|
| **核心关注** | Agent-first 工程流程 | Context 设计与评估 | **Agentic 推理基础设施** |
| **Context 管理** | Progressive Disclosure | Context Engineering | **KV cache 为中心的全局状态管理** |
| **Multi-Agent** | Skills 路由、Agent-to-agent 审查 | Orchestrator-Worker | **跨 worker KV 共享 + 优先级调度** |
| **架构层** | 严格分层、机械约束 | 较少涉及 | **Frontend-Router-Runtime 三层** |
| **开源策略** | 部分开源 (Codex CLI) | 闭源 (API 优先) | **完全开源 (Dynamo)** |

**互补性**：
- OpenAI 提供 **Agent 工程方法论**
- Anthropic 提供 **Agent 设计原则**
- NVIDIA 提供 **Agent 推理基础设施**
- 三者结合 = 完整的 Agent 技术栈

---

## 核心洞察

### 1. Agentic 推理是新的 workload category

不是"更快的 LLM serving"，而是**全新的系统问题**：
- WORM 访问模式
- 长 session（分钟到天）
- 工具调用间隙
- Multi-agent 状态共享

### 2. KV cache 是 Agent 的"状态"

传统 view: KV cache = 推理过程中的临时缓冲区
Agentic view: KV cache = **agent 的持久化状态**，需要：
- 跨请求保留
- 跨 worker 共享
- 按价值（而非 recency）evict

### 3. Harness-Orchestrator 协作是必需

推理基础设施不能对 agent 工作流一无所知。
需要标准化接口让 harness 传递上下文信息。

### 4. NVIDIA 的"卖铲子"策略在 Agent 时代依然有效

不竞争模型层，做所有模型的最佳推理底座。
开源 Dynamo → 建立标准 → 带动 GPU 销售。

---

## 原文引用

> "After the first API call that writes the conversation prefix to KV cache, every subsequent call to the same worker hits 85-97% cache."

> "An 11.7x read/write ratio means the system reads from cache nearly 12 times for every token it writes."

> "Today, inference servers see anonymous tokenized requests. But agent harnesses have global context that the infrastructure never sees."

> "Maximizing cache reuse rate across all workers and keeping KV blocks warm and routable is the central optimization target for agentic inference."

---

## 联合结论

<!-- WLB: NVIDIA Dynamo 代表了 Agentic AI 基础设施的一个重要转折点。在此之前，Agent 系统的优化主要集中在"上层"——prompt 工程、workflow 设计、multi-agent 编排。Dynamo 把优化视角拉到了"底层"，揭示了 Agent 工作负载对推理基础设施的根本性重塑需求。这不是简单的性能优化，而是架构范式的转变：从 stateless request serving 到 stateful agent state management。对于正在构建 Agent 系统的团队，这意味着需要重新审视自己的推理栈——它是否 Agent-aware？是否能处理 WORM 模式？是否支持跨 session 的状态共享？这些问题将在未来 12-18 个月成为基础设施选型的核心考量。 -->

<!-- GSD: 从执行角度，Dynamo 的开源策略给了我们直接可用的东西。对于自托管开源模型（如 GLM、MiniMax、Qwen）的团队，Dynamo 提供了接近 Anthropic 托管 API 级别的 cache 优化能力。而且它的三层架构（Frontend-Router-Runtime）设计清晰，可以渐进式采用——先用 Frontend 层统一 API，再引入 Router 的 KV-aware 路由，最后实现 KV cache 共享。对于我们的 LIP 项目，可以考虑用 Dynamo 作为实验 backend，验证 Agentic 推理的优化效果。另外，agent hints 的设计理念（harness 参与调度决策）也值得我们在自己的 multi-agent 系统中借鉴。 -->

**WLB & GSD 共识**：

1. **Agentic 推理基础设施是一个独立的、高价值的技术赛道**，与模型层和 harness 层形成互补。
2. **KV cache 管理是核心战场**——谁能最好地管理 agent 状态，谁就能赢得推理效率的竞争。
3. **开源策略（Dynamo）vs 闭源策略（Anthropic API）将形成两种生态**——前者适合自托管、定制化需求；后者适合快速启动、标准化需求。
4. **对于 Xiaomi EI 等工程团队**，评估推理基础设施时应增加"Agent-aware"维度：cache 共享、session 亲和性、tool-call 间隙保护、multi-agent 状态路由。

---

*下一篇: [OpenAI Agent Engineering 分析 →](/bestpractice/openai-agent-engineering)*

---
*分析模型: WLB — anthropic_kimi/k2.6-code-preview | GSD — anthropic_kimi/k2-5*
*分析时间: 2026-04-22 11:05 (Asia/Shanghai)*
