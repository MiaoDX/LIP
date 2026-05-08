# Research 03:Skill / Context 之外的工程维度评估

> 本文件是为 lecture 准备过程中的第三轮 deep research 输出。
> 目的:把 harness engineering 拆成多个互相正交的子视角,让 lecture 能从多个维度交叉讲。
> Skill 和 Context 已确定,需要再找 1-2 个最强的维度。
> **最终选定:Skill + Context + Verification 三轴。**

## 已确定的两个维度(作为评估对照标准)

**视角 1:Skill 视角**——把可复用的工程动作封装成可调用单元
- 演进模式:from all-loaded → on-demand loaded
- 代表实践:Claude Code Skills (2.0.20, 2025-10-16)、mattpocock/skills、obra/superpowers、GSD、gstack
- MCP 工具的演进也归在这里:最初 MCP server 工具全部存在 context 里,后来 Claude Code 和 Codex 都对大 skill / 大 tool 做自动截断(按需加载)

**视角 2:Context 视角**——把进入 model 的 token 集做工程化
- 演进模式:from passive transcript buffer → actively managed (paging, indexing, truncating)
- 代表实践:CLAUDE.md @import、subagent 隔离 context window、claude-progress.txt 模式、auto compact、Routines fresh context、context summarization middleware
- 关键官方源:
  - Anthropic *Effective context engineering for AI agents*("context is finite resource, find smallest set of high-signal tokens"):https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  - HumanLayer "harness engineering is a subset of context engineering"
  - Chroma context rot research("models perform worse at longer context lengths")
  - Anthropic "Effective harnesses for long-running agents"(claude-progress.txt 模式)

---

## 候选 A:Feedback / Verification(agent 怎么知道自己干对了)

**结论:强烈推荐,作为第三个独立维度。**
单句理由:从 Boris 的 "verification 2-3x" 到 Anthropic Outcomes 的 rubric+独立 grader,再到 Codex /goal 的强制 audit,这是 2026 上半年被 bake 进产品最清晰、最新的一条独立工程主线。

### 五条标准评估
1. **正交性**:与 Skill 和 Context 都是真正交。Skill 决定"agent 调什么",Context 决定"agent 看什么",Verification 决定"agent 凭什么宣告 done"——它管的是 *exit condition* 与 *quality gate*,不是 input。Anthropic 在 Outcomes 文档里把它和 context engineering 明确区分("separation of concerns",grader 在 *独立* context window 里运行)。
2. **演进证据**:极清晰的"from manual → in-loop → externalized grader"三段式:
   - **Stage 1(2026-01)**:human review,Boris 反复强调 "give Claude a way to verify its work, 2-3x quality"(Threads, 2026-01-02)。
   - **Stage 2(2026-03)**:Anthropic harness-design 文章正式提出 GAN 启发的 *Planner-Generator-Evaluator* 三角色架构,明确"agents reliably skew positive when grading their own work",所以 evaluator 必须独立。
   - **Stage 3(2026-04-30)**:Codex 0.128.0 把 audit 从 prompt 模式硬编码成 runtime——`continuation.md` 强制 agent "perform a completion audit against the actual current state … treat uncertainty as not achieved",并在 `update_goal(status=complete)` 之前阻塞。
   - **Stage 4(2026-05-06)**:Anthropic Outcomes 在 Code with Claude 上以 *public beta* 形式落地:用户写 rubric,独立 grader agent 在自己的 context window 评分,agent 反复 iterate;Anthropic 内部基准 +10pp,docx +8.4%、pptx +10.1%。
3. **官方一手源**:充分。
   - Anthropic Engineering, *Harness design for long-running application development*:https://www.anthropic.com/engineering/harness-design-long-running-apps(planner-generator-evaluator,自评 bias 研究)
   - Anthropic, *New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration* 公告
   - VentureBeat 对 Outcomes 的架构解读引用了 Anthropic 工程师 Albert:"you will get higher success if you give that output to a fresh Claude … there is still something to the attention that degrades":https://venturebeat.com/technology/anthropic-introduces-dreaming-a-system-that-lets-ai-agents-learn-from-their-own-mistakes
   - OpenAI Codex `continuation.md` 模板原文:https://github.com/openai/codex/blob/6014b6679ffbd92eeddffa3ad7b4402be6a7fefe/codex-rs/core/templates/goals/continuation.md
   - Boris Cherny on Threads(2026-01-02 与 2026-04-16):"give Claude a way to verify its work … 2-3x":https://www.threads.com/@boris_cherny/post/DXM_AWzj7XL/give-claude-a-way-to-verify-its-work
