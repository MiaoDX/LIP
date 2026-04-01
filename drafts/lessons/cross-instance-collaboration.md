# 跨实例协作模式

> WLB 和 GSD 运行在不同主机上（ClawCloud Run + Railway），如何高效协作而不踩坑？

---

## 核心约束与解决方案

| 问题 | 约束 | 解决方案 |
|------|------|----------|
| 不能共享文件系统 | 各自 `/data/workspace` 独立 | Git 仓库（claw-agents-shared）同步 |
| 不能直接通信 | `sessions_send` 跨实例无效 | Slack 频道异步消息 |
| 代码/文档同步延迟 | Git push/pull 有时间差 | 先 pull 再改，避免冲突 |
| 重复处理 | 两个 Agent 同时响应 | 👀 反应机制 + 去重检查 |

---

## 三层沟通架构

```
┌─────────────────────────────────────────┐
│  L1: 主频道 (Slack #copycat)             │
│  → 只发结果/决策，不发过程日志              │
├─────────────────────────────────────────┤
│  L2: Thread (频道内线程)                  │
│  → 详细讨论、调试、协商                    │
│  → 最多 5 轮，超限转 L3                   │
├─────────────────────────────────────────┤
│  L3: Git (claw-agents-shared)            │
│  → 代码、文档、设计决策的持久化存储          │
│  → 唯一真相源                             │
└─────────────────────────────────────────┘
```

---

## 👀 反应机制

收到消息后先标记，避免两个 Agent 同时处理同一任务：

```python
# 1. 检查是否已有 👀 反应
has_eyes = check_reaction(message.ts, 'eyes')
if has_eyes.by_other_bot:
    return NO_REPLY  # 对方已标记，跳过

# 2. 没有 👀，立即添加自己的
add_reaction(message.ts, 'eyes')

# 3. 处理完成后
remove_reaction(message.ts, 'eyes')
add_reaction(message.ts, 'white_check_mark')
```

**Bot ID 对照表：**

| Agent | Bot ID | User ID |
|-------|--------|---------|
| WLB 🦞 | B0AJN6NF1LY | U0AHCEPQLS3 |
| GSD 🥷⚡ | B0AJ6QQRXU1 | U0AJN5URP7A |

---

## Thread 工作流

```
主频道消息 → 判断是否需要深入讨论
  ├── 简单确认 → 直接回复（主频道）
  └── 需要讨论 → Thread 内讨论（最多5轮）
                    ├── 达成共识 → 主频道发结果
                    └── 5轮未决 → 提交 MiaoDX 决策
```

**规则：**
- 主频道只发最终结论，不发过程
- Thread 讨论保持在 5 轮以内
- 对方已添加 👀 则不重复处理
- 相似度 > 90% 的回复自动跳过

---

## 代码示例

**Slack 消息（不等待回复）：**
```python
message({
    "action": "send",
    "target": "C0AK1D7URS5",
    "message": "任务完成：xxx"
})
# 立即结束，不等待回复
# 跨实例通信必须异步
```

**Git 同步（先 pull 再改）：**
```bash
cd /data/workspace/claw-agents-shared
git pull origin main    # 先拉最新
# ... 修改文件 ...
git add -A && git commit -m "描述"
git push origin main    # 推送
```

**GitHub Token 注入（推送时）：**
```bash
source /data/workspace/.env
git push https://$GITHUB_TOKEN@github.com/MiaoDX/claw-agents-shared.git main
```

---

## 实操 Checklist

启动跨实例协作前，逐项确认：

- [ ] **Git remote 配置** — `git remote -v` 确认 origin 指向正确仓库
- [ ] **GitHub Token** — `.env` 中 `GITHUB_TOKEN` 已配置且有效
- [ ] **先 pull 再改** — 每次修改前 `git pull`，避免冲突
- [ ] **Bot ID 识别** — 确认自己的 Bot ID，不要回复自己的消息
- [ ] **👀 反应** — 收到任务先加 👀，完成换 ✅
- [ ] **Thread 深度** — 讨论不超过 5 轮
- [ ] **文件系统隔离** — 不要试图读对方机器的文件
- [ ] **异步通信** — Slack 发消息不等待回复
- [ ] **TASK-BOARD 同步** — 完成任务后更新 TASK-BOARD.md + commit + push

---

## 常见陷阱

| 陷阱 | 症状 | 修复 |
|------|------|------|
| 文件系统交叉读取 | 引用对方数据，内容不符 | 只通过 Git/Slack 同步 |
| 忘记 pull | 覆盖对方的修改 | 每次操作前先 pull |
| 同步等待 | 消息发完等回复，卡住 | 异步，不等回复 |
| 自回复循环 | 回复自己的消息 | 检查 bot_id 再响应 |

---

## 跨实例通信备忘

- WLB (ClawCloud Run) ←→ GSD (Railway)
- 共享通道：Slack #copycat + GitHub claw-agents-shared
- **不能用** `sessions_send`（仅同实例内有效）
- 心跳文件：`heartbeat/heartbeat-wlb.json` / `heartbeat-gsd.json`

---

*v1.1 — 2026-04-01 升级：从大纲补充为完整 lesson*
*来源：AGENTS.md + TOOLS.md + gsd-wlb-collaboration-protocol.md*
