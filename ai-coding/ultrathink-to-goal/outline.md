# 从 Ultrathink 到 Goal:AI Coding 工程化的一年

> 「汽车人 AI 进化论」第 09 期 · 缪东旭
> 50 min · 单人讲 · 公司内部分享
> 听众:α 类有实践的开发者为主,γ 类和非研发同事旁听

---

## 核心信息

**Thesis**:软件工程的 fundamentals 没变,变的是它们装到了谁手里——我们不必再是 binding constraint。

**Takeaway**:哪类活配哪种 harness——这本身就是工程判断。

**三轴叙事**:Skill(agent 调什么)+ Context(agent 看什么)+ Verification(agent 凭什么宣告完成)。

---

## Prelude · 为什么我能讲这个(1 min)

**目的**:先建立 proof-of-work,说明这不是旁观者视角。

- Claude Code / Codex / Kimi / MiMo 都有真实消耗截图
- 使用场景覆盖公司内部 project、自己的开源 project、CI、OpenClaw
- 加两类长程任务截图:短的 19 min `/goal`,长的 7 小时级 `/goal`

口播收束:这一页不是炫 token,而是说明后面的判断来自真实项目里的消耗、返工和踩坑。

---

## 0 · Karpathy 的悖论(3 min)

**钩子**:Karpathy 截图(自己截)+ 三段原话:

1. "Code's not even the right verb anymore. I have to **express my will to my agents** for 16 hours a day. **Manifest.**"
2. Sarah Guo:"I'm the binding constraint." Karpathy:"Yeah, it's a skill issue."
3. "this is why it gets to the psychosis is that this is like **infinite** and everything is skill issue."

抛问题:当代码不再是工作内容,工作变成了什么?

立 thesis:fundamentals 没变,变的是它们装到了谁手里——我们不必再是 binding constraint。

---

## 0.5 · 实证立柱:那 25 个百分点在哪里(2 min)

> Karpathy 的 psychosis 不是个人感受。先看一组数据。

**三个数据点**:

- **Endor Labs**(2026-04):同一个 GPT-5.5,同一周。OpenAI 自家 Codex harness 跑出 **61.5%**;Cursor harness 跑出 **87.2%**。**25.7 个百分点,没换模型,只换 harness。**
- **Stanford Meta-Harness paper**(arXiv 2603.28052):论文开篇引用跨研究 observation:"Changing the harness around a fixed LLM can produce a **6× performance gap** on the same benchmark."
- **ForgeCode @ Terminal Bench 2.0**:GPT-5.4 和 Opus 4.6 用同一个 harness,分数都到过 **81.8%**。关键不是排名,而是它的失败模式洞察:"**Opus reads between the lines. GPT reads the lines.**"

**伏笔**:为什么同一个模型差 25 个百分点?模型只看它能看到的 token,只调它能调的 skill,只在它被允许的边界里宣告完成——而**不同 harness 让这三件事完全不一样**。

收束:今天不讲哪个模型最强。讲那 25 个百分点的工程化在哪里。

---

## 1 · 主线介绍(2 min)

接 Karpathy 自己的话:

> "The agent part is now taken for granted... Now you can have multiple of them. Now you can have instructions to them. Now you can have optimization over the instructions."

**主图**:Claude Code 281 个版本时间轴 + 三段 vibe / SDD / harness 颜色标记 + 12-15 个里程碑节点。

整场 lecture 沿着这条时间轴走,但每到一个关键节点会从三个维度看:**Skill / Context / Verification**。

---

## 2 · Vibe 段(4 min)· 0.2.x 时代

**锚点**:ultrathink (0.2.44, 2025-03-15) → auto compact (0.2.47) → CLAUDE.md @import (0.2.107) → 1.0.0 GA + Sonnet 4 / Opus 4

**这一段三个维度都由我们自己承担**:
- Skill:我们写 prompt
- Context:我们管上下文(auto compact 是产品第一次帮一点忙)
- Verification:我们自己看输出

binding constraint 全部在我们这一侧。

---

## 3 · SDD 段(5 min)· 1.0.x 时代

**锚点**:Plan mode (1.0.33) → Hooks (1.0.38) → Subagent 雏形 (1.0.41) → /todos (1.0.94)

**关键转折**:第一次有 binding constraint **被产品接过去**——"先想再写"从 prompt 习惯变成产品按钮。

