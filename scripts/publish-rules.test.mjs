#!/usr/bin/env node

import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const originalRoot = process.cwd()
const tempRoot = await mkdtemp(join(tmpdir(), 'lip-publish-rules-'))
const moduleUrl = `${pathToFileURL(join(originalRoot, 'scripts', 'publish-rules.mjs')).href}?test=${Date.now()}`

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

try {
  process.chdir(tempRoot)

  await mkdir('presentations/assets', { recursive: true })
  await writeFile('presentations/assets/hero.png', 'hero')
  await writeFile('presentations/assets/small.png', 'small')
  await writeFile(
    'presentations/assets/theme.css',
    [
      '@import "nested.css";',
      '.hero { background: url("css-hero.png"); }',
    ].join('\n')
  )
  await writeFile(
    'presentations/demo.html',
    [
      '<style>@import "assets/theme.css"; .hero { background: url("assets/hero.png"); }</style>',
      '<img srcset="assets/small.png 1x, assets/large.png 2x" src="assets/hero.png">',
    ].join('\n')
  )

  const publishRules = await import(moduleUrl)

  await mkdir('share/nested', { recursive: true })
  await writeFile('share/nested/generated.html', '<p>generated</p>')
  await mkdir('public/images/demo', { recursive: true })
  await writeFile('public/images/demo/README.md', '# Maintainer note')

  const sourceErrors = await publishRules.checkSourceOwnership()
  assert(
    sourceErrors.some((error) => error.includes('share/nested/generated.html')),
    'source ownership should detect nested generated share HTML'
  )
  assert(
    sourceErrors.some((error) => error.includes('public/images/demo/README.md')),
    'source ownership should detect public markdown passthrough notes'
  )
  assert(
    sourceErrors.some((error) => error.includes('assets/large.png')),
    'source ownership should detect missing srcset assets'
  )
  assert(
    sourceErrors.some((error) => error.includes('assets/theme.css references missing local asset nested.css')),
    'source ownership should detect missing CSS imports'
  )
  assert(
    sourceErrors.some((error) => error.includes('assets/theme.css references missing local asset css-hero.png')),
    'source ownership should detect missing CSS url assets'
  )

  await writeFile('presentations/inline-raster.html', '<img src="data:image/png;base64,AAAA">')
  assert(
    (await publishRules.checkSourceOwnership()).some((error) => error.includes('presentations/inline-raster.html inlines a raster data URI')),
    'source ownership should detect inlined raster data URIs'
  )

  await writeFile('presentations/root-asset.html', '<svg><image href="/images/demo.png"></image></svg>')
  assert(
    (await publishRules.checkSourceOwnership()).some((error) => error.includes('presentations/root-asset.html uses root-absolute standalone asset /images/demo.png')),
    'source ownership should detect root-absolute HTML asset refs'
  )

  await writeFile('presentations/assets/root.css', '.hero { background: url("/images/demo.png"); }')
  assert(
    (await publishRules.checkSourceOwnership()).some((error) => error.includes('presentations/assets/root.css uses root-absolute standalone asset /images/demo.png')),
    'source ownership should detect root-absolute CSS asset refs'
  )

  await writeFile('presentations/placeholder.html', '<a href="#">Article Title Placeholder</a><p>Summary placeholder...</p>')
  const placeholderErrors = await publishRules.checkSourceOwnership()
  assert(
    placeholderErrors.some((error) => error.includes('presentations/placeholder.html uses placeholder href="#"')),
    'source ownership should detect placeholder standalone links'
  )
  assert(
    placeholderErrors.some((error) => error.includes('presentations/placeholder.html contains placeholder text "Article Title Placeholder"')),
    'source ownership should detect placeholder standalone text'
  )

  await writeFile('presentations/assets/large.png', 'large')
  await writeFile('presentations/assets/nested.css', 'nested')
  await writeFile('presentations/assets/css-hero.png', 'css hero')
  await rm('presentations/inline-raster.html')
  await rm('presentations/root-asset.html')
  await rm('presentations/placeholder.html')
  await rm('presentations/assets/root.css')
  await rm('share', { recursive: true, force: true })
  await rm('public', { recursive: true, force: true })
  await mkdir('public/consult/pitch-assets', { recursive: true })
  await writeFile('public/consult/pitch-assets/shot.png', 'consult shot')
  await writeFile('public/consult/pitch.html', '<img src="pitch-assets/shot.png">')
  assert.deepEqual(await publishRules.checkSourceOwnership(), [])

  await publishRules.copyStandalone({ distDir: 'dist' })
  assert.equal(await exists('dist/consult/pitch.html'), true, 'consult pages should publish')
  assert.equal(await exists('dist/consult/pitch-assets/shot.png'), true, 'consult asset dirs should publish')
  let check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert.deepEqual(check.missing, [])
  assert.deepEqual(check.stale, [])

  await writeFile(
    'presentations/demo.html',
    [
      '<style>@import "assets/theme.css"; .hero { background: url("assets/hero.png"); }</style>',
      '<img srcset="assets/small.png 1x, assets/large.png 2x" src="assets/hero.png">',
      '<p>changed</p>',
    ].join('\n')
  )
  check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert(
    check.stale.some((error) => error.includes('dist/share/demo.html differs from presentations/demo.html')),
    'standalone check should detect stale copied files'
  )

  await publishRules.copyStandalone({ distDir: 'dist' })
  await writeFile('dist/share/assets/orphan.png', 'orphan')
  check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert(
    check.stale.some((error) => error.includes('dist/share/assets/orphan.png is not in presentations/assets')),
    'standalone check should detect orphaned copied assets'
  )

  await publishRules.copyStandalone({ distDir: 'dist' })
  check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert.deepEqual(check.stale, [], 'standalone copy should remove orphaned copied assets')

  await writeFile('dist/share/index.html', 'vitepress-generated neighbor')
  await rm('presentations/demo.html')
  check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert(
    check.stale.some((error) => error.includes('dist/share/demo.html is no longer published from a standalone source')),
    'standalone check should detect removed source files from the copy manifest'
  )

  await publishRules.copyStandalone({ distDir: 'dist' })
  assert.equal(await exists('dist/share/demo.html'), false, 'standalone copy should remove files no longer in source')
  assert.equal(await exists('dist/share/index.html'), true, 'standalone copy should not remove non-standalone neighbors')
  check = await publishRules.checkStandalone({ distDir: 'dist' })
  assert.deepEqual(check.stale, [])
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('publish-rules tests passed')
