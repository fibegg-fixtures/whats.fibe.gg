---
title: "Glossary"
description: "Define Native Fibe's core resource names and Compose terms."
slug: /reference/glossary
sidebar_label: "Glossary"
image: /img/og/reference-glossary.png
keywords: ["Fibe", "Skill", "glossary"]
tags: ["reference", "skill"]
format: md
---

Use these definitions consistently when explaining Native Fibe.

| Term | Meaning |
| --- | --- |
| Host | A Docker-capable machine configured to run Fibe workloads. |
| Repository | A connected source repository used by a Spec or other workflow. |
| Spec | A configured environment definition that Fibe can use to start a Playground or Task. |
| Playground | A long-running environment running on a Host. |
| Task | A run intended to finish, such as a test or scheduled operation. |
| Team | A shared workspace that can own Fibe resources. |
| Agent | An assistant configuration used in supported Fibe workflows. |
| Library | Native Fibe's area for reusable workspace configuration and records. |
| Audit Logs | Read-only history recorded for supported actions. |
| Compose service | One application or dependency container declared in a Compose document. |
| Fibe Compose label | A supported service label that configures Fibe behavior beyond ordinary Compose fields. |

## Relationship at a glance

```
Repository + Compose definition + configuration → Spec → long-running Playground
Task configuration + inputs → Task run
Team → shared ownership of resources
Host → execution location for Playgrounds and Tasks
```

## Related skills

- [fibe-product-map](fibe-product-map.md) for the resource model.
- [fibe-feature-surface](fibe-feature-surface.md) for feature areas.
- [reference-fibe-labels](reference-fibe-labels.md) for Compose labels.
