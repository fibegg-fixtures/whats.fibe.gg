---
title: "Mutters Get"
description: "Retrieve an agent's mutter stream by id_or_name, with optional query/status/severity/playground filters."
slug: /reference/tools/mutters-get
sidebar_label: "Mutters Get"
image: /img/og/reference-tools-mutters-get.png
keywords: ["Fibe", "Tool", "fibe", "tool", "mutters", "get"]
tags: ["reference", "tool", "tool"]
format: md
---

Retrieve an agent's mutter stream by id_or_name, with optional query/status/severity/playground filters.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Agent ID or name whose mutter stream should be retrieved. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `page` | No | integer | Page number for paginated mutter results. Minimum: 1. |
| `per_page` | No | integer | Number of mutter results per page. Minimum: 1. |
| `playground_id_or_name` | No | integer or string | Optional playground ID or slug-safe name used to filter the mutter stream. |
| `query` | No | string | Optional substring search across mutter values. |
| `severity` | No | string | Optional severity filter. |
| `status` | No | string | Optional status filter. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- `id_or_name` identifies the Agent. Optional Playground, query, status, severity, and pagination filters narrow the stream.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
