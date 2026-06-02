# Roboharness：从真实项目抽出来的 Agent 验收层｜逐字稿

> 版本：基于 `index.html` 当前 21 页 deck
> 用途：排练口播稿。方括号里的内容是舞台提示，不需要念出来。

---

## Slide 01｜标题

大家好，我是缪东旭。

今天这场分享叫《Roboharness：从真实项目抽出来的 Agent 验收层》。标题里有两个关键词：一个是 Roboharness，一个是验收层。

我想先把问题抛出来：现在的 coding agent 已经很会改代码、跑命令、调参数了。但只要任务一长，它会卡在一个很尴尬的位置——它做完一轮之后，并不知道自己到底做成了没有。

在短任务里，这件事不明显。agent 改一轮，人看一眼，然后继续。但在真实机器人项目里，这个循环很快就撑不住了。因为每一轮都要有人回来判断：这次是不是抓住了？是不是只是看起来像抓住？有没有引入新的退化？

Roboharness 就是从这个卡点里抽出来的。它不是为了让 agent 更会“猜”，而是把每一步怎么验收，变成 agent、CI 和工程师都能读的证据。

今天我会讲三件事：真实项目里这个问题怎么暴露出来；我们怎么把验收做成 metric 和 visual 的双轨证据；以及为什么最后把它从项目脚本抽成了 Roboharness。

[翻页]

## Slide 02｜一句话定义

如果只用一句话定义 Roboharness，我会说：它是给长程研发 agent 用的自我验收层。

长程研发里，真正难的不是让 agent 做一次改动。一次改动现在已经不稀奇了。真正难的是让它连续往前跑：改代码，跑验证，读结果，再决定下一步是继续、回滚，还是把问题 surface 给人。

这中间缺的就是判断。没有判断层，agent 就只能停在 pair programming：它每走一步，都要等人回来给一个“可以继续”的信号。

所以 Roboharness 关心的不是“模型是不是足够聪明”，而是一个更工程化的问题：我们能不能把 done condition、失败边界和证据格式写清楚，让 agent 在这些边界里自己跑得更久。

这就是今天这条主线：长程 autonomy 的瓶颈，很多时候不是 prompt，而是验收。

[翻页]

## Slide 03｜两个月前那张图

这张图是今天故事的起点。

两个月前，我们在内部分享里已经画过一个目标：下一步，让 AI 接手测试自动化。那时它更像一句 vision，有一点理想化，也有一点好玩。

但这句话后来在真实项目里变得非常具体。它不是说 AI 要完全接手开发，也不是说人不再负责。它真正指向的是：当 agent 参与一个长程研发任务时，不能每一步都把人叫回来做验收。

所以今天这场分享，其实是回来交作业。两个月前我们说，希望 AI 接手一部分测试自动化；后来在机器人迁移项目里，这件事真的被逼出来了，而且不只是一个项目脚本，最后变成了 Roboharness 这层抽象。

这张图我会保留在这里，因为它很直观：一开始看起来像愿景的东西，最后是被真实工程问题推着落地的。

[翻页]

## Slide 04｜真实项目背景

先看真实项目里的状态。

右边这张图是 Unitree G1 在 MuJoCo 和 MeshCat 里的抓取 pipeline 输出。也就是说，我们不是从一片空白开始。机器人能跑，仿真能跑，抓取 pipeline、控制代码、可视化和调试工具也都有基础。

真正麻烦的是把这些能力接进自己的应用栈之后，每一轮都要验证它到底有没有变好。接口要对齐，状态要对齐，参数要调，控制逻辑要迁移，仿真 artifact 还要能解释。

一旦 agent 参与进来，问题就变得很具体。它可以修一段接口，可以改一段控制代码，可以重新跑仿真；但跑完之后，谁来判断这一步是不是成功？

瓶子靠近了，不等于抓对了。手指接触了，不等于真的稳定。画面看起来像成功，也可能是判据代码读错了状态。

如果这些判断每一轮都要人看，agent 就跑不长。

[翻页]

## Slide 05｜SONIC 迁移

这个问题最尖锐地暴露在一次真实任务里：Decoupled WBC 到 GEAR-SONIC 的迁移。

