---
name: fibe-tool-github-repos-create
description: "Register and connect a new GitHub repository"
---
# fibe_github_repos_create

Register and connect a new GitHub repository

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `name` | Yes | string | Name. |
| `auto_init` | No | null or boolean | Initialize the repository with default files. |
| `description` | No | null or string | Optional description. |
| `github_installation_id` | No | integer | GitHub Installation ID Minimum: 1. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `private` | No | null or boolean | Whether the repository is private. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `github_installation_id` to select a connected installation when needed. The tool does not accept an `owner` argument.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
