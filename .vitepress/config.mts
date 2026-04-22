import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LIP — Learn In Public',
  description: '缪东旭（MiaoDX）的 Learn in Public：AI Coding 与 OpenClaw 的公开进化日志',
  lang: 'zh-CN',
  base: '/LIP/',
  ignoreDeadLinks: true,
  cleanUrls: true,

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '月报', link: '/now/2026-04' },
          { text: 'AI Coding', link: '/ai-coding/' },
          { text: 'OpenClaw', link: '/openclaw/' },
          { text: '经验', link: '/lessons/' },
          { text: 'Best Practice', link: '/bestpractice/' },
          { text: '分享', link: '/share/' },
          { text: '个人主页', link: 'https://miaodx.com', target: '_blank' }
        ],
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Monthly', link: '/en/now/2026-03' },
          { text: 'AI Coding', link: '/en/ai-coding/' },
          { text: 'OpenClaw', link: '/en/openclaw/' },
          { text: 'Lessons', link: '/en/lessons/' },
          { text: 'Share', link: '/en/share/' },
          { text: 'Homepage', link: 'https://miaodx.com', target: '_blank' }
        ],
      }
    }
  },

  head: [
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '692d1a5b-80c6-4a7f-b783-69260b9dd419' }],
    ['script', {}, `
      // Force external nav links to open in new tab (bypass SPA router)
      if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => {
          const fixLinks = () => {
            document.querySelectorAll('.te-nav a[href^="https://"]').forEach(a => {
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener');
            });
          };
          fixLinks();
          // Re-apply after VitePress SPA navigation
          const observer = new MutationObserver(fixLinks);
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    `],
    ['script', { defer: '', src: 'https://cloud.umami.is/script.js', 'data-website-id': '692d1a5b-80c6-4a7f-b783-69260b9dd419' }],
  ],

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

    sidebar: {
      '/': [
        {
          text: '快速开始',
          items: [
            { text: '首页（总览）', link: '/' },
          { text: '2026 年 4 月月报', link: '/now/2026-04' },
            { text: '2026 年 3 月月报', link: '/now/2026-03' },
            { text: '路线图', link: '/ROADMAP' },
          ],
        },
        {
          text: 'Part A · AI Coding',
          collapsed: false,
          items: [
            { text: 'AI Coding 总览', link: '/ai-coding/' },
          ],
        },
        {
          text: 'Part B · OpenClaw',
          collapsed: false,
          items: [
            { text: 'OpenClaw 总览', link: '/openclaw/' },
            { text: '部署指南（Docker + 双平台）', link: '/resources/deployment-guide-v2' },
            { text: '📖 案例故事', link: '/stories/' },
          ],
        },
        {
          text: '🧠 规则 (lessons/)',
          collapsed: true,
          items: [
            { text: '规则总览', link: '/lessons/' },
            { text: '错误→Skill 自进化', link: '/lessons/error-to-skill-evolution' },
            { text: 'Azure 配置事故', link: '/lessons/azure-config-incident' },
            { text: 'Cron 防幻觉', link: '/lessons/cron-anti-hallucination' },
          ],
        },
        {
          text: '📝 Draft',
          collapsed: true,
          items: [
            { text: 'Draft 入口', link: '/drafts/' },
            { text: 'Gateway 弹性架构', link: '/drafts/lessons/gateway-resilience' },
            { text: '跨实例协作模式', link: '/drafts/lessons/cross-instance-collaboration' },
          ],
        },
        {
          text: '🏆 AI Lab Best Practice',
          collapsed: true,
          items: [
            { text: '专栏入口', link: '/bestpractice/' },
            { text: '🌍 25 家公司全景图', link: '/bestpractice/panorama' },
            { text: 'Claude Code Auto Mode', link: '/bestpractice/anthropic-claude-code-auto-mode' },
            { text: 'Harness 设计', link: '/bestpractice/anthropic-harness-design' },
            { text: 'Context Engineering', link: '/bestpractice/anthropic-context-engineering' },
            { text: 'Multi-Agent Research', link: '/bestpractice/anthropic-multi-agent-research' },
          ],
        },
        {
          text: '📤 分享 (share/)',
          collapsed: true,
          items: [
            { text: '分享入口', link: '/share/' },
            { text: 'AI Coding for Research', link: '/share/AICodingRaiseLab.html' },
            { text: '0410 北京 OpenClaw 活动现场', link: '/share/openclaw-meetup-beijing-2026-03' },
            { text: 'Tailscale + Claude Code 配置实战', link: '/share/tailscale-claude-code-setup' },
            { text: 'OpenClaw 分享 v3', link: '/share/openclaw-sharing-v3.html' },
            { text: '低成本多 Agent 部署', link: '/share/lowcost-multiplatform-multiagent-deploy.html' },
            { text: 'Claws Civilization', link: '/share/claws-civilization.html' },
          ],
        },
      ],
      '/en/': [
        {
          text: 'Quick Start',
          items: [
            { text: 'Home', link: '/en/' },
            { text: 'March 2026 Report', link: '/en/now/2026-03' },
            { text: 'Roadmap', link: '/en/ROADMAP' },
          ],
        },
        {
          text: 'Part A · AI Coding',
          collapsed: false,
          items: [
            { text: 'AI Coding Overview', link: '/en/ai-coding/' },
          ],
        },
        {
          text: 'Part B · OpenClaw',
          collapsed: false,
          items: [
            { text: 'OpenClaw Overview', link: '/en/openclaw/' },
            { text: 'Deployment Guide', link: '/resources/deployment-guide-v2' },
            { text: '📖 Stories', link: '/en/stories/' },
          ],
        },
        {
          text: '🧠 Lessons',
          collapsed: true,
          items: [
            { text: 'Lessons Overview', link: '/en/lessons/' },
            { text: 'Error→Skill Evolution', link: '/en/lessons/error-to-skill-evolution' },
            { text: 'Azure Config Incident', link: '/en/lessons/azure-config-incident' },
            { text: 'Cron Anti-Hallucination', link: '/en/lessons/cron-anti-hallucination' },
          ],
        },
        {
          text: '📝 Draft',
          collapsed: true,
          items: [
            { text: 'Draft Index', link: '/en/drafts/' },
            { text: 'Gateway Resilience', link: '/en/drafts/lessons/gateway-resilience' },
            { text: 'Cross-Instance Collaboration', link: '/en/drafts/lessons/cross-instance-collaboration' },
          ],
        },
        {
          text: '📤 Share',
          collapsed: true,
          items: [
            { text: 'Share Index', link: '/en/share/' },
            { text: 'AI Coding for Research', link: '/share/AICodingRaiseLab.html' },
            { text: 'Tailscale + Claude Code Setup', link: '/share/tailscale-claude-code-setup.html' },
            { text: 'OpenClaw Sharing v3', link: '/share/openclaw-sharing-v3.html' },
            { text: 'Low-Cost Multi-Agent Deploy', link: '/share/lowcost-multiplatform-multiagent-deploy.html' },
            { text: 'Claws Civilization', link: '/share/claws-civilization.html' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/MiaoDX/LIP' }],
  },
})
