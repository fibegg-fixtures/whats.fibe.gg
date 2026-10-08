---
title: What deleting or disabling affects
description: "Before you disable or delete a Host, Agent, Repository, or API key: exactly what cascades to your running environments, what's blocked to protect you, and what touches data."
slug: /operate/cleanup-and-cascades
sidebar_position: 3
image: /img/og/operate-cleanup-and-cascades.png
keywords: [delete, disable, cleanup, cascade, Host, Agent, Repository, API key, data safety, destroy]
---

Fibe is built to protect you from foot-guns. The actions that *could* take other things down with them are **blocked** until you've cleared the dependency, and the few that actually delete data say so first. Here's exactly what each action touches.

:::info Subscription cleanup release scope
The delayed-cancellation correction is deployed to staging, next.fibe.live, and
has not yet been promoted to fibe.gg. See the [billing release note](/concepts/billing/)
for its scope. Cancellation, stopping runtime, and retention cleanup are separate
steps; a database record surviving does not by itself prove that its runtime data
has been recovered.
:::

## At a glance

| You do this… | …and this happens | Data |
| --- | --- | --- |
| **Disable a Host** | New launches, schedules, and triggered runs are blocked, and automatic maintenance stops. Running Playgrounds and live Agent chats **keep running**: self-hosted or platform-managed. (It's non-payment, not disabling, that pauses a platform-managed Host's environments: see [Billing](/concepts/billing/#when-your-balance-runs-low).) | Kept |
| **Delete a Host** | **Blocked** while Playgrounds or Tasks are attached: move or remove them first. Agent chat sessions on the Host are removed along with it automatically and do not block deletion. A Host with unresolved billing incidents also can't be deleted; settle the balance first. A self-hosted host machine is never touched. | Kept |
| **Stop an Agent** | Runtime off, workspace kept. Restart resumes. | Kept |
| **Clean up / purge an Agent** | Runtime down **and the workspace deleted**. | **Deleted** |
| **Delete an Agent** | Its Agent chats are cleaned up. Playgrounds it was attached to **survive** and lose only the Agent link. | Chat workspace deleted; Playgrounds kept |
| **Rotate / revoke an API key** | Running Agents that used it **redeploy** to pick up the change. Nothing is deleted. | Kept |
| **Delete a Repository** | **Blocked** while a Spec still references it. A Template imported from the Repository is *not* a blocker: it keeps working but quietly loses its source connection, so detach or re-point such Templates first. | n/a |
| **Cancel a subscription** | A platform-managed Host tied to it **survives as long as it stays funded**. | Kept |
| **Expire a Playground** | Clean → destroyed (containers, named volumes unless persistence is on, and the record). Uncommitted changes → **parked, not destroyed**. | Volume kept only if persistence is on |
| **Destroy a Playground** | Always tears down containers, volumes (unless persistence is on), and the record: **uncommitted changes included**. Commit or push your work before destroying. | Volume kept only if persistence is on |

## What happens to named volumes

Routine lifecycle actions never remove named volumes. During teardown, the Spec's **Stateful (Persist Volumes)** setting decides:

| Action | Named volumes |
| --- | --- |
| Stop | Always kept |
| Rollout / restart | Always kept |
| Destroy or expiration | Kept only if **Stateful (Persist Volumes)** is on |

## The three rules behind the table

- **You can't pull the ground out from under a running thing.** A Host won't delete while Playgrounds or Tasks live on it, and a Repository won't delete while a Spec points at it. Clear the dependency first: the product lists what's in the way.
- **Disabling is reversible; deleting and cleaning up are not.** Re-enabling a Host restores its services. Repository disablement is internal; users can delete a Repository only after removing Spec references. **Clean up / purge** permanently deletes a runtime's stored data after confirmation.
- **Your configuration outlives any runtime.** Agent settings, mounted files, credentials, Templates, and your Wallet are account-level. Stopping, restarting, or cleaning up a *runtime* never touches them.

## See also

- [Agents: Stop vs. clean up](/concepts/agents/): what an Agent keeps vs. deletes.
- [Hosts: Removing a Host](/concepts/hosts/): the safe decommission order.
- [Billing: When your balance runs low](/concepts/billing/#when-your-balance-runs-low): disabling for non-payment.
- [Playgrounds: Data durability](/concepts/playgrounds/): what survives a restart.
- [What Fibe recovers on its own](/operate/automatic-recovery/): transient states that aren't problems.
