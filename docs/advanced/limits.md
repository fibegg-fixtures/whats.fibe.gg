---
title: Limits & Quotas
description: Resource usage, account quotas, per-parent caps.
slug: /advanced/limits
sidebar_position: 3
keywords: [limits, quotas, usage, caps]
---

Current resource usage versus account quotas, plus per-parent caps applied to nested resources.

## Resource quotas

Per-resource counts and limits. Each row shows used / limit / status (OK, near limit, exceeded).

Default quotas per account:

| Resource | Default quota |
| --- | --- |
| Playgrounds | 1,000 |
| Genies | 10 |
| Pokes | 20 |
| Playspecs | 1,000 |
| Props | 1,000 |
| Templates | 20 |
| API keys | 20 |
| Webhook endpoints | 20 |
| Secrets | 100 |
| Job ENV entries | 200 |
| Scroll artefacts | 500 |

Counts are how many you currently have (Trick runs count as Playgrounds). Marquee allowance is tracked separately from this table — by default 100 standard Marquees and 1 tutorial Marquee.

Quotas are platform defaults that can be raised per account — contact support if you hit one. Platform support accounts may have nonstandard limits for support work. [Billing](/concepts/billing/) top-ups fund your wallet; they don't change these quotas. Only your Marquee allowance is tied to your subscription.

## Per-parent caps

Maximums applied per parent resource. Examples:

- Deliveries kept per webhook endpoint (1,000).
- Build records per Prop (100).
- Artefacts per Genie (100).
- Mounted files per Genie (5, up to 10 MB each).
- Versions per Template (100).
- Template body size (100,000 characters).
- Template cover image size (500 KB; JPEG, PNG, SVG, or WebP).
- Avatar size, for players and Genies (2 MB; PNG, JPEG, GIF, or WebP).
- Concurrent SSH terminal sessions per Marquee (3; each session lasts up to 4 hours).

These prevent one resource from monopolizing storage or throughput. Enforced silently at create time.

## Genie limits

Caps applied to each Genie and its chat:

| Limit | Default |
| --- | --- |
| Provider credentials size | 64 KB |
| Chat file upload (per file) | 20 MB |
| Document conversion (OCR) input | 10 MB |
| Document conversion (OCR) output | 25 MB |
| Memory | 2 GB |
| CPU | 1.5 |

Document conversion limits are defaults and can be raised per Genie. Memory and CPU are adjustable per Genie (see [Agent Defaults](/advanced/agent-defaults/)); Genies on a tutorial Marquee run with 1 GB memory and 1.0 CPU.

## Statuses

- **OK** — well under the limit.
- **Near limit** — within the configured warning band (typically 80%).
- **Exceeded** — at or past the limit; new creates are blocked until usage drops.

## Related

- [Billing](/concepts/billing/) — wallet top-ups and subscriptions.
- [API Keys](/advanced/api-keys/) — scopes and rotation.
