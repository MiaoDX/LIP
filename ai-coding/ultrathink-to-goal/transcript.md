# 从 Ultrathink 到 Goal：AI Coding 工程化的一年｜逐字稿

> 「汽车人 AI 进化论」第 09 期 · 缪东旭  
> 版本：基于 `index.html` 当前 46 页 deck  
> 用途：排练口播稿。方括号里的内容是舞台提示，不需要念出来。

---

## Slide 01｜标题

大家好，我是缪东旭。

今天这场分享的题目叫《从 Ultrathink 到 Goal：AI Coding 工程化的一年》。

这个题目里有两个端点。Ultrathink 是去年大家很熟悉的一个词：你在 prompt 末尾加上它，希望模型多想一会儿。Goal 是最近 Codex 里出现的入口：你不再只给下一步指令，而是直接交给它一个目标，让 agent 自己循环推进、检查和收尾。

我想讲的不是某个工具的使用教程，而是这一年里发生的一件更底层的事：AI Coding 里很多原来必须由人亲自承担的工程责任，正在被 harness、产品默认和 agent runtime 悄悄接走。

整场我会用一条线串起来：Claude Code 这一年 281 个版本里，binding constraint，也就是限制系统继续前进的那个瓶颈，是怎么从人手里迁移出去的。

[翻页]

## Slide 02｜这不是旁观者视角

先交代一下我为什么讲这个。

这不是一个旁观者视角的行业观察。我自己在公司内部项目、自己的开源项目、CI、OpenClaw、还有一些长程 agent 任务里，都在真实消耗这些模型。

Claude Code 是主力长 session。很多 lecture、工具链和项目改动，都是从它开始的。Codex 这边，我不只是拿它做 demo，也会让它跑 `/goal`、做 review、查 CI、收尾。Kimi、MiMo 这些国产或私有模型池，在内部 only 的场景里也会用，因为很多项目不能直接丢给 SaaS frontier model。OpenClaw 里，Slack 里的 agent 工程也在跑。再往后，还有开源项目持续迭代，以及 `/goal` 加 hybrid-phase-pipeline 的长程任务。

所以这页不是为了炫 token。它只回答一个问题：后面这些判断不是看 release note 想出来的，而是来自真实项目里的消耗、返工和踩坑。

[翻页]

## Slide 03｜Karpathy 的困境

我们从 Karpathy 的一个困境讲起。

过去一年，他一边在说自己每天都在 manifest，一边又在说自己从来没有这么跟不上。这个反差非常有意思。

我今天不把它讲成情绪问题，也不把它讲成“AI 发展太快，所以大家焦虑”。我想把它讲成一个工程问题：如果 everything is skill issue，那么 skill 的边界到底是谁在推动？哪些 skill 还在我们手里，哪些已经被产品接走，哪些正在被我们的 harness 自动化掉？

[翻页]

## Slide 04｜同一个人，两个信号

这页有两个信号。

左边是 Karpathy 在 No Priors 里说的：现在 code 甚至不是最准确的动词，他更愿意说自己在 manifest。这个词很关键。它不是“我写代码”，而是“我把意图具现化给一组 agent，让它们替我推进”。

右边是他在 X 上的另一个信号：他觉得自己作为程序员从来没有这么 behind。注意，这两个信号来自同一个人，而且不是互相矛盾的。它们其实在描述同一个现象：工具越强，人越容易变成系统里的瓶颈。

以前人是写代码的人。现在人更像是在定义目标、配置工具、安排上下文、判断结果。也就是说，工作没有消失，只是瓶颈位置变了。

这就是今天整场的入口：当代码不再是主要动作，工程师到底还在做什么？

[翻页]

## Slide 05｜AI psychosis 在工程里长什么样

这里我借用 Karpathy 讲的 AI psychosis，但不展开成医学词。我们只讲工程体感。

生成成本接近归零以后，很多事情没有自然停止点。你可以让它继续查一个资料源，再改一版实现，再补一个测试，再生成一个候选方案，再开一个分支。每一次都很便宜，于是整体上就变成了无限。

这会带来几个很具体的工程问题。

第一，best practice drift。昨天刚学会的 workflow，今天可能就被产品内建了，或者被新默认废掉了。

第二，infinite budget feeling。token 好像用不完，任务总还能继续 polish、继续 refactor。

第三，moving tools。MCP、skills、subagents、routines、`/goal` 都在变，手册永远慢半拍。

