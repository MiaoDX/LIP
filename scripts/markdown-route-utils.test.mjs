#!/usr/bin/env node

import assert from 'node:assert/strict'
import {
  cleanLink,
  isExternalLink,
  markdownLinks,
  routeToMarkdownFile,
  routeToMarkdownFileCandidates,
  trimBase,
} from './markdown-route-utils.mjs'

assert.deepEqual(
  markdownLinks([
    '[Guide](/resources/config-guide)',
    '![Screenshot](./images/demo.png)',
    '[Titled](/share/ "Share")',
  ].join('\n')),
  ['/resources/config-guide', './images/demo.png', '/share/']
)

assert.equal(cleanLink('/drafts/?preview=1#queue'), '/drafts/')
assert.equal(trimBase('/LIP/drafts/', '/LIP/'), '/drafts/')
assert.equal(trimBase('/drafts/', '/LIP/'), '/drafts/')

assert.equal(routeToMarkdownFile('/LIP/', { siteBase: '/LIP/' }), 'index.md')
assert.equal(routeToMarkdownFile('/resources/config-guide'), 'resources/config-guide.md')
assert.deepEqual(routeToMarkdownFileCandidates('/drafts'), ['drafts.md', 'drafts/index.md'])
assert.deepEqual(routeToMarkdownFileCandidates('/drafts/'), ['drafts/index.md'])
assert.deepEqual(routeToMarkdownFileCandidates('/images/demo.png'), [])

assert.equal(isExternalLink('https://example.com'), true)
assert.equal(isExternalLink('mailto:hello@example.com'), true)
assert.equal(isExternalLink('#section'), true)
assert.equal(isExternalLink('/share/'), false)

console.log('markdown-route-utils tests passed')
