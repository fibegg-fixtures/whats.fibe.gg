---
name: fibe-security-access-and-integrations
description: Use for Native Fibe resource ownership, Vault Secrets, ENV packs, Job ENV entries, and safe handling of application credentials.
---

# Fibe security, access, and integrations

Use this guide when a workflow depends on who owns a resource, how an API request is authorized, or where a credential should be stored. Native Fibe binds resources and credentials to a personal or Team owner. API access is checked against the selected owner and the requested operation.

## Personal and Team ownership

Resources belong to a personal workspace or a Team. Team ownership provides a shared workspace; it does not make a resource public. References from a Spec, Repository, Task, Vault Secret, or ENV pack must remain within the applicable owner and authorization rules. Check both the resource owner and the current API permission before using an identifier.

## Secret Vault

The Secret Vault stores owner-bound credentials encrypted at rest. A Secret has a key and optional description; its value is not returned by ordinary resource reads. Use the Vault for long-lived credentials used by Tasks or integrations, and use a Secret ID where a Native feature explicitly supports a Vault reference.

Vault Secrets may be referenced by Job ENV entries. The Job ENV entry must be marked secret and the caller must have the required `secrets:read` authority for the referenced Secret. Keep the raw value out of the Compose definition, source Repository, and logs.

## Job ENV

Job ENV entries provide named values to Task runs. An entry can apply to an owner generally or to a specific Repository. The entry may hold an encrypted value directly or reference a Vault Secret. Secret entries override plain entries. Within the same secrecy class, Repository-specific entries override owner-wide values for that Repository. Secret entries are withheld from pull-request-triggered runs; push, scheduled, and manual Task runs follow the configured entry rules.

The Native API rejects Job ENV keys beginning with `FIBE_`. Fibe captures the eligible values when a Task is admitted, so edits to an entry affect future Task runs rather than changing a run that has already captured its inputs. Use the current API contract for exact fields and permission scopes.

## ENV packs

ENV packs are reusable environment-variable maps stored in the Library. Their values are encrypted at rest and scoped to their owner. Attach a pack to a Spec or Playground where those values are needed; an attachment can limit which service names receive it. ENV packs are configuration maps, not a place to put a credential unless the intended consumers and access rules are appropriate.

Use a Job ENV entry for Task-specific or Repository-scoped values. Use an ENV pack when the same environment values should be attached to a Spec or Playground. Use a Vault Secret for an owner-bound credential that a supported feature can reference.

## Compose variables and external credentials

Compose variables configure a Spec and can be bound to YAML paths. Flags such as `secret: true` and `sensitive: true` describe handling in supported forms; they do not replace encrypted Vault storage. See [template variables](reference-template-variables.md) and [random values and secrets](recipe-random-and-secrets.md).

## Audit Logs

Use Audit Logs to review actions recorded by the installation. A Secret value is not ordinary audit metadata. Audit history is separate from an authorization grant or a live event stream.

## Related skills

- [fibe-feature-surface](fibe-feature-surface.md) for Native product areas.
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md) for resource changes.
- [decide-secrets-and-randoms](decide-secrets-and-randoms.md) for choosing storage.
- [recipe-random-and-secrets](recipe-random-and-secrets.md) for Compose variables.
