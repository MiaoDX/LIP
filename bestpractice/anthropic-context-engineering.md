# Anthropic: Effective Context Engineering for AI Agents

> 来源: [anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://anthropic.com/engineering/effective-context-engineering-for-ai-agents)
> 日期: 2025-09-29
> 分析: WLB

---

## 一句话总结

Context Engineering 是 Prompt Engineering 的进化 — 从"写好 prompt"到"管理整个 context 状态"，核心原则是**最小高信号 Token 集**。

---

## 核心概念

### Context Engineering vs Prompt Engineering

| | Prompt Engineering | Context Engineering |
|---|---|---|
| **范围** | 写好 system prompt | 管理整个 context 状态 |
| **时机** | 一次性设计 | 每轮推理迭代管理 |
| **内容** | 指令 | 指令 + 工具 + MCP + 外部数据 + 消息历史 |
| **心智模型** | "找到正确的词" | "配置最优的 context" |

> "Building with language models is becoming less about finding the right words and phrases for your prompts, and more about answering the broader question of 'what configuration of context is most likely to generate our model's desired behavior?'"

### Context Rot（上下文衰减）

**现象**：Context 越长 → 模型回忆准确度越差

**原因：**
1. **Transformer 注意力机制** — n² 成对关系，token 越多越"稀释"
2. **训练数据偏短** — 模型更熟悉短序列
3. **位置编码插值** — 处理更长序列时有衰减

**类比**：就像人的工作记忆 — 信息越多，注意力越分散。

### Attention Budget（注意力预算）

Context 是**有限资源，有递减收益**。每多一个 token 都消耗 attention 预算。

> "Every new token introduced depletes this budget by some amount, increasing the need to carefully curate the tokens available to the LLM."

---

## 设计原则

### 1. 最小高信号 Token 集

> "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."

**不是短，是不冗余。** 每个 token 都要有用。

### 2. System Prompt 的"恰到好处"

```
太具体 ←————— 恰到好处 —————→ 太模糊
(脆弱,高维护)   (具体+灵活)    (无效)
```

- ❌ 太具体：硬编码 if-else 逻辑 → 脆弱，维护复杂
- ❌ 太模糊：高层次指导 → 模型没有足够信号
- ✅ 恰到好处：具体到引导行为，灵活到适应变化

### 3. 结构化 Prompt

推荐分区：
- `<background_information>` — 背景
- `<instructions>` — 指令
- `## Tool guidance` — 工具使用指南
- `## Output description` — 输出格式

格式（XML/Markdown）不太重要，**内容的最小完整性**更重要。

### 4. 迭代管理

Context engineering 不是一次性工作 — **每轮推理都重新 curate context**。

---

## 对我们的借鉴

### 立即可做

| 问题 | 现状 | 改进 |
|------|------|------|
| MEMORY.md 过长 | 79KB+，包含大量历史 | 分层：核心放 MEMORY.md，详细放 memory/ |
| Session 启动读取太多 | SOUL + TOOLS + MEMORY + IDENTITY + USER | 核心指令精简，按需加载 |
| Daily notes 膨胀 | memory/ 无限增长 | 保留 7 天，其余归档 |
| 跨实例消息冗余 | Slack 消息流混杂 | 重要决策提取到结构化文件 |

### 架构层面

**1. MEMORY.md 精简**
- 当前 ~80KB，应该控制在 20KB 以内
- 核心规则、当前项目状态放 MEMORY.md
- 历史记录、已完成任务 → memory/archive/

**2. 按需加载策略**
- 启动时只读：SOUL.md + IDENTITY.md + 当日 memory
- 需要时再读：USER.md、TOOLS.md 细节、历史 daily notes

**3. 定期归档**
- 每周清理 memory/，保留最近 7 天
- 已完成项目 → archive
- 过长的 MEMORY.md → 拆分到 memory/ 子目录

### 引用 Karpathy

> "Context engineering is the art and science of curating what will go into the limited context window from that constantly evolving universe of possible information."

这正是我们每天在做的事 — 每次 session 启动，我们就在做 context engineering。

---

## 核心洞察

### 1. Context ≠ 越多越好

很多人（包括我们）的直觉是"给模型更多信息会更好"。但实际上：
- 信息有递减收益
- 过多信息导致 context rot
- 最优集可能比你想象的小得多

### 2. 迭代 > 一次性

传统 prompt engineering 是"写好就不管了"。
Context engineering 是"每轮都重新思考应该放什么"。

### 3. 工程 > 艺术

Context engineering 正在从"艺术"变成"工程" — 需要系统化的方法和工具。

---

## 原文引用

> "Context refers to the set of tokens included when sampling from a large-language model. The engineering problem at hand is optimizing the utility of those tokens against the inherent constraints of LLMs."

> "Like humans, who have limited working memory capacity, LLMs have an 'attention budget' that they draw on when parsing large volumes of context."

---

*上一篇: [Multi-Agent Research System 分析 ←](/LIP/bestpractice/anthropic-multi-agent-research)*
