---
title: Playgrounds
description: A Playground is a Playspec's running environment, including services, URLs, logs, terminals, and lifecycle controls.
slug: /concepts/playgrounds
sidebar_position: 7
image: /img/og/concepts-playgrounds.png
keywords: [Playground, rollout, hard restart, lifecycle, maintenance mode, Docker Compose]
---

A **Playground** is the environment launched from a [Playspec](/concepts/playspecs/). It includes services, URLs, logs, terminals, and an optional Genie panel.

Starting, changing, stopping, or destroying a Playground requires a funded, active Marquee. Expired billing returns `MARQUEE_NOT_FUNDED`. A disabled, failed, or provisioning Marquee cannot launch or change Playgrounds.

The Marquee also needs working SSH details and a root domain. Tutorial Marquees must finish provisioning. Failed checks return a validation error.

## Lifecycle states

| State | Meaning |
| --- | --- |
| **pending** | Queued. Marquee hasn't started provisioning. |
| **in progress** | Images pulling, containers starting, healthchecks settling. |
| **running** | Up. URLs work. |
| **has changes** | Expired with uncommitted work, so Fibe kept it running. Commit or discard the changes, then extend or destroy it. Extending returns it to **running**. |
| **completed** | Tricks only. Every watched service finished with exit code 0. Fibe keeps the last 5,000 log lines from each. See [Tricks](/concepts/tricks/). |
| **error** | Launch failed. Logs say why. |
| **destroying** | Tearing down. |
| **stopping** | Stop requested. Services shutting down. |
| **stopped** | Off. Containers and data kept. Start brings it back. |

## Actions

- **Rollout:** redeploy with the least disruption. Zero Downtime services are replaced without dropping requests while unchanged services keep running. Otherwise, all services restart and named volumes remain.
- **Hard restart:** restart every service after structural changes or state drift.
- **Stop:** turn off services but keep the Playground.
- **Start:** bring a stopped Playground back up.
- **Retry:** rerun a failed launch.
- **Extend:** move expiration forward from its current time or now, whichever is later.
- **Destroy:** remove the Playground.
- **Maintenance mode:** route traffic to a maintenance page while containers stay up. This is a toggle, not a state.

`force` can bypass some state protections when the server permits it.

:::tip Expiration with uncommitted changes
If a Playground expires with uncommitted changes, Fibe keeps it running in **has changes** state. Commit, extend, or destroy it.
:::

## What the page gives you

- **Service URLs:** public, internal, and HTTPS.
- **Live logs** per service.
- **In-browser terminal** per service.
- **Environment overrides:** change values without rebuilding the image.
- **Service discovery:** containers use service names inside the Compose network.
- **Status timeline:** from build to ready.
- **Genie side panel:** chat with any configured [Genie](/concepts/agents/) in context.

## Plain Docker Compose

A Playground is a Docker Compose file with Fibe labels and an optional settings block. Run the same file locally with `docker compose up`; local development does not require Fibe.

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

A hard restart can pull a fresh image. Pin tags such as `postgres:17` instead of `postgres:latest`. Renaming services or volume keys can detach data; Fibe warns first.

## FAQ

<details>
<summary>How long does a Playground stay alive?</summary>

Until you stop or destroy it. New Playgrounds default to **Never Expire**, but you can set and extend an expiration at any time. If expiration is enabled without a specific deadline, Fibe uses an 8-hour fallback for a regular Playground and the operator-configured job fallback for a [Trick](/concepts/tricks/) (1 hour by default).
</details>

<details>
<summary>Can I have many Playgrounds at once?</summary>

Yes. Limited by Marquee capacity and your account quota. The default account-level quota is high (1,000 Playgrounds and 1,000 Playspecs), so host capacity is usually what you hit first.

If a [team](/concepts/teams/) shares the Marquee, teammates can see and manage its Playgrounds.
</details>

<details>
<summary>Rollout vs Hard restart?</summary>

**Rollout** redeploys with the least disruption. Zero Downtime services are replaced without dropping requests while unchanged services keep running. Otherwise, all services restart and named volumes remain. Use it for routine changes.

**Hard restart** stops and starts every service. Use after structural changes (renamed service, volume layout change) or when state has drifted.
</details>

<details>
<summary>502 from outside but works in the container terminal?</summary>

Almost always: the service binds to `localhost` instead of `0.0.0.0`. Fix the bind address. See [Common problems](/operate/common-problems/) for per-framework commands.
</details>

<details>
<summary>What does Maintenance mode do?</summary>

The Marquee proxy serves a maintenance page while containers stay up. You can still use SSH, read logs, and edit. Turning the mode off restores routing without changing the Playground state.

Fibe also serves the maintenance page automatically while a Playground is starting, restarting, stopping, stopped, or in error. Its normal URLs return when it is running again.
</details>

## Related

- [Playspecs](/concepts/playspecs/): the blueprint that produces a Playground.
- [Marquees](/concepts/marquees/): where Playgrounds run.
- [Templates](/concepts/playspecs/#templates): the source for Playspecs.
- [Tricks](/concepts/tricks/): one-shot runs.
- [Genies inside a Playground](/concepts/agents/): chat with AI in context.
- Reference: [`fibe-resource-lifecycles`](/reference/fibe-resource-lifecycles/), [`reference-runtime-implied-semantics`](/reference/reference-runtime-implied-semantics/).
