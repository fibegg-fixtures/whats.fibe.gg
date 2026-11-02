---
name: fibe-tool-repo-status-check
description: "Check Git repository access and readiness for the configured installation."
---
# fibe_repo_status_check

Check Git repository access and readiness for the configured installation.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `github_urls` | Yes | array of string | GitHub repository URLs to check. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Pass one or more repository URLs in the required `github_urls` array.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