4. **跨平台对照**:极强。Anthropic = Outcomes + GAN harness;OpenAI = `/goal` 的 continuation audit + `guardian_approval` sub-agent;这两套设计虽然 framing 不同(rubric vs. checklist),骨架完全一致:*独立的、读取真实 artifact 的 evaluator*。这给 lecture 副线一个极好的对照点:Anthropic 把 verification 做成 *声明式*(rubric),OpenAI 做成 *程序式*(prompt-to-artifact checklist)。
5. **Lecture 价值**:直接强化论点。手写 verifier → 三角色 harness → managed Outcomes 是教科书级的"工程化加重 + 被 bake 进产品"双重运动。它也是少数 Anthropic 用 *public beta* 而不是 research preview 上线的,说明已收敛到 production-grade。

### 时间轴关键节点
| 日期 | 事件 |
|---|---|
| 2026-01-02 | Boris Cherny Threads 长贴:"verification 2-3x" |
| 2026-03(前后) | Anthropic *Harness design for long-running application development* 发布(GAN-inspired Planner-Generator-Evaluator) |
| 2026-04-30 | Codex 0.128.0 上线 `/goal` + `continuation.md` 强制 completion audit |
| 2026-05-06 | Anthropic Outcomes 进入 public beta(rubric + 独立 grader webhook) |

### Lecture 位置建议
**与 Skill / Context 平级**,作为第三主轴。建议作为讲座"工程化最强加重"的高潮段——因为这是 2026 上半年唯一一个 *Anthropic 直接用一篇专门工程博客 + 一个 GA-track product surface 来命名的* 维度。

---

## 候选 B:Permission / Trust / Autonomy boundary(agent 在什么边界内能自治)

**结论:强烈推荐,作为第四个独立维度(如果 lecture 选 4 维)。**
单句理由:Anthropic 在 2026-03 用一篇专门的 engineering blog(*Claude Code auto mode: a safer way to skip permissions*)把它命名为独立子系统,并且 Codex 的 `sandbox_mode × approval_policy` 二维矩阵给出了一个干净的对照。

> **最终决策**:lecture 不选这条。用户判断:推荐默认给 Claude Code 和 Codex 全部权限,模型不会乱来;permission 不必特别强调。该维度的内容可以并入 Tips Slide 1 简单提一句"给它们全部权限"。

### 五条标准评估
1. **正交性**:跟 Skill 完全正交(Skill 是能力、Permission 是 *能力允许在什么条件下触发*)。跟 Context 有一点边界模糊——auto mode 的 transcript classifier 确实只看 user message + tool call(context 切片),但这个维度的核心是 *决策协议*,不是 token 集本身。可以这样区分:Context 维度回答 "model 看到什么",Permission 维度回答 "model 准备执行的动作要不要 gate"。
2. **演进证据**:清晰的四段式:
   - **Stage 1(2025 起)**:每个 tool call 都问;用户用 `--dangerously-skip-permissions` 或 Codex `--yolo` 绕过。
   - **Stage 2(2025-Q4 / 2026-Q1)**:批量预授权——`acceptEdits` 模式、Codex `workspace-write`、permission allowlists。
   - **Stage 3(2026-02-15 前后)**:sandboxing 把决策从"问"变成"OS 级阻断"。Anthropic Claude Code `/sandbox`(Seatbelt + bubblewrap + socat),内部测试 prompt 减少 84%。
   - **Stage 4(2026-03-24)**:Auto mode 上线—— *classifier-based policy*。两层防御:
     - 输入层 prompt-injection probe 扫描 tool 输出;
     - 输出层 transcript classifier(Sonnet 4.6)做 single-token 快筛 + CoT 复审,*reasoning-blind by design*(只看 user message + tool call payload,剥掉 assistant prose 与 tool output,避免被 agent 自圆其说);
     - 子 agent 在 delegation 与 return 两端各跑一次 classifier;
     - 连续 3 次或累计 20 次被拒就 fallback 到人工审批。
