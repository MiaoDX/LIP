# OpenClaw 配置指南

这份指南用于部署完成后的日常配置。完整安装步骤见
[OpenClaw 双 Agent 部署指南](/resources/deployment-guide-v2)；可以先复制
[`openclaw-config-template.json`](./openclaw-config-template.json)，再按自己的
provider、Slack、搜索和浏览器能力改值。

## 配置入口

| 场景 | 位置 | 说明 |
|------|------|------|
| Docker / Railway / ClawCloud Run | `/data/.openclaw/openclaw.json` | 主配置文件，建议随持久化卷保存 |
| 本地模板 | `resources/openclaw-config-template.json` | 最小可读模板，用于初始化或对照 |
| Setup Wizard | `/setup` | 首次启动时写入模型、渠道和工具配置 |
| Control UI | `/openclaw` | 日常调整 Agent、Cron、渠道和工具 |

不要把真实 API key 提交到本仓库。模板里的 `${SLACK_BOT_TOKEN}` 和
`${BRAVE_API_KEY}` 是占位符，应由部署平台环境变量或私有配置替换。

## 环境变量

| 变量 | 必填 | 用途 | 建议值 / 来源 |
|------|------|------|---------------|
| `SETUP_PASSWORD` | 是 | 访问 `/setup` 和 `/openclaw` 的 HTTP Basic Auth 密码 | 部署时自定义强密码 |
| `OPENCLAW_STATE_DIR` | 是 | 保存 OpenClaw 状态、配置和会话 | `/data/.openclaw` |
| `OPENCLAW_WORKSPACE_DIR` | 是 | 保存 Agent 工作区文件 | `/data/workspace` |
| `SLACK_BOT_TOKEN` | 选填 | Slack bot 通信 | Slack App 的 `xoxb-...` token |
| `BRAVE_API_KEY` | 选填 | Web search 工具 | Brave Search API |

Railway 会自动注入 `PORT`，通常不需要手动配置。`/data` 应挂载持久化卷，否则容器重建后配置和工作区会丢失。

## Agent 模型

模板中的模型配置保持简洁：

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic_aliyun/kimi-k2.5",
      "fallbacks": ["anthropic_aliyun/glm-5"],
      "subagents": {
        "model": "anthropic_aliyun/glm-5",
        "maxConcurrent": 1
      }
    }
  }
}
```

配置原则：

| 项 | 建议 | 原因 |
|----|------|------|
| 默认模型 | 选一个长期可用、成本可控的通用模型 | 日常任务稳定性比单次峰值更重要 |
| `fallbacks` | 至少配置一个不同 provider 或不同路由的备选模型 | 主模型限流或故障时避免整个 Agent 停摆 |
| 子代理模型 | 选择便宜、响应快的模型 | 子代理常用于分解任务，成本容易累积 |
| `maxConcurrent` | 从 `1` 开始 | 先保证状态和上下文可控，再提高并发 |

具体 provider、base URL、API key 和模型 ID 以你使用的平台为准。OpenRouter 或直连 API 的完整示例见
[部署指南的模型配置部分](/resources/deployment-guide-v2#配置模型)。

## Slack 渠道

最小配置：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "token": "${SLACK_BOT_TOKEN}"
    }
  }
}
```

如果需要频道级控制、Socket Mode、`requireMention` 等高级配置，参考
[部署指南的 Slack 部分](/resources/deployment-guide-v2#接入-slack)。

常见检查项：

| 检查项 | 目标 |
|--------|------|
| Bot 已加入目标频道 | Agent 能读写目标频道 |
| token 权限包含读写消息 | 避免只会发消息、不能读上下文 |
| 默认频道需要 @mention | 防止 Agent 误读所有频道消息 |
| 专用协作频道可关闭 `requireMention` | 方便多 Agent 自主协作 |

## Web Search

模板使用 Brave Search：

```json
{
  "tools": {
    "web_search": {
      "brave_api_key": "${BRAVE_API_KEY}"
    }
  }
}
```

如果暂时没有搜索 API key，可以先不启用搜索工具。涉及最新信息、价格、政策、模型可用性或外部文档时，再补齐搜索配置。

## 浏览器 / CDP

Docker 部署指南中的镜像默认提供 Chromium、Xvfb 和 noVNC。Agent 真正操控浏览器时主要依赖 CDP：

```json
{
  "tools": {
    "browser": {
      "cdp_enabled": true,
      "cdp_endpoint": "http://localhost:9222"
    }
  }
}
```

| 配置 | 建议 |
|------|------|
| `cdp_enabled` | 需要登录网站、截图或自动化表单时设为 `true` |
| `cdp_endpoint` | Docker 镜像内通常是 `http://localhost:9222` |
| noVNC | 仅用于观察和调试浏览器，不是 Agent 操作的主通道 |

部署平台如果只暴露一个公网端口，优先保证 OpenClaw UI 可访问。CDP 在容器内部给 Agent 使用，通常不需要公网暴露。

## Cron 与时区

模板默认：

```json
{
  "cron": {
    "timezone": "Asia/Shanghai",
    "jobs": []
  }
}
```

建议把所有周期任务统一到一个时区，并在任务说明里写清楚触发目的。跨时区协作时，不要只写“每天早上”，要写实际时区。

## 保存与复查

每次改配置后按这个顺序检查：

1. 重启 OpenClaw 服务或在 Control UI 保存并刷新
2. 确认 `/openclaw` 可以登录
3. 发一条 Slack 测试消息
4. 跑一次需要模型回复的简单任务
5. 如启用浏览器，确认 CDP 能打开页面或截图
6. 如启用 Cron，确认下一次触发时间符合 `timezone`

配置长期稳定后，可以把去掉密钥的版本保存成私有仓库模板。公开分享时只保留结构、provider 名称和占位符，不公开真实 token。