最后真正难的是 exit problem。最难的不是生成，而是决定什么时候算完成，谁有资格说完成。

所以今天的核心不是“AI 太强了怎么办”，而是：谁定义 action surface，谁控制 information surface，谁给 exit condition。

[翻页]

## Slide 06｜25.7pp

Karpathy 的这种体感不是孤立的。我们先看一个很硬的数据锚点：25.7 个百分点。

这不是换了模型，也不是换了任务，而是同一个模型换了一个 harness，结果就差出二十多个点。

这里先只记住这个数。下一页我们把三组证据放在一起看。

[翻页]

## Slide 07｜数据立柱

这页是今天整场的实证立柱。

第一组，Endor Labs 的 benchmark。同一个 GPT-5.5，在 Cursor harness 里是 87.2%，在 Codex harness 里是 61.5%。差 25.7 个百分点。这里最重要的不是谁赢，而是没换模型，只换了模型外面那一圈东西。

第二组，Meta-Harness 论文开头引用了一个跨研究 observation：固定 LLM，只改变外部 harness，同一个 benchmark 可以出现 6 倍差距。这里要注意，6 倍是论文引用的跨研究发现，不是它自己实验的数字；它自己的贡献是 TerminalBench-2 从 27.5% 提到 37.6%。

第三组，ForgeCode 在 Terminal Bench 2.0 里的发现也很有意思。GPT-5.4 和 Opus 4.6 在同一个 harness 下都跑到 81.8%。它的重点不是 leaderboard 排名，而是失败模式：有的模型更会读弦外之音，有的模型更严格读字面。好的 harness 能把不同模型的失败模式 round 掉一部分。

所以今天不讲哪个模型最强。我们讲那 25 个百分点的工程化在哪里。

[翻页]

## Slide 08｜为什么从三件事讲

我把这件事压成三问。

第一，Skill：agent 能调什么？这对应 action surface。工具、命令、skills、routines，决定 agent 能把你的意图落实到哪些动作上。

第二，Context：agent 看到了什么？这对应 information surface。文件、历史、memory、subagent 隔离，决定模型靠什么做判断。

第三，Verification：谁判定完成？这对应 exit condition。rubric、grader、测试、proof pack，决定长程任务什么时候停止。

这三个词不是为了造分类，而是为了让大家之后看任何 AI Coding 工具时，都能问同一组问题：它能调什么？它看到了什么？谁在判定完成？

后面 281 个版本，我们都用这三问来读。

[翻页]

## Slide 09｜Claude Code 281 个版本

这条时间轴把 Claude Code 过去一年粗略分成三段。

第一段是 0.2 时代，我叫它 vibe 段。这个阶段 Skill、Context、Verification 三个维度基本都靠人。人写 prompt，人管上下文，人看输出。

第二段是 1.0 时代，我叫它 SDD 段。这里最重要的是 plan mode。也就是“先想再写”这件事，第一次被做进产品内部。

第三段是 2.x 时代，我叫它 harness 段。Skills、Subagents、Routines、Auto Mode、Managed Agents 这些东西，开始同时工程化三条轴。

右下角那条虚线是 OpenAI 的副线。Codex 0.128.0 把 agent loop 自身 bake 进 `/goal` 命令。也就是说，Anthropic 和 OpenAI 在不同产品里，其实都在做同一件事：重新定义人和 agent 之间的 binding constraint。

[翻页]

## Slide 10｜Vibe 段

先看第一段，Vibe 段。

这个阶段最像大家最早用 Claude Code 的体感：你写一个很长的 prompt，末尾加一句 ultrathink，然后希望模型自己把事情想明白。

这不是贬义。那个阶段很多东西还没有产品化，所以社区确实只能靠 prompt 把工程习惯手工凑出来。

[翻页]

## Slide 11｜三个维度都由我们自己承担

0.2 时代，三个维度基本都在我们自己这边。

Skill 轴上，我们写 prompt。模型能做什么，很大程度上取决于我们怎么描述任务，怎么给约束，怎么把工具使用讲清楚。

Context 轴上，我们管上下文。auto compact 开始帮一点忙，CLAUDE.md 的 `@import` 让上下文可以分文件、可以复用，但本质上仍然是我们自己在决定哪些信息塞进去。

Verification 轴上，我们自己看输出。模型做完以后，是否正确、是否完整、是否值得 merge，还是人亲自判断。

