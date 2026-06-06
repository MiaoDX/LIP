# AI Lab 行动项 Tracker

> 从 AI Lab 工程实践分析中提取的可执行动作。只保留仍然需要跟进的跨文章行动项，避免每篇文章里的建议散落不可见。

## P1

| ID | 行动项 | 来源 | 当前状态 |
|----|--------|------|----------|
| D2 | 设计 Context 智能过滤机制，避免长任务全量加载历史 | [DeepSeek V3/R1](/bestpractice/deepseek-v3-r1) | 待排期 |
| D3 | 建立运行稳定性检查，减少 404 循环、stale lock 这类重复事故 | [DeepSeek V3/R1](/bestpractice/deepseek-v3-r1) | 待排期 |
| N1 | 测量 OpenClaw 实际端到端推理吞吐和延迟 | [NVIDIA Inference Extreme Co-Design](/bestpractice/nvidia-inference-extreme-codesign) | 待排期 |
| A2 | 长任务中间状态持久化到文件，减少只靠聊天上下文传递 | [Anthropic Multi-Agent Research](/bestpractice/anthropic-multi-agent-research) | 待排期 |

## P2

| ID | 行动项 | 来源 | 当前状态 |
|----|--------|------|----------|
| D1 | 为 Agent 行动设计可自动验证的奖励或检查项 | [DeepSeek V3/R1](/bestpractice/deepseek-v3-r1) | 待排期 |
| D4 | 采用渐进式复杂化，先验证简单版本再扩展复杂机制 | [DeepSeek V3/R1](/bestpractice/deepseek-v3-r1) | 持续执行 |
| N2 | 检查 Gateway 与 Agent 跨进程通信路径，减少不必要的序列化 | [NVIDIA Inference Extreme Co-Design](/bestpractice/nvidia-inference-extreme-codesign) | 待排期 |
| N3 | 如果自托管 MoE 模型，确认 NVLink / PCIe 带宽不会成为专家路由瓶颈 | [NVIDIA Inference Extreme Co-Design](/bestpractice/nvidia-inference-extreme-codesign) | 条件触发 |
| H1 | 给 WLB 评估建立标准化评分维度 | [Anthropic Harness Design](/bestpractice/anthropic-harness-design) | 待排期 |
| H3 | 长项目使用结构化 feature list 追踪任务状态 | [Anthropic Harness Design](/bestpractice/anthropic-harness-design) | 持续执行 |

## P3 / Watch

| ID | 行动项 | 来源 | 当前状态 |
|----|--------|------|----------|
| D5 | 增加 token 成本意识，记录任务级 token 使用量 | [DeepSeek V3/R1](/bestpractice/deepseek-v3-r1) | 观察 |
| N4 | 关注多模态 Skill / VLM 推理机会 | [NVIDIA Inference Extreme Co-Design](/bestpractice/nvidia-inference-extreme-codesign) | 观察 |
| DY1 | 小规模 PoC Dynamo agent hints，不直接 all-in 自托管栈 | [NVIDIA Dynamo Agentic Inference](/bestpractice/nvidia-dynamo-agentic-inference) | 观察 |

## 维护规则

- 新分析文章如果有明确行动项，同步追加到本页
- 只记录跨文章可复用动作，不记录单篇文章的阅读笔记
- 状态变化后同步更新来源文章或相关执行计划
