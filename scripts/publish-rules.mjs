#!/usr/bin/env node
/**
 * Standalone publish rules for files that VitePress does not transform.
 *
 * This module is the source of truth for copying standalone HTML decks and
 * passthrough assets into .vitepress/dist. Keep GitHub Actions and local
 * verification pointed at this file instead of duplicating shell snippets.
 */

import { access, cp, mkdir, readdir, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const DIST_DIR = '.vitepress/dist'

const SHARE_EXTENSIONS = ['.html', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']
const AI_CODING_ASSET_DIRS = ['images', 'screenshots', 'assets']

export const publishRules = [
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
  },
  {
    name: 'consult pages',
    sourceDir: 'public/consult',
    outDir: 'consult',
    fileExtensions: ['.html'],
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

async function copyFileToDist(src, dest) {
  await mkdir(dirname(dest), { recursive: true })
  await cp(src, dest, { force: true })
}

async function copyDirToDist(src, dest) {
  await mkdir(dirname(dest), { recursive: true })
  await cp(src, dest, { recursive: true, force: true })
}

async function copyFlatFiles(rule, distDir, copied) {
  const sourceDir = resolve(rule.sourceDir)
  const outDir = outputPath(distDir, rule.outDir)
  await mkdir(outDir, { recursive: true })

  for (const entry of await entries(sourceDir)) {
    const src = join(sourceDir, entry.name)
    if (entry.isFile() && rule.fileExtensions.includes(extname(entry.name).toLowerCase())) {
      const dest = join(outDir, entry.name)
      await copyFileToDist(src, dest)
      copied.push(dest)
    }
    if (entry.isDirectory() && rule.copyChildDirs) {
      const dest = join(outDir, entry.name)
      await copyDirToDist(src, dest)
      copied.push(dest)
    }
  }
}

async function copyAiCodingPages(rule, distDir, copied) {
  const sourceDir = resolve(rule.sourceDir)
  for (const entry of await entries(sourceDir)) {
    if (!entry.isDirectory()) continue

    const srcDir = join(sourceDir, entry.name)
    const page = join(srcDir, rule.entryFile)
    if (!(await exists(page))) continue

    const destDir = outputPath(distDir, join(rule.outDir, entry.name))
    await copyFileToDist(page, join(destDir, rule.entryFile))
    copied.push(join(destDir, rule.entryFile))

    for (const assetDir of rule.assetDirs) {
      const srcAssetDir = join(srcDir, assetDir)
      if (!(await exists(srcAssetDir))) continue
      const destAssetDir = join(destDir, assetDir)
      await copyDirToDist(srcAssetDir, destAssetDir)
      copied.push(destAssetDir)
    }
  }
}

async function copyStandalone({ distDir = DIST_DIR } = {}) {
  const copied = []
  for (const rule of publishRules) {
    if (rule.entryFile) {
      await copyAiCodingPages(rule, distDir, copied)
    } else {
      await copyFlatFiles(rule, distDir, copied)
    }
  }
  return copied
}

async function collectExpected({ distDir = DIST_DIR } = {}) {
  const expected = []
  for (const rule of publishRules) {
    if (rule.entryFile) {
      const sourceDir = resolve(rule.sourceDir)
      for (const entry of await entries(sourceDir)) {
        if (!entry.isDirectory()) continue

        const srcDir = join(sourceDir, entry.name)
        const page = join(srcDir, rule.entryFile)
        if (!(await exists(page))) continue

        const destDir = outputPath(distDir, join(rule.outDir, entry.name))
        expected.push(join(destDir, rule.entryFile))

        for (const assetDir of rule.assetDirs) {
          const srcAssetDir = join(srcDir, assetDir)
          if (await exists(srcAssetDir)) expected.push(join(destDir, assetDir))
        }
      }
    } else {
      const sourceDir = resolve(rule.sourceDir)
      for (const entry of await entries(sourceDir)) {
        if (entry.isFile() && rule.fileExtensions.includes(extname(entry.name).toLowerCase())) {
          expected.push(outputPath(distDir, join(rule.outDir, entry.name)))
        }
        if (entry.isDirectory() && rule.copyChildDirs) {
          expected.push(outputPath(distDir, join(rule.outDir, entry.name)))
        }
      }
    }
  }
  return expected
}

async function checkStandalone({ distDir = DIST_DIR } = {}) {
  const expected = await collectExpected({ distDir })
  const missing = []
  for (const path of expected) {
    try {
      await stat(path)
    } catch (error) {
      if (error.code === 'ENOENT') missing.push(path)
      else throw error
    }
  }
  return { expected, missing }
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
  for (const path of paths) console.log(`  - ${relative(ROOT, path)}`)
}

async function main() {
  const { command, distDir } = parseArgs(process.argv)

  if (command === 'copy') {
    const copied = await copyStandalone({ distDir })
    printList('Copied standalone publish output', copied)
    return
  }

  if (command === 'check') {
    const { expected, missing } = await checkStandalone({ distDir })
    printList('Expected standalone publish output', expected)
    if (missing.length) {
      printList('Missing standalone publish output', missing)
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
