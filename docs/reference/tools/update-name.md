---
title: "Update Name"
description: "Update your own agent name."
slug: /reference/tools/update-name
sidebar_label: "Update Name"
image: /img/og/reference-tools-update-name.png
keywords: ["Fibe", "Tool", "fibe", "tool", "update", "name"]
tags: ["reference", "tool", "tool"]
format: md
---

Update your own agent name.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `name` | Yes | string | Your new name |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Renames the current Agent identified by `FIBE_AGENT_ID`; it does not take an arbitrary Agent identifier.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
