---
marp: true
---

# 微信抓取攻防战：从自动化到降级的完整记录

> 2026年3月7-8日，我们尝试自动监控微信公众号文章。  
> 这不是成功案例，而是一场失败的攻防战记录。

---

## 背景

**任务**：监控 6 个微信公众号作者的新文章  
**作者列表**：刘小排、手工川、小互 AI、数字游民秋秋、郎瀚威 Will、胡渊鸣 Ethan

---

## 第一轮：WeWe-RSS（方案 A）

### 尝试

部署 WeWe-RSS 服务：
```bash
git clone https://github.com/cooderl/wewe-rss.git
cd wewe-rss && pnpm install && pnpm build
pnpm start  # 运行在 localhost:4000
```

### 结果

❌ **需要微信扫码登录**

MiaoDX 明确表示：不想扫码，方案太重。

**搁置**。

---

## 第二轮：Playwright 抓取（方案 B）

### 尝试

编写 `fetch-wechat-article.py`：

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://mp.weixin.qq.com/s/xxxxx")
    content = page.content()
```

### 结果

- **WLB 测试**：❌ 403 Forbidden
- **GSD 测试**：✅ 成功抓取

### 关键发现

**IP 信誉差异**：
- GSD 的 IP 能过微信检测
- WLB 的 IP 被标记为机器人

**原因**：
- 服务器 IP vs 住宅 IP
- 行为特征（headless 检测）
- 无有效 cookies

---

## 第三轮：GSD 抓取（方案 C）

### 尝试

让 GSD 负责抓取，WLB 负责发现和总结。

### 结果

**GSD 也 403 了** — 微信反爬策略升级，GSD IP 也被封。

---

## 最终方案：降级

**接受现实**：自动抓取不可行。

**降级方案**：
1. 保留搜索检测（检测新文章链接）
2. 搜索到新文章 → 推送通知到 Slack
3. 用户手动投喂内容 → 我们总结推送

**新工作流**：
```
MiaoDX 发现文章 → 复制内容/链接 → 投喂给 GSD → 总结 → 推送到 #copycat
```

---

## 技术复盘

**为什么失败？**

| 层级 | 问题 | 我们的对策 |
|------|------|-----------|
| 应用层 | 需要登录态 | 放弃自动登录 |
| 网络层 | IP 被封 | 尝试多个 IP |
| 行为层 | headless 检测 | 无有效绕过 |
| 业务层 | 反爬策略升级 | 接受失败 |

**什么情况下能成功？**
- 使用住宅 IP（非服务器）
- 模拟真人行为（非 headless）
- 维护有效 cookies
- 降低请求频率

**成本**：高  
**维护**：重  
**决策**：不值得

---

## 关键教训

1. **不是所有问题都能技术解决** — 有时候，人工介入是更好的方案
2. **及时降级** — 不要死磕，快速转向可行方案
3. **记录失败** — 比成功案例更有价值

---

## 相关规则

- AGENTS.md 错误日志已记录
- TOOLS.md 已更新微信抓取限制
- 协议明确：微信抓取由 GSD 执行（但已放弃）

---

*记录时间：2026-03-11*  
*记录者：GSD 🥷⚡ · 参与者：WLB 🦞, MiaoDX*  
*结果：失败 → 降级*
