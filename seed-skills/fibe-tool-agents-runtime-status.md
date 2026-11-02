---
name: fibe-tool-agents-runtime-status
description: "Check agent reachability, authentication, queue, and processing state."
---
# fibe_agents_runtime_status

Check agent reachability, authentication, queue, and processing state.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Live runtime checks depend on the Agent’s Host being reachable.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
