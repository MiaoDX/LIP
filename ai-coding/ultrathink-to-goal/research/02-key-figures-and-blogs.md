# Research 02:Sam Altman / Greg Brockman / Boris Cherny + 官方 blog

> 本文件是为 lecture 准备过程中的第二轮 deep research 输出。
> 时间窗口:2026-02 至 2026-05 初。
> 仅列出能验证的公开发言。所有 X/Twitter 链接均为搜索结果中实际返回的 URL。Podcast 若没有公开 transcript 链接,会明确标注。

---

## 方向 1:Sam Altman 关于 Codex / AI Coding 的近期发言

### 1.1 X / Twitter

| 链接 | 时间 | 一句话核心观点 | 对 lecture 哪一节有用 |
|---|---|---|---|
| https://x.com/sama/status/2018444309750862333 | 2026-02-02 | "I built an app with Codex last week. It was very fun. Then I started asking it for ideas for new features and at least a couple of them were better than I was thinking of. I felt a little useless and it was sad." | 开场/结尾的"工程师角色变化",呼应 Karpathy 视角 |
| https://x.com/sama/status/2019814741129195576 | 2026-02-06 | 在 X 上发起投票:"How would you prefer us to charge for Codex?"(Flat monthly subscription 82.9% vs $20 usage-based chunks 17.1%,~77K 票) | "工程化被 bake 进产品"主线下的商业化定价部分 |
| https://x.com/sama/status/2049944981750833659 | 2026-04-30 | 引用 Max Weinbach 的 /goal 推文,回复 "it does seem cool" — 这是 sama 对 /goal 发布唯一公开反应 | /goal 时间轴节点 |
| https://x.com/sama/status/2047378431260664058 | 2026-04-23 | "Also, a ton of new Codex features coming soon! Fun little bundle w/the new model."(GPT-5.5 launch 当天) | GPT-5.5/Codex 大更新节点 |
| https://x.com/sama/status/2047395562501411058 | 2026-04-23 | "We tried a new thing with NVIDIA to roll out Codex across a whole company and it was awesome to see it work. Let us know if you'd like to do it at your company!" | 企业版 / dogfooding 论点:Codex 不只是个人工具 |

### 1.2 OpenAI 官方 blog(Sam Altman 署名)

| 链接 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| https://openai.com/index/our-principles/ | 2026-04-26 | Sam Altman 署名 "Our principles"。原文:"Power in the future can either be held by a small handful of companies using and controlling superintelligence, or it can be held in a decentralized way by people. We believe the latter is much better." | 与 Karpathy 开场对照的"为什么把 agent 推给所有开发者"哲学背景 |

> 补充:在 2026-02 到 2026-05 初窗口内,未找到 Sam 在 OpenAI 官方 blog 上专门以 Codex 为题的署名长文。"Codex for (almost) everything"(4-30)等 product post 是公司署名。

### 1.3 Podcast 访谈

| 渠道 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| Alex Kantrowitz / Big Technology Podcast 访谈(多次被转引;Sam 在该访谈里把 OpenAI 描述为"AI inference company",并谈到 ChatGPT 接下来的 AI-first redesign) | 2026 春,被 The Neuron / Latent Space 转引 | "next jump for AI models won't be 'more IQ,' but it'll be AI-first redesigns of existing user experiences that stop stapling a chatbot onto old workflows" | 论点 "工程化被 bake 进产品" 的直接背书 — transcript 未找到,需 lecture 准备时收听原集 |
| Stripe Sessions 2026 fireside w/ Patrick Collison(4-30,SF) | 2026-04-30 | 引述:"I do think the models got really good, especially for coding, but also in general late last year. There has just been this tidal wave of people coming into Codex recently." 同时:"I would like us to be an infrastructure provider." | "Codex 一年" 时间轴节点 + 商业定位。SiliconANGLE 报道有引语,原视频 transcript 未找到 |

### 1.4 大会 keynote

