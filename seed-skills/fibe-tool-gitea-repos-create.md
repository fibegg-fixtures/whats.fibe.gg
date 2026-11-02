---
name: fibe-tool-gitea-repos-create
description: Use when the user wants a new private Gitea repository managed by Fibe.
---
# fibe_gitea_repos_create

Creates a Gitea repository on the Fibe-managed git server.

## Inputs

- `name`: repository name.
- `private` (optional): defaults to true.

## Notes

- Prefer `fibe_greenfield_create` when you also want a Playground.
