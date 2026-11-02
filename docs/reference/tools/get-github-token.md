---
title: "Get Github Token"
description: "Get the server-provided GitHub credential for an authorized repository."
slug: /reference/tools/get-github-token
sidebar_label: "Get Github Token"
image: /img/og/reference-tools-get-github-token.png
keywords: ["Fibe", "Tool", "fibe", "tool", "get", "github", "token"]
tags: ["reference", "tool", "tool"]
format: md
---

Get the server-provided GitHub credential for an authorized repository.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `repo` | Yes | string | Full repo name, e.g. owner/repo |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `repo` in `owner/repo` form. The credential comes from the installation’s authorized GitHub connection.
- Never print, log, or commit the returned credential; use it only for the intended Git operation.

Read-only: **no**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
