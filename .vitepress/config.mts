import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LIP — Learn In Public',
  description: '记录从 0 到 1 搭建 AI Agent 团队的进化过程',
  lang: 'zh-CN',
  base: '/LIP/',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '月报', link: '/now/2026-03' },
      { text: '案例', link: '/stories/2026-03-dual-agent-start' },
      { text: '规则', link: '/lessons/cross-instance-collaboration' },
      { text: '分享', link: '/share/' },
      { text: '路线图', link: '/ROADMAP' },
      { text: '个人主页', link: 'https://miaodx.com/' },
    ],

    sidebar: [
      {
        text: '快速开始',
        items: [
          { text: '首页', link: '/' },
          { text: '2026 年 3 月', link: '/now/2026-03' },
          { text: '路线图', link: '/ROADMAP' },
        ],
      },
      {
        text: '📖 案例 (stories/)',
        collapsed: false,
        items: [
          { text: '双 Agent 启动日志', link: '/stories/2026-03-dual-agent-start' },
          { text: 'Gateway 宕机 6 小时', link: '/stories/gateway-6hour-outage' },
          { text: '微信抓取攻防战', link: '/stories/wechat-scraping-war' },
          { text: 'OpenClaw Part 1 — 部署', link: '/stories/openclaw-01-deployment' },
          { text: 'OpenClaw Part 2 — 配置', link: '/stories/openclaw-02-configuration' },
          { text: 'OpenClaw Part 3 — 最佳实践', link: '/stories/openclaw-03-best-practices' },
          { text: 'OpenClaw Part 4 — 实战案例', link: '/stories/openclaw-04-practical-cases' },
        ],
      },
      {
        text: '🧠 规则 (lessons/)',
        collapsed: false,
        items: [
          { text: '跨实例协作', link: '/lessons/cross-instance-collaboration' },
          { text: '错误→Skill 自进化', link: '/lessons/error-to-skill-evolution' },
          { text: '三层防护架构', link: '/lessons/gateway-resilience' },
          { text: 'Azure 配置事故', link: '/lessons/azure-config-incident' },
        ],
      },
      {
        text: '📤 分享 (share/)',
        collapsed: false,
        items: [
          { text: '分享入口', link: '/share/' },
          { text: '低成本多 Agent 部署', link: '/share/lowcost-multiplatform-multiagent-deploy.html' },
          { text: 'Claws Civilization', link: '/share/claws-civilization.html' },
        ],
      },
      {
        text: '🛠 资源 (resources/)',
        collapsed: true,
        items: [
          { text: 'OpenClaw 配置指南', link: '/resources/config-guide' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MiaoDX/LIP' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
