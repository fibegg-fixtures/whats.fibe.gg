---
title: "Auth Set"
description: "Set the API key and domain for this MCP session."
slug: /reference/tools/auth-set
sidebar_label: "Auth Set"
image: /img/og/reference-tools-auth-set.png
keywords: ["Fibe", "Tool", "fibe", "tool", "auth", "set"]
tags: ["reference", "tool", "tool"]
format: md
---

Set the API key and domain for this MCP session.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `api_key` | No | string | Fibe API key, for example fibe_live_... or fibe_test_... |
| `domain` | No | string | API domain override (default: fibe.gg) |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `validate` | No | boolean | Ping /api/me with the new creds before saving (default: true) |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `domain` for the origin of your self-hosted installation. `validate` defaults to true and checks `/api/me` before saving the credential in the MCP session.
- Keep the API key out of transcripts and source files.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
