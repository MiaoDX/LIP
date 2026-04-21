# LIP 死链修复计划

## 当前状态
- `ignoreDeadLinks: true` 已恢复（临时）
- lychee 设为 `continue-on-error`
- 已修 1 个：localhost:4000
- 待修 53 个

## 修复优先级

### P0 — 明显错误（已修 1 个）
- [x] `http://localhost:4000` → discussions/2026-03-07-gsd-launch.md

### P1 — sidebar / 导航死链（高曝光）
sidebar 里链接了不存在的文件：

**share/ 目录（ presentations 是 .html 文件）：**
- `/share/AICodingRaiseLab` → 实际在 `share/presentations/AICodingRaiseLab.html`
- `/share/openclaw-sharing-v3` → 实际在 `share/presentations/openclaw-sharing-v3.html`
- `/share/lowcost-multiplatform-multiagent-deploy` → 实际在 `share/presentations/lowcost-multiplatform-multiagent-deploy.html`
- `/share/claws-civilization` → 实际在 `share/presentations/claws-civilization.html`

**修复方案：** sidebar 链接加 `.html` 后缀，或创建 `.md` 入口文件

**en/ 目录（英文版缺失）：**
- `/en/share/AICodingRaiseLab` 等 — 同上
- `/en/resources/config-guide` — 文件不存在
- `/en/resources/deployment-guide-v2` — 文件不存在

### P2 — README.md / 首页目录链接
README.md 里的目录链接在 GitHub 上工作，但 VitePress 下是死链：
- `./discussions/index` → discussions/ 无 index.md
- `./now/index` → now/ 无 index.md
- `./presentations/index` → presentations/ 无 index.md
- `./prompts/index` → prompts/ 无 index.md（甚至无 prompts/ 目录）
- `./proposals/index` → proposals/ 无 index.md
- `./resources/index` → resources/ 无 index.md
- `./stories/openclaw-01-deployment` 等 → 文件不存在

**修复方案：** 创建缺失的 index.md 或修改链接指向现有文件

### P3 — stories/ 里的相对路径
- `stories/2026-03-dual-agent-start.md` 里的 `./openclaw-01-deployment` 等
- `stories/gateway-6hour-outage.md` 里的 `./../lessons/gateway-resilience`

### P4 — share/ 目录内链
- `share/index.md` 里的 `/share/weekly/weekly-robotics-356` — 文件可能不存在
- `ai-coding/index.md`、`openclaw/index.md` 里的 `/share/xxx` 链接

### P5 — bestpractice
- `/bestpractice/mistral-forge-enterprise-model-engineering` — 可能改名

### P6 — slides/
- `/slides/slidev/index` — 需要确认

### P7 — en/ 全面同步
- 大量 en/ 前缀链接指向不存在的文件
- 需要确认哪些 en/ 文件应该存在、哪些是占位

## 修复策略

**第一批（今晚）：**
1. sidebar share/ 链接加 .html
2. 创建缺失的 index.md（now/, discussions/, resources/, proposals/）
3. 修复 stories/ 里的相对路径

**第二批：**
4. 修复 README.md 链接
5. 修复 bestpractice 链接
6. 修复 slides/ 链接

**第三批：**
7. 全面清理 en/ 死链
8. 关闭 ignoreDeadLinks
9. 恢复 lychee 硬门禁
