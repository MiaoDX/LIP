#!/usr/bin/env node

import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const distDir = join('.vitepress', 'dist')
const hiddenDistDir = join('.vitepress', 'dist.__quality_check_test')
const reportFile = '.quality-report.md'

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

async function exists(path) {
  try {
    await access(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

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
  assert.match(report, /\| Built standalone publish output \| SKIP \|/)
  assert.match(report, /\| Public operational doc boundary \| SKIP \|/)
} finally {
  if (hidDist) await rename(hiddenDistDir, distDir)
  if (originalReport !== null) await writeFile(reportFile, originalReport)
}

console.log('quality-check tests passed')
