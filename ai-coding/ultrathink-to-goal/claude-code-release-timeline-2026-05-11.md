# Claude Code release timeline snapshot — 2026-05-11 UTC

用途:今晚 deck 第 09 页的 Claude Code release 数字和 timeline 口径复查。

## Sources

- Official Claude Code changelog: <https://code.claude.com/docs/en/changelog>
- npm package page: <https://www.npmjs.com/package/@anthropic-ai/claude-code>
- npm registry commands run on 2026-05-12 Asia/Shanghai:
  - `npm view @anthropic-ai/claude-code version`
  - `npm view @anthropic-ai/claude-code dist-tags --json`
  - `npm view @anthropic-ai/claude-code time --json`

## Deck-safe headline

As of `2026-05-11T23:59:59Z`, the npm timeline contains **405 publish timestamps** for `@anthropic-ai/claude-code`.

- `latest`: `2.1.139`
- `next`: `2.1.139`
- `stable`: `2.1.126`
- npm package `modified`: `2026-05-11T18:43:30.297Z`
- latest publish timestamp: `2.1.139` at `2026-05-11T18:09:28.537Z`

## Era counts used in the slide

| Era | Version family | Publish timestamps |
|---|---:|---:|
| Vibe | `0.2.x` | 95 |
| SDD | `1.0.x` | 121 |
| Harness | `2.x` | 189 |
| Total | all | 405 |

## Milestone table used in the timeline

| Index | Version | npm publish timestamp | Deck label |
|---:|---|---|---|
| 25 | `0.2.44` | `2025-03-15T01:04:24.513Z` | ultrathink |
| 28 | `0.2.47` | `2025-03-18T01:42:37.884Z` | auto compact |
| 80 | `0.2.107` | `2025-05-09T16:15:03.847Z` | `@import` |
| 127 | `1.0.33` | `2025-06-23T20:31:06.405Z` | plan mode |
| 132 | `1.0.38` | `2025-06-30T20:29:03.323Z` | hooks |
| 135 | `1.0.41` | `2025-07-02T17:45:22.596Z` | subagents |
| 187 | `1.0.94` | `2025-08-27T20:13:08.204Z` | `/todos` |
| 233 | `2.0.20` | `2025-10-16T16:01:05.689Z` | skills |
| 243 | `2.0.30` | `2025-10-30T22:23:48.671Z` | subagents v2 |
| 379 | `2.1.107` | `2026-04-14T05:18:14.905Z` | routines |
| 396 | `2.1.126` | `2026-04-30T20:30:34.530Z` | npm stable / Codex `/goal` side marker neighborhood |
| 400 | `2.1.132` | `2026-05-06T19:10:04.541Z` | managed agents |
| 405 | `2.1.139` | `2026-05-11T18:09:28.537Z` | latest |

## May 6 to May 11 release-note summary

These are summaries of the official changelog, not verbatim release-note copies.

| Version | Changelog date | npm timestamp | Summary for lecture context |
|---|---|---|---|
| `2.1.131` | 2026-05-06 | `2026-05-06T07:41:53.401Z` | Small fix release: VS Code activation on Windows and Mantle endpoint auth. |
| `2.1.132` | 2026-05-06 | `2026-05-06T19:10:04.541Z` | Session/runtime hardening: session id env var, alternate-screen opt-out, image paste hints, graceful shutdown, resume/permission-mode fixes, terminal rendering fixes, MCP memory/auth fixes. Deck label: managed agents event day. |
| `2.1.133` | 2026-05-07 | `2026-05-07T20:19:32.227Z` | Worktree and enterprise settings improvements, effort metadata in hooks/env, memory-pressure cleanup, remote-control interrupt fixes, proxy/OAuth fixes, and subagent skill discovery fixes. |
| `2.1.136` | 2026-05-08 | `2026-05-08T16:30:41.957Z` | Auto-mode policy controls, enterprise OTEL survey flag, MCP/session/login/resume/plan-mode fixes, plus many terminal, plugin, CJK, usage, and renderer fixes. |
| `2.1.137` | 2026-05-09 | `2026-05-09T00:04:08.277Z` | VS Code extension activation fix on Windows. |
| `2.1.138` | 2026-05-09 | `2026-05-09T05:57:28.355Z` | Internal fixes. |
| `2.1.139` | 2026-05-11 | `2026-05-11T18:09:28.537Z` | Headline release for this update: agent view research preview, `/goal`, `/scroll-speed`, plugin detail inventory and token-cost display, transcript navigation, safer hook exec args, hook continue-on-block, MCP `CLAUDE_PROJECT_DIR`, compaction instruction preservation, `/mcp` reconnect reload, per-skill token estimates, plugin install retries, subagent request/OTEL identifiers, and multiple auth/session/rendering/MCP fixes. |

## Speaker phrasing

Tonight-safe version:

> 今天是 05-12,我把 Claude Code 这条线更新到 05-11 UTC: npm timeline 上已经是 405 个 publish timestamp,latest 是 2.1.139,stable tag 还是 2.1.126。05-06 的 Managed Agents 不是终点;05-11 的 2.1.139 又把 agent view 和 `/goal` 这类入口放到了 Claude Code 自己的 release 线里。

Avoid saying "281 versions" or "through 2026-05-06" for the main timeline.
