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

**[→ 13 个可行动项（从分析中提取）](/bestpractice/ai-lab-actions)**

每个分析的"对我们的借鉴"都已转化为具体行动项，带优先级和负责人。

---

## 专栏文章

默认按你们的 review 时间倒排，后续如果要加前端交互排序也很自然。

| 文章 | Discussed | 公司 | Source | 主题 |
|------|-----------|------|--------|------|
| [NVIDIA Kaggle Agent 辅助夺冠：600K 行代码、850 实验的四级 Stacking](/bestpractice/nvidia-kaggle-agent-assisted-coding) | 2026-04-27 | NVIDIA | 2026-04-23 | LLM Agent 辅助 Kaggle 竞赛、四级 stacking、human-in-the-loop |
| [Extreme Co-Design 与 MLPerf 推理记录](/bestpractice/nvidia-inference-extreme-codesign) | 2026-04-10 | NVIDIA | 2026-04 | GB300 2.7x 性能提升、TensorRT-LLM、全栈协同设计 |
| [Rack-Scale Topology-Aware Scheduling](/bestpractice/nvidia-rack-scale-topology-scheduling) | 2026-04-15 | NVIDIA | 2026-04-07 | NVLink fabric、IMEX domain、机架级调度 |
| [Forge 企业模型工程](/bestpractice/mistral-forge-enterprise-model-engineering) | 2026-04-14 | Mistral | 2026-03 | 私有知识锻造、模型资产化、强化学习 |
| [Voxtral TTS 多语言架构](/bestpractice/mistral-voxtral-tts) | 2026-04-14 | Mistral | 2026-03-23 | 流式推理、多语言 TTS、延迟优化 |
| [V3/R1/V3.2 工程实践分析](/bestpractice/deepseek-v3-r1) | 2026-04 | DeepSeek | 2026-04-01 | FP8 训练、DualPipe、零回滚稳定性、RLVR、成本效率 |
| [Gemini Embedding 模型更新](/bestpractice/google-gemini-embedding) | 2026-04-13 | Google | 2025-03-07 | Gemini Embedding、Text Embedding API、新一代稀疏架构 |
| [ReasoningBank：Agent 自进化](/bestpractice/google-reasoningbank-agent-self-evolving) | 2026-04-21 | Google | 2026-04-21 | Agent 经验学习、推理能力自增强 |
| [Agent-first Engineering 深度分析](/bestpractice/openai-agent-engineering) | 2026-03 | OpenAI | 2026-02 ~ 2026-03 | Harness Engineering、Skills、Shell、Compaction |
| [Agent Skills 如何补知识差距](/bestpractice/google-deepmind-agent-skills-knowledge-gap) | 2026-04-15 | Google DeepMind | 2026-03-25 | AGENTS.md vs Skill、知识过期问题、更新机制 |
| [LiteRT 端侧 AI 部署](/bestpractice/google-litert-on-device-ai) | 2026-04-14 | Google | 2026-01-28 | 移动端推理、量化策略、跨平台部署 |
| [Gemini Robotics ER-1.6](/bestpractice/google-gemini-robotics-er-16) | 2026-04-14 | Google DeepMind | 2026-04-14 | 机器人视觉-语言-动作模型 |
| [Decoupled DiLoCo](/bestpractice/google-deepmind-decoupled-diloco) | 2026-04-26 | Google DeepMind | 2026-04-24 | 去中心化联邦学习、大规模分布式训练 |
| [Infrastructure Noise](/bestpractice/anthropic-infrastructure-noise) | 2026-04-23 | Anthropic | 2026-04-23 | 基础设施噪声、系统可靠性 |
| [Harness 设计（长运行 Agent）](/bestpractice/anthropic-harness-design) | 2026-03 | Anthropic | 2025-11-26 / 2026-03-24 | Context Reset、Generator-Evaluator、Feature List |
| [Context Engineering 深度分析](/bestpractice/anthropic-context-engineering) | 2025-09 | Anthropic | 2025-09-29 | Context Rot、Attention Budget、最小高信号 Token 集 |
| [Multi-Agent Research System 深度分析](/bestpractice/anthropic-multi-agent-research) | 2025-06 | Anthropic | 2025-06-13 | Orchestrator-Worker 架构、并行化、Token 经济学 |

> 说明：
> - 默认按 review 时间倒排
> - 公司单独列出，不再按公司分组
> - **日期规范**：所有条目使用日粒度日期（YYYY-MM-DD）
>   - **Discussed**：我们 review、提炼、收录的日期
>   - **Source**：外部文章或源文档自己的发布日期
>   - **Updated**：仅内部文档需要，记录文档最后修订日期
>   - 若原始来源只能确认到月份，保留月粒度并标注

*持续更新中...*

---

## 全景图

完整的企业列表和链接汇总见 [LIP: AI Engineering Blogs 全列表](/bestpractice/ai-engineering-blogs)

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
