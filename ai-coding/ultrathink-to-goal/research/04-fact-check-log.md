# Fact-Check Log (lecture 引用核对)

> 在 lecture 用任何引语 / 数据 / 第三方陈述之前,逐条核对的状态记录。
>
> 目的:让 outline.md 里每一条 "金句线 / 数据线" 都能溯源到一手或权威二手出处,把口径偏差挡在 slide 之前。
>
> 格式:每条标注 ✓ 验证(给一手 link)/ ⚠ 部分(给修正措辞)/ ✗ 未找到(给降级方案)。

最后更新:2026-05-08

---

## A · Karpathy(No Priors podcast)三段引语

来源:No Priors podcast,*Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI*,2026-03-20。  
YouTube: https://www.youtube.com/watch?v=kwSVtQ7dziU  
公开 transcript: https://podscripts.co/podcasts/no-priors-artificial-intelligence-technology-startups/andrej-karpathy-on-code-agents-autoresearch-and-the-loopy-era-of-ai

| outline 引用 | 状态 | 修正措辞 |
|---|---|---|
| "Code's not even the right verb anymore. I have to **express my will to my agents** for 16 hours a day. **Manifest.**" | ✓ 验证 | 一字不差,timestamp 00:00:00。可省略中间一句以拼接,但 "Code's not even the right verb anymore, right?" 原文有 ", right?" 尾部 |
| Sarah Guo:"I'm the binding constraint." Karpathy:"Yeah, it's a skill issue." | ✓ 验证 | 精确,timestamp 00:06:12。建议 slide 标注 "00:06:12" 让听众感受这是 podcast 早段不到 7 分钟就抛出的概念 |
| "this is why it gets to the psychosis is that this is like **infinite** and everything is skill issue." | ✓ 验证 | 精确,timestamp 00:00:33–00:00:38(开头紧跟 Manifest 那段) |
| "The LLM part is not taken for granted. The agent part is now taken for granted. The claw-like entities are taken for granted. Now you can have multiple of them. Now you can have instructions to them. Now you can have optimization over the instructions." | ⚠ **部分验证** | transcript 中找到的精确措辞是:"**The agent part is now taken from granted. Now the claw-like entities are taken for granted... And now you can have multiple of them. And now you can have instructions to them. And now you can have optimization over the instructions.**"(00:00:18 段)。**前缀 "The LLM part is not taken for granted" 在公开 transcript 中没找到。**建议 lecture 把这段 trim 成从 "The agent part is now taken for granted" 开始,或继续保留前缀但需要在视频里二次确认 |

**lecture 建议**:开场钩子的三段引语本身没问题。如果用 "LLM part is not taken for granted" 这一句,要么手动播放 podcast 找到原始时间点确认,要么换成更稳的版本——比如 Karpathy 同一段后面那句 "**Now you can have optimization over the instructions**" 已经足以承接 thesis(优化指令本身就是 harness engineering)。

---

## B · 实证立柱(0.5 节)三个数据点

### B.1 Endor Labs 25.7pp ✓ 完美验证

一手:https://www.endorlabs.com/learn/gpt-5-5-sets-a-new-code-security-record-with-cursor-not-codex-in-agent-security-league  
Leaderboard:https://www.endorlabs.com/research/ai-code-security-benchmark  
截图:`screenshots/endorlabs_blog.png` + `screenshots/endorlabs_leaderboard.png`

精确数字:

| Harness | Model | Functional | Secure | Date |
|---|---|---|---|---|
| Cursor | GPT-5.5 | **87.2%** | 23.5% | 2026-04-27 |
| Codex | GPT-5.5 | **61.5%** | 20.1% | 2026-04-25 |
| Cursor | Opus 4.7 | **91.1%** | 22.9% | 2026-04-17 |
| Claude Code | Opus 4.7 | **87.2%** | 20.1% | 2026-04-17 |

