#!/usr/bin/env node
/**
 * Build the Slidev deck into the VitePress dist tree.
 *
 * Slidev resolves relative --out paths from the deck directory, not always
 * from the package root. Keep the output path absolute here so local and CI
 * builds use the same destination.
 */

import { rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { runCommand } from './command-runner.mjs'
import { siteBase } from '../site-map.mjs'

const ROOT = process.cwd()
const ENTRY = join(ROOT, 'slides', 'slides.md')
const OUT = join(ROOT, '.vitepress', 'dist', 'slides', 'slidev')
const BASE = `${siteBase.replace(/\/$/, '')}/slides/slidev/`
const SLIDEV_CMD = process.env.SLIDEV_CMD || 'npx'
const SLIDEV_ARGS = process.env.SLIDEV_CMD ? [] : ['slidev']

async function main() {
  console.log(`Building Slidev deck -> ${relative(ROOT, OUT)}`)
  await rm(OUT, { recursive: true, force: true })
  await runCommand(SLIDEV_CMD, [...SLIDEV_ARGS, 'build', ENTRY, '--base', BASE, '--out', OUT])
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
