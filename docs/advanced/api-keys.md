---
title: API Keys
description: Create owner-bound credentials with scoped access for scripts and the released Fibe SDK.
slug: /advanced/api-keys
sidebar_position: 4
keywords: [API keys, authentication, scopes, programmatic access, CLI, integration]
---

API keys authenticate API requests from scripts and client tools. Treat each key like a password, use a dedicated key for each automation, and give it only the scopes that workflow needs.

## Owner and authority

A key is created in the selected Personal or Team owner context. Its scopes do not bypass the API's resource-owner checks, and choosing a different owner in a client cannot widen the key. Team access is also checked against current membership or the supported service-principal authority.

## Available scopes

The native scope registry includes these families. The exact operation-to-scope mapping is endpoint-specific; consult the OpenAPI operation and the key form for the current installation.

| Area | Scopes |
| --- | --- |
| Hosts and workloads | `hosts:read`, `hosts:write`, `hosts:delete`, `hosts:manage`; `playgrounds:read`, `playgrounds:write`, `playgrounds:delete`, `playgrounds:manage`; `launch:write` |
| Source and definitions | `repositories:read`, `repositories:write`, `repositories:delete`; `specs:read`, `specs:write`, `specs:delete`; `import_templates:read`, `import_templates:write`; `git_credentials:read` |
| Agents and activity | `agents:read`, `agents:write`, `agents:delete`; `artefacts:read/write/delete`; `mutters:read/write`; `feedbacks:read/write/delete`; `conversations:read/write/delete/manage`; `memories:read/write/delete/manage`; `monitor:read`; `agent_presets:read/write` |
| Credentials and integrations | `keys:manage`; `webhooks:read/write/delete`; `secrets:read/write/delete/manage`; `job_env:read/write/delete/manage`; `env_packs:read/write/delete/manage` |

Manage scopes expand to their supported read, write, and delete actions. `*` is reserved for installation administrators. Scope names and permissions can change with the native API contract; use the current OpenAPI and key creation form as the source of truth.

## Create and manage a key

1. Open **Profile → Advanced Settings → API Keys** and select the intended owner.
2. Enter a label and choose the minimum scopes needed. Set an expiry when the automation has a defined lifetime.
3. Create the key and copy the returned secret to a secure secret store. Fibe does not show a regular key's full value again.
4. Use **Rotate** to replace a key, **Expire** to disable it, or **Delete** to remove it. Rotation invalidates the prior secret. Check connected automation before rotating.

New key values are returned once. Some keys can be marked for Agent use; the native implementation stores the Agent-accessible value encrypted and protects reveal with a recent-authentication check. This is a separate capability from a normal key and should be enabled only when an Agent needs it.

Personal key admission has a default quota of 20 undeleted keys, including expired keys. Deleting a key frees a slot. Administrators can inspect and override supported owner quotas through [Limits & Quotas](/advanced/limits/).

## Use a key

Send it in the HTTP authorization header:

```http
Authorization: Bearer <FIBE_API_KEY>
```

For SDK profiles and environment variables, see [SDK authentication](/sdk/authentication/). Do not place keys in URLs, browser JavaScript, logs, or source control.

## Related

- [Security & Sessions](/advanced/security/): recent authentication and session controls.
- [Secret Vault & Job ENV](/advanced/secrets/): workload credentials, distinct from API authentication.
- [API reference](/api/): endpoint contracts and security requirements.
