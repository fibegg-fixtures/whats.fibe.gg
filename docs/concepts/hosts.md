---
title: Hosts
description: A Host is a Docker host where Playgrounds and Tasks run. Connect your own or use a managed tutorial host. Hosts handle routing, TLS, registry credentials, capacity.
slug: /concepts/hosts
sidebar_position: 4
image: /img/og/concepts-hosts.png
keywords: [Host, Docker host, Fibe infrastructure, routing, TLS, SSH, root domain]
---

A **Host** is a Docker host registered with Fibe. It runs Playgrounds and Tasks within its capacity and handles TLS, routing, registry credentials, and SSH.

Runtime actions and Agent messages require a funded Host. An unpaid Host returns `HOST_NOT_FUNDED`, while Billing remains available so you can restore service.

## What a Host gives you

| Capability | Detail |
| --- | --- |
| **Docker execution** | Compose files run as containers on the host. Fibe drives Docker; you don't. |
| **Public routing (HTTPS)** | `external` services get a URL under your root domain. TLS terminates at the Host. |
| **Internal routing** | `internal` services share the URL shape but sit behind Basic Auth. |
| **DNS at the root domain** | Point a wildcard at the Host. Every service gets a subdomain. |
| **Docker Hub credentials** | Add once. Every Playground pulling private Docker Hub images can use them. Other registries (GHCR, Amazon ECR) are configured per Template. |
| **SSH terminal** | Open from the Host page. Inspect disk, containers, the Docker daemon. |
| **Capacity** | Many environments side-by-side. Limit is host CPU/memory. |

## Add a Host

Connect any Docker-capable host reachable over SSH, or use a managed **tutorial Host** to start without infrastructure.

You supply:

- **SSH details:** address, user, and key. Port 22 is the default. The host needs running Docker and a public address; private, loopback, and duplicate host-port pairs are rejected.
- **Root domain**: every service becomes `<subdomain>.<root-domain>`. Requires a wildcard DNS record.
- **TLS:** automatic Let's Encrypt or your own certificate and private key. Automatic wildcard certificates support Cloudflare, AWS Route53, DigitalOcean, Hetzner, OVH, Google Cloud DNS, and manual acme-dns CNAME verification.
- **Optional Docker Hub credentials**: for pulling private Docker Hub images. Credentials for other registries (GHCR, Amazon ECR) are added on the Template that uses them, not on the Host.

:::tip Tutorial Hosts
A Tutorial bundle provisions a managed host without requiring your own infrastructure.
:::

## Host types

Hosts are self-hosted or platform-managed tutorial hosts. [Billing](/concepts/billing/) bundles differ by funded Host count and duration, not features.

Tutorial hosts show each provisioning stage from Queued through Ready. SSH works after Ssh Configured; a 30-minute stall fails provisioning. Fibe manages immutable connection details and HTTPS certificates. Two rate-limited recovery actions are available:

| Action | Available | Limit |
| --- | --- | --- |
| **Fix-redeploy** | Once provisioning has finished or failed; not while an Agent chat is live | 10 attempts per 4-hour window |
| **Reboot** | Once provisioned: including from error status | 3 reboots per 1-hour window |

Both counters reset when their window expires.

## Routing & URLs

Two URL kinds per service:

- **Public (`fibe.gg/visibility: external` with `fibe.gg/port: PORT`)**: `https://<subdomain>.<root-domain>`. Anyone with the URL reaches it.
- **Internal (`fibe.gg/visibility: internal` with `fibe.gg/port: PORT`)**: same shape, Basic Auth in front.

Routing is opted in per service with `fibe.gg/port`; pick public vs. internal per service with `fibe.gg/visibility` (defaults to `external`). Container ports are not published manually. Fibe handles binding, certificates, the proxy.

```yaml
services:
  web:
    image: nginx:alpine
    labels:
      fibe.gg/port: 80
      fibe.gg/visibility: external
  admin:
    image: my-org/admin:1.0
    labels:
      fibe.gg/port: 8080
      fibe.gg/visibility: internal
```

