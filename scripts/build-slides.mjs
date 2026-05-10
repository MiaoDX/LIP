#!/usr/bin/env node
/**
 * LIP build-slides — scans the repo for markdown files with `marp: true`
 * in frontmatter, runs marp CLI on each to produce .html + .pdf in
 * .vitepress/dist/slides/marp/<slug>.{html,pdf}
 *
 * Registers themes/lip-ink.css as an opt-in theme (files pick it up via
 * `theme: lip-ink` in frontmatter). Existing decks that declare their own
 * theme (e.g. `theme: uncover`) keep rendering with that theme.
 */

import { readdir, readFile, mkdir } from 'node:fs/promises'
import { join, relative, basename, extname } from 'node:path'
import { spawn } from 'node:child_process'
import { marpScanDirs } from '../site-map.mjs'

const ROOT = process.cwd()
const OUT = join(ROOT, '.vitepress', 'dist', 'slides', 'marp')
const THEME = join(ROOT, 'themes', 'lip-ink.css')
const BUILD_PDF = process.env.MARP_PDF === '1'

const SCAN_DIRS = marpScanDirs
const SKIP_DIRS = new Set(['node_modules', '.vitepress', '.git', 'dist'])

async function walk(dir, out = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) await walk(p, out)
    else if (e.isFile() && p.endsWith('.md')) out.push(p)
  }
  return out
}

function hasMarp(src) {
  const fm = src.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!fm) return false
  return /^\s*marp:\s*true\s*$/m.test(fm[1])
}

function slugOf(file) {
  return basename(file, extname(file))
}

function assertUniqueSlugs(files) {
  const filesBySlug = new Map()
  for (const file of files) {
    const slug = slugOf(file)
    const group = filesBySlug.get(slug) || []
    group.push(file)
    filesBySlug.set(slug, group)
  }

  const duplicates = [...filesBySlug.entries()].filter(([, files]) => files.length > 1)
  if (!duplicates.length) return

  const lines = ['Marp output slug collision detected:']
  for (const [slug, files] of duplicates) {
    lines.push(`- ${slug}.html`)
    for (const file of files) lines.push(`  - ${relative(ROOT, file)}`)
  }
  throw new Error(lines.join('\n'))
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))
    )
  })
}

async function main() {
  await mkdir(OUT, { recursive: true })

  const all = []
  for (const d of SCAN_DIRS) await walk(join(ROOT, d), all)

  const marpFiles = []
  for (const f of all) {
    const src = await readFile(f, 'utf8')
    if (hasMarp(src)) marpFiles.push(f)
  }

  if (!marpFiles.length) {
    console.log('No files with `marp: true` found. Nothing to build.')
    return
  }
  assertUniqueSlugs(marpFiles)

  const outs = BUILD_PDF ? '{html,pdf}' : 'html'
  console.log(
    `Building ${marpFiles.length} slide deck(s) → ${relative(ROOT, OUT)} [${outs}]`
  )
  for (const f of marpFiles) {
    const slug = slugOf(f)
    const html = join(OUT, slug + '.html')
    console.log(`  · ${relative(ROOT, f)} → ${slug}.${outs}`)
    await run('npx', [
      'marp',
      f,
      '--theme-set',
      THEME,
      '--html',
      '--allow-local-files',
      '-o',
      html,
    ])
    if (BUILD_PDF) {
      const pdf = join(OUT, slug + '.pdf')
      await run('npx', [
        'marp',
        f,
        '--theme-set',
        THEME,
        '--pdf',
        '--allow-local-files',
        '-o',
        pdf,
      ])
    }
  }
  console.log('✓ Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