简短对照:OpenAI Plan/Spec mode discussion #7355 同时在探索同一个问题。

---

## 4 · Harness 段 · 三个维度的工程化(9 min)· 2.x 时代

**重新框定**:当生成成本归零,瓶颈不在写代码,在三件事——agent 调什么 / 看什么 / 凭什么宣告完成。

接 Karpathy 的 jaggedness 描述:"a brilliant PhD student and a 10-year-old simultaneously"——所以这三件事每件都需要工程化。

### 4.1 三轴框架(2 min)

引 Anthropic 官方 blog *Effective context engineering for AI agents*:
> "**Context is a critical but finite resource for AI agents.** Find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

引 HumanLayer Dex Horthy:"**Harness engineering is a subset of context engineering.**"

但 context 不是全部。harness 工程化在过去一年沿三条线收敛:

| 维度 | 解决什么 | 演进模式 |
|---|---|---|
| **Skill** | agent 调什么 | from all-loaded → on-demand |
| **Context** | agent 看什么 | from passive transcript → actively managed → distilled |
| **Verification** | agent 凭什么宣告完成 | from manual review → in-loop verifier → external grader |

每一轴都经历了同一个动作:**从我们自己承担 → 被产品接过去**。

### 4.2 三轴的产品演进(4 min)

**Skill 轴**:MCP 工具最初全部装载 → Skills (2.0.20, 2025-10-16) → Codex Skills (2026-02-04) → 大 skill / 大 tool 自动截断(按需加载)。
- 引 Boris Cherny 在 Code w/ Claude SF keynote:"**Routines are higher-order prompts.**"

**Context 轴**:transcript buffer → CLAUDE.md @import → subagent 隔离 context → claude-progress.txt → auto compact → **Dreaming**(5-6 research preview,agent idle 时复盘 session 提取 pattern)。
- 引 Chroma context rot research:"**models perform worse at longer context lengths.**"——context 不是免费的
- 这条线最戏剧化:从被动缓冲到主动管理再到离线蒸馏

**Verification 轴**:手写 verifier → Anthropic Planner-Generator-Evaluator 三角色(GAN 启发)→ Codex `/goal` 的 `continuation.md` 强制 audit → **Anthropic Outcomes**(5-6 public beta,rubric + 独立 grader agent)。
- 引 Anthropic *Harness design* 文章:"**Agents reliably skew positive when grading their own work.**"——所以 evaluator 必须独立
- Anthropic 内部基准:Outcomes 让 task success +10pp,docx +8.4%、pptx +10.1%
- 引 Anthropic Managed Agents engineering blog:"**Harnesses encode assumptions that go stale as models improve.**"

### 4.3 社区在做同样的事(3 min)

**mattpocock/skills 重点**:
- 引 README:"**The most common failure mode in software development is misalignment.**"
- 四个工程经典 → 四个 skill 的映射图:Pragmatic Programmer / DDD / TDD / Philosophy of Software Design
- 立场金句:"**Software engineering fundamentals matter more than ever.**"

**gstack 一句带过**:office-hours / CEO-review 是同一思路另一种打包——和 grill-me 一样在解决"对齐"这个 binding constraint。

---

## 5 · 我的实践 · 任务和工具的匹配(8 min)

### 5.1 roboharness · 长 unattended run 的 review 工程化(3 min)

- 一句话定位(引 README):`long unattended agent run → one proof pack → short human review`
- **不是补视觉**——模型有视觉。是当 agent 跑 4 小时改机器人代码,人没法一帧帧看完
- **是把通用 harness 能力 specialize 到 robot domain**:contract / phase_manifest / approval_report / report.html
- **核心抽象**:把 review bottleneck 拆成"先看 Run Decision banner → 只看 surfaced case → 用 phase_manifest 决定是否重跑"
- 在三轴里它主要落在 **Verification 轴**——把 review 这个 binding constraint 工程化掉,让人在 5 分钟内消化几小时 unattended 跑

### 5.2 routine 多 agent · 云端 60 分流水线(3 min)

- 四个 routine + GitHub comment 协议(auto_pr / issue_label / pr_again / daily_duty)
- 三态自评(FULLY / PARTIALLY / DIMINISHING RETURNS)—— PARTIAL 不是失败,是云端流水线对自己工作边界的诚实声明
- 引 Greg Brockman 4-01 Big Technology:"**Codex is a general agent harness that can use tools.**"——OpenAI 总裁亲口确认 harness 是产品的一等概念
- 在三轴里它跨 **Context 轴**(每个 routine fresh 200K context、subagent 隔离)和 **Skill 轴**(把工程团队角色封装成可调用 routine)

