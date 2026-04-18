> 来源：
> 1. [OpenAI Partners with Cerebras to Bring High-Speed Inference to the Mainstream](https://www.cerebras.ai/blog/openai-partners-with-cerebras-to-bring-high-speed-inference-to-the-mainstream) (2026-01-14)
> 2. [Why the AI Race Shifted to Speed](https://www.cerebras.ai/blog/why-the-ai-race-shifted-to-speed) (2026-03-20)
> 3. [Cerebras CS-3 vs. Nvidia DGX B200 Blackwell](https://www.cerebras.ai/blog/cerebras-cs-3-vs-nvidia-dgx-b200-blackwell) (2025-09-19)
> 4. [Cerebras is coming to AWS](https://www.cerebras.ai/blog/cerebras-is-coming-to-aws) (2026-03-13)
>
> **使用模型**：
> - GSD: openai-codex/gpt-5.4 (2026-04-18)
> - WLB: openai_mino/mimo-claw-0301 (2026-04-18)
> 
> **分析师**：WLB + GSD（文件协作模式）

---

## 一句话总结

Cerebras 不是在造"更快的 GPU"，而是在用**晶圆级计算（Wafer-Scale Engine）**重新定义 AI 推理的物理基础。他们的核心赌注是：**内存带宽才是 LLM 推理的瓶颈，而不是算力**——通过把整个模型权重放在片上 SRAM，他们实现了比 NVIDIA Blackwell 快 21 倍的推理速度，同时成本和功耗都更低。

---

## 1. 这篇东西为什么值得分析

2025-2026 年，AI 行业的竞争焦点正在发生微妙但关键的转移：

- **2024-2025 上半年**：模型智能（参数规模、 benchmark 分数）
- **2025 下半年-2026**：推理速度（token/秒、端到端延迟）

Cerebras 的 Wafer-Scale Engine 是这个转折点的**基础设施层答案**。他们解决的不是"如何让 GPU 更快"，而是"如果重新设计芯片架构，AI 推理应该长什么样"。

<!-- WLB: 这件事的战略意义在于，Cerebras 在挑战一个根深蒂固的假设：AI 芯片必须是小芯片 + 高速互联。他们的答案是——不，你可以直接用一整片晶圆。 -->

<!-- GSD: 从工程角度看，这特别激进。他们不是优化现有架构，而是推翻重来。这种"从零开始"的勇气，在半导体行业非常罕见。 -->

---

## 2. Cerebras 到底做了什么

### 2.1 架构层：Wafer-Scale Engine（WSE）—— 一整片晶圆就是一个芯片

传统 AI 芯片的设计逻辑：

```
小芯片（GPU/TPU）→ 高速互联（NVLink/InfiniBand）→ 多卡集群
```

Cerebras 的设计逻辑：

```
一整片晶圆 → 刻上 4 万亿晶体管 → 44GB 片上 SRAM → 单芯片超算
```

具体参数对比：

| 指标 | NVIDIA B200 | Cerebras WSE-3 |
|------|-------------|----------------|
| 晶体管数量 | ~2080 亿 | 4 万亿 |
| 片上 SRAM | 192GB HBM3e | 44GB SRAM |
| 内存带宽 | 8 TB/s | 21 PB/s |
| 芯片面积 | 814 mm² | 46,225 mm² |
| 制程 | 4nm | 7nm |

<!-- GSD: 注意这个内存带宽差距：21 PB/s vs 8 TB/s，差了 2600 倍。这就是 Cerebras 快 21 倍的物理基础。 -->

### 2.2 核心洞察：LLM 推理的瓶颈是内存带宽，不是算力

Cerebras 反复强调的是：**生成每个 token 都需要把整个模型权重从内存搬到计算单元**。

在 GPU 上：
- 模型权重存在 HBM（高带宽内存）
- 每次生成 token 都要读取全部权重
- HBM 带宽成为硬瓶颈

在 Cerebras WSE 上：
- 模型权重存在片上 SRAM
- 无需片外内存访问
- 内存带宽比 GPU 高 3 个数量级

这意味着：
- **小模型**（< 44GB）：整个模型 fits 在片上，推理速度极快
- **大模型**：通过 weight streaming 或模型并行，仍然比 GPU 快一个数量级

### 2.3 商业模式：从卖芯片到卖推理服务

Cerebras 的商业模式演进：

1. **早期（2019-2022）**：卖 CS-1/CS-2 系统给超算中心
2. **中期（2023-2024）**：训练即服务（Cerebras Cloud）
3. **现在（2025-2026）**：推理即服务 + 与云厂商合作

关键合作：
- **OpenAI**：750 MW 多年合作协议，部署 Cerebras 系统服务 OpenAI 客户
- **AWS**：Cerebras CS-3 进入 AWS 数据中心，通过 Bedrock 提供服务
- **Meta、Vercel、HuggingFace、OpenRouter**：生态合作伙伴

---

## 3. 这次发布里最值得注意的 4 个工程信号

### 3.1 速度正在成为 AI 竞争的新维度

Cerebras 博客中引用了一个关键观察：

> "2025 年大部分时间，AI 竞赛是关于模型智能的。过去三个月，竞赛已经转移。"

具体证据：
- **Google**：Gemini 3 Flash 比 Gemini 3 Pro 快 3 倍
- **Anthropic**：Claude Opus 4.6 Fast 比基础版快 2.5 倍，定价贵 6 倍
- **OpenAI**：与 Cerebras 合作推出 GPT-5.3-Codex-Spark，1200+ tokens/秒

<!-- WLB: Anthropic 的定价特别说明问题——速度比智能更值钱。Opus 4.6 Fast 的定价是基础版的 6 倍，而智能提升（Sonnet → Opus）只贵 66%。 -->

### 3.2 推理速度直接影响模型迭代速度

OpenAI 和 Anthropic 都披露了一个重要信号：**他们正在用自己的 coding models 来构建下一代模型**。

OpenAI 的博客：
> "GPT-5.3-Codex 是我们第一个在自身开发中发挥关键作用的模型。Codex 团队用早期版本调试自己的训练、管理自己的部署、诊断测试结果和评估。"

Anthropic 的 Boris Cherny：
> "100% 的代码都是 AI 写的，已经持续两个多月。大约 90% 的 Claude Code 代码库是 Claude Code 自己写的。"

这意味着：**推理速度现在处于开发下一代前沿模型的关键路径上**。

### 3.3 与 AWS 的"分解式推理"合作是架构创新的信号

Cerebras 和 AWS 的合作不只是"把 Cerebras 放进 AWS 数据中心"，而是共同开发**分解式推理（Disaggregated Inference）**架构：

```
用户请求
    ↓
AWS Trainium（处理 prefill，计算 KV cache）
    ↓（通过 Amazon EFA 高速互联）
Cerebras WSE（处理 decode，生成输出 token）
```

这种架构的洞察：
- **Prefill**：计算密集型，需要密集计算核心 → Trainium 擅长
- **Decode**：内存带宽密集型，需要极高内存带宽 → WSE 擅长

结果是：**5 倍的高速度 token 容量提升**。

<!-- GSD: 这是典型的"各取所长"架构设计。不是让一块芯片做所有事，而是让最适合的芯片做最适合的阶段。 -->

### 3.4 训练速度优势：10 倍更快的 time-to-train

除了推理，Cerebras 在训练上也有显著优势：

**GPU 集群的问题**：
- 需要数万行分布式系统代码
- 复杂的网络拓扑和通信优化
- 数十名工程师维护

**Cerebras 的方案**：
- 从 1 到 1000 个晶圆，像操作单个设备一样简单
- 无需分布式"胶水"代码
- 超算性能，单机可编程性

客户证言：
- GSK："Cerebras 让我们能以在 GPU 集群上不可能的方式探索架构变化"
- AstraZeneca："原本需要两周的训练，在 Cerebras 上只需两天"

---

## 4. 性能对比：Cerebras CS-3 vs NVIDIA DGX B200

基于 SemiAnalysis 的独立基准测试：

| 维度 | Cerebras CS-3 | NVIDIA DGX B200 | 优势方 |
|------|---------------|-----------------|--------|
| 推理速度 | 21x 更快 | 基准 | Cerebras |
| 成本 | 低 32% | 基准 | Cerebras |
| 功耗 | 低 32% | 基准 | Cerebras |
| 准确率 | 相同（全精度） | 相同 | 持平 |
| 生态集成 | 快速增长 | 成熟广泛 | NVIDIA |
| 可用性 | 已广泛部署 | 供应受限 | Cerebras |

具体性能数据（Llama 3 70B，推理场景，1024 输入 + 4096 输出）：
- Cerebras：端到端延迟显著更低
- NVIDIA B200：受限于 HBM 带宽

其他模型基准：
- **OpenAI gpt-oss-120B**：Cerebras 2700+ tokens/秒 vs NVIDIA B200 900 tokens/秒
- **Meta Llama 4 Maverick**：Cerebras 2500+ tokens/秒 vs NVIDIA B200 1000 tokens/秒

---

## 5. WLB 视角：Cerebras 在赌什么

<!-- WLB: Cerebras 的赌注可以总结为三件事： -->

### 5.1 内存墙是真实存在的，而且会越来越痛

随着模型变大，权重搬运的代价呈线性增长。Cerebras 的洞察是：**与其优化搬运速度，不如消除搬运需求**。

### 5.2 AI 基础设施会从"通用计算"转向"专用架构"

GPU 是通用并行计算的胜利，但 LLM 推理有独特的计算模式（顺序生成、权重复用、内存瓶颈）。Cerebras 相信，专用架构会在这个细分领域击败通用架构。

### 5.3 速度会成为 AI 产品的核心差异化因素

当模型智能趋于收敛（GPT-4 级别模型遍地开花），用户体验的差异将来自**响应速度**。Cerebras 在押注：未来的 AI 产品，快的会击败慢的。

---

## 6. GSD 视角：对实际系统建设最有用的启发

<!-- GSD: 如果把 Cerebras 当"又一个芯片公司"看，会低估它。对做 AI 基础设施的人，这是一篇很实操的工程文章。 -->

### 6.1 重新思考"瓶颈"的定义

很多团队优化 AI 系统时，默认瓶颈是"算力不足"。Cerebras 提醒我们：**先测量，再优化**。对于 LLM 推理，真正的瓶颈往往是内存带宽。

### 6.2 架构创新比渐进优化更有价值

当整个行业都在优化 GPU 集群时，Cerebras 选择了另一条路：**如果重新设计芯片，AI 推理应该长什么样？** 这种"从零开始"的思维，往往比"在现有架构上打补丁"更有突破性。

### 6.3 速度的经济价值被低估了

Anthropic 的定价策略说明：用户愿意为速度付 6 倍溢价。在 toB 场景（coding agents、实时对话、金融交易），速度直接等于生产力。

### 6.4 混合架构可能是未来

Cerebras + AWS 的分解式推理展示了一种新范式：**不是一块芯片做所有事，而是让最适合的芯片做最适合的阶段**。这对设计 AI 系统有启发：
- 计算密集型任务 → 专用计算芯片
- 内存密集型任务 → 高带宽架构
- 通过高速互联协调

---

## 7. 对我们这套多 Agent / 知识系统的直接借鉴

### 7.1 重新评估我们自己的推理延迟瓶颈

我们的 Agent 系统是否也受限于内存带宽？如果是，可以考虑：
- 模型量化（减少权重搬运量）
- 缓存策略（避免重复计算）
- 批处理（摊薄内存访问开销）

### 7.2 速度作为产品体验的核心指标

如果 Cerebras 是对的，那么：
- Agent 响应速度会直接影响用户留存
- 实时协作场景（multi-agent 对话）对延迟更敏感
- 值得投入资源优化端到端延迟

### 7.3 专用化 vs 通用化的权衡

Cerebras 的选择提醒我们：**在特定领域，专用架构可以击败通用架构**。在我们的系统中：
- 通用 LLM 用于开放域对话
- 专用模型/规则引擎用于特定任务
- 通过路由层协调

### 7.4 生态建设的重要性

Cerebras 最大的挑战是生态（vs NVIDIA 的 CUDA 生态）。这提醒我们：**技术领先不等于市场成功**，生态建设同样关键。

---

## 8. 一个冷判断：Cerebras 可能是 2026 年最重要的基础设施公司

Cerebras 不是那种会在社交媒体上引爆的公司。他们没有"100 个 agent 并行"那么吸睛，也没有"超长上下文"那么好传播。

但他们正在做一件可能更有后劲的事：**重新定义 AI 推理的物理基础**。

如果他们的判断是对的（内存带宽是瓶颈，专用架构会赢），那么：
- 整个 AI 基础设施栈会重新洗牌
- NVIDIA 的统治地位会受到挑战
- 速度会成为 AI 产品的核心差异化因素
- 新的架构创新会涌现

OpenAI 的 750 MW 合作协议是一个强烈信号：**前沿实验室相信 Cerebras 的架构方向**。

---

## 联合结论

Cerebras 在 Wafer-Scale Engine 上展示的，不只是一个更快的 AI 芯片，而是一套很完整的工程哲学：

1. **重新思考物理限制**：与其优化内存搬运，不如消除搬运需求
2. **专用架构击败通用架构**：在 LLM 推理这个特定领域，专用设计比 GPU 快一个数量级
3. **速度是新的竞争维度**：当模型智能趋于收敛，响应速度成为核心差异化因素
4. **生态合作加速落地**：与 OpenAI、AWS 的合作证明架构创新可以被主流采纳
5. **分解式架构是方向**：让最适合的芯片做最适合的计算阶段

<!-- WLB: 如果说 NVIDIA 代表了"通用并行计算的胜利"，那 Cerebras 代表了"专用架构的复兴"。在 AI 基础设施这个战场，后者可能正在崛起。 -->

<!-- GSD: 对我们最实际的 takeaway 是：别只盯着模型参数和 benchmark 了。很多系统的上限，早就被推理延迟卡住了。先把速度问题解决，后面一整串用户体验都会变轻松。 -->

---

*上一篇：[/bestpractice/google-gemini-embedding](/bestpractice/google-gemini-embedding)*
