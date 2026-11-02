---
title: "Playgrounds Wait"
description: "Block and poll until a playground reaches a specified target state and, for running playgrounds by default, reported services are ready."
slug: /reference/tools/playgrounds-wait
sidebar_label: "Playgrounds Wait"
image: /img/og/reference-tools-playgrounds-wait.png
keywords: ["Fibe", "Tool", "fibe", "tool", "playgrounds", "wait"]
tags: ["reference", "tool", "tool"]
format: md
---

Block and poll until a playground reaches a specified target state and, for running playgrounds by default, reported services are ready.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | string | Playground numeric ID or slug-safe name |
| `status` | Yes | string | Target playground status, for example running, stopped, or has_changes. |
| `interval` | No | string | Polling interval as Go duration string (default: 3s) |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `readiness` | No | string | Readiness mode: services waits for reported service readiness when status is running; lifecycle waits only for the top-level status. Defaults to services for status=running and lifecycle otherwise. |
| `timeout` | No | string | Max wait duration as Go duration string (e.g. "5m"; default: 10m) |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Both `id_or_name` and `status` are required. For `status: running`, readiness defaults to service readiness; other target statuses default to lifecycle readiness.
- A timeout means the target was not observed in time. Inspect status and diagnostics before deciding whether to retry an effect.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
