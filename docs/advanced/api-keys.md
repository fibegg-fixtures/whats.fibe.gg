---
title: API Keys
description: Scoped tokens for scripts, CLI, integrations, and Genies. Family scopes plus granular per-resource restrictions, expiration, rotation, agent-accessible flag.
slug: /advanced/api-keys
sidebar_position: 4
keywords: [API keys, authentication, scopes, granular, programmatic access, CLI, integration, agent-accessible]
---

Scoped tokens for scripts, CLI sessions, tool integrations, and Genies. The way anything outside the browser talks to Fibe.

## Family scopes

First-level scoping: by **family** and **action**. An API key reads or manages a category — Marquees, Props, Playspecs, Playgrounds, Templates, Agents, Artefacts, Secrets, Webhooks, Job ENV entries, etc.

- **read** — list and view.
- **write** — create and update.
- **delete** — remove.
- **narrow scope** (e.g. `launch:write`) — single action across a family.

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

Safe to hand to a single integration: that integration sees exactly the resources you intended.

Resource ownership is validated at save time. You can't grant a key access to resources you don't own.

Granular restriction only applies to resource-backed families such as Marquees, Props, Playspecs, Playgrounds, Genies, Secrets, Webhooks, conversations, memories, and monitor events. Broad action scopes that don't map to an owned resource, such as `launch:write`, are not per-resource restricted.

### Example: CI key

- CI needs to launch environments from automation.
- Scope: `launch:write`.
- Add only the resource-backed read/write scopes the automation also needs, and restrict those by ID where possible. Don't model `launch:write` as "launch only Playspec 42" — that scope is not granular.

## Create a key

Fields:

- **Label** — your reference (e.g. `CI/CD Pipeline`, `Local Dev`). Required.
- **Scopes** — at least one required.
- **Expires at** — optional. Blank = no expiry. Set a date for auto-expire.
- **Restrict to specific resources** — optional granular restriction.
- **For agents (unencrypted)** — store unencrypted for direct Genie access. Only check if a Genie needs to read the token at runtime.

For regular keys the secret is shown **once** at creation — copy immediately; it cannot be retrieved later. After that, Fibe only shows the masked token with its first 14 characters. Keys marked "For agents (unencrypted)" are the exception: their secret stays viewable from the key card via **Reveal** (after re-confirming your second factor).

## Manage existing keys

Per-key actions:

- **Rotate** — creates a replacement key with the same scopes and restrictions and expires the old key immediately. The new secret is shown once right after rotating — update your consumers then (it doesn't exist before). Genies that were using the old key are switched to the new key automatically.
- **Expire now** — kill the key immediately.
- **Delete** — permanent.

Card metadata: created time, last used, scopes, restrictions, status.

### Gateway Mana reserve

Each key card also has a **Gateway Mana** panel: lock an amount of Mana to the key to create a spending reserve for AI-gateway usage. Gateway spend through that key can only consume its reserved allocation. Unused reserved Mana can be unlocked back to your wallet at any time.

## Agent keys (unencrypted)

Genie processes sometimes need the token in their environment. For those, mark the key "For agents (unencrypted)" at creation. The token is stored unencrypted so the Genie can read it on launch. Anyone with account access can also read it.

This flag is the gate: a Genie can only be linked to a key marked "For agents (unencrypted)" — attaching a regular key is rejected.

Treat agent keys as more sensitive. Rotate aggressively. Combine with granular restriction so the Genie only has access to what it needs.

## Lifecycle & safety

- Raw token shown once at creation (agent-accessible keys excepted). Copy then, or rotate.
- API calls are rate-limited — by default 5,000 requests per hour per account, shared across all your keys. The limit can be raised per account via support.
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

For a regular key it cannot be recovered — rotate the key to get a new token and stop the old one. For a key marked "For agents (unencrypted)", use **Reveal** on the key card (after re-confirming your second factor).
</details>

## Related

- [Security & Sessions](/advanced/security/) — required to manage keys.
- [Webhooks](/advanced/webhooks/) — the read-side counterpart.
- [Secret Vault](/advanced/secrets/) — credentials your services use, not for talking to Fibe itself.
- [SDK → Authentication](/sdk/authentication/) — wiring a key into the CLI.
