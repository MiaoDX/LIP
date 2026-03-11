# 2026-03-09 Cron 审计与精简

> MiaoDX 要求 WLB 和 GSD 互相分享 Cron jobs，检查哪些不必要，哪些可以共享。
> 最终精简 37%，建立明确分工。

---

## 背景

MiaoDX 要求 GSD 和 WLB 互相分享 Cron jobs，检查哪些不必要，哪些可以共享，优化三方协作。

## 原始状态

| Agent | 总 jobs | 已禁用 | 重复 jobs |
|-------|---------|--------|-----------|
| GSD | 23 | 2 | 3 组 |
| WLB | 6 | 2 | — |

## 清理结果

### GSD 删除 5 个 jobs
1. Check Awesome OpenClaw Skills (重复)
2. OpenClaw Source Sync 10:00 (重复)
3. System Prompt Summary 06:30 (重复)
4. Auto Session Summarizer (已禁用)
5. WeChat Article Monitor (已禁用)

### WLB 删除 4 个 jobs
1. WeWe-RSS Monitor (已废弃)
2. WeChat Authors Monitor (已废弃)
3. Check OpenClaw Skills (改用 GSD 结果)
4. model-latency-monitor (改用 GSD 结果)

## 协作优化

| 任务 | 负责方 | 频率 | 输出 |
|------|--------|------|------|
| 技能检查 | GSD | 每天 02:00 | 结果共享到 #copycat |
| 模型监控 | GSD | 每天 07:00 | 双方共享结果 |
| 每日分享 | GSD → WLB | GSD 01:00 → WLB 09:00 | 时间错开互补 |

## 时间调整（1-6 点窗口）

MiaoDX 要求所有 cron jobs 安排到 01:00-06:00 (Asia/Shanghai)，每 30 分钟间隔，避免白天打扰。

### GSD 新时间表
| 时间 | 任务 |
|------|------|
| 01:00 | Daily Share (GSD + WLB 配对) |
| 01:30 | OpenClaw Source Sync |
| 02:00 | Memory Sync to GitHub |
| 02:30 | Check OpenClaw Skills |

### WLB 新时间表
| 时间 | 任务 |
|------|------|
| 01:15 | system-status-monitor (每小时第 15 分钟) |
| 01:45 | Daily Learning Exchange |

## 最终结果

- **WLB**: 从 6 → 2 jobs (精简 67%)
- **GSD**: 从 23 → 18 jobs (精简 22%)
- **重复消除**: 3 组重复 jobs 全部清理
- **时间统一**: 全部 01:00-06:00 Asia/Shanghai

## 协作优化成果

- 双方消除重复，建立明确分工
- 时区统一，错开执行时间
- 建立协作机制：GSD 运行技能/模型检查 → 发到 #copycat → WLB 接收

## 规则更新

- **交叉检查**: 定期与 GSD 对比 cron jobs，避免重复积累
- **精简原则**: 禁用超过 7 天的 job 应考虑删除
- **协作优先**: 双方都能做的任务，由更合适的执行方负责
- **时区统一**: 所有 cron 任务使用 Asia/Shanghai 时区
- **时间窗口**: 所有 cron jobs 安排在凌晨 1-6 点，间隔 30-60 分钟，避免白天打扰

---

*记录时间：2026-03-11*  
*来源：claw-agents-shared/memory/2026-03-09.md*
