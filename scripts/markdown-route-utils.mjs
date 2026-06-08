import { extname } from 'node:path'

const MARKDOWN_LINK_RE = /!?\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---/
const FRONTMATTER_LINK_RE = /^\s*(?:link|url):\s*['"]?([^'"\s]+)['"]?\s*$/gm

export function cleanLink(link) {
  return decodeURI(link).split('#')[0].split('?')[0]
}

export function markdownLinks(source) {
  return [...source.matchAll(MARKDOWN_LINK_RE)].map((match) => match[1])
}

export function frontmatterLinks(source) {
  const frontmatter = source.match(FRONTMATTER_RE)?.[1]
  if (!frontmatter) return []
  return [...frontmatter.matchAll(FRONTMATTER_LINK_RE)].map((match) => match[1])
}

export function routeToMarkdownFile(route, { siteBase = '/' } = {}) {
  return routeToMarkdownFileCandidates(route, { siteBase })[0] || null
}

export function routeToMarkdownFileCandidates(route, { siteBase = '/' } = {}) {
  if (!route || isExternalLink(route)) return []

  const cleanRoute = cleanLink(trimBase(route, siteBase))
  const withoutSlash = cleanRoute.replace(/^\/+/, '')

  if (!withoutSlash) return ['index.md']
  if (withoutSlash.endsWith('/')) return [`${withoutSlash}index.md`]
  if (extname(withoutSlash) === '.md') return [withoutSlash]
  if (extname(withoutSlash)) return []

  return [`${withoutSlash}.md`]
}

export function trimBase(path, siteBase = '/') {
  if (siteBase !== '/' && path.startsWith(siteBase)) return `/${path.slice(siteBase.length)}`
  return path
}

export function isExternalLink(link) {
  return /^(?:[a-z][a-z0-9+.-]*:|mailto:|tel:|#)/i.test(link)
}
