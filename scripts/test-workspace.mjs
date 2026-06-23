import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

export const execFileAsync = promisify(execFile)

export function repoModuleUrl(...pathParts) {
  return `${pathToFileURL(join(process.cwd(), ...pathParts)).href}?test=${Date.now()}`
}

export async function withTempWorkspace(prefix, run) {
  const originalRoot = process.cwd()
  const tempRoot = await mkdtemp(join(tmpdir(), prefix))
  const repoPath = (...pathParts) => join(originalRoot, ...pathParts)
  const moduleUrl = (...pathParts) => `${pathToFileURL(repoPath(...pathParts)).href}?test=${Date.now()}`

  try {
    process.chdir(tempRoot)
    return await run({ originalRoot, tempRoot, repoPath, moduleUrl })
  } finally {
    process.chdir(originalRoot)
    await rm(tempRoot, { recursive: true, force: true })
  }
}
