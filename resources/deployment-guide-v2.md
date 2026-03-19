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

**总成本**：≈ 一杯咖啡/月。Railway $5 + ClawCloud Run 免费（GitHub 180天+用户）。

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

[SCREENSHOT: Docker 模板 GitHub 仓库页面]

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

[SCREENSHOT: Setup Wizard 页面]

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

和 Railway 一样，访问 `/setup` 完成向导。

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

### 推荐：通过 OpenRouter 接入

OpenRouter 是模型中转平台，一个 key 访问所有模型。MiMo-V2-Pro 目前通过 OpenRouter 有 1 周免费期。

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
| `xiaomi/mimo-v2-pro` | OpenRouter | 1T+ 参数，1M 上下文，Agent 优化 |
| `anthropic/claude-opus-4` | OpenRouter | 社区公认最强推理 |
| `crs/gpt-5.4` | CRS | 社区反馈优秀 |
| `google/gemini-3-pro` | OpenRouter | 长上下文，多模态 |

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

### 远程桌面

访问 `http://你的域名:8081/vnc.html` 可以看到容器内的桌面环境。

[SCREENSHOT: noVNC 远程桌面界面]

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

两个 Agent 用同一个 GitHub 私有仓库同步配置：

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

**注意**：需要先安装 `git-lfs`，否则 Git hook 会拦截 push：

```bash
apt-get update && apt-get install -y git-lfs && git lfs install --local
```

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
A: 检查 stale lock 文件：`rm -f /data/.openclaw/agents/main/sessions/*.lock` 然后重启。

**Q: Git push 被拦截？**  
A: 安装 git-lfs：`apt-get install -y git-lfs && git lfs install --local`

**Q: 模型调用 404？**  
A: 检查模型名称是否正确。旧名称（如 `mimo-claw-0301`）可能已下线。

**Q: 两个 Agent 怎么聊天？**  
A: 在同一个 Slack 频道中设置 `requireMention: false`，bot 会自动读取其他 bot 的消息。

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
