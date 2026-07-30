export const siteTitle = 'LIP — Learn In Public'
export const siteDescription = '缪东旭（MiaoDX）的 Learn in Public：AI Coding 与 OpenClaw 的公开进化日志'
export const siteBase = '/LIP/'

export const navByLocale = {
  root: [
    { text: '首页', link: '/' },
    { text: 'Whoami', link: '/whoami' },
    { text: '月报', link: '/now/2026-04' },
    { text: 'AI Coding', link: '/ai-coding/' },
    { text: 'OpenClaw', link: '/openclaw/' },
    { text: '经验', link: '/lessons/' },
    { text: 'Best Practice', link: '/bestpractice/' },
    { text: '分享', link: '/share/' },
    { text: '个人主页', link: 'https://miaodx.com', target: '_blank' },
  ],
  en: [
    { text: 'Home', link: '/en/' },
    { text: 'Monthly', link: '/en/now/2026-04' },
    { text: 'AI Coding', link: '/en/ai-coding/' },
    { text: 'OpenClaw', link: '/en/openclaw/' },
    { text: 'Lessons', link: '/en/lessons/' },
    { text: 'Share', link: '/en/share/' },
    { text: 'Homepage', link: 'https://miaodx.com', target: '_blank' },
  ],
}

export const authorBio = {
  name: 'MiaoDX × AI Agents',
  desc: '机器人研发工程师，OPC 实践者 — One Person, plus multi Claws。白天给机器人写 bug，其他时间和 AI Agents 一起做更多的事。',
  links: [
    { text: 'GitHub ↗', url: 'https://github.com/MiaoDX' },
    { text: '博客 ↗', url: 'https://miaodx.com' },
    { text: '所有案例 →', url: 'https://miaodx.com/LIP/' },
  ],
}

export const sidebar = {
  '/': [
    {
      text: '快速开始',
      items: [
        { text: '首页（总览）', link: '/' },
        { text: 'Whoami', link: '/whoami' },
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
        { text: '配置指南', link: '/resources/config-guide' },
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
        { text: 'GSD Rug Pull 维护者困境', link: '/drafts/ai-coding/gsd-rugpull-maintainer-dilemma/' },
      ],
    },
    {
      text: '🏆 AI Lab Best Practice',
      collapsed: true,
      items: [
        { text: '专栏入口', link: '/bestpractice/' },
        { text: '🌍 31 家公司全景图', link: '/bestpractice/panorama' },
        { text: 'Harness 设计', link: '/bestpractice/anthropic-harness-design' },
        { text: 'Context Engineering', link: '/bestpractice/anthropic-context-engineering' },
        { text: 'Multi-Agent Research', link: '/bestpractice/anthropic-multi-agent-research' },
        { text: 'Agent-Assisted Coding', link: '/bestpractice/nvidia-kaggle-agent-assisted-coding' },
      ],
    },
    {
      text: '📤 分享 (share/)',
      collapsed: true,
      items: [
        { text: '分享入口', link: '/share/' },
        { text: '从 Ultrathink 到 Goal', link: '/share/ultrathink-to-goal/' },
        { text: 'AI Coding for Research', link: '/share/AICodingRaiseLab.html' },
        { text: 'Tailscale + Claude Code 配置实战', link: '/share/tailscale-claude-code-setup' },
        { text: 'OpenClaw 分享 v3', link: '/share/openclaw-sharing-v3.html' },
        { text: '低成本多 Agent 部署', link: '/share/lowcost-multiplatform-multiagent-deploy.html' },
        { text: 'Claws Civilization', link: '/share/claws-civilization.html' },
        { text: '软协议叙事稿', link: '/share/agent-collaboration-narrative.html' },
        { text: '龙虾文明错误版本', link: '/share/lobster-civilization-narrative.html' },
      ],
    },
  ],
  '/en/': [
    {
      text: 'Quick Start',
      items: [
        { text: 'Home', link: '/en/' },
        { text: 'April 2026 Report', link: '/en/now/2026-04' },
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
        { text: 'Configuration Guide', link: '/resources/config-guide' },
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
        { text: 'From Ultrathink to Goal', link: '/share/ultrathink-to-goal/' },
        { text: 'AI Coding for Research', link: '/share/AICodingRaiseLab.html' },
        { text: 'Tailscale + Claude Code Setup', link: '/share/tailscale-claude-code-setup' },
        { text: 'OpenClaw Sharing v3', link: '/share/openclaw-sharing-v3.html' },
        { text: 'Low-Cost Multi-Agent Deploy', link: '/share/lowcost-multiplatform-multiagent-deploy.html' },
        { text: 'Claws Civilization', link: '/share/claws-civilization.html' },
        { text: 'Soft Protocol Narrative', link: '/share/agent-collaboration-narrative.html' },
        { text: 'Lobster Civilization Mistakes', link: '/share/lobster-civilization-narrative.html' },
      ],
    },
  ],
}

export const socialLinks = [
  { icon: 'github', link: 'https://github.com/MiaoDX/LIP' },
]

export const marpScanDirs = [
  'stories',
  'lessons',
  'now',
  'share',
  'slides',
  'openclaw',
  'presentations',
  'ai-coding',
  'bestpractice',
]

export const operationalMarkdownSourceFiles = [
  'AGENTS.md',
  'CLAUDE.md',
]

export const operationalMarkdownSourceDirs = [
  'docs/agents',
  'docs/plans',
  'docs/status',
]

export const operationalMarkdownSrcExclude = [
  ...operationalMarkdownSourceFiles,
  ...operationalMarkdownSourceDirs.map((dir) => `${dir}/**/*.md`),
]

export const operationalPublicOutputPaths = [
  'AGENTS.html',
  'CLAUDE.html',
  ...operationalMarkdownSourceDirs,
]

export const scopedIndexLinkFiles = [
  'drafts/index.md',
  'en/drafts/index.md',
]

export const indexCoverageRules = [
  {
    indexFile: 'stories/index.md',
    contentDir: 'stories',
    excludeSlugs: ['index'],
  },
  {
    indexFile: 'lessons/index.md',
    contentDir: 'lessons',
    excludeSlugs: ['index'],
  },
  {
    indexFile: 'resources/index.md',
    contentDir: 'resources',
    excludeSlugs: ['index'],
  },
  {
    indexFile: 'proposals/index.md',
    contentDir: 'proposals',
    excludeSlugs: ['index'],
  },
  {
    indexFile: 'bestpractice/index.md',
    contentDir: 'bestpractice',
    excludeSlugs: ['index', 'ai-lab-actions', 'panorama'],
  },
  {
    indexFile: 'share/index.md',
    contentDir: 'share',
    excludeSlugs: ['index', 'README', 'meetup-multiagent-practice'],
  },
  {
    indexFile: 'en/stories/index.md',
    contentDir: 'en/stories',
    excludeSlugs: ['index'],
  },
  {
    indexFile: 'en/lessons/index.md',
    contentDir: 'en/lessons',
    excludeSlugs: ['index'],
  },
]
