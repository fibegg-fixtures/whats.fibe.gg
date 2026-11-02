---
title: Native behavior reference
description: Source-pinned Native Fibe Compose, resource, and API reference with links to the authoritative contracts.
slug: /reference/platform-behavior-contracts
sidebar_position: 7
keywords: [Fibe, Native, API, Compose, contracts, reference]
---

# Native behavior reference

This page summarizes behavior visible in the Native API and Compose implementation. The published [OpenAPI contract](/native/openapi.json), [route manifest](/native/route-manifest.json), and [Compose schema](/schemas/fibe-compose.v1.schema.json) carry the precise operation and field shapes. The website source manifest records the reviewed source revisions. A source review describes those commits; it does not qualify an installed runtime or a released consumer.

## Product resources

The Native application exposes resources using the terms Host, Spec, Repository, Team, Task, Agent, Library, Audit Logs, and Playground. A Host provides the runtime context for workloads. A Spec describes configuration. A Playground is a long-running environment; a Task is work intended to complete. Repositories supply connected source. Team ownership scopes shared resources and is enforced by API authorization.

The API contract includes resource routes for Hosts, Repositories, Specs, Playgrounds, Tasks, Agents, Teams, Library records, and Audit Logs. Use the OpenAPI document to inspect each operation's parameters, request body, and response schema.

## Compose and Spec configuration

Fibe adds a supported label namespace to Compose service definitions. The Native parser recognizes these 21 labels:

`repo_url`, `source_mount`, `job_watch`, `dockerfile`, `env_file`, `start_command`, `port`, `visibility`, `production`, `zerodowntime`, `branch`, `subdomain`, `path_rule`, `build_target`, `build_args`, `healthcheck_path`, `healthcheck_interval`, `healthcheck_timeout`, `healthcheck_retries`, and `healthcheck_start_period`.

Unknown labels in the configured Fibe namespace fail parsing. Fibe validates values and cross-field rules before generating runtime Compose. Use the [label guide](/reference/reference-fibe-labels) for examples and the [versioned schema](/schemas/fibe-compose.v1.schema.json) for the accepted shape.

Compose variables are declared under `x-fibe.gg.variables` and can bind values to YAML paths. Native validation checks variable names, references, defaults, and target service paths. See [template variables](/reference/reference-template-variables) and the [validation pipeline](/reference/reference-validation-pipeline).

## Tasks and automation

The Native API represents finite work as Tasks and exposes operations to list, retrieve, trigger, rerun, and cancel Task runs. Spec configuration also includes schedule and repository-trigger operations. Exact request fields and authorization requirements are in the [OpenAPI contract](/native/openapi.json).

Compose's `fibe.gg/job_watch` label identifies services whose exit is used to determine a Task outcome. Configure the command to finish when its work is done. Keep long-running application services in a Playground workload.

## Vault Secrets, Job ENV, and ENV packs

The Secret Vault stores owner-bound values encrypted at rest. Ordinary Secret reads expose metadata without the plaintext. A Job ENV entry can hold a value directly or reference a Vault Secret; it may be scoped to a Repository. Task admission captures eligible entries for that run, and secret entries are withheld from pull-request-triggered runs. Job ENV keys cannot begin with `FIBE_`.

ENV packs are reusable environment maps in the Library. Their values are encrypted at rest and can be attached to a Spec or Playground, optionally targeting selected service names. Use Vault Secrets for credentials and ENV packs for reusable settings.

## Native runtime environment

The API supplies run context to Task services, including Repository URL, Repository ID/name/owner, Spec ID, Playground ID, branch, commit when available, and trigger event. Source-backed Compose interpolation can use `FIBE_SERVICES_<SERVICE_TOKEN>_PATH`. Image builds can receive `FIBE_BUILD_TIME` and `FIBE_BUILD_GIT_COMMIT_SHA`.

Agent container identity includes `FIBE_DOMAIN`, `FIBE_AGENT_ID`, and `FIBE_HOST_ID`. `FIBE_API_KEY` is supplied when the Agent has its linked API key. The Native API rejects attempts by custom Agent environment to override reserved identity values. See [Fibe-managed environment variables](/reference/reference-fibe-managed-env) for the practical reference.

## Hosts and data

Hosts are configured by the installation operator. The API provides Host connection testing and runtime operations, while the Docker runtime executes Playgrounds and Tasks. Compose named volumes and external storage have different lifecycles from containers; include persistent data in the operator's backup and recovery plan.

## Audit and authorization

The Native API exposes read operations for Audit Logs. Access to resources is checked against their personal or Team owner. A resource identifier alone does not grant access; use credentials authorized for the owner and operation.

## Contract pins and evidence

The source manifest pins the API and UI revisions reviewed for this reference. The consumer SDK release is separately identified there as v0.3.3. No released-consumer tool conformance is implied by the published source contracts.

For the full service label semantics, see [Fibe labels](/reference/reference-fibe-labels). For public guides corresponding to built-in tools, see [tool references](/reference/tools/tools-catalog).
