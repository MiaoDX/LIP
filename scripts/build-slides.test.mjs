#!/usr/bin/env node

import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const originalRoot = process.cwd()
const tempRoot = await mkdtemp(join(tmpdir(), 'lip-build-slides-'))
const moduleUrl = `${pathToFileURL(join(originalRoot, 'scripts', 'build-slides.mjs')).href}?test=${Date.now()}`

const { hasMarpFrontmatter, marpOutputSlug } = await import(moduleUrl)

assert.equal(hasMarpFrontmatter('---\nmarp: true\n---\n# Deck'), true)
assert.equal(hasMarpFrontmatter('---\nmarp: false\n---\n# Deck'), false)
assert.equal(marpOutputSlug('/tmp/slides/deck.md'), 'deck')

try {
  process.chdir(tempRoot)

  await mkdir('share', { recursive: true })
  await mkdir('site-map-dir', { recursive: true })
  await mkdir(join('.vitepress', 'dist', 'slides', 'marp'), { recursive: true })
  await writeFile(join('.vitepress', 'dist', 'slides', 'marp', 'stale.html'), 'stale')
  await writeFile(
    'site-map.mjs',
    [
      "export const marpScanDirs = ['share']",
    ].join('\n')
  )
  await writeFile(
    join('share', 'deck.md'),
    [
      '---',
      'marp: true',
      '---',
      '',
      '# Deck',
    ].join('\n')
  )
  await writeFile(
    'fake-marp.mjs',
    [
      '#!/usr/bin/env node',
      "import { copyFile, mkdir } from 'node:fs/promises'",
      "import { dirname } from 'node:path'",
      "const outIndex = process.argv.indexOf('-o')",
      "if (outIndex === -1) throw new Error('missing -o')",
      "await mkdir(dirname(process.argv[outIndex + 1]), { recursive: true })",
      "await copyFile(process.argv[2], process.argv[outIndex + 1])",
    ].join('\n')
  )
  await chmod('fake-marp.mjs', 0o755)

  await execFileAsync('node', [join(originalRoot, 'scripts', 'build-slides.mjs')], {
    env: {
      ...process.env,
      MARP_CMD: join(tempRoot, 'fake-marp.mjs'),
      NODE_OPTIONS: '',
    },
  })

  await assert.rejects(
    readFile(join('.vitepress', 'dist', 'slides', 'marp', 'stale.html'), 'utf8'),
    /ENOENT/
  )
  const output = await readFile(join('.vitepress', 'dist', 'slides', 'marp', 'deck.html'), 'utf8')
  assert.match(output, /Deck/)
} finally {
  process.chdir(originalRoot)
  await rm(tempRoot, { recursive: true, force: true })
}

console.log('build-slides tests passed')
