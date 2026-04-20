# issue_label — 优先级排序

**触发**：每天一次
**分支命名空间**：（不碰任何分支）
**可写权限**：label、issue close、comment。**严格禁止**：代码、分支、PR。

---

## Task: Auto-label open issues

**IMPORTANT: Do NOT push any commits, create any branches, or open any PRs. This task ONLY labels/closes issues and leaves comments.

Reading issues: Use GitHub MCP tools if available. If not, fall back to web-scraping GitHub issue pages or local scripts. Any method is fine for reading.

Writing (apply labels, close issues, leave comments): Use GitHub MCP tools ONLY. If MCP tools are not available, wait 2 minutes and retry. Retry up to 3 times. If still unavailable after 3 retries, output your triage analysis as text and stop — do NOT apply any changes.

NOTHING gets committed or pushed.**

### Step 0: Understand the project

- Read README.md, CLAUDE.md, and any docs/ directory.
- Scan directory structure, recent commits (last 2 weeks),
  and open PRs.

### Step 1: Fetch and evaluate

1. Fetch ALL open issues.

2. For each issue, read title, body, and comments.
   Check against CURRENT codebase:
   - Fully addressed by recent commits/merged PRs → close it
     with a one-line comment.
   - Codebase changed making it easier/harder/obsolete?
   - Dependencies resolved?

3. Assign or UPDATE exactly ONE label:
   - "priority:high" — bug, broken functionality, security.
   - "priority:medium" — clear scope, doable in one PR.
   - "priority:low" — nice-to-have, vague scope.
   - "good-first-issue" — small, well-scoped. Also add priority.
   - "blocked" — depends on another open issue still open.
   - "wontfix" — obsolete/duplicated. Comment why.

4. If an issue's existing label is wrong due to codebase
   changes, update it.

5. If uncertain, pick the lower priority.

6. Create any labels that don't exist yet in the repo.

7. Process ALL open issues in one run.
