---
title: "Product Map"
description: "Use to understand Fibe's self-hosted product model, core resources, and the path from a Repository to a running Playground."
slug: /reference/fibe-product-map
sidebar_label: "Product Map"
image: /img/og/reference-fibe-product-map.png
keywords: ["Fibe", "Foundation", "fibe", "product", "map"]
tags: ["reference", "foundation"]
format: md
---

Fibe is a self-hosted application for running containerized environments on Hosts you configure. The Native application combines a Rust API backed by SQLite with a React interface. A Host is the machine and Docker environment where Fibe runs work.

## Mental model

```
Team or personal workspace
  owns Hosts, Repositories, Specs, Agents, and Library records

Repository + Compose definition + launch choices
  becomes a Spec
    starts a long-running Playground

Repository + Task configuration
  starts a Task run

Agent
  works with a user in a Playground or its own conversation
```

The selected owner scopes the resources and access. A Team is a shared owner; personal resources remain personal. A Repository holds connected source and can be used as input to a Spec. A Spec records the configured environment. A Playground is a long-running instance of that configuration. A Task is a bounded run intended to finish.

## Core resources

| Resource | Meaning |
| --- | --- |
| Host | A Docker-capable machine configured for Fibe to run Playgrounds and Tasks. |
| Repository | A connected source repository used to supply Compose files, application code, or other build inputs. |
| Spec | A configured environment definition that can be inspected and used to start a Playground or Task. |
| Playground | A long-running environment on a Host, with service state, logs, and any configured routes. |
| Task | A run intended to complete, such as a test or scheduled operation. |
| Team | A shared resource owner for members of the same workspace. |
| Agent | An assistant configuration that can participate in work associated with a Playground or conversation. |
| Library | A place for reusable Fibe records and configuration used by the workspace. |
| Audit Logs | Read-only records of supported actions and changes. |

## Typical workflow

1. Configure a Host that Fibe can reach and use.
2. Connect a Repository or provide a Compose definition.
3. Create or update a Spec from that source and its launch settings.
4. Start a Playground for work that should remain available, or start a Task for work that should finish.
5. Inspect the resulting resource, its services, logs, and status; update the Spec and apply changes through the available resource actions.
6. Use an Agent where an assistant workflow is useful, and use Audit Logs to review recorded changes.

## Compose and service routing

Fibe Specs use Compose-based service definitions with Fibe configuration layered onto the Compose document. Consult the current [Fibe Compose schema](../reference/json-schema.md) and [label reference](reference-fibe-labels.md) for supported fields. Keep service-to-service traffic on the Compose network. Configure user-facing routes with the supported Fibe labels rather than relying on host port bindings.

## Related skills

- [glossary](glossary.md) for concise definitions.
- [fibe-feature-surface](fibe-feature-surface.md) for the main feature areas.
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md) for resource transitions.
- [convert-compose-to-fibe](convert-compose-to-fibe.md) for Compose authoring.