这里的背景可以简单理解成：我们不是从零训练一个新模型，而是把已有的基础模型和控制方案接到自己的机器人应用栈里。Decoupled WBC 是下肢 RL 加上肢 IK 的混合架构，GEAR-SONIC 是一个单一 Transformer 基础模型。

听起来像是“换一个模块”，但实际不是。迁移过程中，接口、状态、控制假设、验证逻辑都会被重新打开。很多错误不会以编译失败的形式出现，而是出现在仿真画面、接触状态、姿态和高度这些地方。

所以 SONIC 迁移在这套分享里不是唯一主题，而是一个非常清楚的切面。它把一个更一般的问题暴露出来：agent 可以参与长程研发，但它缺少一个能持续自我验收的环境。

[翻页]

## Slide 06｜原始循环为什么跑不长

最开始的循环其实很朴素。

Agent 改一轮控制代码、接口或者参数，然后重新跑一次仿真。跑完以后，人回来打开 artifact，看手指是不是抓住，瓶子有没有滑，姿态和接触是否合理。看完以后，人再把判断告诉 agent，让它继续下一轮。

这个模式在 pair programming 里是有价值的。你坐在电脑前，agent 改一轮，你看一眼，再让它继续，效率会提升。

但它支撑不了无人值守的长程开发。只要人离开，整个循环就断在“没人判断”这里。

我们后来意识到，继续把 prompt 写得更长，解决不了这个问题。真正要补的是另一层东西：把人脑里的验收判断，做成 agent 能读、能复查、能积累的证据。

也就是从“agent 跑完等人看”，变成“agent 跑完先拿到一包可审计证据”。

[翻页]

## Slide 07｜项目内 Harness 工作流

于是我们把项目里的长程任务拆成三段：Plan，Execute，Review。

第一段是 Plan，人来定边界。我们不会把一个模糊任务直接扔给 agent，而是先把目标、非目标、done condition、必须停下来的情况写清楚。这里写得越清楚，后面 agent 越不需要猜。

第二段是 Execute，agent 在边界内连续跑。每改一步，它会自己跑 grasp pipeline，收集 metric、截图、checkpoint 和日志，生成 PASS / FAIL 的 proof pack。注意这里不是只有一句“测试通过”，而是一组可以回看的证据。

第三段是 Review，人回来查证据。人不再每一轮重新理解上下文，而是先看自动判决，再看 surfaced case，最后做人工 E2E 兜底。

右边两张 task 截图想表达的也是这件事：任务不只是被拆成 TODO，而是被拆成一串能执行、能验收、能回看的步骤。

人的位置变了。人仍然定义目标，也仍然承担最终责任；但人不必一直盯在中间那几十轮机械验收上。中间这段，agent 才有机会连续往前跑。

[翻页]

## Slide 08｜测试分工

这里需要把分工讲清楚：Roboharness 不是替代所有测试，也不是把人从系统里拿掉。

真实项目里，验收应该分层。

Unit tests 负责挡代码级错误：函数、接口、数据结构、边界条件。这一层很快，很稳定，但它判断不了一个真实抓取姿态是否合理。

Metric gate 负责挡已知的物理约束，比如距离、接触、高度、速度和阈值。它适合自动化，也适合给 agent 一个明确的 PASS / FAIL 信号。

Visual harness 负责看 artifact 里的 unknown unknowns。很多东西人一眼能看出来不对，但一开始很难写成 metric。

Human E2E 仍然保留，尤其是新场景、业务语义和最终取舍。区别是，人应该看被 surfaced 出来的事情，而不是每一轮都被打断。

所以这页的重点是：不是单点替代，而是把验收分层，让每一层做自己最擅长的判断。

[翻页]

## Slide 09｜案例 A：拇指朝下抓 bottle

第一个案例来自真实项目录屏。

一开始我们有一个很自然的 metric：抓取中心点和 bottle 中心点的 3D 距离。这个判据听起来合理，因为抓取点确实应该靠近物体。

但 agent 写出的 cuRobo 代码规划出一个很荒谬的解：整个手是反着抓的，拇指朝下，而不是朝上。

从距离 metric 看，它是 PASS 的。3D 距离确实在阈值内。但你只要打开视频看一眼，就会知道这不是一次合理的抓取。

