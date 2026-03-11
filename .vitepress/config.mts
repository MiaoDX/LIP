import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LIP — Learn In Public',
  description: '记录从 0 到 1 搭建 AI Agent 团队的进化过程',
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '月报', link: '/now/2026-03' },
      { text: '案例', link: '/stories/2026-03-dual-agent-start' },
      { text: '规则', link: '/lessons/cross-instance-collaboration' },
      { text: '路线图', link: '/ROADMAP' },
    ],

    sidebar: [
      {
        text: '📅 月报 (now/)',
        items: [
          { text: '2026 年 3 月', link: '/now/2026-03' },
        ],
      },
      {
        text: '📖 案例 (stories/)',
        collapsed: false,
        items: [
          { text: '双 Agent 启动日志', link: '/stories/2026-03-dual-agent-start' },
          { text: 'OpenClaw Part 1 — 部署', link: '/stories/openclaw-01-deployment' },
          { text: 'OpenClaw Part 2 — 配置', link: '/stories/openclaw-02-configuration' },
          { text: 'OpenClaw Part 3 — 最佳实践', link: '/stories/openclaw-03-best-practices' },
          { text: 'OpenClaw Part 4 — 实战案例', link: '/stories/openclaw-04-practical-cases' },
          { text: '傅盛龙虾实验', link: '/stories/fusheng-lobster-experiment' },
          { text: 'Gateway 宕机 6 小时', link: '/stories/gateway-6hour-outage' },
          { text: '微信抓取攻防战', link: '/stories/wechat-scraping-war' },
        ],
      },
      {
        text: '🧠 规则 (lessons/)',
        collapsed: false,
        items: [
          { text: '跨实例协作', link: '/lessons/cross-instance-collaboration' },
          { text: '错误→Skill 自进化', link: '/lessons/error-to-skill-evolution' },
          { text: '三层防护架构', link: '/lessons/gateway-resilience' },
        ],
      },
      {
        text: '💬 讨论 (discussions/)',
        collapsed: true,
        items: [
          { text: 'GSD 诞生日', link: '/discussions/2026-03-07-gsd-launch' },
          { text: 'Cron 审计与精简', link: '/discussions/2026-03-09-cron-audit' },
          { text: 'LIP 规划 — WLB 提案', link: '/discussions/2026-03-11-lip-structure/wlb-proposal' },
          { text: 'LIP 规划 — 共识', link: '/discussions/2026-03-11-lip-structure/wlb-gsd-consensus' },
          { text: 'Claude 审查建议', link: '/discussions/2026-03-11-claude-review/docs-improvement-suggestions' },
          { text: 'Agent 注册表', link: '/discussions/meta/agent-registry' },
          { text: '决策时间线', link: '/discussions/meta/decision-log' },
        ],
      },
      {
        text: '🛠 资源 (resources/)',
        collapsed: true,
        items: [
          { text: 'OpenClaw 配置指南', link: '/resources/config-guide' },
        ],
      },
      {
        text: '🗺 其他',
        collapsed: true,
        items: [
          { text: '路线图', link: '/ROADMAP' },
          { text: 'JJ 迁移公告', link: '/JJ_MIGRATION' },
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
