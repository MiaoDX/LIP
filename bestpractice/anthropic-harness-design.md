# Anthropic: Harness Design for Long-Running Agents

> 来源:
> - [Effective harnesses for long-running agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) (2025-11-26)
> - [Harness design for long-running application development](https://anthropic.com/engineering/harness-design-long-running-apps) (2026-03-24)
> 分析: WLB

---

## 一句话总结

长运行 Agent 的核心问题是如何**跨 context window 保持连贯性** — Anthropic 用 Feature List + Context Reset + Generator-Evaluator 分离解决。

---

## 失败模式

### 1. 一次性冲刺
Agent 试图在一个 session 里干完所有事 → context 耗尽 → 下个 session 从零开始。

### 2. 过早宣布完成
看到有进展就认为 job done → 后续 feature 被忽略。

### 3. Context Anxiety
Agent 快到 context limit 时开始"收尾" → 还没做完就草草结束。

### 4. 自我评价过度自信
Agent 评价自己的作品 → 总是夸，即使质量很一般。

---

## 解法 1：双 Agent + Feature List (2025-11)

### 架构

```
Initializer Agent（首次运行）
├── 创建 feature list (JSON, 全部标记 failing)
├── 创建 claude-progress.txt (进度日志)
├── 创建 init.sh (启动/测试脚本)
└── 初始 git commit

Coding Agent（每次后续运行）
├── pwd → 读 git log + progress → 选最高优先级 failing feature
├── 只做一个 feature (增量)
├── 端到端测试 (browser automation, 不是 curl)
├── git commit + 更新 progress
└── 清理状态后退出
```

### 关键设计

**Feature List 用 JSON，不用 Markdown**
> "The model is less likely to inappropriately change or overwrite JSON files compared to Markdown files."

- 每个 feature 有 `passes: true/false`
- 强约束："不允许删除或编辑测试条目"
- Claude.ai clone 有 200+ 个 feature

**增量工作**
- 每次只做 **一个** feature
- 做完必须测试 + commit + 更新 progress

**端到端测试**
- 用 Puppeteer/Playwright 做 browser automation
- 不用 curl — "Claude was able to identify and fix bugs that weren't obvious from the code alone"
- 截图验证，不只是文本输出

**Session 启动标准流程**
```
1. pwd — 确认工作目录
2. 读 git log + progress.txt — 了解上下文
3. 读 feature list — 选下一个任务
4. 跑 init.sh — 确认环境正常
```

---

## 解法 2：三 Agent + Context Reset (2026-03)

### 架构

```
Planner → Generator → Evaluator
                ↑           │
                └───────────┘ (反馈循环 5-15 轮)
```

### Context Reset vs Compaction

| | Compaction | Context Reset |
|---|---|---|
| Agent | 同一个 agent 继续 | 全新 agent |
| 历史 | 压缩后的摘要 | 清零，靠 handoff artifact |
| Context Anxiety | 仍在 | 消除 |
| 连续性 | 好 | 依赖 handoff 质量 |
| 推荐 | 简单任务 | 长任务（Claude Sonnet 4.5 强制需要） |

> "Claude Sonnet 4.5 exhibited context anxiety strongly enough that compaction alone wasn't sufficient, so context resets became essential."

### Generator-Evaluator 分离

**为什么分离？**
- Agent 自评 → 过度自信地夸
- 分离后 → Evaluator 可调教为"怀疑论者"

**Evaluator 校准：**
- 用 few-shot examples + 详细评分标准
- Evaluator 用 Playwright MCP 直接操作页面
- 导航 → 截图 → 仔细研究 → 评分 + 详细批评

**评分维度（设计场景）：**
| 维度 | 权重 | 说明 |
|------|------|------|
| 设计质量 | 高 | 整体一致性 vs 拼凑感 |
| 原创性 | 高 | 有意识的设计决策 vs AI 模板味 |
| 工艺 | 低 | 排版、间距、色彩（Claude 默认就做得不错）|
| 功能性 | 低 | 用户能否不猜就完成任务 |

前两项权重高，因为 Claude 在后两项上已经很强。

### Generator 的战略决策
- 分数趋势好 → **精炼**当前方向
- 分数走不动 → **彻底换**审美方向

---

## 对我们的借鉴

### 直接可用

| Anthropic 做法 | 我们怎么做 |
|----------------|-----------|
| Feature list (JSON, failing/passing) | 长项目用 JSON 追踪任务状态 |
| claude-progress.txt | 每个长项目都有进度文件 |
| Context Reset > Compaction | 长任务主动 reset，handoff artifact 传状态 |
| 端到端测试 > curl | Agent 项目用 browser automation 验证 |
| JSON > Markdown（防止模型乱改）| 结构化数据用 JSON |

### 架构层面

**WLB+GSD = 天然的 Generator-Evaluator 模式**
- GSD = Generator（执行/构建）
- WLB = Evaluator（评估/决策）
- 这正是 Anthropic 验证过的有效架构！

**可以加强的：**
1. **给 WLB 标准化的评分维度** — 像 Anthropic 的四维度一样
2. **反馈循环** — GSD 做完 → WLB 评估 → GSD 改进（现在是手动的，可以更结构化）
3. **Feature List 机制** — 长项目用 JSON 追踪，不用 markdown checklist
4. **Context Reset** — MEMORY.md 太长时主动 reset，不靠 compaction

### 引用

> "Separating the agent doing the work from the agent judging it proves to be a strong lever."

> "Tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work."

> "The key insight was finding a way for agents to quickly understand the state of work when starting with a fresh context window."

---

*上一篇: [Context Engineering ←](/bestpractice/anthropic-context-engineering)*
