# Meetup 分享大纲（初版）

**分享题目：借助 Claude Code Routine 把想法快速完成 0 到 1**

> 基于公众号文章 [`index.md`](./index.md) 扩充。
> 时长目标：18–20 min（不紧）。
> 现场 demo：用电脑。
> 主线 case：docfit（毕业生 Word 文档按学校模板自动校正，目前 private repo，跑稳后开源）。
>
> 设计原则：**KISS——尽量复用公众号文章原文，docfit 截图替换 roboharness 截图作为主线 case**。

---

## 时间分配速览

| #   | 节                        | 时长   | 幻灯片  | 复用文章哪段                  |
| --- | ------------------------- | ------ | ------- | ----------------------------- |
| 0   | 开场                      | 1 min  | 1       | —                             |
| 1   | 钩子：docfit 是什么        | 2 min  | 2       | 引言（"Routines 容易被漏的"） |
| 2   | 核心 pattern：从想法到 issue | 3 min  | 3       | "核心模式"段                   |
| 3   | 为什么必须是云端          | 2 min  | 1–2     | "为什么必须是云端"段（原样）   |
| 4   | 4 routine 架构            | 3 min  | 3       | "架构总览" + "四个 routine 细节" 压缩 |
| 5   | 暗线：4 个 agent 怎么不打架 | 3 min  | 2       | "暗线"段（基本原样）            |
| 6   | docfit 4 个 milestone 走到哪了 | 4 min  | 5       | （主要用新截图）                 |
| 7   | 翻过的车                   | 1 min  | 1       | "翻车"列表（用文章原图）           |
| 8   | 现场 demo                 | 2 min  | 0（切电脑）| —                              |
| 9   | 边界 + What's next + 收尾  | 2 min  | 2       | "适用边界" + "What's Next"      |
|     | **合计**                  | 23 min | ~20 张  |                                 |

---

## 0. 开场（1 min, 1 slide）

- 自我介绍（一句话）
- 这次分享的承诺：**让大家看到一个人 + 一组 routine 怎么把一个新项目从 0 推到 alpha，全程基本不坐电脑前**
- 讲话方式预告：不展开理论，主要看一个真实在跑的项目 docfit

> 复用：文章引言"Routines 是 Opus 4.7 更新里容易被漏掉的那一条"——但只用一句话带过，不展开。

---

## 1. 钩子：docfit 是什么 + 当前状态（2 min, 2 slides）

**Slide 1 — docfit 是什么**

- 一句话项目定义：把毕业生的 Word 文档按学校模板要求自动校正格式
- 起源：朋友毕业季踩坑 → 这周五（2 天前）才开了这个 repo
- 现状：private，跑稳之后会开源
- 用途：先做 alpha 给身边几个学校的同学测，再考虑公开

**Slide 2 — 两天后的样子**

- 截图：`21-status-overview-table.jpg`（4 milestone / 16 issue / 12 已合 / 429 个测试）
- 截图：`11-commits-claude-coauthor.jpg`（commits 大部分是 "MiaoDX 和 claude 撰写"）
- 反差点（讲一句即可）：**这两天我没坐过电脑，全部用手机操作**
  - 截图：`19-claude-web-sidebar.jpg`（Claude web 移动端 sidebar）
- 留钩子："这是怎么做到的？"

> 整节强调"看到东西在跑"，不展开技术细节。

---

## 2. 核心 pattern：从想法到 issue（3 min, 3 slides）

> 复用：文章"核心模式"段（第 23–46 行）。原文论点保留，截图换成 docfit 的过程。

**Slide 3 — 三步骤**

文章原文那三句（直接念）：

> 1. **和 Claude Opus 一起把想法变成 roadmap**
> 2. **把 roadmap 拆成 GitHub issues**——每个 issue 一个明确的小目标
> 3. **让 agent 挨个把 issue 解掉**——每小时一个，跑起来就不用管

强调："第 1 步比'聊 roadmap'三个字要厚得多。"

**Slide 4 — Opus 不是搜索框，是反问者**

- 截图：`04-deep-research-prompt.jpg`（Opus 主动反问 dimensions，而不是直接搜）
- 截图：`06-word-vs-latex-pivot.jpg`（"Word→LaTeX 这一步不一定必要"——Opus 主动挑战我的初版假设）
- 一句话总结：**Opus 的价值不是"帮你搜"，是"逼你想清楚"**

> 这两张图是 docfit 的真实对话片段，比文章里的描述更有现场感。

**Slide 5 — 拆 issue 的颗粒度**

- 截图：`03-milestone-split-plan.jpg`（M1–M4 对应 Week 1–8 的拆分计划）
- 截图：`02-issues-created-20.jpg`（20 issue + 4 milestone + 29 label + 依赖评论一次性创建）
- 文章原文一句（直接引用，第 41 行）：

  > **这一步做得好不好，直接决定了后面 agent 能跑多远**。一个含糊的 roadmap 拆出的 issue 也是含糊的，含糊的 issue 给到 auto_pr 就是垃圾进垃圾出。

---

## 3. 为什么必须是云端（2 min, 1–2 slides）

