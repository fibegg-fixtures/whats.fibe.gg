---
title: Self-hosted operation
description: Install, update, back up, and manage resource quotas for a self-hosted Fibe installation.
slug: /concepts/self-hosted
sidebar_position: 9
image: /img/og/concepts-self-hosted.png
keywords: [self-hosted, installation, operations, quota, backup, update]
---

Fibe is a self-hosted application. You operate the Fibe server and the Docker Hosts where workloads run, and manage their capacity and maintenance directly.

## What you operate

- The Fibe application and its persistent `/data` directory, which contains the SQLite database, keys, and uploaded files.
- Each registered Host and its Docker daemon, network access, storage, DNS, and TLS routing.
- External services used by your workloads, such as registries, Git providers, email, or object storage, when configured.

The official distribution is one Fibe application image plus the documented routing layer. Follow the [deployment guide](https://github.com/viktorvsk/fibe-api/tree/main/deploy) for installation and upgrade procedures. Back up the complete stopped data directory before migrations; an older image cannot reverse a newer database schema. Host workload volumes and external provider data have their own backup requirements.

## Resource quotas

Fibe retains owner-scoped quota controls for supported resource admissions. An installation administrator can inspect and change quota policy from the native **Quotas** operator page. Personal and Team resources have separate ownership and policy; a Team allocation does not consume its creator's Personal allowance. Reducing a limit does not delete existing records, but can prevent later allocations.

Admission limits are enforced by supported resource workflows. Treat **Profile → Advanced Settings → Limits & Quotas** and the current API response as authoritative for owner usage. Installation administrators manage supported per-account policy under **Admin → Players** or at `/quotas`. See [Limits & Quotas](/advanced/limits/) for the current control surface and its boundaries.

## Teams

Teams provide owner-scoped collaboration and resource isolation. Team membership and administration are managed from the Team workspace.

## Related

- [Hosts](/concepts/hosts/): connect and manage your Docker machines.
- [Teams](/concepts/teams/): Team ownership and membership.
- [Limits & Quotas](/advanced/limits/): inspect quota usage and operator policy.
- [Data Backup](/advanced/backup/): product-data export and import limits.
- [Runtime configuration](/advanced/runtime-configuration/): operator-managed installation settings.
