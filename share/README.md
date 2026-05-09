# share/ — 发布内容目录

## 目录结构

```
share/
├── README.md                    ← 本文件
├── index.md                     ← 分享入口页
├── *.md                         ← Markdown 文章（VitePress 自动渲染）
```

独立 HTML 演讲稿不放在 `share/` 目录下；源文件放在仓库根目录的 `presentations/`，`scripts/publish-rules.mjs` 发布到 `/LIP/share/`：

```
presentations/
├── *.html                       ← 自包含 HTML（离线可分享）
├── *.png / *.jpg                ← HTML 引用的图片素材
├── <deck-assets>/               ← 可选：成组图片 / svg / webp 等素材
└── ...
```

## 什么时候用 Markdown，什么时候用 HTML？

### ✅ 用 Markdown（放在 `share/` 根目录）

**适合**：教程、配置指南、博客文章、技术笔记

**特征**：
- 内容以文字为主
- 需要版本控制和 diff
- VitePress 自动渲染为网页
- 可以加 sidebar 导航
- 适合搜索引擎索引

**示例**：Tailscale 配置实战、API 使用指南、踩坑日志

### ✅ 用 HTML（源文件放在 `presentations/`）

**适合**：演讲稿、Slide 演示、需要特殊排版/动画的内容

**特征**：
- 自包含（一个 HTML 文件搞定）
- 需要离线分享（直接浏览器打开）
- 有复杂的 CSS 动画/布局
- 配套图片素材放在同目录，或放在 `presentations/<deck-assets>/`
- 不需要 VitePress 渲染（`npm run publish:copy` 直接复制到 `/LIP/share/`）

**示例**：OpenClaw 分享 Slide、低成本部署演讲稿

## 新增内容 Checklist

### Markdown 文章
```
□ 创建 share/你的文章.md
□ 在 .vitepress/config.mts 的 sidebar 中添加入口
□ Push 到 main → VitePress 自动构建
□ 访问: https://miaodx.com/LIP/share/你的文章
```

### HTML 演讲稿
```
□ 创建 presentations/你的演讲.html
□ 配套图片放在 presentations/ 目录，或 presentations/你的演讲-assets/
□ HTML 中用相对路径引用图片（src="image.png" 或 src="你的演讲-assets/image.png"）
□ 如果需要 sidebar 入口，在 .vitepress/config.mts 中添加
□ Push 到 main → GitHub Actions 运行 npm run publish:copy 自动复制到 dist
□ 访问: https://miaodx.com/LIP/share/你的演讲.html
```

### AI Coding 专题演讲项目

如果演讲稿本身带有 research / scripts / screenshots 等源材料，放在 `ai-coding/<slug>/`，不要强行塞进通用 `presentations/`：

```
□ 创建 ai-coding/你的演讲/index.html
□ 素材放在 ai-coding/你的演讲/images/、screenshots/ 或 assets/
□ HTML 中用相对路径引用图片（src="images/image.png"）
□ Push 到 main → GitHub Actions 运行 npm run publish:copy 自动复制到 dist
□ 访问: https://miaodx.com/LIP/ai-coding/你的演讲/
```

## 注意事项

- **不要把 `.html` 放在 `share/` 根目录** — 统一放到仓库根目录 `presentations/`，由 `scripts/publish-rules.mjs` 发布到 `/share/`
- **不要把演讲素材放在 `public/share/`** — `/share/` 发布结果必须由 `share/*.md` 和 `presentations/` 生成
- **Markdown 中引用图片**：可以用相对路径，图片放在同目录或 `public/`
- **HTML 中引用图片**：用相对路径，图片和 HTML 放同一目录
- **AI Coding 专题 HTML**：源文件放 `ai-coding/<slug>/index.html`，素材留在该目录下的 `images/`、`screenshots/` 或 `assets/`
- **sidebar 链接**：HTML 文件用 `.html` 后缀，Markdown 文件不带后缀
