---
title: Tools catalog
description: Reviewed public tool guides and exact input schemas for the released SDK v0.3.3.
slug: /sdk/tools-catalog
sidebar_position: 7
sidebar_label: Tools catalog
image: /img/og/sdk-tools-catalog.png
keywords: [MCP tools, fibe tools, tool catalog, resource_mutate, greenfield_create, pipeline]
---

These **53 public tool guides** describe the released SDK **v0.3.3** input contracts. Their parameter names, required fields, enums, and nested schemas are generated from an offline inspection of that release. Reviewed descriptions follow the current Native product scope. Server availability and permissions still depend on your installation.

Use the [complete JSON tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) for machine-readable contracts. To discover every registered tool on your running MCP server, including tools without a guide here, call `fibe_tools_catalog` with `include_schema: true`. A hidden tool can be reached with `fibe_call` using its `tool` and `args` fields.

## Discovery and orchestration

| Tool | Purpose |
| --- | --- |
| [`fibe_call`](/reference/tools/call/) | Invoke a registered Fibe tool that is hidden by the current tool tier. Prefer direct tool calls when the concrete tool is advertised; use fibe_tools_catalog/fibe_schema only when the hidden tool name or args are unclear. |
| [`fibe_doctor`](/reference/tools/doctor/) | Run self-diagnostic checks: verify API key, connectivity, and display user profile |
| [`fibe_help`](/reference/tools/help/) | Display detailed CLI help documentation for a specific Fibe command path. Extremely useful to look up flag descriptions or expected payload shapes. |
| [`fibe_pipeline`](/reference/tools/pipeline/) | Execute multiple tool calls in one round trip and pass results between them with JSONPath bindings. Use it to reduce round trips when creating and waiting for jobs. |
| [`fibe_pipeline_result`](/reference/tools/pipeline-result/) | Look up a cached result from an earlier pipeline execution. |
| [`fibe_run`](/reference/tools/run/) | Last-resort escape hatch: invoke an arbitrary Fibe CLI command when no dedicated MCP tool fits. Use sparingly. |
| [`fibe_schema`](/reference/tools/schema/) | Return JSON Schema definitions and the schema resource catalog. |
| [`fibe_status`](/reference/tools/status/) | Show resource counts, quotas, and rate limits for the account. |
| [`fibe_tools_catalog`](/reference/tools/tools-catalog/) | List every registered Fibe MCP tool, including hidden tools that cannot all be advertised directly. |

## Resources and account settings

| Tool | Purpose |
| --- | --- |
| [`fibe_agent_defaults_get`](/reference/tools/agent-defaults-get/) | Read the authenticated player's agent default overrides. |
| [`fibe_agent_defaults_reset`](/reference/tools/agent-defaults-reset/) | Clear all player agent default overrides so admin defaults apply. |
| [`fibe_agent_defaults_update`](/reference/tools/agent-defaults-update/) | Replace the authenticated player's agent default overrides. Use the same agent_defaults JSON shape as the profile UI. |
| [`fibe_artefact_upload`](/reference/tools/artefact-upload/) | Upload and save an artefact from inline text or file content. |
| [`fibe_memorize`](/reference/tools/memorize/) | Create or update agent-generated memories grounded in one local source conversation. |
| [`fibe_mutter`](/reference/tools/mutter/) | Create one short mutter for an agent: a visible internal note used for progress, proof, blocker, or problem updates. |
| [`fibe_resource_delete`](/reference/tools/resource-delete/) | Delete a supported flat Fibe resource by ID, name, or key where supported. |
| [`fibe_resource_get`](/reference/tools/resource-get/) | Get a supported Fibe resource by ID, name, or key where supported. Playground reads include service_urls and service runtime status. Use artefact_attachment or agent_attachment to download attached runtime file content. |
| [`fibe_resource_list`](/reference/tools/resource-list/) | List a supported flat Fibe resource. Use fibe_schema with resource=list to discover resource names, aliases, and list params. |
| [`fibe_resource_mutate`](/reference/tools/resource-mutate/) | Create, update, or run a supported resource-scoped mutation with a payload validated against fibe_schema before any API request. |
| [`fibe_update_name`](/reference/tools/update-name/) | Update your own agent name. |

## Launch and repository creation

| Tool | Purpose |
| --- | --- |
| [`fibe_gitea_repos_create`](/reference/tools/gitea-repos-create/) | Create a managed Gitea repo and matching Repository. For multi-service switches, batch independent repo creation with fibe_pipeline before seeding source and applying fibe_playgrounds_switch_template. |
| [`fibe_github_repos_create`](/reference/tools/github-repos-create/) | Register and connect a new GitHub repository |
| [`fibe_greenfield_create`](/reference/tools/greenfield-create/) | Create one or more repositories and Fibe Repositories, an app-owned template version, deployed playground, wait for running, and link it locally. |
| [`fibe_launch`](/reference/tools/launch/) | Launch from exactly one source: template, template version, spec, compose YAML, or repository config. |
| [`fibe_templates_search`](/reference/tools/templates-search/) | Search available Templates by text or a bounded regular expression. |

