---
title: "Agents Live State"
description: "Check conversation-scoped agent live stream state."
slug: /reference/tools/agents-live-state
sidebar_label: "Agents Live State"
image: /img/og/reference-tools-agents-live-state.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "live", "state"]
tags: ["reference", "tool", "tool"]
format: md
---

Check conversation-scoped agent live stream state.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `conversation_id` | No | string | Specific conversation/thread ID. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `conversation_id` to read one conversation’s live stream state.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