> 复用：文章"为什么必须是云端"段（第 49–63 行）几乎原样。

**Slide 6 — 三层差异**

直接念文章三段小标题 + 一句话各自展开：

- **一致性**：每个人电脑上 Python/CUDA 不一样 → Routines 跑在 Anthropic 容器里，每次环境一样
- **持续性**：本地合上电脑就停 → 云上人睡觉时它在干活
- **设备解耦**：操作迁移到手机 → agent 工作周期和人的工作周期彻底解耦

引用 Anthropic 的类比（直接念，第 59 行）：

> **"一个软件项目由一群轮班工程师维护，每个人来的时候都没有上一班的记忆"**

延伸一句（第 63 行）：

> **真正的工作不是写 prompt，是给这些轮班工程师设计工作环境**——让他们即使没有记忆，也能顺畅接班。

> 这一节是整个分享的"哲学锚点"，停一下让大家消化。

---

## 4. 4 routine 架构（3 min, 3 slides）

> 复用：文章"架构总览" + "四个 routine 细节"，但合并压缩——meetup 不需要每个 routine 都细讲。

**Slide 7 — 四个 routine 一张图**

- 复用文章里的 SVG：`images/09-architecture-overview.svg`
- 截图补充：`17-routines-quota-16of28.jpg`（docfit 实际配的 routine 列表）
- 一句话：**auto_pr 主力 + 三个辅助（issue_label / pr_again / daily_duty）**

**Slide 8 — auto_pr 主力（每小时）**

- 截图：`16-runs-history-scheduled.jpg`（稳定每小时一次）
- 两个值得分享的设计（节选自文章第 98–110 行）：
  - **断点续传**：每次启动先检查有没有未收尾的 `claude-issue-*` 分支
  - **三态自评**：FULLY RESOLVED / PARTIALLY DONE / DIMINISHING RETURNS
- 文章 SVG：`images/10-three-state-self-eval.svg`
- 关键洞察（直接念第 110 行）：

  > 给它一个"做一半也 OK"的出口，它反而会诚实汇报。

**Slide 9 — 三个辅助 routine 一句话各自**

- **issue_label**：每天扫一遍 backlog，打优先级 label——**禁止写代码**（物理隔离）
- **pr_again**：扫"代码推上去了但 PR 没建成"的孤儿分支——救援
- **daily_duty**：CI 兜底 + dead code 清理——**不碰 auto_pr 的分支**

> 这一节快讲，重点是让观众感受到"职责严格不重叠"。细节留到下一节"暗线"。

---

## 5. 暗线：4 个 agent 怎么不打架（3 min, 2 slides）

> 复用：文章"暗线"段（第 163–179 行）几乎原样。这是整个分享的技术干货密度峰值。

**Slide 10 — 两条隐性协议**

直接念文章那两条（第 169–171 行）：

> **一、分支命名空间隔离**。`claude-issue-*` / `claude-health-*` / `claude-ci-fix-*` / `claude-cleanup-*`——每个 routine 有自己的 playground，**物理上不会踩脚**。
>
> **二、GitHub comment 作为消息协议**。`[auto-pr]` / `[ci-fail]` / `[deferred]` / `[conflict]` 这些前缀就是 agent 之间的消息。

文章 SVG：`images/11-message-protocol.svg`

强调（第 173 行原文）：**就这两条。没有中心调度器，没有 orchestration 服务，没有专门的消息队列。**

**Slide 11 — GitHub 作为协作基底**

- 截图：`09-issue-depends-on.jpg`（连 issue 之间的依赖也用 GitHub 原生原语承载）
- 截图：`10-issue-detail-perturb.jpg`（issue 内容写得多详细，agent 就能跑多远）
- Erlang actor model 类比（第 175 行原文，直接念）：

  > 这个设计有点像 Erlang 的 actor model 哲学——**独立失败、通过消息协作**。

- 收一句：**GitHub 已经是消息总线，不用造任何 orchestration**

---

## 6. docfit 4 个 milestone 走到哪了（4 min, 5 slides）

> 这一节几乎全部用新截图。逐 phase 走，让大家看到一个真实项目"拆开来每一段在干什么"。

**Slide 12 — 进度看板**

- 截图：`21-status-overview-table.jpg`
- 一张图说清楚：4 个 milestone, 16 个 issue, 12 个已合, M4 进行中, 429 个测试
- 一句话过渡："下面挨个 milestone 看一眼实际产出。"

**Slide 13 — M0 + M1：脚手架 + 学校配置（北航当种子）**

- 截图：`01-todos-phase1-complete.jpg`（Phase 1 完整 todos checklist——`apply_to_range`、`build_seeds.py`、BUAA seed corpus 都在）
- 一句话：M0 是项目骨架 + CI；M1 是把"北航毕业论文格式 spec"沉淀成可对比的种子 + 特征提取
- **关键点**：每个 todo 都对应一个具体 PR——这就是 agent 能跑的颗粒度

**Slide 14 — M2：端到端 pipeline 跑通**