这段的核心是：binding constraint 基本全部在我们这一侧。

[翻页]

## Slide 12｜这一段的核心体感

所以 0.2 时代，社区里大家都在 hack。

Plan 没有产品支持，就把 plan 写成 markdown 文件，让 Claude 照着做。

Ultrathink 当时更像隐藏关键词，没有 `/effort` 这样的显式控制。你想让模型多想一会儿，就每次手动加。

Skill 没有产品形态，大家就互相分享 prompt template。某个任务好用的约束、某个 review 方式、某个 planning prompt，都靠复制粘贴传来传去。

今天回头看，我们当时手工做的，正是后来会被产品内建的东西：plan mode、reasoning effort、skills、context 文件结构。

所以这段不是落后，而是早期工程习惯的原型期。

[翻页]

## Slide 13｜SDD 段

第二段是 SDD 段。

这里的关键词是：先想再写，从 prompt 习惯变成产品按钮。

这一步很重要，因为它说明某个实践已经稳定到值得被产品 bake-in。

[翻页]

## Slide 14｜先想再写

1.0.x 里几个节点连起来看很清楚。

Plan mode 把“先计划，再执行”做成一个产品模式。Hooks 让你可以把某些检查和动作挂到流程里。Subagent 雏形开始把不同任务隔离开。`/todos` 让执行过程里的任务分解变得显式。

这些功能单看都像小 feature，但合在一起，它们在做同一件事：把原来靠人反复提醒模型的工程纪律，变成产品里的结构。

这就是 binding constraint 第一次明显被产品接走。以前你要在 prompt 里说“先别写代码，先给计划”。现在产品直接提供一个入口，默认帮你把这件事放到流程里。

[翻页]

## Slide 15｜OpenAI 同时间在做同样的事

这件事不只发生在 Claude Code。

同一时间，OpenAI 社区在讨论 Plan/Spec mode，GitHub Copilot 有 Plan mode，Cursor 也有 plan-and-act 的路径。不同团队、不同产品，同时把“先 plan 再 do”这个习惯做成显式入口。

所以这页不要读成产品功能比较。重点不是谁更早、谁更好，而是这个 pattern 已经稳定到值得 bake-in。

当四家独立团队都在把同一个 prompt 习惯做成 button，说明这里有一个真实的工程瓶颈：人不应该每次都亲自提醒 agent 先想清楚。

[翻页]

## Slide 16｜但 SDD 不是终点

不过 SDD 不是终点。

它主要工程化了 plan 这一件事，但 skill 怎么发现、context 怎么管理、verification 怎么外显，仍然大量由人承担。

所以 2.x 时代会继续往前走：不只是先想再写，而是把 agent 调什么、看什么、凭什么宣告完成，这三件事都做进 harness。

[翻页]

## Slide 17｜Harness 段

接下来进入第三段，Harness 段。

这一段是今天的主体。

如果说 Vibe 段靠 prompt，SDD 段靠 plan，那么 Harness 段要解决的是：当生成已经很便宜，真正限制结果质量的，不再只是模型本身，而是模型外面那一圈工程系统。

[翻页]

## Slide 18｜当生成成本归零，瓶颈在三件事

这里先重新框定一下 harness。

HumanLayer 有一句话，把 harness engineering 看成 context engineering 的一个子集。这个说法有道理，因为模型确实只通过上下文理解世界。

但如果只讲 context，又会太窄。真实的 agent 系统里，还有它能调用什么工具、它有什么权限、它怎样判断自己完成了。

所以我今天把 harness 压成三轴：Skill、Context、Verification。

当生成成本下降以后，瓶颈不在“能不能写一版代码”。瓶颈在于：它能不能调用正确的能力；它有没有看到足够高信号的信息；它完成以后，有没有一个外显的机制防止它自我感觉良好。

[翻页]

## Slide 19｜三轴看的是责任如何转移

这页是一个总览。

Skill 轴看 action surface：从全部工具预加载，到按需发现、按需加载，再到 routine 这种更高阶的动作包装。

Context 轴看 information surface：从被动 transcript buffer，到 CLAUDE.md、subagent 隔离、progress 文件、auto compact，再到 idle 时复盘和蒸馏。

Verification 轴看 exit condition：从人肉 review，到 in-loop verifier，到外部 grader、rubric、proof pack。

