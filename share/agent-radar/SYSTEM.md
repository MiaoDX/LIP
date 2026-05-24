# Agent Radar Operating System

> 目标：把每日 AI Agent / Coding Agent 信息流，从“重复新闻推送”升级为“可沉淀、可去重、可复用的工程情报系统”。

## 1. 信息产品分层

Agent Radar 分为三层，不同层级承担不同职责。

### Daily Agent Brief

每日更新，只记录过去 24 小时的新增变化。

适合内容：

- 新发布的模型、SDK、CLI、API、文档、案例、工程博客
- GitHub 新增或突然爆发的 agent / tooling repo
- Hacker News、开发者社区中出现的新争议或新实践
- 已追踪主题的新事实：价格、限额、发布范围、API 变化、企业案例、开源代码

不适合内容：

- 已连续多天重复的背景介绍
- 没有新事实的趋势复述
- 只有营销话术、缺少工程细节的发布
- 不能和 MiaoDX 当前方向建立关系的泛 AI 新闻

### Weekly Pattern Digest

每周整理一次，从 daily 中抽取模式。

适合内容：

- 本周最重要的 3-5 个工程趋势
- 多家公司同时押注的共同 pattern
- hype 与 long-term signal 的区分
- 可转化成 lessons / bestpractice / talks 的候选主题

### Lab Docs Analysis

不要求每天更新，针对 TOP AI Lab / 平台的重要博客或文档做深拆。

适合内容：

- OpenAI Agents SDK、Codex、安全实践、Cookbook
- Anthropic Claude Code、MCP、context engineering、multi-agent research
- Google ADK、Genkit、Gemini API、File Search、Vertex AI Agents
- NVIDIA、Microsoft、Meta、LangChain 等的 production agent pattern

## 2. 目录规范

```text
share/agent-radar/
├── index.md
├── SYSTEM.md
├── daily/
│   └── YYYY-MM-DD.md
├── weekly/
│   └── YYYY-WW.md
├── labs/
│   ├── openai/
│   ├── anthropic/
│   ├── google-deepmind/
│   ├── meta/
│   ├── microsoft/
│   ├── nvidia/
│   └── langchain/
└── repo-scout/
    └── YYYY-MM-DD.md
```

## 3. Daily 去重协议

每日生成前，先读取最近 3-7 篇 `daily/*.md` 的主题，建立“已追踪主题集合”。

### 重复判断

同一个主题只有在满足至少一个条件时才再次写入：

1. 有新发布日期或新版本号。
2. 有新 API、SDK、CLI、参数、限额、价格或可用范围变化。
3. 有新的企业案例或真实生产实践。
4. 有新的开源代码、benchmark、issue、PR 或安全事件。
5. 对 MiaoDX 的 Agent / OPC / LIP 方向产生新的行动建议。

否则放入 `不再重复追踪`，最多一句话带过。

### 输出约束

- 每篇控制在 5 分钟内读完。
- 不超过 6 个一级 section。
- 每个事实点尽量包含日期和来源链接。
- 每天最多保留 3 个“真正重要”的主线判断。
- 重点写增量，而不是背景百科。

## 4. Daily 模板

```markdown
# Agent Radar Daily — YYYY-MM-DD

> 今日主线：一句话说明今天真正发生了什么变化。

## 1. 新增事实

- YYYY-MM-DD — Source / Org：发生了什么。为什么这不是重复信息。

## 2. TOP Lab / Platform Updates

- OpenAI：新增变化
- Anthropic：新增变化
- Google / DeepMind：新增变化
- Other：新增变化

## 3. Repo / Tooling Signals

- Repo / Tool：为什么值得关注，和 agent engineering 的关系。

## 4. Community / HN Signals

- 讨论主题：社区真正关心的问题，而不是标题党。

## 5. 对 MiaoDX 的复用价值

- 可进入 LIP / bestpractice / lessons / talks 的候选点。

## 6. 不再重复追踪

- 已连续出现但今天无新增事实的主题。
```

## 5. Lab Docs Analysis 模板

```markdown
# 文档标题

## Source

- URL:
- Published:
- Org:

## TL;DR

一句话总结这篇文档的工程价值。

## 关键机制

- 机制 1
- 机制 2
- 机制 3

## 可复用模式

- Pattern:
- Anti-pattern:
- Production implication:

## 和 LIP / OPC / Agent Reliability 的关系

说明它如何服务 MiaoDX 当前实践。

## 后续动作

- [ ] 是否转入 `bestpractice/`
- [ ] 是否转入 `lessons/`
- [ ] 是否适合做分享 / talk
```

## 6. Daily 自动化执行规则

自动化任务应该：

1. 搜索过去 24 小时的 AI Agent / Coding Agent / Agent Infra 更新。
2. 读取最近 3-7 篇 daily，识别重复主题。
3. 只生成新增信息，明确标注“新增事实”。
4. 写入 `share/agent-radar/daily/YYYY-MM-DD.md`。
5. 更新 `share/agent-radar/index.md` 的 Latest 列表。
6. 如果某篇 TOP Lab 文档值得深拆，只在 daily 中记录候选，不自动写长文，除非被显式要求。

## 7. 质量标准

一篇合格的 Daily Brief 应该满足：

- 读完能知道今天真正变化了什么。
- 不需要读昨天的文章也能理解，但不重复昨天的主体内容。
- 至少有一个可行动建议。
- 至少有一个“可以沉淀成 bestpractice / lessons”的候选项。
- 没有为了填满栏目而硬凑新闻。
