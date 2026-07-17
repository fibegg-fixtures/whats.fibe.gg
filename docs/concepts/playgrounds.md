---
title: Playgrounds
description: A Playground is the running environment a Playspec produces — services, URLs, logs, terminals, lifecycle controls.
slug: /concepts/playgrounds
sidebar_position: 7
image: /img/og/concepts-playgrounds.png
keywords: [Playground, rollout, hard restart, lifecycle, maintenance mode, Docker Compose]
---

A **Playground** is the running environment launched from a [Playspec](/concepts/playspecs/). Services, URLs, logs, terminal access, an optional Genie panel.

Starting, changing, stopping, or destroying a Playground runtime requires its Marquee to be funded. If billing has expired, these actions return `MARQUEE_NOT_FUNDED`. The Marquee's own state gates these actions too — a Marquee that is disabled, in error, or still being provisioned can't launch or change Playgrounds until it's active again.

Launching also requires the selected Marquee to have working SSH details and a root domain configured. Tutorial Marquees must have completed provisioning. If those checks fail, launch/chat preflight returns a validation failure explaining that the Marquee is not ready until the Marquee is active again.

## Lifecycle states

| State | Meaning |
| --- | --- |
| **pending** | Queued. Marquee hasn't started provisioning. |
| **in progress** | Images pulling, containers starting, healthchecks settling. |
| **running** | Up. URLs work. |
| **has changes** | Expiration came due while the Playground still had uncommitted work, so Fibe kept it running instead of tearing it down. Commit or discard the changes, then extend or destroy — extending returns it to **running**. See the tip below. |
| **completed** | Tricks only. Watched services finished — the run succeeds only if every watched service exited 0, and the last 5,000 log lines of each watched service are kept. See [Tricks](/concepts/tricks/). |
| **error** | Launch failed. Logs say why. |
| **destroying** | Tearing down. |
| **stopping** | Stop requested. Services shutting down. |
| **stopped** | Off. Containers and data kept. Start brings it back. |

## Actions

- **Rollout** — re-deploy with the least disruption available. If any service is marked Zero Downtime, unchanged services keep running and Zero Downtime services are replaced without dropping requests. Without Zero Downtime services, a rollout stops and restarts everything — named volumes are kept.
- **Hard restart** — stop everything, start fresh. Use when state has drifted or after structural changes.
- **Stop** — turn off services, keep the Playground record. Restart later.
- **Start** — bring a stopped Playground back up.
- **Retry** — re-run a failed launch.
- **Extend** — push expiration out. The added time stacks on the current expiration or on now, whichever is later — an overdue Playground extends from now.
- **Destroy** — remove the Playground.
- **Maintenance mode** — route traffic to a maintenance page. Containers stay up. Toggle, not a state.

`force` can bypass some state protections when the server permits it.

:::tip Expiration with uncommitted changes
If a Playground has uncommitted changes when expiration falls due, Fibe holds off and surfaces a warning — this is the **has changes** state in the table above. Commit, extend, or destroy.
:::

## What the page gives you

- **Service URLs** — public and internal, HTTPS.
- **Live logs** per service.
- **In-browser terminal** per service.
- **Environment overrides** — change values without rebuilding the image.
- **Service discovery** — containers reach each other by service name inside the Compose network.
- **Status timeline** — build → ready.
- **Genie side panel** — chat in context with any configured [Genie](/concepts/agents/).

## Plain Docker Compose

A Playground's body is a Docker Compose file plus a few Fibe additions (labels, optional settings block). Run the same file locally with `docker compose up` — no Fibe service required for local dev.

On a Marquee the Fibe additions activate (routing, source mounting, variables, healthchecks). Locally they're ignored by Compose.

What this means:

- No Fibe install needed for local development.
- Debug a launch by running the Compose against local Docker.
- The recipe stays portable. Fibe is one place to run it, not the only one.

## Data durability

| Where data lives | Survives restart | Use for |
| --- | --- | --- |
| **Named volume** | Yes | Databases, uploads, anything you'd be sad to lose. |
| **External service** (S3, managed DB) | Yes | Production-shaped data. |
| **Container filesystem** | No | Disposable. Gone on rollout. |

A hard restart can pull a fresh image. Pin tags (`postgres:17`, not `postgres:latest`). Renaming services or volume keys can detach existing data — the product warns first.

## FAQ

<details>
<summary>How long does a Playground stay alive?</summary>

Until you stop or destroy it. New Playgrounds default to **Never Expire**, but you can set and extend an expiration at any time. If expiration is enabled without a specific deadline, Fibe uses an 8-hour fallback for a regular Playground and the operator-configured job fallback for a [Trick](/concepts/tricks/) (1 hour by default).
</details>

<details>
<summary>Can I have many Playgrounds at once?</summary>

Yes. Limited by Marquee capacity and your account quota. The default account-level quota is high (1,000 Playgrounds and 1,000 Playspecs), so host capacity is usually what you hit first.

If the Marquee is shared with a [team](/concepts/teams/), the Playgrounds running on it are visible to — and can be managed by — your teammates.
</details>

<details>
<summary>Rollout vs Hard restart?</summary>

**Rollout** re-deploys with the least disruption available. If any service is marked Zero Downtime, unchanged services keep running and Zero Downtime services are replaced without dropping requests. Without Zero Downtime services, a rollout stops and restarts everything — named volumes are kept. Use for everyday edits.

**Hard restart** stops and starts every service. Use after structural changes (renamed service, volume layout change) or when state has drifted.
</details>

<details>
<summary>502 from outside but works in the container terminal?</summary>

Almost always: the service binds to `localhost` instead of `0.0.0.0`. Fix the bind address. See [Common problems](/operate/common-problems/) for per-framework commands.
</details>

<details>
<summary>What does Maintenance mode do?</summary>

The Marquee proxy serves a maintenance page for the Playground's URLs. Containers stay up — SSH in, read logs, edit. Toggle it off and routing returns. The Playground's state (running, has changes, error) is unaffected.

You may also see the maintenance page without enabling it: while a Playground is starting, restarting, stopping, stopped, or in error, Fibe automatically serves the maintenance page on its URLs until it's running again.
</details>

## Related

- [Playspecs](/concepts/playspecs/) — the blueprint that produces a Playground.
- [Marquees](/concepts/marquees/) — where Playgrounds run.
- [Templates](/concepts/playspecs/#templates) — what Playspecs are launched from.
- [Tricks](/concepts/tricks/) — the one-shot variant.
- [Genies inside a Playground](/concepts/agents/) — chat with AI in context.
- Reference: [`fibe-resource-lifecycles`](/reference/fibe-resource-lifecycles/), [`reference-runtime-implied-semantics`](/reference/reference-runtime-implied-semantics/).
