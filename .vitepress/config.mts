import { defineConfigWithTheme } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  authorBio,
  navByLocale,
  operationalMarkdownSrcExclude,
  sidebar,
  siteBase,
  siteDescription,
  siteTitle,
  socialLinks,
} from '../site-map.mjs'

type ThemeConfig = DefaultTheme.Config & {
  siteBase?: string
  authorBio?: {
    name: string
    desc: string
    links?: Array<{ text: string; url: string }>
  }
}

export default defineConfigWithTheme<ThemeConfig>({
  title: siteTitle,
  description: siteDescription,
  lang: 'zh-CN',
  base: siteBase,
  srcExclude: operationalMarkdownSrcExclude,
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: navByLocale.root,
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: navByLocale.en,
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
  ],

  themeConfig: {
    authorBio,
    siteBase,
    sidebar,
    socialLinks,
  },
})
