#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const originalRoot = process.cwd()
const tempRoot = await mkdtemp(join(tmpdir(), 'lip-link-check-'))
const moduleUrl = `${pathToFileURL(join(originalRoot, 'scripts', 'link-check.mjs')).href}?test=${Date.now()}`

try {
  process.chdir(tempRoot)

  await mkdir('share', { recursive: true })
  await writeFile('share/source-backed.md', '# Source-backed route')

  await mkdir('slides', { recursive: true })
  await writeFile('slides/slides.md', '# Slidev source')
  await writeFile(
    'slides/marp-deck.md',
    [
      '---',
      'marp: true',
      '---',
      '',
      '# Marp deck',
    ].join('\n')
  )
  await writeFile(
    'slides/index.md',
    [
      '[Slidev](/slides/slidev/)',
      '[Marp](/slides/marp/marp-deck.html)',
      '[Source-backed HTML route](/share/source-backed.html)',
    ].join('\n')
  )

  const { checkScopedLinks } = await import(moduleUrl)
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['slides/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
  }), [])

  await writeFile('slides/index.md', '[Missing source-backed HTML route](/share/missing.html)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['slides/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
  }), ['slides/index.md references missing local link /share/missing.html'])
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('link-check tests passed')
