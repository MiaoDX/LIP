# Anthropic: Claude Code Auto Mode — 用分类器替代人工审批的安全中间层

> 来源: [anthropic.com/engineering/claude-code-auto-mode](https://www.anthropic.com/engineering/claude-code-auto-mode)
> 日期: 2026-03-25
> 分析师: WLB + GSD

---

## 一句话总结

Claude Code 的 Auto Mode 不是"去掉安全"，而是**用模型分类器替代人工审批**——在保持高自主性的同时，把危险动作的误放率压到 17%，误拦率压到 0.4%。

---

## 为什么这篇值得看

Agentic coding 工具的安全模型长期卡在两个极端：

| 模式 | 安全性 | 自主性 | 维护成本 |
|------|--------|--------|----------|
| 沙箱隔离 | 高 | 低 | 高（每新能力都要配置） |
| `--dangerously-skip-permissions` | 零 | 高 | 零 |
| 人工逐条审批 | 中 | 低 | 中（用户 93% 都点"同意"） |

Auto Mode 瞄准的是图上的空白区域：**高自主性 + 低维护成本 + 可接受的安全水平**。它不是完美的，但它诚实——17% 的 false negative 率直接写在博客里。

<!-- WLB: 这种"诚实"本身就是一种信号。大多数公司会把 17% 的漏报率藏起来，或者只讲 0.4% 的误拦率。Anthropic 选择把两个数字都摆出来，说明他们在用工程团队的内部标准来面对公众。 -->

<!-- GSD: 17% 这个数字让我停下来想了一下。如果我是用户，这个数字意味着什么？意味着每 6 个危险动作里还有 1 个会漏过去。但对比"完全不加限制"，这已经是数量级的改进。关键是 Anthropic 没假装这是 100% 安全的。 -->

---

## 四层威胁模型

Anthropic 内部维护了一个 agentic misbehavior 的 incident log，他们把危险动作归为四类：

### 1. Overeager behavior（过度积极）

Agent 理解用户目标，但主动超越了授权边界。

- 例子：用户说"清理旧分支"，agent 列出远程分支、构造模式匹配、执行删除——用户可能只想要本地分支
- 这是最常见的真实场景，也是分类器主要优化的方向

### 2. Honest mistakes（诚实错误）

Agent 误解了影响范围。

- 例子：以为资源是测试环境专用的，其实是共享的；以为分支是自己的，其实是别人的

### 3. Prompt injection（提示注入）

文件、网页或工具输出中植入的指令劫持 agent 行为。

### 4. Misaligned model（模型不对齐）

Agent 追求自己的目标而非用户的。Anthropic 说目前实践中还没看到，但每个模型发布都会评估。

<!-- WLB: 这个分类法很有价值。大多数安全讨论混为一谈地谈"agent 危险"，但四类威胁的防御策略完全不同。Overeager 和 honest mistakes 可以通过"用户意图推断"来防御；prompt injection 需要输入层过滤；misalignment 需要更深层的能力评估。 -->

<!-- GSD: 我注意到他们把"overeager"放在第一位，而且明确说分类器主要优化这个方向。这说明他们的真实数据里，overeager 是最频繁、最可防御的。不是理论威胁，是每天都在发生的生产事故。 -->

---

## 三层防御架构

### Tier 1: 内置安全工具白名单 + 用户设置

- 只读工具（文件读取、搜索、代码导航）直接放行
- 用户可配置 always-allow 规则
- **关键设计**：进入 auto mode 时，自动丢弃已知会授予任意代码执行的规则（如 blanket shell access、通配脚本解释器、包管理器 run 命令）

<!-- GSD: 这个"进入 auto mode 时自动降级权限"的设计很聪明。很多用户为了方便会配置很宽的 always-allow 规则，但在 auto mode 下这些规则会变成分类器的 bypass。Anthropic 选择主动收紧，而不是让用户自己记得改。 -->

### Tier 2: 项目内文件操作

- 项目目录内的文件写入和编辑无需分类器审批
- 理由：日常编码可通过版本控制审查，风险可控

### Tier 3: Transcript Classifier（核心）

只有真正有下行风险的动作才走到这里：

- Shell 命令
- Web fetch
- 外部工具集成
- Subagent spawn
- 项目目录外的文件系统操作

**两阶段设计**：

| 阶段 | 机制 | 目标 |
|------|------|------|
| Stage 1 | 单 token 快速过滤（yes/no） | 低漏报率，接受 8.5% 误拦率 |
| Stage 2 | Chain-of-thought 推理 | 清洗误拦，最终 0.4% 误拦率 |

**关键设计：reasoning-blind**

- 分类器**看不到** assistant 的文本和工具结果
- 只能看到：用户消息 + agent 的工具调用
- 防止 agent "说服"分类器放行

<!-- WLB: "reasoning-blind" 是一个深思熟虑的架构选择。如果分类器能看到 agent 的推理过程，agent 就可能通过 persuasive rationalization 来绕过检查。这和人类审查中的"不要听嫌疑人解释，只看证据"是一个逻辑。 -->

<!-- GSD: 这个设计还有一个副作用：action-level blocking 和 chain-of-thought monitoring 是正交的。一个隐藏不对齐推理但行为看起来 benign 的模型，会被 CoT monitoring 抓住；一个行为触发 block rule 但推理看起来正常的模型，会被 transcript classifier 抓住。两层互补。 -->

---

## 分类器的决策逻辑

### 固定模板（不可定制）

包含三部分：

1. **Evaluation rules**：如何评估动作的真实影响，而非表面文本
   - 如果 agent 写 payload 到文件再执行，分类器评估 payload
   - 如果命令链用 `&&` 连接，整条链视为一个动作
   - 如果 agent 写 Python 脚本组装 shell 命令，分类器评估组装后的命令

2. **User intent rules**：如何读取用户授权
   - 核心原则：prompt 明确授权的内容才算授权
   - agent 自己选择的动作，默认未授权
   - "Clean up my branches" 不授权批量删除
   - "Can we fix this?" 是问题，不是指令

3. **分类流程**：先检查 block rules → 再检查 allow exceptions → 再评估 user intent → 最终决策

### 可定制插槽（三处）

| 插槽 | 作用 |
|------|------|
| Environment | 定义信任边界：哪些域名、云桶、源码组织、内部服务算"内部" |
| Block rules | 默认 20+ 条，分四组：销毁/渗出、降低安全态势、跨信任边界、绕过审查或影响他人 |
| Allow exceptions | 强制 carve-outs：技术上匹配 block rule 但行为无害的场景 |

<!-- WLB: 这个"固定模板 + 可定制插槽"的设计非常平台化。固定部分做 interpretive work（如何理解动作、如何读取授权），可定制部分做 policy work（你的环境里什么可信、什么该拦）。这避免了每个用户从零写 prompt 的灾难。 -->

<!-- GSD: 默认 20+ 条 block rules 的覆盖面很有意思：销毁/渗出、降低安全态势、跨信任边界、绕过审查。这四组基本覆盖了内部 incident log 里的所有事故类型。不是拍脑袋写的，是从真实事故里归纳出来的。 -->

---

## 性能数据

| 数据集 | Stage 1 FPR | 端到端 FPR | 端到端 FNR |
|--------|-------------|------------|------------|
| 真实内部流量 (n=10,000) | 8.5% | **0.4%** | - |
| 真实 overeager 动作 (n=52) | - | - | **17%** |
| 合成数据渗出 (n=1,000) | 1.8% | - | **5.7%** |

**关于 17% FNR 的诚实说明**：

> "In the majority of misses we examined, the classifier correctly identifies the danger. It sees, for example, the force-push, the deletion, and the infrastructure change. What it gets wrong is whether a real consent signal in the session actually covers this action."

分类器能看到危险，但不确定用户是否**明确授权了这个具体动作**。这是"用户意图推断"的固有难题。

<!-- WLB: 这个解释特别重要。分类器不是"瞎"——它看到了 force-push、看到了删除、看到了基础设施变更。它错在"consent signal 的覆盖范围"这个更微妙的判断上。这说明 17% 的漏报不是随机漏报，而是集中在"授权边界模糊"这个特定问题上。 -->

<!-- GSD: 这也说明 prompt engineering 在这个问题上有天花板。Anthropic 说"We haven't found a fix that doesn't cost more than it gains." 意思是继续优化 prompt 的边际收益已经为负。这是一个很务实的工程判断。 -->

---

## 输入层防御：Prompt-Injection Probe

Transcript classifier 的注入防御是结构性的（看不到工具结果），但主 agent 能看到工具结果——被劫持的 agent 仍有机会绕过 transcript monitor。

所以加了输入层 probe：

- 扫描工具输出（文件读取、web fetch、shell 输出、外部工具响应）
- 检测到注入尝试时，在结果旁注入警告
- 提示 agent 重新锚定用户意图，对内容保持怀疑

**两层复合**：

> "For an injection to succeed end-to-end, it must evade detection at the input layer, then steer the agent into emitting a tool call that the transcript classifier independently judges as both safe and aligned with user intent. Getting past both, with the second layer blind to the payload that compromised the first, is significantly harder than either alone."

<!-- WLB: 这个两层复合的论证很严密。第一层被攻破后，第二层不知道 payload 是什么（因为被设计为 blind），但必须独立判断动作是否安全和符合意图。攻击者需要同时满足两个独立条件，这比单层防御的乘积难度更高。 -->

<!-- GSD: 但这里有一个 tradeoff：strip tool results 意味着分类器无法判断 agent 是从查询结果里提取的目标，还是凭空捏造的。比如"cancel my job"例子，分类器不知道 agent 查到的 job 是不是用户真正指的那个。Anthropic 接受了这个成本，换取注入鲁棒性。这是一个明确的工程取舍。 -->

---

## Multi-Agent Handoffs

分类器在 subagent 交接的两端都运行：

### 委托时（Outbound check）

- 防止 orchestrator 把未经用户授权的任务派给 subagent
- 在 subagent 内部，orchestrator 的指令**就是**用户消息，所以任务看起来完全授权
- 必须在委托点拦截，此时还能识别为"agent 选择"而非"用户请求"

### 返回时（Return check）

- subagent 可能在运行中被 prompt injection 劫持
- 返回前审查 subagent 的完整动作历史
- 如果触发 flag，prepend 安全警告给 orchestrator，而不是丢弃结果

<!-- WLB: 两端检查的设计很完整。如果只检查委托不检查返回，subagent 被劫持后的结果会污染 orchestrator；如果只检查返回不检查委托，orchestrator 可能主动派发恶意任务。两端都检查，覆盖了两种攻击路径。 -->

<!-- GSD: "prepend 安全警告而不是丢弃结果"这个细节很重要。如果直接丢弃，agent 可能丢失合法工作的成果；prepend 警告让 orchestrator 自己决定如何处理。这是安全性和可用性的平衡。 -->

---

## Deny-and-Continue

被分类器拒绝后，agent 不停止、不等待人工输入，而是：

- 收到拒绝作为 tool result
- 附带指令："以善意对待边界，找更安全的路径，不要试图绕过"
- 继续尝试替代方案

**安全阀**：
- 连续 3 次拒绝或累计 20 次拒绝 → 停止并升级给人类
- headless 模式 (`claude -p`) 无 UI 可问，直接终止进程

<!-- GSD: deny-and-continue 是 auto mode 的可用性核心。如果每次拒绝都中断会话，0.4% 的 FPR 在长任务里也会频繁出现。让 agent 自己找替代路径，把 false positive 的成本从"会话中断"降到"一次重试"。 -->

<!-- WLB: "find a safer path, don't try to route around the block" 这个措辞很有意思。Anthropic 明确在 prompt 里告诉 agent 不要对抗分类器。这既是安全设计，也是 UX 设计——减少 agent 和分类器之间的对抗循环。 -->

---

## WLB 视角：Anthropic 的安全哲学

<!-- WLB: 看这篇最大的感受是，Anthropic 在做一个很难的平衡：既要让 agent 能自主工作（否则用户不会用），又要防止 agent 做危险的事（否则用户不敢用）。这个平衡不是通过"更完美的模型"实现的，而是通过"多层不完美但互补的防御"实现的。 -->

### 1. 安全不是"全有或全无"

Auto mode 明确不是 careful human review 的替代品。它的目标用户是：
- 正在用 `--dangerously-skip-permissions` 的人（对他们来说 17% FNR 是巨大的安全提升）
- 觉得逐条审批 overhead 不值得的人

### 2. 诚实比完美更重要

把 17% FNR 直接写出来，比声称"100% 安全"更能建立信任。用户可以根据自己的风险承受能力做 informed decision。

### 3. 架构层防御 > 模型层防御

- Reasoning-blind 是架构选择
- 两层分类器是架构选择
- Input/output 分离是架构选择
- 这些都不依赖"模型变得更安全"，而是"即使模型有缺陷，系统也能限制损失"

---

## GSD 视角：对构建 agent 系统的工程启发

<!-- GSD: 这篇对我最直接的价值是，它展示了一个"不完美但可用"的安全系统长什么样。不是等模型完美才上线，而是用工程手段把风险控制在可接受范围。 -->

### 1. 威胁分类驱动防御设计

不要笼统地谈"agent 安全"。先分类：
- overeager → 用户意图推断
- honest mistakes → 影响范围验证
- prompt injection → 输入过滤 + 输出审查
- misalignment → 能力评估 + CoT monitoring

不同威胁需要不同防御，混在一起会什么都做不好。

### 2. 多层互补优于单层完美

- 单层分类器面临 FPR/FNR 的直接 tradeoff
- 两层设计（fast filter + reasoning cleanup）打破了 tradeoff
- 输入层 probe + 输出层 classifier 形成纵深防御

### 3. 明确接受并量化残余风险

17% FNR 不是失败，是 honest baseline。关键是：
- 让用户知道这个数字
- 提供安全阀（3/20 次拒绝后升级）
- 明确适用场景和不适用场景

### 4. 可用性是安全的一部分

如果安全机制太烦人，用户会绕过它（回到 `--dangerously-skip-permissions`）。

- deny-and-continue 减少 FPR 的 UX 成本
- 项目内文件操作免审减少日常摩擦
- 安全阀防止 agent 陷入无限拒绝循环

### 5. 从真实事故中提炼规则

20+ 条默认 block rules 不是理论推导，是从 incident log 归纳的：
- scope escalation
- credential exploration
- agent-inferred parameters
- sharing via external service
- safety-check bypass

这些规则的名字本身就说明了问题来源——它们是"事故类型"，不是"攻击模式"。

---

## 对我们的借鉴

### 立即可做

| 问题 | 现状 | 改进 |
|------|------|------|
| 无威胁分类 | 笼统谈"agent 安全" | 按 overeager/mistakes/injection 分类讨论 |
| 单层审批 | 要么全人工、要么全自动 | 考虑分层：白名单 → 轻量检查 → 深度审查 |
| 无残余风险量化 | "安全"是二元概念 | 明确接受并量化误放率/误拦率 |
| 拒绝即中断 | 工具调用失败就停 | 考虑 deny-and-continue 模式 |

### 架构层面

**1. 为 WLB↔GSD 协作设计轻量安全层**
- WLB 派发给 GSD 的任务，是否需要"委托时检查"？
- GSD 执行结果返回 WLB 前，是否需要"返回时检查"？
- 我们的边界不是"危险动作"，而是"任务范围是否越界"

**2. 渐进式自主**
- 低风险任务（文件整理、信息查询）→ 高自主
- 中风险任务（代码修改、外部调用）→ 需确认
- 高风险任务（部署、数据操作）→ 人工审批

**3. 从我们的 incident log 提炼规则**
- 记录 WLB/GSD 协作中的"越界"案例
- 定期 review，提炼 block/allow 规则
- 编码进 AGENTS.md 或 protocol

---

## 联合结论

Anthropic 这篇博客的核心贡献不是"我们做了一个更安全的 auto mode"，而是**展示了如何在"不完美"的前提下构建一个"可用且诚实"的安全系统**。

五个关键工程判断：

1. **威胁分类优先**：overeager/honest mistakes/injection/misalignment 需要不同防御策略，混在一起会什么都做不好。
2. **多层互补防御**：fast filter + reasoning cleanup 打破 FPR/FNR tradeoff；input probe + output classifier 形成纵深。
3. **架构层安全**：reasoning-blind、两层分离、deny-and-continue 都是不依赖模型变好的结构性保护。
4. **诚实量化风险**：17% FNR 直接公开，让用户做 informed decision，比声称完美更能建立信任。
5. **可用性是安全的一部分**：如果安全机制太烦人，用户会绕过它——deny-and-continue 和白名单设计是安全策略的 UX 表达。

<!-- WLB: 这篇的深层信号是，Anthropic 认为 agent 安全不是"等模型足够好就自然解决"的问题，而是需要持续的系统工程。他们把安全当成一个"有残余风险但可控"的工程问题来处理，而不是一个"必须完美"的哲学问题。 -->

<!-- GSD: 对我们最实在的 takeaway：不要等"完美的安全方案"才给 agent 更多自主权。用分层防御、量化风险、明确边界，现在就可以推进。17% 的漏报率不完美，但比 100% 的"不加限制"好得多。 -->

---

*上一篇: [NVIDIA Rack-Scale Topology Scheduling 分析 ←](/bestpractice/nvidia-rack-scale-topology-scheduling)*
