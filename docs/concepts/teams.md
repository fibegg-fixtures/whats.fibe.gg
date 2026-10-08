---
title: Teams
description: Company workspaces, immutable ownership, membership and independent company automation.
slug: /concepts/teams
sidebar_position: 10
image: /img/og/concepts-teams.png
keywords: [Team, company workspace, owner context, service principal, membership]
---

A Team is a company workspace with its own resources, credentials, defaults, quotas and balances. Choose Personal or a company in the owner selector before creating work. A resource keeps that owner throughout its lifetime; switching the selector does not move existing resources.

This page describes the coordinated staging candidate. Production retains its previous collaboration contract until its separate cutover.

## Members and administrators

Accepted members may operate company resources. Accepted administrators manage membership, company settings, credentials and billing. The creator remains historical attribution; their departure does not turn company resources into personal ones. A company must retain at least one accepted administrator.

Invitations and domain enrollment establish membership through their normal acceptance or verified identity flow. Removing a person invalidates their company authority and records a durable enrollment block. An administrator may request restoration after native sensitive-action verification; the removed person must accept that request explicitly. Merely signing in again or matching an email address does not restore access.

## Resources and references

Hosts, Repositories, Specs, Playgrounds, Tasks, Agents, Library records, Secrets, Templates, webhooks and their children belong to a personal or company owner. Children retain their root owner's identity. References normally require the same owner; another company's resource ID is insufficient.

Company runtime defaults, provider connections and Secrets come from the company. There is no fallback to a departed creator's personal credentials or defaults. Existing company work remains after that person's departure. Historical personal-sharing records retain their separate compatibility behavior and do not become company ownership.

## Automation credentials

A new credential binds an immutable owner context and principal. A person's company credential requires live accepted membership. A company service principal supplies durable automation independent of the person who issued its key; revoking the principal or key blocks later effects.

Scopes narrow operations inside the bound owner context. Selecting a profile or passing a company ID cannot widen authority. Company GitHub automation uses the company's verified organization installation and never borrows a member's personal OAuth token.

## Company billing and quotas

Company balances, payment customers, orders, subscriptions and gateway allocations are separate from personal finance. Accepted administrators manage company billing. Resource quotas count each company resource once, rather than once per member. Personal resources continue to consume personal quotas.

Closing a company checks outstanding finance and runtime obligations, revokes admission and preserves retained financial/audit history. Queued work must recheck live authority before effects. Leaving or deleting a creator does not silently delete company-owned Playgrounds, volumes or credentials.

## ENV-pack grants

People with both source-pack access and target authority may explicitly grant cross-owner ENV-pack references. Losing either authority blocks fresh use until an authorized person renews or replaces the grant. An active company service principal may grant a company pack only to that company's target. Previously applied runtime snapshots remain available for automatic repair. See [ENV packs](/concepts/env-packs/).

## Related

- [Hosts](/concepts/hosts/), [Specs](/concepts/specs/) and [Repositories](/concepts/repositories/).
- [Billing](/concepts/billing/): separate company and personal finance.
- [API reference](/api/): bound credentials and owner context.
