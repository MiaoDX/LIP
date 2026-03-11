# LIP 文档组织改进建议

> 来自 Claude (Opus 4.6) 的第三方视角审查。
> 目标：提升读者体验和内容可发现性，同时遵循"速度 > 完美"原则。

---

## 改进总览

| 优先级 | 改进项 | 影响 | 工作量 | 建议执行者 |
|--------|--------|------|--------|------------|
| **P0** | README 导航增强 | 🔴 高 | 15min | GSD |
| **P0** | OpenClaw 系列文件重命名 | 🔴 高 | 10min | GSD |
| **P0** | 文档间交叉引用 | 🟡 中高 | 20min | GSD |
| **P0** | lessons/ 填入首篇内容 | 🟡 中高 | 15min | GSD |
| **P1** | 创建风格指南 | 🟡 中 | 20min | WLB |
| **P1** | README 推荐阅读顺序 | 🟡 中 | 10min | WLB |
| **P1** | 清理 resources/ 空目录 | 🟢 低 | 5min | GSD |
| **P2** | stories/ 索引（10+ 篇后） | 🟢 低 | — | 未来 |
| **P2** | 英文摘要 | 🟢 低 | — | 未来 |

---

## P0 — 本周必做

> 建议执行顺序：P0-2 → P0-1 → P0-3 → P0-4（先重命名文件，再建链接）

### P0-1：README 导航增强

**问题：** 当前 README 的"最新进展"和"目录"都不链接到具体文件。读者看到标题列表，却无法一键跳转到内容。对于一个公开展示的仓库来说，这是最大的体验瓶颈。

**修改文件：** `README.md`

**具体操作：**

1. "最新进展"部分，每条加上实际链接：

```markdown
## 最新进展

- [双 Agent 协作系统上线（WLB + GSD）](stories/2026-03-dual-agent-start.md) — 从 0 到 1 的完整踩坑日志
- [6小时离线事故 → 三层防护架构](stories/2026-03-dual-agent-start.md#6小时离线事故-) — stale lock 引发全面停摆
- [Azure 配置踩坑记](stories/2026-03-dual-agent-start.md#azure-配置事故-) — "只添加"变成了"顺便优化"
```

2. "目录"部分，每个目录后加最新/代表性文件链接：

```markdown
## 目录

- [`now/`](now/) — 时间线叙事，每月一篇 → [2026 年 3 月](now/2026-03.md)
- [`lessons/`](lessons/) — 可复用协作模式
- [`stories/`](stories/) — 精选案例，失败优先 → [双 Agent 启动日志](stories/2026-03-dual-agent-start.md)
- [`discussions/`](discussions/) — AI 讨论上下文留存
- [`resources/`](resources/) — 工具/配置模板
```

---

### P0-2：OpenClaw 系列文件重命名

**问题：** `stories/` 下有 4 个 `openclaw-*` 文件，它们是同一篇博客（`openclaw-complete-guide.md`）的 Part 1-4。但从文件名完全看不出这个关系和阅读顺序。

**修改文件：** `stories/openclaw-*.md`

**具体操作：** 重命名文件，添加编号前缀：

```
stories/openclaw-deployment-railway-vs-clawcloud.md → stories/openclaw-01-deployment.md
stories/openclaw-configuration-optimization.md      → stories/openclaw-02-configuration.md
stories/openclaw-best-practices.md                  → stories/openclaw-03-best-practices.md
stories/openclaw-practical-cases.md                 → stories/openclaw-04-practical-cases.md
```

**为什么不用索引文件？** 只有 4 个文件，编号前缀就足够了，不需要额外维护一个索引。符合"避免归档陷阱"原则。

**注意：** 重命名后需要更新所有引用这些文件的地方（如果有的话）。

---

### P0-3：文档间交叉引用

**问题：** 目前仓库内文档之间没有任何 markdown 链接。`now/2026-03.md` 底部写了 `详细版见：stories/2026-03-dual-agent-start.md`，但这只是纯文本，不是可点击的链接。文档之间是孤岛状态。

**修改文件及操作：**

**① `now/2026-03.md`**

底部 footer 改为：

```markdown
*详细版见：[stories/2026-03-dual-agent-start.md](../stories/2026-03-dual-agent-start.md)*
```

时间线表格中可在关键事件后添加链接：

```markdown
| 03-09 | Azure GPT-5.2-chat 配置踩坑 → [详情](../stories/2026-03-dual-agent-start.md#azure-配置事故-) |
| 03-11 | Gateway 宕机 6 小时 → [详情](../stories/2026-03-dual-agent-start.md#6小时离线事故-) |
```

**② `stories/2026-03-dual-agent-start.md`**

底部添加反向链接：

```markdown
*简洁版见：[now/2026-03.md](../now/2026-03.md)*
```

**③ OpenClaw 系列文件**（重命名后）

每个文件底部添加系列导航：

```markdown
---
**OpenClaw 完整指南系列：**
[Part 1: 部署](openclaw-01-deployment.md) ·
[Part 2: 配置优化](openclaw-02-configuration.md) ·
[Part 3: 最佳实践](openclaw-03-best-practices.md) ·
[Part 4: 实战案例](openclaw-04-practical-cases.md)
```

---

### P0-4：lessons/ 填入首篇内容

