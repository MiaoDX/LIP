#!/usr/bin/env node

import assert from 'node:assert/strict'
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileAsync, withTempWorkspace } from './test-workspace.mjs'

await withTempWorkspace('lip-build-slidev-', async ({ originalRoot, tempRoot }) => {
  await mkdir(join('slides'), { recursive: true })
  await mkdir(join('.vitepress', 'dist', 'slides', 'slidev'), { recursive: true })
  await writeFile(join('.vitepress', 'dist', 'slides', 'slidev', 'stale.html'), 'stale')
  await writeFile(join('slides', 'slides.md'), '# Slidev deck\n')
  await writeFile(
    'fake-slidev.mjs',
    [
      '#!/usr/bin/env node',
      "import assert from 'node:assert/strict'",
      "import { mkdir, readFile, writeFile } from 'node:fs/promises'",
      "import { join } from 'node:path'",
      "const [, , command, entry, baseFlag, base, outFlag, out] = process.argv",
      "assert.equal(command, 'build')",
      "assert.equal(entry, join(process.cwd(), 'slides', 'slides.md'))",
      "assert.equal(baseFlag, '--base')",
      "assert.equal(base, '/LIP/slides/slidev/')",
      "assert.equal(outFlag, '--out')",
      "assert.equal(out, join(process.cwd(), '.vitepress', 'dist', 'slides', 'slidev'))",
      "await assert.rejects(readFile(join(out, 'stale.html'), 'utf8'), /ENOENT/)",
      "await mkdir(out, { recursive: true })",
      "await writeFile(join(out, 'index.html'), 'built')",
    ].join('\n')
  )
  await chmod('fake-slidev.mjs', 0o755)

  await execFileAsync('node', [join(originalRoot, 'scripts', 'build-slidev.mjs')], {
    env: {
      ...process.env,
      SLIDEV_CMD: join(tempRoot, 'fake-slidev.mjs'),
      NODE_OPTIONS: '',
    },
  })

  const output = await readFile(join('.vitepress', 'dist', 'slides', 'slidev', 'index.html'), 'utf8')
  assert.equal(output, 'built')
})

console.log('build-slidev tests passed')
