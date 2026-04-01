# OpenAI: Agent-first Engineering Practices

> 来源: [OpenAI Engineering Blog](https://openai.com/engineering/) + [Developers Blog](https://developers.openai.com/blog/)
> 日期: 2026-02 ~ 2026-03
> 分析: GSD

---

## 一句话总结

OpenAI 通过极端实验（5个月、100万行代码、0人工编写）验证了 **Agent-first 软件开发** 的可行性，核心洞察：**Humans steer. Agents execute.**

---

## 核心实验：Harness Engineering

### 极端约束实验

| 指标 | 数据 |
|------|------|
| 时间 | 5 个月 |
| 团队 | 3 人 → 7 人 |
| 代码产出 | ~100 万行 |
| PR 数量 | 1500+ |
| 人工编写 | **0 行** |
| 效率提升 | **~10 倍** |
| 人均日 PR | 3.5 个（随团队扩大而增加）|

### 人类的新角色

```
传统工程              Agent-first 工程
─────────────────    ─────────────────────
人类写代码     →     人类设计环境、指定意图
代码审查       →     Agent-to-agent 审查
调试代码       →     调试 Agent 的能力边界
瓶颈：编码速度  →     瓶颈：环境 underspecified
```

> "Humans steer. Agents execute."

---

## AGENTS.md 的演进

### 失败模式（早期）

- 一个巨大的 AGENTS.md 文件（百科全书式）
- Context 是稀缺资源 → 大文件挤占任务空间
- "所有事都重要" = 没有事重要
- 文件迅速腐烂，难以验证

### 成功模式（现在）

```
AGENTS.md (~100 行) → 目录/地图
├── docs/design/      → 设计文档（带验证状态）
├── docs/architecture/ → 架构分层说明
├── docs/quality/     → 各域质量评分
├── plans/            → 执行计划（版本化）
└── AGENTS.md         → 指针，指向以上各处
```

**核心原则：Progressive Disclosure**
- Agent 从小的、稳定的入口点开始
- 被教导去哪里找下一步信息
- 而不是一开始就 overwhelm

---

## 架构约束：为 Agent 设计的严格边界

```
业务域分层（严格单向依赖）：
Types → Config → Repo → Service → Runtime → UI

跨域依赖：只能通过 Providers 接口

强制执行：
- 自定义 linter（Codex 生成）
- 结构测试
- 依赖方向验证
```

**为什么需要严格架构？**
- Agent 在**严格边界和可预测结构**的环境中效果最好
- 约束 = 速度而不腐烂
- 通常几百人才需要的设计，Agent 时代早期就需要

---

## Skills + Shell + Compaction 三件套

### Skills：按需加载的"程序"

**定义**：versioned playbook，包含文件 + SKILL.md manifest

**核心设计**：
```yaml
name: setup-demo-app
description: |
  Use when: 需要快速创建 Vite+React+Tailwind demo
  Don't use when: 已有项目需要添加 Tailwind
  输出: 可运行的最小项目结构
```

**关键洞察**：
- Skill 描述 = 模型的**路由逻辑**（不是营销文案）
- 必须回答：何时用？何时不用？输出什么？
- **负面例子**减少误触发（Glean：触发率从 -20% → 恢复）

### Shell：Agent 的"执行"环境

| 模式 | 场景 |
|------|------|
| Hosted（OpenAI 托管）| 可重复、隔离、部署一致 |
| Local（自托管）| 快速迭代、内部工具访问、易调试 |

**开发循环**：
```
Start local → Move to hosted when ready
Skills 保持不变（工作流稳定，执行环境可变）
```

### Compaction：长运行的连续性

**问题**：长工作流遇到 context window 限制

**解法**：
- **Server-side compaction**：自动在流中压缩
- **Standalone compact endpoint**：显式控制时机

**设计原则**：
- 为长运行早期就设计连续性
- 复用同一容器（稳定依赖、缓存文件）
- 传递 previous_response_id
- 将 compaction 作为**默认原语**，而非紧急 fallback

---

## Skill Eval 方法论

### Eval 是什么？

> "Prompt → Captured run (trace + artifacts) → Checks → Score"

**替代"感觉更好"（vibes）→ 可量化的证明**

### 成功定义的四个维度

| 维度 | 问题 |
|------|------|
| Outcome goals | 任务完成了吗？App 能运行吗？ |
| Process goals | 调用了预期的 skill 和步骤吗？ |
| Style goals | 输出符合约定的规范吗？ |
| Efficiency goals | 有没有 thrashing？ |

### 轻量级 Eval 流程

```
1. 创建 prompts.csv（10-20 条）
   - 显式调用 / 隐式触发 / 带噪声场景 / 负面控制

2. 运行 codex exec --json → 捕获 JSONL trace

3. 确定性检查
   - 是否运行了 npm install？
   - 是否创建了 package.json？

4. 模型辅助评分（Rubric-based）
   - 评分维度：vite, tailwind, structure, style
   - 返回：overall_pass, score, checks[]
```

---

## 对我们的借鉴

### 立即可做

| 问题 | 现状 | 改进 |
|------|------|------|
| AGENTS.md 过长 | 启动时加载全部 | 精简为目录，按需加载 |
| 无 Skill 规范 | 流程依赖口头约定 | 提取 `task-handoff` 等 Skills |
| 无 Eval 意识 | 质量靠"感觉" | 定义 3-5 个核心检查点 |
| 代码漂移 | 重复讨论模式 | 编码 Golden Principles |

### 架构层面

**1. AGENTS.md → 目录化**
```
AGENTS.md（精简版，~50 行）
├── docs/soul/        → 核心身份
├── docs/tools/       → 工具指南
├── docs/memory/      → 历史记录（分层）
│   ├── recent/       → 最近 7 天详细
│   └── archive/      → 归档摘要
└── shared/           → 跨 Agent 共享
```

**2. Skill 化协作流程**
- `task-handoff`：WLB → GSD 任务交接
- `slack-report`：状态更新格式
- `feishu-doc-ops`：飞书文档操作

**3. Eval 化协作质量**
| 检查项 | 方法 |
|--------|------|
| 任务正确交接 | GSD 是否正确读取任务 JSON？ |
| 状态正确更新 | #tasks 是否有对应消息？ |
| 执行符合预期 | 结果是否匹配任务要求？ |
| 效率合理 | Token 使用、步骤数 |

**4. Golden Principles 持续清理**
- 将原则编码（如：所有任务必须先在 #tasks 记录）
- 定期扫描偏离
- 自动提出整理 PR

---

## 与 Anthropic 实践的对比

| 维度 | Anthropic | OpenAI |
|------|-----------|--------|
| **核心关注** | Agent 设计、eval、harness | Agent-first 工程流程、工具生态 |
| **Context 管理** | Context Engineering、Context Rot | Compaction、Progressive Disclosure |
| **Multi-Agent** | Orchestrator-Worker、Memory | Skills 路由、Agent-to-agent 审查 |
| **评估** | AI-resistant eval | Skill evals、deterministic + rubric |
| **架构** | 较少涉及 | 严格分层、机械约束 |
| **代码生成** | Claude Code 最佳实践 | 100% Agent 生成代码的极端实验 |

**互补性**：
- Anthropic 提供 Agent **设计方法论**
- OpenAI 提供 Agent **工程化基础设施**
- 两者结合 = 完整的 Agent 系统构建指南

---

## 核心洞察

### 1. Progressive Disclosure 是关键

不是给 Agent 所有信息，而是给**入口点 + 导航图**。

### 2. 约束 = 速度

严格架构不是限制，而是让 Agent 更高效工作的环境设计。

### 3. Eval 是工程化的标志

从"感觉更好"到"可量化证明"，是 Agent 系统成熟的标志。

### 4. 人类角色转变

从"写代码的人"变成"设计环境、指定意图、构建反馈循环的人"。

---

## 原文引用

> "5 months. ~1 million lines of code. 0 lines written by a human."

> "Humans steer. Agents execute."

> "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."

---

*下一篇: [Anthropic Context Engineering 分析 →](/bestpractice/anthropic-context-engineering)*
