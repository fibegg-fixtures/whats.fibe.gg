---
name: fibe-tool-agents-create-conversation
description: "Create or upsert an agent conversation."
---
# fibe_agents_create_conversation

Create or upsert an agent conversation.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `conversation_id` | Yes | string | Specific conversation/thread ID. |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `title` | No | string | Human-readable conversation title. Optional. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- `conversation_id` is caller-supplied and required. This operation creates or upserts that conversation; `title` is optional.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
