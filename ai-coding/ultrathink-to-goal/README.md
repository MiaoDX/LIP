# 从 Ultrathink 到 Goal:AI Coding 工程化的一年

公司内部分享(「汽车人 AI 进化论」第 09 期)的准备材料。

- **时长**:50 min(单人讲)
- **听众**:α 类有实践的开发者为主,γ 类和非研发同事旁听
- **受众优先级**:当技术密度和通俗性冲突时,优先服务 α 类开发者;γ 类和非研发同事通过反复出现的三问跟住主线:它能调什么?它看到了什么?谁在判定完成?
- **状态**:当前 46 页 deck 已完成 tonight 版内容 refactor, Claude Code timeline 已更新到 2026-05-11 UTC

## 目录

- [`outline.md`](./outline.md) — 完整大纲(v1,定稿)
- [`transcript.md`](./transcript.md) — 基于当前 HTML deck 的逐字稿
- [`poster-content.md`](./poster-content.md) — 海报文字稿
- [`claude-code-release-timeline-2026-05-11.md`](./claude-code-release-timeline-2026-05-11.md) — Claude Code npm / changelog 快照,用于复查 05-11 timeline 口径
- [`research/`](./research/) — 准备过程中的 deep research + fact-check 记录
  - [`01-harness-engineering-landscape.md`](./research/01-harness-engineering-landscape.md) — Codex `/goal`、GSD、第三方实践案例
  - [`02-key-figures-and-blogs.md`](./research/02-key-figures-and-blogs.md) — Sam Altman / Greg Brockman / Boris Cherny 近期发言 + 官方 blog 索引
  - [`03-dimensions-beyond-skill-context.md`](./research/03-dimensions-beyond-skill-context.md) — Skill / Context 之外的工程维度评估,最终选定三轴
  - [`04-fact-check-log.md`](./research/04-fact-check-log.md) — outline 引语逐条核对状态(✓ / ⚠ / ✗),含口径修正建议
- [`screenshots/`](./screenshots/) — 引用源截图(tweet 卡片、blog 截屏、YouTube thumbnail 等)
- [`scripts/`](./scripts/) — 截图工作流,含批量截图 + YouTube 视频帧抽取

## 核心信息

**Canonical promise**:AI Coding 工程化不是"模型替代工程师",而是 **Skill / Context / Verification** 三个工程责任被重新分配;工程师的核心判断变成:哪类任务交给哪种 harness,以及怎么验证它真的完成。

**Antagonist**:整场不是在说"人是坏瓶颈,所以要全部自动化",而是在讲 **binding constraint 的迁移**:早期瓶颈在人手里,随后迁移到 harness 设计、产品默认、任务匹配和验证机制里。工程师的新工作是判断瓶颈现在在哪里。

**Thesis**:软件工程的 fundamentals 没变,变的是它们装到了谁手里——我们不必再是 binding constraint。

**Takeaway**:哪类活配哪种 harness——这本身就是工程判断。

**三轴叙事**:Skill(agent 调什么)+ Context(agent 看什么)+ Verification(agent 凭什么宣告完成)。

**三轴边界**:Skill / Context / Verification 不是穷尽分类,而是本场 talk 的压缩模型。Memory 归入 Context 机制;Orchestration 是 Skill + Context 隔离的组合;Permission 是 harness safety boundary;Cost 和 Observability 是横切约束。保留三轴是为了让叙事更可预测,而不是否认其他维度存在。

**模型选择立场**:尽量使用当前场景下能 access 的最好模型。这里的"最好"不是只指 SaaS frontier model;如果是内部 only 项目,也可以是私有部署的 top-tier 开源模型。理由不是"模型万能",而是 retry、人类 review、上下文重建和返工时间通常比模型成本贵得多。

**开场 proof-of-work 口径**:新增的 token / 截图页不是炫耀 token,而是回答"为什么我能讲这个":Claude Code、Codex、Kimi、MiMo、OpenClaw、CI、公司内部 project、开源 project 和长程 `/goal` 任务都在真实使用。

**权限建议口径**:权限建议不是"无条件 yolo",而是先准备 clean branch、git/CI、secret 边界,再尽量减少可避免的人类审批延迟。目标是避免人变成 turn-by-turn approval bottleneck。

**结尾层级**:情绪收束押在"我们不必再是 binding constraint";行动 takeaway 押在"哪类活配哪种 harness";三问("它能调什么?它看到了什么?谁在判定完成?")作为两者之间的判断工具。

**实践部分口径**:第 5 节不是工具推荐,而是三轴框架在真实任务里的落点。每个案例第一句话都要回答:它移走了哪个 binding constraint? 工具名可以保留,但不能让段落变成"大家也去用我的工具栈"。

**数据立柱口径**:0.5 节不主动展开 caveat,但所有 slide 文案必须可防守。25.7pp 是最硬 anchor;6× 是 Meta-Harness 论文引用的跨研究 observation,不是该论文自己的实验结论;81.8% 用来说明 harness 可以适配模型 failure mode,不用于证明 leaderboard 排名。

**Bake-in 口径**:第 6 节的"用户表面回到 vibe"必须配套说明:工程化没有消失,而是被前置、下沉或包进产品。`/goal` 不替代 AGENTS.md / skills / permissions / subagents,而是 wraps 它们;Routines / Managed Agents 也是把 spec / harness 配置放到底层。

**社区 slide 定位**:4.3 只做补充证据,不做行动入口。重点是证明"这个方向不是大厂幻觉,社区也在同向收敛";具体该试什么留到 Tips。

**术语策略**:中文 lecture 中保留英文概念名 `harness`、`Skill`、`Context`、`Verification`、`binding constraint`、`vibe`、`bake-in`、`agent`;首次出现时给中文解释,之后固定用同一个英文词。`done` 不是核心术语,优先说"宣告完成"或"判定完成"。

**Tips 口径**:最后三张不是"经验清单",而是"今晚就能做的三个实验":升级和整理 harness 环境;让 agent 先问你而不是直接干;用能 access 的最好模型跑一个真实任务。收尾目标是让听众马上试一次,而不是收藏工具列表。

**Bonus 推荐口径**:`intuitive-flow` 放在 Tips 后作为长程任务 bonus,不是展开教程。表达为"把 grill/office-hours、docs/plans、autoplan、GSD 和 Codex `/goal` 组合起来的好用方式",强调最近真实使用两三天后的体感。

## 主线时间轴

Claude Code 一年 405 个 npm publish timestamp,截至 2026-05-11 UTC 自然分三段:

| 阶段 | 时间窗口 | 标志性 release |
|---|---|---|
| **Vibe** | 0.2.x · 95 | ultrathink (0.2.44) → auto compact (0.2.47) → CLAUDE.md @import (0.2.107) |
| **SDD** | 1.0.x · 121 | Plan mode (1.0.33) → Hooks (1.0.38) → Subagent 雏形 (1.0.41) → /todos (1.0.94) |
| **Harness** | 2.x · 189 | Skills (2.0.20) → Subagents (2.0.30) → Routines (2.1.107 / 2026-04-14) → Auto Mode → Managed Agents (2.1.132 / 2026-05-06) → latest (2.1.139 / 2026-05-11 UTC) |

副线:OpenAI Codex 一年的演进,在 4-30 把 agent loop 整体 bake 进 `/goal` 一条命令。

## 来源说明

本目录的所有材料来自一次完整的对话准备。所有外部引用(数据、官方 blog、X tweet)都附可验证链接,具体见 `research/` 三个文件末尾的 caveat 段。
