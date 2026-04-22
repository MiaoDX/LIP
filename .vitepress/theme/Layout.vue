<script setup>
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { page, frontmatter, theme, lang } = useData()
const route = useRoute()

const isHome = computed(() => frontmatter.value.layout === 'home')
const title = computed(() => frontmatter.value.title || page.value.title || '')
const subtitle = computed(() => frontmatter.value.subtitle || frontmatter.value.description || '')
const date = computed(() => frontmatter.value.date || '')
const author = computed(() => frontmatter.value.author || 'MiaoDX')
const readTime = computed(() => frontmatter.value.readTime || '')
const category = computed(() => frontmatter.value.category || '')
const tags = computed(() => frontmatter.value.tags || [])
const dropCap = computed(() => frontmatter.value.dropCap !== false)

const hasMarp = computed(() => frontmatter.value.marp === true)
const slug = computed(() => {
  const p = route.path.replace(/\/$/, '')
  return p.split('/').pop() || ''
})

// 作者信息
const authorBio = computed(() => frontmatter.value.authorBio || theme.value.authorBio || {
  name: 'MiaoDX × AI Agents',
  desc: '机器人研发工程师，OPC 实践者 — One Person, plus multi Claws。白天给机器人写 bug，其他时间和 AI Agents 一起做更多的事。',
  links: [
    { text: 'GitHub ↗', url: 'https://github.com/MiaoDX' },
    { text: '博客 ↗', url: 'https://miaodx.com' },
    { text: '所有案例 →', url: 'https://miaodx.com/LIP/' }
  ]
})

// 导航
const navItems = computed(() => theme.value.nav || [
  { text: '首页', link: '/' },
  { text: '月报', link: '/now/2026-03' },
  { text: '案例', link: '/stories/2026-03-dual-agent-start' },
  { text: '经验', link: '/lessons/error-to-skill-evolution' },
  { text: '分享', link: '/share/' },
  { text: '个人主页', link: 'https://miaodx.com/' }
])

// 侧边栏 - 根据当前语言选择对应的侧边栏配置
const sidebarItems = computed(() => {
  const sb = theme.value.sidebar
  if (!sb) return []
  if (Array.isArray(sb)) return sb
  
  const keys = Object.keys(sb).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (route.path.startsWith(k)) return sb[k]
  }
  return sb[keys[0]] || []
})

// 是否显示作者卡片
const showAuthor = computed(() => frontmatter.value.showAuthor !== false)

// 语言切换
const isEnglish = computed(() => lang.value === 'en-US' || route.path.startsWith('/en/'))
const switchLang = () => {
  const currentPath = route.path
  // 移除 base 路径前缀，获取相对路径
  const base = '/LIP'
  let relativePath = currentPath
  if (relativePath.startsWith(base)) {
    relativePath = relativePath.slice(base.length)
  }
  
  if (isEnglish.value) {
    // 从英文切换到中文：移除 /en 前缀
    const newPath = relativePath.replace(/^\/en/, '') || '/'
    window.location.href = base + newPath
  } else {
    // 从中文切换到英文：添加 /en 前缀
    const newPath = '/en' + relativePath
    window.location.href = base + newPath
  }
}
</script>

