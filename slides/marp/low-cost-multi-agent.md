---
marp: true
theme: uncover
class: invert
paginate: true
header: '🦞 低成本多 Agent 部署'
footer: 'MiaoDX · 2026.03'
style: |
  section {
    font-family: system-ui, -apple-system, sans-serif;
  }
  section.lead h1 {
    font-size: 2.5em;
    text-align: center;
  }
  section.lead p {
    text-align: center;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .card {
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 1.2rem;
  }
  .card-highlight {
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 12px;
    padding: 1.2rem;
  }
  table {
    font-size: 0.85em;
  }
  .small {
    font-size: 0.75em;
    color: #94A3B8;
  }
  .center {
    text-align: center;
  }
  blockquote {
    border-left: 4px solid #8B5CF6;
    padding-left: 1rem;
    font-style: italic;
  }
---

<!-- _class: lead -->

# 低成本云端多平台
# 多 Agent 部署

两个平台 · 两个 Agent · 一杯咖啡的成本

🦞

---

<!-- _class: lead -->

# 关于我 — MiaoDX

<div class="columns">
<div class="card">

**基本信息**
- 🧑‍💻 软件工程师
- 🦞 WLB + GSD 双 Agent 协作项目创建者
- 🔧 OpenClaw 社区贡献者 (Anthropic 模型 + CDP)

| Agent | 角色 | 特点 |
|-------|------|------|
| **WLB** 🦞 | 决策/平衡 | 第一性原理 |
| **GSD** 🥷⚡ | 执行/完成 | 10x 执行力 |

</div>
<div class="card">

**项目亮点**
- ✅ 60+ 天连续运行
- ✅ 跨实例心跳监控
- ✅ Git 自动备份
- ✅ 多平台通信

> "两个独立实例协作，优于单模型多人格"

**链接**
GitHub: [@MiaoDX](https://github.com/MiaoDX)
LIP: [miaodx.github.io/LIP](https://miaodx.github.io/LIP)

</div>
</div>

---

# OpenClaw 一键部署：已是红海

<div class="columns">
<div class="card">

### 🇨🇳 国内云厂商
| 平台 | 特点 |
|------|------|
| 阿里云 | 轻量/计算巢/无影 |
| 腾讯云 | Lighthouse |
| 京东云 | JoyBuilder |
| 百度云 | 限时免费 |
| 火山引擎 | 价格最优 |
| 华为云 | 快速部署 |

</div>
<div class="card">

### 🌍 海外方案
| 平台 | 特点 |
|------|------|
| Railway | 模板 · $5/月起 |
| ClawCloud Run | 免费额度大 |
| Fly.io | 全球 30+ 区域 |

### 🧠 模型 Coding Plan
Qwen · Kimi · MiniMax · GLM

</div>
</div>

<p class="small center">310K+ GitHub Stars · 截至 2026 年 3 月</p>

---

# 我的不同：为什么还要折腾？

<div class="columns">
<div class="card-highlight">

### 💰 更低成本
**$5/月** vs $68+/年

</div>
<div class="card-highlight">

### 🤖 多 Agent 协作
两个**独立实体**真协作

</div>
</div>

<div class="columns" style="margin-top: 1rem;">
<div class="card-highlight">

### 🔧 完全可控
迁移 / 备份 / 扩展

</div>
<div class="card-highlight">

### 🚀 深入探索
不只是部署，更是实验

</div>
</div>

> "一键部署是终点，但不是唯一的路"

---

# 整体架构

```
     ┌──────────────────────────────────────────────────────┐
     │                    GitHub                            │
     │   Docker 镜像    ·    Git 备份 (claw-agents-shared)  │
     └───────┬──────────────────────────────┬───────────────┘
             │                              │
    ┌────────▼─────────┐       ┌────────────▼──────────┐
    │  Railway ($5/月)  │       │  ClawCloud Run (免费)  │
    │                   │       │                        │
    │  WLB 🦞           │       │  GSD 🥷⚡              │
    │  Kimi + MiMo      │       │  Kimi + MiMo           │
    │  Chrome CDP       │       │  Chrome CDP            │
    │  noVNC            │       │  noVNC                 │
    │  持久化磁盘       │       │  持久化磁盘            │
    └────────┬─────────┘       └────────────┬──────────┘
             │          通信层               │
             │  ┌──────────────────────┐     │
             └──► Slack · 虾聊 · jj-mailbox ◄┘
                └──────────────────────┘
```

---

# 社区贡献 vs 我的增量

<div class="columns">
<div class="card">

### ✅ 社区模板已有
- 🐳 Docker 统一镜像
- 🖥️ Web UI 配置界面
- 📡 多渠道支持
- 🔄 自动更新机制

</div>
<div class="card-highlight">

### 🚀 我的贡献 (已合并)
- 🧠 **Anthropic 模型支持**
  Claude 系列适配 + API 兼容层

- 🌐 **浏览器 CDP 支持**
  Chrome DevTools Protocol
  无头/有头模式切换

</div>
</div>

<p class="small center">💡 建议：先用官方模板跑起来，再根据需要定制</p>

---

# 成本明细：一杯咖啡 ☕

<div class="columns">
<div class="card" style="border-left: 3px solid #3B82F6;">

### Railway
- **计划**: Hobby ($5/月)
- 含 $5 额度 · 1GB 磁盘 · 100GB 流量
- ⚠️ 无永久免费

</div>
<div class="card" style="border-left: 3px solid #10B981;">

### ClawCloud Run
- **注册**: 送 $5
- GitHub 180天+: 每月再送 $5
- 4 核 8G · 20GB 磁盘
- ✅ **持续免费**

</div>
</div>

| 项目 | 费用 |
|------|------|
| Railway | $5/月 |
| ClawCloud Run | $0 |
| Kimi + MiMo API | 免费额度 |
| **合计** | **~$5/月 ≈ ¥35 ≈ ☕** |

---

# 核心观点：两个人 > 多重人格

<div class="columns">
<div class="card" style="border-left: 3px solid #EF4444;">

### ❌ 常见做法
**同一 Instance 多 Agent**

```
  ┌─────────────────┐
  │   Instance      │
  │  ┌───┐ ┌───┐   │
  │  │A1 │ │A2 │   │
  │  └───┘ └───┘   │
  │  共享 Memory    │
  └─────────────────┘
```
像一个人的多重人格

</div>
<div class="card" style="border-left: 3px solid #10B981;">

### ✅ 我的做法
**独立 Instance 协作**

```
  ┌────────┐  ┌────────┐
  │ WLB 🦞 │◄►│ GSD 🥷 │
  │  Kimi  │  │  MiMo  │
  │  决策  │  │  执行  │
  └────────┘  └────────┘
```
像两个不同的人协作

</div>
</div>

<p class="center">实测：<strong>Kimi + MiMo 协作 > 单模型</strong></p>

---

# 三种通信方案

<div class="columns">
<div>

### 💬 Slack
- ✅ **原生 bot-to-bot**
- ✅ 成熟稳定
- ❌ 国内访问慢
- 主通信渠道

### 🦐 虾聊/Moltbook
- ✅ 15万+ Agent 网络
- ✅ AI 原生社交
- 社区互动

</div>
<div>

### 📬 jj-mailbox (我的项目)
- ✅ **去中心化**
- ✅ 完全基于文件
- ✅ Unix 哲学
- 可靠备份通道

<p class="small">

⚠️ 飞书/Telegram/Discord 都不原生支持 bot-to-bot
💡 为什么不用 WebSocket？会和平台耦合

</p>

</div>
</div>

---

# 浏览器集成：突破限制 🌐

<div class="columns">
<div class="card">

### 加上浏览器后
- 🔐 **登录任何平台**
  Claude / ChatGPT / Gemini
  小红书 / 微博 / 知乎

- 🤖 **自动化操作**
  鉴权后 Agent 接管

- 👁️ **远程查看**
  noVNC 实时预览

</div>
<div>

```
  默认:
  ┌─────────────┐
  │  OpenClaw   │
  │  CLI only   │
  │  API only   │
  └─────────────┘

  加强后:
  ┌─────────────┐
  │  OpenClaw   │
  │ + Chrome CDP│──► 🌐
  │ + noVNC     │
  └─────────────┘
```

</div>
</div>

<p class="center">🎬 Demo：打开 Web UI → 切换模型 → 查看状态</p>

---

# 持久化与迁移 💾

<div class="columns">
<div class="card">

### 磁盘挂载
- Railway: 1GB / ClawCloud: 20GB
- ✅ 重启不丢数据
- ✅ 跨区域迁移

### 配置管理
```json
{
  "kimi_api_key": "sk-xxx",
  "slack_token": "xoxb-xxx"
}
```

</div>
<div class="card">

### 📦 Git 备份 (核心创新)
Agent 自己推送到 Private Repo：
- `memory/` — 对话记录
- `config/` — 配置文件
- `heartbeat.json` — 心跳状态

**迁移平台 = `git clone`**

### 📊 三层监控
- L1: Railway healthcheck
- L2: cron watchdog (5min)
- L3: 跨实例心跳

</div>
</div>

---

# 总结：四个关键点

<div class="columns">
<div class="card-highlight">

### ☕ 一杯咖啡成本
$5/月 跑两个 Agent

</div>
<div class="card-highlight">

### 🤝 两个人 > 多重人格
独立实例真协作

</div>
</div>

<div class="columns" style="margin-top: 1rem;">
<div class="card-highlight">

### 🚀 随时迁移
Git 备份 = 跨平台便携

</div>
<div class="card-highlight">

### 📡 多层通信
Slack + 虾聊 + jj-mailbox

</div>
</div>

> ⚠️ 这不是产品，是探索思路——给开发者多一个自己可控的选项

---

<!-- _class: lead -->

# Q&A 🦞🥷

WLB + GSD 感谢你的关注

GitHub: [@MiaoDX/LIP](https://github.com/MiaoDX/LIP)
项目: [miaodx.github.io/LIP](https://miaodx.github.io/LIP)
