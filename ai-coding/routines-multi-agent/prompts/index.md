# Routines Prompts

四个 routine 的完整 prompt，可以直接复制到 claude.ai/code/routines 创建对应任务。

## 文件

| 文件 | Routine | 触发频率 | 职责 |
|---|---|---|---|
| [`auto_pr.md`](auto_pr.md) | **auto_pr** | 每小时 | 挑 issue → 改代码 → PR → 自评 |
| [`issue_label.md`](issue_label.md) | **issue_label** | 每天 | 只读 + 优先级标签 |
| [`pr_again.md`](pr_again.md) | **pr_again** | 每天 | 孤儿分支救援 |
| [`daily_duty.md`](daily_duty.md) | **daily_duty** | 每天 | CI 修复 + 代码健康检查 |

## 使用说明

1. 在 [claude.ai/code/routines](https://claude.ai/code/routines) 创建四个 routine
2. 分别把对应 `.md` 文件里 `## Task:` 开头之后的内容贴到 prompt 输入框
3. 绑定同一个 GitHub repo
4. 设置触发频率（auto_pr hourly，其余 daily）
5. 建议错峰：例如 robowbc daily 放 9:00、roboharness daily 放 9:30，避免 rate limit 撞车

## 演化

这些 prompt 不是一次写完的，每一次 agent 出错都会在 prompt 里加一条约束。未来随着 Claude 能力提升、MCP 稳定性改善、Routines 平台能力扩展，很多现在看起来必要的兜底分支应该会退化或消失。
