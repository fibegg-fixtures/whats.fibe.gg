---
name: fibe-tool-call
description: "Invoke a registered Fibe tool that is hidden by the current tool tier. Prefer direct tool calls when the concrete tool is advertised; use fibe_tools_catalog/fibe_schema only when the hidden tool name or args are unclear."
---
# fibe_call

Invoke a registered Fibe tool that is hidden by the current tool tier. Prefer direct tool calls when the concrete tool is advertised; use fibe_tools_catalog/fibe_schema only when the hidden tool name or args are unclear.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `tool` | Yes | string | The target tool name, e.g. fibe_playgrounds_debug |
| `args` | No | object | The target tool's args object Nested fields are defined in the linked JSON schema. |
| `confirm` | No | boolean | Forwarded as args.confirm for destructive tools |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Prefer a directly advertised tool. Use `tool` and `args` to reach a registered hidden tool; `confirm` is forwarded to it.
- Discover names and input schemas with `fibe_tools_catalog`.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
