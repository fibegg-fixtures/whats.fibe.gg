---
title: "Templates Search"
description: "Search available Templates by text or a bounded regular expression."
slug: /reference/tools/templates-search
sidebar_label: "Templates Search"
image: /img/og/reference-tools-templates-search.png
keywords: ["Fibe", "Tool", "fibe", "tool", "templates", "search"]
tags: ["reference", "tool", "tool"]
format: md
---

Search available Templates by text or a bounded regular expression.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `query` | No | string | Search query. In regex mode, use the Native server’s supported regular-expression syntax. |
| `regex` | No | boolean | Treat query as a Native regular expression. A literal token of at least three characters is required for bounded matching. |
| `template_id_or_name` | No | string | Optional template ID or name filter |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `query` or `regex` to search; `template_id_or_name` can limit the search to a particular template.
- Native regex search is case-insensitive, accepts at most 160 characters, and requires a literal token of at least three characters.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