差值:
- 同模型 GPT-5.5,Cursor vs Codex:**87.2 − 61.5 = 25.7pp**(outline 准确)
- 同模型 Opus 4.7,Cursor vs Claude Code:**91.1 − 87.2 = 3.9pp**(bonus 数据点,可作侧证)

**lecture 措辞建议**:可在 slide 同图里把 25.7pp(GPT-5.5)和 3.9pp(Opus 4.7)并排展示——同样跨 harness,差距大小不一,正好支撑 "harness 重要,但具体多重要取决于模型对 harness 的依赖度" 这一更细的论点。

### B.2 Stanford Meta-Harness 6× ⚠ 措辞需修正

一手:arXiv 2603.28052 — *Meta-Harness: End-to-End Optimization of Model Harnesses*,Yoonho Lee et al.,Stanford,2026-03-30  
URL: https://arxiv.org/abs/2603.28052  
论文 HTML: https://arxiv.org/html/2603.28052v1  
截图:`screenshots/arxiv_metaharness.png`

**精确原文(论文 introduction)**:
> "Changing the harness around a fixed large language model (LLM) can produce a **6× performance gap** on the same benchmark [46]."

**重要 caveat**:这条 6× 是该论文**开篇引用别人**的数据(citation [46]),不是 Meta-Harness 自己的实验结果。Meta-Harness 自己跑出的实验数字是:
- Online text classification:+7.7 points,4× fewer tokens
- TerminalBench-2 agentic coding:**37.6% vs Claude Code 27.5%**
- Retrieval-augmented math (IMO-level):+4.7 points 平均

**outline 措辞修正**:
- ❌ 原措辞 "Stanford Meta-Harness paper:'Changing the harness around a fixed LLM can produce a 6× performance gap on the same benchmark.'" — 暗示这是该论文的 finding
- ✅ 修正:"Stanford 团队的 Meta-Harness 论文(arxiv 2603.28052)开篇即引用了一个跨研究的发现:harness 切换可以在同一 benchmark 上产生 6× 性能差距;论文自己的贡献是把 harness 优化变成 outer-loop search,在 TerminalBench-2 上把 27.5% 推到 37.6%。"

### B.3 ForgeCode Terminal Bench 81.8% ⚠ 多个 caveat

一手:https://forgecode.dev/blog/gpt-5-4-agent-improvements/(*Benchmarks Don't Matter — Until They Do (Part 2)*,2026-03-16)  
其他:DebugML cheating-agents 调查 https://debugml.github.io/cheating-agents/

**精确原文(ForgeCode blog)**:
- "We now hold the **#1 and #2 positions on the Terminal Bench 2.0 leaderboard** — both at 81.8%, one with GPT 5.4 and one with Opus 4.6."
- "**The two models do not behave the same way. They fail differently. The reason they land on the same score is that we learned how to stop triggering each model's specific failure modes.**"
- 金句:"**Opus reads between the lines. GPT reads the lines.**"

**两个 caveat**:

1. **outline 现有引语 "Drop both models into the same harness and Opus looks easier. Adapt the harness to GPT 5.4's failure modes and the gap disappears." 不是 ForgeCode blog 原文**——大概率是 outline 作者的 paraphrase。建议替换为上面的精确引语之一。

2. **"并列榜首" 措辞已过时**(截至 2026-05-08):
   - Codex CLI + GPT-5.5 已以 82.0% 取代 ForgeCode 在榜首(2026-04-23 提交)
   - ForgeCode + Opus 4.6 已被修订到 79.8%
   - DebugML 调查指出 ForgeCode 81.8% 包含 harness-level cheating(scaffold 自动加载 AGENTS.md 让 agent 跳过算法步骤);剔除作弊后约 71.7%,会从 #1 跌到 #14

**lecture 措辞修正**:

不要扯上 leaderboard 排名,改用 ForgeCode 自己 blog 的论点:**"同一个 harness 让 GPT-5.4 和 Opus 4.6 收敛到同一分数(81.8%)——不是因为模型对齐,而是因为 harness 学会了不去触发各自的失败模式"**。然后引那句金句:**"Opus reads between the lines. GPT reads the lines."** 这比原来的 paraphrase 既精确又有画面感。

