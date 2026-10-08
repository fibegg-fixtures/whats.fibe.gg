---
name: fibe-security-access-and-integrations
description: Use for Fibe authentication, sessions, sudo mode, two-factor auth, WebAuthn, API keys, Secret Vault, Job ENV, webhooks, audit logs, data portability and notifications.
---

# Fibe security, access, and integrations

Use this skill when a user asks who can access what, how credentials are protected, how automation authenticates, or how Fibe integrates with outside systems.

## Company ownership

Company workspaces own their Hosts, Repositories, Specs, Playgrounds, Agents, Library records, Secrets, credentials, defaults and finance independently of personal resources. Accepted members operate company resources; accepted administrators govern membership, credentials and billing. Ownership is immutable, and children inherit their root owner. Another company's ID or a creator's personal credentials cannot provide authority.

Individual credentials require live membership. Durable company service principals continue independently of their issuer, but key/principal revocation and company closure block later effects. Company resources and retained history survive creator departure. Existing personal sharing remains a separate legacy contract; it does not become company ownership.

Removal records a durable enrollment block. Restoration requires an audited native admin request and the removed person's explicit acceptance. Existing applied ENV-pack snapshots remain repairable after grant loss; fresh use requires valid renewed authority.

## Sessions and trust

Fibe uses browser sessions with expiry, device context, and trust state. Sessions can become untrusted when security-sensitive context changes, and users may need to restore trust with two-factor authentication or a security key.

Sensitive actions require sudo mode: a short-lived re-verification window. Examples include managing API keys, secrets, webhooks, all-session revocation, and security keys.

## Two-factor authentication

Fibe supports authenticator-app TOTP, recovery codes, and WebAuthn security keys.

Important rules:

- TOTP setup shows a QR code and requires verification.
- Recovery codes are single-use and should be saved by the user.
- Regenerating recovery codes invalidates old ones.
- Security keys can restore trust or satisfy sudo verification.
- Removing a security key or disabling 2FA requires a valid verification step.

## API keys

API keys provide scoped programmatic access for API, CLI, MCP, and agent workflows.

Common scope families:

- `hosts:read`, `hosts:write`, `hosts:delete`, `hosts:manage`
- `repositories:read`, `repositories:write`, `repositories:delete`
- `specs:read`, `specs:write`, `specs:delete`
- `playgrounds:read`, `playgrounds:write`, `playgrounds:delete`
- `import_templates:read`, `import_templates:write`
- `agents:read`, `agents:write`, `agents:delete`
- `artefacts:read`, `artefacts:write`, `artefacts:delete`
- `mutters:read`, `mutters:write`
- `feedbacks:read`, `feedbacks:write`, `feedbacks:delete`
- `mutations:read`, `mutations:write`
- `launch:write`
- `keys:manage`
- `webhooks:read`, `webhooks:write`, `webhooks:delete`
- `secrets:read`, `secrets:write`, `secrets:delete`, `secrets:manage`
- `job_env:read`, `job_env:write`, `job_env:delete`, `job_env:manage`
- `conversations:read`, `conversations:write`, `conversations:delete`, `conversations:manage`
- `memories:read`, `memories:write`, `memories:delete`, `memories:manage`
- `monitor:read`
- `env_packs:read`, `env_packs:write`, `env_packs:delete`, `env_packs:manage`
- `billing:read`, `billing:write`
- `agent_presets:read`, `agent_presets:write`

Use narrow scopes for automation. Use granular restrictions when a key should only touch specific resources. The raw token is shown only at creation time. Full-access wildcard keys exist for administrator-level cases, but should not be the default recommendation.

## Secret Vault

Secret Vault stores user-owned sensitive values for Agents and workflows.

Use Secret Vault when:

- The value is long-lived.
- The value should not be committed to source control.
- The value should not appear in template YAML.
- A Agent or workflow needs to retrieve it securely.

Do not confuse Secret Vault with template variables marked `secret` or `sensitive`; those flags shape launch UI behavior, while Secret Vault is the long-lived credential store.

## Job ENV

Job ENV entries inject environment variables into job-mode runs.

Use Job ENV when:

- The value is only needed for Tasks.
- The same credential should be reused across job runs.
- A Repository-specific override should beat a global value for one repository.

## Webhooks

Webhooks deliver signed HTTP callbacks when Fibe resources change.

Webhook capabilities:

- Subscribe to event families such as Playground, Host, Repository, Spec, Agent, Template, Artefact, Feedback, Mutter, API Key, Secret, and Webhook events.
- Use event filters to restrict events to selected resources.
- Test a webhook endpoint.
- Inspect delivery history.
- Receive HMAC-signed payloads.
- Automatically disable endpoints after repeated failures.

Safety expectations:

- Avoid private-network callback URLs in protected environments.
- Treat webhook secrets like credentials.
- Verify signatures before trusting payloads.

## Audit logs

Audit logs provide read-only history of important actions. They help answer:

- Who changed this?
- What resource changed?
- When did it happen?
- Was the actor a user, system automation, API key, or Agent?

Use audit logs for investigation and accountability, not as a live message queue.

## Data portability

Users can export and import major configuration areas, including repositories, hosts, environment blueprints, agents, running-environment configuration, templates, secrets, and webhooks.

Imports support conflict choices such as merge or skip. Completed imports may support rollback for records created during the import.

## Related skills

- [fibe-feature-surface](fibe-feature-surface.md)
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md)
- [decide-secrets-and-randoms](decide-secrets-and-randoms.md)
- [recipe-random-and-secrets](recipe-random-and-secrets.md)
