---
name: fibe-tool-resource-mutate
description: Use when you need a single tool for create/update and resource-scoped operations (attach, mirror, sync, fork, trigger, rerun, action, etc.) across Fibe resources. Schema-validates locally before API call.
---

# fibe_resource_mutate

[MODE:SIDEEFFECTS] Tier: base. Not idempotent (per resource semantics).

Resource mutations that launch, rebuild, inspect, stream, schedule, SSH, restart routing, or message a Host require that Host to be funded. Unpaid Hosts return `HOST_NOT_FUNDED`.

Unified mutation entry point. Validates `payload` against `fibe_schema(resource, operation)` locally, then dispatches to the SDK service for that resource. Use `dry_run:true` to validate without sending the request.

## Always preface with fibe_schema
Payload shapes differ wildly per resource. `fibe_schema(resource:"<r>", operation:"<op>")` is the only authoritative reference; the validator inside `fibe_resource_mutate` runs the same schema.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `resource` | string (enum) | yes | Canonical or alias |
| `operation` | string (enum) | yes | Op name; varies per resource |
| `payload` | object | yes | Op-specific args; schema-validated |
| `dry_run` | bool | no | Validate-only; returns `{valid:true,...}` without API call |
| `confirm` | bool | sometimes | Required for `playground.action` unless `--yolo` |

## Supported (resource, operation) matrix

**Agents**: `create`, `update`, `restart_chat` (`restart_chat` marks the chat `pending` and redeploys with the latest configured image)
**API keys**: `create`
**Hosts**: `create`, `update`, `autoconnect_token`, `generate_ssh_key`, `test_connection`
**Playgrounds**: `create`, `update`, `action` (lifecycle)
**Specs**: `create`, `update`
**Repositories**: `create`, `update`, `attach` (existing repo), `mirror` (clone external repo to managed Gitea), `sync` (re-pull from remote)
**Secrets**: `create`, `update`
**Templates**: `create`, `update` (incl. cover image), `fork`, `source_refresh`, `source_set`, `upgrade_specs`
**Template versions**: `create` (incl. patch-create), `toggle_public`
**Tasks**: `trigger`, `rerun`
**Webhooks**: `create`, `update`, `test`
**Job env**: `create` (i.e., `set`), `update`
**Memory**: `memorize` (preferred via `fibe_memorize`)

## Specific operations: quick reference

### `agent.create`
Creates a new Fibe Platform Agent record. It does not inherit provider auth from another Agent and does not start a runtime by itself. If you need a sibling Agent with existing auth material, use `fibe_agents_duplicate`. For a brand-new Agent, provide the intended provider auth through Secrets/provider-key flow (`provider_api_key_mode`/`api_key_id` where applicable) before starting chat. Do not use `fibe-mana` unless the environment explicitly reports that it is configured.

### `playground.create`
- Required: `spec_id_or_name` (numeric ID or spec name).
- `host_id_or_name` falls back to `FIBE_HOST_ID` env if omitted.
- Returns the created Playground with status `creating`.

### `playground.action`
Synchronous-ish lifecycle action. Required `confirm:true` (or `--yolo`).
- `action_type`: `rollout` | `hard_restart` | `stop` | `start` | `retry_compose` | `enable_maintenance` | `disable_maintenance`.
- `force`: bypass eligible state guards when allowed.

The API returns 202 + `request_id`; the SDK polls `GET /api/playgrounds/:id/action/:request_id` until terminal. Use `fibe_playgrounds_wait` for explicit status confirmation.

### `repository.attach`
Reuses an existing Player-owned GitHub/Gitea repo (full name like `owner/repo`); creates a Repository record without provisioning a new repository.

### `repository.mirror`
Clones an external public repo into the player's managed Gitea, returns the resulting Repository. Requires `source_url` + `name`.

### `repository.sync`
Triggers a forced re-pull of the Repository's mirror from upstream.

### `template.create` / `template.update`
- `update` accepts metadata-only diffs (name/description/category) AND/OR a cover image (`image_data` base64, `content_base64`, or `content_path`). At least one mutation field required.

### `template_version.create`
Creates a new versioned template body. Pass `template_body` inline OR `template_body_path` (local FS only). Optional `public:true`, `changelog`. `response_mode` defaults to `summary` (skips heavy metadata).

### `task.trigger`
Schedule-style trigger. Required `spec_id`; `host_id` defaults to env.

### `task.rerun`
Re-runs an existing Task by ID; reuses prior Spec + Host.

### `host.test_connection` / `host.generate_ssh_key`
Long-running async; the SDK polls the returned `request_id`. Use `fibe_resource_get(resource:"host", id:...)` to check `status` after.

### `webhook.test`
Sends a `webhook.test_ping` event to verify the endpoint is reachable.

## Output
Operation-specific. Most return the affected resource's JSON. Long-running mutations return a request envelope while the SDK polls under the hood.

`dry_run` short-circuits to:
```json
{
  "resource": "<canonical>",
  "operation": "<canonical>",
  "dry_run": true,
  "valid": true,
  "message": "Payload is valid; no request was sent."
}
```

## Gotchas
- **Named resource references are normalized through `*_id_or_name` fields.** Pass `spec_id_or_name:"my-app-spec"` and the SDK resolves to the numeric ID. Same pattern applies to `host_id_or_name`, `repository_id_or_name`, `playground_id_or_name`, and `agent_id_or_name` where the target schema exposes them.
- `playground.action` requires `confirm:true`; the dispatcher errors with `confirmRequiredError` otherwise.
- `template_body_path` is local-only: fails when the MCP server runs remotely.
- `secret.create/update` accepts plaintext in payload; the value is hashed/encrypted server-side and never returned plaintext again.
- `spec.update` services use `repository_id` field for slot binding (named or numeric); the SDK splits this out before binding params.
- `memorize` works but use the dedicated `fibe_memorize` for the conversation snapshot logic.
- Generic `artefact.create` is not supported here. Use `fibe_artefact_upload`: it handles base64/file-path decoding and `FIBE_AGENT_ID` resolution.

## Related
- `fibe_schema(resource:..., operation:...)`: required reference.
- `fibe_pipeline`: chain mutate → wait → get in one round-trip.
- `fibe_resource_get` / `fibe_resource_list` / `fibe_resource_delete`.
- Domain shortcuts: `fibe_artefact_upload`, `fibe_memorize`, `fibe_mutter`, `fibe_playgrounds_action`, `fibe_launch`.
