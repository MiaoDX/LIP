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
import { basename, join, relative } from 'node:path'
import { checkSourceOwnership, checkStandalone } from './publish-rules.mjs'

const execFileAsync = promisify(execFile)
const ROOT = process.cwd()
const REPORT_FILE = join(ROOT, '.quality-report.md')
const DIST_DIR = join(ROOT, '.vitepress', 'dist')

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
    name: basename(file, '.md'),
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
  return stdout
    .split('\n')
    .filter(Boolean)
    .filter((path) => (
      path.startsWith('public/share/')
      || path.startsWith('consult/')
      || (path.startsWith('share/') && path.endsWith('.html'))
    ))
}

async function publishOutputGate() {
  if (!(await exists(DIST_DIR))) {
    return { status: 'SKIP', detail: '.vitepress/dist does not exist; run npm run docs:build && npm run publish:copy to verify generated output' }
  }

  const { missing, sourceErrors } = await checkStandalone()
  const problems = [...missing.map((path) => `missing ${relative(ROOT, path)}`), ...sourceErrors]
  if (problems.length) return { status: 'FAIL', detail: problems.join('; ') }
  return { status: 'PASS', detail: 'standalone publish outputs match canonical sources' }
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

async function main() {
  const lessons = await Promise.all((await markdownFiles(join(ROOT, 'lessons'))).map(evaluateArticle))
  const drafts = await Promise.all((await markdownFiles(join(ROOT, 'drafts', 'lessons'))).map(evaluateArticle))

  const sourceErrors = await checkSourceOwnership()
  const generatedOutputs = await trackedGeneratedOutputs()
  const publishGate = await publishOutputGate()

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
    `- Lessons 文章数: ${lessons.length + 1}`,
    `- Drafts 文章数: ${drafts.length}`,
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

  await writeFile(REPORT_FILE, report.join('\n'))
  console.log(`报告已生成: ${relative(ROOT, REPORT_FILE)}`)

  const failed = gates.some((gate) => gate.status === 'FAIL')
  if (failed) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
