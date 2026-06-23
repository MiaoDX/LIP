#!/usr/bin/env node

import assert from 'node:assert/strict'
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileAsync, repoModuleUrl, withTempWorkspace } from './test-workspace.mjs'

const moduleUrl = repoModuleUrl('scripts', 'build-slides.mjs')

const { hasMarpFrontmatter, marpOutputSlug } = await import(moduleUrl)

assert.equal(hasMarpFrontmatter('---\nmarp: true\n---\n# Deck'), true)
assert.equal(hasMarpFrontmatter('---\nmarp: false\n---\n# Deck'), false)
assert.equal(marpOutputSlug('/tmp/slides/deck.md'), 'deck')

await withTempWorkspace('lip-build-slides-', async ({ originalRoot, tempRoot }) => {
  await mkdir('share', { recursive: true })
  await mkdir(join('.vitepress', 'dist', 'slides', 'marp'), { recursive: true })
  await writeFile(join('.vitepress', 'dist', 'slides', 'marp', 'stale.html'), 'stale')
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
})

console.log('build-slides tests passed')