### 5.3 local 重 harness · 60 分边界外的活(2 min)

- "60 分" 不是产出完成度,是**任务-工具匹配的边界**——哪些活让云端 routine 负责,哪些活留本地用更重的 harness 处理
- 边界外的活留 local,用更重的工具:
  - **mattpocock/skills 的 grill-me / grill-with-docs** → Skill 轴 + 对齐
  - **GSD / gstack 的 plan-pipeline** → Skill 轴 + 大 scope 修改
  - **roboharness 的 proof pack** → Verification 轴 + 长 unattended run
- 三种工具不是替代关系,是**针对不同任务类型的 harness specialization**
- 收束:"**哪类活配哪种 harness——这本身就是工程判断。**"

---

## 6 · 当下与未来 + Caveat(4 min)

**bake-in 的极致:用户表面回到 vibe,底层工程化反而更重**

- **/goal**(4-30 Codex 0.128.0):引 Greg Brockman tweet "**codex now has a built in Ralph loop++**"
  - agent loop 自身被 bake 进 slash command
  - 三轴在一条命令里同时被产品接过去:Skill(按需调)+ Context(runtime continuation)+ Verification(强制 audit)
  - 但 /goal 不替代 AGENTS.md / skills / permissions / subagents,而是把它们 wrap 成"我说目标"的入口

- **Routines + Auto Mode + Managed Agents**(Outcomes / Multiagent / Dreaming):Anthropic 同向。
  - 用户表面回到 vibe("我说目标"),底下 spec/harness 配置反而更前置

- **Caveat**:Anthropic 4-23 quality post-mortem——bake-in 也会引入新失败模态。
  - reasoning effort 改 default 触发用户不可察觉的退化
  - thinking-history 清理 bug
  - 产品化不是终点

---

## 7 · 收尾 · 回到 Karpathy(3 min)

- "everything is skill issue"——但 skill issue 的边界在移动
- 哪些还需要我们自己解?哪些被产品消化了?哪些被 skill bake 走了?哪些被我们自己的 routine 自动化了?
- **我们不必再是 binding constraint**——这就是 "必要但没那么难" 的精准翻译
- Karpathy 自己留的悬念:"or it's a skill issue, and we just haven't figured out how to use it. So, it's hard to tell."

(行动建议留到下一节,这里只留情绪)

---

## 8 · Tips · 三个今晚就能做的实验(3 min)

### Slide 1 — 实验 1:把 harness 环境整理到最新

> "harness 比 model 重要,但前提是 harness 是最新的"

