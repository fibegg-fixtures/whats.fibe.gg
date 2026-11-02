---
title: "Launch"
description: "Launch from exactly one source: template, template version, spec, compose YAML, or repository config."
slug: /reference/tools/launch
sidebar_label: "Launch"
image: /img/og/reference-tools-launch.png
keywords: ["Fibe", "Tool", "fibe", "tool", "launch"]
tags: ["reference", "tool", "tool"]
format: md
---

Launch from exactly one source: template, template version, spec, compose YAML, or repository config.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `compose_yaml` | No | string | Docker Compose or Fibe YAML content. Optional when repository_url is provided. |
| `compose_yaml_path` | No | string | Absolute local path to Docker Compose or Fibe YAML (local MCP only). Optional when repository_url is provided. |
| `config_path` | No | string | Config file path inside the GitHub repository. Optional; defaults to fibe.yml, fibe.yaml, docker-compose.yml, docker-compose.yaml. |
| `create_playground` | No | boolean | Force playground creation. Defaults to true when host_id_or_name is set, false otherwise. |
| `diagnose_on_failure` | No | boolean | Diagnose failed waits where supported. |
| `env_overrides` | No | object | Runtime environment overrides for the created Playground. Nested fields are defined in the linked JSON schema. |
| `env_pack_attachments` | No | array or null | Ordered pack references for a Playground or job-mode Spec (service Specs reject non-empty lists with 422). Omit or null to preserve/inherit; [] explicitly detaches all packs. Nested fields are defined in the linked JSON schema. |
| `github_account` | No | string | GitHub App installation account owner to use when multiple installations are connected. |
| `github_installation_id` | No | number | GitHub App installation ID to use when multiple installations are connected. Minimum: 1. |
| `github_ref` | No | string | Git branch, tag, or commit for the config file. Optional. |
| `host_id_or_name` | No | string | Target host ID or name. Required for template/spec launch; compose/repo can omit to create only the spec unless create_playground is true. |
| `job_mode` | No | boolean | Create as a task/job instead of a playground. Requires host_id_or_name. |
| `name` | No | string | Launch name. Optional when repository_url is provided; inferred from repo name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `persist_volumes` | No | boolean | Persist Docker volumes across task/playground recreations. Optional; omitted means the server infers from named compose volumes. |
| `repository_mappings` | No | object | Map repository URL to Repository ID or name. Optional. Nested fields are defined in the linked JSON schema. |
| `repository_url` | No | string | GitHub repository as owner/repo, owner/repo@ref, or https://github.com/owner/repo. Optional alternative to compose_yaml. |
| `response_mode` | No | string | Server response detail mode where supported. Allowed: `summary`, `full`. |
| `service_subdomains` | No | object | Per-service subdomain overrides. Nested fields are defined in the linked JSON schema. |
| `services` | No | object | Per-service runtime Playground configuration overrides. Nested fields are defined in the linked JSON schema. |
| `spec_id_or_name` | No | string | Existing spec ID or name. Mutually exclusive with other source fields. |
| `template_id_or_name` | No | string | Template ID or name. Mutually exclusive with other source fields; without version/template_version_id, latest version is used. |
| `template_version_id` | No | number | Exact template version ID. Mutually exclusive with other source fields. Minimum: 1. |
| `variables` | No | object | Template variables map for Fibe template compilation. Optional. Nested fields are defined in the linked JSON schema. |
| `version` | No | number | Template version number for template_id_or_name. Optional; defaults to latest available version. |
| `wait` | No | boolean | Wait for created playground to reach running where supported. |
| `wait_timeout_seconds` | No | number | Wait timeout in seconds. Minimum: 1. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Choose exactly one source: `template_id_or_name`, `template_version_id`, `spec_id_or_name`, `compose_yaml`/`compose_yaml_path`, or `repository_url`.
- Use `compose_yaml` for inline Compose content. Repository config revision and service source branches are separate choices.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
