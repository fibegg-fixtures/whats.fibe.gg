---
name: fibe-tool-artefact-upload
description: "Upload and save an artefact from inline text or file content."
---
# fibe_artefact_upload

Upload and save an artefact from inline text or file content.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `name` | Yes | string | Artefact display name (alias: 'title'). Also used as filename fallback. |
| `agent_id_or_name` | No | string | Optional agent id or name; defaults to FIBE_AGENT_ID when available, otherwise creates a player-owned artefact |
| `body` | No | string | Inline body for body-only artefacts |
| `content_base64` | No | string | Base64-encoded file content (alias: 'content') |
| `content_path` | No | string | Absolute local file path to read (local MCP only) |
| `content_text` | No | string | Alias for body |
| `description` | No | string | Optional human-readable description |
| `filename` | No | string | Target filename: defaults to 'name' when omitted |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `playground_id_or_name` | No | string | Optional playground ID or name to associate with the artefact |
| `skill` | No | boolean | Expose this artefact as a skill |
| `skill_enabled` | No | boolean | Enable this artefact skill by default |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- `name` is required. Supply body text with `body`/`content_text`, or file content with `content_base64`/`content_path`.
- Local file reads require local MCP access. Never upload secrets or credential files.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
