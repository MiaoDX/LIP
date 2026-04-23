# pr_again — 孤儿分支救援

**触发**：每天一次
**分支命名空间**：`claude-cleanup-*`（仅用于 rebase / 小修）
**可写权限**：PR、comment。**不主动写新代码**。

---

## Task: Rescue failed agent branches

**IMPORTANT: This task creates PRs and merges them. Nothing else. It does NOT write new code or fix bugs.

Writing (create PR, merge PR, close issue, leave comments): Use GitHub MCP tools. If MCP fails, retry up to 5 times, 2 min apart. If still failing after retries, stop. This task's entire purpose is MCP writes — no point continuing without them.**

### Step 1: Find orphaned agent branches

1. List all remote branches matching:
   - `claude-issue-*`
   - `claude-health-*`
   - `claude-cleanup-*`
   - `claude-ci-fix-*`
2. For each branch, check if an open or merged PR exists.
3. Collect branches with NO associated PR — these are orphans.
4. If zero orphans found → stop, nothing to do.

### Step 2: Evaluate each orphan

For each orphaned branch:

1. Diff against main. Read the changes.
2. Check: does it have merge conflicts with main?
   - If yes and resolution is obvious → rebase.
   - If not obvious → skip this branch, leave a comment on
     the related issue: "[conflict] Branch `{name}` needs
     manual rebase."
3. Run tests and linters against the branch.
   - All pass → proceed.
   - Failures → if fix is trivial (< 5 lines), fix and commit.
     Otherwise skip, comment on issue: "[ci-fail] Branch
     `{name}` has test failures: {summary}."

### Step 3: Open and merge PR

1. Identify the related issue from the branch name
   (e.g. `claude-issue-42` → #42).
2. Open PR: "fix: #{number} — {issue title}"
   Link the issue in the body.
3. Wait for CI. Poll every 2 min, up to 15 min.
   - Green → merge.
   - Red → attempt fix (max 2 tries), otherwise leave
     PR open with "[ci-fail]" comment.
   - Pending after 15 min → leave open with "[ci-pending]".
4. If merged and issue is fully resolved → close issue.
5. If merged but only partial → comment on issue with
   done/remaining checklist.
6. Remove any "[auto-pr]" comments from the issue left
   by previous failed runs.

### Step 4: Process ALL orphaned branches in one run.
