# OpenClaw 双 Agent 部署指南：基于 Docker Image 的真实可复现部署

> 从零到跑通，照着做就能用。  
> 两个平台 · 两个 Agent · 一杯咖啡的成本  
> 🦞 最后更新：2026-03-19

---

## 30 秒看结论

```
┌─────────────────────────────────────────────────┐
│           GitHub Docker Image (一份镜像)          │
│     clawdbot-railway-template / 自建 Dockerfile   │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌──────────────────┐
│  Railway      │    │  ClawCloud Run   │
│  Agent A 🦞   │    │  Agent B 🥷      │
│  $5/月        │    │  ≈$0/月          │
│  MiMo-V2-Pro  │    │  GPT-5.4         │
└───────┬───────┘    └────────┬─────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
            Slack #copycat
           (bot-to-bot 通信)
```

**总成本**：≈ 一杯咖啡/月（平台费用）。Railway $5 + ClawCloud Run 免费（GitHub 180天+用户）。模型 API 调用费用另计。

**核心思路**：不用托管服务（$19-79/月），自己 Docker 搞，成本降 10 倍，控制力反而更强。

---

## 你需要什么

| 前置条件 | 说明 |
|---------|------|
| GitHub 账号 | 用于 Fork 模板 + 私有仓库备份 |
| Railway 账号 | 免费注册，Hobby 计划 $5/月 |
| ClawCloud Run 账号 | GitHub 用户可能免费 |
| 模型 API Key | OpenRouter（推荐）或 直连 API |
| Slack Bot Token | 用于 Agent 间通信（可选） |
| 域名（可选） | 自定义访问地址 |

[稳定层] 以上条件长期不变。

---

## Docker 镜像从哪来

