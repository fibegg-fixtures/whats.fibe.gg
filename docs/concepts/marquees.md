---
title: Marquees
description: A Marquee is a Docker host where Playgrounds and Tricks run. Connect your own or use a managed tutorial host. Marquees handle routing, TLS, registry credentials, capacity.
slug: /concepts/marquees
sidebar_position: 4
image: /img/og/concepts-marquees.png
keywords: [Marquee, Docker host, Fibe infrastructure, routing, TLS, SSH, root domain]
---

A **Marquee** is a Docker host registered with Fibe. Once connected, it runs as many Playgrounds and Tricks as its capacity allows. Marquees handle TLS, public and internal HTTP routing, registry credentials, and the SSH terminal.

A Marquee must be funded before Fibe can launch, restart, build, stream live logs, SSH, run connection tests, restart routing, schedule work, stop or destroy runtime, or send Genie messages through it. If unpaid, those actions return `MARQUEE_NOT_FUNDED`. Billing and funding screens stay available so you can restore service.

## What a Marquee gives you

| Capability | Detail |
| --- | --- |
| **Docker execution** | Compose files run as containers on the host. Fibe drives Docker; you don't. |
| **Public routing (HTTPS)** | `external` services get a URL under your root domain. TLS terminates at the Marquee. |
| **Internal routing** | `internal` services share the URL shape but sit behind Basic Auth. |
| **DNS at the root domain** | Point a wildcard at the Marquee. Every service gets a subdomain. |
| **Docker Hub credentials** | Add once. Every Playground pulling private Docker Hub images can use them. Other registries (GHCR, Amazon ECR) are configured per Template. |
| **SSH terminal** | Open from the Marquee page. Inspect disk, containers, the Docker daemon. |
| **Capacity** | Many environments side-by-side. Limit is host CPU/memory. |

## Add a Marquee

Connect any Docker-capable host reachable over SSH, or use a managed **tutorial Marquee** to start without infrastructure.

You supply:

