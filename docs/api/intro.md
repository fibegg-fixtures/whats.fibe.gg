---
title: API reference
description: Authentication, response conventions, asynchronous operations, and endpoint groups for a self-hosted Fibe installation.
slug: /api
sidebar_label: Overview
keywords: [Fibe API, self-hosted, REST API, bearer token, async operations]
---

# API reference

Fibe's HTTP API is served by the installation you operate. This reference is generated from the native Rust server's OpenAPI contract. Use the API host for your own installation; there is no shared staging or hosted-service base URL.

The server contract advertises the `self_hosted` profile, major version `1`. Endpoints outside `/api` also serve the browser application, health checks, setup, and operator interfaces. API operations require the authentication mode and scope documented by that endpoint.

## Base URL

Use your installation origin followed by `/api` for API routes. For example, if Fibe is at `https://fibe.example.net`, the API base is `https://fibe.example.net/api`.

## Authentication

For API-key routes, send the key as a bearer token:

```http
Authorization: Bearer <FIBE_API_KEY>
Accept: application/json
Content-Type: application/json
```

Credentials are subject to scope, owner, and current authority checks. Selecting a Team in the browser does not widen an API key's authority. Do not put keys in URLs, source control, or client-side applications. The `GET /api/me` route reports the API identity and scopes available to the credential.

Some installation and browser routes use the session and CSRF protections described by their own contract; a bearer key is not a substitute for those browser protections.

## Responses and errors

Use the OpenAPI operation definition as the source of truth for each request and response. The API returns structured error codes for many failures; clients should branch on the documented code and status rather than user-facing message text. A route may have an endpoint-specific response shape, so do not assume every list or mutation shares one envelope.

Long-running operations use durable request or operation records where the endpoint defines them. Follow the returned operation identity and status route. A timeout or missing observation does not prove that an external effect did not happen; inspect the operation before retrying a side effect. Use an idempotency key only where the endpoint supports it, and reuse it only for the same logical operation.

## Endpoint groups

| Group | Contents |
| --- | --- |
| [Platform](./platform.mdx) | Hosts, Repositories, Specs, Playgrounds, launch and workload operations. |
| [Agents and knowledge](./agents-and-knowledge.mdx) | Agents, conversations, Library activity, and related records. |
| [Integrations](./integrations.mdx) | API keys, Secrets, Job ENV, Git integrations, webhooks, and Audit Logs. |

Each group uses the OpenAPI contract for the pinned native API identity. The reference UI origin selector defaults to `https://fibe.example`; replace it with the origin of the Fibe installation you operate before trying a request. Use **Authorize** only with a disposable key scoped for the operation you are inspecting, and confirm the selected origin before submitting a mutation. This guide publishes its reviewed specification at [the public contract mirror](https://whats.fibe.gg/native/openapi.json). A Native installation serves its own contract at `/openapi.json` and route inventory at `/route-manifest.json`; use those installation-local documents when checking a different installed revision.

## SDK and tool coverage

The released Fibe SDK v0.3.3 is a separate consumer of the API. Its CLI and MCP commands are not proof that every server operation or workflow is supported or qualified by that release. Check `fibe --help`, `fibe doctor`, and the tool-specific documentation for the released client's available surface. For an operation the client does not expose, use the native OpenAPI contract directly with a properly scoped credential.