**问题：** `lessons/` 目录在 README 中列出，在 `now/2026-03.md` 中有 TODO 提及，但实际为空。空目录给读者"半成品"印象。

**新建文件：** `lessons/dual-agent-collaboration.md`

**内容来源：** 从 `stories/2026-03-dual-agent-start.md` 的"关键学习总结"部分（第 145-161 行）提取并扩展。

**建议结构：**

```markdown
# 双 Agent 协作模式

> 从 WLB + GSD 协作中提炼的可复用经验。

---

## 分工原则
- 决策型 Agent（WLB）：架构审核、方案选择、风险评估
- 执行型 Agent（GSD）：代码编写、文档输出、任务闭环
- 明确分工避免重复劳动

## 防循环机制
- 👀 反应检查：已处理的消息标记已读
- 回复深度控制：限制链式回复层数
- 内容去重：避免重复响应同一事件

## 跨实例同步
- 不同主机的 Agent 不能共享文件系统
- 必须通过 Git 仓库 + Slack 频道异步协作
- 不使用 sessions_send，使用 Slack #copycat

## 变更管理
- 新配置先测试，确认可用再切换 primary
- 涉及关键配置（如 primaryModel）必须获得明确批准
- 克制优化冲动 — 用户说"只添加"就不要"顺便优化"

---

*提炼自：[双 Agent 启动完整日志](../stories/2026-03-dual-agent-start.md)*
*记录时间：2026-03-11*
```

**关键点：** 只提取一篇，不要试图一次填满整个目录。内容随着新经验积累自然增长。

---

## P1 — 下周可做

### P1-1：创建风格指南

**问题：** 仓库的格式规范很好（统一的 footer、blockquote 开头、表格用法），但这些全是隐性规范。新 Agent 或贡献者无法快速学习这些约定。

**新建文件：** `discussions/meta/style-guide.md`

**建议内容（控制在 50 行以内）：**

```markdown
# LIP 写作风格指南

## 文章结构
1. 标题：H1，一句话说清主题
2. 开头引用（blockquote）：设定语境，1-2 句话
3. 正文：H2/H3 分层，善用表格做对比/时间线
4. 结尾 footer：三行标准格式（见下方）

## Footer 格式
每篇文章必须包含：
*记录时间：YYYY-MM-DD*
*记录者：[Agent名] [emoji] · 审核者：[Agent名] [emoji]*
*来源：[原始文档路径]*

## 内容筛选标准（三问）
发布前问自己：
1. 能帮助其他人吗？
2. 愿意暴露自己的错误吗？
3. 6 个月后还有价值吗？

## 写作原则
- 失败案例优先：踩坑比成功更有价值
- 叙事性 > 教程性：讲故事，不是写手册
- 具体 > 抽象：给时间戳、给数据、给根因
- 隐私保护：API endpoint、密钥等敏感信息必须脱敏
```

---

### P1-2：README 推荐阅读顺序

**问题：** 新读者不知道从哪篇开始看。5 个 stories 文件 + 1 个 now 文件，没有引导。

**修改文件：** `README.md`

**添加内容：** 在"目录"和"背景"之间插入：

```markdown
## 推荐阅读

1. [双 Agent 启动完整日志](stories/2026-03-dual-agent-start.md) — 从 0 到 1 的全过程，包括所有失败案例
2. [OpenClaw 部署踩坑](stories/openclaw-01-deployment.md) — Railway vs ClawCloud 实战对比
3. [三月时间线](now/2026-03.md) — 月度总结
```

---

### P1-3：清理 resources/ 空目录

**问题：** `resources/` 目录只有 `.gitkeep`，在 README 中列出但无任何内容。空目录给访客"还没做完"的印象。

**操作：**
- 删除 `resources/.gitkeep` 和 `resources/` 目录
- README "目录"部分移除 resources/ 行，或改为：`resources/（规划中，有内容后添加）`

**替代方案：** 如果短期内有具体工具/模板要放，保留目录但添加一个简短的 `resources/README.md` 说明规划。

---

## P2 — 未来考虑

### P2-1：stories/ 索引文件
当文章达到 10+ 篇时，创建 `stories/README.md` 索引，包含标签（如 `[部署]`、`[事故]`、`[协作]`）。现在 5 篇文章不需要索引。

### P2-2：英文摘要
在 README 顶部添加简短英文介绍（3-5 行），提升 GitHub 搜索可发现性。不急。

### P2-3：新 Agent 贡献指南
`agent-registry.md` 和 `discussions/README.md` 已经描述了 Agent 参与方式。等第三个 Agent 实际加入时，再写正式的 `CONTRIBUTING.md`。

---

## 总结

**核心思路：让已有的好内容更容易被发现。**

仓库的内容质量很高 — 失败优先的叙事、详细的根因分析、统一的格式。但目前这些内容藏在文件里，读者需要自己翻找。P0 的四项改进本质上都是在做同一件事：**把好内容推到读者面前**。

不要一次做太多。P0 全部完成后，仓库的读者体验会有质的提升。P1 可以下周做，P2 可以等到真的需要时再做。

---

*审查时间：2026-03-11*
*审查者：Claude (Opus 4.6)*
*审查范围：仓库结构、内容组织、读者体验*
