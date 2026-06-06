# 60K Star 和 50 万美金，怎么选？

> **状态：初稿 v4，等待 review。** 这篇暂存在 Draft 区，没有加入到 `ai-coding/index.md` 的正式发布列表里。审稿/截图/调整确认完成后，再决定是否移回 `ai-coding/` 正式发布。
>
> 同目录的 `outline.md` 是讨论过程中的大纲，`screenshot-checklist.md` 是配图素材清单。
>
> v2 改动：按方案 A 重构——去掉"视角 N"标题、改成钩子小标题、段间补过渡。
>
> v3 改动：在引子段加入个人化背景（intuitive-flow + 推荐过别人 + 供应链危机），让"为什么我会写这篇文章"的动机更清楚。
>
> v4 改动：修正 v2 段的事实错误（v2 没被堵死，jeremymcs 还在做 GSD Pi），加入"独立 AI coding harness 赛道整体难做"的论据（Aider 沉默 / Continue 不死不活 / Warp 4-28 开源 + OpenAI 投资）。改"公司微信群"为"微信群"。

---

5 月 22 日凌晨，GSD（Get Shit Done）项目的创始人 TÂCHES 删除了所有社交账号，抛售代币卷走大约 50 万美金。

GSD 不是一个糊弄人的项目。它是一个面向 Claude Code 的 meta-prompting + 上下文工程框架，60K+ GitHub stars，Pulumi 等主流厂商公开背书。10 天前，它刚拿下 Bags Hackathon 一等奖。

事件曝光后，长期 Collaborator trek-e 在几小时内完成 fork、迁移、改名、发新版的全套接管动作（`open-gsd/get-shit-done-redux`），代码层面几乎是无缝延续。

我是从一个微信群看到这件事的——有人转发了一张 Reddit r/ClaudeAI 的截图。

