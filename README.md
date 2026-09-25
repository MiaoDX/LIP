# LIP — Learn In Public

> "AI Coding Agent × 机器人的公开实践。
> 不是教程，是真实踩坑日志。"

— MiaoDX, 2026

> [!NOTE]
> 本仓库是 AI Coding / Agent 工程的公开实验与写作现场，不是完整职业履历。当前职业定位、机器人系统工作与可核对结果，请从 [完整简历](https://miaodx.com/resume/) 和 [Work Timeline](https://miaodx.com/LIP/share/work-timeline.html) 开始。

## 目录

| 目录 | 内容 |
|------|------|
| [`ai-coding/`](ai-coding/) | 主线：AI Coding × 机器人的专题页与项目式演讲（含 research / scripts / assets） |
| [`bestpractice/`](bestpractice/) | TOP AI Lab / Agent 工程实践拆解 |
| [`share/`](share/) | 分享入口与 Markdown 教程；`presentations/` 是演讲 HTML 源 |
| `presentations/` | 演讲 HTML 源，发布到 `/share/` |
| [`slides/`](slides/) | Marp / Slidev 幻灯片源 |
| `public/consult/` | 咨询页源（公开静态输出） |
| [`openclaw/`](openclaw/)、`stories/`、`lessons/`、`resources/`、`now/` | 归档：2026 H1 OpenClaw 多实例实验，已停止更新 |
| [`templates/`](templates/README.md) | Standalone deck 与演讲模板 |
| `docs/` | Agent runbook（`docs/agents/`）、人类补充说明（`docs/human/`）、进行中的计划（`docs/plans/`），均不公开发布 |
| `scripts/` | VitePress、Marp、发布规则、质量门禁脚本 |
| `sites/miaodx.com/` | 个人主页与 Resume 的独立部署 submodule，不进入 LIP 构建 |
| `interviews/` | 私有 submodule，永不进入公开输出 |

## 阅读推荐

**职业与机器人系统**：
1. [完整简历](https://miaodx.com/resume/) — 当前定位、经历与结果证据
2. [Work Timeline](https://miaodx.com/LIP/share/work-timeline.html) — 从量产交付、团队建设到模型与真机

**AI Coding × 机器人**：
3. [AI Coding 总览](ai-coding/index.md) — Routines、roboharness、roboclaws、Ultrathink/Goal

**归档精选**（OpenClaw 时期）：
4. [gateway-6hour-outage.md](stories/gateway-6hour-outage.md) — 6 小时宕机复盘
5. [error-to-skill-evolution.md](lessons/error-to-skill-evolution.md) — 错误→Skill 自进化

## 内容来源

讨论与方向决策先在 [scratch-pad](https://github.com/MiaoDX/scratch-pad) 的 `notes/` 中沉淀；组织成熟、值得发表的内容才进入 LIP。LIP 不再承接原始讨论记录与草稿队列。

## 相关

- 个人主页：[miaodx.com](https://miaodx.com)，源码位于 `sites/miaodx.com/` submodule

## 给 Agent 的说明

本仓库是独立的 LIP GitHub Pages / VitePress 内容仓库，远端为 `MiaoDX/LIP`。

**写入规则**：
- stories/ 和 lessons/ 内容不应大段重复 — 用"一句话摘要 + 链接到完整版"
- 未成熟的讨论和草稿放在 scratch-pad，不进 LIP；公开发布内容放入对应栏目后同步更新入口
- Agent 操作规则以 `AGENTS.md` 和 `docs/agents/` 为准，Claude-specific 例外见 `CLAUDE.md`
- 人类当前态和架构说明以 `ARCHITECTURE.md`、`STATUS.md`、`docs/human/` 为准；不要把 agent runbook 当作公开项目真相
- Agent/process 文档不会发布到 GitHub Pages；`npm run build:all` 会完成公开输出边界、关键本地链接和发布规则检查。已有构建输出时，可用 `npm run quality:check` 做聚焦复查
- `sites/miaodx.com/` 独立发布 `miaodx.com`；在子模块内提交并推送后，再更新 LIP gitlink

**share/ 目录规则**：

share/ 下有两种文件类型，用途不同：

| 类型 | 放哪里 | 渲染方式 | 适合 |
|------|--------|----------|------|
| `.md` | `share/` 根目录 | VitePress 自动渲染 | 教程、配置指南、博客文章 |
| `.html` | `presentations/` | GitHub Actions 复制到 `/share/` | 演讲稿、Slide、需要离线分享的内容 |
| `index.html` + 素材 | `ai-coding/<slug>/` | GitHub Actions 复制到同路径 | 带 research / scripts / screenshots 的专题演讲项目 |

- **写文章/教程** → `share/your-article.md`
- **做演讲/Slide** → `presentations/your-talk.html`（配套图片放同目录，部署后访问 `/LIP/share/your-talk.html`）
- **做 AI Coding 专题演讲项目** → `ai-coding/your-talk/index.html`（素材放 `images/`、`screenshots/` 或 `assets/`，部署后访问 `/LIP/ai-coding/your-talk/`）
- **不要提交 `public/share/` 或根目录 `consult/`** → `npm run publish:check` 会检查这些 source-of-truth 规则
- **咨询页** → `public/consult/*.html`（部署后访问 `/LIP/consult/...`）；这是公开静态输出，不要放需要保密、登录或客户端密码保护的材料
- 新增正式发布 Markdown 文章时，同步更新对应入口和 `site-map.mjs`
- 详见 `share/README.md`
