# LIP Roadmap

> 所有计划内容、完成状态、优先级。Claude / MiaoDX 可随时审查调整。

**最后更新：** 2026-06-07
**维护者：** WLB 🦞 + GSD 🥷⚡ + Coach 🎯

---

## 已完成 ✅

### 核心结构
- [x] `README.md` — 导航 + 阅读推荐（2026-03-11, 03-15 更新）
- [x] jj 试用公告 — 已退役为历史上下文；当前仓库协作以 GitHub/GitHub Pages 流程为准

### now/（月报）
- [x] `now/2026-03.md` — 双 Agent 启动月报
- [x] `now/2026-04.md` — 4 月治理结构月报

### stories/（案例）
- [x] `2026-03-dual-agent-start.md` — 双 Agent 启动完整踩坑日志
- [x] OpenClaw 部署、配置、最佳实践主线 — 已整合到 [openclaw/](/openclaw/)、[部署指南](/resources/deployment-guide-v2) 和 [配置指南](/resources/config-guide)
- [x] `fusheng-lobster-experiment.md` — 傅盛龙虾实验
- [x] `gateway-6hour-outage.md` — 6 小时宕机复盘
- [x] `wechat-scraping-war.md` — 微信抓取攻防战

### lessons/（经验）
- [x] `error-to-skill-evolution.md` — 错误→Skill 自进化
- [x] `cron-anti-hallucination.md` — Cron 防幻觉
- [x] `azure-config-incident.md` — Azure 配置事故复盘

### drafts/（待优化）
- [x] `drafts/lessons/gateway-resilience.md` — 三层防护架构，待补深度分析后再发布
- [x] `drafts/lessons/cross-instance-collaboration.md` — 跨实例协作，待补复用价值后再发布
- [x] `drafts/ai-coding/gsd-rugpull-maintainer-dilemma/index.md` — AI Coding 初稿 v4，等待审稿、截图和发布判断

### discussions/（讨论）
- [x] `2026-03-11-lip-structure/` — LIP 规划讨论
- [x] `2026-03-07-gsd-launch.md` — GSD 诞生日
- [x] `2026-03-09-cron-audit.md` — Cron 审计
- [x] `2026-03-11-claude-review/` — Claude 审查建议
- [x] `2026-03-14-document-audit.md` — 文档审计报告
- [x] `meta/agent-registry.md` + `meta/decision-log.md`

### presentations/（演讲）
- [x] `low-cost-multi-agent-deployment.html` — Meetup 演讲（2026-03-15）
- [x] 龙虾游戏图片嵌入（3 张 lobster images）
- [x] `proposals/talk-template.md` — 可复用演讲模板，基于 2026-03-15 Meetup 复盘

### resources/（资源）
- [x] `resources/config-guide.md` — OpenClaw 配置入口、环境变量、模型、Slack、搜索、CDP、Cron 检查清单

### 网站与发布
- [x] VitePress + GitHub Pages 部署流程 — `.github/workflows/deploy.yml` 通过 `npm run build:all` 统一构建文档、standalone 页面、Marp、Slidev 和发布检查
- [x] 英文入口与语言切换 — `en/` 镜像入口、英文导航和侧边栏已接入

---

## 待完成 ⏳

### P1 — 内容质量（对齐 OPC G1 社区声望）

| 任务 | 说明 | 建议执行者 | 状态 |
|------|------|-----------|------|
| **去重 4 组重复内容** | 微信×4, Azure×4, Cron×2, 三层防护×2 → 一句话+链接 | GSD | ⏳ |
| `stories/identity-crisis.md` | GSD/WLB 身份混淆危机（好素材） | WLB | ⏳ |
| `lessons/model-selection-guide.md` | 模型选择决策树 | GSD | ⏳ |
| `gateway-6hour-outage.md` 充实 | 加叙事感、量化损失 | GSD | ⏳ |
| `now/2026-03.md` 更新 | P0 完成里程碑 + Meetup 记录 | WLB | ⏳ |

### P1 — 演讲变现（对齐 OPC G2）

| 任务 | 说明 | 建议执行者 | 状态 |
|------|------|-----------|------|
| Meetup 录音整理 | 转写 + 摘要 | GSD | ⏳ |
| Meetup 内容→社区帖子 | 拆分为社区可分享的片段 | GSD | ⏳ |

### P1 — 网站（对齐 OPC G3）

| 任务 | 说明 | 建议执行者 | 状态 |
|------|------|-----------|------|
| 网站内容规划沉淀 | 基于 `proposals/2026-q2-okr.md` 的 G3 目标拆成可执行页面计划 | WLB | ⏳ |

### P2 — 后续优化

| 任务 | 说明 | 建议执行者 |
|------|------|-----------|
| `discussions/meta/style-guide.md` | LIP 写作风格指南 | WLB |
| `lessons/web-search-three-layers.md` | Web 搜索三层架构 | WLB |
| discussions/ 结构统一 | 文件/文件夹规则 | GSD |
| 模型名统一 | kimi-k2.5 vs kimi-coding/k2p5 | GSD |

### 未合入分支

当前本地没有 `claude/*` 未合入分支。历史 Claude review 记录保留在
`discussions/2026-03-11-claude-review/`，不再作为待合入分支追踪。

---

## 规则

1. **新内容先写草稿**（本仓库 `drafts/` 或 `proposals/`），MiaoDX 确认后再发布到对应栏目
2. **去重原则**：同一事件只保留一个完整版，其他用一句话+链接
3. **敏感来源一律跳过**（Azure 模型、API 渠道等）
4. **完成后在对应条目前画 ✅**

---

*Coach 下次 review 时检查执行进度。*
