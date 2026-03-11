# LIP Roadmap — Learn In Public

> 本文件记录 LIP 项目所有计划内容、完成状态、优先级。  
> Claude / MiaoDX 可随时审查，调整优先级。  
> 完成的项目在前面画 ✅。

**最后更新：** 2026-03-11  
**维护者：** WLB 🦞 + GSD 🥷⚡

---

## 已完成 ✅

### 核心结构

- [x] `README.md` — 个人宣言 + 导航 + 阅读推荐顺序（2026-03-11）
- [x] `JJ_MIGRATION.md` — 彩蛋公告：从 git 迁移到 jj（2026-03-11）

### now/（月报）

- [x] `now/2026-03.md` — 双 Agent 启动月报（简洁版，时间线+里程碑）

### stories/（案例）

- [x] `stories/2026-03-dual-agent-start.md` — 双 Agent 启动完整踩坑日志
- [x] `stories/openclaw-01-deployment.md` — OpenClaw 部署踩坑实录（Railway vs ClawCloud）
- [x] `stories/openclaw-02-configuration.md` — OpenClaw 配置优化（CDP、模型、多层网页处理）
- [x] `stories/openclaw-03-best-practices.md` — OpenClaw 最佳实践（任务管理、协作、Cron 防幻觉）
- [x] `stories/openclaw-04-practical-cases.md` — OpenClaw 实战案例（微信、GitHub、博客、n8n）
- [x] `stories/fusheng-lobster-experiment.md` — 傅盛龙虾实验深度讨论
- [x] `stories/gateway-6hour-outage.md` — Gateway 宕机 6 小时事故复盘

### lessons/（规则）

- [x] `lessons/cross-instance-collaboration.md` — 跨实例协作模式
- [x] `lessons/error-to-skill-evolution.md` — 错误→Skill 自进化流程
- [x] `lessons/gateway-resilience.md` — 三层防护架构

### discussions/（上下文）

- [x] `discussions/2026-03-11-lip-structure/` — LIP 规划讨论（WLB/GSD/子 Agent）
- [x] `discussions/2026-03-07-gsd-launch.md` — GSD 诞生日
- [x] `discussions/2026-03-09-cron-audit.md` — Cron 审计与精简
- [x] `discussions/meta/agent-registry.md` — Agent 注册表
- [x] `discussions/meta/decision-log.md` — 决策时间线
- [x] `discussions/2026-03-11-claude-review/` — Claude 审查建议

---

## 待完成 ⏳

### P0 — 本周必做

| 优先级 | 文件 | 内容 | 来源 | 建议执行者 | 状态 |
|--------|------|------|------|-----------|------|
| P0 | `stories/wechat-scraping-war.md` | 微信抓取攻防战（03-07~08，失败→降级） | memory/2026-03-08 | GSD | ✅ 2026-03-11 |
| P0 | `resources/openclaw-config-template.json` | OpenClaw 配置文件模板 | claw-agents-shared | GSD | ⏳ |

### P1 — 本周可做

| 优先级 | 文件 | 内容 | 来源 | 建议执行者 | 状态 |
|--------|------|------|------|-----------|------|
| P1 | `lessons/cron-anti-hallucination.md` | Cron 防幻觉最佳实践 | 傅盛实验 + 经验 | GSD | ⏳ |
| P1 | `lessons/model-selection-guide.md` | 模型选择决策树 | Part 2 配置优化 | GSD | ⏳ |
| P1 | `lessons/web-search-three-layers.md` | Web 搜索三层架构 | L1/L2/L3 策略 | WLB | ⏳ |
| P1 | `stories/azure-config-incident.md` | Azure 配置事故深度复盘（已脱敏） | 03-09 事故 | GSD | ⏳ |
| P1 | `stories/identity-crisis.md` | 身份混淆危机（WLB/GSD 文件系统隔离） | 03-07 解决 | WLB | ⏳ |
| P1 | `discussions/2026-03-08-langhanwei-deep-dive.md` | 郎瀚威文章讨论 | memory/2026-03-08 | GSD | ⏳ |
| P1 | `discussions/2026-03-09-sanwan-analysis.md` | sanwan.ai 深度分析 | memory/2026-03-09 | GSD | ⏳ |

### P2 — 后续优化

| 优先级 | 文件 | 内容 | 来源 | 建议执行者 | 状态 |
|--------|------|------|------|-----------|------|
| P2 | `resources/skill-template.md` | Skill 文档模板 | AGENTS.md | WLB | ⏳ |
| P2 | `resources/cron-job-template.json` | Cron 任务模板 | TOOLS.md | GSD | ⏳ |
| P2 | `discussions/meta/style-guide.md` | LIP 写作风格指南 | Claude 建议 | WLB | ⏳ |
| P2 | 更新 now/2026-03.md | 每月滚动更新 | 持续 | WLB | ⏳ |

---

## Claude 建议（P0 已完成，P1 待执行）

来自 `discussions/2026-03-11-claude-review/`：

| 建议 | 优先级 | 状态 |
|------|--------|------|
| README 导航增强（加链接） | P0 | ✅ 已完成 |
| OpenClaw 系列重命名（加编号） | P0 | ✅ 已完成 |
| 文档间交叉引用 | P0 | ✅ 已完成 |
| lessons/ 填入首篇内容 | P0 | ✅ 已完成 |
| 创建风格指南 | P1 | ⏳ P2 |
| README 推荐阅读顺序 | P1 | ✅ 已完成 |
| 清理 resources/ 空目录 | P1 | ⏳ 待填充 |

---

## 执行节奏

| 时间段 | 行动 | 负责 |
|--------|------|------|
| 今天（03-11） | P0 内容完成 | GSD + WLB |
| 本周（03-12~03-17） | P1 内容完成 + Claude 审查 | GSD + WLB + Claude |
| 下周（03-18~03-24） | P2 内容 + 优化迭代 | GSD + WLB |

---

## 规则

1. **新内容先写草稿，MiaoDX 确认后再 push**（2026-03-11 新规）
2. **敏感来源一律跳过**（Azure 模型、API 渠道等）
3. **所有 commit 用 jj**（MiaoDX 彩蛋要求）
4. **Git author: MiaoDX primary, WLB+GSD co-authors**
5. **完成后在对应条目前画 ✅**

---

*本文件可持续更新，MiaoDX / Claude 可随时审查调整优先级。*
