---
title: "Feedbacks List"
description: "List all feedback entries associated with an agent."
slug: /reference/tools/feedbacks-list
sidebar_label: "Feedbacks List"
image: /img/og/reference-tools-feedbacks-list.png
keywords: ["Fibe", "Tool", "fibe", "tool", "feedbacks", "list"]
tags: ["reference", "tool", "tool"]
format: md
---

List all feedback entries associated with an agent.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `created_after` | No | string | Filter to feedback created at or after this timestamp. |
| `created_before` | No | string | Filter to feedback created at or before this timestamp. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `page` | No | integer | Page number. Minimum: 1. |
| `per_page` | No | integer | Number of results per page. Minimum: 1. |
| `playground_id_or_name` | No | integer or string | Optional playground ID or slug-safe name filter. |
| `query` | No | string | Search across comment, selected_text, and context. |
| `sort` | No | string | Sort order, for example created_at_desc. |
| `source_id` | No | string | Filter by source identifier. |
| `source_type` | No | string | Filter by feedback source type. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Filter by the supported source, Playground, time, query, sort, and pagination fields listed above.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
