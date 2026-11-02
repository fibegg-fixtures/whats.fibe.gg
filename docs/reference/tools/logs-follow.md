---
title: "Logs Follow"
description: "Stream live playground or task logs as progress notifications. Omitting service streams all services."
slug: /reference/tools/logs-follow
sidebar_label: "Logs Follow"
image: /img/og/reference-tools-logs-follow.png
keywords: ["Fibe", "Tool", "fibe", "tool", "logs", "follow"]
tags: ["reference", "tool", "tool"]
format: md
---

Stream live playground or task logs as progress notifications. Omitting service streams all services.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | string | Playground or task numeric ID or slug-safe name |
| `duration` | No | string | Max follow duration (Go duration, default: 30s) |
| `max_lines` | No | number | Stop after N new lines (default: 500) Minimum: 1. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `service` | No | string | Optional Compose service name, for example web or worker. Omit to stream all services. |
| `tail` | No | number | Initial lines from history (default: 50) Minimum: 1. |
| `target` | No | string | Target type (default: playground). Allowed: `playground`, `task`. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `target` to select Playground or Task logs, and `duration` to bound observation. Streaming does not change the workload’s lifecycle.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
