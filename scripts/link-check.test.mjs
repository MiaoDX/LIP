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

  await mkdir('slides', { recursive: true })
  await writeFile('slides/slides.md', '# Slidev source')
  await writeFile('slides/index.md', '[Slidev](/slides/slidev/)')

  const { checkScopedLinks } = await import(moduleUrl)
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['slides/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
  }), [])
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('link-check tests passed')
