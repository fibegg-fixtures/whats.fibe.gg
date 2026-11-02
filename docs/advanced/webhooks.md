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

- A **destination URL**: HTTPS is required by protected deployment policy; development behavior follows the installation’s configured policy.
- A **selection of event types** to listen for: exact names, or `*` for everything.
- A **signing secret**: Fibe HMAC-signs every payload; verify on receipt.

Available families cover **Playgrounds, Hosts, Repositories, Specs, Agents, Templates, Artefacts, Mutters, Feedback, API keys, Secrets, Webhooks**.

## Granular event filters

Family subscription often delivers more than you want. Narrow with **event filters**: receive callbacks only for the specific resources you care about. A filter restricts an event type to a list of resource IDs.

Examples:

- Playground events, only state changes on **one Playground**.
- Template events, only when **one specific Template** changes.

## Create an endpoint

Fields:

- **URL**.
- **Events**: one or more event types.
- **Description**: your reference.
- **Active**: toggle to pause without deleting.

Signing secret generated at creation. Use it to verify deliveries.

## URL safety

Protected deployments require HTTPS when saving an endpoint. Ordinary requests also reject localhost, loopback and private-network destinations under the installation’s SSRF policy. The supported exception is a Personal endpoint owned by an installation administrator; nondeployment environments also have a policy bypass. Team endpoints do not inherit an administrator creator’s Personal exception. A temporarily unreachable host can be saved without claiming delivery succeeded.

Resolved destination addresses are checked again before each send under the current applicable SSRF policy. Redirects are not followed. The HTTPS requirement is an admission check; it is separate from delivery-time address checks.

## Event types (examples)

- `playground.created`, `playground.creation.completed`, `playground.creation.failed`
- `playground.error`, `playground.completed` (a Task / job run finished), `playground.destroyed`
- `template.updated`
- `agent.created`
- `secret.updated`
- `webhook.test`

You subscribe to exact event types (or `*` for everything); unknown event names are rejected when you save the endpoint. The endpoint page shows the full catalog.

## Delivery model

- A matching event creates a durable delivery identity. Its attempts POST the captured JSON body to your URL.
- HTTP `408`, `429`, `5xx`, and transport failures can retry automatically while the delivery stays within its initial **3-attempt budget**, with `attempt^4 + 2` seconds between attempts. An explicit authorized manual retry can add later attempts under the same delivery identity. Other non-2xx responses settle as failures. A transport timeout leaves the send outcome uncertain; retries keep the same delivery identity.
- After 10 final failed deliveries the endpoint is disabled automatically; a successful delivery resets the counter. Intermediate retry attempts do not each count as a final failure.
- The signature is sent in the `X-Webhook-Signature` header as `sha256=<hex digest>`, an HMAC-SHA256 over the raw request body using your signing secret.
- Each attempt carries `X-Webhook-Event`, the public delivery ID in `X-Webhook-Delivery`, and the stable idempotency identity in `X-Idempotency-Key`. Deduplicate repeated attempts before applying an external effect.
- Requests use `User-Agent: Fibe-Webhook/1.0`, a **3-second connect timeout** and a **5-second total request timeout**. Redirects are not followed. Stored response text is truncated to 10,000 characters.

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
- **Delivery history** shows captured payloads, timestamps and receiver responses. Fully observed terminal history leaves ordinary visibility after 30 days or under the endpoint’s configured history quota (default 1,000). Pending or uncertain sends remain visible rather than being discarded to satisfy that cap; immutable attempt identities are retained for recovery.

## Resilience

- Payloads are HMAC-signed.
- Repeated failures **auto-disable** the endpoint: it stays off until you switch it back on yourself, with the **Active** toggle or an endpoint update via the API.
- Re-enabling does **not** replay missed events. Use the [Audit log](/advanced/audit-log/) for missed events.

## Common pitfalls

- Pointing a webhook at a private network address from a protected environment: callback never arrives.
- Logging the raw payload alongside the secret: defeats signing.
- Skipping signature verification because the URL is "secret enough": it isn't.

## Example: Slack notification on Task failure

- **Destination URL**: your Slack incoming-webhook URL.
- **Events**: the failure event types themselves: `playground.creation.failed`, `playground.error` (Task runs are Playground events). There is no status filter.
- **Event filters**: optionally restrict to the specific Playgrounds you care about, by ID.
- **Signing secret**: HMAC secret verified in your Slack-relay function.

In practice, relay through a small worker that translates Fibe's payload into Slack blocks.

## FAQ

<details>
<summary>Signing scheme?</summary>

HMAC-SHA256 with the signing secret, over the raw request body. Signature sent in a header. Verify before doing anything with the payload.
</details>

<details>
<summary>How many webhooks can I have?</summary>

The native quota policy defines 20 webhook endpoints as its default. Installation administrators can change supported owner limits from [Limits & Quotas](/advanced/limits/); inspect the current policy before creating endpoints in bulk.
</details>

<details>
<summary>Webhook triggering another Fibe action?</summary>

No. Webhooks are outbound. To trigger a Fibe action from an external event, use an API key from that external system.
</details>

## Related

- [API Keys](/advanced/api-keys/): inbound counterpart.
- [Audit log](/advanced/audit-log/): searchable history of changes.
- [Tasks](/concepts/tasks/): common webhook trigger source.
