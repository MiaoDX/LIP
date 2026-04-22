---
marp: true
---

# Cron 防幻觉最佳实践

> 为什么必须说"写到Cron里"？因为模型真的会"以为自己做了"。

---

## 什么是 Cron 幻觉

**定义**：当用户要求 Agent 设置定时任务时，Agent 口头确认但**实际上没有写入 Cron 系统**，导致任务从未执行。

**典型症状**：
- "好的，我会每天9点提醒你" → 第二天没有提醒
- "已设置为每周一发送报告" → 周一什么都没发生
- "定时任务已创建" → Cron 列表里找不到

**根本原因**：模型混淆了"理解指令"和"执行指令"两个阶段。

---

## 真实案例：傅盛的教训

### 场景
傅盛对龙虾说："每天早上9点给我发AI新闻简报。"

### 幻觉发生
龙虾回复："好的，我会每天9点抓取AI媒体报道并发送给你。"

### 结果
第二天9点，什么都没有发生。

### 正确做法
傅盛学乖后：
> "每天早上9点给我发AI新闻简报。**确认一下，这个任务写进Cron了吗？**"

龙虾：
> "已确认。任务ID: `abc-123`，调度: `0 9 * * * Asia/Shanghai`，下次执行: 明天 09:00。"

---

## 防幻觉检查清单

### 对用户的建议

| 步骤 | 操作 | 示例话术 |
|------|------|----------|
| 1 | 明确要求写入Cron | "把这个任务**写到Cron里**" |
| 2 | 要求确认任务ID | "告诉我Cron任务ID是什么" |
| 3 | 要求确认调度表达式 | "确认一下cron表达式" |
| 4 | 要求确认下次执行时间 | "下次什么时候执行？" |
| 5 | 事后验证 | "列出我所有的Cron任务" |

### 对 Agent 的要求

**必须做到**：
- [ ] 使用 `cron add` 或 `gateway config.patch` 实际写入配置
- [ ] 返回任务ID给确认
- [ ] 说明调度表达式和时区
- [ ] 说明下次执行时间
- [ ] 提供验证命令（如 `cron list`）

**禁止**：
- ❌ 只说"好的"而不执行写入
- ❌ 假设任务已存在
- ❌ 不提供验证方式

---

## 技术实现细节

### OpenClaw Cron 任务类型

```json5
// 正确示例：systemEvent（用于 main session）
{
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "systemEvent",
    "text": "执行每日新闻简报任务..."
  },
  "sessionTarget": "main"
}

// 正确示例：agentTurn（用于 isolated session）
{
  "schedule": {
    "kind": "cron", 
    "expr": "0 */6 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "检查系统状态并报告...",
    "model": "minimax/MiniMax-M2.1"
  },
  "sessionTarget": "isolated"
}
```

**关键约束**

| 约束 | 说明 |
|------|------|
| `sessionTarget="main"` | 只能用 `systemEvent` |
| `sessionTarget="isolated"` | 只能用 `agentTurn` |
| 时区必须指定 | 默认UTC，建议用 `Asia/Shanghai` |
| 避免复杂 payload | isolated session 有 tool schema bug |

**常见错误模式**

*错误1：口头确认，实际未写入*
```
用户：每天9点提醒我喝水
Agent：好的，我会每天9点提醒你喝水 ✅
[实际上什么都没写]
```

*错误2：写入但格式错误*
```
Agent：已创建任务
[实际写入的是无效JSON，gateway重启后丢失]
```

*错误3：时区错误*
```
Agent：设置为每天9点
[实际用UTC时区，北京时间17点才执行]
```

*错误4：sessionTarget 不匹配*
```
Agent：使用 agentTurn + main session
[结果：报错，任务不执行]
```

**验证命令**

*列出所有 Cron 任务*
```
openclaw cron list
```

*查看特定任务详情*
```
openclaw cron runs --jobId <job-id>
```

*手动触发测试*
```
openclaw cron run --jobId <job-id>
```

**实战模板**

*用户请求模板*
```
请帮我创建一个定时任务：
- 任务：每天发送系统状态报告到 Slack
- 时间：每天早上 8:00（北京时间）
- 要求：
  1. 必须写到 Cron 里
  2. 告诉我任务ID
  3. 确认下次执行时间
  4. 提供验证命令
```

*Agent 回复模板*
```
✅ Cron 任务已创建

- 任务ID: `status-report-daily`
- 调度: `0 8 * * * Asia/Shanghai`
- 下次执行: 明天 08:00 CST
- 验证命令: `openclaw cron list | grep status-report`

任务已写入 gateway 配置，重启后仍然有效。
```

**总结**

| 原则 | 说明 |
|------|------|
| *明确说"写到Cron里"* | 关键词触发实际写入动作 |
| *要求确认* | 任务ID + 调度 + 下次执行时间 |
| *事后验证* | 用 `cron list` 确认任务存在 |
| *不信任口头确认* | 只看系统里的实际配置 |

> 💡 **核心认知**：模型的"理解"不等于"执行"。Cron 防幻觉的本质是*强制确认机制*。

---

_参考：傅盛龙虾实验 Day 3-5 日记，郎瀚威《傅盛14天龙虾深度使用心得》_
_案例来源：GSD-WLB 协作实践，2026-03-09 Azure 配置事故_
