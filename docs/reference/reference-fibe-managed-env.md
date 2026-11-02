---
title: "Fibe Managed Env"
description: "Use to identify Native Fibe environment variables reserved for Compose builds, Task runs, and Agent containers."
slug: /reference/reference-fibe-managed-env
sidebar_label: "Fibe Managed Env"
image: /img/og/reference-reference-fibe-managed-env.png
keywords: ["Fibe", "Reference", "reference", "fibe", "managed", "env"]
tags: ["reference", "reference"]
format: md
---

The Native API supplies some `FIBE_*` values to Compose interpolation, Task runs, image builds, and Agent containers. Treat these as Fibe-owned context. Do not declare a Spec variable or service environment entry that overwrites a reserved name. Use the names expected by your application for its own settings.

## Compose interpolation

| Variable | Available to | Purpose |
| --- | --- | --- |
| `FIBE_SERVICES_<SERVICE_TOKEN>_PATH` | Compose interpolation for source-backed services | Absolute path to a service's checked-out source. The service token is its name uppercased with non-alphanumeric characters replaced by `_`. |

This is a Compose interpolation value. Do not assume it is present inside a running container unless you explicitly pass it through using a different application variable.

## Task run context

The Native Task runner supplies these values to job-mode services when the corresponding source or run information is available:

| Variable | Meaning |
| --- | --- |
| `FIBE_REPOSITORY_URL` | Resolved Repository URL. |
| `FIBE_REPOSITORY_OWNER` | Owner parsed from the Repository URL. |
| `FIBE_REPOSITORY_NAME` | Repository name. |
| `FIBE_REPOSITORY_ID` | Repository identifier. |
| `FIBE_SPEC_ID` | Spec identifier. |
| `FIBE_PLAYGROUND_ID` | Playground or Task identifier. |
| `FIBE_BRANCH` | Resolved source branch. |
| `FIBE_COMMIT_SHA` | Commit associated with the run, when available. |
| `FIBE_TRIGGER_EVENT` | Event that started the run, such as a push or schedule. |

These are run context, not a way to pass arbitrary secrets. Use the installation's supported credential configuration for private values.

## Image build arguments

| Build argument | Purpose |
| --- | --- |
| `FIBE_BUILD_TIME` | Time associated with the build. |
| `FIBE_BUILD_GIT_COMMIT_SHA` | Source commit associated with the build. |

Declare an `ARG` in a Dockerfile if the build needs to consume one. A build argument does not automatically become a runtime `ENV` value.

## Agent container identity

Agent containers receive Native runtime identity values including `FIBE_DOMAIN`, `FIBE_AGENT_ID`, and `FIBE_HOST_ID`. `FIBE_API_KEY` is supplied when the Agent has its linked API key. These values are managed by Fibe; do not override them in custom environment settings.

## Validation

Compose validation recognizes reserved Fibe variables and reports attempts to shadow them. See the current [Compose schema](../reference/json-schema.md) for the supported Spec shape and the [Native API contract](https://whats.fibe.gg/native/openapi.json) for request and response details.

## Related skills

- [mode-job-task](mode-job-task.md) for Task configuration.
- [reference-validation-pipeline](reference-validation-pipeline.md) for Compose validation.
- [fibe-agents-and-automation](fibe-agents-and-automation.md) for Agent and automation workflows.
