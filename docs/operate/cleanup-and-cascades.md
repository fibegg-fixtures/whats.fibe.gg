---
title: What deleting or disabling affects
description: Before you disable or delete a Marquee, Agent, Prop, or API key — exactly what cascades to your running environments, what's blocked to protect you, and what touches data.
slug: /operate/cleanup-and-cascades
sidebar_position: 3
image: /img/og/operate-cleanup-and-cascades.png
keywords: [delete, disable, cleanup, cascade, Marquee, Agent, Prop, API key, data safety, destroy]
---

Fibe is built to protect you from foot-guns. The actions that *could* take other things down with them are **blocked** until you've cleared the dependency, and the few that actually delete data say so first. Here's exactly what each action touches.

## At a glance

| You do this… | …and this happens | Data |
| --- | --- | --- |
| **Disable a Marquee** | New launches, schedules, and triggered runs are blocked, and automatic maintenance stops. Running Playgrounds and live Genie chats **keep running** — self-hosted or platform-managed. (It's non-payment, not disabling, that pauses a platform-managed Marquee's environments — see [Billing](/concepts/billing/#when-your-balance-runs-low).) | Kept |
| **Delete a Marquee** | **Blocked** while Playgrounds or Tricks are attached — move or remove them first. Genie chat sessions on the Marquee are removed along with it — stop or clean them up first. A Marquee with unresolved billing incidents also can't be deleted; settle the balance first. A self-hosted host machine is never touched. | Kept |
| **Stop a Genie** | Runtime off, workspace kept. Restart resumes. | Kept |
| **Clean up / purge a Genie** | Runtime down **and the workspace deleted**. | **Deleted** |
| **Delete an Agent** | Its Genie chats are cleaned up. Playgrounds it was attached to **survive** and lose only the Agent link. | Chat workspace deleted; Playgrounds kept |
| **Rotate / revoke an API key** | Running Genies that used it **redeploy** to pick up the change. Nothing is deleted. | Kept |
| **Delete a Prop** | **Blocked** while a Playspec still references it. A Template imported from the Prop is *not* a blocker — it keeps working but quietly loses its source connection, so detach or re-point such Templates first. | n/a |
| **Cancel a subscription** | A platform-managed Marquee tied to it **survives as long as it stays funded**. | Kept |
| **Expire a Playground** | Clean → destroyed (containers, named volumes unless persistence is on, and the record). Uncommitted changes → **parked, not destroyed**. | Volume kept only if persistence is on |
| **Destroy a Playground** | Always tears down containers, volumes (unless persistence is on), and the record — **uncommitted changes included**. Commit or push your work before destroying. | Volume kept only if persistence is on |

## What happens to named volumes

Routine lifecycle actions never remove named volumes. Only teardown does — and there, the Playspec's **Stateful (Persist Volumes)** setting decides:

| Action | Named volumes |
| --- | --- |
| Stop | Always kept |
| Rollout / restart | Always kept |
| Destroy or expiration | Kept only if **Stateful (Persist Volumes)** is on |

## The three rules behind the table

- **You can't pull the ground out from under a running thing.** A Marquee won't delete while Playgrounds or Tricks live on it, and a Prop won't delete while a Playspec points at it. Clear the dependency first — the product lists what's in the way.
- **Disabling is reversible; deleting and cleaning up are not.** Disable a Marquee and everything comes back when you re-enable it. A Prop can't be disabled — only deleted, and deletion is blocked while a Playspec still references it. **Clean up / purge** is the one routine action that permanently deletes a runtime's stored data — and it asks first.
- **Your configuration outlives any runtime.** Agent settings, mounted files, credentials, Templates, and your Wallet are account-level. Stopping, restarting, or cleaning up a *runtime* never touches them.

## See also

- [Agents — Stop vs. clean up](/concepts/agents/) — what a Genie keeps vs. deletes.
- [Marquees — Removing a Marquee](/concepts/marquees/) — the safe decommission order.
- [Billing — When your balance runs low](/concepts/billing/#when-your-balance-runs-low) — disabling for non-payment.
- [Playgrounds — Data durability](/concepts/playgrounds/) — what survives a restart.
- [What Fibe recovers on its own](/operate/automatic-recovery/) — transient states that aren't problems.
