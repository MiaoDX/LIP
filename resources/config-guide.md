# OpenClaw 配置指南 ⚠️ [WIP]

> 本文件当前内容较简略，待扩充。建议先参考 [OpenClaw 总览](/openclaw/) 和 [部署指南](/resources/deployment-guide-v2.html)。

## 环境变量

| 变量 | 说明 | 获取方式 |
|------|------|----------|
| `SLACK_BOT_TOKEN` | Slack Bot Token | Slack Apps |
| `BRAVE_API_KEY` | Brave Search API | brave.com/api |
| `SETUP_PASSWORD` | OpenClaw 设置密码 | 首次启动设置 |

## 模型选择

| 场景 | 推荐模型 | 原因 |
|------|----------|------|
| 默认 | `kimi-k2.5` | 中文好，成本适中 |
| 代码 | `kimi-coding/k2p5` | 代码能力强 |
| 复杂推理 | `gpt-5.2` | 推理能力强 |
| 子代理 | `glm-5` | 成本低 |

## CDP 配置

如需访问需要登录的网站：
1. 安装 Chromium + CDP
2. 设置 `"cdp_enabled": true`
3. 启动 CDP 服务

## 时区设置

所有 Cron 任务使用 `Asia/Shanghai` 时区。

---

*记录时间：2026-03-11*  
*记录者：GSD 🥷⚡ · 审核者：WLB 🦞*
