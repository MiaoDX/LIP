# 60K Star 和 50 万美金，怎么选？

> **状态：初稿 v1，等待 review。** 这篇还没发布，没有加入到 `ai-coding/index.md` 的列表里。审稿/截图/调整确认完成后，再决定是否正式发布。
>
> 同目录的 `outline.md` 是讨论过程中的大纲，`screenshot-checklist.md` 是配图素材清单。

---

5 月 22 日凌晨，GSD（Get Shit Done）项目的创始人 TÂCHES 删除了所有社交账号，抛售代币卷走大约 50 万美金。

GSD 不是一个糊弄人的项目。它是一个面向 Claude Code 的 meta-prompting + 上下文工程框架，60K+ GitHub stars，Pulumi 等主流厂商公开背书。10 天前，它刚拿下 Bags Hackathon 一等奖。

事件曝光后，长期 Collaborator trek-e 在几小时内完成 fork、迁移、改名、发新版的全套接管动作（`open-gsd/get-shit-done-redux`），代码层面几乎是无缝延续。

但我看完整个事件，关注点不在"这人为什么跑路"。这件事 24 小时已经被各路加密媒体写烂了，结论都是"又一个 crypto rug pull"。

我更想聊的是另一个更结构性的问题：

**当 Claude Code 和 Codex 这种官方工具开始疯狂"借鉴"社区里优秀的做法时，独立开源维护者还有什么路可以走？**

GSD 是个极端样本，但它的两难是所有 AI coding 开源项目作者面前的真问题。

## 视角一：被吸收的不只是思想

我先说一个不太好听的事实。

TÂCHES 跑路前的告别信里有一句话：

> "GSD Cloud is obsolete. Everything I've worked on for months has now been absorbed directly into tools like the Codex and Claude Code apps."

这话不能全信。他拿这话当跑路借口、行为是错的、对社区不负责——这些都成立。但里面那个**事实判断**——"被官方工具吸收"——是真的。

GSD 的核心思想是什么？Context engineering、spec-driven development、sub-agent 隔离上下文防止 context rot、元提示 + 文档驱动的 agent 工作流。

你看，这些在 2026 年 5 月还有差异点吗？Claude Code 已经原生支持 Skills、Subagents、Plan Mode、CLAUDE.md、Routines。Codex 出了 spec-driven 模式。Anthropic 一口气发了 harness engineering 系列博文。这些原本是 GSD 的"卖点"，现在都成了官方功能的一部分。

**这就是 commoditization（商品化）。**

AI coding 工具的演化速度是历史上罕见的。一个开源项目从"被需要"到"被吸收"，可能只有 6 个月。

Lex 不是没意识到这一点。他做了 GSD v2，这个版本不是 v1 的升级——是架构性转向：从"运行在 Claude Code 之上的 skill 集合"变成"独立 CLI，把 Claude Code 当 backend"，想从下游跳到 Claude Code 的上一层。

但 v2 的商业模式建立在"用户用 Claude Pro/Max 订阅来跑独立 harness"上。2026 年 Q1 Anthropic 开始系统性收紧这条路——1 月静默封 OAuth，2 月修改 ToS 明文禁止，4 月对 OpenClaw、OpenCode 等所有第三方 harness 全面断奶。v2 的路也被堵死了。

你做一个 skill，会被吸收（v1 的命运）。你做一个独立 CLI，会被卡商业模式（v2 的命运）。

### 然后我们看看，跟 Lex 处境类似的人都去哪了

**Den Delimarsky → Anthropic。** GitHub Spec Kit 的创建者，原 GitHub Principal Product Engineer。Spec Kit 在他手里冲到 61K+ stars，是整个 GitHub org 中 star 第二多的仓库。2026 年 1 月 9 日他发博客《Wrapping Up My Latest Microsoft Chapter》宣布离职，**两天后** 1 月 11 日发《Hello, Anthropic》："My next chapter is joining Anthropic (yes, that Anthropic) as a Member of Technical Staff."——这是"在大厂做火了 spec-driven，被另一个大厂挖走"。

**Peter Steinberger → OpenAI。** OpenClaw（一个 Claude Code 开源替代）创始人，连续创业者。项目 3 个月内冲到 200K+ stars。2026 年 2 月 15 日 Sam Altman 在 X 公开宣布他加入 OpenAI，"to drive the next generation of personal agents"。这是"独立创业者做火了 harness，被竞品大厂直接挖走"。

**Paul Gauthier → 沉默退场。** Aider 的创建者（前 Inktomi CTO，44K+ stars）。2025 年 8 月后没再亲手发过版，Issue #4613 标题就叫"Where is Paul?"（"He has gone dark on twitter, Paul are you OK???"）。他唯一回应：「I am currently busy with other projects.」社区已经分叉到 `dwash96/aider-ce`。没人收编他，他也没融到资，就这么静默地把项目交给了接盘人。

**Lex Christopherson → 卷币跑路。** 60K+ stars 项目的创始人，独立音乐人。没被收编，没融资，他选了第四种结局。

**四种结局，四种路径，但本质都是"独立维护者无法持续"。** Anthropic 把 spec-driven 方向的人收走了，OpenAI 把 harness 方向的人收走了，剩下的人要么沉默，要么——跑路。

这不是一个人的道德崩塌，是一整个生态在压力下的群像。

## 视角二：这不是个人选择，是诱因结构

Lex 选了第五条路：**发币**。

把 GSD 项目和 Solana 上的 $GSD 代币绑定，通过 Bags（一个创作者经济 launchpad）发行，进 DoraHacks 黑客松拿奖金，吸引用户买币推高估值，然后……卷走。

