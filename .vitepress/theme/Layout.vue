<script setup>
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter, theme } = useData()
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

// 作者信息（可在 frontmatter 或 themeConfig 里配置）
const authorBio = computed(() => frontmatter.value.authorBio || theme.value.authorBio || {
  name: 'MiaoDX × AI Agents',
  desc: '小米机器人工程师，OPC 实践者 — One Person, (plus multi) Claws。白天做机器人，业余时间让 AI Agent 帮我做更多的事。',
  links: [
    { text: 'GitHub ↗', url: 'https://github.com/MiaoDX' },
    { text: '博客 ↗', url: 'https://miaodx.com' },
    { text: '所有案例 →', url: 'https://miaodx.com/LIP/' }
  ]
})

// 导航（可在 themeConfig.nav 里配置，也可硬编码）
const navItems = computed(() => theme.value.nav || [
  { text: '首页', link: '/LIP/' },
  { text: '月报', link: '/LIP/now/2026-03.html' },
  { text: '案例', link: '/LIP/stories/2026-03-dual-agent-start.html' },
  { text: '经验', link: '/LIP/lessons/error-to-skill-evolution.html' },
  { text: '分享', link: '/LIP/share/' },
  { text: '个人主页', link: '/' }
])

// 侧边栏
const sidebarItems = computed(() => {
  const sb = theme.value.sidebar
  if (!sb) return []
  if (Array.isArray(sb)) return sb
  const keys = Object.keys(sb)
  for (const k of keys) {
    if (route.path.startsWith(k)) return sb[k]
  }
  return sb[keys[0]] || []
})

// 是否显示作者卡片
const showAuthor = computed(() => frontmatter.value.showAuthor !== false)
</script>

<template>
  <div class="te-root">
    <!-- Header -->
    <header class="te-header">
      <div class="te-header-top">
        <div class="te-logo">LIP</div>
        <div class="te-dateline">Learn In Public // 2026</div>
      </div>
      <nav class="te-nav">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          :class="{ active: route.path === item.link }"
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
            :href="item.link"
            class="te-sb-link"
            :class="{ active: route.path === item.link }"
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
                :href="action.link"
                class="te-home-btn"
                :class="action.theme"
              >{{ action.text }}</a>
            </div>
          </div>

          <div class="te-features" v-if="frontmatter.features">
            <div class="te-feature" v-for="f in frontmatter.features" :key="f.title">
              <h3><a v-if="f.link" :href="f.link">{{ f.title }}</a><span v-else>{{ f.title }}</span></h3>
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
