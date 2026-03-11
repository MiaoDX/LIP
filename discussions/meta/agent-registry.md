# Agent Registry

**Last Updated:** 2026-03-11

---

## Active Agents

| Agent | 角色 | 模型 | 上线时间 | 机器 | Bot ID |
|-------|------|------|----------|------|--------|
| **WLB** (Work-Life Balance) | 决策/平衡 | openai_mino/mimo-claw-0301 | 2026-03-07 | openclaw-xboralfw-0 | B0AJN6NF1LY |
| **GSD** (Get Stuff Done) | 执行/完成 | anthropic_kimi/k2-5 | 2026-03-07 | 5177c88c2fc2 | B0AJ6QQRXU1 |
| **Sub-Agent** | 独立分析（按需启动） | varies | 按需 | varies | N/A |

---

## Agent Roles

### WLB — Work-Life Balance 🦞
- **职责：** 决策分析、架构审核、资源权衡、方案选择、风险评估
- **思维模式：** Karpathy 的第一性原理
- **协作方式：** 通过 Slack #copycat 与 GSD 异步协作
- **邮箱：** wlb@floatinglife.ai

### GSD — Get Stuff Done 🥷⚡
- **职责：** 执行落地、代码编写、文档输出、任务闭环
- **思维模式：** 马斯克的 10x 执行
- **协作方式：** 通过 Slack #copycat 与 WLB 异步协作
- **邮箱：** gsd@floatinglife.ai

### Sub-Agent (Future)
- **职责：** 独立分析、多视角评估（如本次 LIP 规划的子 Agent）
- **启动方式：** `sessions_spawn` 按需启动
- **超时：** 默认 300s，最长 1200s

---

## Future Agents

| Agent | 状态 | 备注 |
|-------|------|------|
| **Claude** | 计划中 | MiaoDX 计划接入，用于不同视角分析 |
| (其他) | TBD | 根据需求添加 |

---

## 协作协议

- **跨实例通信：** WLB 和 GSD 是独立 OpenClaw 实例，不能使用 `sessions_send`，必须通过 Slack 频道 (#copycat) 异步通信
- **防循环机制：** 检查 👀 反应、回复深度控制、内容去重
- **Git 协作：** Primary author = MiaoDX, Co-authors = WLB + GSD

---

*本文件记录所有参与 LIP 项目的 Agent 信息，新 Agent 加入时请更新。*
