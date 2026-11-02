# Native FIBE public skill capabilities

This repository helps people understand and author workloads for a self-hosted
FIBE installation. It describes the API and React commits in
[content-sources.json](content-sources.json); loading a guide does not grant
credentials or establish that a remote workflow has passed qualification.

| Outcome | Canonical guides |
| --- | --- |
| Choose Hosts, Repositories, Specs, Playgrounds, Tasks, Agents and Library resources | [Product map](skills/fibe-product-map.md), [glossary](skills/glossary.md) |
| Understand personal and Team ownership, permissions, quotas and integrations | [Security and access](skills/fibe-security-access-and-integrations.md) |
| Follow creation, asynchronous work, failure, recovery and deletion boundaries | [Resource lifecycles](skills/fibe-resource-lifecycles.md) |
| Configure Agent workflows, conversation controls and Library context | [Agents and automation](skills/fibe-agents-and-automation.md) |
| Convert a Compose application into a reusable template | [Compose conversion](skills/convert-compose-to-fibe.md), [validation](skills/reference-validation-pipeline.md) |
| Choose service exposure, source mounting, variables, Secrets and Job ENV | [Feature surface](skills/fibe-feature-surface.md), [template variables](skills/reference-template-variables.md) |
| Prepare long-running services, one-shot Tasks, schedules and VCS triggers | [Job mode](skills/mode-job-task.md), [schedule mode](skills/mode-schedule-cron.md), [VCS mode](skills/mode-trigger-vcs.md) |
| Discover released SDK/CLI/MCP consumer commands | [Tool index](docs/sdk/tools-catalog.md), [public tool guides](seed-skills/README.md) |
| Inspect exact Native API request, response and security contracts | [API introduction](docs/api/intro.md), [OpenAPI](static/native/openapi.json) |

The authoring guides retain runnable Compose shapes for static images, optional
source-backed inputs, routes, named volumes, dependencies, configs, build arguments
and typed template variables. Whether a selected source build, rollout, provider
or Agent workflow completes depends on the installed build and its configuration;
check the operation's result and current runtime state.

Native has no billing, payments, rewards, managed tutorial Hosts, licensing or AI
Gateway. Accounts, supported authentication, Teams, access restrictions, Audit Logs,
nonfinancial quotas and operator settings remain part of the product. The guide
does not promise hosted-service fallback, SaaS credential import or Host takeover.

The public guide and skills contain product help. Contributor bootstrap,
qualification matrices and deployment procedures belong to their owning Native
workspace repositories and are not exposed as public automation skills here.
