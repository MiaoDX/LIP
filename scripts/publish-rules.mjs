#!/usr/bin/env node
/**
 * Standalone publish rules for files that VitePress does not transform.
 *
 * This module is the source of truth for copying standalone HTML decks and
 * passthrough assets into .vitepress/dist. Keep GitHub Actions and local
 * verification pointed at this file instead of duplicating shell snippets.
 */

import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, extname, isAbsolute, join, relative } from 'node:path'

const ROOT = process.cwd()
const DIST_DIR = '.vitepress/dist'
const PUBLISH_MANIFEST = '.standalone-publish-manifest.json'

const SHARE_EXTENSIONS = ['.html', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']
const AI_CODING_ASSET_DIRS = ['images', 'screenshots', 'assets']
const HTML_REF_RE = /\b(?:src|href|poster)=["']([^"']+)["']/gi
const HTML_SRCSET_RE = /\bsrcset=["']([^"']+)["']/gi
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g
const CSS_URL_REF_RE = /\burl\(\s*(['"]?)(.*?)\1\s*\)/gi
const CSS_IMPORT_REF_RE = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?/gi
const RASTER_DATA_URI_RE = /data:image\/(?:png|jpe?g|webp|gif);base64,/i
const ROOT_ABSOLUTE_ASSET_RE = /^\/(?!\/).+\.(?:png|jpe?g|svg|webp|gif|js|css|mp4|webm|pdf)$/i
const HTML_PLACEHOLDER_PATTERNS = [
  { regex: /\bhref=["']#["']/i, message: 'uses placeholder href="#"' },
  { regex: /\bArticle Title Placeholder\b/i, message: 'contains placeholder text "Article Title Placeholder"' },
  { regex: /\bSummary placeholder\b/i, message: 'contains placeholder text "Summary placeholder"' },
  { regex: /\bEvent name placeholder\b/i, message: 'contains placeholder text "Event name placeholder"' },
  { regex: /\bSynthesis placeholder\b/i, message: 'contains placeholder text "Synthesis placeholder"' },
]
const CLIENT_SIDE_PASSWORD_PATTERNS = [
  { regex: /\bconst\s+CORRECT_PWD\s*=/i, message: 'contains a client-side password constant' },
  { regex: /<input\b[^>]*\btype=["']password["']/i, message: 'contains a password input in static public output' },
]

const sourceOwnershipRules = {
  generatedSourceDirs: [
    {
      path: 'public/share',
      message: 'public/share contains tracked publish output; move share sources to share/*.md or presentations/',
    },
    {
      path: 'consult',
      message: 'consult/ is not published; use public/consult/ as the canonical consult source',
    },
  ],
  generatedSourceFiles: [
    {
      dir: 'share',
      fileExtensions: ['.html'],
      recursive: true,
      message: 'share/**/*.html is generated publish output; move HTML sources to presentations/ or ai-coding/<slug>/index.html',
    },
    {
      dir: 'public',
      fileExtensions: ['.md'],
      recursive: true,
      message: 'public/**/*.md is published as a static passthrough file and VitePress page; move maintainer notes to docs/agents/ or convert intentional public content to a site source page',
    },
  ],
  localReferenceRoots: ['presentations', 'ai-coding', 'public/consult', 'templates'],
}

const publishRules = [
  {
    name: 'share presentations',
    sourceDir: 'presentations',
    outDir: 'share',
    fileExtensions: SHARE_EXTENSIONS,
    copyChildDirs: true,
  },
  {
    name: 'AI Coding standalone pages',
    sourceDir: 'ai-coding',
    outDir: 'ai-coding',
    entryFile: 'index.html',
    assetDirs: AI_CODING_ASSET_DIRS,
    aliases: {
      'ultrathink-to-goal': ['share/ultrathink-to-goal'],
    },
  },
  {
    name: 'consult pages',
    sourceDir: 'public/consult',
    outDir: 'consult',
    fileExtensions: ['.html'],
    copyChildDirs: true,
  },
  {
    name: 'shared standalone runtime assets',
    sourceDir: 'assets',
    outDir: 'assets',
    fileExtensions: ['.js'],
  },
]

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

function resolve(path) {
  return join(ROOT, path)
}

function outputPath(distDir, outPath) {
  return join(ROOT, distDir, outPath)
}

async function copyFileToDist(target) {
  const { src, dest } = target
  await mkdir(dirname(dest), { recursive: true })
  await cp(src, dest, { force: true })
}

async function copyDirToDist(target) {
  const { src, dest } = target
  await rm(dest, { recursive: true, force: true })
  await mkdir(dirname(dest), { recursive: true })
  await cp(src, dest, { recursive: true, force: true })
}

async function collectFlatTargets(rule, distDir) {
  const targets = []
  const sourceDir = resolve(rule.sourceDir)
  const outDir = outputPath(distDir, rule.outDir)

  for (const entry of await entries(sourceDir)) {
    const src = join(sourceDir, entry.name)
    if (entry.isFile() && rule.fileExtensions.includes(extname(entry.name).toLowerCase())) {
      targets.push({ kind: 'file', src, dest: join(outDir, entry.name) })
    }
    if (entry.isDirectory() && rule.copyChildDirs) {
      targets.push({ kind: 'dir', src, dest: join(outDir, entry.name) })
    }
  }

  return targets
}

function pageOutputDirs(rule, slug, distDir) {
  const outDirs = [join(rule.outDir, slug), ...(rule.aliases?.[slug] || [])]
  return outDirs.map((outDir) => outputPath(distDir, outDir))
}

async function collectAiCodingTargets(rule, distDir) {
  const targets = []
  const sourceDir = resolve(rule.sourceDir)
  for (const entry of await entries(sourceDir)) {
    if (!entry.isDirectory()) continue

    const srcDir = join(sourceDir, entry.name)
    const page = join(srcDir, rule.entryFile)
    if (!(await exists(page))) continue

    for (const destDir of pageOutputDirs(rule, entry.name, distDir)) {
      targets.push({ kind: 'file', src: page, dest: join(destDir, rule.entryFile) })

      for (const assetDir of rule.assetDirs) {
        const srcAssetDir = join(srcDir, assetDir)
        if (!(await exists(srcAssetDir))) continue
        targets.push({ kind: 'dir', src: srcAssetDir, dest: join(destDir, assetDir) })
      }
    }
  }
  return targets
}

export async function collectPublishTargets({ distDir = DIST_DIR } = {}) {
  const targets = []
  for (const rule of publishRules) {
    if (rule.entryFile) {
      targets.push(...await collectAiCodingTargets(rule, distDir))
    } else {
      targets.push(...await collectFlatTargets(rule, distDir))
    }
  }
  return targets
}

async function targetDestFiles(target) {
  if (target.kind === 'file') return [target.dest]
  const files = await walkRelativeFiles(target.src)
  return files.map((file) => join(target.dest, file))
}

async function collectPublishFiles(targets) {
  const files = []
  for (const target of targets) files.push(...await targetDestFiles(target))
  return files
}

function distRoot(distDir) {
  return join(ROOT, distDir)
}

function manifestPath(distDir) {
  return join(distRoot(distDir), PUBLISH_MANIFEST)
}

function toManifestPath(distDir, file) {
  return relative(distRoot(distDir), file)
}

function fromManifestPath(distDir, file) {
  const root = distRoot(distDir)
  const fullPath = join(root, file)
  const normalized = relative(root, fullPath)
  if (!file || isAbsolute(normalized) || normalized.startsWith('..')) {
    throw new Error(`Invalid standalone publish manifest path: ${file}`)
  }
  return fullPath
}

async function readPublishManifest(distDir) {
  try {
    const source = await readFile(manifestPath(distDir), 'utf8')
    const parsed = JSON.parse(source)
    if (!Array.isArray(parsed.files)) {
      throw new Error('Standalone publish manifest is missing files[]')
    }
    return parsed.files
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writePublishManifest(distDir, files) {
  const uniqueFiles = [...new Set(files)].sort()
  const manifest = {
    version: 1,
    files: uniqueFiles,
  }
  await mkdir(distRoot(distDir), { recursive: true })
  await writeFile(manifestPath(distDir), `${JSON.stringify(manifest, null, 2)}\n`)
}

async function removeOldPublishFiles(distDir, nextFiles) {
  const next = new Set(nextFiles)
  const previous = await readPublishManifest(distDir)
  for (const file of previous) {
    if (next.has(file)) continue
    await rm(fromManifestPath(distDir, file), { force: true })
  }
}

export async function copyStandalone({ distDir = DIST_DIR } = {}) {
  const copied = []
  const targets = await collectPublishTargets({ distDir })
  const publishFiles = (await collectPublishFiles(targets)).map((file) => toManifestPath(distDir, file))
  await removeOldPublishFiles(distDir, publishFiles)

  for (const target of targets) {
    if (target.kind === 'dir') await copyDirToDist(target)
    else await copyFileToDist(target)
    copied.push(target.dest)
  }
  await writePublishManifest(distDir, publishFiles)
  return copied
}

async function walkFiles(dir, files = []) {
  for (const entry of await entries(dir)) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkFiles(path, files)
    else if (entry.isFile()) files.push(path)
  }
  return files
}

async function walkRelativeFiles(dir, currentDir = dir, files = []) {
  for (const entry of await entries(currentDir)) {
    const path = join(currentDir, entry.name)
    if (entry.isDirectory()) await walkRelativeFiles(dir, path, files)
    else if (entry.isFile()) files.push(relative(dir, path))
  }
  return files.sort()
}

function isLocalRef(ref) {
  return ref && !/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(ref)
}

function isRootAbsoluteAssetRef(ref) {
  return ROOT_ABSOLUTE_ASSET_RE.test(cleanRef(ref))
}

function cleanRef(ref) {
  return ref.split('#')[0].split('?')[0]
}

function srcsetRefs(value) {
  return value
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean)
}

function localRefsInCss(source) {
  const refs = []
  for (const match of source.matchAll(CSS_URL_REF_RE)) refs.push(match[2])
  for (const match of source.matchAll(CSS_IMPORT_REF_RE)) refs.push(match[1])
  return refs
    .map(cleanRef)
    .filter((ref) => ref && isLocalRef(ref))
}

function localRefsInHtml(source) {
  source = stripHtmlComments(source)
  const refs = []
  for (const match of source.matchAll(HTML_REF_RE)) refs.push(match[1])
  for (const match of source.matchAll(HTML_SRCSET_RE)) refs.push(...srcsetRefs(match[1]))
  refs.push(...localRefsInCss(source))
  return refs
    .map(cleanRef)
    .filter((ref) => ref && isLocalRef(ref))
}

function rootAbsoluteAssetRefsInCss(source) {
  const refs = []
  for (const match of source.matchAll(CSS_URL_REF_RE)) refs.push(match[2])
  for (const match of source.matchAll(CSS_IMPORT_REF_RE)) refs.push(match[1])
  return refs
    .map(cleanRef)
    .filter((ref) => ref && isRootAbsoluteAssetRef(ref))
}

function rootAbsoluteAssetRefsInHtml(source) {
  source = stripHtmlComments(source)
  const refs = []
  for (const match of source.matchAll(HTML_REF_RE)) refs.push(match[1])
  for (const match of source.matchAll(HTML_SRCSET_RE)) refs.push(...srcsetRefs(match[1]))
  refs.push(...rootAbsoluteAssetRefsInCss(source))
  return refs
    .map(cleanRef)
    .filter((ref) => ref && isRootAbsoluteAssetRef(ref))
}

function stripHtmlComments(source) {
  return source.replace(HTML_COMMENT_RE, '')
}

function checkRootAbsoluteAssetRefs(file, refs, errors) {
  for (const ref of refs) {
    errors.push(`${relative(ROOT, file)} uses root-absolute standalone asset ${ref}; use a local relative asset path`)
  }
}

function checkHtmlPlaceholders(file, source, errors) {
  for (const pattern of HTML_PLACEHOLDER_PATTERNS) {
    if (pattern.regex.test(source)) {
      errors.push(`${relative(ROOT, file)} ${pattern.message}`)
    }
  }
}

function checkClientSidePasswords(file, source, errors) {
  for (const pattern of CLIENT_SIDE_PASSWORD_PATTERNS) {
    if (pattern.regex.test(source)) {
      errors.push(`${relative(ROOT, file)} ${pattern.message}; static GitHub Pages output cannot protect private consult material`)
    }
  }
}

async function checkFileLocalRefs(file, refs, errors) {
  for (const ref of refs) {
    const target = join(dirname(file), ref)
    if (!(await exists(target))) {
      errors.push(`${relative(ROOT, file)} references missing local asset ${ref}`)
    }
  }
}

async function checkLocalRefs(rootDir, errors) {
  const files = await walkFiles(resolve(rootDir))
  for (const file of files) {
    if (!file.endsWith('.html') && !file.endsWith('.css')) continue
    const source = await readFile(file, 'utf8')
    if (file.endsWith('.html') && RASTER_DATA_URI_RE.test(source)) {
      errors.push(`${relative(ROOT, file)} inlines a raster data URI; move the image to a local asset file`)
    }
    if (file.endsWith('.html')) {
      checkHtmlPlaceholders(file, source, errors)
      checkClientSidePasswords(file, source, errors)
    }
    const refs = file.endsWith('.html') ? localRefsInHtml(source) : localRefsInCss(source)
    const rootAssetRefs = file.endsWith('.html') ? rootAbsoluteAssetRefsInHtml(source) : rootAbsoluteAssetRefsInCss(source)
    checkRootAbsoluteAssetRefs(file, rootAssetRefs, errors)
    await checkFileLocalRefs(file, refs, errors)
  }
}

async function checkNoGeneratedSourceDir(path, message, errors) {
  const fullPath = resolve(path)
  if (!(await exists(fullPath))) return
  const files = await walkFiles(fullPath)
  if (files.length) errors.push(message)
}

async function checkNoGeneratedSourceFiles(rule, errors) {
  const fullDir = resolve(rule.dir)
  const files = rule.recursive
    ? await walkRelativeFiles(fullDir)
    : (await entries(fullDir))
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)

  for (const file of files) {
    if (!rule.fileExtensions.includes(extname(file).toLowerCase())) continue
    errors.push(`${rule.dir}/${file}: ${rule.message}`)
  }
}

export function isGeneratedSourcePath(path) {
  for (const rule of sourceOwnershipRules.generatedSourceDirs) {
    if (path.startsWith(`${rule.path}/`)) return true
  }

  for (const rule of sourceOwnershipRules.generatedSourceFiles) {
    if (!path.startsWith(`${rule.dir}/`)) continue
    const childPath = path.slice(rule.dir.length + 1)
    if (!rule.recursive && childPath.includes('/')) continue
    if (rule.fileExtensions.includes(extname(childPath).toLowerCase())) return true
  }

  return false
}

export async function checkSourceOwnership() {
  const errors = []
  for (const rule of sourceOwnershipRules.generatedSourceDirs) {
    await checkNoGeneratedSourceDir(rule.path, rule.message, errors)
  }
  for (const rule of sourceOwnershipRules.generatedSourceFiles) {
    await checkNoGeneratedSourceFiles(rule, errors)
  }
  for (const rootDir of sourceOwnershipRules.localReferenceRoots) {
    await checkLocalRefs(rootDir, errors)
  }
  return errors
}

async function pathKind(path) {
  try {
    const info = await stat(path)
    if (info.isDirectory()) return 'dir'
    if (info.isFile()) return 'file'
    return 'other'
  } catch (error) {
    if (error.code === 'ENOENT') return 'missing'
    throw error
  }
}

async function filesMatch(src, dest) {
  const [srcData, destData] = await Promise.all([readFile(src), readFile(dest)])
  return srcData.equals(destData)
}

async function checkFileTarget(target, problems) {
  const destKind = await pathKind(target.dest)
  if (destKind === 'missing') {
    problems.missing.push(target.dest)
    return
  }
  if (destKind !== 'file') {
    problems.stale.push(`${relative(ROOT, target.dest)} should be a file`)
    return
  }
  if (!(await filesMatch(target.src, target.dest))) {
    problems.stale.push(`${relative(ROOT, target.dest)} differs from ${relative(ROOT, target.src)}`)
  }
}

async function checkDirTarget(target, problems) {
  const destKind = await pathKind(target.dest)
  if (destKind === 'missing') {
    problems.missing.push(target.dest)
    return
  }
  if (destKind !== 'dir') {
    problems.stale.push(`${relative(ROOT, target.dest)} should be a directory`)
    return
  }

  const sourceFiles = await walkRelativeFiles(target.src)
  const destFiles = await walkRelativeFiles(target.dest)
  const sourceSet = new Set(sourceFiles)
  const destSet = new Set(destFiles)

  for (const file of sourceFiles) {
    const src = join(target.src, file)
    const dest = join(target.dest, file)
    if (!destSet.has(file)) {
      problems.missing.push(dest)
    } else if (!(await filesMatch(src, dest))) {
      problems.stale.push(`${relative(ROOT, dest)} differs from ${relative(ROOT, src)}`)
    }
  }

  for (const file of destFiles) {
    if (!sourceSet.has(file)) {
      problems.stale.push(`${relative(ROOT, join(target.dest, file))} is not in ${relative(ROOT, target.src)}`)
    }
  }
}

export async function checkStandalone({ distDir = DIST_DIR, sourceErrors } = {}) {
  const targets = await collectPublishTargets({ distDir })
  const expected = targets.map((target) => target.dest)
  const expectedFiles = new Set((await collectPublishFiles(targets)).map((file) => toManifestPath(distDir, file)))
  const problems = { missing: [], stale: [] }
  const ownershipErrors = sourceErrors ?? await checkSourceOwnership()
  for (const target of targets) {
    if (target.kind === 'dir') await checkDirTarget(target, problems)
    else await checkFileTarget(target, problems)
  }
  for (const file of await readPublishManifest(distDir)) {
    if (expectedFiles.has(file)) continue
    const stalePath = fromManifestPath(distDir, file)
    if (await exists(stalePath)) {
      problems.stale.push(`${relative(ROOT, stalePath)} is no longer published from a standalone source`)
    }
  }
  return { expected, missing: problems.missing, stale: problems.stale, sourceErrors: ownershipErrors }
}

function parseArgs(argv) {
  const command = argv[2] || 'copy'
  const distArgIndex = argv.indexOf('--dist')
  const distDir = distArgIndex >= 0 ? argv[distArgIndex + 1] : DIST_DIR
  if (distArgIndex >= 0 && !distDir) {
    throw new Error('--dist requires a path')
  }
  return { command, distDir }
}

function printList(label, paths) {
  console.log(`${label}: ${paths.length}`)
  for (const path of paths) {
    const item = path.startsWith(ROOT) ? relative(ROOT, path) : path
    console.log(`  - ${item}`)
  }
}

async function main() {
  const { command, distDir } = parseArgs(process.argv)

  if (command === 'copy') {
    const copied = await copyStandalone({ distDir })
    printList('Copied standalone publish output', copied)
    return
  }

  if (command === 'check') {
    const { expected, missing, stale, sourceErrors } = await checkStandalone({ distDir })
    printList('Expected standalone publish output', expected)
    if (missing.length) {
      printList('Missing standalone publish output', missing)
      process.exitCode = 1
    }
    if (stale.length) {
      printList('Stale standalone publish output', stale)
      process.exitCode = 1
    }
    if (sourceErrors.length) {
      printList('Standalone source ownership errors', sourceErrors)
      process.exitCode = 1
    }
    return
  }

  console.error(`Unknown command: ${command}`)
  console.error('Usage: node scripts/publish-rules.mjs [copy|check] [--dist .vitepress/dist]')
  process.exitCode = 1
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