每一轴背后的动作是一样的：原来由人手动承担的责任，先被 harness 显式化，再逐渐被产品内建。

[翻页]

## Slide 20｜三轴在 2026 的产品里长什么样

如果刚才三轴还比较抽象，这页把它钉到三个具体产品形态上。

Skill 轴上，`/goal` 是一个看得见的入口。你说目标，底层去组织动作。

Context 轴上，subagent 像是给任务开了一个新窗口。它不是把所有东西塞进同一个上下文，而是把不同任务隔离开，减少互相污染。

Verification 轴上，Outcomes 代表“写作业”和“改作业”分给不同的人。不要让同一个 agent 一边生成，一边给自己打高分。

这三个例子对应的就是 action、information、exit 三个 surface。

[翻页]

## Slide 21｜Skill 轴

先看 Skill 轴。

这条线不是“prompt 写得更长”，而是把稳定动作包装成 agent 可以发现、加载、调用、调度的能力。

最早 MCP 工具很容易全部装载，结果就是上下文变脏、选择空间变大。后来 skills 出现以后，很多稳定动作可以按需加载。再往后，routine 进一步把一组角色、一段流程、一个周期性职责包装起来。

Boris Cherny 说 routines 是 higher-order prompts，我觉得这个说法很准确。它不是一句 prompt，而是把 prompt、上下文、触发条件和职责边界一起封装起来。

所以 Skill 轴的演进是：从“我每次告诉你怎么做”，到“系统里有一个可调用能力，你需要时自己加载”。

[翻页]

## Slide 22｜Context 轴

再看 Context 轴。

Context 不是越多越好。它是有限资源，而且长上下文不是免费的。窗口越长，噪音越多，模型越可能被低信号内容拖偏。

所以 Context 轴的目标不是塞满窗口，而是提高每个 token 的命中率。

这条线从被动 transcript buffer 开始，到 CLAUDE.md `@import`，再到 subagent 隔离上下文，再到 progress 文件保存中间状态，再到 auto compact，最后到更主动的离线复盘和蒸馏。

你可以把它理解成：从“把历史全给模型”，变成“给模型当前任务最需要的高信号信息”。

[翻页]

## Slide 23｜Verification 轴

第三条是 Verification 轴，也是我自己越来越重视的一条。

完成标准必须外显。不是“让模型多看一眼”，而是把三件事拆开：谁判定完成，用什么 rubric，由谁来读。

这里有一个反直觉点：同一个 agent 很难客观评价自己的输出。它刚写完一段东西，天然会倾向于觉得自己做得不错。

所以更稳的结构是 fresh grader。生成者先生成，另一个干净上下文里的 evaluator 根据 rubric 来读。这个动作一旦外显，很多长程任务的质量会明显变化。

下一页我们看 Anthropic Outcomes 的数字。

[翻页]

## Slide 24｜fresh grader 的数字

Anthropic Outcomes 做的就是把独立 rubric 加外部 grader 变成系统能力。

这页三组数字都来自这个方向：task success 提升大约 10 个百分点，docx 生成质量提升 8.4%，pptx 生成质量提升 10.1%。

这里最值得注意的是：越难的任务，收益越大。简单任务可能本来就能过；真正容易失控的是长程任务、结构化 artifact、复杂修改。

这和后面我讲 roboharness 的 proof pack 是同一个动机：不要指望人一帧帧看完 agent 跑了几小时的过程，也不要指望 agent 自己说“我完成了”就结束。要把完成标准和证据 surface 出来。

[翻页]

## Slide 25｜社区也在做同样的事

这件事也不只是 Anthropic、OpenAI、Cursor 这些大厂在做。

社区也在把工程习惯做成 harness。

mattpocock/skills 是一个很好的例子。它把很多软件工程基本功做成可以调用的 skill，比如 grill-me、grill-with-docs、TDD、重构、review。它背后的判断是：软件开发最常见的失败模式不是不会写代码，而是 misalignment。

GSD / gstack 也在做类似的事，只是包装形态不同。office-hours、CEO-review、autoplan、review，本质上都是把“对齐、计划、执行、验证”这些工程动作显式化。

Superpowers、Awesome Claude Code 这些社区项目也说明，这不是大厂幻觉，而是整个生态在同向收敛。

所以 Software engineering fundamentals matter more than ever。只是这些 fundamentals 正在被封装成 agent 可以调用的 harness。

[翻页]

## Slide 26｜三轴收束

