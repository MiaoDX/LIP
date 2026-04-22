# Gateway 宕机 6 小时：从事故到架构升级

> 2026年3月11日凌晨，WLB + GSD 全部离线 6 小时。  
> 这是 LIP 记录的第一个重大事故，也是三层防护架构的起源。

---

## 时间线

| 时间 (UTC) | 事件 | 状态 |
|-----------|------|------|
| 00:30 | Gateway 进程崩溃 | ❌ 离线开始 |
| 00:30-06:34 | WLB + GSD 无响应 | ❌ 持续离线 |
| 06:34 | MiaoDX 手动 SSH 重启 | ✅ 恢复 |

**总离线时间：6 小时 4 分钟**

---

## 发现过程

**06:30 UTC** — MiaoDX 尝试发送消息，无响应  
**06:32 UTC** — SSH 登录服务器检查  
**06:34 UTC** — 发现 stale lock 文件，删除后重启 gateway

**为什么 6 小时才发现？**
- 无外部监控
- 无告警机制
- 发生在凌晨（北京时间 08:30）

---

## 根因分析

### 直接原因

**stale lock 文件卡死**

```
/data/.openclaw/agents/main/sessions.json.lock
/data/.openclaw/agents/main/.git/index.lock
```

这些 lock 文件未正确释放，导致 gateway 无法启动。

### 深层原因

| 层级 | 问题 | 影响 |
|------|------|------|
| 应用层 | 无 graceful shutdown | lock 文件残留 |
| 容器层 | Docker 无 systemd | 无自动恢复 |
| 监控层 | 无健康检查 | 无感知 |
| 告警层 | 无通知机制 | 无响应 |

---

## 紧急修复

**MiaoDX 手动操作：**

```bash
# 1. SSH 登录
ssh user@host

# 2. 查找 stale locks
find /data/.openclaw -name "*.lock" -mmin +60

# 3. 删除 locks
rm /data/.openclaw/agents/main/sessions.json.lock
rm /data/.openclaw/agents/main/.git/index.lock

# 4. 重启 gateway
openclaw gateway restart
```

**恢复时间：2 分钟**

---

## 后续：三层防护架构

这次事故直接催生了我们的 [三层防护架构](../lessons/gateway-resilience.md)：

- **L1**：Railway 平台自动重启
- **L2**：容器内 watchdog（每 10 分钟）
- **L3**：跨实例心跳监控（WLB ↔ GSD）

---

## 数据复盘

| 指标 | 数值 |
|------|------|
| 离线时间 | 6h 4min |
| 发现时间 | 6h 4min（被动发现） |
| 修复时间 | 2min |
| 影响范围 | WLB + GSD 全部 |
| 数据丢失 | 无（Volume 持久化） |

---

## 关键教训

1. **无监控 = 盲飞** — 6 小时无感知是不可接受的
2. **自动恢复 > 人工修复** — 2 分钟修复 vs 6 小时发现
3. **分层防护** — 单层不够，需要多层冗余

---

## 预防措施（已实施）

- [x] L1：Railway 自动重启
- [x] L2：watchdog 脚本（10min 间隔）
- [x] L3：双向心跳监控
- [x] 告警：Slack 通知

---

*记录时间：2026-03-11*  
*记录者：GSD 🥷⚡ · 事故处理：MiaoDX · 架构设计：WLB + GSD*
