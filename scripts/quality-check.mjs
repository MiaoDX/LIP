#!/usr/bin/env node
/**
 * Repo quality check.
 *
 * Generates .quality-report.md and runs source-of-truth checks that keep
 * standalone publish output generated from canonical source locations.
 */

import { access, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { basename, dirname, join, relative } from 'node:path'
import { checkScopedLinks } from './link-check.mjs'
import { cleanLink, markdownLinks, routeToMarkdownFileCandidates, trimBase } from './markdown-route-utils.mjs'
import { checkSourceOwnership, checkStandalone, isGeneratedSourcePath } from './publish-rules.mjs'
import { siteBase } from '../site-map.mjs'

const execFileAsync = promisify(execFile)
const ROOT = process.cwd()
const REPORT_FILE = join(ROOT, '.quality-report.md')
const DIST_DIR = join(ROOT, '.vitepress', 'dist')
const REPORT_TIMESTAMP_RE = /^生成时间: .+$/m
const OPERATIONAL_PUBLIC_OUTPUTS = [
  'AGENTS.html',
  'CLAUDE.html',
  'docs/agents',
  'docs/plans',
]

async function exists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function markdownFiles(dir) {
  if (!(await exists(dir))) return []
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    if (entry.name === 'index.md' || entry.name === '.quality-report.md') continue
    files.push(join(dir, entry.name))
  }
  return files.sort()
}

async function draftArticleFiles() {
  const indexFile = join(ROOT, 'drafts', 'index.md')
  if (!(await exists(indexFile))) return []

  const source = await readFile(indexFile, 'utf8')
  const files = new Set()
  for (const link of markdownLinks(source)) {
    const route = cleanLink(trimBase(link, siteBase))
    if (!route.startsWith('/drafts/')) continue

    for (const file of routeToMarkdownFileCandidates(route)) {
      const fullPath = join(ROOT, file)
      if (await exists(fullPath)) files.add(fullPath)
    }
  }
  return [...files].sort()
}

function countMatches(source, regex) {
  return [...source.matchAll(regex)].length
}

function grade(score) {
  if (score >= 6) return 'A'
  if (score >= 4) return 'B'
  if (score >= 2) return 'C'
  return 'D'
}

