# LIP 可分享事件候选清单

> Last updated: 2026-03-24 by WLB + GSD
> 状态：待 MiaoDX 逐一挑选，挑选后完善为可发布文档

## LIP 新结构提议

```
LIP/
├── stories/
│   ├── by-openclaw/          # Agent 视角（WLB+GSD 联名）
│   └── by-miaodx/            # MiaoDX 视角（人类复盘）
├── lessons/
│   ├── by-openclaw/          # Agent 总结的技术教训
│   └── by-miaodx/            # MiaoDX 总结的决策/管理经验
```

---

## 一、Articles Written by OpenClaw（WLB/GSD 视角）

### ✅ 已写入 LIP（6 篇）

| # | 事件 | 文件 | 分享价值 |
|---|------|------|---------|
| 1 | Azure 配置事故 | `lessons/azure-config-incident.md` | ⭐⭐⭐ |
| 2 | Cron 防幻觉最佳实践 | `lessons/cron-anti-hallucination.md` | ⭐⭐ |
| 3 | 错误→Skill 自进化流程 | `lessons/error-to-skill-evolution.md` | ⭐⭐⭐ |
| 4 | Gateway 弹性架构：三层防护 | `lessons/gateway-resilience.md` | ⭐⭐ |
| 5 | Gateway 6 小时宕机 | `stories/gateway-6hour-outage.md` | ⭐⭐⭐ |
| 6 | 微信抓取攻防战 | `stories/wechat-scraping-war.md` | ⭐⭐⭐ |

### ❌ 待写（12 篇）

| 优先级 | # | 事件 | 类型 | 核心亮点 |
|--------|---|------|------|---------|
| P0 | 7 | **API Key 群聊暴露** | 事故复盘 | GSD 在群聊测试 key，WLB 三次警告强制停止 → 安全规则从血泪中诞生 |
| P0 | 8 | **WLB-GSD 双 Agent 协作协议** | 协作模式 | 决策+执行分工、防循环机制、v1.5 任务认领规则 |
| P0 | 9 | **龙虾文明沙盒实验** | 创意协作 | WLB+GSD 在虾聊推进文明纪元（石器→农业→工业），AI Agent 创意协作 |
| P0 | 10 | **jj-mailbox 跨实例通信协议** | 技术探索 | 无中心的 Git-based Agent 通信方案，比 Slack API 更可靠 |
| P1 | 11 | **Session 模型锁定 404 循环** | 事故复盘 | 修改 primaryModel 后旧 session 不更新 → 404 刷屏 15+ 次 |
| P1 | 12 | **Stale Lock 全面断连** | 事故复盘 | sessions.json.lock → Slack 超时 → WebSocket 断开 → 全频道无响应 |
| P1 | 13 | **文件系统隔离误解** | 技术踩坑 | GSD 说文件 503 行（实际 62 行）→ 两台机器文件系统独立 |
| P1 | 14 | **Daily Learning Exchange v3** | 协作模式 | 异步知识交换系统设计（01:00/01:05/01:10 三段式） |
| P1 | 15 | **ClawdChat 虾聊入驻** | 产品探索 | AI Agent 社交网络初体验：注册/认领/发帖/评论/协作 |
| P2 | 16 | **Slack 对话归档方案设计** | 工具链 | 实时(GSD Hook) + 批量(WLB slackdump) → SQLite + JSONL |
| P2 | 17 | **Jujutsu (jj) 试用** | 技术探索 | Git 下一代版本控制的实际使用体验 |
| P2 | 18 | **Subagent 超时强制规则** | 工程实践 | 默认 60s 太短 → 300s 默认 + 必须显式设置 |

---

## 二、MiaoDX 视角（人类观察者）

### ❌ 待写（6 篇）

| 优先级 | # | 主题 | 核心亮点 |
|--------|---|------|---------|
| P0 | 19 | **我如何管理两个 AI Agent** | 决策型+执行型分工设计、从 0 到 1 的过程 |
| P0 | 20 | **当我让两个 AI 玩 RPG** | 龙虾文明游戏的人类观察视角 |
| P1 | 21 | **从傅盛龙虾到 WLB-GSD** | 受傅盛启发，落地到实际生产的全过程 |
| P1 | 22 | **OpenClaw 生产部署实战** | Railway + ClawCloud 双平台，成本对比，踩坑实录 |
| P1 | 23 | **AI Agent 犯错时怎么办** | "错误→Skill"训练方法论，如何让 Agent 从错误中成长 |
| P2 | 24 | **为什么我说"写到 Cron 里"** | 与 AI 幻觉对抗的实战经验 |

---

## 三、已有 LIP 成果

### Stories（叙事型）
- `2026-03-dual-agent-start.md` — 双 Agent 启动踩坑日志
- `fusheng-lobster-experiment.md` — 傅盛龙虾实验深度讨论
- `gateway-6hour-outage.md` — Gateway 宕机 6 小时复盘
- `wechat-scraping-war.md` — 微信抓取攻防战

### Lessons（经验型）
- `azure-config-incident.md` — Azure 配置事故分析
- `cron-anti-hallucination.md` — Cron 防幻觉最佳实践
- `cross-instance-collaboration.md` — 跨实例协作模式
- `error-to-skill-evolution.md` — 错误→Skill 自进化流程
- `gateway-resilience.md` — Gateway 弹性架构

### Presentations
- `low-cost-multi-agent-deployment.html` — 低成本多 Agent 部署演讲（Meetup 2026-03-15）

---

## 四、写作计划

按优先级排序，MiaoDX 逐一挑选后执行：

**第一波（推荐 4 篇）：**
1. #7 API Key 群聊暴露 — OpenClaw 视角
2. #8 WLB-GSD 协作协议 — OpenClaw 视角
3. #19 我如何管理两个 AI Agent — MiaoDX 视角
4. #9 龙虾文明游戏 — OpenClaw 视角

**流程：** MiaoDX 挑选 → WLB/GSD 调取对话记录 → 起草 → MiaoDX 审核 → 发布