到这里我们先收束一下。

每一轴都经历了同一个动作：人手动承担，harness 显式化，最后产品内建。

Skill 轴上，prompt 变成 skills、tools、routines、`/goal`。

Context 轴上，手工上下文管理变成 import、subagent 隔离、compact、memory、蒸馏。

Verification 轴上，人肉 review 变成 rubric、evaluator、Outcomes、proof pack。

下一段我不继续讲产品，而是讲这套框架在我自己的项目里怎么落地。

[翻页]

## Slide 27｜我的实践

这一节有三个实践，但它不是工具推荐。

我想让每个案例都回答同一个问题：它移走了哪个 binding constraint？

第一个是 roboharness，解决长 unattended run 的 review 问题。

第二个是 routine 多 agent，解决云端重复调度和上下文切换问题。

第三个是 60 分边界，讲哪些活适合云端 routine，哪些活必须切回本地重 harness。

[翻页]

## Slide 28｜roboharness

先讲 roboharness。

它解决的不是“模型有没有视觉”，而是“人有没有时间看完过程”。

如果 agent 跑 4 个小时改机器人代码，中间生成了很多仿真、日志、对比图，人不可能一帧帧看完。真正需要的是把 review 从“盯过程”换成“审证据包”。

所以 roboharness 的定位是一句话：long unattended agent run，最后变成 one proof pack，再变成 short human review。

这个 proof pack 里有 contract，有 phase manifest，有 approval report，有 report.html。人先看 Run Decision banner，再看 surfaced case，再决定要不要重跑某个 phase。

这样 Verification bottleneck 就被工程化了。原来 4 小时的过程，人可能只需要 5 分钟就能做第一轮判断。

[翻页]

## Slide 29｜proof pack 长什么样

这页是一个真实输出，不是手绘示意。

左边的 GIF 是 G1 humanoid 同一个 run 在 Meshcat 和 MuJoCo 里的跨 framework 对比。关键不是它好不好看，而是每一帧都有 phase 名，有状态，有可追踪证据。

右边四张图是 MuJoCo grasp 的不同阶段：pre-grasp、contact、grasp、lift。每个 phase 都有 visual artifact。

这就是 proof pack 的意义。它让你不需要回放全部过程，也能快速看到关键证据：任务有没有到位，哪一步开始偏，是否值得继续跑。

所以 roboharness 主要落在 Verification 轴。它把机器人领域里昂贵的 review bottleneck 压缩成一个可读的证据 surface。

[翻页]

## Slide 30｜routine 多 agent

第二个实践是 routine 多 agent。

这里移走的是调度和上下文切换 bottleneck。

我把工程团队里几个固定角色封装成云端 routine：auto_pr 负责周期性推进 PR，issue_label 负责 issue 分类，pr_again 负责对 PR 做二次推进，daily_duty 负责每天兜底。

这页下面的截图是为了回答一个常见怀疑：云端 agent 听起来很玄，到底是不是真在干活？

所以这里直接看证据：cron 真的在跑，PR 真的在产出，配额真的在被消耗。

这类任务不一定需要本地最重的 harness。它们的共同点是职责固定、周期固定、验证风险可控，很适合放到云端 60 分钟流水线里。

[翻页]

## Slide 31｜routine 跨三轴

routine 不是只落在 Skill 轴。它同时跨 Skill、Context、Verification。

Skill 轴上，它把工程角色包装成可调用 routine。你不需要每次都解释“帮我做一次 issue triage”，这个职责已经被封装。

Context 轴上，每个 routine 都有 fresh context，不会和你本地长 session 混在一起。GitHub issue、comment、label、branch 变成消息总线。

Verification 轴上，关键是三态自评：FULLY、PARTIALLY、DIMINISHING RETURNS。这里 PARTIAL 不是失败，而是云端流水线诚实声明自己的边界。它告诉你：我做到这里，剩下需要人接。

最后 Boundary 也很重要。云端 routine 不是万能的。一旦任务超过资源、时长或验证风险边界，就要交给本地更重的 harness。

[翻页]

## Slide 32｜cloud-first 到切回本地

这里澄清一个常见误会：routine 和 roboharness 不是新旧两代工具。

它们是同一项目在不同资源密度下的两套路由。

