#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { execFileAsync, withTempWorkspace } from './test-workspace.mjs'

await withTempWorkspace('lip-link-check-', async ({ moduleUrl }) => {
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

  const { checkScopedLinks } = await import(moduleUrl('scripts', 'link-check.mjs'))
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['slides/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
  }), [])

  await writeFile('slides/index.md', '[Missing source-backed HTML route](/share/missing.html)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['slides/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['slides/index.md references missing local link /share/missing.html'])

  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: [],
    configuredRouteLinks: ['/share/source-backed', '/share/missing-configured'],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['site-map.mjs references missing public route /share/missing-configured'])

  await mkdir('proposals', { recursive: true })
  await writeFile('README.md', '[Missing directory route](proposals/)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['README.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['README.md references missing local link proposals/'])

  await writeFile('proposals/index.md', '# Proposals')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['README.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await writeFile('README.md', '[Slashless directory route](/proposals)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['README.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['README.md references missing local link /proposals'])

  await writeFile(
    'home.md',
    [
      '---',
      'hero:',
      '  actions:',
      '    - text: Read',
      '      link: /missing-frontmatter-route',
      'features:',
      '  - title: Share',
      '    link: /share/source-backed',
      '---',
      '',
      '# Home',
    ].join('\n')
  )
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['home.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['home.md references missing local link /missing-frontmatter-route'])

  await writeFile('missing-frontmatter-route.md', '# Now valid')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['home.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await writeFile('ai-coding/index.md', '[Standalone deck](standalone-deck/)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['ai-coding/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await mkdir('discussions', { recursive: true })
  await writeFile('discussions/archive.md', [
    '```markdown',
    '[Archived example](/missing-example)',
    '```',
    '',
    '[Missing live link](/missing-live)',
  ].join('\n'))
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['discussions/archive.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['discussions/archive.md references missing local link /missing-live'])

  await writeFile('discussions/archive.md', [
    '```markdown',
    '[Archived example](/missing-example)',
    '```',
    '',
    '[Existing live link](/share/source-backed)',
  ].join('\n'))
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['discussions/archive.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), [])

  await mkdir('docs/plans', { recursive: true })
  await mkdir('docs/status/active', { recursive: true })
  await writeFile('README.md', '# Root')
  await writeFile('docs/plans/private.md', '[Missing private link](/missing-private)')
  await writeFile('docs/status/active/private.md', '[Missing private status link](/missing-status-private)')
  await writeFile('public-sidecar.md', '[Missing public link](/missing-public)')
  await execFileAsync('git', ['init'])
  await execFileAsync('git', ['add', 'README.md', 'docs/plans/private.md', 'docs/status/active/private.md', 'public-sidecar.md'])
  assert.deepEqual(await checkScopedLinks({
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [],
  }), ['public-sidecar.md references missing local link /missing-public'])

  await mkdir('bestpractice', { recursive: true })
  await writeFile('bestpractice/index.md', '[Visible](/bestpractice/visible)')
  await writeFile('bestpractice/visible.md', '# Visible')
  await writeFile('bestpractice/hidden.md', '# Hidden')
  await writeFile('bestpractice/panorama.md', '# Support page')
  await mkdir('bestpractice/weekly', { recursive: true })
  await writeFile('bestpractice/weekly/index.md', '# Weekly')

  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), [
    'bestpractice/index.md does not link current article /bestpractice/hidden',
    'bestpractice/index.md does not link current article /bestpractice/weekly',
  ])

  await writeFile('bestpractice/index.md', '[Visible](/bestpractice/visible) [Hidden](/bestpractice/hidden) [Weekly](/bestpractice/weekly/)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), [])

  await writeFile('bestpractice/visible.md', '[Broken related article](/bestpractice/missing-related)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), ['bestpractice/visible.md references missing local link /bestpractice/missing-related'])

  await writeFile('bestpractice/visible.md', '[Existing related article](/bestpractice/hidden)')
  assert.deepEqual(await checkScopedLinks({
    scopedMarkdownFiles: ['bestpractice/index.md'],
    configuredRouteLinks: [],
    scopedIndexLinkFiles: [],
    indexCoverageRules: [{
      indexFile: 'bestpractice/index.md',
      contentDir: 'bestpractice',
      excludeSlugs: ['index', 'panorama'],
    }],
  }), [])
})

console.log('link-check tests passed')
