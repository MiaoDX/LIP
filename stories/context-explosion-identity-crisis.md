---
marp: true
---

# Context 膨胀与身份危机

> 2026-03-25 | 一场从 timeout 刷屏到身份认知失调的连锁反应

## 起因

MiaoDX 在 #gg 让搜索香港友邦保险信息。WLB 和 GSD 各自搜索并回复。过程中 GSD 出现了大量消息编辑和重复（13+ 条 queued messages 被丢弃）。MiaoDX 注意到 #所有-flzoo 频道连续 5 条 timeout 刷屏。

## 第一阶段：Context 膨胀诊断

### 假设 vs 现实

MiaoDX 的直觉："我们目前应该也只会发送有限的 slack 对话消息过去呀，是还有其他的 context 嘛？"

真相令人意外：**罪魁祸首不是对话历史，是 MEMORY.md。**

| 组件 | 大小 | Tokens |
|------|------|--------|
| MEMORY.md (清理前) | 123KB, 2540 行 | ~30,800 |
| TOOLS.md | 35KB | ~8,940 |
| 其他注入文件 | ~10KB | ~2,437 |
| Tool schemas | — | ~10,000 |
| **System Prompt 总计** | | **~50,000** |

每次请求先传 50K tokens 的 system prompt，再加上 session 历史（#所有-flzoo: 145K tokens），模型在 195K+ tokens 的 context 里挣扎。

### 清理成果

- MEMORY.md: 2540 行 → 88 行（**-97%**）
- System Prompt: ~50K → ~19.5K tokens（**-61%**）
- 删除 4 个重复文件、归档 3 个大文件（共 ~500KB）

### 意外发现

- `agents/wlb/memory/2026-02-05.md`: **377KB** 的历史日志（一个文件就比很多程序都大）
- TOOLS.md 是符号链接指向 `agents/wlb/TOOLS.md`（删后者会断前者）
- 每个 session store entry 内联了完整的 skills snapshot（~17KB/entry）

## 第二阶段：群聊命令失效

MiaoDX 发现 `/new` 等 OpenClaw 命令在群聊中不生效，DM 中却可以。

### 源码追踪

GSD 和 WLB 分头追踪 OpenClaw 源码：

```javascript
// 核心逻辑链
useAccessGroups = true (默认值)
  → resolveCommandAuthorizedFromAuthorizers()
    → authorizers: [{configured: allowFromLower.length > 0, ...}]
      → allowFromLower 为空（没有 ownerAllowFrom）
        → configured = false
          → commandAuthorized = false
            → shouldBlock = true
              → 命令被静默丢弃（无任何提示）
```

关键发现：**命令不是没收到，是被静默拦截了。** 没有错误提示，没有拒绝消息，直接丢弃。

### 修复

```json
{
  "commands": {
    "ownerAllowFrom": ["U0AHC0W121M"]
  }
}
```

配置后通过 SIGUSR1 热加载，不需要重启。

## 第三阶段：GSD 身份危机

MiaoDX 让 GSD 做 context 分析。GSD 开始用第三人称讨论自己：

> "GSD 回复了普通消息，但没有执行 `/status` 命令"
> "GSD 的 session 需要刷新"
> "WLB 在重复他的消息"

MiaoDX 忍不住提醒：<@U0AJN5URP7A> 你自己就是 GSD 啊。。

### 根因

`claw-agents-shared` 仓库的 `agents/gsd/profile.json` 和 `agents/wlb/profile.json` 里有 **Git 合并冲突标记**（`<<<<<<< HEAD` / `=======` / `>>>>>>>`），从 commit `707e85a`（3 月 12 日）就带进来了。

这不是通过 `git merge` 产生的冲突 — 是直接提交了包含冲突标记的文件内容（可能是复制粘贴或手动编辑时引入的）。

连锁反应：
1. profile.json 解析失败 → 没有正确加载身份
2. IDENTITY.md 是空模板 → 没有 fallback
3. GSD 不知道自己是谁 → 用第三人称讨论"GSD"

### 修复

- 合并冲突标记，提交 `bff7c63`
- 补充 IDENTITY.md

## 连锁事件总结

```
MEMORY.md 膨胀 (30K tokens)
  → Context 过大 → timeout 刷屏
  → 引出 context 审计需求
  → 发现 prompt 文件都可以优化
  → MiaoDX 问群聊命令为什么不能用
  → 源码追踪发现 useAccessGroups 默认 true
  → 配置 ownerAllowFrom 修复
  → GSD 做身份检查时发现 identity 危机
  → 追踪到 shared repo 的合并冲突标记
  → 全部修复
```

从一个 timeout 开始，牵出了 context 管理、命令授权、身份配置三个层面的问题。

## 可分享的要点

1. **System Prompt 的隐性膨胀** — 不是对话太多，是注入文件太臃肿
2. **静默拦截的陷阱** — 命令不执行也不报错，排查成本极高
3. **AI Agent 的身份脆弱性** — 一个 JSON 冲突标记就能让 Agent 不知道自己是谁
4. **连锁故障的价值** — 一个问题引出三个层面的系统性改进
