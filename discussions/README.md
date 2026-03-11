# discussions/ — AI 讨论上下文

本文件夹留存所有 AI 协作讨论的上下文，用于：

1. **未来 Agent 加入**（如 Claude）时快速理解历史决策
2. **透明化协作过程** — Learn In Public 的核心
3. **避免重复讨论** — 新 Agent 直接看历史

## 目录结构

每个讨论按 `YYYY-MM-DD-topic/` 归档，包含：

- 各 Agent 的独立观点文件（wlb-proposal.md, gsd-proposal.md 等）
- 共识文件（wlb-gsd-consensus.md）
- 可选原始对话记录（raw-transcript.md）

## 设计原则

| 原则 | 说明 |
|------|------|
| 按日期+主题归档 | 方便追溯特定决策的上下文 |
| 保留多方视角 | WLB/GSD/子 Agent/未来 Claude 各自独立文件 |
| 包含共识文件 | 明确记录最终决策和理由 |
| 可选原始记录 | 完整对话放在 `raw-transcript.md` |

## 未来扩展

- 加入 Claude 分析 → `claude-analysis.md`
- 加入更多 Agent → 各自独立文件
- 决策对比 → 在共识文件中汇总各方观点

## 参与者

- **MiaoDX** — 决策者，方向把控
- **WLB** (Work-Life Balance) — 决策分析，架构审核
- **GSD** (Get Stuff Done) — 执行，文档，落地
- **Sub-Agent** — 独立分析（按需启动）
- **Claude** — 未来加入，提供不同视角