这个 case 很典型：metric 可以挡住已知错误，但也可能被 agent 找到一个“数学上过关、物理语义上离谱”的解。

所以 visual 在这里先扮演发现器。它发现了一个我们一开始没写进 metric 的失败模式。之后我们把手部姿态和拇指朝向沉淀成新的 metric，让它以后自动挡住。

这就是第一层闭环：visual 发现新坑，metric 把新坑固化成护栏。

[翻页]

## Slide 10｜案例 B：qpos 索引

看到第一个 case，很容易得到一个结论：那就多写 metric。

我们一开始也会这么想。但第二个 case 很快提醒我们，事情没有那么简单。

这个例子来自 Roboharness 独立出来之后的一个最简 MuJoCo cube grasp demo。它不是前面内部机器人项目的 case，但它很好地说明了另一面：visual 也不能当唯一裁判。

右边这组 artifact 看起来挺合理。front 和 side 两个视角里，cube 都像是被抓住并抬起来了。单看视觉，很容易倾向于判断 PASS。

但 metric 报的是 FAIL。日志里 contact OK，说明接触是有的；但 ASSERT-SUCCESS FAILED，cube z 读出来是 0。

后来反查代码发现，机器人其实不是完全没抓起来，问题在判据代码自己读错了 MuJoCo 的 qpos index。helper 假设 qpos[5] 是 cube z，但实际 cube z 是 qpos[2]。

这个 case 的反转在于：有时候错的不只是策略，也可能是验收代码本身。

所以我们不能把所有信任都押在 visual，也不能把所有信任都押在 metric。我们需要的是双轨证据，以及当两条证据冲突时能回到 artifact 和代码里复查的机制。

[翻页]

## Slide 11｜metric 和 visual 的闭环

把两个 case 放在一起，就能看清楚 metric 和 visual 的关系。

它们不是谁替代谁，而是在闭环里扮演两个角色。

Visual harness 更像发现器。它负责抓 unknown unknowns，也就是那些我们一开始没有想到、还没有写成 metric 的失败模式。拇指朝下抓 bottle 就是这种情况。

Metric gate 更像稳态护栏。只要一个失败模式被发现，而且可以量化，就应该尽量 promote 到 metric 里。这样下次 agent 再碰到同类问题，系统不用重新靠人看图。

中间这个 promote 动作很关键。每发现一个新坑，就把它从 visual 那边搬到 metric 这边。久而久之，系统不是只积累日志，而是在积累可执行的判断边界。

所以 Mitchell Hashimoto 讲 engineer the harness，我觉得在机器人这个场景里几乎是字面意义上的。我们不是写一次测试就结束，而是在不断工程化“什么叫做成”。

[翻页]

## Slide 12｜真实收益

回到 SONIC 迁移，它能跑下来，关键不是 agent 从此不犯错。

关键是我们把人从每一轮验收里拿出来了。

Harness 的前期成本并不低。要写判据，要准备 good、bad、ambiguous 样例，要调阈值，也要处理 metric 和 visual 不一致的情况。

但一旦进入稳态，普通循环就可以让 agent 自己读 PASS / FAIL。只有异常、新颖、复杂，或者两条证据互相打架的 case，才 surface 给人。

这里的 95%+ 不是公开 benchmark，我也不想把它包装成行业数据。它只是我们当前小规模真实项目里的经验值。真正重要的不是这个数字，而是工作方式的变化。

过去是人盯一轮，agent 跑一轮。现在是 Plan 和 Review 两端有人，中间很多循环可以放手。

这就是长程任务能往前走的原因：不是 agent 永远正确，而是它有了可读取、可复查、可退出的验收层。

[翻页]

## Slide 13｜为什么抽出来

做到这里，项目内脚本其实已经能解决眼前问题了。

那为什么还要抽出来，做成 Hackathon 的 Roboharness？

因为我们后来发现，机器人抓 bottle 只是一个样本。真正可复用的不是某个抓取脚本，而是这套“每轮研发怎么验收”的证据协议。

只要是长程研发任务，不管是新功能、迁移还是 refactor，都会进入多轮循环。每一轮都要回答同样几个问题：当前状态好不好？有没有退化？是不是可以继续？需不需要人介入？