The subdomain defaults to the service name. Override it with lowercase letters, digits, hyphens, or `@` for the root domain. See [Service labels → Routing & exposure](/authoring/service-labels/).

## Health & capacity

The Host page shows:

- **Live status**: reachability, Docker daemon, service health.
- **Capacity**: running Playgrounds, CPU/memory usage.
- **Schedule**: Playgrounds and Tasks running here.
- **SSH terminal**.
- **Connection test**: re-runs the check. Surfaces firewall, key, disk problems.

Connection tests and live diagnostics also require a funded Host because they contact the remote host.

A Host is active, disabled, or in error. Launches require an active, funded Host with SSH details, a root domain, and completed tutorial provisioning. Other runtime actions have the same active and funded requirements.

Disable a Host for maintenance. Existing Playgrounds continue, new launches stop, and live Agent chats pause without losing data. Nonpayment blocks every runtime action; managed Playgrounds become unfunded and live chats stop. See [Billing → When your balance runs low](/concepts/billing/#when-your-balance-runs-low).

## Removing a Host

Stop or move attached Playgrounds and Tasks first. The product lists what's attached.

Decommission flow:

1. Disable the Host.
2. Stop or destroy obsolete Playgrounds.
3. Relaunch long-running Playgrounds from the same Template on another Host. Existing Playgrounds cannot move between hosts.
4. Delete the Host. The host machine is untouched.

## Example: connect a DigitalOcean droplet

1. Ubuntu droplet, 2 vCPU / 4 GB RAM minimum, with Docker installed and the needed ports open (SSH, 80/443).
2. Wildcard DNS `*.dev.example.com → <droplet IP>`.
3. **Add Host** in Fibe with:
   - Host: `dev.example.com`
   - SSH user, SSH key.
   - Root domain: `dev.example.com`.
   - TLS: automatic, with DigitalOcean as the DNS provider (an API token).
4. **Test connection.** Fibe verifies SSH access, that Docker is installed and running, and that its working directories are writable.
5. Host ready. Launch a Playground.

## FAQ

<details>
<summary>How many Hosts can I have?</summary>

Standard and tutorial Hosts have separate account quotas. Wallet credit funds existing Hosts but does not raise those quotas.
</details>

<details>
<summary>Move a running Playground to a different Host?</summary>

No. A Playground stays on the Host it was created on. To change hosts, launch a fresh Playground from the same Template on the other Host and retire the old one.
</details>

<details>
<summary>Can two people share a Host?</summary>

Create a company-owned Host in a [Team workspace](/concepts/teams/). Accepted members may operate that company's Host and Playgrounds; accepted administrators govern the company. Company ownership, funding and quotas are independent of a creator's personal account.

Leaving or removing a creator does not destroy company-owned Playgrounds or their volumes. Their personal authority ends, while durable company automation and retained company resources remain subject to live entitlement and revocation checks. A personal Host does not change owner merely because the browser selects a company.
</details>

<details>
<summary>Host goes down?</summary>

Connection check flips the Host to error. Playgrounds become unreachable until the host returns, and live Agent chats stop automatically with a message that the Host became unavailable (their data is kept). No automatic failover.
</details>

<details>
<summary>Does the Host see my source?</summary>

Source-mounted templates clone the repository with Repository credentials. Image-only templates expose the image, not raw source. Mounted source remains for the Playground's lifetime.
</details>

## Related

- [Wallet, Mana & Sparks](/concepts/billing/): how you fund a Host.
- [Repositories](/concepts/repositories/): repos Fibe pulls from.
- [Playgrounds](/concepts/playgrounds/): what runs on Hosts.
- Reference: [`fibe-product-map`](/reference/fibe-product-map/), [`fibe-feature-surface`](/reference/fibe-feature-surface/), [`reference-fibe-labels`](/reference/reference-fibe-labels/).