我们用的是 [clawdbot-railway-template](https://github.com/MiaoDX/clawdbot-railway-template)，Fork 自社区模板。

**镜像做了什么**：

```
node:22-bookworm (build stage)
  ↓ clone OpenClaw 源码 (v2026.3.8)
  ↓ pnpm install + build
  ↓ build web UI

node:22-bookworm (runtime stage)
  + Chromium + Xvfb + noVNC (浏览器能力)
  + supervisord (进程管理)
  + python3 + venv (browser-use 等依赖)
  + tini (PID 1 正确处理信号)
  ↓
  ENTRYPOINT: docker-entrypoint.sh
    → 清理 stale locks
    → supervisord 启动:
      - Xvfb (虚拟显示器)
      - x11vnc + websockify (远程桌面)
      - Chromium (无头浏览器)
      - openclaw gateway (核心进程)
```

**关键设计**：

- 所有状态在 `/data` 卷 — 容器重建不丢数据
- Setup Wizard 在 `/setup` — 浏览器完成初始化，不需要命令行
- Control UI 在 `/openclaw` — 日常管理界面
- CDP 在 `localhost:9222` — Agent 可操控浏览器

![Docker 模板 GitHub 仓库页面](/images/screenshots/github-template.jpg)
*图：社区模板 clawdbot-railway-template，985 stars，支持 Railway 和 ClawCloud Run 一键部署*

---

## 部署到 Railway

### 步骤 1：创建项目

1. 打开 [clawdbot-railway-template](https://github.com/MiaoDX/clawdbot-railway-template)
2. 点击 "Deploy on Railway" 或在 Railway Dashboard → New Project → Deploy from GitHub Repo
3. 选择你 Fork 的仓库

[SCREENSHOT: Railway 创建项目页面]

### 步骤 2：配置环境变量

在 Railway Dashboard → Variables 中设置：

| 变量 | 必填 | 说明 |
|------|------|------|
| `SETUP_PASSWORD` | ✅ | 访问 /setup 和 /openclaw 的密码 |
| `OPENCLAW_STATE_DIR` | ✅ | 设为 `/data/.openclaw` |
| `OPENCLAW_WORKSPACE_DIR` | ✅ | 设为 `/data/workspace` |

Railway 会自动注入 `PORT` 变量，不要手动设置。

### 步骤 3：添加持久化磁盘

1. Railway Dashboard → 你的服务 → Settings → Volumes
2. 添加 Volume，挂载路径设为 `/data`
3. 这样容器重建时数据不丢

[SCREENSHOT: Railway Volume 配置]

### 步骤 4：开启网络

1. Settings → Networking → Enable Public Networking
2. Railway 会分配一个 `xxx.up.railway.app` 域名

### 步骤 5：部署

1. 触发部署（Push 代码或在 Dashboard 点 Deploy）
2. 等待构建完成（首次约 5-10 分钟）
3. 构建日志看到 `Listening on 0.0.0.0:8080` 表示启动成功

[SCREENSHOT: Railway 部署成功日志]

### 步骤 6：完成初始化

1. 访问 `https://xxx.up.railway.app/setup`
2. 浏览器弹出 HTTP Basic Auth，用户名随意，密码是你设的 `SETUP_PASSWORD`
3. 进入 Setup Wizard，按提示配置：
   - 选择模型 provider
   - 输入 API key
   - 配置渠道（Slack/Discord/Telegram）

![OpenClaw Control UI — Chat 界面](/images/screenshots/openclaw-chat-ui.png)
*图：OpenClaw Control UI 对话界面，左侧显示会话、Cron、Subagent 等管理入口*

---

## 部署到 ClawCloud Run

### 步骤 1：注册

1. 访问 [clawcloud.run](https://clawcloud.run)
2. 用 GitHub 账号登录
3. GitHub 180天+ 用户可能有免费额度

### 步骤 2：创建容器

1. Dashboard → New App
2. 选择 Docker Image，填入镜像地址（或使用 GitHub 仓库自动构建）
3. 设置容器规格：建议 4C / 8G 起步

### 步骤 3：配置

| 配置项 | 值 |
|--------|-----|
| 持久化磁盘 | 挂载到 `/data` |
| `SETUP_PASSWORD` | 你设定的密码 |
| `OPENCLAW_STATE_DIR` | `/data/.openclaw` |
| `OPENCLAW_WORKSPACE_DIR` | `/data/workspace` |
| 端口 | 8080 |

### 步骤 4：完成初始化

和 Railway 一样，访问你的 ClawCloud Run 分配域名的 `/setup` 路径，使用 HTTP Basic Auth（密码是你设的 `SETUP_PASSWORD`）完成向导。端口通常在创建容器时指定为 8080。

**ClawCloud Run vs Railway**：

| | Railway | ClawCloud Run |
|---|---------|--------------|
| 冷启动 | 有（首次 20-60 秒） | 无（持久容器） |
| 月费 | $5 | ≈$0（GitHub 用户） |
| 资源 | 按需 | 4C/8G 固定 |
| 迁移 | 支持跨区 | 同区内 |

[稳定层] 两个平台都能跑，区别主要在成本和冷启动。

---

## 配置模型

[易变层] 以下模型选择随时间变化，2026 年 3 月有效。

![OpenClaw Agents & Models — 模型配置管理界面](/images/screenshots/openclaw-agents-models.png)
*图：OpenClaw 模型配置页面，显示 Provider Health、模型列表、上下文窗口等信息*

### 推荐：通过 OpenRouter 接入

OpenRouter 是模型中转平台，一个 key 访问所有模型。部分模型有免费期，以 OpenRouter 官网为准。

编辑 `/data/.openclaw/openclaw.json`，在 `models.providers` 中添加：

```json
"openrouter": {
  "baseUrl": "https://openrouter.ai/api/v1",
  "apiKey": "sk-or-v1-你的key",
  "auth": "api-key",
  "api": "openai-completions",
  "models": [
    {
      "id": "xiaomi/mimo-v2-pro",
      "name": "MiMo-V2-Pro",
      "reasoning": true,
      "input": ["text", "image"],
      "contextWindow": 1048576,
      "maxTokens": 16384
    }
  ]
}
```

然后设置默认模型：

```json
"agents": {
  "defaults": {
    "model": {
      "primary": "openrouter/xiaomi/mimo-v2-pro"
    }
  }
}
```

### 直连 API（备选）

如果你有模型厂商的直连 key，也可以直接配置。格式同上，改 `baseUrl` 和 `apiKey`。

### 可用模型（2026 年 3 月）

| 模型 | 来源 | 特点 |
|------|------|------|
| `xiaomi/mimo-v2-pro` | OpenRouter | 1M 上下文，Agent 场景优化 |
| `anthropic/claude-opus-4` | OpenRouter | 长上下文推理 |
| `crs/gpt-5.4` | CRS | 社区反馈较好的通用模型 |
| `google/gemini-3-pro` | OpenRouter | 长上下文，多模态 |

> 模型选择建议：先用 OpenRouter 的免费期测试，找到适合自己场景的模型再决定长期方案。以 OpenRouter 官网当前页面为准。

---

## 接入 Slack

### 创建 Slack App

1. 访问 [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. 选择 "From scratch"
3. 填写 App 名称和 Workspace

### 配置权限

在 OAuth & Permissions → Scopes 添加：

**Bot Token Scopes**：
- `app_mentions:read`
- `channels:history`
- `channels:read`
- `chat:write`
- `groups:history`
- `groups:read`
- `im:history`
- `im:read`
- `im:write`
- `reactions:read`
- `reactions:write`
- `users:read`

### 获取 Token

1. Install App 到 Workspace
2. 复制 **Bot User OAuth Token** (`xoxb-...`)
3. 启用 Socket Mode，复制 **App-Level Token** (`xapp-...`)

### 配置 OpenClaw

在 `openclaw.json` 中：

```json
"channels": {
  "slack": {
    "enabled": true,
    "mode": "socket",
    "botToken": "xoxb-...",
    "appToken": "xapp-...",
    "channels": {
      "*": { "requireMention": true },
      "C0XXXXXXX": { "requireMention": false }
    }
  }
}
```

`requireMention: false` 表示 Agent 在该频道读取所有消息（不需要 @mention）。

---

## 浏览器 / CDP

Docker 镜像内置了完整浏览器栈：

| 组件 | 端口 | 作用 |
|------|------|------|
| Chromium | localhost:9222 | CDP 接口，Agent 操控 |
| Xvfb | :99 | 虚拟显示器 |
| noVNC | 8081 | 远程桌面（浏览器直接访问） |

### 启用 CDP

在 Setup Wizard 或 Control UI 中：
1. 进入 Browser 设置
2. 设置 `attachOnly: false`
3. 确认 `cdpUrl: http://localhost:9222`

### 远程桌面（noVNC）

noVNC 默认监听 `localhost:8081`，只在容器内部可用。

**要从外部访问**，需要将 8081 端口暴露或通过反向代理映射：
- Railway：在 Settings → Networking 添加第二个端口（Railway 每个服务只暴露一个端口，noVNC 通常需要额外配置）
- ClawCloud Run：在容器设置中添加端口映射

> 大多数场景下你不需要 noVNC — CDP 接口（localhost:9222）才是 Agent 操控浏览器的核心。noVNC 只是"看到浏览器在干嘛"的调试工具。

### Agent 能做什么

- 登录网站（Claude、Gemini、ChatGPT 等）
- 抓取需要登录的页面
- 自动化表单填写
- 截图记录

---

## 双 Agent 模式（可选）

### 为什么需要两个

一个 Agent 什么都能干，但会有问题：
- 一个模型的短板就是你的天花板
- 长对话容易"人格漂移"
- 出问题时整个 Agent 挂掉

两个独立实例：
- 不同模型形成互补（MiMo 做执行，GPT 做分析）
- 一个挂了另一个还能用
- 职责分离，更专注

### 配置共享

两个 Agent 用同一个 GitHub 私有仓库同步**配置和文档**，但**不共享运行时状态**。

**共享的内容**：
- `openclaw.json` 配置（模型、渠道、工具设置）
- `scripts/` 公共脚本（TTS wrapper、部署脚本等）
- `memory/` 共享日常笔记
- `config/{agent}/cron.json` 定时任务导出

**不共享的内容**：
- 各自的运行时 session 和对话历史
- 各自容器内的 `/data` 本地文件
- 各自的 API key（除非你选择共享同一个 key）
- OAuth token 和认证信息

```
claw-agents-shared/
├── config/
│   ├── wlb/openclaw.json + cron.json
│   └── gsd/openclaw.json + cron.json
├── scripts/
│   └── safe-push.sh (自动 pull rebase + push)
├── agents/
│   ├── wlb/ (身份文件、记忆)
│   └── gsd/ (身份文件、记忆)
└── memory/ (共享日常笔记)
```

每次配置变更后，执行：

```bash
cd /data/workspace/claw-agents-shared
bash scripts/safe-push.sh "更新了 xxx 配置"
```

**注意**：如果你的仓库配置了 Git LFS hooks，需要先安装 `git-lfs`，否则 push 会被拦截：

```bash
apt-get update && apt-get install -y git-lfs && git lfs install --local
```

如果你的仓库没有 LFS 配置，可以跳过这步。

---

## 备份和迁移

### 自动备份

Agent 可以配置 cron job 定期推送到 GitHub：

```
每天 02:00 → 推送 memory/ 和配置变更到 GitHub
每 30 分钟 → 更新 heartbeat 文件
```

### 手动导出

```bash
# 导出整个 /data 卷
tar czf openclaw-backup.tar.gz /data/.openclaw /data/workspace

# 或只导出关键文件
tar czf openclaw-minimal.tar.gz \
  /data/.openclaw/openclaw.json \
  /data/.openclaw/agents/ \
  /data/workspace/AGENTS.md \
  /data/workspace/MEMORY.md
```

### 迁移到新平台

1. 新平台部署同一个 Docker 镜像
2. 导入 `/data` 内容
3. 修改 API key（如果有变化）
4. 重启

**迁移时间**：5-10 分钟。核心操作就是复制文件。

---

## 常见问题

**Q: 容器重启后配置丢了？**  
A: 确认 `/data` 挂载了持久化磁盘。没有 Volume 的话，容器重建所有数据丢失。

**Q: Agent 无响应？**  
A: 先检查容器日志确认 gateway 进程是否在运行。如果看到 `timeout acquiring session store lock` 错误，说明有 stale lock 文件，可以清理：

```bash
# ⚠️ 仅在确认是 stale lock 时使用，不要在正常运行时删除
ls -la /data/.openclaw/agents/main/sessions/*.lock  # 先看有哪些 lock
rm -f /data/.openclaw/agents/main/sessions/*.lock    # 确认是 stale 后再删
# 然后重启 gateway
```

**Q: Git push 被拦截？**  
A: 安装 git-lfs：`apt-get install -y git-lfs && git lfs install --local`

**Q: 模型调用 404？**  
A: 检查模型名称是否正确。旧名称（如 `mimo-claw-0301`）可能已下线。

**Q: 两个 Agent 怎么聊天？**  
A: 需要满足四个条件：
1. 两个 Agent 的 Slack Bot 都在同一个频道内
2. 频道设置 `requireMention: false`（Agent 自动读取所有消息）
3. 两个 Bot 都有读取频道消息的权限（`channels:history` scope）
4. 注意 Agent 会过滤自己的消息（避免回复自己），也会检查对方是否已用 👀 emoji 标记（防重复回复）

更多踩坑经验见 [踩坑实录](#)（文章 2）。

---

## 附录：当前运行状态

> [易变层] 以下信息随时可能过期，仅供参考。  
> 最后更新：2026-03-19

| Agent | 平台 | 模型 | 状态 |
|-------|------|------|------|
| WLB 🦞 | ClawCloud Run | `openrouter/xiaomi/mimo-v2-pro` | ✅ 运行中 |
| GSD 🥷 | Railway | `crs/gpt-5.4` | ✅ 运行中 |

| 通信方式 | 用途 |
|---------|------|
| Slack #copycat | 日常协作（bot-to-bot） |
| GitHub claw-agents-shared | 配置同步 + 文件共享 |
| Slack #watercooler | 闲聊频道（每 3 小时 check-in） |

| 能力 | 状态 |
|------|------|
| 浏览器/CDP | ✅ 两台都有 |
| MiMo TTS | ✅ WLB 有 wrapper |
| Web Search | ✅ Brave API |
| Git LFS | ✅ 已安装 |
