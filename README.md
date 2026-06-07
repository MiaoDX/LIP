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
| [`ai-coding/`](ai-coding/) | AI Coding 专题页、项目式演讲、research/scripts/assets | 按项目 |
| [`openclaw/`](openclaw/) | OpenClaw 主线入口，汇总部署、配置、案例 | 按专题 |
| [`bestpractice/`](bestpractice/) | TOP Lab / Agent 工程实践拆解 | 按研究 |
| [`stories/`](stories/) | 案例故事，失败优先 | 按事件 |
| [`lessons/`](lessons/) | 可复用经验与模式 | 按沉淀 |
| [`discussions/`](discussions/) | AI 讨论上下文留存 | 按讨论 |
| [`drafts/`](drafts/) | 待审稿、待补强、待发布判断的草稿队列 | 定期清理 |
| [`presentations/`](presentations/) | 演讲 HTML（完整版） | 按活动 |
| [`share/`](share/) | 演讲发布版 + 站点入口 | 按活动 |
| [`slides/`](slides/) | Marp/Slidev 幻灯片源 | 按活动 |
| [`resources/`](resources/) | 工具/配置模板 | 按需 |
| [`proposals/`](proposals/) | 技术提案 | 按需 |
| [`en/`](en/) | 英文站点镜像入口与已翻译内容 | 按需 |
| [`docs/agents/`](docs/agents/) | Agent runbooks，不作为公开内容发布 | 按工作流 |
| [`scripts/`](scripts/) | VitePress、Marp、发布规则、质量门禁脚本 | 按工具 |
| [`templates/`](templates/) | Standalone deck 起始模板 | 按模板 |
| [`public/`](public/) | VitePress passthrough 资源；`public/consult/` 是咨询页源 | 按需 |
| [`assets/`](assets/) | 共享运行时与 standalone deck 支撑资产 | 按需 |

## 阅读推荐

**快速了解**：
1. [now/2026-04.md](now/2026-04.md) — 2026 年 4 月治理结构月报

**精选故事**（按推荐度排序）：
2. [gateway-6hour-outage.md](stories/gateway-6hour-outage.md) — 最戏剧化：6 小时宕机
3. [wechat-scraping-war.md](stories/wechat-scraping-war.md) — 失败案例：微信反爬攻防
4. [2026-03-dual-agent-start.md](stories/2026-03-dual-agent-start.md) — 从 0 到 1 的完整踩坑日志

**经验提炼**：
5. [error-to-skill-evolution.md](lessons/error-to-skill-evolution.md) — 错误→Skill 自进化
6. [azure-config-incident.md](lessons/azure-config-incident.md) — "只添加"变成了"顺便优化"
7. [cron-anti-hallucination.md](lessons/cron-anti-hallucination.md) — 傅盛"先复述再执行"

**OpenClaw 系列**：
8. [OpenClaw 总览](/openclaw/) — 案例、演讲和资源入口
9. [部署指南](/resources/deployment-guide-v2) → [配置指南](/resources/config-guide) → [资源入口](/resources/) → [案例故事](/stories/)

## 背景

2026 目标：新 OPC — One Person + multi Claws。我在探索如何用 AI Agent 扩展职业边界。

**三个核心方向**：
- **G1 社区声望** — AI coding / OpenClaw / Agent 社区
- **G2 技术宣讲变现** — 演讲 → 咨询/收入
- **G3 个人网站** — miaodx.com 展示进化过程

这是公开的学习过程，欢迎围观/指正/复刻。

## 相关

- 个人博客：[miaodx.github.io](https://miaodx.github.io)
- 路线图：[ROADMAP.md](ROADMAP.md)

## 给 Agent 的说明

本仓库是独立的 LIP GitHub Pages / VitePress 内容仓库，远端为 `MiaoDX/LIP`。

**写入规则**：
- stories/ 和 lessons/ 内容不应大段重复 — 用"一句话摘要 + 链接到完整版"
- 过程草稿可以放在 `drafts/`，公开发布内容放入对应栏目后同步更新入口
- Agent 操作规则以 `AGENTS.md` 和 `docs/agents/` 为准，Claude-specific 例外见 `CLAUDE.md`
- Agent/process 文档不会发布到 GitHub Pages；`npm run quality:check` 会检查公开输出边界和关键本地链接

**share/ 目录规则**：

share/ 下有两种文件类型，用途不同：

| 类型 | 放哪里 | 渲染方式 | 适合 |
|------|--------|----------|------|
| `.md` | `share/` 根目录 | VitePress 自动渲染 | 教程、配置指南、博客文章 |
| `.html` | `presentations/` | GitHub Actions 复制到 `/share/` | 演讲稿、Slide、需要离线分享的内容 |
| `index.html` + 素材 | `ai-coding/<slug>/` | GitHub Actions 复制到同路径 | 带 research / scripts / screenshots 的专题演讲项目 |

- **写文章/教程** → `share/your-article.md`
- **做演讲/Slide** → `presentations/your-talk.html`（配套图片放同目录，部署后访问 `/LIP/share/your-talk.html`）
- **做 AI Coding 专题演讲项目** → `ai-coding/your-talk/index.html`（素材放 `images/`、`screenshots/` 或 `assets/`，部署后访问 `/LIP/ai-coding/your-talk/`）
- **不要提交 `public/share/` 或根目录 `consult/`** → `npm run publish:check` 会检查这些 source-of-truth 规则
- **咨询页** → `public/consult/*.html`（部署后访问 `/LIP/consult/...`）
- 新增正式发布 Markdown 文章时，同步更新对应入口和 `site-map.mjs`；草稿先进入 `drafts/index.md`，只有需要一读导航时才加入 sidebar
- 详见 `share/README.md`

**分工**：
- GSD 负责执行：制作内容、格式化、发布
- WLB 负责决策：审核质量、规划结构
- Coach 负责审计：定期检查内容质量和漏斗转化率