roboharness 这个 repo 自己就是这么走过来的。早期很多事情可以让 cloud routine 帮你推进，比如 daily duty、issue 分类、PR 增量。但是一旦任务需要 GPU、真机、单次迭代超过 1 小时，或者需要反复 trial-and-error，cloud routine 的 60 分钟窗口就压不住了。

这时候要切回本地。不是因为云端不好，而是任务资源密度变了。

所以 stop-the-line 信号很简单：需要 GPU 或真机，单次迭代大于 1 小时，预期反复试错。满足任一条，就别硬塞给 cloud routine，直接 wrap 进本地 long-run 加 proof pack。

[翻页]

## Slide 33｜60 分是任务-工具匹配边界

所以“60 分”不是产出完成度，而是任务和工具匹配的边界。

有些活适合 mattpocock/skills。比如需求还很模糊时，先用 grill-me 或 grill-with-docs，让 agent 反问你，把任务约束压实。

有些活适合 GSD / gstack。比如 scope 大、跨文件、需要 discuss / plan / execute / verify 的 phase 结构。

有些活适合 roboharness。比如验证风险高、运行时间长、人不可能看完整过程，就需要 proof pack。

这些工具不是替代关系，而是不同任务类型和验证风险下的 harness specialization。

[翻页]

## Slide 34｜哪类活配哪种 harness

这页是实践部分的收束。

哪类活配哪种 harness，这本身就是工程判断。

如果任务模糊、验证风险高，先规格化，再分 phase。不要急着让 agent 写代码。

如果任务清晰、验证风险高，适合长程执行加证据包。比如 `/goal`、hybrid-phase-pipeline、proof pack。

如果任务模糊但风险不高，先问清楚。用 grill-me、office-hours 这类工具，先把意图压成可执行判断。

如果任务清楚、风险可控，而且重复发生，适合 routine。每小时跑一次、每天兜底，这类固定职责就该被云端流水线吃掉。

这就是我想让大家带走的实践判断：不是“哪个工具最好”，而是“这个任务应该交给哪种 harness”。

[翻页]

## Slide 35｜当下与未来

现在我们回到产品趋势。

当下和未来的一个方向是：用户表面回到 vibe，底层工程化反而更重。

也就是说，你表面上好像又只是在说“帮我完成这个目标”。但这次不一样。底下已经有 skills、permissions、subagents、context management、verification loop 在支撑。

[翻页]

## Slide 36｜/goal

`/goal` 是这个方向很典型的例子。

它不是替代 AGENTS.md、skills、permissions、subagents。它是把这些东西 wrap 成“我说目标”的入口。

Skill 轴上，`/goal <objective>` 把设目标、拆动作、继续推进包装成一个可调用入口。

Context 轴上，loop 状态不再完全靠人手动续写 prompt，而是由 runtime continuation 接住。

Verification 轴上，Ralph loop++ 的重点不是多跑几轮，而是每轮都带着 audit pressure 逼近完成。

所以 `/goal` 表面上很 vibe：我说一句目标。底层其实很 engineering：它在组织 skill、context 和 verification。

[翻页]

## Slide 37｜bake-in 的新失败模态

但 bake-in 不是终点。

Anthropic 2026-04-23 的 quality post-mortem 就是一个很好的提醒：产品把更多责任接走以后，也会引入新的失败模态。

比如 reasoning effort 的 default 改了，用户可能没有感知，但质量会退化。再比如 thinking-history 清理 bug，会影响长 session 的上下文。

这说明产品化不是“从此不用管”。harness 接走的越多，反向出错的成本也越高。以前错在你的 prompt 里，现在可能错在产品默认、runtime continuation、上下文压缩、或者 evaluator 的 rubric 里。

所以工程师的新工作不是消失，而是判断瓶颈现在被移动到了哪里。

[翻页]

## Slide 38｜收尾

现在回到 Karpathy 的困境。

一开始我们说，everything is skill issue。但整场讲下来，我想补一句：skill issue 的边界在移动。

[翻页]

## Slide 39｜skill issue 的边界在移动

有些东西仍然需要我们自己解，比如 judgment。什么活配什么 harness，何时介入，何时放手，这些不是产品能完全替你判断的。

有些机制正在被产品消化，比如 plan、hooks、subagents、outcomes。

有些特定能力正在被 skill 接走。以前你要在 prompt 里再说一遍，现在可以直接调用。

有些重复劳动正在被 routine 接走。每小时一个、每天兜底，这些不该再靠人想起来。

