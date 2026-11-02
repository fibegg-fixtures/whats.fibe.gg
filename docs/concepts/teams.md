---
title: Teams
description: Team workspaces with owner-scoped resources, membership, and administration.
slug: /concepts/teams
sidebar_position: 10
image: /img/og/concepts-teams.png
keywords: [Team, workspace, owner context, membership, service account]
---

A **Team** is an owner context for shared Fibe resources. Team Hosts, Repositories, Specs, Playgrounds, Tasks, Agents, Library records, and credentials remain owned by the Team rather than by the person who created them.

## Select a Team

Use the owner selector to switch between Personal and a Team you belong to. New resources are created under the selected owner. Switching owner context does not move or transfer resources that already exist.

## Membership and administration

Team settings are available at **Teams → select a Team → Settings**. Administrators manage invitations, membership, and Team settings. Members can work with resources owned by their Team, subject to the permission and lifecycle rules for each operation. Use the settings page to review who currently has access; removing a member removes their current Team authority.

An installation administrator is not automatically a Team member. Access to a Team is based on current Team membership and the operation's authority checks.

## Resources and credentials

A resource has one canonical owner. References between resources are expected to use the same owner context unless a specific grant flow is provided. A Personal Repository or credential is not an implicit fallback for a Team workload. Select and connect credentials for the Team owner when the integration supports Team ownership.

API keys are bound to an owner and principal. Use a Team service principal for durable Team automation where that workflow is enabled; a person's key still depends on that person's current authority.

## Quotas

Personal and Team quota policies are separate. Creating a Team resource consumes Team capacity where the resource's admission workflow enforces a quota. See [Limits & Quotas](/advanced/limits/) for current implementation boundaries.

## Related

- [Hosts](/concepts/hosts/), [Repositories](/concepts/repositories/), [Specs](/concepts/specs/).
- [API Keys](/advanced/api-keys/): credentials and scoped access.
- [Self-hosted operation](/concepts/self-hosted/): resource ownership and quota controls.