- 截图：`08-pr-list-merged.jpg`（merged PR 列表，能看到 `feat: #10 — End-to-end M2 pipeline`、`feat: #8 — SectionStage`）
- 一句话：M2 把 docx → 分段 → 检测 → 输出走通——之后所有事情都建立在这个 pipeline 上

**Slide 15 — M3：识别引擎 + 回归测试**

- 截图：`10-issue-detail-perturb.jpg`（一个 issue 长什么样：清晰的 What / Scope / 支持的扰动类型）
- 截图：`09-issue-depends-on.jpg`（连依赖关系都用 GitHub 原生原语承载）
- 一句话：M3 加扰动工具 + 回归测试，让"识别准不准"有客观数字衡量；同时这两张图也回答了"什么样的 issue 才能让 agent 跑得动"——细节够厚 + 依赖关系明确

**Slide 16 — M4：第二所学校 onboard + alpha 距离**

- 截图：`11-commits-claude-coauthor.jpg`（高亮 `feat: #16 — Onboard Tsinghua (second school)`——commits 大部分都是 "MiaoDX 和 claude 撰写"）
- 截图：`22-alpha-blockers-list.jpg`（必须 vs 可选 blockers——真实剩下的事）
- 一句话：M4 验证"换一所学校能不能复用"——这是这类工具最重要的 generalization 验证；alpha 还差的事很具体（≥20 份脱敏样本 + 5 人 alpha 测试），不是空话

> 这一节的"诚实话"（沿用文章第 225 行思路）：**这套东西目前还在调试期，docfit 也还没到 alpha**——但每一步进展都看得见。

---

## 7. 翻过的车（1 min, 1 slide）

> 这一节用文章原图打底，docfit 不再单独举例。三条翻车直接念。

**Slide 17 — 翻车 + harness 思维**

- 背景图：复用文章里的 `images/05-daily-duty-runs.png`（daily_duty 稳定运行的图——和"翻车"形成对比）
- 文章原文（第 227–233 行）三条直接列：
  - auto_pr 曾经把同一个 issue 重复处理两遍 → 加"检查是否已有 `claude-issue-{number}` 分支"
  - daily_duty 曾经去合 auto_pr 的分支撞车 → 加"不碰 `claude-issue-*` 分支"
  - issue_label 曾经"顺手"修了 bug 提了 PR → 加"ONLY labels/closes issues"禁令
- 收一句（第 233 行原文）：

  > 每一次翻车都变成 prompt 里多一行约束。这就是 harness 的日常迭代。

---

## 8. 现场 demo（2 min, 切电脑）

**演示路径建议**（实际现场可微调）：

1. 打开 [claude.ai/code](https://claude.ai/code) → Routines 页面，让大家看到 docfit 的几个 routine 列表
2. 切到 Code dispatch 视图（参考 `20-code-dispatch-view.jpg`），让大家看到当前在跑的 session
3. 切到 GitHub docfit repo（如果方便临时 invite 几个人 / 或截图）
   - PR list
   - 一个最近合入的 PR + 底部那条 `claude.ai/code/session_xxx` 链接
4. 点进 session 链接，给大家看一眼 agent 当时的思考过程

> 备选：如果现场网络不稳，直接放屏幕录屏 30s。

> Demo 之后回到一句话总结，过渡到下一节。

---

## 9. 边界 + What's next + 收尾（2 min, 2 slides）

> 复用：文章"适用边界"（第 243–259 行）+ "What's Next"（第 263–281 行）+ 结尾（第 287–298 行）。

**Slide 18 — 适用边界**

直接列原文：

适合的场景：

- 产出**可视化强**的项目
- **新想法到原型阶段**（60–70 分目标）
- 工具类、SDK 类、有明确 spec 的功能
- **独立模块较多**的 repo

不适合的场景：

- 深度调试 / 硬件交互 / 主观审美 / 复杂线上状态

收一句（第 259 行原文）：**把 routine 当 senior intern 用，不是当 senior engineer 用。**

**Slide 19 — What's next + 收尾**

- 一句话 What's next（第 269–279 行压缩）：把调度权也交给 agent——OpenClaw 当 meta-scheduler，自然语言指令进、routine 自动触发
- 一句话总结（第 287 行原文）：

  > Opus 聊方向 → 拆 issue → auto_pr 每小时干一点 → daily routines 每天兜底 → 人只做 review 和方向把控

- 资源链接：
  - 公众号文章（在 LIP 仓库 ai-coding/routines-multi-agent/index.md）
  - 4 个 routine 的完整 prompt
  - docfit：private 中，跑稳后开源
- Q&A 邀请

---

## 待确认 / 待补充

- [ ] docfit demo 现场走查路径（建议提前在电脑上预排一次，确认网络、登录态都 OK）
- [ ] 是否需要打印一份 cheatsheet（4 个 routine 名 + 协议前缀），方便观众回去复用
- [ ] slide 视觉风格——沿用文章里的 SVG 还是重新做？
- [ ] 文章里有些 roboharness 数据（148 PR、auto_pr 12 次/天）要不要保留作为"另一个跑的项目"佐证，还是全部换成 docfit？我倾向：**保留 1 张 roboharness 截图当 social proof，正文 case 全部用 docfit**

