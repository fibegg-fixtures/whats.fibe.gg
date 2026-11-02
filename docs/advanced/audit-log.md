---
title: Audit log
description: Read-only history of important changes. Who, what, when, which actor. For investigation, not notifications.
slug: /advanced/audit-log
sidebar_position: 12
keywords: [audit log, history, accountability, investigation, compliance]
---

Read-only history of important changes. Answers:

- Who changed this?
- What resource changed?
- When did it happen?
- Was it done in the UI, over the API (and with which key), or by the platform itself?

For **investigation**, not live messaging. No notifications, no push. Open the dashboard when you need answers.

## What gets recorded

Every action that meaningfully changes account or resource state:

- Create, update, delete on Hosts, Repositories, Templates, Specs, Playgrounds, Tasks, Agents.
- Issue, rotate, revoke API keys.
- Add or modify webhooks.
- Add, rotate, revoke Secret Vault entries.
- Modify Job ENV entries.
- Security-factor events: TOTP setup, enable and disable; passkey registration and removal; recovery-code confirmation.
- Session revocations.

**Not** recorded:

- Routine reads (browsing your own resources).
- Per-message Agent activity (lives in Conversations).
- Audit-log access itself.

## Actors and channels

Every entry shows the actor plus the channel it acted through:

- **Actor**: a user, an API key, an installation operator, or a system job, as recorded for that event.
- **Channel**: UI, API, System, or Webhook.

Calls made with an API key, including an Agent using its agent key, appear as **you via the API channel**, with the key's label attached so you can tell which key acted.

## What does notify you

The audit log doesn't notify. These do, on a separate path:

- **Agent messages**: in-app notification, FAB entry, browser push if enabled.
- **Commit notifications** for Repositories you follow.
- **Selected activity** you've opted into via [Inbox Notifications](/advanced/notifications/).

## Live status vs audit

The Playground page shows live service status, build steps, log streams, and expiration timers. It covers observability; the audit log records history.

## Export

The Audit Logs screen has no export control. You can retrieve authorized records through the paginated Audit Logs API. [Data Backup](/advanced/backup/) covers your resources (Repositories, Hosts, Specs, Agents, Playgrounds, Templates, Secrets, Webhooks), not history; use the dashboard filters or API to investigate.

## Example investigation

"Who deleted my Task yesterday afternoon?"

1. Open the audit log. Filter by action prefix `playground.` and set the date range to the last 24 hours: Task activity may be recorded with the owning workload event family; use the resource link and action details to identify the affected record.
2. Entry: the actor (you via the API channel, labelled with the CI key), timestamp, Playground ID.
3. Drill into the key on the API Keys page to see what else it's been doing.
4. If something's off, rotate the key and review its granular scopes.

## FAQ

<details>
<summary>Retention?</summary>

Audit entries are immutable records in the installation database. Include them in the installation backup and apply the installation's data-retention policy to its complete persistent data.
</details>

<details>
<summary>Why doesn't audit notify?</summary>

Mixing audit and notifications makes audit noisy or notifications miss things. Audit log is searchable history; notifications are interrupting. Each surface has a clear job.
</details>

## Related

- [Security & Sessions](/advanced/security/): 2FA events appear here.
- [API Keys](/advanced/api-keys/): investigating per-key activity.
- [Webhooks](/advanced/webhooks/): outbound notification path.
- [Data Backup](/advanced/backup/): exports resources, not audit history.