- **SSH details** — address, user, key. The port defaults to 22. The host must already have Docker installed and running; Fibe connects over SSH and operates Docker for you. The address must be publicly reachable — private and loopback ranges are rejected — and a host + port pair already used by another Marquee is rejected too.
- **Root domain** — every service becomes `<subdomain>.<root-domain>`. Requires a wildcard DNS record.
- **TLS** — automatic (Let's Encrypt) or your own certificate (both the certificate and its private key). Automatic wildcard certificates verify domain ownership through your DNS provider — Cloudflare, AWS Route53, DigitalOcean, Hetzner, OVH, Google Cloud DNS, or a manual acme-dns CNAME.
- **Optional Docker Hub credentials** — for pulling private Docker Hub images. Credentials for other registries (GHCR, Amazon ECR) are added on the Template that uses them, not on the Marquee.

:::tip Tutorial Marquees
A tutorial Marquee is the fastest start: buy the Tutorial bundle and Fibe provisions a managed host for you — no infrastructure needed. Add your own server for real work.
:::

## Marquee types

Marquees are either **self-hosted** (your own server — capacity is whatever the host has) or **platform-managed tutorial hosts**. The bundles on the [Billing](/concepts/billing/) page differ in how many Marquees they fund and for how long, not in feature gates.

Tutorial hosts are provisioned for you, with progress shown step by step: Queued → Vm Creating → Vm Ready → Ssh Configured → Tls Provisioning → Deploying → Ready. The SSH terminal works from the Ssh Configured step onward; provisioning that stalls for 30 minutes is marked failed. Connection details (host, port, user, SSH key) are system-managed and can't be edited, and HTTPS is always on with platform-managed certificates. Two recovery actions are built in, each rate-limited:

| Action | Available | Limit |
| --- | --- | --- |
| **Fix-redeploy** | Once provisioning has finished or failed; not while a Genie chat is live | 10 attempts per 4-hour window |
| **Reboot** | Once provisioned — including from error status | 3 reboots per 1-hour window |

Both counters reset when their window expires.

## Routing & URLs

Two URL kinds per service:

- **Public (`fibe.gg/visibility: external` with `fibe.gg/port: PORT`)** — `https://<subdomain>.<root-domain>`. Anyone with the URL reaches it.
- **Internal (`fibe.gg/visibility: internal` with `fibe.gg/port: PORT`)** — same shape, Basic Auth in front.

Routing is opted in per service with `fibe.gg/port`; pick public vs. internal per service with `fibe.gg/visibility` (defaults to `external`). Container ports are not published manually. Fibe handles binding, certificates, the proxy.

```yaml
services:
  web:
    image: nginx:alpine
    labels:
      fibe.gg/port: 80   # → https://web.<root-domain>
      fibe.gg/visibility: external
  admin:
    image: my-org/admin:1.0
    labels:
      fibe.gg/port: 8080 # → https://admin.<root-domain> (Basic Auth)
      fibe.gg/visibility: internal
```

Subdomain defaults to the service name. Override with `fibe.gg/subdomain` — lowercase letters, digits and hyphens, or `@` to bind at the root domain itself. See [Service labels → Routing & exposure](/authoring/service-labels/).

## Health & capacity

The Marquee page shows:

- **Live status** — reachability, Docker daemon, service health.
- **Capacity** — running Playgrounds, CPU/memory usage.
- **Schedule** — Playgrounds and Tricks running here.
- **SSH terminal**.
- **Connection test** — re-runs the check. Surfaces firewall, key, disk problems.

Connection tests and live diagnostics also require a funded Marquee because they contact the remote host.

A Marquee is **active**, **disabled**, or **error**: a failed connection check moves it to error; disabled is yours to set. Launching a Playground needs everything at once — active status, funding, SSH details and a root domain in place, and (on a tutorial host) completed provisioning. Restarts, rollouts and other runtime actions likewise need an active, funded Marquee.

**Disable a Marquee** for maintenance. No new launches are scheduled and existing **Playgrounds keep running**, but live **Genie chats are paused** (their data is kept) and can't be acted on until you re-enable it. Non-payment is stricter: every runtime action is blocked until you fund again, and on a platform-managed Marquee its Playgrounds are flagged as not funded and live Genie chats are stopped (their data is kept) — see [Billing → When your balance runs low](/concepts/billing/#when-your-balance-runs-low).

## Removing a Marquee

Stop or move attached Playgrounds and Tricks first. The product lists what's attached.

Decommission flow:

1. Disable the Marquee.
2. Stop or destroy obsolete Playgrounds.
3. Relaunch long-running Playgrounds on another Marquee (a Playground can't be moved between hosts — launch it fresh from the same Template on the new Marquee).
4. Delete the Marquee. The host machine is untouched.

## Example: connect a DigitalOcean droplet

1. Ubuntu droplet, 2 vCPU / 4 GB RAM minimum, with Docker installed and the needed ports open (SSH, 80/443).
2. Wildcard DNS `*.dev.example.com → <droplet IP>`.
3. **Add Marquee** in Fibe with:
   - Host: `dev.example.com`
   - SSH user, SSH key.
   - Root domain: `dev.example.com`.
   - TLS: automatic, with DigitalOcean as the DNS provider (an API token).
4. **Test connection.** Fibe verifies SSH access, that Docker is installed and running, and that its working directories are writable.
5. Marquee ready. Launch a Playground.

## FAQ

<details>
<summary>How many Marquees can I have?</summary>

Your account has separate quotas for standard and tutorial Marquees, shown when you reach them. Topping up the [Wallet](/concepts/billing/) funds the Marquees you have but doesn't raise the count — contact support to increase the quota.
</details>

<details>
<summary>Move a running Playground to a different Marquee?</summary>

No. A Playground stays on the Marquee it was created on. To change hosts, launch a fresh Playground from the same Template on the other Marquee and retire the old one.
</details>

<details>
<summary>Can two people share a Marquee?</summary>

Yes — through a [team](/concepts/teams/). A team owner can share a Marquee with accepted team members from the team page (web UI). Sharing is **manage-level only**: members see the Marquee alongside their own and can use it everywhere a Marquee is selectable — launching Playgrounds, templates, CI and schedules. Playgrounds hosted on a shared Marquee are visible and manageable to everyone who can manage that Marquee.

Ownership and billing stay with the owner, and funding rules apply equally: if the Marquee is unfunded, owner and members are blocked alike. Other resources are **not** implicitly shared — members still need their own Playspecs, Props, Agents, and Secrets. There is no read-only grant, and team management itself is web-only (no API or CLI).

When sharing ends — the owner unshares the Marquee, you leave or are removed from the team, or the owner leaves — Playgrounds you created on that Marquee are destroyed and your Genie chats on it are stopped. Move any work you need before sharing ends.
</details>

<details>
<summary>Host goes down?</summary>

Connection check flips the Marquee to error. Playgrounds become unreachable until the host returns, and live Genie chats stop automatically with a message that the Marquee became unavailable (their data is kept). No automatic failover.
</details>

<details>
<summary>Does the Marquee see my source?</summary>

Source-mounted dev templates: yes — the Marquee clones the repo via Prop credentials. Built images: only the image, not raw source. Either way, source lives on the Marquee for the Playground's lifetime.
</details>

## Related

- [Wallet, Mana & Sparks](/concepts/billing/) — how you fund a Marquee.
- [Props](/concepts/props/) — repos Fibe pulls from.
- [Playgrounds](/concepts/playgrounds/) — what runs on Marquees.
- Reference: [`fibe-product-map`](/reference/fibe-product-map/), [`fibe-feature-surface`](/reference/fibe-feature-surface/), [`reference-fibe-labels`](/reference/reference-fibe-labels/).
