---
title: "Agents Interrupt"
description: "Interrupt a running agent turn."
slug: /reference/tools/agents-interrupt
sidebar_label: "Agents Interrupt"
image: /img/og/reference-tools-agents-interrupt.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "interrupt"]
tags: ["reference", "tool", "tool"]
format: md
---

Interrupt a running agent turn.

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

- Use `conversation_id` when the interruption must target a particular conversation. Inspect runtime state afterward.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