3. **官方一手源**:极强。
   - Anthropic Engineering, *Claude Code auto mode: a safer way to skip permissions*:https://www.anthropic.com/engineering/claude-code-auto-mode (这是该维度最强的一手源,几乎给了一个完整设计文档)
   - Anthropic 产品博客 *Auto mode for Claude Code*:https://claude.com/blog/auto-mode
   - Claude Code 官方 docs *Choose a permission mode* 与 *Sandboxing*:https://code.claude.com/docs/en/permission-modes 与 https://code.claude.com/docs/en/sandboxing
   - OpenAI Developers, *Sandbox*:https://developers.openai.com/codex/concepts/sandboxing(`sandbox_mode = read-only / workspace-write / danger-full-access` 三档)
   - OpenAI Developers, *Agent approvals & security*:https://developers.openai.com/codex/agent-approvals-security(`approval_policy = untrusted / on-request / never`,加 `guardian_approval` 子 agent 委派审批)
4. **跨平台对照**:清晰但 *形态不同*——Anthropic 把 permission 抽象成 *动态 classifier*,OpenAI 把它抽象成 *静态二维矩阵 + 命名 profile*。这本身就是 lecture 副线值得讲的:Anthropic 选了 model-centric 设计(信任 Sonnet 来分类),OpenAI 选了 OS+config-centric 设计(信任 Seatbelt + TOML)。
5. **Lecture 价值**:很强。可以直接挂上"为什么 Cursor 在 2026-02 长跑实验里要写 JSON network policy + local HTTP proxy" "为什么 Routines 走 `claude/` 前缀分支隔离 + 没有 runtime 审批"这些细节。它也是论点 "工程化被 bake 进产品" 最干净的例证:用户什么都没写,Anthropic 把一整套两层 classifier+probe 作为产品默认行为塞进来了。

### 时间轴关键节点
| 日期 | 事件 |
|---|---|
| 2025-10 | Claude Code 原生 sandboxing(Seatbelt + bubblewrap),内部 -84% prompts |
| 2026-02-15 前后 | Cursor / Anthropic 在 sandbox 失败模式上各自迭代(Ona 报告 path-trick 绕过) |
| 2026-03-09 | Sophie Zhang 等媒体首次报道 Auto mode preview |
| 2026-03-24 | Auto mode 正式上线 Team plan,Anthropic Engineering blog 发表 |
| 2026-04 起 | Codex `permission profiles`、`guardian_approval` 子 agent、`requirements.toml` 管理员强制约束逐步上线 |
| 2026-04-30 | Codex 0.128.0 deprecate `--full-auto`,转向显式 permission profiles + trust flow |

---

## 候选 C:Memory / State / Knowledge persistence(agent 跨 session 怎么记得 / 学)

**结论:不推荐作为独立维度,建议作为 Context 维度的 *第三阶段*(distillation phase)讲。**
单句理由:CLAUDE.md / claude-progress.txt / memory store 全部是 Context 的子集;Dreaming 是 Context 维度的演进顶点("context engineering 的离线版本"),强行拆出来会让 Context 维度变薄。

### 五条标准评估
1. **正交性**:弱。HumanLayer 的 Dex Horthy 直接说过 "harness engineering is a subset of context engineering, everything the harness does ultimately shapes what ends up in the model's context window"。Anthropic 自己的 Managed Agents 文章把 memory 放在"long-horizon tasks often exceed the length of Claude's context window"这一节下,也明确把它当 *context 管理的延伸*。
2. **演进证据**:清晰但和 Context 演进基本重叠:
   - in-context(CLAUDE.md / AGENTS.md)→ external store(claude-progress.txt、Codex `~/.codex/memories/`、`raw_memories.md`)→ distillation(Dreaming)。
   - Codex Chronicle(2026-04-16,screen-capture-driven memory generation)和 Anthropic Dreaming(2026-05-06 research preview,"REM sleep" 离线 consolidation)几乎同时出现,说明这是 *Context 维度新涌现的子阶段*,不是新轴。
3. **官方一手源**:充分但都从属于 Context / Managed Agents 的官方框架。
4. **跨平台对照**:好(Dreaming ↔ Codex memories+Chronicle 几乎一一对应),但*正因为太对应,它不增加新维度*——把它放进 Context 维度反而能让对照更紧凑。
5. **Lecture 价值**:作为独立维度会 *稀释*——观众会问 "memory 跟 context engineering 不是一回事吗",而你确实没有强反驳。但作为 Context 维度的"第三阶段"非常加分:你可以把 Context 维度讲成 "passive transcript → actively managed → distilled across sessions",Dreaming 是 distilled 阶段最戏剧化的例子。

### 时间轴关键节点(并入 Context 讲)
| 日期 | 事件 |
|---|---|
| 2026-03-02 | Claude memory(chat history 全用户可用) |
| 2026-04-16 | Codex memory preview + Chronicle(macOS screen capture) |
| 2026-04-15 前后 | Codex CLI v0.106.0 引入 diff-based forgetting |
| 2026-05-06 | Anthropic Dreaming research preview + Managed Agents Memory public beta |

