---
title: "Playgrounds Switch Template"
description: "Switch a deployed playground end-to-end: preserve the playground id, swap it onto a new template shape, provision missing private Gitea/GitHub-backed Repositories for new repos, roll it out, wait, and diagnose failures. Single-call brownfield analog of fibe_greenfield_create."
slug: /reference/tools/playgrounds-switch-template
sidebar_label: "Playgrounds Switch Template"
image: /img/og/reference-tools-playgrounds-switch-template.png
keywords: ["Fibe", "Tool", "fibe", "tool", "playgrounds", "switch", "template"]
tags: ["reference", "tool", "tool"]
format: md
---

Switch a deployed playground end-to-end: preserve the playground id, swap it onto a new template shape, provision missing private Gitea/GitHub-backed Repositories for new repos, roll it out, wait, and diagnose failures. Single-call brownfield analog of fibe_greenfield_create.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Playground ID or slug-safe name of the deployed playground to switch-template. |
| `changelog` | No | string | Optional changelog stamped on the freshly created template version (when template_body is provided). |
| `confirm` | No | boolean | Required true for mode=apply unless server runs with --yolo. |
| `confirm_warnings` | No | boolean | Allow apply to proceed when preview reports switch warnings (e.g. dropped services). |
| `diagnose_on_failure` | No | boolean | When wait fails, attach playground debug summary. Default true. |
| `mode` | No | string | Preview validates and reports diffs/warnings/required variables without writes; apply commits the change. Defaults to apply. Allowed: `preview`, `apply`. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `provision_inputs` | No | array of object | Per-URL overrides for provisioning. Each item: &#123;source_repo_url, name_override?, default_branch?, description?, auto_init?&#125;. Nested fields are defined in the linked JSON schema. |
| `provision_missing_repositories` | No | string | When the new template references repos the player does not yet own a Repository for, automatically provision a fresh git repo (in the player's connected Gitea or GitHub account) and create a Repository for each. Default "gitea" when omitted on this tool. Set to "off" to disable and require existing Repositories. Allowed: `off`, `gitea`, `github`. |
| `provision_private` | No | boolean | Whether the freshly provisioned repos should be private. Defaults to true. |
| `regenerate_variables` | No | array of string | Variable names to regenerate from defaults instead of carrying over. |
| `response_mode` | No | string | Response detail mode for the underlying switch result. Allowed: `summary`, `full`. |
| `reuse_existing_repositories` | No | boolean | Reuse the playground's existing dynamic service Repositories for the target template before creating new ones. Matching keeps same service names first, then current service order; extra old Repositories are retired after the switch when they are no longer referenced. |
| `template_body` | No | string | Inline template YAML. Authoring a new target shape on the fly: a new ImportTemplateVersion is created, then the playground is switched to it. Mutually exclusive with template_version_id. |
| `template_body_path` | No | string | Absolute local path to template YAML (local MCP only). |
| `template_id_or_name` | No | integer or string | Existing ImportTemplate ID or name to use. Without template_body, the latest version is selected. With template_body, a new version is published under this template. |
| `template_name` | No | string | Optional name for the freshly created ImportTemplate when template_body is provided and template_id_or_name is not. Auto-generated otherwise. |
| `template_version_id` | No | integer | Exact existing ImportTemplateVersion to switch to. Mutually exclusive with template_body. Minimum: 1. |
| `variables` | No | object | Template variable values for the new template version. |
| `wait` | No | boolean | Wait for the playground to reach a running state after rollout. Default true. |
| `wait_timeout_seconds` | No | integer | Max seconds to wait. Default 180. Minimum: 1. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use `mode: preview` to inspect changes before applying them. Apply mode requires confirmation unless the MCP gate has been disabled.
- `provision_missing_repositories` accepts `off`, `gitea`, or `github`; this tool defaults to `gitea`. Inspect the preview’s repository and variable requirements.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
