#!/usr/bin/env node

import assert from 'node:assert/strict'
import {
  cleanLink,
  frontmatterLinks,
  isExternalLink,
  markdownLinks,
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

assert.deepEqual(
  markdownLinks([
    '[Live](/live)',
    '',
    '```markdown',
    '[Example](/missing-example)',
    '```',
    '',
    'Inline code: `[Example](/missing-inline)`',
    '',
    '[Also live](/also-live)',
  ].join('\n')),
  ['/live', '/also-live']
)

assert.deepEqual(
  frontmatterLinks([
    '---',
    'hero:',
    '  actions:',
    '    - text: Read',
    '      link: /now/2026-04',
    'features:',
    '  - title: Share',
    '    link: "/share/"',
    'canonical:',
    "  url: 'https://example.com/page'",
    '---',
    '',
    '[Body](/body)',
  ].join('\n')),
  ['/now/2026-04', '/share/', 'https://example.com/page']
)

assert.equal(cleanLink('/drafts/?preview=1#queue'), '/drafts/')
assert.equal(trimBase('/LIP/drafts/', '/LIP/'), '/drafts/')
assert.equal(trimBase('/drafts/', '/LIP/'), '/drafts/')

assert.deepEqual(routeToMarkdownFileCandidates('/drafts'), ['drafts.md'])
assert.deepEqual(routeToMarkdownFileCandidates('/drafts/'), ['drafts/index.md'])
assert.deepEqual(routeToMarkdownFileCandidates('/images/demo.png'), [])

assert.equal(isExternalLink('https://example.com'), true)
assert.equal(isExternalLink('mailto:hello@example.com'), true)
assert.equal(isExternalLink('#section'), true)
assert.equal(isExternalLink('/share/'), false)

console.log('markdown-route-utils tests passed')
