---
title: Teams
description: Team workspaces, immutable ownership, membership, Team settings and independent Team automation.
slug: /concepts/teams
sidebar_position: 10
image: /img/og/concepts-teams.png
keywords: [Team, Team workspace, Team settings, owner context, service account, membership]
---

A Team is a shared workspace with its own resources, credentials, defaults, quotas and balances. Choose Personal or a Team in the Team pill before creating work. A resource keeps that owner throughout its lifetime; switching the pill does not move existing resources.

This page describes the coordinated staging candidate. Production retains its previous collaboration contract until its separate cutover.

## The Team pill

The compact pill under your avatar and username shows the selected owner. Open it to switch between Personal and the active Teams you belong to, see pending invitations, or create a Team (when Teams are enabled for your account). While a Team is selected, the gear next to the pill opens that Team's settings. In the collapsed sidebar, the selected Team appears as a badge on your avatar.

## Team settings

Team settings live at `/teams/:id/settings` and have four tabs:

| Tab | What it holds |
| --- | --- |
| **Members** | Invitations, the member list, rename, removed members and restoration requests, Leave and Close. |
| **Billing** | Wallet, Add funds, Plans, Subscriptions, Recent purchases, and the billing contact and provider. Non-admins see read-only cards. |
| **Service accounts** | Durable automation principals for the Team. Shown to Team admins only. |
| **GitHub** | The Team's GitHub organization installations. |

Settings open only for the selected Team. If you follow a link to another Team you belong to, Fibe asks you to switch first; opening the page never switches Team by itself. Old `/teams/:id` links redirect to the Members tab.

## Members and administrators

Accepted members may operate Team resources. Accepted administrators manage membership, Team settings, credentials and billing. The creator remains historical attribution; their departure does not turn Team resources into personal ones. A Team must retain at least one accepted administrator.

Invitations and domain enrollment establish membership through their normal acceptance or verified identity flow. A [Google sign-in](/advanced/google-sign-in/) domain invitation can admit people from one email domain straight into a Team as members. Removing a person invalidates their Team authority and records a durable enrollment block. An administrator may request restoration after native sensitive-action verification; the removed person must accept that request explicitly. Merely signing in again or matching an email address does not restore access.

## Resources and references

Hosts, Repositories, Specs, Playgrounds, Tasks, Agents, Library records, Secrets, Templates, webhooks and their children belong to a Personal or Team owner. Children retain their root owner's identity. References normally require the same owner; another Team's resource ID is insufficient.

Team runtime defaults, provider connections and Secrets come from the Team. There is no fallback to a departed creator's personal credentials or defaults. Existing Team work remains after that person's departure. Team access comes only from Team ownership; there is no separate per-resource sharing.

## Automation credentials

A new credential binds an immutable owner context and principal. A person's Team credential requires live accepted membership. A Team service account supplies durable automation independent of the person who issued its key; revoking the service account or key blocks later effects.

Scopes narrow operations inside the bound owner context. Selecting a profile or passing a Team ID cannot widen authority. Team GitHub automation uses the Team's verified organization installation and never borrows a member's personal OAuth token.

## Team billing and quotas

Team balances, payment customers, orders, subscriptions and gateway allocations are separate from personal finance. Accepted administrators manage them in **Team settings → Billing**. Resource quotas count each Team resource once, rather than once per member. Personal resources continue to consume personal quotas.

Closing a Team checks outstanding finance and runtime obligations, revokes admission and preserves retained financial/audit history. Queued work must recheck live authority before effects. Leaving or deleting a creator does not silently delete Team-owned Playgrounds, volumes or credentials.

## ENV-pack grants

People with both source-pack access and target authority may explicitly grant cross-owner ENV-pack references. Losing either authority blocks fresh use until an authorized person renews or replaces the grant. An active Team service account may grant a Team pack only to that Team's target. Previously applied runtime snapshots remain available for automatic repair. See [ENV packs](/concepts/env-packs/).

## Related

- [Hosts](/concepts/hosts/), [Specs](/concepts/specs/) and [Repositories](/concepts/repositories/).
- [Billing](/concepts/billing/): separate Team and personal finance.
- [Google sign-in](/advanced/google-sign-in/): domain invitations into a Team.
- [API reference](/api/): bound credentials and owner context.
