# Roboharness：从真实项目抽出来的 Agent 验收层｜逐字稿

> 版本：基于 `index.html` 当前 20 页 deck
> 用途：排练口播稿。方括号里的内容是舞台提示，不需要念出来。

---

## Slide 01｜标题

大家好，我是缪东旭。

今天这场分享叫《Roboharness：从真实项目抽出来的 Agent 验收层》。

先把边界讲清楚：这不是一个单纯介绍工具的分享，也不是只讲一次机器人迁移复盘。它的来源是我们在真实机器人项目里遇到的一个很具体的问题：AI Agent 已经能帮我们改代码、跑仿真、调参数，但一旦任务变长，它就会卡在一个地方——它不知道自己每一步到底做成了没有。

后来我们把这个项目内的经验抽出来，做成了这次 Hackathon 的 Roboharness。所以今天我想讲三件事：第一，真实项目里为什么会需要它；第二，它在真实工作流里到底解决了什么；第三，为什么我们觉得这件事值得从项目里拆出来，变成一个能给更多研发任务复用的东西。

[翻页]

## Slide 02｜一句话定义

整场分享围绕一个问题展开：长程研发里，AI Agent 能不能自己往前跑。

这里的关键不只是模型多聪明。模型当然重要，但在真实工程里，很多时候模型已经能写代码、能改配置、能跑命令、能调参数。真正卡住它长时间自主工作的，是它每改完一步之后，能不能判断：这一步成了没？应该继续，应该回滚，还是应该叫人来看？

如果没有这个判断能力，agent 就只能停留在短任务，或者变成一种 pair programming 形态：它跑一轮，人看一眼，再让它跑下一轮。这个模式有用，但很难支撑几个小时、几十个提交、跨多个模块的长程任务。

Roboharness 要解决的，就是这个判断层。

[翻页]

## Slide 03｜两个月前那张图

这张图是两个月前我们内部分享最后一页。

当时我们已经在做机器人项目里的测试自动化，但那时还更多是一个 vision：下一步，希望让 AI 完全接手这个测试自动化。

注意这里的重点不是“让 AI 完全接手开发”。这句话太大了，也不准确。真正的问题是：如果 agent 要参与一个长程研发任务，它必须能接手一部分验收和判断，否则它每一步都要把人叫回来。

所以今天这场分享，其实就是来汇报这件事后来怎么往前走：我们不是凭空做了一个工具，而是在真实项目里确实遇到了这个问题，然后把它一步步抽成了 Roboharness。

[翻页]

## Slide 04｜真实项目背景

先看真实项目里的状态。

右边这张图是 Unitree G1 在 MuJoCo 和 MeshCat 里的抓取 pipeline 输出。也就是说，机器人不是完全跑不起来，仿真也不是完全没有基础。我们已经有抓取 pipeline，有控制代码，也有一些可视化和调试手段。

但这里要强调一点：这不是一个模型训练项目。我们不是从零训练一个新的机器人模型，而是把已有的模型和控制能力接到我们的机器人应用栈里。真正的工程难点是迁移、接入、调参、状态对齐、验证这些循环。

一旦让 agent 参与这个过程，问题就变得很具体：它可以改一段控制代码，可以修一个接口，可以重新跑仿真。但是每一轮跑完之后，谁判断这一步到底好不好？手指抓住了没？瓶子滑了没？姿态合理吗？接触是不是假阳性？

如果这些判断都要人看，agent 就跑不长。

[翻页]

## Slide 05｜SONIC 迁移

这个问题最尖锐地暴露在一次真实任务里：Decoupled WBC 到 GEAR-SONIC 的迁移。

先解释一下，这里不是训练新模型。Decoupled WBC 是下肢 RL 加上肢 IK 的混合架构，GEAR-SONIC 是一个单一 Transformer 基础模型。我们的工作重点是把已有基础模型和控制方案接进自己的应用栈里。

这件事听起来像“换一个模块”，但实际不是简单替换。接口要对齐，状态要对齐，验证逻辑要重新看，很多旧的假设也要被打破。它是一个长程工程任务：改控制栈，跑仿真，看 artifact，修判据，再继续下一轮。

所以 SONIC 迁移在这里不是唯一主题，而是最容易讲清楚的一个切面。它让一个更一般的问题变得非常明显：agent 长程研发缺少自我验收层。

[翻页]

## Slide 06｜原始循环为什么跑不长

最开始的循环其实很朴素。

