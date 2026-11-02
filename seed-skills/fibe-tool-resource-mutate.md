---
name: fibe-tool-resource-mutate
description: "Create, update, or run a supported resource-scoped mutation with a payload validated against fibe_schema before any API request."
---
# fibe_resource_mutate

Create, update, or run a supported resource-scoped mutation with a payload validated against fibe_schema before any API request.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `operation` | Yes | string | Mutation operation. Supported combinations are listed in fibe_schema(resource:list) and enforced by runtime validation. Allowed: `action`, `attach`, `attachment_detach`, `attachment_retarget`, `attachments_reorder`, `attachments_replace`, `autoconnect_token`, `change`, `create`, `fork`, `generate_ssh_key`, `grant_renew`, `mirror`, `rerun`, `restart_chat`, `source_refresh`, `source_set`, `switch_template`, `sync`, `test`, `test_connection`, `toggle_public`, `trigger`, `update`, `upgrade_specs`, `upload_attachment`. |
| `payload` | Yes | object | Operation-specific payload. Validate shape with fibe_schema(resource:&lt;name&gt;, operation:&lt;operation&gt;); the server enforces that schema before any API request. |
| `resource` | Yes | string | Resource to mutate. Accepts canonical singular snake_case names and explicit aliases. Allowed: `agent`, `agent-poke`, `agent-pokes`, `agent_poke`, `agent_pokes`, `agents`, `api-key`, `api-keys`, `api_key`, `api_keys`, `env-pack`, `env-packs`, `env_pack`, `env_packs`, `host`, `hosts`, `import-template`, `import-templates`, `import_template`, `import_templates`, `job-env`, `job-environment`, `job-environments`, `job-envs`, `job_env`, `job_environment`, `job_environments`, `job_envs`, `playground`, `playgrounds`, `pokes`, `repositories`, `repository`, `secret`, `secrets`, `spec`, `specs`, `task`, `tasks`, `template`, `template-version`, `template-versions`, `template_version`, `template_versions`, `templates`, `webhook`, `webhook-endpoint`, `webhook-endpoints`, `webhook_endpoint`, `webhook_endpoints`, `webhooks`. |
| `confirm` | No | boolean | Set true for destructive routed operations such as playground.action unless the server runs with --yolo. |
| `dry_run` | No | boolean | Validate the payload against fibe_schema and return without sending any API request. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `fibe_schema` for the selected resource and operation, then put identifiers and fields inside `payload`. There is no top-level `id_or_name`.
- `dry_run: true` validates the payload without sending an API request. Supported resource actions extend beyond create/update.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
