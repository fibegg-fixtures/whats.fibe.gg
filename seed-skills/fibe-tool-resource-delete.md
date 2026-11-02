---
name: fibe-tool-resource-delete
description: "Delete a supported flat Fibe resource by ID, name, or key where supported."
---
# fibe_resource_delete

Delete a supported flat Fibe resource by ID, name, or key where supported.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `resource` | Yes | string | Canonical resource name or explicit alias, e.g. playground, spec, repository, api_key. Allowed: `agent`, `agent-poke`, `agent-pokes`, `agent_poke`, `agent_pokes`, `agents`, `api-key`, `api-keys`, `api_key`, `api_keys`, `env-pack`, `env-packs`, `env_pack`, `env_packs`, `host`, `hosts`, `import-template`, `import-templates`, `import_template`, `import_templates`, `job-env`, `job-environment`, `job-environments`, `job-envs`, `job_env`, `job_environment`, `job_environments`, `job_envs`, `memories`, `memory`, `playground`, `playgrounds`, `pokes`, `repositories`, `repository`, `secret`, `secrets`, `spec`, `specs`, `task`, `tasks`, `template`, `template-source`, `template-sources`, `template-version`, `template-versions`, `template_source`, `template_sources`, `template_version`, `template_versions`, `templates`, `webhook`, `webhook-endpoint`, `webhook-endpoints`, `webhook_endpoint`, `webhook_endpoints`, `webhooks`. |
| `agent_id_or_name` | No | string | Agent ID or name for resource-specific deletes such as agent_poke. |
| `confirm` | No | boolean | Must be true unless server is running with --yolo |
| `id` | No | number | Numeric ID of the selected resource. Minimum: 1. |
| `id_or_key` | No | string | Numeric ID or key for secrets. |
| `id_or_name` | No | string | Numeric ID or name for named resources. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `template_id_or_name` | No | string | Template ID or name for resource-specific deletes such as template_version. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Choose a supported `resource` and the identifier form it uses. Some nested resources also require `agent_id_or_name` or `template_id_or_name`.
- Deletion requires explicit user intent and MCP confirmation unless the gate has been disabled.

Read-only: **no**. Destructive: **yes**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