Agent 改一轮，比如改控制代码、修接口、调参数，然后重新跑一次仿真。跑完以后，人回来手动看：手指抓住没，瓶子滑了没，姿态和接触是不是合理。然后人再把判断结果告诉 agent，让它继续改下一轮。

这个循环在 pair programming 里没问题。你坐在电脑前，agent 改一轮，你看一眼，再继续，效率是提升的。

但它支撑不了无人值守的长程开发。因为只要人离开，整个循环就断在“没人判断”这里。不是仿真跑不动，也不是 agent 完全不会改，而是没人能一直盯。

所以我们当时真正要做的，不是再写一个更长的 prompt，而是把“判断”做成 agent 可以读取的证据。

[翻页]

## Slide 07｜项目内 Harness 工作流

所以现在我们在项目里跑这类长程任务时，基本会把流程拆成三段。

这不是一个概念图，而是我们希望展示的现状：人负责定义边界，agent 负责在边界里连续跑，人最后回来查证据。

第一段是 Plan，人主导。我们不会把任务直接丢给 agent，而是先拆任务、定边界，把每一步什么叫成、什么叫不成写清楚。

第二段是 Execute，agent 接管。每改一步之后，它会自跑 grasp pipeline，收集 metric 和视觉证据，生成 PASS / FAIL proof pack。这里的关键是 proof pack，不是只有一行日志，而是有一组可以回看的证据。

第三段是 Review，人回来。人不是每一轮都重新理解上下文，而是先看自动判断和 surfaced case，最后再做人工 E2E 兜底。

所以现在真正变掉的，是人的位置。人不再每一轮盯着仿真看，而是在开头把边界写清楚，在结尾看证据和 surfaced case。中间这段，agent 就有机会连续往前跑。

[翻页]

## Slide 08｜测试分工

这里要把一个容易混的点讲清楚：Roboharness 不是替代所有测试。

真实项目里会有很多层验收，它们各自解决不同问题。

Unit tests 适合挡函数、接口、数据结构、边界条件这些代码级问题。比如一个 helper 传错类型，一个解析函数行为变了，这些应该让单元测试挡住。但单元测试不适合判断真实抓取姿态是否合理。

Metric gate 适合挡已知的物理约束，比如距离、接触、高度、速度、阈值。它快、确定性强，适合自动化。但它会漏掉没有提前建模的语义失败。

Visual harness 适合看图像 artifact 里的 unknown unknowns。人一眼能看出来不对的东西，有时很难一开始就写成 metric。

Human E2E 仍然需要存在，尤其是新场景、业务语义、最终取舍。但它不应该每一轮都被打断。

所以目标不是把人拿掉，而是让人只看真正 surfaced 出来的事情。

[翻页]

## Slide 09｜案例 A：拇指朝下抓 bottle

第一个案例来自真实项目录屏。

一开始我们有一个很自然的 metric：抓取中心点和 bottle 中心点的 3D 距离。这个 metric 听起来很合理，因为抓取点确实应该靠近物体。

但 agent 写出的 cuRobo 代码规划出一个非常荒谬的解：整个手是反着抓的，拇指朝下，而不是朝上。

从距离 metric 看，它是 PASS 的。3D 距离确实在阈值内。但你只要打开视频看一眼，就知道这完全不对。

这就是 metric 单独使用时的风险：它会挡住已知错误，但也可能被 agent 找到数学上通过、物理语义上荒谬的解。

这个 case 之后，我们就把手部和拇指朝向沉淀成新 metric。也就是说，visual 先发现新失败模式，然后把这个失败模式 promote 到 metric gate 里，让它以后自动挡住。

[翻页]

## Slide 10｜案例 B：qpos 索引

第二个案例要先划清来源。它不是前面那个内部机器人项目里的 case，而是我们把 Roboharness 迁出来、做成独立 repo 之后，在一个最简 MuJoCo cube grasp 示例里遇到的问题。

这个例子想说明另一面：只靠 visual 也不行。

右边这组 artifact 看起来是合理的。front 和 side 两个视角都像是抓住并抬起来了，视觉上会让人倾向于判断 PASS。

但 metric 报的是 FAIL。日志里会看到 contact OK，但 ASSERT-SUCCESS FAILED，cube z 读出来是 0。

后来反查代码发现，问题不在机器人没抓起来，而在判据代码本身读错了 MuJoCo 的 qpos index。原来 helper 假设 qpos[5] 是 cube z，但实际 cube z 是 qpos[2]。