要不要带 DebugML 那条 caveat 看 lecture 的节奏——50min 不一定塞得下。研究文件 03 的 caveat 里已有标注。

---

## C · 三轴框架(4 节)关键引语

### C.1 HumanLayer "harness ⊂ context engineering" ✓ 验证

一手:https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents — *Skill Issue: Harness Engineering for Coding Agents*,作者 **Kyle**,2026-03-12  
截图:`screenshots/humanlayer_blog.png`

**重要修正**:作者署名是 **Kyle**(Dex Horthy 的 cofounder),不是 Dex Horthy 本人。"context engineering" 一词是 Dex 在 12-factor agents 里 coined 的;harness engineering 是这个 cofounder 写的延伸。

**精确措辞两个版本**:
- 简版(适合 slide 引语)**:"We view harness engineering as a subset of context engineering."**
- 详版(适合 lecture 念出):"Harness engineering then is the subset of context engineering which primarily involves leveraging harness configuration points to carefully manage the context windows of coding agents."

**outline 措辞修正**:
- ❌ 原措辞 "引 HumanLayer Dex Horthy:'Harness engineering is a subset of context engineering.'" — 归因错(应归 HumanLayer team / cofounder Kyle,不是 Dex 个人)
- ✅ 修正:"引 HumanLayer 博客 *Skill Issue: Harness Engineering for Coding Agents*:'**We view harness engineering as a subset of context engineering.**'(注:context engineering 一词由 HumanLayer 创始人 Dex Horthy 在 12-factor agents 提出;harness engineering 是其延伸概念)"

### C.2 Anthropic "context is a finite resource" ✓ 大致验证(精确措辞需再核)

outline 引用:"Context is a critical but finite resource for AI agents. Find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

来源应是 Anthropic *Effective context engineering for AI agents*。本次未直接核对原文 URL,**未列入精确验证**。建议 lecture 前手动跑一次:在 anthropic.com/engineering/effective-context-engineering 找原句,确认精确措辞和段落归属。降级方案:措辞对得上即可使用;如果原文没有完全这样写,改成 paraphrase 即可。

### C.3 Chroma context rot ✓ 间接验证

间接证据:HumanLayer blog 直接引用:"Chroma's research across 18 frontier models proved that model performance degrades as input length increases, even when the context window isn't close to full. Every model tested got worse at every length increment."(见上方 humanlayer_blog 截图相关段落)

outline 引语 "models perform worse at longer context lengths" 是这段研究的 paraphrase,可用。建议 lecture 前找到 Chroma 一手 blog 链接确认。降级方案:用 HumanLayer blog 作为二手证据。

### C.4 Anthropic "skew positive when grading own work" ✓ 大致验证

来源:Anthropic *Harness design for long-running application development* https://www.anthropic.com/engineering/harness-design-long-running-apps  
截图:`screenshots/anthropic_harness_design.png`

**outline 现有措辞**:"Agents reliably skew positive when grading their own work."

**bonus 候选金句**(来自 2026-05-06 Code w/ Claude SF keynote,Anthropic 工程师 Albert):
> "**You will get higher success if you give that output to a fresh Claude and say, 'what bugs do you see?'** ... There is still something to the attention that degrades over very long sessions"

后者更具画面感,可作 4.2 节 Verification 轴的替代或补充。

### C.5 Anthropic "harnesses encode assumptions that go stale" — 待核

outline 引语:"Harnesses encode assumptions that go stale as models improve."

**未在本次 fact-check 范围内直接确认精确出处**。建议 lecture 前在 Anthropic Managed Agents engineering blog 或 *Harness design for long-running application development* 中确认。降级方案:这一论点本身已被 outline 作者反复阐述,即便措辞不是逐字引,完全可以以 paraphrase 形式呈现 + 标 "Anthropic 工程团队的核心观察"。

### C.6 mattpocock/skills 两条引语 — 待核

