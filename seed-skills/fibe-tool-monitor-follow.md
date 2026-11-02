---
name: fibe-tool-monitor-follow
description: "Stream agent-produced events as live MCP progress notifications"
---
# fibe_monitor_follow

Stream agent-produced events as live MCP progress notifications

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `agent` | No | string | Comma-separated agent IDs. Empty = all accessible. |
| `content_limit` | No | number | Advanced: truncate each payload to N bytes (default: 32768, max: 131072) Minimum: 1. |
| `duration` | No | string | Max follow duration as Go duration (default: 30s, max: 30m) |
| `max_events` | No | number | Stop after N events (default: 100) Minimum: 1. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `poll_interval` | No | string | Polling interval as Go duration (default: 2s) |
| `q` | No | string | Full-text search across content |
| `since` | No | string | Lower bound ISO 8601 (default: now) |
| `type` | No | string | Comma-separated types: message, activity, mutter, artefact |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `type` for event types and `duration`/`max_events` to bound the stream.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
