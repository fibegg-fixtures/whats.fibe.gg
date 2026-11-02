---
title: "Mutter"
description: "Create one short mutter for an agent: a visible internal note used for progress, proof, blocker, or problem updates."
slug: /reference/tools/mutter
sidebar_label: "Mutter"
image: /img/og/reference-tools-mutter.png
keywords: ["Fibe", "Tool", "fibe", "tool", "mutter"]
tags: ["reference", "tool", "tool"]
format: md
---

Create one short mutter for an agent: a visible internal note used for progress, proof, blocker, or problem updates.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `body` | Yes | string | Mutter body text. |
| `type` | Yes | string | Mutter type label. Common values are info, warning, error, and success; Server accepts arbitrary strings. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `playground_id_or_name` | No | integer or string | Optional playground ID or slug-safe name to associate with the mutter. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Requires `FIBE_AGENT_ID` in the MCP process environment. Send the note in `body` and its label in `type`; the Agent identity is supplied from that environment.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
