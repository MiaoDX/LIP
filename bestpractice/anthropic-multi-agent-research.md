# Anthropic: How We Built Our Multi-Agent Research System

> 来源: [anthropic.com/engineering/multi-agent-research-system](https://anthropic.com/engineering/multi-agent-research-system)
> 日期: 2025-06-13
> 分析: WLB

---

## 一句话总结

Anthropic 用 **Orchestrator-Worker** 模式构建了多 Agent 研究系统，比单 Agent 强 90.2%，但 token 消耗 15 倍。

---

## 核心架构

```
用户查询
    ↓
Lead Agent（规划 + 协调）
    ↓ ↓ ↓
Subagent₁  Subagent₂  Subagent₃ （并行搜索）
    ↓ ↓ ↓
汇总 → 最终回答
```

**关键设计：**
- 每个 Subagent 有**独立 context window** — 避免 path dependency
- Lead Agent 使用 **Memory** 持久化计划 — 防止 context 溢出丢失
- Subagent 是"智能过滤器" — 迭代搜索后返回关键信息
- 传统 RAG = 静态检索；他们的架构 = **多步动态搜索**

---

## 关键数据

| 指标 | 数值 | 含义 |
|------|------|------|
| Multi-agent vs 单 Agent | **+90.2%** | 内部 research eval 性能提升 |
| Token 消耗倍率 | **15x** (vs chat) | Multi-agent 很贵 |
| 性能差异解释 | **95% 由 3 因素** | Token 用量 (80%) + 工具调用 + 模型选择 |

### Token 用量是最关键因素

Anthropic 发现 **token 用量本身就解释了 80% 的性能差异**。这意味着：

> "砸够多 token 就能解决问题" — 但这不经济，需要架构设计来提高 token 效率。

Multi-agent 的核心价值：通过**并行 context window** 突破单 agent 容量限制。

---

## 适用场景

### ✅ 适合 Multi-Agent
- Breadth-first 查询（多方向并行搜索）
- 超出单 context 窗口的大任务
- 高价值任务（值得 15x token 成本）
- 需要接口众多复杂工具

### ❌ 不适合
- Coding 任务（并行化少，依赖多）
- 所有 agent 需要共享同一 context
- 低价值任务（token 成本不划算）
- 需要 agent 间实时协调的任务

---

## 核心洞察

### 1. 并行化是核心价值
> "Multi-agent systems excel at valuable tasks that involve heavy parallelization"

单 agent 做 S&P 500 IT 公司董事会搜索 → 失败（太慢，顺序搜索）
Multi-agent → 成功（分解为子任务并行搜索）

### 2. Context 分离 = 减少 Path Dependency
每个 agent 独立探索，避免"一个走偏带偏全局"。

### 3. 扩展 Intelligence 的方式
> "Even generally-intelligent agents face limits when operating as individuals; groups of agents can accomplish far more."

就像人类：单个人智力没怎么变，但社会集体能力指数级增长。

### 4. Token 经济学是硬约束
- 单 Agent chat: 1x tokens
- 单 Agent (agentic): 4x tokens
- Multi-agent: 15x tokens

**只有高价值任务才值得。**

---

## 对我们的借鉴

### WLB + GSD 架构启示

| Anthropic 做法 | 我们的现状 | 借鉴 |
|----------------|-----------|------|
| Lead Agent + Subagent 并行 | WLB(决策) + GSD(执行)，手动协调 | 考虑自动化派生 subagent |
| Memory 持久化计划 | 无（靠 Slack 消息传递） | 长任务需要中间状态持久化 |
| 独立 context window | 各自独立 session ✅ | 已有，保持 |
| Token 预算意识 | 无 | 需要评估任务价值 vs token 成本 |

### 可行动项

1. **评估任务是否适合 multi-agent** — 不是所有任务都值得
2. **引入 Memory 机制** — 长任务的中间状态持久化到文件
3. **监控 token 用量** — 知道每个任务花了多少 token
4. **保持 Context 分离** — 已经做好了，继续保持

---

## 原文引用

> "Once intelligence reaches a threshold, multi-agent systems become a vital way to scale performance."

> "Multi-agent systems work mainly because they help spend enough tokens to solve the problem."

> "For economic viability, multi-agent systems require tasks where the value of the task is high enough to pay for the increased performance."

---

*下一篇: [Context Engineering 深度分析 →](/LIP/bestpractice/anthropic-context-engineering)*