### Lecture 位置建议
**作为 Context 维度的最后一个时间节点讲,不另立维度。** 用一句话钉住:Dreaming 是 "context engineering 终于走到离线" 的标志。

---

## 候选 D:Orchestration / Topology(多 agent 怎么协作)

**结论:弱推荐——可推荐作为第 4 个维度,但有显著的"Skill+Context 复数化"嫌疑。如果 lecture 限制在 3 维,建议把 Cursor 与 Symphony 当 *Context 维度* 的"per-agent context 隔离"案例,而非独立维度。**

### 五条标准评估
1. **正交性**:中等偏弱。Cursor 自己的迭代叙事(Sanger 在 *Towards self-driving codebases* 里)几乎全部围绕"如何分配 context"和"agents shouldn't drift"——这两件事其实是 *Context engineering 的多体推广*:scratchpad freshness、单 agent 自动 summarize、judge-as-verifier,全是已有维度的复用。Anthropic Managed Agents 文章 *明确把 multi-agent 与 memory 并列* 作为 Managed Agents 三大特性之一,但它们共享同一套 "decouple brain from hands" 的抽象。
2. **演进证据**:演进路径非常清晰,反而是这条最强的支持:
   - Cursor 四代架构(来自 https://cursor.com/blog/self-driving-codebases):
     - Gen 1:单 agent 自协调;
     - Gen 2:Planner + Executor + Workers + 独立 Judge(被慢 worker 拖累,刚性过强);
     - Gen 3:Continuous executor(合并 planner 和 executor,引入 freshness mechanism——scratchpad rewrite、自动 summarize);
     - Gen 4:Recursive planner-worker(root planner 派生 sub-planner + workers,每 cycle 起 judge)。
   - Anthropic:subagent → Agent Teams(v2.1.32+,CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS)→ Managed Agents Multi-agent orchestration(5-6 public beta,最多 20 specialists 并行,shared filesystem,traceable in Console)。
   - OpenAI:Codex 单 agent → Symphony(2026-04-27,"issue tracker as control plane",Linear ticket → 独立 Codex agent,自动重启)。
3. **官方一手源**:很好。
   - Cursor Engineering, *Towards self-driving codebases*:https://cursor.com/blog/self-driving-codebases
   - Cursor Engineering, *Scaling long-running autonomous coding*:https://cursor.com/blog/scaling-agents
   - OpenAI, *An open-source spec for Codex orchestration: Symphony*:https://openai.com/index/open-source-codex-orchestration-symphony/
   - Anthropic Engineering, *Managed Agents*:https://www.anthropic.com/engineering/managed-agents
   - Claude Code Docs, *Orchestrate teams of Claude Code sessions*:https://code.claude.com/docs/en/agent-teams
4. **跨平台对照**:极好,三家平台都在同一时间窗口(2026-02 ～ 2026-05)独立收敛到几乎同形的 hierarchical-with-judge 拓扑,这是 lecture 的金矿对照。
5. **Lecture 价值**:双刃剑。
   - **加分**:Cursor 四代故事极有戏剧性,Symphony 的"以 issue tracker 为 control plane"是 2026-Q2 最干净的"工程化被 bake 进产品"例子。
   - **减分**:如果论点 "工程化在加重" 已经靠 Skill/Context/Verification/Permission 撑住,Orchestration 容易被听众视为 "Skill 维度的多体推广",让讲座结构变松。

### 时间轴关键节点
| 日期 | 事件 |
|---|---|
| 2026-02-05 | Cursor 公开 *self-driving codebases* 研究 + Long-Running Agents preview |
| 2026-02-25 | Boris Cherny tweet 关于 worktree isolation(早期的多 agent 隔离手法) |
| 2026-03 / Agent Teams | Claude Code v2.1.32 引入 Agent Teams(experimental flag) |
| 2026-04-27 | OpenAI 发布 Symphony spec + Elixir 参考实现 |
| 2026-05-06 | Anthropic Managed Agents Multiagent orchestration public beta(最多 20 specialists) |

---

## 候选 E:Cost / Compute(test-time compute 与 budget-aware harness)

**结论:不推荐作为独立维度,作为跨 4 维的 *crosscutting concern* 用一两张 slide 收掉即可。**

### 五条标准评估
1. **正交性**:弱。Cost 是所有维度的副产品——更多 verification 多花 token,更细 permission 多花 classifier 调用,更多 orchestration 多花并行 agent。
2. **演进证据**:有但不连贯。
   - Boris Cherny 2026-03-09 tweet "more tokens you throw at a coding problem, the better"。
   - Codex `budget_limit.md` 模板与 `/goal` 的 token budget;用尽即软停止。
   - Routines 的 daily run cap、Claude Auto Mode 文档明确警告 "small impact on token consumption, cost, and latency"。
   - 没有任何一篇 *官方* 文章把 cost 当成独立工程维度讨论;最接近的是 VentureBeat 引述 Anthropic 的 Albert:"more test time compute, more models thinking about a problem for longer, to check over the work of another"——但这把 cost 直接 *从属于* verification 维度。
3. **官方一手源**:弱。Codex `budget_limit.md` 模板是最 concrete 的(在 `openai/codex` repo 中),但它本身就属于 `/goal` = verification 维度的工具。
4. **跨平台对照**:薄弱。
5. **Lecture 价值**:作为独立维度会稀释主论点;作为收尾的"跨 4 维的隐藏成本曲线"很好——你可以一句话点出:"verification 上去、permission 上去、orchestration 上去,token 成本曲线也跟着抬高,这是 harness engineering 的隐藏税。"

---

## 候选 F:开放维度扫描(2026-02 至 2026-05 初)

我系统扫了一遍这个窗口的高质量 harness engineering 讨论,除已列出的之外,下面三条 *被反复提到但你没列* 的候选我建议这样处理:

### F1. Observability / Telemetry(agent 行为可观察)
- **典型一手源**:
  - Claude Agent SDK *Observability with OpenTelemetry*:https://code.claude.com/docs/en/agent-sdk/observability(原生 OTLP、`claude_code.interaction` span、subagent span 嵌套、W3C trace context 透传)
  - Codex *Agent approvals & security* 提到 OpenTelemetry 监控(OTel off by default):https://developers.openai.com/codex/agent-approvals-security
- **建议**:不作为独立维度。在 lecture 里作为 Permission 维度的"产品默认 telemetry"小节提一句即可。论点支持 *微弱*——它确实"被 bake 进产品",但工程化加重的故事不强。

### F2. Environment Engineering(让代码库对 agent 友好)
- **典型一手源**:OpenAI Symphony 公告里反复提到 "harness engineering" 是 *先决条件*——"Codex-friendly repositories, extensive automated tests, and some restrictions for safe operation"(https://openai.com/index/open-source-codex-orchestration-symphony/)。OpenAI Codex *Best practices* 文档把 AGENTS.md + skills + automations 作为标准操作系统。
- **建议**:不作为独立维度。它和 Skill/Context 强重合(AGENTS.md = Context、skills = Skill)。但有一个 *值得在 lecture 引用的 framing*:"agent harness engineering 不只是 wrap model,还要 reshape codebase"——这句可以放在 Skill 维度的 closing。

### F3. Trigger / Activation(agent 何时被触发)
- **背景**:Routines(Schedule / API / GitHub event)、Codex Automations(schedule + review queue)、Symphony(Linear ticket polling)都在做这件事。
- **是否独立维度**:临界。它确实是新的"工程化 surface"——把 agent 从 reactive 变成 proactive。但它跟 Permission 维度强耦合(Routines 跑无审批),跟 Orchestration 也耦合。
- **建议**:不独立。在 Permission 维度收尾时讲:"Routines 的 governance 不是 runtime 审批,而是 *pre-runtime constraint*——repo 访问、connector 选择、`claude/` 分支前缀规则"。

---

## 综合判断:lecture 用几个维度?

**最终选定:3 个维度。Skill + Context + Verification。**

(讨论后排除 Permission——用户判断:推荐默认全权限,模型不会乱来,Permission 不必特别强调。Tips Slide 1 简单提一句即可。)

### 推荐 3 维度的理由
1. **论点强度**:lecture 论点是 "AI Coding 看似越来越简单,工程化其实在加重;工程化被 bake 进产品"。Skill 是"调用单元的 bake-in",Context 是"token 集管理的 bake-in",**Verification 是"完成度判定的 bake-in"**——这三轴共同覆盖 agent 的 *输入–过程–输出* 三相,逻辑闭环最干净。
2. **官方源最厚**:Verification 维度有 4 篇及以上 Anthropic / OpenAI 一手工程博客与正式文档(harness-design、auto-mode、Outcomes 公告、continuation.md),是除 Skill/Context 之外 *官方源最厚* 的维度。
3. **跨平台对照最对称**:Anthropic Outcomes(rubric + grader)vs. Codex `/goal`(continuation.md + audit checklist),是 Anthropic 与 OpenAI 在同一周内独立给出的同形答案,副线对照价值最高。
4. **不稀释主线**:Memory(候选 C)和 Orchestration(候选 D)都有"它其实是 Context/Skill 的复数化"的 reduce 路径,独立成轴反而让讲座变松。

### 不推荐 5 维度
任何把 Memory、Orchestration、Cost、Observability 同时拉进来的方案都会显著稀释论点,建议这 4 个候选在 3 维框架内作为 *附属节点*:
- Memory → Context 第三阶段(distillation);
- Orchestration → Skill(specialist 是 skill 的复数化)+ Context(per-agent 隔离)的合用例;
- Cost → 跨 3 维的 closing 隐藏曲线;
- Observability → Permission 章节的"产品默认 telemetry"小节(已不在 lecture 选定的 3 维里,可省略)。

---

## 最终表格:三轴选型对照

| 维度 | 演进 | 最强一手源 | Claude Code 锚点 | Codex 对照锚点 | "Bake-in" 证据 |
|---|---|---|---|---|---|
| **Skill** | all-loaded → on-demand | Anthropic Skills 设计哲学;Codex Skills (2026-02-02) | `.claude/skills/` 受保护路径(v2.1.81);Skills 2.0.20 | Codex Skills(macOS app 首发)+ AGENTS.md | Anthropic / OpenAI 都把 SKILL.md 设为 first-class file format |
| **Context** | passive transcript → actively managed → distilled | *Effective context engineering for AI agents*;*Effective harnesses for long-running agents*;Chroma context rot;Anthropic Managed Agents | `claude-progress.txt`、auto compact、Routines fresh context、Dreaming | `~/.codex/memories/`、Chronicle、diff-based forgetting | Anthropic Managed Agents 把 context engineering 作为 *meta-harness* 的核心抽象 |
| **Verification** | manual review → in-loop verifier → external grader | *Harness design for long-running application development*;Outcomes (5-6 public beta);Codex `continuation.md` | Outcomes、`/go` skill 调用 simplify+test+PR | `/goal` + `update_goal(complete)` 强制 audit;`guardian_approval` 子 agent | Outcomes 是 public beta 而非 research preview |

---

## Caveats(必须在 lecture 前 double-check 的几条)

1. **Outcomes 的 +10pp 数据来源**:是 Anthropic *internal benchmarks* 自报,不是 SWE-bench 之类公开基准。建议讲解时口径用 "Anthropic 内部基准 +10pp" 而非泛化为 "improves task quality 10%"。
2. **Symphony 6× PR 增长**:是 OpenAI internal team claim(前三周),未独立验证。建议讲解时口径 "OpenAI 内部团队前三周报告 6× PR 增长"。
3. **Auto mode 84% prompt 减少**:来自 Sandboxing 工作的 *internal testing*(不是 Auto mode 本身),常被合并引用。如果 lecture 用这个数据,应明确归因到 *2025-10 Claude Code 原生 sandboxing 内部测试*,不是 Auto mode。
4. **Codex `/goal` 的可达性**:截至 2026-05-04,OpenAI 公开 slash-command 文档仍未列出 `/goal`,要靠本地 0.128.0 验证(GitHub issue #20536)。如果 lecture 演示,提前确认安装版本。
5. **Dreaming 的 production 状态**:2026-05-06 是 *research preview*,不是 GA。讲座措辞建议 "research preview"。
6. **Auto Dream / `/dream` 命令**:claudefa.st、grandamenium/dream-skill 等社区资源在描述 Claude Code 的 "Auto Dream" 功能;这是 *社区拼装出的 / 抢跑实现*,Anthropic 官方 Dreaming 仅在 Managed Agents 上线。讲座如引用 `/dream`,必须区分清楚是社区第三方还是官方 Managed Agents Dreaming。
7. **Cursor 四代架构的时间锚**:来自 *Towards self-driving codebases* 一篇 retrospective,Cursor 没给每代精确日期,只给了"current system has been running with minimal overhead"。讲解时不要硬塞日期。
8. **HumanLayer 的 "harness ⊂ context engineering" 引语**:原话目前主要见于二手转述,如要直接引用,建议先在 humanlayer.dev 或 Dex Horthy 的公开演讲里二次确认。
