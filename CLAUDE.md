# CLAUDE.md

Claude Code repo notes.

Read `AGENTS.md` first; it is the common repo guidance. Keep this file limited to Claude-specific deltas.

## GitHub MCP: review thread resolution

`mcp__github__resolve_review_thread` and `pull_request_review_write` with `method=resolve_thread` require the review thread's GraphQL node ID (`PRRT_xxx`).

The `mcp__github__pull_request_read` wrapper with `method=get_review_comments` returns thread metadata (`is_resolved`, `is_outdated`, `is_collapsed`, `comments`) but strips the thread-level `id` field. Comment node IDs (`PRRC_xxx`) are not interchangeable with thread IDs.

When you need to resolve threads and only have review comments, list the addressed comments with their `discussion_r<comment_id>` deep links and ask the user to resolve them manually in the GitHub UI. Do not try to construct `PRRT_` IDs from `PRRC_` IDs.

Discovered in PR [#13](https://github.com/MiaoDX/LIP/pull/13) on 2026-04-25.
