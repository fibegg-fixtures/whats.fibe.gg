---
title: Hosts
description: Connect and operate Docker machines that run Fibe Playgrounds and Tasks.
slug: /concepts/hosts
sidebar_position: 4
image: /img/og/concepts-hosts.png
keywords: [Host, Docker, SSH, self-hosted, capacity, routing, TLS]
---

A **Host** is a Docker machine that your Fibe installation can reach over SSH. Playgrounds and Tasks run there. You supply and operate the machine, Docker, its storage, network access, DNS, and any required TLS configuration.

## Before adding one

Prepare a Linux machine with Docker Engine and an SSH account Fibe can use. Decide the root domain for workload routes and configure DNS and ingress for that machine. Keep enough CPU, memory, disk, and Docker capacity for the workloads you intend to run. Fibe does not provision a machine or proxy capacity for you.

## Add and verify a Host

1. Select the correct Personal or Team owner in the UI.
2. Open **Hosts → New Host** and enter its connection details, root domain, and routing/TLS settings.
3. Save the Host, then run **Test connection**. This checks the remote connection and the Docker/runtime prerequisites. Resolve any reported connection, permission, or daemon issue on the machine, then test again.
4. Review the Host's status and runtime details before choosing it for a Playground or Task.

The Host API includes create, update, delete, connection-test, runtime-inspection, runtime-reconciliation, SSH-key, ingress, and registry-credential operations. See the [API reference](/api/) for schemas and current installation capabilities.

## Routing and service URLs

A routed Compose service declares a container port and visibility in its Fibe labels. Fibe configures ingress for the Host's root domain. Public exposure makes the service reachable at its assigned URL; internal exposure is access-controlled. Confirm DNS, certificates, firewall rules, and the selected Host's ingress configuration before expecting a URL to work.

Do not publish container ports directly to arbitrary Host ports unless your installation's Compose policy explicitly supports that arrangement. See [Service labels](/authoring/service-labels/) for the Compose fields and [Common problems](/operate/common-problems/) for connection checks.

## Capacity and maintenance

Host capacity is determined by the machine and Docker environment. Fibe can inspect runtime state, but it does not reserve CPU, memory, disk, or network bandwidth for you. Monitor those resources on the Host as well as in Fibe.

Disable a Host before planned maintenance to keep it out of new placement choices. Existing runtime state may remain on the machine; inspect attached Playgrounds and Tasks before changing or deleting a Host. Removing a Host record does not erase or decommission the physical machine or external data.

## Related

- [Repositories](/concepts/repositories/): connect workload source.
- [Specs](/concepts/specs/): store Compose configuration.
- [Playgrounds](/concepts/playgrounds/): run long-lived services.
- [Tasks](/concepts/tasks/): run finite work.
- [Self-hosted operation](/concepts/billing/): installation and operator responsibilities.
