---
title: "Playgrounds Action"
description: "Run one playground lifecycle action: rollout, hard_restart, stop, start, retry_compose, enable_maintenance, or disable_maintenance."
slug: /reference/tools/playgrounds-action
sidebar_label: "Playgrounds Action"
image: /img/og/reference-tools-playgrounds-action.png
keywords: ["Fibe", "Tool", "fibe", "tool", "playgrounds", "action"]
tags: ["reference", "tool", "tool"]
format: md
---

Run one playground lifecycle action: rollout, hard_restart, stop, start, retry_compose, enable_maintenance, or disable_maintenance.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `action_type` | Yes | string | Lifecycle action to perform. Allowed: `rollout`, `hard_restart`, `stop`, `start`, `retry_compose`, `enable_maintenance`, `disable_maintenance`. |
| `id_or_name` | Yes | string | Playground numeric ID or slug-safe name |
| `confirm` | No | boolean | Must be true unless server is running with --yolo |
| `force` | No | boolean | Bypass eligible state guards when the server permits forced execution. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `action_type` with one of the enumerated lifecycle actions. Deletion is a separate resource-delete operation.
- This tool requires MCP confirmation unless the server’s confirmation gate has been explicitly disabled. Check status after acceptance.

Read-only: **no**. Destructive: **yes**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
