# Decision Log

**Last Updated:** 2026-03-11

---

## 2026-03-11 — LIP Repo Creation & Structure

| 决策 | 结果 | 决策者 | 理由 |
|------|------|--------|------|
| Repo 位置 | `MiaoDX/LIP` (personal GitHub) | MiaoDX | 个人品牌，直接可见 |
| License | MIT | MiaoDX | 简单，允许复刻，符合 Learn In Public 精神 |
| Issues/PRs | 先关闭 | MiaoDX | 成熟后再开，避免早期噪音 |
| 结构 | 4 核心目录 + discussions/ | WLB+GSD 共识 | 平衡完整度与维护成本 |
| 定位 | "AI 协作进化日志" | GSD 提案，三方共识 | 故事性 > 教程性 |
| Git author | MiaoDX primary, WLB+GSD co-authors | MiaoDX | 体现协作本质 |
| Co-author emails | wlb@floatinglife.ai, gsd@floatinglife.ai | MiaoDX | floatinglife.ai = 未来公司名 |
| discussions/ 夹 | 新增，留存 AI 讨论上下文 | MiaoDX | 未来多 Agent 分析需要 |
| 启动节奏 | 今天发第一篇 | 子 Agent 警告"归档陷阱" | 速度 > 完美 |
| MVP 案例 | Azure 事故 + 6h 离线 + 微信被封 | 三方共识 | 失败案例优先 |

---

## 2026-03-09 — 角色分工调整

| 决策 | 结果 | 决策者 | 理由 |
|------|------|--------|------|
| WLB 角色 | 决策/平衡 | MiaoDX | 符合 WLB 名字本义 |
| GSD 角色 | 执行/完成 | MiaoDX | 符合 GSD 名字本义 |
| 思维模式 | WLB=Karpathy 第一性原理, GSD=马斯克 10x 执行 | MiaoDX | 参考思维，不扮演人物 |

---

## 2026-03-09 — Azure GPT-5.2-chat 配置事故

| 决策 | 结果 | 决策者 | 理由 |
|------|------|--------|------|
| primaryModel | 恢复为 anthropic_kimi/k2-5 | WLB | Azure 配置有问题，不能设为 default |
| Azure 状态 | 保留在 model 列表，可手动测试 | MiaoDX | 不影响其他模型使用 |
| 教训 | 变更前必须测试，严格遵循用户指令 | MiaoDX | 避免类似事故 |

---

## 2026-03-11 — Gateway 三层防护架构

| 决策 | 结果 | 决策者 | 理由 |
|------|------|--------|------|
| L1 | Railway 内置容器重启 | MiaoDX | 无需操作，自动处理 |
| L2 | 容器内 cron watchdog (每 10min) | WLB+GSD | stale lock 清理 + 健康检查 |
| L3 | Cross-instance heartbeat (GitHub, 每 30min) | WLB+GSD | >60min 未更新告警 |
| 方案状态 | 完成，等待 MiaoDX 确认 Railway health check | — | — |

---

## 规则索引

| 规则 | 来源 | 日期 |
|------|------|------|
| Git Push Approval | AGENTS.md | 2026-03-06 |
| API Key Policy | AGENTS.md | 2026-03-06 |
| 跨实例通信 via Slack | TOOLS.md | 2026-03-08 |
| Cron 防幻觉 | AGENTS.md | 2026-03-08 |
| Subagent 必须带 timeout | AGENTS.md | 2026-03-09 |
| 配置变更检查清单 | TOOLS.md | 2026-03-09 |

---

*本文件记录 LIP 项目所有关键决策，新决策请追加到对应日期。*
