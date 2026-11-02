---
title: "Agents Delete Conversation"
description: "Delete an agent conversation."
slug: /reference/tools/agents-delete-conversation
sidebar_label: "Agents Delete Conversation"
image: /img/og/reference-tools-agents-delete-conversation.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "delete", "conversation"]
tags: ["reference", "tool", "tool"]
format: md
---

Delete an agent conversation.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `conversation_id` | Yes | string | Specific conversation/thread ID. |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Deletion requires explicit user intent and MCP confirmation. This release marks the tool destructive but omits `confirm` from its advertised input schema; clients that enforce that schema can call it through `fibe_call` with top-level `confirm: true`.

Read-only: **no**. Destructive: **yes**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
