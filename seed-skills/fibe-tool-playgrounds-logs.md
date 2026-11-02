---
name: fibe-tool-playgrounds-logs
description: "Retrieve playground logs. Omitting service returns all services."
---
# fibe_playgrounds_logs

Retrieve playground logs. Omitting service returns all services.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | string | Playground numeric ID or slug-safe name |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `service` | No | string | Optional Compose service name, for example web or worker. Omit to return all services. |
| `tail` | No | number | Number of log lines to return (default: 50) Minimum: 1. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- The log count field is `tail`; omit `service` to request logs across services.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
