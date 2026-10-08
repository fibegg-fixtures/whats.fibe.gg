---
name: reference-fibe-managed-env
description: Use when deciding whether a Fibe-looking environment variable is platform-managed, app-owned, Compose-only, runtime-only, build-only, SDK/MCP-only, or agent-runtime-only.
---

# Reference: Fibe-managed environment variables

Fibe reserves specific env vars for platform wiring. Do not write these keys from a template unless this reference says the surface is user/operator-settable. Application-owned names such as `FIBE_DB_PASS` are allowed, but avoid inventing `FIBE_*` names when a normal app name works.

## Template and Compose surfaces

| Variable | Where available | Owner | How to use |
|---|---|---|---|
| `FIBE_SERVICES_<SERVICE_TOKEN>_PATH` | Compose interpolation for source-backed Playground services | Fibe | Use only when a Compose value needs the absolute clone path of a source-backed service. Token is the service name uppercased with non-alphanumerics replaced by `_`. Not guaranteed inside containers. |
| `FIBE_REPOSITORY_URL` | Job/task runtime env | Fibe | CI scripts can read it for the resolved Repository URL. |
| `FIBE_REPOSITORY_OWNER` | Job/task runtime env | Fibe | Parsed owner from repository URL. |
| `FIBE_REPOSITORY_NAME` | Job/task runtime env | Fibe | Parsed repository name. |
| `FIBE_BRANCH` | Job/task runtime env | Fibe | Resolved service branch. |
| `FIBE_COMMIT_SHA` | Job/task runtime env | Fibe | Trigger commit SHA when available. |
| `FIBE_TRIGGER_EVENT` | Job/task runtime env | Fibe | `manual`, `push`, `pull_request`, `schedule`, or equivalent run source. |
| `FIBE_REPOSITORY_ID` | Job/task runtime env | Fibe | Repository id for the resolved service or primary Repository. |
| `FIBE_SPEC_ID` | Job/task runtime env | Fibe | Spec id. |
| `FIBE_PLAYGROUND_ID` | Job/task runtime env | Fibe | Playground or Task id. |

Template variables should not target these keys with `path`/`paths`. Use app-owned names for app config and leave platform context to Fibe.

## Docker build args

| Variable | Where available | Owner | How to use |
|---|---|---|---|
| `FIBE_BUILD_TIME` | Docker build args | Fibe | Dockerfile must declare `ARG FIBE_BUILD_TIME`. Not runtime env unless copied into `ENV`. |
| `FIBE_BUILD_GIT_COMMIT_SHA` | Docker build args | Fibe | Dockerfile must declare `ARG FIBE_BUILD_GIT_COMMIT_SHA`. Not runtime env unless copied into `ENV`. |

## Agent runtime

| Variable | Where available | Owner | How to use |
|---|---|---|---|
| `FIBE_AGENT_ID` | Agent containers | Fibe | Current Agent identity. |
| `FIBE_API_KEY` | Agent containers and built-in Fibe MCP env | Fibe | Fibe API key for the runtime. Never put provider tokens here. |
| `FIBE_DOMAIN` | Agent containers and built-in Fibe MCP env | Fibe | Fibe API host. |
| `FIBE_HOST_ID` | Agent containers | Fibe | Hosting Host id. |
| `FIBE_WORKSPACE_PATH` | Agent containers when workspace mirroring is enabled | Fibe | Player-visible workspace path for artefact mirroring. |
| `FIBE_SETTINGS_JSON` | fibe-agent settings bridge | Fibe/operator | Fibe normally writes `fibe.yml`; legacy/generated agent Compose may use this JSON settings bridge. Do not use it in app templates. |
| `MCP_CONFIG_JSON` | fibe-agent process env after settings promotion | Fibe/operator | MCP server config consumed by fibe-agent. Usually generated from Fibe settings. |

## SDK, CLI, and MCP operator env

These configure the local `fibe` process. They are not Compose template variables.

| Variable | Surface | Purpose |
|---|---|---|
| `FIBE_API_KEY` | CLI/SDK/MCP | Auth fallback when no profile is configured. |
| `FIBE_DOMAIN` | CLI/SDK/MCP | API domain fallback when no profile is configured. |
| `FIBE_OUTPUT` | CLI | Default output format. |
| `FIBE_MCP_TOOLS` | MCP server | Tool surface: `full`, `core`, or comma-separated tiers. |
| `FIBE_MCP_YOLO` | MCP server | Skip destructive-tool confirmation for intentional non-interactive use. |
| `FIBE_MCP_REQUIRE_AUTH` | MCP server | Require resolved auth in multi-tenant/HTTP mode. |
| `FIBE_MCP_AUDIT_LOG` | MCP server | Write audit JSONL to a file or `stderr`. |
| `FIBE_MCP_PIPELINE_CACHE_SIZE` | MCP server | Pipeline result cache size. |
| `FIBE_MCP_PIPELINE_CACHE_ENTRY_MAX` | MCP server | Max bytes per cached pipeline entry. |
| `FIBE_MCP_PIPELINE_MAX_STEPS` | MCP server | Max steps in one pipeline. |
| `FIBE_MCP_PIPELINE_MAX_ITERATIONS` | MCP server | Max total `for_each` iterations. |

## Local and E2E operator env

Keys such as `FIBE_LOCAL_TRAEFIK_CERT_PATH`, `FIBE_LOCAL_TRAEFIK_KEY_PATH`, `FIBE_E2E_TIMEOUTS`, `FIBE_E2E_PARALLELISM`, `FIBE_E2E_SETTINGS`, `FIBE_AGENT_E2E_IMAGE_SOURCE`, and `FIBE_AGENT_E2E_IMAGE_REPOSITORY` are Fibe development/test harness knobs. Do not depend on them in user templates.

## Validation behavior

Compose validation warns when a service `environment:` defines a known platform-managed key or a `FIBE_SERVICES_*_PATH` key. It intentionally does not warn on arbitrary app-owned `FIBE_*` names such as `FIBE_DB_PASS`.

Job ENV entries reject every `FIBE_*` key because those entries are reusable runtime injections and would conflict with Fibe platform context.

## Related skills

[reference-validation-pipeline](reference-validation-pipeline.md), [mode-job-task](mode-job-task.md), [fibe-agents-and-automation](fibe-agents-and-automation.md), [recipe-whole-node-paths](recipe-whole-node-paths.md).
