---
title: API Keys
description: Scoped tokens with resource restrictions, expiration, rotation, and optional Genie access.
slug: /advanced/api-keys
sidebar_position: 4
keywords: [API keys, authentication, scopes, granular, programmatic access, CLI, integration, agent-accessible]
---

API keys authenticate scripts, CLI sessions, integrations, and Genies.

## Family scopes

Scopes combine a resource **family** with an **action**, such as reading Marquees or managing Secrets.

- **read**: list and view.
- **write**: create and update.
- **delete**: remove.
- **narrow scope** (e.g. `launch:write`): single action across a family.

Some families also offer a combined **manage** scope equal to read + write + delete. Templates have `import_templates:read` and `import_templates:write`; deletion is covered by the write scope rather than a separate delete scope. Pick the narrowest scope that gets the job done.

Available scope families:

| Area | Scopes |
| --- | --- |
| Hosts and runtime | `marquees:read/write/delete/manage`, `playgrounds:read/write/delete`, `launch:write` |
| Source and blueprints | `props:read/write/delete`, `playspecs:read/write/delete`, `import_templates:read/write`, `mutations:read/write` |
| Genies and activity | `agents:read/write/delete`, `conversations:read/write/delete/manage`, `memories:read/write/delete/manage`, `monitor:read`, `artefacts:read/write/delete`, `mutters:read/write`, `feedbacks:read/write/delete` |
| Credentials and integrations | `keys:manage`, `webhooks:read/write/delete`, `secrets:read/write/delete/manage`, `job_env:read/write/delete/manage` |

The wildcard `*` scope is reserved for administrators. Team-bound keys can only be created for a team you belong to.

## Granular resource restriction

Narrow a family scope further to **a specific list of resources**. A key with "manage Secrets" can be restricted to two Secrets by ID; it has no access to any other Secret.

Resource ownership is checked when you save the key, so you cannot grant access to resources you do not own.

Granular restriction only applies to resource-backed families such as Marquees, Props, Playspecs, Playgrounds, Genies, Secrets, Webhooks, conversations, memories, and monitor events. Broad action scopes that don't map to an owned resource, such as `launch:write`, are not per-resource restricted.

### Example: CI key

- CI needs to launch environments from automation.
- Scope: `launch:write`.
- Add only the resource-backed read/write scopes the automation also needs, and restrict those by ID where possible. Don't model `launch:write` as "launch only Playspec 42": that scope is not granular.

## Create a key

Fields:

- **Label**: your reference (e.g. `CI/CD Pipeline`, `Local Dev`). Required.
- **Scopes**: at least one required.
- **Expires at**: optional. Blank = no expiry. Set a date for auto-expire.
- **Restrict to specific resources**: optional granular restriction.
- **For agents (unencrypted)**: store unencrypted for direct Genie access. Only check if a Genie needs to read the token at runtime.

Regular secrets appear **once** at creation. Copy them immediately; later, Fibe shows only the first 14 characters. Agent keys remain available through **Reveal** after second-factor confirmation.

## Manage existing keys

Per-key actions:

- **Rotate**: replaces the key with the same scopes and restrictions, expires the old one, and shows the new secret once. Linked Genies switch automatically.
- **Expire now**: kill the key immediately.
- **Delete**: permanent.

Card metadata: created time, last used, scopes, restrictions, status.

### Gateway Mana reserve

The **Gateway Mana** panel can reserve Mana for a key. Gateway spending uses only that allocation, and unused Mana can return to your wallet.

## Agent keys (unencrypted)

Mark a key "For agents (unencrypted)" only when a Genie must read it at launch. Anyone with account access can also read the token.

A Genie can link only to a key with this flag; regular keys are rejected.

Treat agent keys as more sensitive. Rotate aggressively. Combine with granular restriction so the Genie only has access to what it needs.

## Lifecycle and safety

- Raw token shown once at creation (agent-accessible keys excepted). Copy then, or rotate.
- API calls are rate-limited: by default 5,000 requests per hour per account, shared across all your keys. The limit can be raised per account via support.
- Set an expiration so old keys age out.
- Revoke at any time; future calls fail immediately.
- Creating, deleting, rotating, revealing, and Gateway Mana lock/unlock actions require [2FA re-authentication](/advanced/security/). Expiring or editing a key does not trigger the sudo challenge.

## FAQ

<details>
<summary>Keys after account deletion?</summary>

Deleting your account revokes every key it owns immediately.
</details>

<details>
<summary>Token format?</summary>

API keys start with `fibe_live_` or `fibe_test_` and are sent as `Authorization: Bearer <token>`. Treat them like passwords. Don't log, commit, or paste them into chat.
</details>

<details>
<summary>Scope a key by IP address?</summary>

Not today. Use a rate-limited, narrowly-scoped key and rotate it regularly.
</details>

<details>
<summary>Lost the raw token?</summary>

Rotate a regular key to replace a lost token. For an agent key, use **Reveal** after confirming your second factor.
</details>

## Related

- [Security and Sessions](/advanced/security/): required to manage keys.
- [Webhooks](/advanced/webhooks/): the read-side counterpart.
- [Secret Vault](/advanced/secrets/): credentials your services use, not for talking to Fibe itself.
- [SDK authentication](/sdk/authentication/): wiring a key into the CLI.
