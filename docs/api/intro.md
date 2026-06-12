---
title: API reference
description: Public /api namespace conventions for authentication, response envelopes, pagination, async operations, and endpoint groups.
slug: /api
sidebar_label: Overview
keywords: [Fibe API, REST API, bearer token, async requests]
---

# API reference

This reference covers the public `/api` namespace exposed by Fibe. It does not cover payment-provider webhook routes, team management (not yet available over the API), or routes outside `/api`.

Use the SDK, CLI, or MCP server when you want a supported automation surface with command discovery and auth profile handling. Use the HTTP API when you need direct REST integration.

## Base URL

Use the environment host plus the `/api` namespace:

| Environment | Base URL |
| --- | --- |
| Production | `https://fibe.gg/api` |
| Staging | `https://next.fibe.live/api` |

## Authentication

Send API keys as bearer tokens:

```http
Authorization: Bearer fibe_...
Accept: application/json
Content-Type: application/json
```

API requests are authenticated as the player that owns the token. API access is limited to beta or super-admin players. Some endpoints also require scoped API keys, such as `monitor:read` for event monitoring.

`GET /api/me` returns the current API identity and the scopes attached to the token.

## Response shapes

Most resource reads return the serialized resource directly:

```json
{
  "id": 123,
  "name": "example"
}
```

List endpoints use a shared envelope:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 0
  }
}
```

Pagination parameters:

| Parameter | Default | Maximum | Notes |
| --- | --- | --- | --- |
| `page` | `1` | `1000` | One-based page number. |
| `per_page` | `25` | `100` | Page size. |
| `limit` | `25` | `100` | Alias used by endpoints that accept limit-style pagination. |

Failures use the shared error envelope (with one exception — polling a missing or expired async request, covered under [Async operations](#async-operations)). Error codes are stable upper-case identifiers — branch on the `code`, never on message text:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": {}
  }
}
```

Common codes include `VALIDATION_FAILED`, `UNAUTHORIZED`, `FORBIDDEN`, `RESOURCE_NOT_FOUND`, `RATE_LIMITED`, and `MARQUEE_NOT_FUNDED` (402 — the selected Marquee isn't funded).

Conversation, live-state, and queued-turn endpoints that talk to a live Genie return `422` with a code explaining why delivery failed: `AGENT_RUNTIME_NOT_RUNNING` (the Genie has no running session), `AGENT_RUNTIME_UNREACHABLE` (the session can't be reached), or `AGENT_RUNTIME_ERROR` (the session returned an unexpected error). The `details` object carries the agent (and conversation) involved.

Sending a chat message to a Genie fails with `422` and code `AGENT_COMMUNICATION_FAILED`; the message text gives the reason — `AGENT_BUSY` means the Genie is mid-turn (retry later, or resend with the `queue` busy policy to add it as a queued turn), `NEED_AUTH` means the Genie's provider credentials need re-authentication.

### Rate limits

API requests are rate limited per account (default **5,000 requests per hour**; the limit can be raised per account — contact support). When the limit is exceeded the API returns `429` with code `RATE_LIMITED`; honor the `Retry-After` header before retrying.

Responses to authenticated requests also include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` (seconds until the window resets), so you can pace requests before hitting the limit.

Responses include `X-Request-Id` when a request id is available.

## Async operations

Long-running operations return `202 Accepted` with a polling URL:

```json
{
  "request_id": "0b4c9a52-...",
  "status": "queued",
  "status_url": "/api/async_requests/0b4c9a52-..."
}
```

Poll `GET /api/async_requests/:id` until the operation is terminal. Queued and running requests return `202`; terminal and error states return `200`.

Status records are short-lived: each progress update keeps one alive for about 10 minutes. A missing or expired async request returns `404` — and this response is a plain `{ "error": "Request not found" }` body without an error code, so treat any `404` from the polling endpoint as expired-or-unknown rather than branching on a code. Start polling right after the `202` response rather than coming back much later.

Some write endpoints support `Idempotency-Key` for safe retries. A successful response is remembered for **24 hours** per key: retrying with the same key replays the original response and sets the `X-Idempotent-Replayed: true` header so you can tell a replay from a fresh write. Reuse the same key only for retries of the same logical operation.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/async_requests/:id` | Poll a queued async operation. |

## Endpoint groups

| Group | Contents |
| --- | --- |
| [Platform](./platform.mdx) | Marquees, props, playgrounds, playspecs, template imports, launches, and compose validation. |
| [Agents and knowledge](./agents-and-knowledge.mdx) | Agents, conversations, artefacts, feedback, events, memory, uploads, and conversation synchronization. |
| [Integrations](./integrations.mdx) | API keys, secrets, job environment, GitHub and Gitea repositories, installations, webhooks, and audit logs. |

Each endpoint group is rendered from an OpenAPI 3.1 definition. Click **Authorize** on a group page, paste your `FIBE_API_KEY`, choose Production or Staging, and use **Try it out** to exercise an endpoint directly from the docs.
