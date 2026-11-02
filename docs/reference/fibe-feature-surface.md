---
title: "Feature Surface"
description: "Use to orient users around Fibe's Native self-hosted features and choose the right resource for a workflow."
slug: /reference/fibe-feature-surface
sidebar_label: "Feature Surface"
image: /img/og/reference-fibe-feature-surface.png
keywords: ["Fibe", "Foundation", "fibe", "feature", "surface"]
tags: ["reference", "foundation"]
format: md
---

Use this guide when someone asks what Fibe is for or where a workflow belongs. Fibe is self-hosted: the operator configures Hosts and runs the application and its data in their own environment.

## Hosts and runtime

A Host is a Docker-capable machine configured for Fibe. Playgrounds and Tasks run there. Host configuration connects Fibe to the machine and provides the runtime context for workloads.

## Repositories and Specs

Repositories provide source code and Compose files. A Spec describes the environment Fibe can start from a repository or Compose definition, together with its configuration. Use a Repository when the question concerns source or build inputs; use a Spec when it concerns the environment definition and launch settings.

## Playgrounds and Tasks

Choose a Playground for an environment that should stay available. Choose a Task for work expected to finish, such as a test or a scheduled operation. Both run against a Host; use the resource's own status and logs to understand what happened.

Compose services communicate over their Compose network. Fibe's supported service labels describe routing and other Fibe-specific behavior. The [Compose schema](../reference/json-schema.md) and [label guide](reference-fibe-labels.md) are the source of truth for accepted fields.

## Teams, Agents, and Library

Teams provide shared ownership for workspace resources. Access follows the resource owner and the current Team membership rules. Agents are assistant configurations associated with workspace activity. Library holds reusable configuration and records, including ENV packs that can be attached to a Spec or Playground.

## Audit and access

Audit Logs provide a history of supported actions. Use them for review and accountability. API access is scoped by the credentials and authorization rules configured for the self-hosted installation.

## Where to start

- To bring up a workload, begin with a Host, a Repository or Compose definition, and a Spec.
- To keep a service available, use a Playground.
- To run finite work, use a Task.
- To share resources, use a Team as their owner.
- To understand a change, inspect the resource and its Audit Logs.

## Related skills

- [fibe-product-map](fibe-product-map.md) for the resource model.
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md) for lifecycle concepts.
- [fibe-security-access-and-integrations](fibe-security-access-and-integrations.md) for ownership and access.
