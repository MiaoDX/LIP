import { access, readdir } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, relative } from 'node:path'

export async function exists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function entries(path) {
  try {
    return await readdir(path, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

export async function walkFiles(dir, { includeFile, skipDirs } = {}) {
  const files = []
  await collectFiles(dir, files, { includeFile, skipDirs })
  return files
}

export async function walkMarkdownFiles(dir, options = {}) {
  const includeFile = options.includeFile
  return walkFiles(dir, {
    ...options,
    includeFile: (file) => file.endsWith('.md') && (!includeFile || includeFile(file)),
  })
}

export async function walkRelativeFiles(dir, options = {}) {
  const files = await walkFiles(dir, options)
  return files.map((file) => relative(dir, file)).sort()
}

async function collectFiles(dir, files, { includeFile, skipDirs }) {
  for (const entry of await entries(dir)) {
    if (entry.isDirectory()) {
      if (hasSkipDir(skipDirs, entry.name)) continue
      await collectFiles(join(dir, entry.name), files, { includeFile, skipDirs })
      continue
    }

    const path = join(dir, entry.name)
    if (entry.isFile() && (!includeFile || includeFile(path))) files.push(path)
  }
}

function hasSkipDir(skipDirs, dir) {
  if (!skipDirs) return false
  return skipDirs.has ? skipDirs.has(dir) : skipDirs.includes(dir)
}
