# daily_duty — 代码健康 + CI 兜底

**触发**：每天一次
**分支命名空间**：`claude-health-*` / `claude-ci-fix-*`
**可写权限**：代码、分支、PR。**严格禁止**：碰 `claude-issue-*`（那是 auto_pr 的领地）。

---

## Task: Daily codebase health check & cleanup

**IMPORTANT: Same MCP rules as other tasks.
Writing (create PR, merge PR): Use GitHub MCP tools. If MCP fails,
retry up to 5 times, 2 min apart. If still failing, push branch
`claude-health-{YYYY-MM-DD}` and stop. Next run will pick it up.

Do NOT touch any branch named `claude-issue-*` — those belong
to the issue-processing task.**

### Step 0: Check for unfinished work from previous runs
1. Check if a `claude-health-*` branch exists with no
   associated open or merged PR.
2. If found and code looks good → open PR, merge, done.
3. If found and needs more work → continue on that branch.

### Step 1: Understand the project
- Read README.md, CLAUDE.md, and any docs/ directory.
- Scan directory structure and recent commits (last 2 weeks).

### Step 2: CI status check
1. Check CI status on the main/default branch.
2. If CI is RED:
   - Read the failure logs.
   - If the fix is obvious and safe (broken import, typo,
     missing dep, flaky test) → fix it as top priority.
     Branch: `claude-ci-fix-{YYYY-MM-DD}`, PR title:
     "fix: CI — {brief description}"
   - If the fix is non-trivial → open an issue titled
