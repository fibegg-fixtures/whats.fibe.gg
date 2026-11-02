---
title: Limits & Quotas
description: Inspect owner-scoped resource limits and the installation administrator quota controls.
slug: /advanced/limits
sidebar_position: 3
keywords: [limits, quotas, usage, caps, self-hosted]
---

Fibe applies resource limits at supported admission points in a self-hosted installation.

## Inspecting limits

Open **Profile → Advanced Settings → Limits & Quotas** to inspect the selected owner's usage. Installation administrators manage policy in **Admin → Players → select an account → Resource Quotas**. The API exposes owner-scoped quota reads at `/ui-api/v1/quotas`; authorized installation administrators can also inspect or change supported policy through `/admin-api/v1/quotas` and the operator quota page at `/quotas`.

Personal and Team ownership are evaluated independently. A Team resource uses that Team's capacity policy, not the creator's Personal quota. Existing resources are retained when a limit is lowered; the lower limit applies to later admissions.

## What is enforced

Quota support is attached to individual creation or allocation workflows, not inferred from a row in a usage table. Current native admission covers API-key limits and selected resource paths including Host and Repository capacity; some other resource and per-parent adapters remain incomplete. The response reports current usage, effective limit, source, and policy revision where available. A missing or unavailable usage adapter is not a zero-use guarantee.

Installation administrators can configure supported owner limits. For count quotas, values are non-negative integers; size quotas use decimal MB values where the key is a size limit. An override of zero denies new allocation. Removing an override restores the configured default. Changing policy requires current administrator authority and recent authentication; stale policy revisions are rejected so an operator can review the current value before saving.

Defaults can be configured by the installation. Do not rely on a fixed quota number across installations; inspect this page for usage or the current quota API response.

## Related

- [Self-hosted operation](/concepts/self-hosted/): compute, backup, and ownership model.
- [Teams](/concepts/teams/): independent Personal and Team ownership.
- [API reference](/api/): quota endpoints and schemas.
