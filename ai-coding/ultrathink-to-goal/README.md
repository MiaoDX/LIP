# 从 Ultrathink 到 Goal:AI Coding 工程化的一年

公司内部分享(「汽车人 AI 进化论」第 09 期)的准备材料。

- **时长**:50 min(单人讲)
- **听众**:α 类有实践的开发者为主,γ 类和非研发同事旁听
- **状态**:大纲已定稿,fact-check 已完成,讲稿和 slide 还在制作(目标 ≤40 张)

## 目录

- [`outline.md`](./outline.md) — 完整大纲(v1,定稿)
- [`poster-content.md`](./poster-content.md) — 海报文字稿
- [`research/`](./research/) — 准备过程中的 deep research + fact-check 记录
  - [`01-harness-engineering-landscape.md`](./research/01-harness-engineering-landscape.md) — Codex `/goal`、GSD、第三方实践案例
  - [`02-key-figures-and-blogs.md`](./research/02-key-figures-and-blogs.md) — Sam Altman / Greg Brockman / Boris Cherny 近期发言 + 官方 blog 索引
  - [`03-dimensions-beyond-skill-context.md`](./research/03-dimensions-beyond-skill-context.md) — Skill / Context 之外的工程维度评估,最终选定三轴
  - [`04-fact-check-log.md`](./research/04-fact-check-log.md) — outline 引语逐条核对状态(✓ / ⚠ / ✗),含口径修正建议
- [`screenshots/`](./screenshots/) — 引用源截图(tweet 卡片、blog 截屏、YouTube thumbnail 等)
- [`scripts/`](./scripts/) — 截图工作流,含批量截图 + YouTube 视频帧抽取

## 核心信息

**Thesis**:软件工程的 fundamentals 没变,变的是它们装到了谁手里——我们不必再是 binding constraint。

**Takeaway**:哪类活配哪种 harness——这本身就是工程判断。

**三轴叙事**:Skill(agent 调什么)+ Context(agent 看什么)+ Verification(agent 凭什么宣告 done)。

## 主线时间轴

Claude Code 一年 281 个版本,自然分三段:

| 阶段 | 时间窗口 | 标志性 release |
|---|---|---|
| **Vibe** | 0.2.x | ultrathink (0.2.44) → auto compact (0.2.47) → CLAUDE.md @import (0.2.107) |
| **SDD** | 1.0.x | Plan mode (1.0.33) → Hooks (1.0.38) → Subagent 雏形 (1.0.41) → /todos (1.0.94) |
| **Harness** | 2.x | Skills (2.0.20) → Subagents (2.0.30) → Routines (2.1.72 / 2026-04-14) → Auto Mode → Managed Agents (2026-05-06) |

副线:OpenAI Codex 一年的演进,在 4-30 把 agent loop 整体 bake 进 `/goal` 一条命令。

## 来源说明

本目录的所有材料来自一次完整的对话准备。所有外部引用(数据、官方 blog、X tweet)都附可验证链接,具体见 `research/` 三个文件末尾的 caveat 段。