async function evaluateArticle(file) {
  const source = await readFile(file, 'utf8')
  const wordCount = source.trim() ? source.trim().split(/\s+/).length : 0
  const headers = countMatches(source, /^##/gm)
  const codeBlocks = countMatches(source, /^```/gm)
  const checklists = countMatches(source, /- \[/g)

  let score = 0
  if (wordCount > 300) score += 2
  if (wordCount > 800) score += 1
  if (headers >= 2) score += 2
  if (codeBlocks >= 2) score += 1
  if (checklists >= 1) score += 1

  return {
    name: basename(file) === 'index.md' ? basename(dirname(file)) : basename(file, '.md'),
    wordCount,
    headers,
    codeBlocks,
    checklists,
    score,
    grade: grade(score),
  }
}

function articleTable(rows) {
  const lines = [
    '| 文章 | 字数 | 标题 | 代码块 | 清单 | 评分 | 等级 |',
    '|------|------|------|--------|------|--------|------|',
  ]
  for (const row of rows) {
    lines.push(`| ${row.name} | ${row.wordCount} | ${row.headers} | ${row.codeBlocks} | ${row.checklists} | ${row.score}/7 | ${row.grade} |`)
  }
  return lines
}

async function trackedGeneratedOutputs() {
  const { stdout } = await execFileAsync('git', ['ls-files'], { cwd: ROOT })
  const tracked = stdout
    .split('\n')
    .filter(Boolean)
    .filter(isGeneratedSourcePath)

  const existing = []
  for (const file of tracked) {
    if (await exists(join(ROOT, file))) existing.push(file)
  }
  return existing
}

async function publishOutputGate(sourceErrors) {
  if (!(await exists(DIST_DIR))) {
    return { status: 'SKIP', detail: '.vitepress/dist does not exist; run npm run docs:build && npm run publish:copy to verify generated output' }
  }

  const { missing, stale, sourceErrors: standaloneSourceErrors } = await checkStandalone({ sourceErrors })
  const problems = [
    ...missing.map((path) => `missing ${relative(ROOT, path)}`),
    ...stale,
    ...standaloneSourceErrors,
  ]
  if (problems.length) return { status: 'FAIL', detail: problems.join('; ') }
  return { status: 'PASS', detail: 'standalone publish outputs match canonical sources' }
}

async function operationalOutputGate() {
  if (!(await exists(DIST_DIR))) {
    return { status: 'SKIP', detail: '.vitepress/dist does not exist; run npm run docs:build to verify public doc boundaries' }
  }

  const leaked = []
  for (const path of OPERATIONAL_PUBLIC_OUTPUTS) {
    if (await exists(join(DIST_DIR, path))) leaked.push(path)
  }
  if (leaked.length) {
    return { status: 'FAIL', detail: `${leaked.join(', ')} should stay agent/process-only, not public site output` }
  }
  return { status: 'PASS', detail: 'agent/process docs are excluded from public site output' }
}

async function scopedLinkGate() {
  const errors = await checkScopedLinks()
  if (errors.length) return { status: 'FAIL', detail: errors.join('; ') }
  return { status: 'PASS', detail: 'scoped navigation and first-read links resolve locally' }
}

function nowInShanghai() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

async function existingReport() {
  try {
    return await readFile(REPORT_FILE, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function normalizeReportTimestamp(source) {
  return source.replace(REPORT_TIMESTAMP_RE, '生成时间: <timestamp>')
}

async function stableReport(source) {
  const previous = await existingReport()
  if (!previous) return source

  const previousTimestamp = previous.match(REPORT_TIMESTAMP_RE)?.[0]
  if (!previousTimestamp) return source

  if (normalizeReportTimestamp(previous) === normalizeReportTimestamp(source)) {
    return source.replace(REPORT_TIMESTAMP_RE, previousTimestamp)
  }
  return source
}

async function main() {
  const lessons = await Promise.all((await markdownFiles(join(ROOT, 'lessons'))).map(evaluateArticle))
  const drafts = await Promise.all((await draftArticleFiles()).map(evaluateArticle))

  const sourceErrors = await checkSourceOwnership()
  const generatedOutputs = await trackedGeneratedOutputs()
  const publishGate = await publishOutputGate(sourceErrors)
  const operationalGate = await operationalOutputGate()
  const linkGate = await scopedLinkGate()

  const gates = [
    {
      name: 'Publish source ownership',
      status: sourceErrors.length ? 'FAIL' : 'PASS',
      detail: sourceErrors.length ? sourceErrors.join('; ') : 'canonical source directories are clean',
    },
    {
      name: 'Tracked generated share/consult output',
      status: generatedOutputs.length ? 'FAIL' : 'PASS',
      detail: generatedOutputs.length ? generatedOutputs.join(', ') : 'none tracked',
    },
    {
      name: 'Built standalone publish output',
      status: publishGate.status,
      detail: publishGate.detail,
    },
    {
      name: 'Public operational doc boundary',
      status: operationalGate.status,
      detail: operationalGate.detail,
    },
    {
      name: 'Scoped local links',
      status: linkGate.status,
      detail: linkGate.detail,
    },
  ]

  const report = [
    '# 文章质量检查报告',
    '',
    `生成时间: ${nowInShanghai()}`,
    '',
    '## 质量门禁',
    '',
    '| 检查 | 状态 | 详情 |',
    '|------|------|------|',
    ...gates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.detail} |`),
    '',
    '## 统计',
    `- Lessons 正文数: ${lessons.length}`,
    `- Drafts 队列正文数: ${drafts.length}`,
    '',
    '## Lessons 目录评估',
    '',
    ...articleTable(lessons),
    '',
  ]

  if (drafts.length) {
    report.push(
      '## Drafts 目录评估',
      '',
      ...articleTable(drafts),
      ''
    )
  }

  report.push(
    '## 建议',
    '',
    '- 等级 A/B: 保留在 Lessons',
    '- 等级 C: 考虑移入 Drafts 待完善',
    '- 等级 D: 考虑删除或重写',
    ''
  )

  const reportSource = await stableReport(report.join('\n'))
  await writeFile(REPORT_FILE, reportSource)
  console.log(`报告已生成: ${relative(ROOT, REPORT_FILE)}`)

  const failed = gates.some((gate) => gate.status === 'FAIL')
  if (failed) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
