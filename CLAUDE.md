# CLAUDE.md

Repo-level notes for Claude Code sessions.

## Known gotchas

### GitHub MCP: review thread resolution

`mcp__github__resolve_review_thread` (and `pull_request_review_write` with `method=resolve_thread`) requires the thread's GraphQL node ID (`PRRT_xxx`).

**Problem:** The `mcp__github__pull_request_read` wrapper with `method=get_review_comments` returns thread metadata (`is_resolved`, `is_outdated`, `is_collapsed`, `comments`) but strips the thread-level `id` field. Comment node IDs (`PRRC_xxx`) are not interchangeable with thread IDs.

**Workaround:** When you need to resolve threads, list the addressed comments with their `discussion_r<comment_id>` deep-links and ask the user to resolve manually in the GitHub UI. Don't burn cycles trying to construct PRRT_ IDs from PRRC_ IDs — they're independent.

Discovered in PR [#13](https://github.com/MiaoDX/LIP/pull/13) (2026-04-25).