**这件事对我个人是切肤的。** 我自己有一套 AI coding 工作流叫 [`intuitive-flow`](https://github.com/MiaoDX/intuitive-flow)，GSD 在里面是 implementation 阶段的核心执行引擎。这个工具我推荐过给公司内外不少人。

推荐它的理由很简单——它的 README 第一段写得就很 raw：

> "I'm a solo developer. I don't write code — Claude Code does. Other spec-driven tools exist, but they're all built for 50-person engineering orgs — sprint ceremonies, story points, stakeholder syncs, Jira workflows. I'm not that."

这种"不要花里胡哨的工作流，就想把事情干完"的态度，正好戳中我个人对 AI coding 工具的偏好。GSD 这名字本身就是这个意思——Get Shit Done。

但 5/22 之后，这事多了一层新的意思：**我推荐过 GSD 给那么多人，他们都在用 npm 安装这个包——而原作者卷币跑路前，npm 发布权限还在他手里。** 这是供应链安全的灾难场景。trek-e 的紧急接管避免了最坏情况，但事件本身已经足够让我重新审视一个问题。

不是"这个人为什么跑路"——这话题加密媒体在 24 小时内已经写烂了，结论都是"又一个 crypto rug pull"。

我更想聊的是另一个结构性问题：

**当 Claude Code 和 Codex 这种官方工具开始疯狂"借鉴"社区里优秀的做法时，独立开源维护者还有什么路可以走？**

GSD 是个极端样本，但它的两难是所有 AI coding 开源项目作者面前的真问题。

## 他的告别信里，有一句话是真的

我先说一个不太好听的事实。

TÂCHES 跑路前的告别信里有一句话：

> "GSD Cloud is obsolete. Everything I've worked on for months has now been absorbed directly into tools like the Codex and Claude Code apps."

这话不能全信。他拿这话当跑路借口、行为是错的、对社区不负责——这些都成立。但里面那个**事实判断**——"被官方工具吸收"——是真的。

GSD 的核心思想是什么？Context engineering、spec-driven development、sub-agent 隔离上下文防止 context rot、元提示 + 文档驱动的 agent 工作流。

你看，这些在 2026 年 5 月还有差异点吗？Claude Code 已经原生支持 Skills、Subagents、Plan Mode、CLAUDE.md、Routines。Codex 出了 spec-driven 模式。Anthropic 一口气发了 harness engineering 系列博文。这些原本是 GSD 的"卖点"，现在都成了官方功能的一部分。

**这就是 commoditization（商品化）。**

AI coding 工具的演化速度是历史上罕见的。一个开源项目从"被需要"到"被吸收"，可能只有 6 个月。

Lex 不是没意识到这一点。他做了 GSD v2——这不是 v1 的升级，是架构性转向：从"运行在 Claude Code 之上的 skill 集合"变成"独立 CLI，把 Claude Code 当 backend"，想从下游跳到 Claude Code 的上一层。

要说，**这条路真的非常难**。在大厂围剿下，做独立 AI coding harness 这件事，整个赛道都不好过。Aider（44K+ stars）从 2025 年 8 月开始就没再亲手发过版，社区开 issue 问 "Where is Paul?" 也得不到正经回应。Continue.dev 拿了 YC、融了 $5.1M、产品做了 2 年，始终没真正出圈，典型的"不死不活"。连 Warp 这种 $73M 融资、70 万开发者的成熟商业公司，今年 4 月 28 日也宣布把整个 client AGPL 开源、让 OpenAI 做 founding sponsor——CEO Zach Lloyd 直白讲："we are competing with other highly funded, closed-source competitors"。独立做 closed-source AI coding 工具，硬刚不过 Anthropic、OpenAI、Cursor、Windsurf 这一票钱多人多的大厂和准大厂。

所以 Lex 的焦虑不是凭空的——结构性压力是真的存在的。

但**"难做"和"必须发币跑路"之间，隔着 Aider 的沉默、Continue 的坚持、Warp 的开源转型——也隔着 Lex 自己项目里那些还在做事的人。**

事实上，gsd-2 在 5 月 14 日刚发了 v3.0.0；Lex 跑路当天，主要开发者 Jeremy McSpadden（Flux Labs CEO，commit 数是 Lex 的 3 倍）还在做仓库迁移工作；今天这个项目以 GSD Pi 的名义在 `open-gsd/gsd-pi` 继续活着，5/24 凌晨还在 push。trek-e 则接管了 v1 的 redux 分支。**v2 没被任何人堵死，是 Lex 自己跳船了。**

## 那么，其他人都去哪了

如果只有 Lex 一个人遇到了这种"被吸收"的处境，那这就是个人问题。但事实上跟他处境类似的人不少——而每个人选择的退路都不一样。

**Den Delimarsky → Anthropic。** GitHub Spec Kit 的创建者，原 GitHub Principal Product Engineer。Spec Kit 在他手里冲到 61K+ stars，是整个 GitHub org 中 star 第二多的仓库。2026 年 1 月 9 日他发博客《Wrapping Up My Latest Microsoft Chapter》宣布离职，**两天后** 1 月 11 日发《Hello, Anthropic》："My next chapter is joining Anthropic (yes, that Anthropic) as a Member of Technical Staff."——这是"在大厂做火了 spec-driven，被另一个大厂挖走"。

**Peter Steinberger → OpenAI。** OpenClaw（一个 Claude Code 开源替代）创始人，连续创业者。项目 3 个月内冲到 200K+ stars。2026 年 2 月 15 日 Sam Altman 在 X 公开宣布他加入 OpenAI，"to drive the next generation of personal agents"。这是"独立创业者做火了 harness，被竞品大厂直接挖走"。

**Paul Gauthier → 沉默退场。** Aider 的创建者（前 Inktomi CTO，44K+ stars）。2025 年 8 月后没再亲手发过版，Issue #4613 标题就叫"Where is Paul?"（"He has gone dark on twitter, Paul are you OK???"）。他唯一回应："I am currently busy with other projects."社区已经分叉到 `dwash96/aider-ce`。没人收编他，他也没融到资，就这么静默地把项目交给了接盘人。

**Lex Christopherson → 卷币跑路。** 60K+ stars 项目的创始人，独立音乐人。没被收编，没融资，他选了第四种结局。

**四种结局，四种路径，但本质都是"独立维护者无法持续"。** Anthropic 把 spec-driven 方向的人收走了，OpenAI 把 harness 方向的人收走了，剩下的人要么沉默，要么——跑路。

这不是一个人的道德崩塌，是一整个生态在压力下的群像。

## 那他为什么偏偏选了发币这条路

看完前三种结局，再回头看 Lex 的选择就更刺眼了。

Den 跳大厂、Peter 跳大厂、Paul 沉默退场——这些都是有代价但仍然体面的退路。Lex 为什么偏偏选了那条**毁掉自己十几年职业声誉**的路？

我觉得这里有一个很多人会忽略的点：**这不只是个人道德问题，是结构性激励问题。**

你看 Lex 面前的那个组合：

- 真实身份（Lex Christopherson，公开音乐人，7000 万 Spotify 播放）
- 真实产品（60K+ stars 开源项目）
- 真实奖金（Bags Hackathon 一等奖）
- 平台抽佣机制（Bags 给创作者 1% 交易手续费）
- 易脱手代币（Solana 上的 SPL，DEX 立刻能换 SOL）

**这个组合本身就是新型软跑路（soft rug）的最优结构。**

它绕过了传统骗局的所有警示信号——团队不匿名、产品不空气、合约有 LP 锁、还拿了知名黑客松奖项。但所有抽水通道都保留着。

Lex 跑了，但不能说"换一个人就不会跑"。**整个鼓励维护者发代币的环境，本身就在系统性地激励这类行为。**

我不想给 Lex 洗地。他做的事就是错的，10+ 年积累的真实音乐家身份、115 首正式发行作品、ACM 学历的真实人生背景，让他完全有能力走一条更难但有尊严的路。

但**如果有一天，你做了一个 30K stars 的 Claude Code 工具**，有人来找你说"上我们平台发个 token 吧，黑客松奖金给你 10 万美金，社区有 5 万人帮你拉盘"——你会拒绝吗？

我不敢替你回答。我只能说，**这个选择本来就不该出现在桌面上**。

## Lex 走了，但代码不能没人维护

Lex 跑了。代码不会自己消失——所以 trek-e 出现了。

这次事件里最让我尊敬的，不是任何一个跑路的人，也不是任何一个事后冷嘲热讽的 X 大 V，而是这个北卡的硬件工程师。

他是谁？GitHub 自报名字 Tom Boucher。在原 GSD 项目里至少从 4 月 25 日起就是 Collaborator。Lex 4 月初私下消失之后，他一个人维持了仓库 6-7 周。跑路事件爆发当天，他几小时内完成了 fork、迁移 229 个 tags、77 个 issues、改 npm 包名、发声明。

他从这件事里得到什么？目前看起来：**什么都没有**。没有新代币，没有捐赠地址，没有商业化跟进，接管了一个 60K+ stars 但被 rug 污染过、未来商业前景未知的烂摊子。

他在 README 顶部写的那段话特别清醒：

> "I have no inside information beyond what is publicly visible. I am stating absence-of-information deliberately — absence of news is not the same as evidence."

这是开源生态健康的体现：**总有人在原维护者出问题时愿意无偿接盘。**

但我想问一个不太乐观的问题：**这种模式可持续吗？**

trek-e 能扛 6-7 周，能扛 6-7 个月吗？当代码库的 issue 累积到 500+，当下游用户开始为 v2 v3 提需求，当 Claude Code 又出了新功能让 GSD 又得跟一轮重构——trek-e 还能继续无偿做这件事吗？

如果不能，下一个 trek-e 会出现吗？

**开源世界的"雷锋"是真实存在的，但他们承担的是个人代价。** GSD 这次有 trek-e，下一次呢？

## 让我们替 Lex 算一笔账

trek-e 在做加法，Lex 在做减法。我们替 Lex 把这笔减法算一下，看看亏不亏。

**他放弃的：** 60K+ GitHub stars 项目（AI coding 圈真实的 reputation 资产）；10+ 年真实音乐家身份（7000 万 Spotify 播放、115 首发行）；项目处在巅峰期的潜在融资可能；Pulumi 等厂商的公开背书；Anthropic / OpenAI 收编邀请的可能性（参考 Den 和 Peter）；未来任何一个 YC 创业方向的可信度。

**他得到的：** 大约 50 万美金现金（实际可能更少，要走 CEX、付税、应付追查）；永久的 "crypto exit scammer" 标签；极可能被英国 Action Fraud / 哥斯达黎加监管调查的风险；音乐人身份的连带污染（house 圈不大，朋友圈传得快）。

**这笔账，怎么看都亏了。**

50 万美金 vs 一个 60K stars 项目的**十年复利**——是十年内可能产生的咨询费、演讲费、CTO offer、book deal、conference 邀请、个人品牌价值。

但 Lex 选了一次性套现。

为什么？我猜，跟那种**身处一个谁都不看好的赛道**的焦虑有关。当他看到 Aider 沉默、Continue 不死不活、Warp 都被逼到开源，再看 Claude Code 一周一个新功能、把社区的"创新"一个个收编成 default 配置——那种"我做的所有努力可能注定无解"的焦虑，可能比"做完 10 年得到 X"的远期收益更难承受。

**短期焦虑战胜长期理性，是人之常情。**

但在加密货币的环境里，这种焦虑会被立即兑现为一个"现在抛售"的具体选项——这是这个环境最危险的部分。它把"我想跑路"和"我能跑路"之间的距离压缩到了零。

## 如果你正在做一个 Claude Code 工具

说了这么多结构性问题，回到具体的人——如果你就是下一个有可能面对 Lex 处境的人，你该做什么。

我没有完整答案，但有三件事可以分享。

**1. 接受 commoditization 是常态。** 你做的好东西被大厂吸收，是赞美，不是悲剧。它说明你做对了。Den Delimarsky 的 Spec Kit 完成它的使命，他自己也找到了下一站。这不丢人，反而是 healthy exit。

**2. 不要把项目和代币绑定。** 信任一旦坍塌就回不来。再多的钱也买不回 GitHub 上那 60K 颗星代表的 60K 个真实开发者的信任。

**3. 把开源项目当"咨询牌照"而不是"变现工具"。** 它是你简历上最贵的一行，是你未来 10 年所有职业选择的杠杆——不是用来一次性兑现的支票。

## 写在最后

GSD 不会是最后一个。在 Anthropic 和 OpenAI 互相竞争、互相吸收社区做法、互相挖人的时代，独立维护者的处境只会越来越紧。

但希望 GSD 是一个**被认真讨论过**的样本——而不是又一个被忘记的加密货币新闻头条。

它至少提醒所有还在做 AI coding 开源项目的人：在你的下一个版本发布之前，先想清楚——**6 个月后你会去哪？**

---

## 参考

- redux 仓库：https://github.com/open-gsd/get-shit-done-redux
- trek-e 的事件声明：https://github.com/open-gsd/get-shit-done-redux/discussions/109
- GSD Pi（v2/v3 的延续）：https://github.com/open-gsd/gsd-pi
- Den Delimarsky 离职博客：https://den.dev/blog/microsoft-chapter-wrap/
- Den Delimarsky 入职 Anthropic：https://den.dev/blog/anthropic/
- Sam Altman 宣布 Peter Steinberger 加入 OpenAI：TechCrunch / CNBC 2026-02-15
- Aider Issue #4613 "Where is Paul?"：https://github.com/Aider-AI/aider/issues/4613
- Warp 开源公告（2026-04-28）：https://www.warp.dev/blog/warp-is-now-open-source
- Continue.dev 融资信息：https://www.ycombinator.com/companies/continue
- Bags Hackathon 公告：https://www.businesswire.com/news/home/20260310779306/
