---
title: "Agent Defaults Update"
description: "Replace the authenticated player's agent default overrides. Use the same agent_defaults JSON shape as the profile UI."
slug: /reference/tools/agent-defaults-update
sidebar_label: "Agent Defaults Update"
image: /img/og/reference-tools-agent-defaults-update.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agent", "defaults", "update"]
tags: ["reference", "tool", "tool"]
format: md
---

Replace the authenticated player's agent default overrides. Use the same agent_defaults JSON shape as the profile UI.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `agent_defaults` | Yes | object | Canonical player agent defaults object; use provider_overrides.&lt;provider&gt;.cli_version for per-provider CLI pins and default_mounted_files for runtime files. Nested fields are defined in the linked JSON schema. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Send the complete `agent_defaults` object to replace personal overrides. Use the profile form’s canonical shape, including `provider_overrides` and `default_mounted_files` where needed.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
