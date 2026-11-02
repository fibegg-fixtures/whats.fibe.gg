---
title: "Agents Duplicate"
description: "Duplicate an agent configuration."
slug: /reference/tools/agents-duplicate
sidebar_label: "Agents Duplicate"
image: /img/og/reference-tools-agents-duplicate.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "duplicate"]
tags: ["reference", "tool", "tool"]
format: md
---

Duplicate an agent configuration.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Duplicates configuration for the Agent identified by `id_or_name`; this tool does not accept a replacement name. Inspect the returned Agent before using it.

Read-only: **no**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
