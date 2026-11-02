---
title: "Greenfield Create"
description: "Create one or more repositories and Fibe Repositories, an app-owned template version, deployed playground, wait for running, and link it locally."
slug: /reference/tools/greenfield-create
sidebar_label: "Greenfield Create"
image: /img/og/reference-tools-greenfield-create.png
keywords: ["Fibe", "Tool", "fibe", "tool", "greenfield", "create"]
tags: ["reference", "tool", "tool"]
format: md
---

Create one or more repositories and Fibe Repositories, an app-owned template version, deployed playground, wait for running, and link it locally.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `config_path` | No | string | Config file path inside the GitHub repository. Optional; defaults to fibe.yml, fibe.yaml, docker-compose.yml, docker-compose.yaml. |
| `git_provider` | No | string | Destination git provider: gitea or github. Optional; default: gitea. Allowed: `gitea`, `github`. |
| `github_account` | No | string | GitHub App installation account owner to use when multiple installations are connected. |
| `github_installation_id` | No | number | GitHub App installation ID to use when multiple installations are connected. Minimum: 1. |
| `github_ref` | No | string | Git branch, tag, or commit for the config file. Optional. |
| `host_id_or_name` | No | string | Target host ID or name. Optional; defaults to the current Host from FIBE_HOST_ID. The Host must be reachable and authorized for the operation. |
| `name` | No | string | Repository/app name; must be unique. Optional when repository_url is provided; inferred from repo name. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `private` | No | boolean | Create destination repository as private. Optional; Fibe defaults Gitea greenfield repos to private. |
| `repository_url` | No | string | GitHub repository as owner/repo, owner/repo@ref, or https://github.com/owner/repo. Optional alternative to template inputs. |
| `service_subdomains` | No | object | Exposed service subdomain overrides, e.g. &#123;"app":"my-app","admin":"my-app-admin"&#125;. Optional. Nested fields are defined in the linked JSON schema. |
| `template_body` | No | string | Template YAML body to use directly. Optional; cannot be combined with template_id_or_name, template_version_id, or version. |
| `template_body_path` | No | string | Absolute local path to a template YAML file (local MCP only). Optional; cannot be combined with template_body, template_id_or_name, template_version_id, or version. |
| `template_id_or_name` | No | string | Template ID or name to use. Optional; defaults to the base template. |
| `template_version_id` | No | number | Exact template version ID to use. Optional; cannot be combined with template_id_or_name or version. Minimum: 1. |
| `variables` | No | object | Template variables map, e.g. &#123;"app_name":"Tower"&#125;. Optional. Nested fields are defined in the linked JSON schema. |
| `version` | No | string | Template version tag or number for template_id_or_name, e.g. v1. Optional; defaults to latest available version. |
| `wait_timeout` | No | string | Max wait duration, e.g. 10m. Optional; default: 10m. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Choose a template, exact template version, inline template body, or repository config as the source. Use `git_provider` to choose `gitea` or `github` for destination repositories.
- Source selectors are mutually exclusive where described by the schema. Deployment needs an accessible Host and the required repository permissions.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
