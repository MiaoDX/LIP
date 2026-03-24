import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LIP — Learn In Public',
  description: '缪东旭（MiaoDX）的 Learn in Public：AI Coding 与 OpenClaw 的公开进化日志',
  lang: 'zh-CN',
  base: '/LIP/',
  ignoreDeadLinks: true,

  themeConfig: {
    authorBio: {
      name: 'MiaoDX × AI Agents',
      desc: '机器人研发工程师，OPC 实践者 — One Person, plus multi Claws。白天给机器人写 bug，其他时间和 AI Agents 一起做更多的事。',
      links: [
        { text: 'GitHub ↗', url: 'https://github.com/MiaoDX' },
        { text: '博客 ↗', url: 'https://miaodx.com' },
        { text: '所有案例 →', url: 'https://miaodx.com/LIP/' }
      ]
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '月报', link: '/now/2026-03' },
      { text: '案例', link: '/stories/2026-03-dual-agent-start' },
      { text: '经验', link: '/lessons/error-to-skill-evolution' },
      { text: '分享', link: '/share/' },
      { text: '个人主页', link: 'https://miaodx.com', target: '_blank' }
    ],

    sidebar: [
      {
        text: '快速开始',
        items: [
          { text: '首页（总览）', link: '/' },
          { text: '2026 年 3 月月报', link: '/now/2026-03' },
          { text: '路线图', link: '/ROADMAP' },
        ],
      },
      {
        text: 'Part A · AI Coding',
        collapsed: false,
        items: [
          { text: '双 Agent 启动日志', link: '/stories/2026-03-dual-agent-start' },
          { text: '微信抓取攻防战', link: '/stories/wechat-scraping-war' },
          { text: 'Gateway 宕机 6 小时', link: '/stories/gateway-6hour-outage' },
        ],
      },
      {
        text: 'Part B · OpenClaw',
        collapsed: false,
        items: [
          { text: '部署指南（Docker + 双平台）', link: '/resources/deployment-guide-v2' },
        ],
      },
      {
        text: '🧠 规则 (lessons/)',
        collapsed: false,
        items: [
          { text: '错误→Skill 自进化', link: '/lessons/error-to-skill-evolution' },
          { text: '跨实例协作', link: '/lessons/cross-instance-collaboration' },
          { text: '三层防护架构', link: '/lessons/gateway-resilience' },
          { text: 'Azure 配置事故', link: '/lessons/azure-config-incident' },
        ],
      },
      {
        text: '📤 分享 (share/)',
        collapsed: true,
        items: [
          { text: '分享入口', link: '/share/' },
          { text: 'Tailscale + Claude Code 配置实战', link: '/share/tailscale-claude-code-setup' },
          { text: '低成本多 Agent 部署', link: '/share/lowcost-multiplatform-multiagent-deploy' },
          { text: 'Claws Civilization', link: '/share/claws-civilization' },
          { text: 'OpenClaw 分享 v3', link: '/share/openclaw-sharing-v3' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/MiaoDX/LIP' }],
  },
})