- **OpenAI DevDay 2025(2025-10-06)** 已是 lecture 时间窗口外的基线,但 Codex GA 官宣发生在那里(https://openai.com/index/codex-now-generally-available/),可作为窗口起点的 anchor。
- **OpenAI DevDay 2026** 公告页 https://openai.com/index/devday-2026/ 显示该年度大会定在 2026-09-29,**晚于本 lecture 时间**,故无新发言。
- 2026-02 到 2026-05 期间未见 Altman 在专门的 "Code w/ Codex" 大会上演讲;4-30 的 Codex 大更新是 blog post + X,没有线下 keynote。

---

## 方向 2:Greg Brockman 关于 Codex 的近期发言

### 2.1 X / Twitter(@gdb)

| 链接 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| **https://x.com/gdb/status/2050194039077495089** | **2026-05-01 07:42 AM** | **"codex now has a built in Ralph loop++"** (引用 Matthew Lam 关于 Codex 0.128.0 / `/goal` 的帖子)。指标:111 reply / 113 retweet / 2.3K likes / 703 quote tweet。 | **核心引用**——直接给 /goal 的"工程化 bake 进产品"做注解 |
| https://x.com/gdb/status/2049971410479796521 | 2026-04-30 | "codex app becoming incredible"(4-30 Codex 大更新当天) | 时间轴节点 |
| https://x.com/gdb/status/2037348081684111623 | 2026-03-26 | "Plugins are now available in Codex" — 引用 OpenAIDevs 的 plugins 公告 | 论点:"工程化被 bake 进产品" — 把 Slack/Figma/Notion/Gmail 等集成 bake 入 codex |

> 注意:除上述三条之外,搜索结果给出 GDB 的账号页 https://x.com/gdb 显示 6055 posts,但没有更多在窗口内、技术性强、可直接引用的高 signal tweet 被搜索引擎索引到。**没有找到** GDB 在 openai/codex GitHub 仓库 issue/PR 评论的可验证发言(需要 lecture 准备时去仓库手动查)。

### 2.2 Podcast 访谈

| 链接 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| https://www.bigtechnology.com/p/openai-president-greg-brockman-doubling | 2026-04-01(Big Technology Podcast,Alex Kantrowitz) | "[The Codex app] is really two things in one. It's a general agent harness that can use tools, and it's also an agent that knows how to write software." 又:转向 superapp 路径,明确把 Codex 定位为 OpenAI 的 "agent harness 通用层"。同集中:"slowly, slowly, slowly — all at once" 描述 Codex 帮一个低层系统工程师从写不出到全自动实现 design doc。 | **副线对照核心** — Greg 亲口说 "agent harness"。直接接 Mitchell Hashimoto / 鸭哥 的 harness engineering 论述 |
| https://www.bigtechnology.com/p/openai-president-greg-brockman-on | 2026-04-23(Big Technology Podcast,GPT-5.5 "Spud" emergency 集) | 把 model 比作 brain,把 "Codex / Super App" 比作 body:"Think about the models as the brain. You can think about the systems and the harnesses like Codex and the applications, like the Super App, as almost the body around it to make it into a useful AI." 同时谈 workspace agents:"a hosted Codex harness in the cloud" — 把 governance/oversight bake 进产品。 | **harness engineering 直接被 OpenAI 总裁正式 endorse** — 这是 lecture 论点的关键背书 |

> 完整 transcript 在 bigtechnology.com 文章里附带("You can read the full Q&A below, edited lightly for length and clarity"),不需要再去听播客。

### 2.3 OpenAI Podcast(官方)

- 2025-09 Greg + Thibault Sottiaux 的 OpenAI Podcast 关于 GPT-5-Codex 那一集是 lecture 时间窗口外的基线(andrewmayne.com 转引提到 "harness" 概念)—不在本次补充范围。

### 2.4 大会演讲

- 未找到 Greg 在 2026-02 至 2026-05 初窗口内有明确的大会 keynote 演讲。Big Technology AI Summit 在 2026-06-18(lecture 时间之后),他是 announced 的演讲嘉宾。
- 未找到 Stripe Sessions 2026(4-30)有 Greg 的独立演讲;该日 Sam Altman 上台。

### 2.5 Greg 自己用 Codex 做的项目

- 4-30 OpenAI 官方 blog "Codex for (almost) everything" 里展示的 Voxel Velocity 3D 赛车游戏 demo(Codex 用 7M tokens 一次跑完)是产品团队 demo,不是 Greg 个人项目。**没有找到** Greg 个人公开晒过自己的 Codex 项目。

---

## 方向 3:Boris Cherny 的近期发言

### 3.1 长 podcast 访谈

| 链接 | 时间 | Transcript | 核心观点 | 用途 |
|---|---|---|---|---|
| https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens | 2026-02-19(Lenny's Podcast) | **完整 transcript 在 Lenny's Substack 付费墙后**,但免费 show notes 含详细章节列表,包括 "(01:11:16) Thoughts on Codex" 这样关键段 | "coding is solved" 主张;Boris 自 2025-11 起未亲手写一行代码,每天 100% 由 Claude Code 写;Anthropic 内部生产力 +200%;建议 "underfunding teams + unlimited tokens";Cowork 10 天搭出来 | **Boris 第一次系统讲产品哲学** — Routines/Auto Mode 的设计动机 |
| https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny | 2026-03-04(Pragmatic Engineer / Gergely Orosz) | **完整 transcript 在文章页顶部** | "Boris ships 20-30 PRs a day by running 5 parallel Claude instances";"once there is a good plan, it will one-shot the implementation almost every time";"always make sure that when you start a migration, you finish the migration";agentic search "is really just glob and grep, and it outperformed RAG" | **核心引用** — 主线 Plan mode → Auto-accept 工作流,对照 Codex /goal |
| https://every.to/podcast/how-to-use-claude-code-like-the-people-who-built-it(Dan Shipper "AI & I",Boris + Cat Wu) | 2026 春 | **完整 transcript:https://every.to/podcast/transcript-how-to-use-claude-code-like-the-people-who-built-it** | "antfooding" 概念(Anthropic 员工自称 ants);Boris 描述 code review subagent 链 — 5 个 subagent 找 issue + 5 个对手 subagent 找 false positive;plan mode "double or triple your chances of success";推荐共享 settings.json 和 stop hooks 让 Claude 一直跑直到测试通过 | 主线 subagents、stop hooks、CLAUDE.md → "工程化被 bake 进 产品" |
| https://www.youtube.com/watch?v=SlGRN8jh2RI(Sequoia AI Ascent 2026,Boris + Lauren Reeder) | 2026 春 | Transcript 未找到,需 lecture 准备时收听 / 看 YouTube 字幕 | "coding is solved" 公开演讲版本;shift "from execution to intent";"agentic engineering",长 horizon agents | 论点最强的公开背书 |

### 3.2 短形式 / 大会现场

| 链接 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| https://www.cnbc.com/video/2026/05/06/head-of-claude-code-on-the-future-of-work-and-productivity.html | 2026-05-06(CNBC,Code w/ Claude SF 现场,Kate Rooney 采访) | 简短电视采访,谈 AI agents 如何改变工作 | Code w/ Claude 现场视角补充。Transcript 未找到 |
| https://simonwillison.net/2026/May/6/code-w-claude-2026/ | 2026-05-06(Simon Willison live blog) | Boris 在 keynote 上 demo:"Claude is working on adding refunds to ACME's dashboard";"today a lot of his code is built by routines";"Routines are higher-order prompts";"With Routines, developers can setup async automations and wake up to PRs that are ready to merge";"The person who owns the PR is never going to see a red X. Claude is prompting Claude Code on its own." | 主线 Routines 的官方哲学定义 — "higher-order prompts" 一句直接进 lecture |
| https://claude.com/code-with-claude/session/sf-live-coding-with-bun-and-claude-code | 2026-05-06 | Boris 与 Bun 作者 Jarred Sumner 在 Code w/ Claude SF 联合 livestream "everyday workflows, unfiltered" | Code w/ Claude session 索引,原视频按官方说法在该周末上线 on-demand |

### 3.3 X / Twitter(@bcherny)

| 链接 | 时间 | 核心观点 | 用途 |
|---|---|---|---|
| https://x.com/bcherny/status/2007179832300581177("我的 Claude Code setup" thread 起点) | 2026-01-02 | 1.3K reply / 8.2K retweet / 54K like — 现象级 thread。"My setup might be surprisingly vanilla" | 时间轴起点。**注意:1-2 在 2026-02 之前但作为对比基线高度必要,建议保留** |
| https://x.com/bcherny/status/2031151689219321886 | 2026-03-09 | "Roughly, the more tokens you throw at a coding problem, the better the result is. We call this test time compute. One way to make the result even better is to use separate context windows. This is what makes subagents work, and also why one agent can cause bugs and another (using the same exact model!) can find them." | Subagents 设计哲学的官方解释 — "uncorrelated context windows" |
| https://x.com/bcherny/status/2025007398537380028 | 2026-02-20 | "Subagents now support worktrees ... especially powerful for large batched changes and code migrations" | 时间轴节点:subagents → worktrees |
| https://x.com/bcherny/status/2025007400235987300 | 2026-02-20 | "Custom agents support git worktrees ... add 'isolation: worktree' to your agent frontmatter" | 同上 |
| https://x.com/bcherny/status/2044847849662505288 | 2026-04(Auto Mode 发布前后) | "Auto mode = no more permission prompts. Opus 4.7 loves doing complex, long-running tasks like deep research, refactoring code, building complex features, iterating until it hits a performance benchmark." | 主线 Auto Mode 设计哲学 |
| https://x.com/bcherny/status/2046670689755902284 | 2026-04-21 | "I only use auto mode every day. What's missing/not working for you?" | Boris 个人 dogfooding 表态 |

> Boris 还有一个 "favorite hidden features" 3-29 thread(被 howborisusesclaudecode.com 引用,提到 mobile app、session teleporting、/loop、/schedule、Cowork Dispatch、/branch、/btw、/batch、/voice 等),具体 X 链接未在本次搜索中拿到原文 URL,**需 lecture 准备时去 @bcherny 时间线手动定位 2026-03-29 帖子**。

### 3.4 Anthropic 官方 blog 上 Boris 被引用 / 署名

- 2026-02 至 2026-05 初的 claude.com/blog 上未见 Boris 直接署名长文。Routines / Auto Mode / Managed Agents 系列 blog 是组织署名 / 工程团队署名。Boris 的署名内容主要在 X 和 podcast 上。

---

## 方向 4:OpenAI / Anthropic 官方 blog

### 4.1 OpenAI 端

| 链接 | 时间 | 一句话核心 | 用途 |
|---|---|---|---|
| https://openai.com/index/codex-for-almost-everything/ | 2026-04-30 | "Codex for (almost) everything" — 4-30 Codex 大更新官方公告。"Codex is evolving from an agent that writes code into one that uses code to get work done on your computer." 含 background computer use、in-app browser、image gen、memory preview、scheduled future work(Codex 自己 wake up 继续跑)、90+ plugins。 | **副线主帖** — /goal 隔天发布的产品语境 |
| https://openai.com/index/introducing-the-codex-app/ | 2026-02-04(首发,3-04 加入 Windows 支持) | Codex macOS app 发布 + 双倍限额 + Free/Go 用户限时开放。Skills 第一次公开亮相:"With skills, you can easily extend Codex beyond code generation". Voxel Velocity 7M-token 自动 demo. | 时间轴:Codex app 首发节点 |
| https://openai.com/index/introducing-gpt-5-5/ | 2026-04-23 | GPT-5.5 ("Spud") 发布。"On Artificial Analysis's Coding Index, GPT-5.5 delivers state-of-the-art intelligence at half the cost of competitive frontier coding models" — 强调 token efficiency 而不是 raw IQ. | 与 lecture 主论点一致:"工程化让 model 显得更聪明" |
| https://openai.com/index/introducing-gpt-5-2-codex/ | 2025-12(基线,引用作背景) | GPT-5.2-Codex:context compaction native;refactor / migration 强化 | 基线 |
| https://developers.openai.com/codex/changelog | 持续更新 | Codex CLI 逐版本 changelog;4-30 0.128.0 关键 entry:**"Added persisted /goal workflows with app-server APIs, model tools, runtime continuation, and TUI controls for create, pause, resume, and clear. (#18073-18077, #20082)"** — 这是 /goal 唯一官方文档化描述。 | **核心** — /goal 唯一一手定义 |
| https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/ | 2026-04-23(NVIDIA 官方 blog,与 OpenAI 联合) | "Over 10,000 NVIDIANs across functions got early access" + Jensen Huang 全公司邮件:"Let's jump to lightspeed. Welcome to the age of AI." 同时披露 Codex app 通过 SSH 连接到 cloud VMs 的企业部署模式。 | **企业 dogfooding 案例** — 配 Sam 4-23 的 NVIDIA tweet |

### 4.2 Anthropic 端

| 链接 | 时间 | 一句话核心 | 用途 |
|---|---|---|---|
| https://claude.com/blog/introducing-routines-in-claude-code | 2026-04-14 | Routines 官方发布 post。"A routine is a Claude Code automation you configure once — including a prompt, repo, and connectors — and then run on a schedule, from an API call, or in response to an event. Routines run on Claude Code's web infrastructure, so nothing depends on your laptop being open." Pro/Max/Team/Enterprise 分别 5/15/25 daily runs. | **主线核心节点** |
| https://www.anthropic.com/engineering/managed-agents | 2026-04-08 | "Scaling Managed Agents: Decoupling the brain from the harness." 关键引语:"Harnesses encode assumptions that go stale as models improve." 提到 Sonnet 4.5 的 "context anxiety" 用 context resets 解决,但 Opus 4.5 上 "the resets had become dead weight." 解决方案:把 session / harness / sandbox 三组件解耦虚拟化。 | **lecture 论点最直接的官方背书** — Anthropic 自己说 "harness 会 stale,所以我们 bake 进产品" |
| https://claude.com/blog/claude-managed-agents | 2026-04-08 | Managed Agents 主公告。$0.08/session-hour 定价,pre-built configurable agent harness. Notion/Rakuten/Asana 客户。 | 副线对照:Anthropic 把 harness 包成产品卖 |
| https://claude.com/blog/claude-managed-agents-memory | 2026 春 | Managed Agents memory 公开 beta。Rakuten 用例:"cutting first-pass errors by 97%, all within workspace-scoped, observable boundaries" | 长 horizon 工程挑战章节 |
| https://claude.com/blog/new-in-claude-managed-agents | 2026-05-06(Code w/ Claude 现场) | Dreaming(agent 在 idle 时复盘自己 session 提取 pattern)、outcomes(rubric + 独立 grader)、multi-agent orchestration 公开 beta。Harvey 用 dreaming 完成率 6×;Wisedocs review 50% 提速;Spiral by Every 是早期客户 | Code w/ Claude 大会主帖 |
| https://www.anthropic.com/engineering/claude-code-auto-mode | 2026-03-25 | Auto Mode engineering blog。关键数据:"Claude Code users approve 93% of permission prompts." Two-stage classifier (single-token 过滤 → CoT),prompt-injection probe 在输入端,transcript classifier 在输出端。引用 Opus 4.6 system card §6.2.1 / §6.2.3.3 内部 incident log 案例(删 git 分支、上传 GitHub token、production DB migration)。 | **主线 Auto Mode 设计哲学官方文章** |
| https://www.anthropic.com/news/finance-agents | 2026-05-05 | "Agents for financial services" — 10 ready-to-run 金融 agent templates,作为 Cowork/Claude Code 插件 + Managed Agents cookbook 提供 | 论点:"工程化被 bake 进产品" 进一步演化到行业垂直 |
| https://www.anthropic.com/engineering/harness-design-long-running-apps | 2026 春 | 已在前期收集中。内有关键章节 "Removing the sprint construct entirely" 是 Opus 4.6 之后 harness 简化的论据。 | 已有 |

> **没找到** Anthropic 在窗口内单独以 "Skills 的设计哲学" 或 "CLAUDE.md 设计哲学" 为题的官方 blog。Skills 主要在 code.claude.com/docs/best-practices 文档里,没有专门 design post。Plan mode、Subagents 也类似——主要在 docs 里,不是 blog 文章。

---

## ⚠️ 时间警告与未找到说明

1. **/goal 没有 OpenAI 官方 blog 设计 post**。它只通过 4-30 changelog 一行字 + GDB / Sam 的 X 反应公开。Lecture 准备时若想要"官方设计哲学",**只能引用 Brockman "Ralph loop++" tweet + changelog 原文**,没有其他一手源。
2. **Boris Cherny 在 Code w/ Claude 2026 SF(5-6)** 的完整演讲视频按 claude.com 官方说法 "by the end of the week" 上线 on-demand —— Lecture 准备时建议直接去 https://claude.com/code-with-claude/san-francisco 拿录像。
3. **Symphony 后续 post / 长 horizon agent paper** —— 在窗口内未找到 OpenAI 关于 Symphony 的后续文章。
4. **Boris 3-29 "favorite hidden features" thread** 的具体 X 帖子 URL 在搜索中没拿到原链接(虽然 howborisusesclaudecode.com 有内容转录),需手动到 @bcherny 时间线定位。
5. **OpenAI Codex GitHub 仓库**里 Greg Brockman 个人评论:未在搜索结果中出现可验证条目。如果 lecture 需要"工程师视角的 GDB",建议直接到 github.com/openai/codex/issues?q=is%3Aissue+commenter%3Agdb 手动核查。
6. **Boris 在 Latent Space podcast** 那期("on May 8th" — vlad.build 转引提到日期,但搜索结果中 latent.space 主页没出现该集;"May 8" 可能是 2025 年的旧集)。Lecture 准备时需 latent.space/archive 核对,目前**视为不可验证**,建议主用 Pragmatic Engineer 和 Lenny's 那两期。
7. 没有找到 Sam Altman 在 Lenny's / Stratechery / Acquired / Hard Fork / Decoder 等 podcast 上 2026-02 到 2026-05 初窗口内**专门讲 Codex** 的访谈(除 Big Technology / Alex Kantrowitz 那期)。Sam 该窗口内主要发声渠道是 X 和 Stripe Sessions 现场。

---

## 给 lecture 的建议引用顺序(按主线时间轴)

1. **2-02** Sam tweet "felt a little useless" —— 开场情绪
2. **2-19** Lenny's × Boris "coding is solved" —— 立 Anthropic 视角
3. **2-20** Boris tweet subagents + worktrees —— 工程化 bake 进产品的开始
4. **3-04** Pragmatic Engineer × Boris "20-30 PR/day, 5 parallel Claude" —— 工作流证据
5. **3-09** Boris tweet "uncorrelated context windows" —— subagents 设计哲学
6. **3-25** Anthropic Auto Mode engineering blog "93% of prompts approved" —— Auto Mode 数据
7. **4-01** Greg Brockman × Big Technology "Codex 是 general agent harness" —— **副线 harness 概念被 OpenAI 总裁正式承认**
8. **4-08** Anthropic Managed Agents engineering blog "harnesses encode assumptions that go stale" —— **lecture 论点最强 endorsement**
9. **4-14** Anthropic Routines blog —— 主线核心节点
10. **4-23** Sam tweet NVIDIA 全公司部署 + GPT-5.5 launch —— 企业化与 token efficiency
11. **4-23** Greg × Big Technology "models = brain, harness = body" —— harness 作为产品边界的明确表述
12. **4-30** OpenAI "Codex for (almost) everything" blog + GDB "codex app becoming incredible" —— Codex 超应用化
13. **4-30 / 5-1** Codex CLI changelog 0.128.0 /goal + GDB "Ralph loop++" tweet —— **副线终点**
14. **5-6** Boris 在 Code w/ Claude SF keynote "Routines are higher-order prompts" + Anthropic Managed Agents dreaming/outcomes blog —— **主线终点**
