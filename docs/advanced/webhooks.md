---
title: Webhooks
description: Signed event callbacks to external systems. Family subscription plus granular event filters, HMAC signing, test deliveries.
slug: /advanced/webhooks
sidebar_position: 6
keywords: [webhooks, HTTP, notifications, events, signature, HMAC, granular filters, event_filters]
---

Send signed event callbacks to external systems when Fibe resources change. Outbound counterpart to API keys: API keys let things call **into** Fibe; webhooks let Fibe call **out**.

## Subscribing to event families

Each webhook has:

- A **destination URL** — HTTPS required.
- A **selection of event types** to listen for — exact names, or `*` for everything.
- A **signing secret** — Fibe HMAC-signs every payload; verify on receipt.

Available families cover **Playgrounds, Marquees, Props, Playspecs, Agents, Templates, Artefacts, Mutters, Feedback, API keys, Secrets, Webhooks**.

## Granular event filters

Family subscription often delivers more than you want. Narrow with **event filters** — receive callbacks only for the specific resources you care about. A filter restricts an event type to a list of resource IDs.

Examples:

- Playground events, only state changes on **one Playground**.
- Template events, only when **one specific Template** changes.

## Create an endpoint

Fields:

- **URL**.
- **Events** — one or more event types.
- **Description** — your reference.
- **Active** — toggle to pause without deleting.

Signing secret generated at creation. Use it to verify deliveries.

## Event types (examples)

- `playground.created`, `playground.creation.completed`, `playground.creation.failed`
- `playground.error`, `playground.completed` (a Trick / job run finished), `playground.destroyed`
- `template.updated`
- `agent.created`
- `secret.updated`
- `webhook.test`

You subscribe to exact event types (or `*` for everything); unknown event names are rejected when you save the endpoint. The endpoint page shows the full catalog.

## Delivery model

- Each event produces one POST to your URL with a JSON body.
- A non-2xx response counts as a failed delivery and is **not retried**. Network-level failures (timeouts, connection refused) are retried up to 3 attempts with increasing delays.
- After 10 consecutive failures the endpoint is disabled automatically; one successful delivery resets the counter.
- The signature is sent in the `X-Webhook-Signature` header as `sha256=<hex digest>`, an HMAC-SHA256 over the raw request body using your signing secret.
- Each delivery also carries `X-Webhook-Event` (the event name) and `X-Webhook-Delivery` / `X-Idempotency-Key` (the unique delivery id — use it for idempotency).

## Verify signatures

```python
import hmac, hashlib

def verify(body: bytes, header: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(header, expected)
```

Constant-time compare.

## Test & observe

- **Test delivery** from the endpoint page before depending on it.
- **Delivery history** shows payloads sent, timestamps, receiver responses. Useful for debugging. Kept for 30 days and capped at the most recent 1,000 deliveries per endpoint; older records are pruned automatically.

## Resilience

- Payloads are HMAC-signed.
- Repeated failures **auto-disable** the endpoint — it stays off until you switch it back on yourself, with the **Active** toggle or an endpoint update via the API.
- Re-enabling does **not** replay missed events. Use the [Audit log](/advanced/audit-log/) for missed events.

## Common pitfalls

- Pointing a webhook at a private network address from a protected environment — callback never arrives.
- Logging the raw payload alongside the secret — defeats signing.
- Skipping signature verification because the URL is "secret enough" — it isn't.

## Example: Slack notification on Trick failure

- **Destination URL** — your Slack incoming-webhook URL.
- **Events** — the failure event types themselves: `playground.creation.failed`, `playground.error` (Trick runs are Playground events). There is no status filter.
- **Event filters** — optionally restrict to the specific Playgrounds you care about, by ID.
- **Signing secret** — HMAC secret verified in your Slack-relay function.

In practice, relay through a small worker that translates Fibe's payload into Slack blocks.

## FAQ

<details>
<summary>Signing scheme?</summary>

HMAC-SHA256 with the signing secret, over the raw request body. Signature sent in a header. Verify before doing anything with the payload.
</details>

<details>
<summary>How many webhooks can I have?</summary>

20 endpoints per account by default. Your current usage and limit are shown on the [Limits & Quotas](/advanced/limits/) page; contact support if you need more.
</details>

<details>
<summary>Webhook triggering another Fibe action?</summary>

No. Webhooks are outbound. To trigger a Fibe action from an external event, use an API key from that external system.
</details>

## Related

- [API Keys](/advanced/api-keys/) — inbound counterpart.
- [Audit log](/advanced/audit-log/) — searchable history of changes.
- [Tricks](/concepts/tricks/) — common webhook trigger source.
