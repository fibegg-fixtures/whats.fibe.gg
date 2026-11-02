---
title: "Gitea Repos Create"
description: "Create a managed Gitea repo and matching Repository. For multi-service switches, batch independent repo creation with fibe_pipeline before seeding source and applying fibe_playgrounds_switch_template."
slug: /reference/tools/gitea-repos-create
sidebar_label: "Gitea Repos Create"
image: /img/og/reference-tools-gitea-repos-create.png
keywords: ["Fibe", "Tool", "fibe", "tool", "gitea", "repos", "create"]
tags: ["reference", "tool", "tool"]
format: md
---

Create a managed Gitea repo and matching Repository. For multi-service switches, batch independent repo creation with fibe_pipeline before seeding source and applying fibe_playgrounds_switch_template.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `name` | Yes | string | Name. |
| `auto_init` | No | null or boolean | Initialize the repository with default files. |
| `description` | No | null or string | Optional description. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `private` | No | null or boolean | Whether the repository is private. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Creates a managed Gitea repository and its matching Fibe Repository using the installation’s configured Gitea integration.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
