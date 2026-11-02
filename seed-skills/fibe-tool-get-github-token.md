---
name: fibe-tool-get-github-token
description: Use only when a git operation inside a Playground needs a short-lived GitHub token for a connected repository.
---
# fibe_get_github_token

Returns a short-lived, repository-scoped token for git operations.

## Inputs

- `repository`: owner/repo.

## Notes

- Never print, log or commit the token; use it only for the immediate git command.
