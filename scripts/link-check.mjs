#!/usr/bin/env node
/**
 * Scoped local link checker for the public navigation and first-read docs.
 *
 * This is intentionally narrower than a whole-site crawler. Historical content
 * can contain archival links; this gate protects the routes most likely to
 * mislead a new reader or agent.
 */

import { access, readFile, readdir } from 'node:fs/promises'
import { constants } from 'node:fs'
import { execFile } from 'node:child_process'
import { dirname, extname, isAbsolute, join, normalize, relative } from 'node:path'
import { promisify } from 'node:util'
import { hasMarpFrontmatter, marpOutputSlug } from './build-slides.mjs'
import {
  cleanLink,
  frontmatterLinks,
  isExternalLink,
  markdownLinks,
  publicPathToCandidates,
  routeToMarkdownFileCandidates,
  trimBase,
} from './markdown-route-utils.mjs'
import { collectPublishTargets } from './publish-rules.mjs'
import { marpScanDirs, navByLocale, sidebar, siteBase } from '../site-map.mjs'

const ROOT = process.cwd()
const DIST_DIR = '.vitepress/dist'
const execFileAsync = promisify(execFile)

const SCOPED_INDEX_LINK_FILES = [
  'drafts/index.md',
  'en/drafts/index.md',
]

const PUBLIC_MARKDOWN_EXCLUDE_FILES = [
  '.quality-report.md',
  'AGENTS.md',
  'CLAUDE.md',
]

const PUBLIC_MARKDOWN_EXCLUDE_DIRS = [
  'docs/agents/',
  'docs/plans/',
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

async function entries(path) {
  try {
    return await readdir(path, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function trackedMarkdownFiles() {
  try {
    const { stdout } = await execFileAsync('git', ['ls-files', '*.md'], { cwd: ROOT })
    return stdout.split('\n').filter(Boolean)
  } catch {
    return walkMarkdownFiles(ROOT)
      .then((files) => files.map((file) => relative(ROOT, file)))
  }
}

function isPublicMarkdownFile(file) {
  if (PUBLIC_MARKDOWN_EXCLUDE_FILES.includes(file)) return false
  return !PUBLIC_MARKDOWN_EXCLUDE_DIRS.some((dir) => file.startsWith(dir))
}

async function publicMarkdownFiles() {
  return (await trackedMarkdownFiles()).filter(isPublicMarkdownFile).sort()
}

async function expectedPublishTargets() {
  publishTargets ??= await collectPublishTargets({ distDir: DIST_DIR })
  return publishTargets
}

async function walkMarkdownFiles(dir, files = []) {
  for (const entry of await entries(dir)) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkMarkdownFiles(path, files)
    else if (entry.isFile() && path.endsWith('.md')) files.push(path)
  }
  return files
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

async function publicIndexMarkdownFilesInDir(dir) {
  const files = []
  for (const entry of await entries(dir)) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push({
        slug: entry.name.replace(/\.md$/, ''),
        file: join(dir, entry.name),
      })
      continue
    }

    if (entry.isDirectory() && await exists(join(dir, entry.name, 'index.md'))) {
      files.push({
        slug: entry.name,
        file: join(dir, entry.name, 'index.md'),
      })
    }
  }
  return files.sort((left, right) => left.file.localeCompare(right.file))
}

async function expectedMarpSlugs() {
  if (marpSlugs) return marpSlugs

  marpSlugs = new Set()
  for (const dir of marpScanDirs) {
    for (const file of await walkMarkdownFiles(join(ROOT, dir))) {
      const source = await readFile(file, 'utf8')
      if (hasMarpFrontmatter(source)) marpSlugs.add(marpOutputSlug(file))
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
  scopedMarkdownFiles,
  configuredRouteLinks = configuredRoutes(),
  scopedIndexLinkFiles = SCOPED_INDEX_LINK_FILES,
  indexCoverageRules = INDEX_COVERAGE_RULES,
} = {}) {
  const files = new Set(scopedMarkdownFiles ?? await publicMarkdownFiles())
  for (const route of configuredRouteLinks) {
    for (const file of routeToMarkdownFileCandidates(route, { siteBase })) {
      if (await exists(join(ROOT, file))) files.add(file)
    }
  }
  for (const file of scopedIndexLinkFiles) {
    for (const linkedFile of await linkedMarkdownFiles(file)) files.add(linkedFile)
  }
  for (const file of await indexCoverageMarkdownFiles(indexCoverageRules)) files.add(file)
  return [...files].sort()
}

async function indexCoverageMarkdownFiles(indexCoverageRules) {
  const files = []
  for (const rule of indexCoverageRules) {
    const excluded = new Set(rule.excludeSlugs)
    for (const entry of await publicIndexMarkdownFilesInDir(rule.contentDir)) {
      if (!excluded.has(entry.slug)) files.push(entry.file)
    }
  }
  return files
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

  const { source, dist } = publicPathToCandidates(path, { siteBase })
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

async function checkConfiguredRoutes(routes, errors) {
  for (const route of routes) {
    if (isExternalLink(route)) continue
    if (!(await publicRouteExists(route))) {
      errors.push(`site-map.mjs references missing public route ${route}`)
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
  scopedMarkdownFiles,
  configuredRouteLinks = configuredRoutes(),
  scopedIndexLinkFiles = SCOPED_INDEX_LINK_FILES,
  indexCoverageRules = INDEX_COVERAGE_RULES,
} = {}) {
  const errors = []
  const markdownFiles = await existingScopedMarkdownFiles({
    scopedMarkdownFiles,
    configuredRouteLinks,
    scopedIndexLinkFiles,
    indexCoverageRules,
  })
  for (const file of markdownFiles) await checkMarkdownFile(file, errors)
  await checkConfiguredRoutes(configuredRouteLinks, errors)
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
  console.log(`Scoped local links passed: ${markdownFiles.length} files`)
}
