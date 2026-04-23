# auto_pr — 主力 routine

**触发**：每小时一次
**分支命名空间**：`claude-issue-*`
**可写权限**：代码、分支、PR、issue comment / close

---

## Task: Process next open issue

**IMPORTANT: This task must create and merge PRs to be useful.

Reading issues: Use GitHub MCP tools if available. If not, fall back to web-scraping or local scripts.

Writing (create PR, merge PR, close issue, leave comments): Use GitHub MCP tools. If MCP fails at any write step, wait 2 minutes and retry, up to 5 retries. If still failing after all retries, leave a comment on the issue (via any method that works — MCP, API script, etc.):

   "[auto-pr] Work done on branch `claude-issue-{number}`, but could
   not create/merge PR due to MCP unavailability. Next run: please
   pick this up."

Then stop. Do NOT discard the work.**

### Step 0: Understand the project

- Read README.md, CLAUDE.md, and any docs/ directory.
- Scan directory structure, recent commits (last 2 weeks),
  and open PRs.

### Step 1: Check for unfinished work from previous runs

1. Check if a branch named `claude-issue-*` exists with no
   associated open or merged PR.
2. If found, review the code on that branch:
   - If it looks correct and tests pass → open a PR, merge,
     close issue. Done for this run.
   - If it needs fixes → continue working on that branch.
3. Check for issues with an "[auto-pr]" comment from a
   previous run. Treat these as the target issue.

### Step 2: Select issue (if no unfinished work)

1. Fetch all open issues.
2. Skip any issue with label "blocked", "wontfix", or "deferred".
3. Skip any issue where I left a "[deferred]" comment.
4. Prioritize in this order:
   a. "priority:high" → oldest first
   b. "good-first-issue" with no linked PR → pick it
   c. "priority:medium" → oldest first
   d. "priority:low" → oldest first
   e. No priority label → skip (wait for labeler to process it)
5. For the selected issue, check dependencies:
   - If body mentions "depends on #XX" and #XX is still open → skip,
     try next candidate.
6. Check linked PRs:
   - If a merged PR fully resolves it → close issue, move to next.
   - If a partial PR exists with remaining-work comment → this is
     the target (continue where left off).
   - If an open PR already exists for this issue → skip.
7. Stop at the first actionable issue.

### Step 3: Implement

1. Branch name: `claude-issue-{number}` (always this convention).
2. Implement the fix with minimal, focused changes.
3. Cleanup pass: remove dead code, simplify conditionals,
   improve naming. Do NOT touch unrelated code.
4. Run existing tests/linters if configured. Fix breakage.
5. Push the branch.

### Step 4: Create and merge PR

1. Open PR: "fix: #{number} — {issue_title}", linking the issue.
2. If MCP fails → retry up to 5 times, 2 min apart.
3. If PR created → self-assess:
   - FULLY RESOLVED → merge PR, close issue.
   - PARTIALLY DONE → merge PR, comment on issue with
     done/remaining checklist. Do NOT close.
   - DIMINISHING RETURNS (2+ partial PRs, remaining work harder)
     → comment "[deferred] Remaining scope requires manual
     intervention: {reason}" and stop.
4. If PR could NOT be created after retries → leave "[auto-pr]"
   comment on the issue and stop. Branch stays pushed for
   next run to pick up.

### Step 5: Exactly ONE issue per run.