## Playground operations

| Tool | Purpose |
| --- | --- |
| [`fibe_feedbacks_get`](/reference/tools/feedbacks-get/) | Get one feedback entry for an agent, including player comments about artefacts or mutters. |
| [`fibe_feedbacks_list`](/reference/tools/feedbacks-list/) | List all feedback entries associated with an agent. |
| [`fibe_local_playgrounds_info`](/reference/tools/local-playgrounds-info/) | Inspect local playground names, current link state, repo roots, URLs, mounts, or details from /opt/fibe/playgrounds or HOST_ROOT. |
| [`fibe_local_playgrounds_link`](/reference/tools/local-playgrounds-link/) | Link local playground mounts into a working directory. |
| [`fibe_logs_follow`](/reference/tools/logs-follow/) | Stream live playground or task logs as progress notifications. Omitting service streams all services. |
| [`fibe_playgrounds_action`](/reference/tools/playgrounds-action/) | Run one playground lifecycle action: rollout, hard_restart, stop, start, retry_compose, enable_maintenance, or disable_maintenance. |
| [`fibe_playgrounds_debug`](/reference/tools/playgrounds-debug/) | Retrieve Playground service, container, port, path, label, status, URL, and recent-log diagnostics. |
| [`fibe_playgrounds_logs`](/reference/tools/playgrounds-logs/) | Retrieve playground logs. Omitting service returns all services. |
| [`fibe_playgrounds_switch_template`](/reference/tools/playgrounds-switch-template/) | Switch a deployed playground end-to-end: preserve the playground id, swap it onto a new template shape, provision missing private Gitea/GitHub-backed Repositories for new repos, roll it out, wait, and diagnose failures. Single-call brownfield analog of fibe_greenfield_create. |
| [`fibe_playgrounds_wait`](/reference/tools/playgrounds-wait/) | Block and poll until a playground reaches a specified target state and, for running playgrounds by default, reported services are ready. |
| [`fibe_templates_change`](/reference/tools/templates-change/) | Advanced template change primitive: preview or apply template patches/overwrites, switch specs/playgrounds/tasks to existing template versions, and optionally roll out or trigger a fresh task run. Hidden advanced tool; invoke through `fibe_call`. |

## Agent observation and conversations

| Tool | Purpose |
| --- | --- |
| [`fibe_agents_activity`](/reference/tools/agents-activity/) | Read agent activity, optionally scoped to a conversation. |
| [`fibe_agents_create_conversation`](/reference/tools/agents-create-conversation/) | Create or upsert an agent conversation. |
| [`fibe_agents_delete_conversation`](/reference/tools/agents-delete-conversation/) | Delete an agent conversation. |
| [`fibe_agents_duplicate`](/reference/tools/agents-duplicate/) | Duplicate an agent configuration. |
| [`fibe_agents_interrupt`](/reference/tools/agents-interrupt/) | Interrupt a running agent turn. |
| [`fibe_agents_live_state`](/reference/tools/agents-live-state/) | Check conversation-scoped agent live stream state. |
| [`fibe_agents_messages`](/reference/tools/agents-messages/) | Read agent messages, optionally scoped to a conversation. |
| [`fibe_agents_runtime_status`](/reference/tools/agents-runtime-status/) | Check agent reachability, authentication, queue, and processing state. |
| [`fibe_agents_send_message`](/reference/tools/agents-send-message/) | Send one text message to an agent chat. |
| [`fibe_agents_start_chat`](/reference/tools/agents-start-chat/) | Start or reconnect an agent chat on the current Host. |
| [`fibe_monitor_follow`](/reference/tools/monitor-follow/) | Stream agent-produced events as live MCP progress notifications |
| [`fibe_monitor_list`](/reference/tools/monitor-list/) | List agent-produced monitor events |
| [`fibe_mutters_get`](/reference/tools/mutters-get/) | Retrieve an agent's mutter stream by id_or_name, with optional query/status/severity/playground filters. |

## Repository credentials

| Tool | Purpose |
| --- | --- |
| [`fibe_auth_set`](/reference/tools/auth-set/) | Set the API key and domain for this MCP session. |
| [`fibe_find_github_repos`](/reference/tools/find-github-repos/) | Search Personal installations or a selected verified Team installation. |
| [`fibe_get_github_token`](/reference/tools/get-github-token/) | Get the server-provided GitHub credential for an authorized repository. |
| [`fibe_repo_status_check`](/reference/tools/repo-status-check/) | Check Git repository access and readiness for the configured installation. |

## Input and confirmation rules

Each guide lists the actual input fields. Resource-specific identifiers and filters may belong inside a payload or `params` object rather than at the top level. Consult `fibe_schema` for resource-operation payloads.

Destructive tools require explicit confirmation unless the MCP confirmation gate has been disabled. Where a release’s advertised tool schema omits the confirmation field, use `fibe_call` with top-level `confirm: true` to forward confirmation. The read-only, destructive, and idempotent annotations describe the tool; they do not grant authority or establish a successful remote result.

See [Common workflows](/sdk/workflows/) for launch, template switching, pipelines, and monitoring examples.