- **每天第一件事:升级所有工具**
  - `claude --upgrade` / `codex` / MCP servers / skills
  - 推荐我整理的工具集:[github.com/MiaoDX/claude-devkit](https://github.com/MiaoDX/claude-devkit)
  - 281 个版本里只要落后 2 周,那 25 个百分点就回去了一半

- **先准备边界,再减少审批延迟**
  - clean branch / git / CI / secret 边界先到位
  - 然后尽量减少可避免的人类审批 prompt
  - 真正要避免的是人变成 turn-by-turn approval bottleneck

### Slide 2 — 实验 2:先让 agent 问你,再让它干

> "对齐 > 提示词。先让 agent 问你,再让它干"

- **试一次 grill-me 或 office-hours**
  - mattpocock/skills 的 grill-me——让 AI 反问你需求是否清晰
  - gstack 的 office-hours——YC 风格的 6 个 forcing question
  - 一旦试过一次"被 AI 盘问",就再也不想直接写 prompt 了

- **画图给它看**
  - A picture is worth a thousand words
  - 你脑子里的架构、流程、UI 草图,截图丢进去比写 200 字描述快 10 倍
  - Claude / Codex 都是多模态的,别浪费

- **看看大家在怎么用**
  - [github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
  - SDD / gstack / mattpocock/skills 都在里面有条目
  - 不是让你全装,是让你看自己缺哪一类工具

### Slide 3 — 实验 3:用你能 access 的最好模型跑真实任务

> "Just use the best model, please. Just try it."

- **尽量用你能 access 的最好模型**
  - SaaS frontier model 可以用就直接用
  - 内部 only 项目,就用私有部署的 top-tier 开源模型
  - 省下来的 retry、review、上下文重建和返工时间,通常比模型成本更贵

- **Just try it**
  - 这场 lecture 听完最容易的失败模式:回去想"我下周开始整这套"
  - 真正的失败模式:什么都不试
  - 今晚装一个 grill-me,明早跑一个 routine,就够你接下来一周看出区别

### Bonus — hybrid-phase-pipeline + Codex `/goal`

- 推荐最近用两三天体感不错的长程任务组合:
  - [hybrid-phase-pipeline](https://github.com/MiaoDX/claude-devkit/blob/main/skills/hybrid-phase-pipeline/SKILL.md)
  - GSD 负责 discuss / plan / execute / verify 的 phase 结构
  - gstack + mattpocock/skills 负责 grill、office-hours、autoplan、review 等前置压实
  - Codex `/goal` 负责持续目标、反复检查和最终收尾
- 口播重点:这不是一个全新框架,而是把现有几套工具粘成一个更适合长程任务的方式。

---

## 9 · Q&A(≈4 min 留白)

- 补公众号二维码:直觉机器漫谈
- 补个人微信二维码:MiaoDX

---

## 时间表

| 节 | 内容 | 时长 |
|---|---|---|
| Prelude | proof-of-work:为什么我能讲这个 | 1 min |
| 0 | Karpathy 悖论 | 3 min |
| 0.5 | 实证立柱:25% / 6× / 81.8% | 2 min |
| 1 | 主线介绍 | 2 min |
| 2 | Vibe 段 | 4 min |
| 3 | SDD 段 | 5 min |
| 4 | Harness 段(三轴) | 9 min |
| 5 | 我的实践 | 8 min |
| 6 | 当下与未来 + Caveat | 4 min |
| 7 | 收尾回 Karpathy | 3 min |
| 8 | Tips + 长程任务 bonus | 4 min |
| 9 | Q&A | 4 min |
| **合计** | | **约 45 min 内容 + 4 min Q&A = 50 min 内** ✓ |

弹性:如果 Q&A 时间紧或某段超时,**Tips Slide 2 第三条(awesome-claude-code)可以删**,或 SDD 段砍到 4 min(todos / output styles 一笔带过)。

---

## 整场两条贯穿线

**金句线**(按出现顺序):
- 开场:`I'm the binding constraint` / `everything is skill issue` / `Manifest`
- 实证立柱:`6× performance gap on the same benchmark` / `the gap disappears`
- 主线:`Now you can have optimization over the instructions`
- 三轴:`Context is a finite resource` / `models perform worse at longer context lengths` / `Agents reliably skew positive when grading their own work` / `Harnesses encode assumptions that go stale`
- 社区:`Software engineering fundamentals matter more than ever` / `Misalignment is the most common failure mode`
- 副线终点:`Routines are higher-order prompts` / `codex now has a built in Ralph loop++`
- 收尾:`我们不必再是 binding constraint`

**数据线**:
- 开场:25.7pp / 6× / 81.8%
- 三轴:Anthropic Outcomes 内部基准 +10pp(docx +8.4%, pptx +10.1%)
- 实践:routine 实测数据(按公众号文章 002 里的统计)
- 副线:Codex `/goal` 0.128.0 / Routines daily run cap

---

## 五张主图清单

1. **开场 Karpathy 截图**(自己截 No Priors)
2. **0.5 节数据图**:Endor Labs 25% + Stanford 6× + ForgeCode 81.8% 三条数据并列
3. **第 1 节主图**:Claude Code 281 版本时间轴 + 三段颜色 + 12-15 个里程碑
4. **第 4 节三轴矩阵图**:Skill / Context / Verification × from-X-to-Y 演进
5. **第 5.3 节决策图**:把 routine / mattpocock / GSD-gstack / roboharness 按任务类型分到象限里

---

## 整场结构层次

- **最外层**:Karpathy 的悖论 → 解释悖论 → 回到 Karpathy
- **中间层**:vibe → SDD → harness 时间轴
- **内层**:Skill / Context / Verification 三轴在每个时间段的演进
- **行动层**:Tips 三件事

四层叠在 47 分钟里,每一层都对应一个明确的听众价值——γ 听 Karpathy 故事,α 听三轴框架,所有人带走 Tips。
