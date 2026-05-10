#!/usr/bin/env node

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const originalRoot = process.cwd()
const tempRoot = await mkdtemp(join(tmpdir(), 'lip-publish-rules-'))
const moduleUrl = `${pathToFileURL(join(originalRoot, 'scripts', 'publish-rules.mjs')).href}?test=${Date.now()}`

try {
  process.chdir(tempRoot)

  await mkdir('presentations/assets', { recursive: true })
  await writeFile('presentations/assets/hero.png', 'hero')
  await writeFile('presentations/assets/small.png', 'small')
  await writeFile('presentations/assets/theme.css', 'theme')
  await writeFile(
    'presentations/demo.html',
    [
      '<style>@import "assets/theme.css"; .hero { background: url("assets/hero.png"); }</style>',
      '<img srcset="assets/small.png 1x, assets/large.png 2x" src="assets/hero.png">',
    ].join('\n')
  )

  const publishRules = await import(moduleUrl)

  const sourceErrors = await publishRules.checkSourceOwnership()
  assert(
    sourceErrors.some((error) => error.includes('assets/large.png')),
    'source ownership should detect missing srcset assets'
  )

  await writeFile('presentations/assets/large.png', 'large')
  assert.deepEqual(await publishRules.checkSourceOwnership(), [])

  await publishRules.copyStandalone({ distDir: 'dist' })
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
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('publish-rules tests passed')