所以下次 agent 失败时，先别问“模型是不是不行”。先问三件事：它能调什么？它看到了什么？谁在判定完成？

这三问能帮你定位问题到底在模型、任务、上下文、工具、还是验证机制。

最后回到今天的 thesis：我们不必再是 binding constraint。但前提是，我们要学会设计和选择合适的 harness。

[翻页]

## Slide 40｜Tips

最后给三个今晚就能做的实验。

我故意说实验，不说建议。因为这场听完最容易的失败模式，是回去收藏一堆工具，想着下周开始整理。真正有用的是今晚或者明早就试一次。

[翻页]

## Slide 41｜实验 1：把 harness 环境整理到最新

第一个实验：把 harness 环境整理到最新。

每天第一件事，升级所有工具。Claude Code、Codex、MCP servers、skills，都别落后太久。

这不是版本洁癖。今天我们讲了一整场，很多能力就是在最近几个版本里被 bake-in 的。你落后两周，可能不是 prompt 写得不好，而是你还停在旧默认里。

同时先准备边界，再减少审批延迟。clean branch、git、CI、secret 边界先到位。边界清楚以后，尽量减少那些可避免的人类审批 prompt。

真正要避免的是：agent 每走一步都要你点一下，最后人又变成 turn-by-turn approval bottleneck。

[翻页]

## Slide 42｜实验 2：先让 agent 问你

第二个实验：先让 agent 问你，再让它干。

可以跑一次 grill-me。让 AI 先反问你需求是否清晰。被盘问过一次，就很难再回到直接写 prompt。

也可以试一次 office-hours，用 YC 风格的 forcing questions，把“我想做个东西”压成几个必须回答的判断。

还有一个很简单的动作：画图给它看。架构、流程、UI 草图，直接截图丢进去。多模态输入通常比 200 字描述稳定得多。

这背后的原则是：对齐比提示词更重要。任务没对齐时，prompt 写得越长，错得越像真的。

[翻页]

## Slide 43｜实验 3：用最好模型跑真实任务

第三个实验：用你能 access 的最好模型跑真实任务。

如果 SaaS frontier model 可以用，就直接用。如果是内部 only 项目，就用你能用到的 top-tier 私有或开源模型。

这里不是说模型万能。恰恰相反，今天整场都在讲 harness 比 model 重要。但 model 也不能成为新的 binding constraint。

很多时候你省下来的 retry、review、上下文重建和返工时间，比模型成本贵得多。

这场 lecture 听完最容易的失败模式，是回去想“我下周开始整这套”。真正的失败模式是什么都不试。

今晚装一个 grill-me，明早跑一个 routine，或者拿一个真实任务试一次 `/goal`，就够你接下来一周看出区别。

[翻页]

## Slide 44｜Bonus：hybrid-phase-pipeline

最后放一个 bonus。

最近我自己用得比较顺的是 hybrid-phase-pipeline。它不是一个全新的框架，而是把几套现有工具粘成一个更适合长程任务的方式。

GSD 负责 discuss、plan、execute、verify 的 phase 结构。

gstack 和 mattpocock/skills 负责 grill、office-hours、autoplan、review 这些前置压实和质量门。

Codex `/goal` 负责持续目标、反复检查和最终收尾。

这套组合的价值在于，它让长程任务既有一个能持续推进的目标入口，又有足够多的中间检查点，不至于一路跑偏到最后才发现。

如果大家要试长程任务，可以从这个方向开始看。

[翻页]

## Slide 45｜这场 lecture 的准备

最后这场 lecture 本身，也是同一套 workflow。

一开始我在 claude.ai 手机端先讨论题目、听众、主线和讲稿骨架。这个阶段适合 cloud-first，因为想法还很模糊，先把方向跑出来就好。

然后回到本地 repo，用完整上下文处理截图、链接、版面、source caption、主题切换和质量检查。这个阶段就需要本地 harness，因为细节很多，而且每个证据都要能对上。

所以这场分享不是只在讲这套 workflow，它本身也是用这套 workflow 准备出来的。

云端负责快速 manifest，本地 harness 负责 context、verification 和最后一公里。

[翻页]

## Slide 46｜Q&A

我的部分就到这里。

最后再收一句：软件工程的 fundamentals 没变，变的是它们装到了谁手里。

我们不必再是 binding constraint，但我们必须学会判断：agent 能调什么，它看到了什么，谁在判定完成。

谢谢大家。接下来欢迎提问。
