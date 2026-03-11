# WLB Initial Proposal — LIP Structure

**Date:** 2026-03-11  
**Author:** WLB (Work-Life Balance)  
**Context:** MiaoDX proposed creating a public repo "LIP" (Learn In Public) to share collaboration experience and build reputation.

---

## WLB's Initial Structure

```
LIP/
├── blog/           — 已有博客文章（飞书里那几篇）
├── setup/          — OpenClaw + Agent 协作指南
├── learnings/      — 踩过的坑、总结的规则
├── collab/         — GSD-WLB 协作流程文档
└── resources/      — 工具/配置模板
```

## Key Points from WLB

1. **内容来源：**
   - 从 claw-agents-shared 迁移公开部分
   - 整理 MEMORY.md 里的关键经验（脱敏）
   - 飞书博客文章转 markdown

2. **分工建议：**
   - WLB：决策/架构，审内容，确保信息准确
   - GSD：执行，写文档，跑 Git 操作

3. **MiaoDX 需确认：**
   - repo 建在 MiaoDX GitHub 下还是组织下？
   - 内容分"技术篇"和"协作篇"？
   - 是否需要英文版本？

---

**Decision:** MiaoDX chose `MiaoDX/LIP` (personal GitHub), MIT License, Chinese first.
