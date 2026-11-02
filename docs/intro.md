---
title: Welcome to Fibe
description: Self-hosted Fibe runs Docker workloads on Hosts you control. Connect a Repository, define a Spec, then launch a long-running Playground or a finite Task.
slug: /intro
sidebar_position: 1
sidebar_label: Welcome
image: /img/og/intro.png
keywords: [Fibe, self-hosted, getting started, Docker, Host, Repository, Spec, Playground, Agent]
---

Fibe is a self-hosted application for managing Docker workloads on Hosts you control. The Rust API stores product state in SQLite and runs durable background jobs. The React interface is the customer application. Install Fibe on your server, finish the first-run setup, then connect a Docker Host.

## The first workflow

1. Install and start the Fibe application using the [deployment guide](https://github.com/fibegg/fibe-api/tree/main/deploy). Keep its `/data` directory persistent and back it up before upgrades.
2. Open the installation and complete **Setup** to create the first account and operator access.
3. Add a [Host](/concepts/hosts/): a Docker machine that Fibe can reach over SSH.
4. Connect a [Repository](/concepts/repositories/) or use an image-only Compose definition.
5. Create a [Spec](/concepts/specs/) from Compose. A Spec records the configuration for a workload.
6. Launch a long-running [Playground](/concepts/playgrounds/) or run a finite [Task](/concepts/tasks/).

Fibe does not provide hosted compute, billing plans, paid tutorial Hosts, or a hosted-service fallback. You operate the installation and the machines registered as Hosts.

## Choose a workload

| Resource | Use it for |
| --- | --- |
| [Playground](/concepts/playgrounds/) | Services intended to remain available, such as an app or development environment. |
| [Task](/concepts/tasks/) | A finite command such as a test, migration, backup, or build that records its result. |

## Add an Agent

An [Agent](/concepts/agents/) is a configured assistant that can work with a Playground or its own Host runtime. Agent providers and their credentials are configured by the installation owner; Fibe does not include a model gateway or provide model credits.

## Find your way around

- **Hosts, Repositories, Specs, Playgrounds, Tasks:** primary workload navigation.
- **Library:** reusable Templates, ENV packs, files, conversations, and work activity.
- **Audit Logs:** recorded changes and actors.
- **Profile → Advanced Settings:** security, API keys, secrets, webhooks, notifications, and account preferences.
- **Operations:** installation-level diagnostics and administration for authorized operators.

For programmatic access, see the [API overview](/api/) and [SDK pages](/sdk/intro/). They describe the released consumer surface; individual tools and workflows may have different support. Check the server's OpenAPI document and CLI help for the installation you use.