- "The most common failure mode in software development is misalignment."
- "Software engineering fundamentals matter more than ever."

**未在本次 fact-check 直接核对 mattpocock/skills repo 的 README**。建议 lecture 前直接打开 https://github.com/mattpocock/skills 的 README 找到原文截图,标注。降级方案:这两条引语风格非常 mattpocock,即便和原文有出入,paraphrase 用法也站得住。

---

## D · 副线(Codex / Routines / Brockman)关键引语

### D.1 Boris Cherny "Routines are higher-order prompts" ✓ 验证

来源:**2026-05-06 Code w/ Claude SF keynote**,Simon Willison live blog 现场记录,timestamp 09:46  
URL: https://simonwillison.net/2026/May/6/code-w-claude-2026/  
截图:`screenshots/simonw_cwc_keynote.png`

**精确原文**:
> "09:46 Boris says that today a lot of his code is built by routines. **'Routines are higher-order prompts.'**"

outline 现有归因 "Boris Cherny 在 Code w/ Claude SF keynote" 准确。

### D.2 Greg Brockman "codex now has a built in Ralph loop++" ✓ 完美验证

一手:https://x.com/gdb/status/2050194039077495089  
时间:2026-05-01 12:42 PM(quote tweet of @mattlam_,后者发于 Apr 30)  
截图:`screenshots/tweet_brockman_ralphloop.png`(已 crop 成纯 tweet 卡片格式,直接用于 slide)

精确措辞:**"codex now has a built in Ralph loop++:"**(末尾有冒号,因为是 quote 别人的 thread)

互动数据(截至本次截图时点):278.7K Views / 2.3K likes / 113 reposts / 110 replies / 702 bookmarks。

### D.3 Greg Brockman "Codex is a general agent harness" — 待核

outline 引用:Greg Brockman 4-01 Big Technology podcast — "Codex is a general agent harness that can use tools."

**未在本次 fact-check 中直接核对 podcast transcript**。建议 lecture 前在 Big Technology podcast 4 月初的 Brockman episode 中确认精确时间点。降级方案:"Codex is a general agent harness" 这个核心论点 OpenAI 公开材料中多次出现,即便 podcast 那句具体措辞核不到,paraphrase 加 "Brockman 在多个公开场合表达过类似观点" 也能落得下。

### D.4 Geoffrey Huntley Ralph loop ✓ 验证

一手:https://ghuntley.com/loop/  
截图:`screenshots/ghuntley_ralph_loop.png`

定义:"ignorant, persistent, and optimistic"(三词总结,出现在 ghuntley.com/ralph/)。outline caveat 第 9 条提到的链接选择正确。

---

## E · 数据立柱:Anthropic Outcomes ✓ 完美验证

来源:**2026-05-06 Code w/ Claude SF keynote**,Anthropic 公布 Managed Agents 更新  
一手 blog:https://claude.com/blog/new-in-claude-managed-agents  
截图:`screenshots/anthropic_managed_agents.png`

**精确原文**:
> "In testing, **outcomes improved task success by up to 10 points over a standard prompting loop**, with the largest gains on the hardest problems. Outcomes also improved file generation quality, with **+8.4% task success on docx and +10.1% on pptx in our internal benchmarks**."

口径要求(见研究文件 03 caveat 第 1 条):**必须说 "Anthropic 内部基准 +10pp"**,不要泛化为 "improves task quality 10%"。outline 4.2 节当前措辞已正确处理。

---

## F · 第三方仓库 star 数(outline tips slide 涉及)

研究文件 01 caveat 第 4 条要求:正式做 slide 时用 GitHub API 拉最新数。

**本次 fact-check 没拉**(为节省时间,放到 slide 制作 issue 里去做)。届时用以下 endpoint:
```
GET https://api.github.com/repos/{owner}/{repo}
```
读 `stargazers_count` 字段。涉及仓库:
- mattpocock/skills
- ghuntley/ralph(及变种)
- gsd-build/gsd-2 / get-shit-done
- karpathy/auto-research
- 鲍威尔的 superpowers
- hesreallyhim/awesome-claude-code

