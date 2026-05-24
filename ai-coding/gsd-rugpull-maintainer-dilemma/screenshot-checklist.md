# 配图素材清单

> 文章 hero 图 + 7 张内文配图。每张图说明：URL、抓什么内容、放在文章哪一段。
>
> **能力说明：** X / Twitter 内容反爬严，多数情况下 fetch 会失败。手动截图（手机系统截图或桌面 DevTools 的 full size screenshot）样式更干净，公众号编辑器更友好。

## 优先级

**必选 3 张**（保证文章成色）：
- 图 1：GSD 告别信（hero 图）
- 图 3+4：Den Delimarsky 两张并排（Microsoft 离职 + 入职 Anthropic）
- 图 6：Aider "Where is Paul?"

**强烈推荐 2 张**：
- 图 2：trek-e 声明
- 图 7：OpenCode PR "anthropic legal requests"

**有就更好的 3 张**：
- 图 5：Sam Altman 宣布 Steinberger
- 图 8：Anthropic ToS 截图
- 图 0：NullTX / Our Crypto Talk 事件报道页（hero 备选）

---

## 1. GSD 跑路告别信（hero 图）

**截图源**：原 X 推文应在 @official_taches 账号下，但**账号已删**，X 上抓不到。

**备选源（按推荐度排序）：**
1. NullTX 报道：https://nulltx.com/hackathon-champion-to-failed-project-in-10-days-gsd-founder-allegedly-rugs-just-after-receiving-his-100k-grant/
2. AI Weekly 事件摘要：https://aiweekly.co/alerts/get-shit-done-creator-rug-pulls-gsd-token-vanishes
3. Our Crypto Talk 报道（包含告别信截图引用）：https://ourcryptotalk.com/news/bags-hackathon-winner-gsd-cloud-rug-pull

**截图什么**：截 NullTX 文章顶部含标题 + 告别信引文那块

**用在**：文章开头 hero 图 + 视角一引用告别信处

**关键引文**（告别信全文社区只 OCR 出这一段）：
> "GSD Cloud is obsolete. Everything I've worked on for months has now been absorbed directly into tools like the Codex and Claude Code apps. There is no beating multi-billion dollar AI software companies."

---

## 2. trek-e 在 redux 仓库的声明

**URL**：https://github.com/open-gsd/get-shit-done-redux/discussions/109

**截图什么**：discussion 顶部 trek-e 写的声明，特别是这段：
> "I have no inside information beyond what is publicly visible. I am stating absence-of-information deliberately — absence of news is not the same as evidence."

**用在**：视角三（trek-e）那段

---

## 3. Den Delimarsky 离开 Microsoft

**URL**：https://den.dev/blog/microsoft-chapter-wrap/

**截图什么**：博客标题 + 头几段，包括这两句：
> "GitHub Spec Kit, which blasted past 61,000 stars on GitHub"
>
> "GitHub Spec Kit is the second most starred repository in the entire GitHub org"

**用在**：4 种结局段 · Spec Kit → Anthropic 那条

---

## 4. Den Delimarsky 加入 Anthropic

**URL**：https://den.dev/blog/anthropic/

**截图什么**：博客标题《Hello, Anthropic》+ 关键句：
> "My next chapter is joining Anthropic (yes, that Anthropic) as a Member of Technical Staff."

**或** den.dev/about 页 bio 那句："I am a Member of Technical Staff at Anthropic"

**用在**：4 种结局段 · 紧接图 3

**强建议**：把图 3 + 图 4 拼在一起做对比图——"昨天还在 GitHub 维护 61K stars 项目，今天就去 Anthropic 了"——视觉冲击力最强

---

## 5. Sam Altman 宣布 Peter Steinberger 加入 OpenAI

**主源**：Sam Altman 在 X 上宣布的原推（2026-02-15）。需在 X 搜索 `from:sama Peter Steinberger OpenAI` 找到原帖。

**备选源**：
- TechCrunch 报道：https://techcrunch.com/2026/02/15/openclaw-creator-peter-steinberger-joins-openai/
- CNBC：https://www.cnbc.com/2026/02/15/openclaw-creator-peter-steinberger-joining-openai-altman-says.html

**截图什么**：Sam Altman 的原推（如能找到）或 TechCrunch 标题 + 头图

**用在**：4 种结局段 · OpenClaw → OpenAI 那条

---

## 6. Aider Issue #4613 "Where is Paul?"

**URL**：https://github.com/Aider-AI/aider/issues/4613

**截图什么**：issue 标题 + 楼主原话：
> "The most urgent issue currently for this project is clarifying Paul's status. He has gone dark on twitter (I've pinged him) and in the discord. Paul are you OK???"

**配套截图**（可选）：
- Issue #4648：https://github.com/Aider-AI/aider/issues/4648
- Paul 的回复："I am currently busy with other projects. I look forward to having more time to work on aider in the future."

**用在**：4 种结局段 · Aider → 沉默 那条

**强建议**：这张图视觉上最"惨"——巨大的标题 "Where is Paul?" 配上 issue 区的冷清，是文章里最有情绪张力的素材

---

## 7. OpenCode PR #18186 "anthropic legal requests"

**URL**：需要在 `sst/opencode` 仓库找 PR #18186

**搜索路径**：https://github.com/sst/opencode/pulls 找 #18186

**截图什么**：PR 标题 "anthropic legal requests" + 437 个 👎 反对 reaction

**用在**：视角一谈"AI 大厂结构性碾压"那段

**为什么强**：commit message 本身就是一行字的故事——开源项目被法务函逼着删订阅认证代码

---

## 8. Anthropic ToS 截图（可选）

**URL**：Anthropic 的 Usage Policy 或 Commercial Terms 中关于第三方 OAuth 的条款。需在 https://www.anthropic.com/legal 查找。

**截图什么**：明确禁止第三方 harness 使用 Pro/Max 订阅的那段

**用在**：视角一谈"2026 Q1 Anthropic 收紧"处

---

## 操作建议

**省时操作流**：手机直接点开 URL → 系统截图 → 公众号编辑器导入

**桌面更好的工具**：Chrome DevTools 的 "Capture full size screenshot" 抓博客

**X 截图**：iPhone 长截图 / Android 系统滚动截图最稳，不要用三方工具（会带水印）

**对比图制作**：图 3 + 图 4 拼合，推荐用 Figma / Canva / 系统自带的并排截图功能