这个 case 的教训是：visual 不是唯一裁判，metric 也不是天然正确。判据代码本身也需要被 artifact 和代码审查反查校准。

所以我们需要的是双轨证据，而不是把所有判断都交给某一个通道。

[翻页]

## Slide 11｜metric 和 visual 的闭环

这两个案例放在一起，其实想说明一件事：metric 和 visual 不是谁替代谁，它们在闭环里承担的是两个不同角色。

Visual harness 更像发现器。它负责抓 unknown unknowns，也就是我们一开始没有想到、所以还没写成 metric 的失败模式。拇指朝下抓 bottle 就是这种情况。

Metric gate 更像稳态护栏。它负责把已知失败模式自动挡住。只要一个坑被发现，而且能被量化，就应该尽量 promote 到 metric 里。

中间这个 promote 动作很关键：每发现一个新坑，就从 visual 那侧搬到 metric 那侧。这样系统不是每次都靠人看图，而是越来越多失败模式会变成自动化护栏。

这就是我理解的 harness engineering：不是写一次测试就结束，而是不断把失败模式沉淀成 agent 和系统都能执行的边界。

[翻页]

## Slide 12｜真实收益

回到 SONIC 迁移。它能跑下来，核心不是因为 agent 从此不犯错，而是我们把人从每轮验收里拿出来了。

Harness 的成本不是免费。前期要写判据，要跑 good、bad、ambiguous 样例，要调阈值。这个调试期是一次性成本。

但进入稳态之后，普通循环可以让 agent 自己读 PASS / FAIL。只有异常、新颖、复杂的 case，才 surfaced 出来让人处理。

这里的 95%+ 不是公开 benchmark，也不是我想包装成一个行业数据。它只是我们当前小规模真实项目里的经验值。重点不是这个数字本身，而是工作方式的变化：Plan 和 Review 两端有人，中间很多循环可以放手。

这就是长程任务能从“人盯一轮，agent 跑一轮”变成“agent 连续跑，人只看证据包”的原因。

[翻页]

## Slide 13｜为什么抽出来

那为什么不把这套东西留在项目里，非要抽出来参加 Hackathon？

因为我们做完之后发现，这个问题不是机器人抓取独有。

只要是长程研发任务，不管是新功能、迁移、refactor，都会变成多轮循环。每一轮都需要知道：当前状态好不好，是否退化，是否需要人介入。

如果只是项目内脚本，它当然能解决眼前问题。但想让它被更多任务复用，就需要把证据格式稳定下来。比如 artifact layout，Run Decision，surface / suppress 机制，contract、schema、SKILL.md，这些都要从临时脚本变成可复用的边界。

所以 Roboharness 不是把某个项目脚本开源。它真正抽出来的是一层 agent 能读的验收闭环。

[翻页]

## Slide 14｜架构

Hackathon 里，我们把这套判断流程做成了一个更稳定的核心结构。

最上面是 AI Coding Agent 或 CLI。它负责写控制代码、跑验证命令、读回 proof pack。

往下第一层是 Decision Boundary。这里有 contract.py、SKILL.md / schemas，以及 scope / policy。也就是说，边界和判据不是散落在 prompt 里，而是有一个结构化来源。

再往下是 Harness Run。TaskProtocol 定义语义阶段，SimulatorBackend 负责 MuJoCo、MeshCat、LeRobot 这些后端，Checkpoints 负责多视角图像和状态采集。

最后是两条判断通道：Metric Gate 和 Agent Visual Review。Metric 先挡确定性失败；Visual Review 只看 manifest 允许看的图；最后合成 Run Decision，也就是 PASS、FAIL 或需要 surface 给人看的 case。

所以这不是一张漂亮 report，而是一条证据流水线。

[翻页]

## Slide 15｜历史演进

这条线后来从项目内脚本，一步一步变成了 Roboharness repo。

第一阶段是 2026 年 3 月，项目内先把 grasp pipeline 跑起来。当时有 MuJoCo 和 MeshCat 对照，有人工盯图，也有少量 metric。问题不是不会跑，而是不会自己判。

第二阶段是 2026 年 4 月，把验证层独立出来。checkpoint、artifact layout、report.html、Run Decision 这些开始从一次项目经验里抽出来，变成 agent 可以读的结论。

