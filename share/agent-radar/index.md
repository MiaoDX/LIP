# Agent Radar

> 面向 AI Agents、Coding Agents、Agent Infra 与 TOP AI Lab 实践的高信号日报入口。

这个栏目用于承载自动化生成的每日情报，但不会追求“每天把所有新闻重复一遍”。更重要的是：只记录新增事实、关键变化、值得回看的技术材料，以及对 MiaoDX 当前 AI Agent / OPC 实践有复用价值的判断。

## 栏目目标

- 跟踪 OpenAI、Anthropic、Google DeepMind、Meta、NVIDIA、Microsoft、LangChain 等 TOP 实验室/平台的最新博客、文档、SDK 与案例。
- 跟踪 AI Agent、Coding Agent、Agent Runtime、MCP、Evals、Observability、Memory、Sandbox、Workflow Automation 等工程化方向。
- 过滤重复信息：同一主题只在出现新事实、新能力、新案例或新判断时更新。
- 沉淀可复用材料：把短期日报逐步转化为 bestpractice、lessons、talks 或 product ideas。

## 推荐信息架构

```text
share/agent-radar/
├── index.md                  # 当前入口页
├── daily/                    # 每日简报，只记录新增变化
│   └── 2026-05-21.md
├── labs/                     # TOP AI Lab 博客/文档分析
│   ├── openai/
│   ├── anthropic/
│   ├── google-deepmind/
│   ├── meta/
│   ├── nvidia/
│   └── langchain/
└── repo-scout/               # GitHub repo 个性化雷达
    └── 2026-05-21.md
```

## 每日简报去重原则

1. **不重复背景**：已经连续多天出现的主题，只保留一句“延续趋势”，除非有新发布、新数据或新代码。
2. **按事实增量写**：优先记录发布日期、产品名、能力变化、API/SDK/文档链接、影响判断。
3. **区分新闻与判断**：新闻写事实，判断写“为什么对 agent 工程化有意义”。
4. **优先工程信号**：runtime、state、eval、observability、sandbox、tooling、MCP、cost、governance 高于泛泛模型发布。
5. **每周可回收**：日报内容应能在周末被整理成一篇 `bestpractice` 或 `lessons`。

## 两条并行线

### 1. Daily Agent Brief

适合记录当天新增变化：

- OpenAI / Codex / Agents SDK
- Anthropic / Claude Code / MCP tooling
- Google DeepMind / Gemini / ADK / Genkit
- GitHub Trending / OSSInsight
- Hacker News 高信号讨论
- LLM tooling / gateway / eval / observability

### 2. TOP Lab Docs Analysis

适合做深度拆解，不要求每天更新：

- OpenAI Cookbook、Agents SDK、Codex、安全实践
- Anthropic engineering blog、Claude Code、MCP、context engineering
- Google DeepMind / Google Developers 的 ADK、Genkit、Gemini API、File Search
- NVIDIA / Microsoft / Meta 的 agent、robotics、simulation、developer workflow 文档
- LangChain / LangGraph / LangSmith 的 production agent pattern

## 当前状态

- [ ] 建立 `daily/` 首篇日报
- [ ] 建立 `labs/` 分析模板
- [ ] 建立 `repo-scout/` 个性化 GitHub 推荐模板
- [ ] 接入自动化任务：每天只写新增信息，避免重复刷屏

## 输出格式建议

每日内容保持 5 分钟内可读：

```markdown
# Agent Radar Daily — YYYY-MM-DD

## 今日新增

## TOP Lab / Platform Updates

## Repo / Tooling Signals

## HN / Community Signals

## 对 MiaoDX 的复用价值

## 不再重复追踪
```

“TOP Lab Docs Analysis” 则适合更长一些，聚焦一篇文档/博客：

```markdown
# 文档标题

## Source

## TL;DR

## 关键机制

## 可复用模式

## 和 LIP / OPC / Agent Reliability 的关系

## 后续动作
```