如果只是项目内脚本，这些答案会散在命令、日志、截图和口头判断里。要复用，就必须把证据格式稳定下来：artifact layout、Run Decision、surface / suppress 机制、contract、schema、SKILL.md。

所以 Roboharness 不是把一个机器人脚本开源。它抽出来的是一层 agent 能读、工程师能审、CI 能接的验收闭环。

[翻页]

## Slide 14｜架构

Hackathon 里，我们把这套判断流程整理成一个更稳定的结构。

最上面是 AI Coding Agent 或 CLI。它负责改代码、跑验证命令、读取 proof pack，并根据结果继续下一步。

下面第一层是 Decision Boundary。这里有 contract.py、SKILL.md、schemas，以及 scope 和 policy。换句话说，边界不再只写在 prompt 里，而是有结构化来源。

再往下是 Harness Run。TaskProtocol 定义任务语义阶段，SimulatorBackend 负责 MuJoCo、MeshCat、LeRobot 这些后端，Checkpoints 负责多视角图像和状态采集。

最后进入两条判断通道：Metric Gate 和 Agent Visual Review。Metric 先挡确定性失败；Visual Review 在 bounded manifest 里看图；最后合成 Run Decision，也就是 PASS、FAIL，或者需要 surface 给人看的 case。

所以这页不是想展示一个漂亮 report。它要表达的是：验收被做成了一条证据流水线，agent 不是凭感觉继续，而是拿着证据继续。

[翻页]

## Slide 15｜历史演进

这条线不是三周里凭空发明出来的。

第一阶段是 2026 年 3 月，项目内先把 grasp pipeline 跑起来。当时有 MuJoCo 和 MeshCat 对照，有人工盯图，也有少量 metric。问题不是不会跑，而是每轮都要人来判。

第二阶段是 2026 年 4 月，把验证层独立出来。checkpoint、artifact layout、report.html、Run Decision 开始从一次项目经验里抽出来，变成 agent 可以读的结论。

第三阶段是 Agent Visual Review 加进来。我们让同一个 coding agent 在 bounded manifest 里看图，并且每个 visual dimension 都要声明 metric fallback，或者解释为什么暂时不能 metric 化。

第四阶段是 Python spec 到 SKILL.md。contract.py 是手写真值，生成物只是 agent 指南。这样 agent 自己加载边界和判据，而不是每次等人重新解释。

最近还有第五阶段：Roboharness 开始验收自己。内部 repo 接入 Roboharness，真实开发任务反过来喂给这套验收层。

所以这里真正发生的，不是 agent 突然变聪明了，而是边界、证据和判断被写得越来越清楚。

[翻页]

## Slide 16｜抽象 Demo

抽出来之后，我们做了一个更小的 demo：MuJoCo 方块抓取。

我想特别说明一下，这不是原始机器人项目本身。前面的 G1、RealMan、SONIC 是真实项目素材；这里展示的是 Roboharness 抽象后的产品形态。

如果大家后面想自己看，页面在 miaodx.com/roboharness/grasp/。

这页主要看三个位置。

第一，顶部的 Run Decision。它直接告诉 agent 这一轮整体判决是什么，比如 PASS，10 条约束都满足。

第二，No surfaced cases。如果没有任何需要人看的事情，工程师其实不用打开这个页面。clean 的时候，它主要是给 agent 和 CI 读的。

第三，Constraint Evaluation。这里展示 metric gate 的具体形态：每条物理约束都有 expected、actual 和 severity。比如 cube_height_mm 大于 5.0，实际是 143.4。

这些信息合起来才叫 proof pack。它不是“我感觉成功了”，而是“我为什么判断成功，以及证据在哪里”。

[翻页]

## Slide 17｜Sidenote：这个 repo 自己也是 agent 做的

这里补一个 sidenote，讲快一点。

Roboharness 这个 repo 本身也大量由 agent 完成。这里的 272 个 commit，是 Roboharness repo 截至 2026 年 6 月 1 日下午 3 点 42 分的统计。它不是整个机器人迁移项目，也不是 SONIC 迁移的全部工作量。

其中 172 个是 AI solo，也就是 Claude 或 Codex 直接作为 author。71 个是 AI 协作，也就是 co-authored-by trailer 里能看到 agent 参与。剩下 29 个是 README、docs、gitignore、清理类小提交，或者当时漏加了 trailer。

