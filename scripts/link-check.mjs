#!/usr/bin/env node
/**
 * Scoped local link checker for the public navigation and first-read docs.
 *
 * This is intentionally narrower than a whole-site crawler. Historical content
 * can contain archival links; this gate protects the routes most likely to
 * mislead a new reader or agent.
 */

import { access, readFile, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, extname, isAbsolute, join, normalize, relative } from 'node:path'
import { collectPublishTargets } from './publish-rules.mjs'
import { siteBase } from '../site-map.mjs'

const ROOT = process.cwd()
const DIST_DIR = '.vitepress/dist'

const SCOPED_MARKDOWN_FILES = [
  'README.md',
  'ROADMAP.md',
  'index.md',
  'bestpractice/weekly-robotics/index.md',
  'en/index.md',
  'en/ROADMAP.md',
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
  'slides/index.md',
  'stories/index.md',
]

const SCOPED_CONFIG_FILES = [
  'site-map.mjs',
]

const MARKDOWN_LINK_RE = /!?\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
const FIELD_LINK_RE = /\b(?:link|url):\s*['"]([^'"]+)['"]/g
let publishTargets = null

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

async function expectedPublishTargets() {
  publishTargets ??= await collectPublishTargets({ distDir: DIST_DIR })
  return publishTargets
}

function cleanLink(link) {
  return decodeURI(link).split('#')[0].split('?')[0]
}

function isExternal(link) {
  return /^(?:[a-z][a-z0-9+.-]*:|mailto:|tel:|#)/i.test(link)
}

function trimBase(path) {
  if (siteBase !== '/' && path.startsWith(siteBase)) return `/${path.slice(siteBase.length)}`
  return path
}

function publicPathToCandidates(path) {
  const route = trimBase(path)
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

  source.push(`${withoutSlash}.md`, `${withoutSlash}/index.md`)
  dist.push(`${withoutSlash}.html`, `${withoutSlash}/index.html`)
  return { source, dist }
}

async function publicRouteExists(path) {
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

async function relativeLinkExists(fromFile, link) {
  const clean = cleanLink(link)
  if (!clean) return true
  if (clean.startsWith('/')) return publicRouteExists(clean)

  const target = normalize(join(dirname(fromFile), clean))
  const fullTarget = join(ROOT, target)
  if (await exists(fullTarget)) return true
  if (!extname(target) && await exists(`${fullTarget}.md`)) return true
  if (await isDir(fullTarget) && await exists(join(fullTarget, 'index.md'))) return true
  return false
}

function markdownLinks(source) {
  return [...source.matchAll(MARKDOWN_LINK_RE)].map((match) => match[1])
}

function configLinks(source) {
  return [...source.matchAll(FIELD_LINK_RE)].map((match) => match[1])
}

async function checkMarkdownFile(file, errors) {
  const source = await readFile(join(ROOT, file), 'utf8')
  for (const link of markdownLinks(source)) {
    if (isExternal(link)) continue
    if (!(await relativeLinkExists(file, link))) {
      errors.push(`${file} references missing local link ${link}`)
    }
  }
}

async function checkConfigFile(file, errors) {
  const source = await readFile(join(ROOT, file), 'utf8')
  for (const link of configLinks(source)) {
    if (isExternal(link)) continue
    if (!(await publicRouteExists(link))) {
      errors.push(`${file} references missing public route ${link}`)
    }
  }
}

export async function checkScopedLinks() {
  const errors = []
  for (const file of SCOPED_MARKDOWN_FILES) await checkMarkdownFile(file, errors)
  for (const file of SCOPED_CONFIG_FILES) await checkConfigFile(file, errors)
  return errors
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await checkScopedLinks()
  if (errors.length) {
    console.error(`Scoped local link errors: ${errors.length}`)
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }
  console.log(`Scoped local links passed: ${SCOPED_MARKDOWN_FILES.length + SCOPED_CONFIG_FILES.length} files`)
}