这里有一个很多人会忽略的点：**这不只是个人道德问题，是结构性激励问题。**

你看这个组合：

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

## 视角三：trek-e —— 雷锋还能活多久？

这次事件里最让我尊敬的，不是任何一个跑路的人，也不是任何一个事后冷嘲热讽的 X 大 V，而是 trek-e。

他是谁？GitHub 自报名字 Tom Boucher，北卡州 Wake Forest 的硬件工程师。在原 GSD 项目里至少从 4 月 25 日起就是 Collaborator。Lex 4 月初私下消失之后，他一个人维持了仓库 6-7 周。跑路事件爆发当天，他几小时内完成了 fork、迁移 229 个 tags、77 个 issues、改 npm 包名、发声明。

他从这件事里得到什么？目前看起来：**什么都没有**。没有新代币，没有捐赠地址，没有商业化跟进，接管了一个 60K+ stars 但被 rug 污染过、未来商业前景未知的烂摊子。

他在 README 顶部写的那段话特别清醒：

> "I have no inside information beyond what is publicly visible. I am stating absence-of-information deliberately — absence of news is not the same as evidence."

这是开源生态健康的体现：**总有人在原维护者出问题时愿意无偿接盘。**

但我想问一个不太乐观的问题：**这种模式可持续吗？**

trek-e 能扛 6-7 周，能扛 6-7 个月吗？当代码库的 issue 累积到 500+，当下游用户开始为 v2 v3 提需求，当 Claude Code 又出了新功能让 GSD 又得跟一轮重构——trek-e 还能继续无偿做这件事吗？

如果不能，下一个 trek-e 会出现吗？

**开源世界的"雷锋"是真实存在的，但他们承担的是个人代价。系统性来看，这个代价不可持续。** GSD 这次有 trek-e，下一次呢？

## 60K Star 和 50 万美金，怎么算账？

让我尝试给 Lex 算一笔账。

**他放弃的：** 60K+ GitHub stars 项目（AI coding 圈真实的 reputation 资产）；10+ 年真实音乐家身份（7000 万 Spotify 播放、115 首发行）；项目处在巅峰期的潜在融资可能；Pulumi 等厂商的公开背书；Anthropic / OpenAI 收编邀请的可能性（参考 Den 和 Peter）；未来任何一个 YC 创业方向的可信度。

**他得到的：** 大约 50 万美金现金（实际可能更少，要走 CEX、付税、应付追查）；永久的 "crypto exit scammer" 标签；极可能被英国 Action Fraud / 哥斯达黎加监管调查的风险；音乐人身份的连带污染（house 圈不大，朋友圈传得快）。

**这笔账，怎么看都亏了。**

50 万美金 vs 一个 60K stars 项目的**十年复利**——是十年内可能产生的咨询费、演讲费、CTO offer、book deal、conference 邀请、个人品牌价值。

但 Lex 选了一次性套现。

为什么？我猜，跟项目本身的"被吸收"焦虑有关。当他看到 Claude Code 一周一个新功能，把他原本的"创新"一个个变成 default 配置时，那种"我的项目正在死去"的焦虑，可能比"做完 10 年得到 X"的远期收益更难承受。

**短期焦虑战胜长期理性，是人之常情。**

但在加密货币的环境里，这种焦虑会被立即兑现为一个"现在抛售"的具体选项——这是这个环境最危险的部分。它把"我想跑路"和"我能跑路"之间的距离压缩到了零。

## 给所有"未来的 GSD 作者"

如果你正在做一个 AI coding 工具，正在被 Claude Code 的功能更新焦虑，正在被某个 launchpad 来人忽悠"上我们发币吧"——我想说三件事。

**1. 接受 commoditization 是常态。** 你做的好东西被大厂吸收，是赞美，不是悲剧。它说明你做对了。Den Delimarsky 的 Spec Kit 完成它的使命，他自己也找到了下一站。这不丢人，反而是 healthy exit。

**2. 不要把项目和代币绑定。** 信任一旦坍塌就回不来。再多的钱也买不回 GitHub 上那 60K 颗星代表的 60K 个真实开发者的信任。

**3. 把开源项目当"咨询牌照"而不是"变现工具"。** 它是你简历上最贵的一行，是你未来 10 年所有职业选择的杠杆——不是用来一次性兑现的支票。

## 结尾

GSD 不会是最后一个。在 Anthropic 和 OpenAI 互相竞争、互相吸收社区做法、互相挖人的时代，独立维护者的处境只会越来越紧。

但希望 GSD 是一个**被认真讨论过**的样本——而不是又一个被忘记的加密货币新闻头条。

它至少提醒所有还在做 AI coding 开源项目的人：在你的下一个版本发布之前，先想清楚——**6 个月后你会去哪？**

---

## 参考

- redux 仓库：https://github.com/open-gsd/get-shit-done-redux
- trek-e 的事件声明：https://github.com/open-gsd/get-shit-done-redux/discussions/109
- Den Delimarsky 离职博客：https://den.dev/blog/microsoft-chapter-wrap/
- Den Delimarsky 入职 Anthropic：https://den.dev/blog/anthropic/
- Sam Altman 宣布 Peter Steinberger 加入 OpenAI：TechCrunch / CNBC 2026-02-15
- Aider Issue #4613 "Where is Paul?"：https://github.com/Aider-AI/aider/issues/4613
- Bags Hackathon 公告：https://www.businesswire.com/news/home/20260310779306/
