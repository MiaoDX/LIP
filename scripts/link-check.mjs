#!/usr/bin/env node
/**
 * Scoped local link checker for the public navigation and first-read docs.
 *
 * This is intentionally narrower than a whole-site crawler. Historical content
 * can contain archival links; this gate protects the routes most likely to
 * mislead a new reader or agent.
 */

import { access, readFile, readdir, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import { basename, dirname, extname, isAbsolute, join, normalize, relative } from 'node:path'
import {
  cleanLink,
  frontmatterLinks,
  isExternalLink,
  markdownLinks,
  routeToMarkdownFileCandidates,
  trimBase,
} from './markdown-route-utils.mjs'
import { collectPublishTargets } from './publish-rules.mjs'
import { marpScanDirs, navByLocale, sidebar, siteBase } from '../site-map.mjs'

const ROOT = process.cwd()
const DIST_DIR = '.vitepress/dist'

const SCOPED_MARKDOWN_FILES = [
  'README.md',
  'ROADMAP.md',
  'index.md',
  'bestpractice/weekly-robotics/index.md',
  'now/2026-04.md',
  'en/index.md',
  'en/ROADMAP.md',
  'en/now/2026-04.md',
  'en/ai-coding/index.md',
  'en/drafts/index.md',
  'en/lessons/index.md',
  'en/openclaw/index.md',
  'en/resources/index.md',
  'en/share/index.md',
  'en/stories/index.md',
  'ai-coding/index.md',
  'bestpractice/index.md',
  'drafts/index.md',
  'lessons/index.md',
  'openclaw/index.md',
  'resources/config-guide.md',
  'resources/index.md',
  'share/index.md',
  'share/agent-radar/index.md',
  'share/meetup-2026-03-30/index.md',
  'slides/index.md',
  'stories/gateway-6hour-outage.md',
  'en/stories/gateway-6hour-outage.md',
  'stories/index.md',
]

const SCOPED_CONFIG_FILES = [
  'site-map.mjs',
]

const SCOPED_INDEX_LINK_FILES = [
  'drafts/index.md',
  'en/drafts/index.md',
]

const GENERATED_ROUTES = [
  {
    route: '/slides/slidev/',
    source: 'slides/slides.md',
  },
]

const INDEX_COVERAGE_RULES = [
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

const FIELD_LINK_RE = /\b(?:link|url):\s*['"]([^'"]+)['"]/g
let publishTargets = null
let marpSlugs = null

async function exists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function isDir(path) {
  try {
    return (await stat(path)).isDirectory()
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

async function entries(path) {
  try {
    return await readdir(path, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function expectedPublishTargets() {
  publishTargets ??= await collectPublishTargets({ distDir: DIST_DIR })
  return publishTargets
}

function publicPathToCandidates(path) {
  const route = trimBase(path, siteBase)
  const cleanRoute = cleanLink(route)
  const withoutSlash = cleanRoute.replace(/^\/+/, '')
  const source = []
  const dist = []

  if (!withoutSlash) {
    source.push('index.md')
    dist.push('index.html')
    return { source, dist }
  }

  if (withoutSlash.endsWith('/')) {
    const stem = withoutSlash.slice(0, -1)
    source.push(`${stem}/index.md`)
    dist.push(`${stem}/index.html`)
    return { source, dist }
  }

  if (extname(withoutSlash) === '.html') {
    source.push(withoutSlash.replace(/\.html$/, '.md'))
    dist.push(withoutSlash)
    return { source, dist }
  }

  if (extname(withoutSlash) === '.md') {
    source.push(withoutSlash)
    dist.push(withoutSlash.replace(/\.md$/, '.html'))
    return { source, dist }
  }

  if (extname(withoutSlash)) {
    source.push(`public/${withoutSlash}`)
    dist.push(withoutSlash)
    return { source, dist }
  }

  source.push(`${withoutSlash}.md`)
  dist.push(`${withoutSlash}.html`)
  return { source, dist }
}

async function walkMarkdownFiles(dir, files = []) {
  for (const entry of await entries(dir)) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkMarkdownFiles(path, files)
    else if (entry.isFile() && path.endsWith('.md')) files.push(path)
  }
  return files
}

async function markdownFilesInDir(dir) {
  const files = []
  for (const entry of await entries(dir)) {
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(entry.name)
  }
  return files.sort()
}

async function publicIndexRoutesInDir(dir) {
  const routes = []
  for (const entry of await entries(dir)) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      routes.push(entry.name.replace(/\.md$/, ''))
      continue
    }

    if (entry.isDirectory() && await exists(join(dir, entry.name, 'index.md'))) {
      routes.push(entry.name)
    }
  }
  return routes.sort()
}

function hasMarpFrontmatter(source) {
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)
  return frontmatter ? /^\s*marp:\s*true\s*$/m.test(frontmatter[1]) : false
}

async function expectedMarpSlugs() {
  if (marpSlugs) return marpSlugs

  marpSlugs = new Set()
  for (const dir of marpScanDirs) {
    for (const file of await walkMarkdownFiles(join(ROOT, dir))) {
      const source = await readFile(file, 'utf8')
      if (hasMarpFrontmatter(source)) marpSlugs.add(basename(file, '.md'))
    }
  }
  return marpSlugs
}

function sidebarItems(items, routes = []) {
  for (const item of items) {
    if (item.link) routes.push(item.link)
    if (item.items) sidebarItems(item.items, routes)
  }
  return routes
}

function configuredRoutes() {
  const routes = []
  for (const navItems of Object.values(navByLocale)) {
    for (const item of navItems) {
      if (item.link) routes.push(item.link)
    }
  }
  for (const items of Object.values(sidebar)) {
    sidebarItems(items, routes)
  }
  return routes
}

async function existingScopedMarkdownFiles({
  scopedMarkdownFiles = SCOPED_MARKDOWN_FILES,
  scopedIndexLinkFiles = SCOPED_INDEX_LINK_FILES,
} = {}) {
  const files = new Set(scopedMarkdownFiles)
  for (const route of configuredRoutes()) {
    for (const file of routeToMarkdownFileCandidates(route, { siteBase })) {
      if (await exists(join(ROOT, file))) files.add(file)
    }
  }
  for (const file of scopedIndexLinkFiles) {
    for (const linkedFile of await linkedMarkdownFiles(file)) files.add(linkedFile)
  }
  return [...files].sort()
}

async function linkedMarkdownFiles(file) {
  if (!(await exists(join(ROOT, file)))) return []

  const source = await readFile(join(ROOT, file), 'utf8')
  const files = []
  for (const link of markdownLinks(source)) {
    if (isExternalLink(link) || !link.startsWith('/')) continue

    for (const linkedFile of routeToMarkdownFileCandidates(link, { siteBase })) {
      if (await exists(join(ROOT, linkedFile))) files.push(linkedFile)
    }
  }
  return files
}

async function publicRouteExists(path) {
  if (await generatedRouteExists(path)) return true

  const { source, dist } = publicPathToCandidates(path)
  for (const candidate of source) {
    if (await exists(join(ROOT, candidate))) return true
  }
  for (const candidate of dist) {
    if (await exists(join(ROOT, DIST_DIR, candidate))) return true
    if (await standaloneSourceExists(candidate)) return true
  }
  return false
}

async function standaloneSourceExists(distCandidate) {
  const fullDest = join(ROOT, DIST_DIR, distCandidate)
  for (const target of await expectedPublishTargets()) {
    if (target.kind === 'file') {
      if (target.dest === fullDest && await exists(target.src)) return true
      continue
    }

    const relativeDest = relative(target.dest, fullDest)
    if (!relativeDest || relativeDest.startsWith('..') || isAbsolute(relativeDest)) continue
    if (await exists(join(target.src, relativeDest))) return true
  }
  return false
}

async function generatedRouteExists(path) {
  const cleanPath = cleanLink(trimBase(path, siteBase))
  const match = GENERATED_ROUTES.find((route) => route.route === cleanPath)
  if (match) return exists(join(ROOT, match.source))

  const marpMatch = cleanPath.match(/^\/slides\/marp\/([^/]+)\.html$/)
  if (!marpMatch) return false

  return (await expectedMarpSlugs()).has(marpMatch[1])
}

async function relativeLinkExists(fromFile, link) {
  const clean = cleanLink(link)
  if (!clean) return true
  if (await generatedRouteExists(clean)) return true
  if (clean.startsWith('/')) return publicRouteExists(clean)

  if (clean.endsWith('/')) {
    const target = normalize(join(dirname(fromFile), clean, 'index.md'))
    if (await exists(join(ROOT, target))) return true
    const route = `/${normalize(join(dirname(fromFile), clean)).replace(/\\/g, '/')}`
    return publicRouteExists(route)
  }

  const target = normalize(join(dirname(fromFile), clean))
  const fullTarget = join(ROOT, target)
  if (extname(target)) return exists(fullTarget)
  if (await exists(`${fullTarget}.md`)) return true
  return false
}

function configLinks(source) {
  return [...source.matchAll(FIELD_LINK_RE)].map((match) => match[1])
}

async function checkMarkdownFile(file, errors) {
  const source = await readFile(join(ROOT, file), 'utf8')
  for (const link of [...markdownLinks(source), ...frontmatterLinks(source)]) {
    if (isExternalLink(link)) continue
    if (link === '#') {
      errors.push(`${file} uses placeholder local link #`)
      continue
    }
    if (!(await relativeLinkExists(file, link))) {
      errors.push(`${file} references missing local link ${link}`)
    }
  }
}

async function checkConfigFile(file, errors) {
  const source = await readFile(join(ROOT, file), 'utf8')
  for (const link of configLinks(source)) {
    if (isExternalLink(link)) continue
    if (!(await publicRouteExists(link))) {
      errors.push(`${file} references missing public route ${link}`)
    }
  }
}

function indexCoversRoute(source, route) {
  return markdownLinks(source)
    .map((link) => cleanLink(link))
    .some((link) => link === route || link === `${route}/` || link === `${route}.html`)
}

async function checkIndexCoverageRule(rule, errors) {
  const indexPath = join(ROOT, rule.indexFile)
  if (!(await exists(indexPath))) return

  const source = await readFile(indexPath, 'utf8')
  const excluded = new Set(rule.excludeSlugs)
  for (const slug of await publicIndexRoutesInDir(join(ROOT, rule.contentDir))) {
    if (excluded.has(slug)) continue

    const route = `/${rule.contentDir}/${slug}`
    if (!indexCoversRoute(source, route)) {
      errors.push(`${rule.indexFile} does not link current article ${route}`)
    }
  }
}

async function checkIndexCoverage({
  indexCoverageRules = INDEX_COVERAGE_RULES,
} = {}) {
  const errors = []
  for (const rule of indexCoverageRules) await checkIndexCoverageRule(rule, errors)
  return errors
}

export async function checkScopedLinks({
  scopedMarkdownFiles = SCOPED_MARKDOWN_FILES,
  scopedConfigFiles = SCOPED_CONFIG_FILES,
  scopedIndexLinkFiles = SCOPED_INDEX_LINK_FILES,
  indexCoverageRules = INDEX_COVERAGE_RULES,
} = {}) {
  const errors = []
  const markdownFiles = await existingScopedMarkdownFiles({ scopedMarkdownFiles, scopedIndexLinkFiles })
  for (const file of markdownFiles) await checkMarkdownFile(file, errors)
  for (const file of scopedConfigFiles) await checkConfigFile(file, errors)
  errors.push(...await checkIndexCoverage({ indexCoverageRules }))
  return errors
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await checkScopedLinks()
  if (errors.length) {
    console.error(`Scoped local link errors: ${errors.length}`)
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }
  const markdownFiles = await existingScopedMarkdownFiles()
  console.log(`Scoped local links passed: ${markdownFiles.length + SCOPED_CONFIG_FILES.length} files`)
}