大概工作流是：先用 Opus 聊 roadmap，再拆 GitHub issue，然后 routine 每小时自动解 issue，最后人 review PR。

这页不是今天的主线，只是一个 dogfooding 证据。我们不只是做一个“给 agent 用”的工具，也在真实用 agent 把这个 repo 推出来。

但主线仍然是前面那件事：长程 agent 研发需要可审计的验收层。

[翻页]

## Slide 18｜Takeaways

最后收三点。

第一，判据先于 prompt。做新功能、迁移、refactor 之前，不要只想着怎么写一个更聪明的 prompt。先写清楚什么叫做成，什么必须停下，什么不能改。真正节省的不是 token，而是审查时间。

第二，把验收分层。Unit tests 挡代码错误，metric gate 挡已知失败，visual 抓 unknown unknowns，human E2E 兜底真正复杂的判断。不要指望某一层解决所有问题。

第三，长程 autonomy 的瓶颈是判断。目标不是让 agent 永远不犯错，而是让它越界时被挡住，在边界内能自己继续往前走。

SONIC 迁移只是一个证据。背后的模式可以迁移到很多研发任务里：只要任务是多轮的，只要每轮都需要验收，就会遇到同样的问题。

所以方向不是只堆模型，而是把判断工程化。

[翻页]

## Slide 19｜当前边界

当然，到今天为止，边界也要讲清楚。

目前验证得比较多的是 MuJoCo 加 RealMan / G1，任务类型主要是抓取、到达、移动这些机器人任务。

还在补的是任务 preset 和判据模板数量。也就是说，要让更多项目更容易接入，还需要更多默认模板。

硬件验证这块也还在补，尤其是 sim-to-real 的真机 evidence 通道。

另外 Agent Visual Review v1 是 2026 年 5 月 20 日刚上的，现在还是小规模验证中，不应该讲成已经成熟的大规模系统。

讲这些边界不是为了降低价值，而是为了让大家知道怎么正确使用它：从明确目标、边界和证据格式开始，不要一上来就期待它替代所有人工判断。

[翻页]

## Slide 20｜从 /goal + intuitive-flow 开始

在 Q&A 之前，我想把这件事落到一个更具体的入口。

如果大家想在自己的项目里试这套工作流，我建议不要从“装一个工具”开始，而是从 `/goal` 加 `intuitive-flow` 开始。

项目地址也放在这页上：github.com/MiaoDX/intuitive-flow。

左边这张图是我们最近在用的默认流程：先把模糊想法压成目标和边界，再形成计划和 source of truth，然后进入执行、验证、proof pack 和收尾。

第一步，把目标写进 `/goal`。不要只写“帮我做一下”，而是把 objective、non-goals、done condition 放到同一个入口里。

第二步，让 `intuitive-flow` 先反问。用 grill、office-hours、docs/plans、autoplan、GSD 这些环节，把模糊想法压成可执行判断。

第三步，用 proof pack 做 review。人不再逐轮盯过程，而是看 source of truth、运行证据、测试结果和 surfaced case。

右边两个截图是我们现在实际使用里的 demo。它不是一套全新的口号，而是把我们已经在用的长程研发方式，整理成别人也能复用的入口。

所以如果今天只带走一个动作，就是：下一个稍微复杂一点的真实任务，先用 `/goal + intuitive-flow` 跑一次。

[翻页]

## Slide 21｜Q&A

最后用一句话收尾。

让 agent 跑得久，不是只靠模型突然变强，而是把每一步怎么验收这件事做扎实。

这页中间这句英文是：Get ourselves out of the loop。

我对这句话的理解，不是把人从责任里拿掉，而是把人从每一轮机械验收里拿出来。人仍然定义目标，设边界，审证据，做最终取舍；但不需要在每一次仿真结束后都回来当肉眼测试器。

如果我们能把目标、边界、证据和退出条件都工程化，agent 就不再只能做一次性的短任务，而是可以进入更长的研发循环。

这就是 Roboharness 想做的事：从真实机器人项目里抽出来，但目标是服务更多长程 agent 研发任务。

这里也放了公众号和个人微信，大家后面可以继续交流。

谢谢大家，欢迎提问。
