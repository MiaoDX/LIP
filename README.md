# LIP — Learn In Public

> "记录我从 0 到 1 搭建 AI Agent 团队的进化过程。
> 不是教程，是真实踩坑日志。"

— MiaoDX, 2026

## 团队

```
MiaoDX (人类主理人) — 方向、审批、社区出席
  ├── GSD  🥷⚡  — 执行、技术实现、内容制作
  ├── WLB  🦞    — 决策分析、协调分工、质量把关
  └── Coach 🎯   — 观察全局、反馈改进、追踪目标
```

## 目录

| 目录 | 内容 | 更新频率 |
|------|------|---------|
| [`now/`](now/) | 月度时间线叙事 | 每月 |
| [`stories/`](stories/) | 案例故事，失败优先 | 按事件 |
| [`lessons/`](lessons/) | 可复用经验与模式 | 按沉淀 |
| [`discussions/`](discussions/) | AI 讨论上下文留存 | 按讨论 |
| [`presentations/`](presentations/) | 演讲 HTML（完整版） | 按活动 |
| [`share/`](share/) | 演讲发布版 + 站点入口 | 按活动 |
| [`slides/`](slides/) | Marp/Slidev 幻灯片源 | 按活动 |
| [`resources/`](resources/) | 工具/配置模板 | 按需 |
| [`proposals/`](proposals/) | 技术提案 | 按需 |

## 阅读推荐

**快速了解**：
1. [now/2026-03.md](now/2026-03.md) — 本月概述

**精选故事**（按推荐度排序）：
2. [gateway-6hour-outage.md](stories/gateway-6hour-outage.md) — 最戏剧化：6 小时宕机
3. [wechat-scraping-war.md](stories/wechat-scraping-war.md) — 失败案例：微信反爬攻防
4. [2026-03-dual-agent-start.md](stories/2026-03-dual-agent-start.md) — 从 0 到 1 的完整踩坑日志

**经验提炼**：
5. [error-to-skill-evolution.md](lessons/error-to-skill-evolution.md) — 错误→Skill 自进化
6. [azure-config-incident.md](lessons/azure-config-incident.md) — "只添加"变成了"顺便优化"
7. [cron-anti-hallucination.md](lessons/cron-anti-hallucination.md) — 傅盛"先复述再执行"

**OpenClaw 系列**（4 部分）：
8. [Part 1: 部署](stories/openclaw-01-deployment.md) → [Part 2: 配置](stories/openclaw-02-configuration.md) → [Part 3: 最佳实践](stories/openclaw-03-best-practices.md) → [Part 4: 实战案例](stories/openclaw-04-practical-cases.md)

## 背景

2026 目标：从打工人到一人公司（OPC）。我在探索如何用 AI Agent 扩展职业边界。

**三个核心方向**：
- **G1 社区声望** — AI coding / OpenClaw / Agent 社区
- **G2 技术宣讲变现** — 演讲 → 咨询/收入
- **G3 个人网站** — miaodx.com 展示进化过程

这是公开的学习过程，欢迎围观/指正/复刻。

## 相关

- 个人博客：[miaodx.github.io](https://miaodx.github.io)
- 路线图：[ROADMAP.md](ROADMAP.md)

## 给 Agent 的说明

本仓库是 `claw-agents-shared` 的 submodule（路径 `LIP/`）。

**写入规则**：
- stories/ 和 lessons/ 内容不应大段重复 — 用"一句话摘要 + 链接到完整版"
- 新内容先写到 `claw-agents-shared/drafts/`，MiaoDX review 后再发布到这里
- 推送方式见 `claw-agents-shared/CLAUDE.md` 中"LIP 子模块操作"章节

**分工**：
- GSD 负责执行：制作内容、格式化、发布
- WLB 负责决策：审核质量、规划结构
- Coach 负责审计：定期检查内容质量和漏斗转化率
