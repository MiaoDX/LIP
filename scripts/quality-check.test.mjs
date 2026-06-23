#!/usr/bin/env node

import assert from 'node:assert/strict'
import { access, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { exists } from './file-utils.mjs'
import { execFileAsync, repoModuleUrl } from './test-workspace.mjs'

const moduleUrl = repoModuleUrl('scripts', 'quality-check.mjs')
const distDir = join('.vitepress', 'dist')
const hiddenDistDir = join('.vitepress', 'dist.__quality_check_test')
const reportFile = '.quality-report.md'

const { wordCount } = await import(moduleUrl)

assert.equal(wordCount('跨实例协作模式'), 4)
assert.equal(wordCount('Gateway 弹性架构：三层防护设计'), 6)
assert.equal(wordCount(''), 0)

try {
  await access(hiddenDistDir)
  throw new Error(`${hiddenDistDir} already exists`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

let originalReport = null
try {
  originalReport = await readFile(reportFile, 'utf8')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

let hidDist = false

try {
  if (await exists(distDir)) {
    await mkdir(dirname(hiddenDistDir), { recursive: true })
    await rename(distDir, hiddenDistDir)
    hidDist = true
  }

  let result
  try {
    await execFileAsync('node', ['scripts/quality-check.mjs'])
    result = { exitCode: 0 }
  } catch (error) {
    result = {
      exitCode: error.code,
      stdout: error.stdout,
      stderr: error.stderr,
    }
  }

  const report = await readFile(reportFile, 'utf8')

  assert.equal(result.exitCode, 1)
  assert.match(report, /\| 文章 \| 词数 \| 标题 \| 代码块 \| 清单 \| 评分 \| 等级 \|/)
  assert.match(report, /\| Built standalone publish output \| SKIP \|/)
  assert.match(report, /\| Public operational doc boundary \| SKIP \|/)

  await mkdir(join(distDir, 'docs', 'status', 'active'), { recursive: true })
  await writeFile(join(distDir, 'docs', 'status', 'active', 'capsule.html'), '<h1>private</h1>')

  try {
    await execFileAsync('node', ['scripts/quality-check.mjs'])
  } catch {
    // Expected: the fake dist tree contains operational output.
  }

  const leakReport = await readFile(reportFile, 'utf8')
  assert.match(leakReport, /\| Public operational doc boundary \| FAIL \| docs\/status should stay agent\/process-only, not public site output \|/)
} finally {
  await rm(distDir, { recursive: true, force: true })
  if (hidDist) await rename(hiddenDistDir, distDir)
  if (originalReport !== null) await writeFile(reportFile, originalReport)
}

console.log('quality-check tests passed')
