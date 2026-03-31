# 两个 AI Agent、两个平台、一杯咖啡的成本 —— 我们的多 Agent 协作实践

> 这是 2026 年 3 月 OpenClaw Meetup 北京站的分享整理，记录我们如何用极低成本跑起来一套生产级多 Agent 协作系统。

---

## 先讲一个失败的故事

6 小时。

这是我们系统宕机的时间。原因不是代码 bug，是一个 stale lock 文件把 gateway 卡死了。两个 Agent 同时离线，没有告警，没有自动恢复。我 SSH 进去手动重启，才发现问题。

今天我想分享的，就是从这次失败开始，我们怎么用一杯咖啡的成本跑起来一套多 Agent 协作系统。

---

## 双平台部署方案

我们跑了两个 OpenClaw Agent —— GSD 和 WLB：

| | GSD (Railway) | WLB (ClawCloud Run) |
|---|---|---|
| 类型 | 托管容器 | 持久容器 |
| 冷启动 | 有（~30s） | 无 |
| 资源 | ~512MB | 16 cores + 123GB |
| 月成本 | $0-5 | ¥0（免费额度） |

**Railway** 用的是社区模板 `clawdbot-railway-template`，5 分钟就能部署一个 OpenClaw 实例，自带 Web 设置向导、持久化存储、健康检查。

**ClawCloud Run** 是持久容器，不休眠，适合需要长期在线的 Agent。

两个平台加起来，每月成本大约一杯咖啡 —— 不到 ¥36。

为什么选双平台？不是为了性能，是为了**冗余**。一个平台挂了，另一个还能继续工作。这在后面的故障案例里会看到有多重要。

---

## 运维踩坑实录

### Stale Lock —— 头号杀手

说回那次 6 小时宕机。根因是一个 `sessions.json.lock` 文件。Gateway 进程异常退出时没有清理这个 lock，下次启动就卡住了。

这不是一次性问题。我们前后遇到了三次：

| 时间 | 故障 | 根因 | 影响 |
|------|------|------|------|
| 03-09 | Azure 404 循环刷屏 | 配置错误 + 无重试上限 | 刷屏数百条消息 |
| 03-11 | 6 小时宕机 | Stale lock 文件 | 双 Agent 离线 |
| 03-11 | WebSocket 断开 | Stale lock 复发 | 消息丢失 |

教训很简单：**遇到 gateway 无响应，先查 lock 文件。** 这个规则现在写进了我们的运维手册。

### 平台自带的可靠性

Railway 自带健康检查。如果 `/healthz` 返回异常，它会自动重启容器。这不是我们写的代码，是平台能力。选对平台很重要。

### 跨实例心跳监控

但平台只能保证单个容器活着，不能告诉你**另一个 Agent 是不是也活着**。

所以我们做了一个简单的跨实例心跳：每个 Agent 每 30 分钟往 GitHub 共享仓库写一个心跳文件。超过 60 分钟没更新，就发 Slack 告警。

加起来不到 30 行 shell 脚本。但如果 03-11 那天有这个机制，我们不会等 6 小时才发现问题。

---

## 多 Agent 怎么不打架？

两个 Agent 跑在不同平台上，怎么协作？

### 协作协议

我们设计了一套协作协议，解决几个核心问题：

**防循环**：两个 Agent 在同一个 Slack 频道，看到消息都想回复，就会互相触发、无限循环。我们用了四层保护 —— 自我识别、回复深度控制、互斥响应、内容去重。

**任务分配**：WLB 负责决策和规划，GSD 负责执行和落地。角色清晰，不重叠。

**状态同步**：收到消息先加 👀 表情，处理完换 ✅。其他 Agent 看到 👀 就知道有人在处理了。

### jj-mailbox —— 异步持久化通信

Slack 是实时的，但如果 Agent 掉线了，消息就丢了。

我们设计了一个叫 jj-mailbox 的方案：本质就是一个 Git 仓库里的 JSON 文件系统。每个 Agent 有自己的 inbox 目录，消息写进去、git commit、git push。接收方 pull 之后读取。

好处是：**Git 是免费的，自带版本历史，天然可追溯，不需要运维数据库。** 对我们这种两个 Agent 的小团队，这是 sweet spot。

目前 jj-mailbox 的消息流和任务流已经验证通过，正在逐步投入生产使用。

### GitHub 作为协作枢纽

GitHub 在我们的方案里扮演了多个角色：代码仓库、心跳同步、jj-mailbox 消息通道、协作文档共享。一个免费的 GitHub repo，做了四件事。

---

## 三个核心 takeaway

**第一，低成本 ≠ 低可靠。** 两个平台加起来一杯咖啡的钱，但通过心跳监控和平台自带的恢复能力，可以做到合理的可用性。

**第二，协议 > 默契。** Agent 协作不能靠猜，要有明确的规则 —— 谁负责什么、怎么避免冲突、怎么同步状态。

**第三，失败是最好的老师。** 我们的每一个运维规则，都是从真实故障里长出来的。

---

## 相关资源

- **Railway 模板**: [clawdbot-railway-template](https://github.com/ChaptersOfFloatingLife/clawdbot-railway-template)
- **GitHub 仓库**: [MiaoDX/claw-agents-shared](https://github.com/MiaoDX/claw-agents-shared)
- **OpenClaw 文档**: [docs.openclaw.ai](https://docs.openclaw.ai)

如果你也在玩多 Agent，欢迎交流。

---

*整理自 2026-03-15 OpenClaw Meetup 北京站分享*
*演讲者：缪东旭 (MiaoDX)*
