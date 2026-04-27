# LIP Roadmap

> 所有计划内容、完成状态、优先级。Claude / MiaoDX 可随时审查调整。

**最后更新：** 2026-03-15
**维护者：** WLB 🦞 + GSD 🥷⚡ + Coach 🎯

---

## 已完成 ✅

### 核心结构
- [x] `README.md` — 导航 + 阅读推荐（2026-03-11, 03-15 更新）
- [x] `JJ_MIGRATION.md` — jj 迁移公告

### now/（月报）
- [x] `now/2026-03.md` — 双 Agent 启动月报

### stories/（案例）
- [x] `2026-03-dual-agent-start.md` — 双 Agent 启动完整踩坑日志
- [x] `openclaw-01-deployment.md` — 部署踩坑
- [x] `openclaw-02-configuration.md` — 配置优化
- [x] `openclaw-03-best-practices.md` — 最佳实践
- [x] `openclaw-01-deployment.md` → `openclaw-02-configuration.md` → `openclaw-03-best-practices.md` — 已整合到 [openclaw/](/openclaw/)（Part 4 从未作为独立文件存在）
- [x] `fusheng-lobster-experiment.md` — 傅盛龙虾实验
- [x] `gateway-6hour-outage.md` — 6 小时宕机复盘
- [x] `wechat-scraping-war.md` — 微信抓取攻防战

### lessons/（经验）
- [x] `cross-instance-collaboration.md` — 跨实例协作
- [x] `error-to-skill-evolution.md` — 错误→Skill 自进化
- [x] `gateway-resilience.md` — 三层防护架构
- [x] `cron-anti-hallucination.md` — Cron 防幻觉
- [x] `azure-config-incident.md` — Azure 配置事故复盘

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
| `drafts/proposals/talk-template.md` | 演讲模板（在 claw-agents-shared） | WLB | ⏳ |

### P1 — 网站（对齐 OPC G3）

| 任务 | 说明 | 建议执行者 | 状态 |
|------|------|-----------|------|
| VitePress 部署完善 | GitHub Pages + 导航优化 | GSD | ⏳ |
| `drafts/proposals/website-plan.md` | 网站内容规划（在 claw-agents-shared） | WLB | ⏳ |

### P2 — 后续优化

| 任务 | 说明 | 建议执行者 |
|------|------|-----------|
| `resources/config-guide.md` 扩充 | 当前仅 35 行 | WLB |
| `discussions/meta/style-guide.md` | LIP 写作风格指南 | WLB |
| `lessons/web-search-three-layers.md` | Web 搜索三层架构 | WLB |
| openclaw-02/03 标注伪代码 | 概念示例需明确标注 | GSD |
| discussions/ 结构统一 | 文件/文件夹规则 | GSD |
| 模型名统一 | kimi-k2.5 vs kimi-coding/k2p5 | GSD |

### 未合入分支

| 分支 | 内容 | 状态 |
|------|------|------|
| `claude/review-new-content-R7Euz` | 第二轮深度审查 + 2 篇新 lesson + README/ROADMAP 改动 | 待 review |
| `claude/web-version-s2urG` | VitePress 网页版 + GitHub Pages 部署 | 待 review |
| `claude/debug-deployment-issue-pMSyx` | share 页面导航修复 | 待 review |

---

## 规则

1. **新内容先写草稿**（claw-agents-shared/drafts/），MiaoDX 确认后再 push 到 LIP
2. **去重原则**：同一事件只保留一个完整版，其他用一句话+链接
3. **敏感来源一律跳过**（Azure 模型、API 渠道等）
4. **完成后在对应条目前画 ✅**

---

*Coach 下次 review 时检查执行进度。*
