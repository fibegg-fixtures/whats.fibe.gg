---
title: "Schema"
description: "Return JSON Schema definitions and the schema resource catalog."
slug: /reference/tools/schema
sidebar_label: "Schema"
image: /img/og/reference-tools-schema.png
keywords: ["Fibe", "Tool", "fibe", "tool", "schema"]
tags: ["reference", "tool", "tool"]
format: md
---

Return JSON Schema definitions and the schema resource catalog.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `operation` | No | string | Operation name. Supported combinations are resource-dependent; pass resource=list for the catalog. Allowed: `action`, `attach`, `attachment_detach`, `attachment_retarget`, `attachments_get`, `attachments_reorder`, `attachments_replace`, `autoconnect_token`, `change`, `create`, `delete`, `event_types`, `fork`, `generate_ssh_key`, `get`, `grant_renew`, `list`, `memorize`, `mirror`, `rerun`, `restart_chat`, `source_refresh`, `source_set`, `switch_template`, `sync`, `test`, `test_connection`, `toggle_public`, `trigger`, `update`, `upgrade_specs`, `upload_attachment`, `validate`, `watch`. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `payload` | No | object | Optional operation payload for side-effect-free schema-backed validations such as compose.validate. Nested fields are defined in the linked JSON schema. |
| `resource` | No | string | Resource name, alias, or 'list' for the schema resource catalog. Allowed: `agent`, `agent-attachment`, `agent-attachments`, `agent-poke`, `agent-pokes`, `agent-upload`, `agent-uploads`, `agent_attachment`, `agent_attachments`, `agent_poke`, `agent_pokes`, `agent_upload`, `agent_uploads`, `agents`, `api-key`, `api-keys`, `api_key`, `api_keys`, `artefact`, `artefact-attachment`, `artefact-attachments`, `artefact_attachment`, `artefact_attachments`, `artefacts`, `audit-log`, `audit-logs`, `audit_log`, `audit_logs`, `categories`, `category`, `compose`, `composes`, `docker-compose`, `docker_compose`, `env-pack`, `env-packs`, `env_pack`, `env_packs`, `host`, `hosts`, `import-template`, `import-templates`, `import_template`, `import_templates`, `job-env`, `job-environment`, `job-environments`, `job-envs`, `job_env`, `job_environment`, `job_environments`, `job_envs`, `list`, `memories`, `memory`, `mutter`, `mutters`, `playground`, `playgrounds`, `pokes`, `repositories`, `repository`, `secret`, `secrets`, `spec`, `specs`, `task`, `tasks`, `template`, `template-categories`, `template-category`, `template-source`, `template-sources`, `template-version`, `template-versions`, `template_categories`, `template_category`, `template_source`, `template_sources`, `template_version`, `template_versions`, `templates`, `webhook`, `webhook-deliveries`, `webhook-delivery`, `webhook-endpoint`, `webhook-endpoints`, `webhook_deliveries`, `webhook_delivery`, `webhook_endpoint`, `webhook_endpoints`, `webhooks`. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Omit `resource` to discover resources. Supply `resource` and `operation` for the specific operation schema; `payload` can be checked against it.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
