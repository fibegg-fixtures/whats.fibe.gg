---
title: Secret Vault & Job ENV
description: Encrypted credential storage. Secret Vault for long-lived shared secrets; Job ENV for credentials Tasks need at run time.
slug: /advanced/secrets
sidebar_position: 5
keywords: [secret vault, secrets, credentials, encrypted storage, Job ENV, environment variables]
---

Two homes for credentials, depending on who needs them and when.

## Secret Vault

Encrypted store for long-lived values that shouldn't appear in source or template bodies. Use for external API tokens, third-party credentials, anything you'd rotate every few months and reuse from many places.

Authorized API clients can address a Secret by its key or ID. Supported Agent credentials and Job ENV entries can reference a same-owner Vault Secret explicitly. A Vault entry is not automatically substituted into an arbitrary Compose variable or launch.

### When to use

- An LLM provider API key your Agents need.
- A Stripe API key your scheduled report Task needs.
- A third-party webhook signing secret.
- An OAuth client secret for a custom integration.

### Properties

- Encrypted at rest.
- Listed by name; raw value shown only on explicit reveal.
- Edit its value or description, or delete it from the Vault page. The key stays fixed.
- Creating, deleting, and revealing entries requires [recent authentication](/advanced/security/) under the account’s permitted password or enrolled-factor policy. Updating an existing value or description still requires current owner authority.

## Job ENV entries

Inject environment values into **Task runs**. Two scopes:

- **Owner-wide**: applies to eligible Tasks in the selected Personal or Team workspace.
- **Repository-scoped**: applies to eligible Tasks tied to that Repository under the same owner; secret entries override plain entries; within the same secrecy class a repository-specific value overrides the matching owner-wide key.

A Job ENV entry may store an encrypted value directly or reference a same-owner Vault Secret. Secret entries are withheld from pull-request-triggered runs. Changes apply to future admitted Tasks; they do not rewrite a running Task’s captured inputs. Names beginning with `FIBE_` are reserved.

Prefer Job ENV over template variables when a credential is reused across many runs and the launcher should not have to supply it each time.

### When to use Job ENV

- A deploy token your CI Task needs on every push.
- An AWS access key your nightly backup Task uses.
- A Slack webhook URL your daily-summary Task posts to.

### Two scopes

- **Owner-wide Job ENV**: a value shared by eligible Tasks of that owner, such as a Slack webhook URL.
- **Repository-scoped Job ENV**: multiple repos with different deploy keys. Repo A's CI Task gets repo A's key; B gets B's; they never see each other's.

## Where to keep what

| Value | Home |
| --- | --- |
| App-level launch config (app name, environment label) | Template variable |
| Generated DB password retained with one Spec | Variable with `random: true`; reuse the Spec’s saved value |
| External API token (Stripe, LLM provider, etc.) | **Secret Vault** |
| Credential reused across many Tasks | **Job ENV entry** |
| Sensitive value the launcher should type each time | Variable marked `sensitive` |

## Anti-patterns

- **Don't** put a real secret in a Template's `default:` field. It lands in git when the Template is source-linked.
- **Don't** re-randomize a database password on every launch: existing data becomes unreachable.
- **Don't** ask the launcher to type a long-lived API key every time. Use the vault.
- **Don't** duplicate a shared secret value across entries. A Job ENV entry can reference a same-owner Vault Secret instead of storing a second copy.

## Audit

Creating, changing, deleting and explicitly revealing a Vault entry are recorded in the [Audit log](/advanced/audit-log/). Ordinary masked metadata reads do not reveal the value. Reveal rechecks current owner, permission and recent authentication before releasing plaintext; the audit contains no secret value.

## FAQ

<details>
<summary>Can an Agent see Vault secrets?</summary>

An Agent can use a supported same-owner Vault credential reference after current permission checks. Normal Agent settings show the reference rather than the Vault value. This does not grant the Agent arbitrary access to other owner Secrets.
</details>

<details>
<summary>Job ENV values in Task logs?</summary>

Treat Task output as potentially containing any value your job prints. Do not echo credentials. Secret Job ENV entries are withheld from pull-request-triggered runs; eligible push, scheduled and manual runs capture their values at admission.
</details>

<details>
<summary>Export Vault contents?</summary>

[Data Backup](/advanced/backup/) exports your secret names and descriptions only: values are never included in the file. After importing a backup, re-enter each secret's value (imported entries carry a placeholder until you do).
</details>

## Related

- [API Keys](/advanced/api-keys/): credentials for Fibe itself, not your services.
- [Webhooks](/advanced/webhooks/): outbound endpoints manage their own encrypted signing secrets.
- [Tasks](/concepts/tasks/): what consumes Job ENV.
- Reference: [`decide-secrets-and-randoms`](/reference/decide-secrets-and-randoms/), [`recipe-random-and-secrets`](/reference/recipe-random-and-secrets/).
