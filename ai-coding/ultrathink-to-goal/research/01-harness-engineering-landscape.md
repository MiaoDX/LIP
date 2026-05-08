# Research 01:Harness Engineering Landscape

> 本文件是为 lecture 准备过程中的第一轮 deep research 输出。
> 主要聚焦三件事:OpenAI Codex `/goal` 功能、GSD 框架、可作为 lecture 实例的第三方 AI Coding 实践。

## TL;DR

- **OpenAI Codex `/goal`(2026-04-30 在 0.128.0 推出)确实是"工程化折叠回 vibe 体验"的标志性动作**:用户只输入一句 objective,Codex 内部把"continuation prompt + budget limit + 完成审计 + TUI 生命周期"全部 bake 进去,对应"agent 自己 setup harness"——但官方明确强调它**叠加**在已有的 plan mode / subagents / skills / AGENTS.md 之上,并未替代。Anthropic 这边的同向动作是 **Routines(4/14)+ Auto Mode(GA)+ Managed Agents 的 Outcomes/Multiagent/Dreaming(5/6)**,三者合起来正好是"Codex /goal 的 Anthropic 版分布式实现"。
- **GSD(Get Shit Done)由 Costa Rica 独立开发者 Lex Christopherson(@glittercowboy / TÂCHES)开发**,60K+ stars,定位是"solo creative 用 Claude Code 做产品的轻量 SDD + 子代理工程化";它在 lecture 里最适合作为 **"SDD 方法学被产品化为 npm 包"** 的实例——一条命令安装到 14+ runtime,本质是把 spec → research → plan → execute → ship 这条 SDD pipeline 用 subagent 隔离 + 200K context window 复位的方式 bake 成可重用的 slash command。
- **可直接在 lecture 引用的 actionable 第三方实例**(除已有的 mattpocock/skills、GSD)补充 4 个:**obra/superpowers(Jesse Vincent,强制 TDD 的 SDD 框架,~94K stars)**、**HumanLayer 团队(CLAUDE.md / skill issue 工程化博客 + humanlayer/humanlayer 仓库)**、**LangChain Deep Agents(仅靠改 harness 把 Terminal Bench 2.0 从 Top 30 推到 Top 5)**、**Indragie Karunaratne(用 Claude Code 写出 19,000/20,000 行的 macOS 原生应用 Context)**。Steve Yegge 的 Gas Town 作为"过度工程化的反例"也值得讲一段。

---

## 方向 1:OpenAI Codex `/goal` 功能详解

### (a) 官方定义与时间线

**发布时间**:2026 年 4 月 30 日,随 Codex CLI **0.128.0** 发布。
**官方 changelog 原文**(developers.openai.com/codex/changelog):

