# share/ — 发布内容目录

## 目录结构

```
share/
├── README.md                    ← 本文件
├── index.md                     ← 分享入口页
├── *.md                         ← Markdown 文章（VitePress 自动渲染）
└── presentations/               ← 独立 HTML 演讲稿 + 配套素材
    ├── *.html                   ← 自包含 HTML（离线可分享）
    ├── *.png / *.jpg            ← HTML 引用的图片素材
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

### ✅ 用 HTML（放在 `share/presentations/`）

**适合**：演讲稿、Slide 演示、需要特殊排版/动画的内容

**特征**：
- 自包含（一个 HTML 文件搞定）
- 需要离线分享（直接浏览器打开）
- 有复杂的 CSS 动画/布局
- 配套图片素材放在同目录
- 不需要 VitePress 渲染（GitHub Actions 直接复制到 dist）

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
□ 创建 share/presentations/你的演讲.html
□ 配套图片放在 share/presentations/ 目录
□ HTML 中用相对路径引用图片（src="image.png"）
□ 如果需要 sidebar 入口，在 .vitepress/config.mts 中添加
□ Push 到 main → GitHub Actions 自动复制到 dist
□ 访问: https://miaodx.com/LIP/share/你的演讲.html
```

## 注意事项

- **不要把 `.html` 放在 `share/` 根目录** — 统一放到 `presentations/`
- **Markdown 中引用图片**：可以用相对路径，图片放在同目录或 `public/`
- **HTML 中引用图片**：用相对路径，图片和 HTML 放同一目录
- **sidebar 链接**：HTML 文件用 `.html` 后缀，Markdown 文件不带后缀
