export const siteTitle = 'LIP — Learn In Public'
export const siteDescription = '缪东旭（MiaoDX）的 Learn in Public：AI Coding × 机器人的公开实践'
export const siteBase = '/LIP/'

export const navByLocale = {
  root: [
    { text: '首页', link: '/' },
    { text: 'Whoami', link: '/whoami' },
    { text: 'AI Coding', link: '/ai-coding/' },
    { text: 'Best Practice', link: '/bestpractice/' },
    { text: '分享', link: '/share/' },
    { text: '归档', link: '/openclaw/' },
    { text: '个人主页', link: 'https://miaodx.com', target: '_blank' },
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
      ],
    },
    {
      text: 'AI Coding × 机器人',
      collapsed: false,
      items: [
        { text: 'AI Coding 总览', link: '/ai-coding/' },
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
        { text: 'Work Timeline 讲稿', link: '/share/work-timeline-script' },
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
    {
      text: '🗄️ 归档 · OpenClaw 时期（2026 H1）',
      collapsed: true,
      items: [
        { text: 'OpenClaw 总览', link: '/openclaw/' },
        { text: '部署指南（Docker + 双平台）', link: '/resources/deployment-guide-v2' },
        { text: '配置指南', link: '/resources/config-guide' },
        { text: '案例故事', link: '/stories/' },
        { text: '经验规则', link: '/lessons/' },
        { text: '2026 年 4 月月报', link: '/now/2026-04' },
        { text: '2026 年 3 月月报', link: '/now/2026-03' },
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
  'interviews',
]

export const externalSiteSourceDirs = [
  'sites',
]

export const nonPublicMarkdownSourceDirs = [
  ...operationalMarkdownSourceDirs,
  ...externalSiteSourceDirs,
]

export const nonPublicMarkdownSrcExclude = [
  ...operationalMarkdownSourceFiles,
  ...nonPublicMarkdownSourceDirs.map((dir) => `${dir}/**/*.md`),
]

export const forbiddenPublicOutputPaths = [
  'AGENTS.html',
  'CLAUDE.html',
  ...nonPublicMarkdownSourceDirs,
]

export const scopedIndexLinkFiles = []

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
    indexFile: 'bestpractice/index.md',
    contentDir: 'bestpractice',
    excludeSlugs: ['index', 'ai-lab-actions', 'panorama'],
  },
  {
    indexFile: 'share/index.md',
    contentDir: 'share',
    excludeSlugs: ['index', 'README', 'meetup-multiagent-practice'],
  },
]
