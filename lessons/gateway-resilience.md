# Gateway 弹性架构：三层防护设计

> 2026年3月11日，WLB + GSD 全部离线6小时。  
> 这次事故催生了我们的三层防护架构。

---

## 事故回顾

### 时间线

| 时间 | 事件 |
|------|------|
| 00:30 UTC | Gateway 进程崩溃 |
| 00:30-06:34 | WLB + GSD 全部离线 |
| 06:34 UTC | MiaoDX 手动 SSH 重启 |

### 根因分析

1. **stale lock 文件卡死** — `sessions.json.lock` 等未正确释放
2. **Docker 内无 systemd** — 无自动恢复机制
3. **无外部监控** — 无人知晓已离线

---

## 三层防护架构

```
┌─────────────────────────────────────────┐
│  L1: 平台层（Railway 内置）              │
│  • 容器自动重启                          │
│  • /healthz endpoint                    │
│  • 自动扩缩容                           │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│  L2: 应用层（容器内 watchdog）           │
│  • 每 10 分钟健康检查                    │
│  • 清理 stale locks (>30min)            │
│  • 自动重启 gateway                     │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│  L3: 跨实例层（WLB ↔ GSD）              │
│  • 每 30 分钟心跳更新                    │
│  • >60min 未更新 → Slack 告警           │
│  • 人工介入                             │
└─────────────────────────────────────────┘
```

---

## L2 实现细节

**脚本**: `scripts/container-health-check.sh`

```bash
#!/bin/bash
# 每 10 分钟运行

# 1. 清理 stale locks
find /data/.openclaw -name "*.lock" -mmin +30 -delete

# 2. Gateway 健康检查
if ! curl -s http://127.0.0.1:18792/health > /dev/null; then
    # 重启 gateway
    openclaw gateway restart
fi
```

**Cron 配置**:
```json
{
  "name": "container-health-check",
  "schedule": {
    "kind": "every",
    "everyMs": 600000
  }
}
```

---

## L3 实现细节

**心跳文件**: `heartbeat/heartbeat-wlb.json`, `heartbeat-gsd.json`

```json
{
  "agent": "WLB",
  "timestamp": "2026-03-11T14:13:00Z",
  "status": "alive",
  "gateway_status": "HEALTHY"
}
```

**告警逻辑**:
- WLB 每 30min 更新心跳
- GSD 每 30min 更新心跳
- 读取对方心跳，检查时间戳
- > 60min 未更新 → Slack 告警

---

## 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| L1 依赖平台 | Railway 内置 | 无需额外配置 |
| L2 在容器内 | cron + script | 不依赖外部 |
| L3 跨实例 | 双向心跳 | 互相监控 |
| 告警阈值 | 60min | 避免误报 |

---

## 可复用检查清单

- [ ] L1: 平台自动重启已启用
- [ ] L2: watchdog 脚本已部署
- [ ] L2: cron job 已配置（10min 间隔）
- [ ] L3: 心跳文件路径已确认
- [ ] L3: 告警 Slack 频道已配置
- [ ] 测试：手动 kill gateway，观察自动恢复

---

## 教训

1. **设计容错** — 假设任何组件都可能失败
2. **分层防护** — 单层不够，需要多层冗余
3. **监控告警** — 无监控 = 无感知 = 无修复

---

*记录时间：2026-03-11*  
*记录者：GSD 🥷⚡ · 审核者：WLB 🦞*  
*触发事件：6小时离线事故*
