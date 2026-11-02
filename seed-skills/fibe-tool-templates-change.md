---
name: fibe-tool-templates-change
description: "Advanced template change primitive: preview or apply template patches/overwrites, switch specs/playgrounds/tasks to existing template versions, and optionally roll out or trigger a fresh task run."
---
# fibe_templates_change

Advanced template change primitive: preview or apply template patches/overwrites, switch specs/playgrounds/tasks to existing template versions, and optionally roll out or trigger a fresh task run.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `change_type` | Yes | string | Advanced template change workflow. patch creates a new version of the existing template; overwrite replaces the body of an existing version; switch_existing repoints the spec/playground/task at a different template version. Allowed: `patch`, `overwrite`, `switch_existing`. |
| `mode` | Yes | string | Preview validates and diffs without writes; apply creates/switches resources. Allowed: `preview`, `apply`. |
| `target_id_or_name` | Yes | integer or string | ID or name of the target object. |
| `target_type` | Yes | string | Object to start from. With target_type=playground and change_type=switch_existing, this performs an advanced template-version switch for a deployed playground. Allowed: `template`, `spec`, `playground`, `task`. |
| `base_version_id` | No | integer | Base template version ID for patch or overwrite. Defaults from target when possible. Minimum: 1. |
| `changelog` | No | string | Human-readable changelog for a created template version. |
| `confirm` | No | boolean | Required for mode=apply unless the MCP server runs with --yolo. Not required for previews. |
| `confirm_warnings` | No | boolean | Allow apply when preview reports switch warnings. |
| `diagnose_on_failure` | No | boolean | Attach playground diagnostics when a wait fails. |
| `edits` | No | array of object | Alias for patches. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `patches` | No | array of object | Patch entries: YAML path set/remove or exact search/replace. |
| `post_apply` | No | string | Optional action after apply. Tasks should use trigger_task; normal playgrounds can use rollout_target or rollout_all. Allowed: `none`, `rollout_target`, `rollout_all`, `trigger_task`. |
| `provision_inputs` | No | array of object | Per-URL overrides for provisioning. Each item: &#123;source_repo_url, name_override?, default_branch?, description?, auto_init?&#125;. source_repo_url must match a URL declared by the new template's services. Nested fields are defined in the linked JSON schema. |
| `provision_missing_repositories` | No | string | When the new template references repos the player does not yet own a Repository for, automatically provision a fresh git repo (in the player's connected Gitea or GitHub account) and create a Repository for each. "gitea" provisions Gitea-backed private repos seeded from the template's source URLs. "off" (default) keeps today's behaviour: public repos auto-create Repositories, private/missing repos fail with a manual-creation hint. Allowed: `off`, `gitea`, `github`. |
| `provision_private` | No | boolean | Whether the freshly provisioned repos should be private. Defaults to true. |
| `public` | No | boolean | Make the created template version public. |
| `regenerate_variables` | No | array of string | Variable names to regenerate while switching. |
| `response_mode` | No | string | Response detail mode. Allowed: `summary`, `full`. |
| `reuse_existing_repositories` | No | boolean | Reuse the target spec/playground's current dynamic service Repositories before provisioning new ones. Same-name services keep their Repository first; remaining services reuse existing Repositories in current service order; extras are retired after apply when no longer referenced. |
| `switch_variables` | No | object | Template variables to use when switching a spec. |
| `target_template_version_id` | No | integer | Existing template version ID to switch the target's spec to. Required for change_type=switch_existing. Can belong to a completely different template: the server reconciles the repository set and regenerates services. Minimum: 1. |
| `template_body` | No | string | Full replacement template YAML for overwrite. |
| `template_body_path` | No | string | Absolute local path to full replacement template YAML. |
| `wait` | No | boolean | Wait for rollout targets or triggered task completion. |
| `wait_timeout_seconds` | No | integer | Maximum seconds to wait. Minimum: 1. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- This is a hidden advanced tool. Discover its schema with `fibe_tools_catalog` and invoke it through `fibe_call` when it is not advertised.
- The required selector fields are `target_type`, `target_id_or_name`, `mode`, and `change_type`. Preview before apply; apply requires confirmation.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
