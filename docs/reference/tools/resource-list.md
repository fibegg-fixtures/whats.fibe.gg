---
title: "Resource List"
description: "List a supported flat Fibe resource. Use fibe_schema with resource=list to discover resource names, aliases, and list params."
slug: /reference/tools/resource-list
sidebar_label: "Resource List"
image: /img/og/reference-tools-resource-list.png
keywords: ["Fibe", "Tool", "fibe", "tool", "resource", "list"]
tags: ["reference", "tool", "tool"]
format: md
---

List a supported flat Fibe resource. Use fibe_schema with resource=list to discover resource names, aliases, and list params.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `resource` | Yes | string | Canonical resource name or explicit alias, e.g. playground, spec, repository, api_key. Allowed: `agent`, `agent-poke`, `agent-pokes`, `agent_poke`, `agent_pokes`, `agents`, `api-key`, `api-keys`, `api_key`, `api_keys`, `artefact`, `artefacts`, `audit-log`, `audit-logs`, `audit_log`, `audit_logs`, `categories`, `category`, `env-pack`, `env-packs`, `env_pack`, `env_packs`, `host`, `hosts`, `import-template`, `import-templates`, `import_template`, `import_templates`, `job-env`, `job-environment`, `job-environments`, `job-envs`, `job_env`, `job_environment`, `job_environments`, `job_envs`, `memories`, `memory`, `playground`, `playgrounds`, `pokes`, `repositories`, `repository`, `secret`, `secrets`, `spec`, `specs`, `task`, `tasks`, `template`, `template-categories`, `template-category`, `template-version`, `template-versions`, `template_categories`, `template_category`, `template_version`, `template_versions`, `templates`, `webhook`, `webhook-deliveries`, `webhook-delivery`, `webhook-endpoint`, `webhook-endpoints`, `webhook_deliveries`, `webhook_delivery`, `webhook_endpoint`, `webhook_endpoints`, `webhooks`. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `params` | No | object | Resource-specific list filters. Inspect with fibe_schema(resource:&lt;name&gt;, operation:list). Nested fields are defined in the linked JSON schema. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Place resource-specific filters and pagination inside `params`; inspect them with `fibe_schema(resource:<name>, operation:list)`.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
