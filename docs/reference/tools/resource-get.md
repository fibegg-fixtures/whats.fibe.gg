---
title: "Resource Get"
description: "Get a supported Fibe resource by ID, name, or key where supported. Playground reads include service_urls and service runtime status. Use artefact_attachment or agent_attachment to download attached runtime file content."
slug: /reference/tools/resource-get
sidebar_label: "Resource Get"
image: /img/og/reference-tools-resource-get.png
keywords: ["Fibe", "Tool", "fibe", "tool", "resource", "get"]
tags: ["reference", "tool", "tool"]
format: md
---

Get a supported Fibe resource by ID, name, or key where supported. Playground reads include service_urls and service runtime status. Use artefact_attachment or agent_attachment to download attached runtime file content.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `resource` | Yes | string | Canonical resource name or explicit alias, e.g. playground, artefact, artefact_attachment, spec, repository, webhook. Allowed: `agent`, `agent-attachment`, `agent-attachments`, `agent-poke`, `agent-pokes`, `agent-upload`, `agent-uploads`, `agent_attachment`, `agent_attachments`, `agent_poke`, `agent_pokes`, `agent_upload`, `agent_uploads`, `agents`, `artefact`, `artefact-attachment`, `artefact-attachments`, `artefact_attachment`, `artefact_attachments`, `artefacts`, `env-pack`, `env-packs`, `env_pack`, `env_packs`, `host`, `hosts`, `import-template`, `import-templates`, `import_template`, `import_templates`, `job-env`, `job-environment`, `job-environments`, `job-envs`, `job_env`, `job_environment`, `job_environments`, `job_envs`, `memories`, `memory`, `playground`, `playgrounds`, `pokes`, `repositories`, `repository`, `secret`, `secrets`, `spec`, `specs`, `task`, `tasks`, `template`, `templates`, `webhook`, `webhook-endpoint`, `webhook-endpoints`, `webhook_endpoint`, `webhook_endpoints`, `webhooks`. |
| `agent_id_or_name` | No | string | Agent ID or name for resource-specific reads such as agent_attachment. |
| `conversation_id` | No | string | Runtime conversation/thread ID for resource-specific reads such as agent_attachment. |
| `filename` | No | string | Runtime filename for resource-specific reads such as agent_attachment. |
| `id` | No | number | Numeric ID of the selected resource. Minimum: 1. |
| `id_or_key` | No | string | Numeric ID or key for secrets. |
| `id_or_name` | No | string | Numeric ID or name for named resources. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Choose a supported `resource` and the identifier form it uses. Attachment reads also need the applicable Agent, filename, or conversation fields.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
