# Issue Tracker: GitHub

Issues and PRDs for this repo live in GitHub Issues for `MiaoDX/LIP`. Use the `gh` CLI for all operations.

## Conventions

- Create an issue: `gh issue create --title "..." --body "..."`
- Read an issue: `gh issue view <number> --comments`
- List issues: `gh issue list --state open --json number,title,body,labels,comments`
- Comment on an issue: `gh issue comment <number> --body "..."`
- Apply or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- Close an issue: `gh issue close <number> --comment "..."`

Run `gh` commands from inside this repository so the CLI infers `MiaoDX/LIP` from `git remote -v`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