> Added persisted /goal workflows with app-server APIs, model tools, runtime continuation, and TUI controls for create, pause, resume, and clear. (#18073, #18074, #18075, #18076, #18077, #20082)

这一条话密度极高,它一次性引入了 5 个 PR + 1 个收尾 PR,覆盖:**持久化层**(goal 跨 session 持久存在)、**app-server API**(`thread/goal/set`、`thread/goal/get`、`thread/goal/clear`,目前在 `capabilities.experimentalApi` 后面)、**model tools**(agent 自己能查询/更新 goal 状态)、**runtime continuation**(agent 在 turn 结束后自动续命)、**TUI 控制**(`/goal <obj>`、`/goal pause`、`/goal resume`、`/goal clear`)。

**Greg Brockman 在 X 上的官方背书**:"codex now has a built in Ralph loop++"——直接承认这是 Geoffrey Huntley 的 Ralph loop 模式被产品化进 Codex。

**Feature flag**:在 0.128.0 里 `/goal` 仍是 gated,需要在 `~/.codex/config.toml` 里加 `[features] goals = true` 才能见到 slash command。这一点很多用户踩坑(issue #20536:CLI slash-command 公开文档里没列出 `/goal`)。

**关键链接**:
- 官方 changelog:https://developers.openai.com/codex/changelog
- GitHub release:https://github.com/openai/codex/releases
- Issue #20536(文档缺失):https://github.com/openai/codex/issues/20536
- Issue #20656(Plan mode 与 /goal 冲突的 bug):https://github.com/openai/codex/issues/20656

### (b) 工作机制

用户面向的接口极简——一行 `/goal <objective>`。但内部发生的事情比较繁复:

1. **持久化 thread state**:goal 拥有自己的状态机(`pursuing` / `paused` / `achieved` / `unmet` / `budget-limited`),由 `goal_id` 做 stale-update 防御。
2. **自动 continuation**:每 turn 结束后,runtime 注入一个 `continuation.md`(社区已经提取出来的 prompt)。这个 prompt 把 objective 当作 *untrusted user data*,要求 Codex 在宣称完成前必须 audit 出具体 deliverables;turn 不会自动结束直到 goal 被认定 `achieved` 或 `unmet`。
3. **Budget 控制**:runtime 同时注入 `budget_limit.md`,让 agent 在 token 预算耗尽前进入 graceful wrap-up(保存 state、总结剩余工作),而不是被硬切。
4. **打断语义**:用户 Ctrl+C 或输入新 prompt → goal 自动 `paused`;用户输入永远优先于自动续命。
5. **AGENTS.md / Skills / Plan mode 仍然生效**:goal 不替代它们,而是 wraps 它们。Plan mode 与 goal 共存时目前有 bug(issue #20656:goal 显示 active 但 continuation 被静默抑制)。

### (c) 与 Codex 已有功能的关系——叠加,不替代

| 早期 Codex 功能 | 与 /goal 的关系 |
|---|---|
| `/plan` mode | 仍存在;OpenAI 内部讨论 #7355 表明 plan/spec mode 是"积极探索中",goal 是其中一种实现而非最终方案 |
| AGENTS.md / PLANS.md | OpenAI Cookbook 的 *Using PLANS.md for multi-hour problem solving*(developers.openai.com/cookbook/articles/codex_exec_plans)展示的"ExecPlan"模式,完全可以塞在 goal 内部作为 deliverable spec |
| Skills(`SKILL.md`,2025-10 OpenAI 跟进采纳的 Anthropic 标准)| Goal 触发 skill;goal 定义 *what*,skill 定义 *how* |
| Subagents(`developers.openai.com/codex/subagents`,custom agents 写在 `.codex/agents/*.toml`) | Goal 内的 agent 可以 spawn subagent,`agents.max_depth` 默认为 1 |
| Symphony(开源多 agent 协作) | 不冲突;symphony 是顶层编排,goal 是单 agent 的长 horizon 控制 |

**结论**:`/goal` 是"agent loop 自身的产品化",是 harness 的更深一层 bake-in。它不是新方法学,而是把 Geoff Huntley 在 bash 里用 `while :; do ... done` 实现的 Ralph loop 升级成 first-class command。

### (d) 早期社区评价

- **Simon Willison**(2026-04-30):精简地点出"OpenAI's own version of the Ralph loop",补充实现是通过 `goals/continuation.md` 和 `goals/budget_limit.md` 在每个 turn 末注入。
- **Towards AI(Chew Loong Nian, 2026-05)的实测**:`/goal ship the 18 features in BACKLOG.md`,跑 18 小时无监督,14/18 feature 跑出绿色 CI 的 PR,花费约 $4.20 Codex credit。这是目前流传最广的 demo case,可在 lecture 引用作为"agent 真的 AFK 干活"的具体证据。
- **DevToolPicks 2026-05-06 vs Claude Code agents 对比**:goal 的"durable across restarts"、"无需手动 ping 续命"是 Claude Code subagents 当前没有的;Codex 的 plan mode 是 nudge-based,比 Claude Code 的 permission prompt 更宽松。
- **Issue tracker 警示**:长 goal 跑过 context compaction 后,continuation.md 可能丢失(issue #19910),导致"假完成"——lecture 里讲到工程化的边界时可以引用这点说明"产品 bake-in 仍有失败模态"。
- **审视性观点(laozhang.ai)**:截至 2026-05-04 公开 docs 仍未列 `/goal`,本地 CLI 可能需更新到 0.128.0 才能见到——是"surface drift"问题,提醒受众"产品化 ≠ 开放化"。

### (e) "工程化折叠回 vibe 体验" 假设的验证

**部分成立**。/goal 做的就是:把"engineer the harness"的核心组件(continuation prompt、budget 控制、状态机、生命周期 UI)从用户那里隐藏,让用户回到 vibe 阶段——只描述目标。Anthropic 的 Routines(schedule / API / GitHub event 触发的 Claude Code 自动跑)和 Managed Agents 的 Outcomes(写 rubric,agent 自己迭代到达标)也是同一个方向。

**但要给受众加一层 caveat**:所有这些产品化都明确要求用户**自己写好 AGENTS.md、CLAUDE.md、skills、permissions、subagent 定义**。**vibe 表面**坐在**更厚的 spec/harness 配置**上,工程化没消失,只是被产品的两侧吞了——这正好契合 lecture 的论点。OpenAI 自己的 Codex Best Practices(developers.openai.com/codex/learn/best-practices)原话:"move durable rules into AGENTS.md or a skill"——也就是说,要让 vibe 体验工作,前置工程化反而更重要了。

### (f) Anthropic 端的对应动向

| 时间 | Anthropic 动作 | 对照 OpenAI |
|---|---|---|
| 2026-03 | **Auto Mode** GA(Max/Team/Enterprise)。注入 system reminder 让 Claude "execute immediately, minimize interruptions, prefer action over planning"。Subagent 在 spawn / execute / return 三个 checkpoint 自动 classify | 类似 Codex /goal 的"自动续命"但更聚焦 permission 自动化 |
| 2026-04-14 | **Routines**(research preview)。一个 Routine = prompt + repos + connectors + trigger(schedule / API / GitHub webhook),跑在 Anthropic 云上。Pro 5/天、Max 15/天、Team/Enterprise 25/天 | 比 /goal 更"async-first"——Codex /goal 是单 session 持续,Routines 是事件驱动 |
| 2026-05-06 *Code w/ Claude* 大会 | **Managed Agents** 加入三件套:**Multiagent orchestration**(lead agent + specialist agents 共享 filesystem)、**Outcomes**(写 rubric,独立 grader agent 评判,agent 自纠到达标)、**Dreaming**(research preview,agent 离线 review 历史 session、提取 pattern、curate memory)。内部 benchmark:outcomes 比标准 prompting loop 在结构化文件生成上 task success 提升 **up to 10 points**,docx +8.4%、pptx +10.1% | **Outcomes ≈ Codex /goal 的 verification 部分**(Codex 自己审计 deliverables vs Anthropic 跑独立 grader);**Multiagent ≈ Symphony**;**Dreaming** 是 OpenAI 端目前没有公开对应的特色 |
| 同周 | Claude Code "ultrathink" 关键字在 2.1.68 **复活**(2026 年 1 月一度 deprecate,社区抱怨质量下降后回归,作为 per-turn override) | 工程化"自动化反弹"的小型案例 |

**一手源**:
- Anthropic Routines blog:https://claude.com/blog/introducing-routines-in-claude-code
- Routines docs:https://code.claude.com/docs/en/routines
- Managed Agents 5/6 公告:https://claude.com/blog/claude-managed-agents
- Auto Mode InfoQ 综述:https://www.infoq.com/news/2026/05/anthropic-claude-code-auto-mode/
- Simon Willison 5/6 大会 live blog:https://simonwillison.net/2026/May/6/code-w-claude-2026/
- Anthropic "An update on recent Claude Code quality reports"(2026-04-23 post-mortem,是 lecture 里讲"产品化引入新失败模态"的一手材料):https://www.anthropic.com/engineering/april-23-postmortem

---

## 方向 2:GSD (Get Shit Done) 框架详解

### (a) 核心理念与 workflow

**仓库**:https://github.com/gsd-build/get-shit-done
**作者**:Lex Christopherson(GitHub @glittercowboy,alias TÂCHES,居住地 Costa Rica),LICENSE 写明 *Copyright (c) 2025 Lex Christopherson*。
**他的另一身份**:电子音乐人——https://sequins.music ,TikTok @official_taches。这是一个"音乐人 + Claude Code = 软件作者"的非典型背景,比 lecture 里其他材料更能说明"AI coding 让非传统软件背景的人能持续做软件"这条副线。
**npm 包**:`get-shit-done-cc`(v1.39.0 以上),一条命令 `npx get-shit-done-cc@latest` 安装。
**热度**:~60.3K stars / 5.1K forks(2026-05),2,100+ commits、138 contributors、57 releases —— 4 个月增速。

**核心价值主张**(README 原文,可直接引用):
> "I'm a solo developer. I don't write code — Claude Code does. Other spec-driven tools exist, but they're all built for 50-person engineering orgs — sprint ceremonies, story points, stakeholder syncs, Jira workflows. I'm not that... So I built GSD. The complexity is in the system, not in your workflow."

**6-command 工作流**(lecture 主图可以直接画这条 pipeline):

```
/gsd-map-codebase   →  分析现有 stack/conventions(brownfield 用)
/gsd-new-project    →  Q&A → research → requirements → ROADMAP.md
/gsd-discuss-phase  →  捕捉 layout / API shape / error handling 决策
/gsd-plan-phase     →  research → plan → verify 循环至通过
/gsd-execute-phase  →  并行 wave,每个 task 独立 fresh 200K context + atomic commit
/gsd-ship → /gsd-complete-milestone → /gsd-new-milestone
```

### (b) 与 SDD / Harness Engineering 的关系

GSD 在 spec-driven dev 谱系里的位置非常清晰:

- **SDD 一面**:明确把 GitHub Spec-Kit、BMAD、OpenSpec、Taskmaster 列为对手;它选的是"轻量、单人创作者友好"的 SDD 子流派,跟 Spec-Kit 的"specify init → /speckit.plan"路线是同类竞品。
- **Harness 一面**:每个 plan 在 fresh 200K context 里执行 + 主 session 始终保持 30-40% context 占用 + skills 安装到 `~/.claude/skills/gsd-*/`(也支持 `~/.codex/skills/`)+ XML prompt formatting + subagent orchestration——全是 HumanLayer / Anthropic 那篇 harness design 文章里的 building block。

**GSD 自己在 README 里点明的 "Why It Works"**:
1. Context bloat — 主 session 干净,重活在子 agent
2. Quality gates — schema drift 检测、security threat-model anchor、scope reduction 检测
3. State management — 所有阶段有 state file,恢复后能自动判断"下一步该干什么"

**v2 的方向(gsd-build/gsd-2)值得专门提一句**:v2 不再是 prompt 框架,而是**基于 Pi SDK 的独立 CLI**——直接拥有 TypeScript 级别的 harness 控制权(context 主动清空、文件按需注入、git branch 管理、cost & token tracking、stuck-loop 检测、crash recovery)。这是 GSD 自己从"meta-prompting"长成"真正的 coding agent harness"的过程,对应论点中"工程化在加重"的另一种表现:它从用户工作流里下沉到工具内部。

### (c) 仓库活跃度 / 用户

- 公开 README 自宣"Trusted by engineers at Amazon, Google, Shopify, and Webflow"(无法独立验证,但作为社区话术可在 lecture 里引)。
- Augment Code 在 2026-04 和 2026-05 写了两篇追踪文章(48K → 58.9K stars):https://www.augmentcode.com/learn/gsd-58k-stars-claude-code
- The New Stack 报道:"context rot" 是它解决的实际问题。
- The Pragmatic Engineer 提到 "Claude Code Lecture-style 课程" 里 GSD 是其中一节。

### (d) 在 lecture 里的合适位置

GSD 最契合主线时间轴上的这一段:**"Claude Code 从 ultrathink/skill 走向 routine/auto mode 的过程中,社区如何把 SDD + harness 工程化打包成可重用的产品"**。它和 Spec-Kit、Superpowers 是同一个谱系的不同代表:

- **Spec-Kit**(GitHub 官方):标准化 SDD 模板,重 spec 阶段
- **Superpowers**(obra/Jesse Vincent):强制 TDD + 子 agent 评审,重质量 gate
- **GSD**:context 隔离 + atomic commit + 单人友好,重 *workflow 重复使用*

三者放一起讲,刚好是 SDD 方法学的 *三种工程化策略*。

### (e) 创始人背景与可引用材料

- GitHub profile:https://github.com/glittercowboy
- 个人音乐站:https://sequins.music
- 课程站:c/tachesteaches
- 没看到他写英文长 blog;主要内容载体是 GitHub README/CHANGELOG 本身(CHANGELOG 写得极详细,可在 lecture 里展示 v1.39.0 的 release notes 当例子说明"工程化的细节是怎么 commit 一次次堆出来的")

### (f) Demo / Tutorial 链接

- GSD 完整安装与运行 walkthrough(西语,但 npm 命令通用):https://www.webreactiva.com/blog/gsd
- DEV community 入门指南(英语,引用 Hacker News 用户 Steve Adams 的 Effect pipeline 重构 demo):https://dev.to/alikazmidev/the-complete-beginners-guide-to-gsd-get-shit-done-framework-for-claude-code-24h0
- Augment Code 2026-04 vs 2026-05 两篇 stars 增长追踪
- Medium 对比 Superpowers / GSD / gstack 的文章:https://medium.com/@tentenco/superpowers-gsd-and-gstack-what-each-claude-code-framework-actually-constrains-12a1560960ad

---

## 方向 3:可引用的第三方实践

下面是 4 个最 actionable、最适合在 lecture 里直接引用的英文圈实例(按"工程化谱系上的位置"从轻到重排)。

### 实例 A:Indragie Karunaratne — *I Shipped a macOS App Built Entirely by Claude Code*

- **链接**:https://www.indragie.com/blog/i-shipped-a-macos-app-built-entirely-by-claude-code(2025-07)+ 后续 https://www.indragie.com/blog/i-shipped-a-tool-to-help-agents-fix-slow-code(uniprof 工具)
- **一句话定位**:Sentry 工程总监用 Claude Code(早期 Sonnet 4 / Opus 4 时代)写 20,000 行的原生 macOS SwiftUI 应用 *Context*(用于 debug MCP server),自己手写 < 1,000 行。
- **谱系位置**:**vibe → SDD 之间的过渡期典范案例**。早于 plan mode、subagent 真正成熟之前的一段,靠 CLAUDE.md + 反复迭代得出的工程化实践。
- **为什么值得讲**:作者本人是观察派(来自 Sentry observability 背景),他后续写的 *I Shipped a Tool To Help Agents Fix Slow Code* 直接回答 lecture 的论点——"agent 足够聪明的时候,工程化的下一步是给 agent 加 runtime 上下文(profile、trace)"。
- **关键 demo**:Context 仓库 + uniprof CLI(agent 用 profiler 找 root cause 的 demo 截图就在他文章里)
- **影响力**:被 Simon Willison、9to5Mac、Lex Fridman 圈子反复引用

### 实例 B:obra/superpowers(Jesse Vincent)

- **链接**:https://github.com/obra/superpowers + 作者博客 https://blog.fsck.com/2025/10/09/superpowers/
- **一句话定位**:把"senior engineer 的纪律"——brainstorming、writing-plans、TDD(red-green-refactor)、systematic-debugging、subagent-driven-development、verification-before-completion——做成 14 个 mandatory SKILL.md 文件,由 session-start hook 在 < 2K tokens 内强制激活。Anthropic 官方 Skills 标准最早的旗舰示例。
- **谱系位置**:**SDD + harness 重度工程化代表**,与 GSD 是同代竞品但风格相反——GSD 走轻量、Superpowers 走严格强制("deletes code written before tests exist")。
- **为什么值得讲**:(1) 跨 6 种 harness(Claude Code、Codex CLI、Codex App、Cursor、Gemini CLI、OpenCode)都能跑,是"skill 跨 harness 标准"的最佳案例;(2) 作者 Jesse Vincent 是老牌 OSS 圈人物(Perl 5 pumpking、Request Tracker 创始人、Keyboardio 创始人),可信度极高;(3) 每个 SKILL.md 头部的 "Iron Law" + "Red Flags" 段落是绝佳的 lecture 截图素材——把"你想偷懒的 27 种借口"列出来直接打死,是工程化伦理被 bake-in 的极端实例。
- **关键 demo**:Marc Nuri 的精简解读 https://blog.marcnuri.com/superpowers-claude-code-skills-framework;Simon Willison 跟进解读 https://simonwillison.net/2025/Oct/10/superpowers/
- **影响力**:~94K-106K stars(2026 春),与 mattpocock/skills 是 Claude Code 生态最被讨论的两个 skill 仓库

### 实例 C:HumanLayer(dexhorthy 团队 + humanlayer/humanlayer)

- **链接**:组织博客 https://www.humanlayer.dev/blog —— 重点引两篇:
  - *Skill Issue: Harness Engineering for Coding Agents*:https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents
  - *Writing a good CLAUDE.md*:https://www.humanlayer.dev/blog/writing-a-good-claude-md
  - 仓库:https://github.com/humanlayer/humanlayer + CodeLayer 产品
- **一句话定位**:Dex Horthy + 团队的"咨询级 harness 工程化"实践——claim 是"It's not a model problem. It's a configuration problem.",代表案例是"靠改 harness 而不是换模型,把 Terminal Bench 2.0 上的同一个模型从 Top 30 推到 Top 5"(注:这条论断主要是 Viv Trivedy / LangChain Deep Agents 的成绩,被 HumanLayer 在自家 blog 转引并扩写为系统论述)。
- **谱系位置**:**纯 harness engineering 派**——博客是目前公开 skill / hook / sub-agent / tool budget / instruction budget 最实操的来源之一。
- **为什么值得讲**:(1) Dex Horthy 是 *Advanced Context Engineering for Coding Agents*(Y Combinator, 2025-08)演讲者,是这个圈子的"思想 anchor"之一;(2) 他们的 *Writing a good CLAUDE.md* 直接引用了 Claude Code 系统 prompt ~50 条 instruction 的逆向分析,是 lecture 里讲"instruction budget"的最佳一手数据;(3) AddyOsmani 的 *Agent Harness Engineering* 这篇综述(https://addyosmani.com/blog/agent-harness-engineering/)把 HumanLayer、Viv Trivedy、Anthropic、Birgitta Böckeler 串成完整脉络,可以直接当 lecture 的"现状综述图"。
- **关键 demo**:CodeLayer 的"Multi-Claude in parallel"截图;他们公开整理的 Claude Code system prompt 反向工程数据。

### 实例 D:LangChain Deep Agents — *Improving Deep Agents with harness engineering*

- **链接**:https://blog.langchain.com/improving-deep-agents-with-harness-engineering/(2026-02-22)+ 仓库 https://github.com/langchain-ai/deepagents
- **一句话定位**:在不动模型(GPT-5.2-Codex 固定)的前提下,仅通过 system prompt + tool 设计 + middleware hook(其中 `PreCompletionChecklistMiddleware` 直接对应 Ralph loop 的"退出前强制再次 verify"),让 deepagents-cli 在 Terminal Bench 2.0 上从 52.8 → 66.5(+13.7 点),从 Top 30 一跃到 Top 5。
- **谱系位置**:**纯 harness 工程化的工业级证据**。
- **为什么值得讲**:(1) 唯一同时有"开源框架 + 公开 benchmark + trace 数据集"的 case,是定量回答 lecture 论点的最强数据点;(2) Deep Agents 库本身是开源的"agent harness primitive"——planning tool、文件系统后端、subagent spawning、context compression middleware,跟 Claude Code 内部 harness 几乎一一对应,是"反向工程 Claude Code"最干净的开源参照系;(3) ZenML LLMOps Database 已经把它收录为 case study:https://www.zenml.io/llmops-database/harness-engineering-for-agentic-coding-systems
- **关键 demo**:blog 文里的 self-verification middleware 代码片段,可直接做 slide 截图

### 实例 E(备选/反例):Steve Yegge — Gas Town

- **链接**:https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04(2026-01-01)+ Gas Town v1 公告 https://steve-yegge.medium.com/gas-town-from-clown-show-to-v1-0-c239d9a407ec + 仓库 https://github.com/steveyegge/gastown
- **一句话定位**:把 20-30 个 Claude Code 实例并行编排起来的 "Kubernetes for AI coding agents",七种 agent 角色(Mayor、Polecats、Refinery、Witness、Deacon、Dogs、Crew),靠 Beads(Yegge 自己写的 git-backed issue tracker)做 control plane。一小时 ~$10/instance,作者烧 ~$2-5K/月。
- **谱系位置**:**工程化重到极致的反例 / 警示**——它正好坐在论点的另一端:当工程化没有被产品 bake-in、用户自己 over-engineer 时会发生什么。
- **为什么值得讲**:(1) Steve Yegge 是 ex-Amazon/Google/Sourcegraph 老将,他自我承认"100% vibecoded, I've never seen the code"——同时是 vibe 派和 harness 重度派的奇异混合;(2) Maggie Appleton 写过中肯的批评 https://maggieappleton.com/gastown ;(3) DoltHub 实测花了 ~$100/h 跑 Gas Town:https://www.dolthub.com/blog/2026-01-15-a-day-in-gas-town/ 。在 lecture 里可以用 Gas Town 来回答"为什么大家都希望 /goal 和 Routines 这种产品级 bake-in 出现——因为 Gas Town 这种自建 multi-agent harness 又贵又脆"。

### 个人开发者级补充(备用):Armin Ronacher *A Year of Vibes*

- **链接**:https://lucumr.pocoo.org/2025/12/22/a-year-of-vibes/ 和 https://lucumr.pocoo.org/2025/06/12/agentic-coding/
- Flask 创始人花一年时间从 Cursor 转到 Claude Code 再尝试 Amp/Pi,记录自己实际工程化做法(Sonnet 优先而非 Opus、避开截图、log everything 给 agent 看、把 Makefile 当 agent 的工具入口)。配合 Pragmatic Engineer Podcast 与 Mario Zechner 关于 Pi 的对话(https://newsletter.pragmaticengineer.com/p/building-pi-and-what-makes-self-modifying),可以作为"个人开发者一年来的工程化沉淀"主线副本。可以替换或补充已有的 Mitchell Hashimoto 材料。

---

## Caveats(lecture 引用时务必注意)

1. **/goal 当前仍是 feature-flagged + 文档不全**。Issue #20536 表明截至 2026-05-01 OpenAI 公开 slash-command 文档没列 `/goal`;issue #20656 表明 Plan mode 与 goal 共存时 continuation 会被静默抑制。lecture 里讲到 /goal 时一定要标注 *目前是 0.128.0 + experimental flag*,否则受众照搬会踩坑。
2. **"工程化折叠回 vibe" 的程度**有限。OpenAI 自己的 Codex Best Practices 仍然要求 *用户预先写好 AGENTS.md / skills / permissions / subagent 配置*。Vibe 体验只是"日常发出 goal 那一刻"短暂回到了 vibe;底层的 spec/harness 投入反而比一年前更重了——这正好是 lecture 论点,但表述时建议明确:"vibe 表面坐在更厚的工程化底座上",而不是"工程化消失"。
3. **Anthropic 2026-04-23 quality post-mortem** 是产品 bake-in 引发新失败模态的活教材:把 reasoning effort 改 default 触发了用户不可察觉的退化,加上 thinking-history 清理 bug,把"自动化 = 更好"的预设打了脸。lecture 中讲 Routines/Auto Mode 时建议带上这条作为反面注脚。
4. **第三方仓库的 star 数随时间变化**。本报告引用的数字(GSD ~60K、Superpowers ~94-106K、mattpocock/skills ~48K)来源于本次检索时段(2026-04 到 2026-05)的二手汇总;正式做 slide 时建议用 GitHub API 拉最新数。
5. **GSD "Trusted by engineers at Amazon, Google, Shopify, and Webflow"** 是仓库 README 自宣,没有独立第三方核实。引用时建议注明 *"per project README"*。
6. **Gas Town 反例引用时**避免把它作为 Steve Yegge 的"失败"——他自己定位 Gas Town 是"hands-on-the-wheel orchestration system"+ 故意 vibecoded 的实验品。lecture 立场应是"它揭示了用户自建 harness 的成本结构",而不是"它是失败的工程化"。
7. **GSD v2 (gsd-build/gsd-2) 与 v1 (get-shit-done) 是不同形态**:v1 是 prompt/skill 框架,v2 是基于 Pi SDK 的独立 CLI。在 lecture 主线时间轴上引用时,要明确区分;v1 是"工程化被 bake 成 npm 包",v2 是"工程化被进一步 bake 成独立 agent runtime"——两步分别对应不同 bake 程度。
8. **Indragie Karunaratne 案例是 2025-07** 的,时间上在 ultrathink → Routines 时间轴的早期段,对应"刚有 Sonnet 4 / Opus 4,CLAUDE.md 还是主要 harness 入口"那一时段。引用时不要讲成"现在的实践"。
9. **Geoffrey Huntley "Ralph loop"**:lecture 中讲 /goal = "Ralph loop++" 时,原始 Ralph 资料链接最干净的是 https://ghuntley.com/ralph/ 和 https://ghuntley.com/loop/ 。Greg Brockman 在 X 上的"Ralph loop++" 评论是社交媒体一手源——若做 slide 引用建议截图存档。
