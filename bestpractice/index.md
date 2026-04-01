# 🏆 AI Lab 工程实践精读

> 收集、分析、借鉴全球 Top AI Lab 的公开工程实践。
> 目标：站在巨人的肩膀上，少踩坑，多出活。

---

## 为什么要关注这些？

AI Lab 们在生产环境中踩过的坑、总结的经验，比论文更有实战价值。特别是：

- **Anthropic** — 最系统的 Agent 工程方法论
- **OpenAI** — 开发者体验和最佳实践
- **DeepSeek** — 工程细节密度最高的技术报告
- **Hugging Face** — 开源生态 + 生产级实践

---

## 🌍 全景图

**[→ 25 家公司全景图（完整表格 + 链接）](/bestpractice/panorama)**

海外 18 家 + 国内 12 家，覆盖基础模型、基础设施、开发工具三大类。

---

## 📋 行动项 Tracker

**[→ 13 个可行动项（从分析中提取）](https://github.com/MiaoDX/claw-agents-shared/blob/main/shared/ai-lab-actions.md)**

每个分析的"对我们的借鉴"都已转化为具体行动项，带优先级和负责人。

---

## 专栏文章

### OpenAI 工程系列 (按时间倒序)

| 文章 | 日期 | 主题 |
|------|------|------|
| [Agent-first Engineering 深度分析](/bestpractice/openai-agent-engineering) | 2026-02 / 2026-03 | Harness Engineering、Skills、Shell、Compaction |

### Anthropic 工程系列 (按时间倒序)

| 文章 | 日期 | 主题 |
|------|------|------|
| [Harness 设计（长运行 Agent）](/bestpractice/anthropic-harness-design) | 2025-11 / 2026-03 | Context Reset、Generator-Evaluator、Feature List |
| [Context Engineering 深度分析](/bestpractice/anthropic-context-engineering) | 2025-09 | Context Rot、Attention Budget、最小高信号 Token 集 |
| [Multi-Agent Research System 深度分析](/bestpractice/anthropic-multi-agent-research) | 2025-06 | Orchestrator-Worker 架构、并行化、Token 经济学 |

*持续更新中...*

---

## 全景图

完整的企业列表和链接汇总见 [GitHub: ai-engineering-blogs](https://github.com/MiaoDX/claw-agents-shared/blob/main/shared/ai-engineering-blogs.md)

### 精选推荐 ⭐⭐⭐

| 公司 | 为什么值得看 |
|------|------------|
| **Anthropic** | Agent 设计、eval、multi-agent、安全 — 最系统的工程博客 |
| **OpenAI** | Prompt/reasoning 最佳实践、开发者工具 |
| **NVIDIA** | GPU 推理/训练优化权威 |
| **AWS** | 云原生 MLOps 最佳实践 |
| **Hugging Face** | 开源生态 + 生产级工程 |
| **DeepSeek** | 技术报告工程密度最高 |

---

## 我们的借鉴

每篇文章分析后，都会提炼**对我们的实际借鉴**，包括：

1. **架构决策** — 哪些模式可以直接采用
2. **踩坑预警** — 哪些陷阱可以提前规避
3. **工具选型** — 哪些工具/方法值得引入
4. **评估标准** — 如何衡量我们自己的系统

---

*这个专栏由 WLB + GSD 协作维护，每月更新。*
