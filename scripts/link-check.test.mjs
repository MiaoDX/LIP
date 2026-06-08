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
  await mkdir('ai-coding/standalone-deck', { recursive: true })
  await writeFile('ai-coding/standalone-deck/index.html', '<h1>Standalone deck</h1>')

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
    indexCoverageRules: [],
  }), ['slides/index.md references missing local link /share/missing.html'])

  await mkdir('proposals', { recursive: true })
  await writeFile('README.md', '[Missing directory route](proposals/)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['README.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['README.md references missing local link proposals/'])

  await writeFile('proposals/index.md', '# Proposals')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['README.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await writeFile('ai-coding/index.md', '[Standalone deck](standalone-deck/)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['ai-coding/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await mkdir('bestpractice', { recursive: true })
  await writeFile('bestpractice/index.md', '[Visible](/bestpractice/visible)')
  await writeFile('bestpractice/visible.md', '# Visible')
  await writeFile('bestpractice/hidden.md', '# Hidden')
  await writeFile('bestpractice/panorama.md', '# Support page')

  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), ['bestpractice/index.md does not link current article /bestpractice/hidden'])

  await writeFile('bestpractice/index.md', '[Visible](/bestpractice/visible) [Hidden](/bestpractice/hidden)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    scopedConfigFiles: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), [])
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('link-check tests passed')
