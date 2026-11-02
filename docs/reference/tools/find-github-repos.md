---
title: "Find Github Repos"
description: "Search Personal installations or a selected verified Team installation."
slug: /reference/tools/find-github-repos
sidebar_label: "Find Github Repos"
image: /img/og/reference-tools-find-github-repos.png
keywords: ["Fibe", "Tool", "fibe", "tool", "find", "github", "repos"]
tags: ["reference", "tool", "tool"]
format: md
---

Search Personal installations or a selected verified Team installation.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `github_installation_id` | No | number | Verified Team GitHub installation; required when multiple are connected. Minimum: 1. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `page` | No | number | Page number (default: 1) Minimum: 1. |
| `per_page` | No | number | Results per page (default: 30, max: 100) Minimum: 1. |
| `q` | No | string | Search query (filters by repo name). Optional; omit to list all accessible repos. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- The search text field is `q`. Use `github_installation_id` when a particular connected installation is required.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
