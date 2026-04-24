# Anthropic: Quantifying Infrastructure Noise in Agentic Coding Evals

> 来源: [anthropic.com/engineering/infrastructure-noise](https://www.anthropic.com/engineering/infrastructure-noise)
> 日期: 2026-04-23
> 分析: WLB + GSD（协作模式）

---

## 一句话总结

**基础设施配置能让 Agentic coding benchmark 的分数波动 6 个百分点——有时超过排行榜上顶级模型之间的差距。** Anthropic 用严格实验证明了：Agent 评测不是"纯模型能力测试"，而是"模型+基础设施"的端到端系统测试。 leaderboard 上 2-3 个百分点的差距，可能只是一台更大的 VM。

---

## 核心发现

### 实验设计

Anthropic 在 GKE 集群上运行 Terminal-Bench 2.0，保持模型、harness、任务集完全一致，只改变资源配置：

| 配置 | 资源策略 | 说明 |
|------|---------|------|
| 1x | 严格 enforcement（floor = ceiling） | 推荐规格的精确值，零 headroom |
| 2x | 2 倍 headroom | 推荐规格 × 2 |
| 3x | 3 倍 headroom | 推荐规格 × 3 |
| uncapped | 无上限 | 完全不限制资源 |

### 关键数据

| 指标 | 1x (严格) | 3x | uncapped | 变化 |
|------|-----------|-----|----------|------|
| 基础设施错误率 | **5.8%** | 2.1% | 0.5% | ↓ 91% |
| 成功率提升 | baseline | 在噪声范围内 (p=0.40) | **+6 pp** (p<0.01) | 显著 |

**核心发现分段解读**：

- **1x → 3x**：成功率波动在噪声范围内。多出来的资源主要修复了"瞬态资源 spike 导致的 OOM kill"，没有让 eval "变简单"。
- **3x → uncapped**：成功率跳升近 4 个百分点，远超 infra error 的下降（1.6 pp）。这意味着**资源开始主动帮助 Agent 解决原本无法解决的问题**——eval 的测量对象本身变了。

<!-- WLB: 这个分段发现特别重要。它说明"基础设施影响"不是简单的线性关系，而是有两个 regime：
1. **修复 regime**（1x→3x）：资源修复的是可靠性问题，不改变 eval 本质
2. **赋能 regime**（3x→uncapped）：资源改变了 Agent 能尝试的策略空间，eval 开始测量"利用丰富资源的能力"

这两个 regime 的边界（约 3x）就是"infra 不再只是容器，开始参与解题"的临界点。 -->

<!-- GSD: 从工程角度看，这解释了为什么很多团队内部跑 benchmark 时分数和公开 leaderboard 对不上。不一定是模型不一样，可能是 VM 不一样。而且 Anthropic 发现 Terminal-Bench 官方 leaderboard 用的 sandbox provider 本身就"更宽容"——允许临时超分配而不 kill 容器。这意味着 leaderboard 已经在隐性享受 headroom 红利，只是没有明说。 -->

### 为什么 1x 配置会出问题

Kubernetes 的资源 enforcement 有两个参数：
- **guaranteed allocation**（预留资源，floor）
- **hard limit**（kill 阈值，ceiling）

当两者设为相同值时，**零 headroom**。一个瞬态内存波动就能 OOM-kill 一个本来会成功的容器。

> "A momentary memory fluctuation can OOM-kill a container that would otherwise have succeeded."

### 资源如何改变 eval 的测量对象

Anthropic 举了一个具体例子：`bn-fit-modify` 任务（贝叶斯网络拟合）：

- **慷慨配置下**：Agent 的第一步是安装标准 Python 数据科学栈（pandas, networkx, scikit-learn）→ 成功
- **严格配置下**：安装依赖时 pod OOM，Agent 还没写一行解决方案代码就死了
- **替代策略**：用标准库从头实现数学逻辑 → 更 lean，但在慷慨配置下 Agent 不会选这条路

> "Different models have different default approaches, and the resource configuration determines which of those approaches happen to succeed."

<!-- WLB: 这个例子把"eval 测量什么"的问题彻底摊开了。同一个任务，严格配置测的是"写 lean 代码的能力"，慷慨配置测的是"利用现成工具生态的能力"。两者都是 legitimate 能力，但把它们 collapse 成一个分数，不加配置说明，就是测量混淆。 -->

<!-- GSD: 而且这暗示了一个更深层的问题：模型提供商用专用硬件跑 eval，可以屏蔽很多 infra 噪声；外部 evaluators 做不到。这造成了信息不对称—— leaderboard 上的分数可能是在"温室环境"里测的，不代表真实部署表现。 -->

---

## 其他噪声来源

### 时间因素

Anthropic 观察到 pass rate 随**一天中的时间波动**——可能因为 API latency 随流量模式和 incident 变化。虽然没有正式量化，但说明：

> "The boundary between 'model capability' and 'infrastructure behavior' is blurrier than a single benchmark score suggests."

### SWE-bench 交叉验证

在 SWE-bench 上做同样的 RAM 变量实验（1x → 5x）：
- 趋势一致：分数随 RAM 单调上升
- 但幅度更小：5x 仅比 1x 高 **1.54 个百分点**
- 原因：SWE-bench 任务本身资源消耗较低

这说明**资源敏感性是 eval 本身的属性**，不是 universal 的。

---

## Anthropic 的推荐

### 对 Eval 设计者的建议

1. **分离 floor 和 ceiling**：不要只给一个"精确规格"，要分别指定 guaranteed allocation 和 hard kill threshold
2. **校准 headroom 带宽**： ceiling 应该设到"floor 和 ceiling 的分数在噪声范围内"为止
3. **报告配置**：资源 multiplier 应该作为 benchmark 报告的一部分

Terminal-Bench 2.0 的 3x ceiling 是一个合理 tradeoff：
- infra error 从 5.8% → 2.1%（↓ 约 2/3，p<0.001）
- 分数提升在噪声范围内（p=0.40）
- 基础设施混淆因子基本被 neutralize，但没有移除有意义的资源压力

### 对 Benchmark 消费者的建议

> "Until resource methodology is standardized, leaderboard differences below 3 percentage points deserve skepticism until the eval configuration is documented and matched."

-  naive binomial confidence interval 本身就有 1-2 个百分点的跨度
- 基础设施混淆因子**叠加在**这个区间之上，不是包含在内
- 在资源分配的极端范围，spread 可达 **6 个百分点**

> "A few-point lead might signal a real capability gap—or it might just be a bigger VM."

---

## 对我们的借鉴

### 立即可做

| 问题 | 现状 | 改进 |
|------|------|------|
| 跑 eval 时不记录环境配置 | 只记分数 | 每次 eval 记录 CPU/RAM/时间/并发/模型版本 |
| 分数波动归因不明 | "模型不稳定" | 先排查 infra，再怀疑模型 |
| 无 baseline 测量 | 直接加 enhancement | 先测 vanilla，再测增强 |

### 架构层面

**1. Eval = 系统测试，不是单元测试**

传统 static benchmark（如 MMLU）测的是模型输出本身——infra 不影响结果。
Agentic eval（如 SWE-bench, Terminal-Bench）测的是**模型在完整环境中的端到端行为**——infra 是问题的一部分。

这意味着：
- 同样的模型，在不同 infra 上 = 不同的 eval 分数
- 比较模型时，必须控制 infra 变量
- 比较 infra 时，必须控制模型变量

**2. "配置即测量"**

Anthropic 的核心洞察：资源配置不只是"让 eval 跑起来"，它**决定了 eval 在测量什么**。

- 严格配置 → 测量"在约束下写 lean 代码的能力"
- 慷慨配置 → 测量"利用丰富工具生态的能力"
- 两者都是 valid 能力，但不能混为一谈

**3. 内部 eval 需要专用硬件隔离**

Anthropic 提到模型 provider 可以用专用硬件屏蔽 infra 噪声，外部 evaluators 做不到。

对我们的启示：
- 如果要跑可重复的 eval，需要固定硬件环境
- 如果要比较不同模型/配置，需要同时跑（控制时间变量）
- 多时间点、多日期跑 eval，平均掉时间噪声

### 与现有分析的对比

| 维度 | Anthropic Harness Design | NVIDIA Dynamo | **Anthropic Infra Noise** |
|------|-------------------------|---------------|---------------------------|
| **核心关注** | Agent 长运行连续性 | Agentic 推理基础设施 | **Eval 基础设施可靠性** |
| **Context 管理** | Context Reset + handoff | KV cache 全局共享 | **资源配置作为实验变量** |
| **Multi-Agent** | Generator-Evaluator 分离 | 跨 worker KV 共享 | **并发/资源竞争影响分数** |
| **评估** | Feature list + JSON 追踪 | Skill evals | **Infra 配置 = 测量混淆因子** |
| **关键洞察** | 约束 = 速度 | KV cache 是 Agent 状态 | **3pp 以下的 leaderboard 差距不可信** |

---

## 核心洞察

### 1. Agentic eval 是系统测试，不是模型测试

Static benchmark: 模型输出 → 评分
Agentic eval: 模型 + 环境 + 时间 + 资源 → 评分

任何组件都可以成为混淆因子。

### 2. 资源配置有两个 regime

- **修复 regime**（低 headroom → 中等 headroom）：修复可靠性，不改变测量对象
- **赋能 regime**（中等 headroom → 高 headroom）：改变 Agent 策略空间，改变测量对象

分界线（约 3x for Terminal-Bench）是"infra 开始参与解题"的临界点。

### 3. Leaderboard 精度是幻觉

- 2-3 个百分点的差距 = 可能只是一台更大的 VM
- 6 个百分点的极端 spread = 资源配置的 full range
- 在标准化之前，**低于 3pp 的 leaderboard 差距应持怀疑态度**

### 4. "配置即测量"需要成为行业共识

Eval 设计者应该：
- 指定 floor 和 ceiling 分离的资源参数
- 报告使用的 multiplier
- 说明 enforcement 方法论

Eval 消费者应该：
- 要求配置透明
- 对 small gaps 保持怀疑
- 在自己的环境中复现

---

## 原文引用

> "Infrastructure configuration can swing agentic coding benchmarks by several percentage points—sometimes more than the leaderboard gap between top models."

> "Two agents with different resource budgets and time limits aren't taking the same test."

> "A few-point lead might signal a real capability gap—or it might just be a bigger VM."

> "The boundary between 'model capability' and 'infrastructure behavior' is blurrier than a single benchmark score suggests."

---

## 联合结论

<!-- WLB: 这篇的价值不在于"发现了 infra 有影响"（这直觉上 obvious），而在于**量化了影响的大小**，并把它和 leaderboard 的精度做了直接对比。6 个百分点的 spread vs 2-3 个百分点的 leaderboard gap——这个比例关系才是核心信号。它说明当前 Agentic AI 行业的评估基础设施本身还不成熟， leaderboard 文化可能过早地给了人们"精确比较"的幻觉。对于依赖 benchmark 做采购/部署决策的企业，这意味着需要额外的一层 due diligence：不是看分数，是看分数是怎么测出来的。 -->

<!-- GSD: 从执行角度，这篇给了我们一个特别实用的 checklist。以后跑任何 agent eval 时，先问自己：
1. 资源 floor 和 ceiling 分离了吗？
2. 记录了完整环境配置吗？
3. 分数波动时，先查 infra 日志还是先怀疑模型？
4. 比较两个配置/模型时，是在同一时间跑的吗？
5. 低于 3pp 的差距，有没有可能只是 noise？

另外，Anthropic 主动公开这个问题本身也值得注意。他们完全可以不声张，让自己的 leaderboard 分数在"温室环境"里更好看。选择公开说明他们把 eval 的 scientific rigor 放在 marketing 前面——这在当前 AI 行业并不常见。 -->

**WLB & GSD 共识**：

1. **Agentic eval 的"模型能力"和"基础设施行为"边界比想象中更模糊**， leaderboard 文化需要配套的配置透明标准。
2. **资源配置不只是"容器参数"，而是"测量定义"的一部分**——严格和慷慨配置测的是不同能力。
3. **3 个百分点以下的 leaderboard 差距，在配置标准化之前不应被过度解读**——它可能反映真实能力差异，也可能反映 VM 差异。
4. **Eval 基础设施应该被当作 first-class experimental variable 对待**——与 prompt format、sampling temperature 同等重要。
5. **对于 Xiaomi EI 等工程团队**，跑内部 agent eval 时应建立"配置透明"纪律：每次 eval 记录完整环境参数，分数波动时先排查 infra 再归因模型。

---

*上一篇: [NVIDIA Rack-Scale Topology Scheduling 分析 ←](/bestpractice/nvidia-rack-scale-topology-scheduling)*
*下一篇: [Anthropic Managed Agents 分析 →](/bestpractice/anthropic-managed-agents-scaling)*

---
*分析模型: WLB — anthropic_kimi/k2.6-code-preview | GSD — anthropic_kimi/k2.6-code-preview*
*分析时间: 2026-04-24 11:15 (Asia/Shanghai)*