第三阶段是 5 月 20 日左右，Agent Visual Review 进来。我们让同一个 coding agent 在 bounded manifest 里看图，并且每个 visual dimension 都要声明 metric fallback 或者解释为什么不能 metric 化。

第四阶段是 Python spec 到 SKILL.md。contract.py 是手写真值，生成物只是 agent 指南。这样 agent 自己加载边界和判据，而不是每次靠人重新解释。

所以这不是“我们三周神速发明了一个框架”，而是：真实项目里的痛点先出现，然后在 Hackathon 里被产品化。

[翻页]

## Slide 16｜抽象 Demo

抽出来之后，我们做了一个更小的 demo：MuJoCo 方块抓取。

我要特别强调，这不是原始机器人项目本身。前面的 G1、RealMan、SONIC 是我们的真实项目素材。这里展示的是 Roboharness 抽象后的产品形态。

这个页面主要看三个位置。

第一，顶部的 Run Decision。它会告诉 agent 这一轮整体判决是什么，比如 PASS，10 条约束都满足。

第二，No surfaced cases。如果没有任何需要人看的事情，工程师其实不用打开这个页面。clean 的时候它就是给 agent 和 CI 看的。

第三，Constraint Evaluation。这里展示 metric gate 的具体形态：每条物理约束都有 expected、actual、severity。比如 cube_height_mm 大于 5.0，实际是 143.4。

这些信息合起来，才叫 proof pack。它不是“我感觉成功了”，而是“我为什么判断成功，有哪些证据”。

[翻页]

## Slide 17｜Sidenote：这个 repo 自己也是 agent 做的

再补一个 sidenote。

Roboharness 这个 repo 本身也大量由 agent 完成。这里的 257 个 commit，是 Roboharness repo 的统计，不是整个机器人迁移项目，也不是 SONIC 迁移的全部工作量。

其中 172 个是 AI solo，67 个是 AI 协作，也就是 co-authored-by trailer 里能看到 agent 参与。剩下 18 个是 README、docs、gitignore、清理类小提交，或者当时漏加了 trailer。

大概工作流是：先用 Opus 聊出 roadmap，再拆 GitHub issue，然后 routine 每小时自动解 issue，最后人 review PR。

这个部分不是今天的主线，只是一个旁证：我们不仅在做“给 agent 用”的工具，也在真实使用 agent 来把这个 repo 推出来。但主线仍然是前面那件事：长程 agent 研发需要可审计的验收层。

[翻页]

## Slide 18｜Takeaways

最后收三点。

第一，判据先于 prompt。新功能、迁移、refactor 之前，不要只想着怎么写一个更聪明的 prompt。先写清楚什么叫做成，什么必须停下，什么不能改。真正节省的不是 token，而是审查时间。

第二，把验收分层。Unit tests 挡代码错误，metric gate 挡已知失败，visual 抓 unknown unknowns，human E2E 兜底真正复杂的判断。不要指望某一层解决所有问题。

第三，长程 autonomy 的瓶颈是判断。不是让 agent 永远不犯错，而是让它越界时被挡住，边界内能自己继续往前走。SONIC 迁移只是这件事的一个证据，背后的模式可以迁移到很多研发任务里。

所以方向不是只堆模型，而是把判断工程化。

[翻页]

## Slide 19｜当前边界

到今天为止，当前边界也要讲清楚。

目前已经验证得比较多的是 MuJoCo 加 RealMan / G1，任务类型主要是抓取、到达、移动这些机器人任务。

我们还在补的是任务 preset 和判据模板数量。也就是说，要让更多项目更容易接入，还需要更多默认模板。

硬件验证这块也还在补，尤其是 sim-to-real 的真机 evidence 通道。

另外 Agent Visual Review v1 是 2026 年 5 月 20 日刚上的，小规模验证中，不应该被讲成已经非常成熟的大规模系统。

讲这些边界不是为了降低这件事的价值，而是为了让大家知道：如果你想在自己项目里用，应该从哪里开始，哪些地方还需要自己补。

[翻页]

## Slide 20｜Q&A

最后用一句话收尾。

让 agent 跑得久，不是只靠模型突然变强，而是把每一步怎么验收这件事做扎实。

如果我们能把目标、边界、证据和退出条件都工程化，agent 就不再只能做一次性的短任务，而是可以进入更长的研发循环。

这就是 Roboharness 想做的事：从真实机器人项目里抽出来，但目标是服务更多长程 agent 研发任务。

谢谢大家，欢迎提问。
