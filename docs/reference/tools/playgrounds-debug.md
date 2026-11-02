---
title: "Playgrounds Debug"
description: "Retrieve Playground service, container, port, path, label, status, URL, and recent-log diagnostics."
slug: /reference/tools/playgrounds-debug
sidebar_label: "Playgrounds Debug"
image: /img/og/reference-tools-playgrounds-debug.png
keywords: ["Fibe", "Tool", "fibe", "tool", "playgrounds", "debug"]
tags: ["reference", "tool", "tool"]
format: md
---

Retrieve Playground service, container, port, path, label, status, URL, and recent-log diagnostics.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | string | Playground numeric ID or slug-safe name |
| `logs_tail` | No | number | Optional number of service log lines to include. Minimum: 1. |
| `mode` | No | string | summary (default) or full Allowed: `summary`, `full`. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `refresh` | No | boolean | Refresh Docker state before reading diagnostics (default: true) |
| `service` | No | string | Optional Compose service name to focus diagnostics on. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Defaults to `mode: summary` and `refresh: true`; use `service` and `logs_tail` to focus diagnostics.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