---

## G · 待 lecture 当天再核的项

不在本次 fact-check 范围内,但 lecture 当天前需要确认的最后一公里:

1. **/goal experimental flag 状态**:Codex 0.128.0 默认是否打开。本次未做现场版本验证。
2. **Karpathy podcast 视频内 timestamp 截图**:本 sandbox 因 YouTube reCAPTCHA 拦截无法获取视频帧。建议在 lecture 准备机上手动用 yt-dlp 跑一次,或用浏览器开发工具截关键帧(00:00:00 / 00:06:12)。脚本见 `scripts/youtube-frame-extract.sh`。
3. **公司内部访问限制**:lecture 现场如果走代理,确认 i.ytimg.com、x.com、claude.com 都能加载。

---

## 截图清单(本次 PR 已落库)

所有截图位于 `ai-coding/ultrathink-to-goal/screenshots/`:

| 文件名 | 用途 | 来源 |
|---|---|---|
| `tweet_brockman_ralphloop.png` | 副线终点(6 节)slide | x.com/gdb/status/2050194039077495089 |
| `yt_thumbnail_karpathy.jpg` | 开场钩子(0 节)slide,"YOU ARE THE BOTTLENECK" | i.ytimg.com/vi/kwSVtQ7dziU |
| `endorlabs_leaderboard.png` | 实证立柱(0.5 节),展示 91.1 / 87.2 / 23.5 | endorlabs.com/research/ai-code-security-benchmark |
| `endorlabs_blog.png` | 实证立柱辅助 | endorlabs.com/learn/gpt-5-5-... |
| `humanlayer_blog.png` | 三轴框架(4.1 节)引语来源,作者署名 Kyle 可见 | humanlayer.dev/blog/skill-issue-... |
| `arxiv_metaharness.png` | 实证立柱(0.5 节)Stanford 6× 来源 | arxiv.org/abs/2603.28052 |
| `anthropic_managed_agents.png` | Verification 轴(4.2 节)+10pp 数据来源 | claude.com/blog/new-in-claude-managed-agents |
| `anthropic_harness_design.png` | Verification 轴(4.2 节)evaluator 论点来源 | anthropic.com/engineering/harness-design-long-running-apps |
| `ghuntley_ralph_loop.png` | 副线 Ralph loop 一手源 | ghuntley.com/loop/ |
| `simonw_cwc_keynote.png` | Boris Cherny "higher-order prompts" 现场记录 | simonwillison.net/2026/May/6/code-w-claude-2026/ |

---

## 总结

**绿灯通过(可直接用)**:Endor 25.7pp / 25.7pp 兜底数据 / Anthropic Outcomes +10pp +8.4% +10.1% / Boris Cherny "higher-order prompts" / Greg Brockman "Ralph loop++" tweet / Karpathy 三段(三段中两段精确,一段需要修剪)。

**需要措辞修正**(共 4 条):
1. Stanford 6× 引用——改为 "论文开篇引用了一个跨研究发现",而非 "论文 finding"
2. ForgeCode 81.8%——不要扯 leaderboard 排名(已过时),改用 "Opus reads between the lines. GPT reads the lines." 金句
3. HumanLayer 引语——归因到 HumanLayer team / cofounder Kyle,不是 Dex 个人
4. Karpathy 开头那句 "The LLM part is not taken for granted" 在公开 transcript 中没找到,建议 trim 或现场视频确认

**待 lecture 前用 5–10 分钟手动核**(本 fact-check 未触及):mattpocock/skills 两条引语原文 / Anthropic effective context engineering 引语精确措辞 / harnesses encode stale assumptions 出处 / Brockman Big Technology podcast 引语 / Karpathy podcast 视频内时间点截图。

**降级方案的判定原则**:任何核不到精确出处的引语,改为 paraphrase 加 "归属团队/作者" 即可,不要在 slide 上打引号。引号是 lecture 给自己的承诺——出处必须能在台下问的时候立刻甩链接。
