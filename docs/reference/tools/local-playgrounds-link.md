---
title: "Local Playgrounds Link"
description: "Link local playground mounts into a working directory."
slug: /reference/tools/local-playgrounds-link
sidebar_label: "Local Playgrounds Link"
image: /img/og/reference-tools-local-playgrounds-link.png
keywords: ["Fibe", "Tool", "fibe", "tool", "local", "playgrounds", "link"]
tags: ["reference", "tool", "tool"]
format: md
---

Link local playground mounts into a working directory.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | No | string | Local playground ID, name, compose project, spec, or unique spec prefix |
| `link_dir` | No | string | Target directory for symlinks (default: PLAYGROUNDS_DIR, then /app/playground) |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Creates local links in `link_dir`, defaulting to `PLAYGROUNDS_DIR` and then `/app/playground`. It operates on files available to the MCP process.

Read-only: **no**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