<template>
  <div class="te-root">
    <!-- Header -->
    <header class="te-header">
      <div class="te-header-top">
        <div class="te-logo">LIP</div>
        <div class="te-dateline">Learn In Public // 2026</div>
        <!-- 语言切换按钮 -->
        <button class="lang-switcher" @click="switchLang">
          {{ isEnglish ? '中文' : 'English' }}
        </button>
      </div>
      <nav class="te-nav">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="withBase(item.link)"
          :class="{ active: route.path === withBase(item.link) }"
        >{{ item.text }}</a>
      </nav>
    </header>

    <div class="te-body">
      <!-- Sidebar -->
      <aside class="te-sidebar" v-if="sidebarItems.length > 0 && !isHome">
        <div v-for="group in sidebarItems" :key="group.text" class="te-sb-group">
          <div class="te-sb-title" v-if="group.text">{{ group.text }}</div>
          <a
            v-for="item in group.items"
            :key="item.link"
            :href="withBase(item.link)"
            class="te-sb-link"
            :class="{ active: route.path === withBase(item.link) }"
          >{{ item.text }}</a>
        </div>
      </aside>

      <!-- Main -->
      <main class="te-main" :class="{ 'no-sidebar': sidebarItems.length === 0 || isHome }">

        <!-- Home Page -->
        <div v-if="isHome" class="te-home">
          <div class="te-home-hero">
            <h1 class="te-home-name">{{ frontmatter.hero?.name || 'LIP' }}</h1>
            <p class="te-home-tagline" v-html="frontmatter.hero?.tagline || 'Learn In Public'"></p>
            <div class="te-home-actions" v-if="frontmatter.hero?.actions">
              <a
                v-for="action in frontmatter.hero.actions"
                :key="action.link"
                :href="withBase(action.link)"
                class="te-home-btn"
                :class="action.theme"
              >{{ action.text }}</a>
            </div>
          </div>

          <div class="te-features" v-if="frontmatter.features">
            <div class="te-feature" v-for="f in frontmatter.features" :key="f.title">
              <h3><a v-if="f.link" :href="withBase(f.link)">{{ f.title }}</a><span v-else>{{ f.title }}</span></h3>
              <p>{{ f.details }}</p>
            </div>
          </div>

          <div class="te-prose">
            <Content />
          </div>
        </div>

        <!-- Content Page -->
        <article class="te-article" v-else>

          <!-- Hero -->
          <div class="te-hero" v-if="title">
            <div class="te-category" v-if="category">{{ category }}</div>
            <h1 class="te-title" v-html="title"></h1>
            <div class="te-subtitle" v-if="subtitle">{{ subtitle }}</div>
            <div class="te-meta">
              <span v-if="author">{{ author }}</span>
              <span class="te-divider" v-if="author && date">|</span>
              <span v-if="date">{{ date }}</span>
              <span class="te-divider" v-if="date && readTime">|</span>
              <span v-if="readTime">{{ readTime }}</span>
            </div>
            <div class="te-tags" v-if="tags.length">
              <span class="te-tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
            </div>
            <div v-if="hasMarp" class="te-marp-stamp">
              <span class="te-marp-label">双渲</span>
              <a :href="withBase(`/slides/marp/${slug}.html`)" target="_blank" rel="noopener">
                <span class="glyph">▢</span>幻灯模式
              </a>
            </div>
          </div>

          <!-- Content -->
          <div class="te-prose" :class="{ 'has-drop-cap': dropCap }">
            <Content />
          </div>

          <!-- Author -->
          <div class="te-author" v-if="showAuthor">
            <div class="te-avatar">M</div>
            <div class="te-bio">
              <div class="te-bio-name">{{ authorBio.name }}</div>
              <div class="te-bio-desc">{{ authorBio.desc }}</div>
              <div class="te-bio-links" v-if="authorBio.links">
                <a v-for="l in authorBio.links" :key="l.url" :href="l.url">{{ l.text }}</a>
              </div>
            </div>
          </div>

        </article>
      </main>
    </div>
  </div>
</template>

<style>
/* 语言切换按钮样式 */
.lang-switcher {
  margin-left: auto;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1, #213547);
  transition: all 0.2s;
}

.lang-switcher:hover {
  background: var(--vp-c-bg-soft, #f6f6f7);
  border-color: var(--vp-c-brand, #3451b2);
}

.te-header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.te-marp-stamp {
  display: inline-flex;
  margin: 8px 0 32px;
  border: 1px solid var(--vp-c-text-1, #222);
  background: #f2ede4;
}
.te-marp-stamp .te-marp-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px 14px;
  background: var(--vp-c-text-1, #222);
  color: var(--vp-c-bg, #f8f5ef);
  border-right: 1px solid var(--vp-c-text-1, #222);
  display: inline-flex;
  align-items: center;
}
.te-marp-stamp a {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--vp-c-text-1, #222);
  text-decoration: none;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-right: 1px solid var(--vp-c-text-1, #222);
  transition: background 0.15s, color 0.15s;
}
.te-marp-stamp a:last-child {
  border-right: none;
}
.te-marp-stamp a:hover {
  background: rgba(139, 69, 19, 0.08);
  color: #8b4513;
}
.te-marp-stamp .glyph {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  font-weight: 900;
}
</style>
