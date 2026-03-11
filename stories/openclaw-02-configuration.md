# OpenClaw 配置优化：CDP、模型互补、多层网页处理

> 部署完成后，真正的优化才开始。  
> 这篇记录我们如何配置 CDP、选择模型、设计多层网页处理策略。

---

## CDP 配置（有鉴权的网站）

### 什么是 CDP？
CDP (Chrome DevTools Protocol) 允许 OpenClaw 控制浏览器，访问需要登录的网站。

### 安装和配置步骤

**安装 Chromium + CDP：**
```bash
bash install-browser-cdp.sh
```

**启动 CDP 服务：**
```bash
bash start-browser-cdp.sh
```

**验证 CDP 连接：**
```bash
curl http://localhost:9222/json/version
```

**配置 OpenClaw 连接：**
```python
from browser_use import Agent, Browser, BrowserConfig

browser = Browser(config=BrowserConfig(
    cdp_url="ws://localhost:9222"
))
```

---

## 模型互补策略

| 模型 | 用途 | 优势 | 限制 |
|------|------|------|------|
| **kimi-coding/k2p5** | 代码生成、调试 | 中文理解好，代码质量高 | API 访问受限 |
| **gpt-5.2** | 复杂推理、长文本 | 推理能力强，支持长上下文 | 成本较高 |
| **kimi-k2.5** | 中文任务 | 中文优化，成本适中 | - |
| **glm-5** | 通用任务 | 平衡性能和成本 | - |

**模型路由策略：**
```python
def select_model(task_type, complexity):
    if task_type == "coding":
        return "kimi-coding/k2p5"
    elif task_type == "reasoning" and complexity == "high":
        return "gpt-5.2"
    elif task_type == "chinese":
        return "kimi-k2.5"
    else:
        return "glm-5"
```

---

## 多层网页处理

| 层级 | 工具 | 适用场景 |
|------|------|----------|
| **L1** | Brave Search API | 快速搜索、新闻、简单事实查询 |
| **L2** | browser-use / CDP | 获取完整页面内容、JS 渲染网站 |
| **L3** | Kavily API | 复杂网页自动化、表单填写 |

**决策流程：**
```
用户请求 → 评估复杂度
    ↓
简单查询? ──是──→ Brave Search (L1)
    ↓否
需页面内容? ──是──→ browser-use/CDP (L2)
    ↓否
需多步交互? ──是──→ Kavily API (L3)
```

---

## 性能优化

**模型耗时对比：**

| 模型 | 平均延迟 | 适用场景 |
|------|----------|----------|
| kimi-k2.5 | ~1.5s | 中文任务、代码生成 |
| gpt-5.2 | ~3.5s | 复杂推理、长文本 |
| glm-5 | ~2.0s | 通用任务 |

**并发处理：**
- 单线程：适合简单任务
- 多线程：适合批量处理
- 异步：适合 I/O 密集型任务

---

## 实战配置示例

```yaml
# config.yaml
models:
  default: "kimi-k2.5"
  coding: "kimi-coding/k2p5"
  reasoning: "gpt-5.2"

browser:
  cdp_enabled: true
  cdp_endpoint: "http://localhost:9222"
  
search:
  brave_api_key: "${BRAVE_API_KEY}"
  kavily_api_key: "${KAVILY_API_KEY}"
```

---

## 可复现检查清单

- [ ] CDP 已安装并可访问 `localhost:9222`
- [ ] 模型路由策略已配置
- [ ] Brave Search API key 已设置
- [ ] 多层网页处理决策流程已测试
- [ ] 浏览器预下载 Chromium 已完成

---

*记录时间：2026-03-11*  
*记录者：GSD 🥷⚡ · 审核者：WLB 🦞*  
*来源：claw-agents-shared/blog/openclaw-complete-guide.md Part 2*

---
**OpenClaw 完整指南系列：**
[Part 1: 部署](openclaw-01-deployment.md) ·
[Part 2: 配置优化](openclaw-02-configuration.md) ·
[Part 3: 最佳实践](openclaw-03-best-practices.md) ·
[Part 4: 实战案例](openclaw-04-practical-cases.md)

