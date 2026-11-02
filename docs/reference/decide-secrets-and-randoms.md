---
title: "Secrets And Randoms"
description: "Decide when a Native Fibe Compose Spec should use a variable, generated value, Secret Vault entry, ENV pack, or Job ENV entry."
slug: /reference/decide-secrets-and-randoms
sidebar_label: "Secrets And Randoms"
image: /img/og/reference-decide-secrets-and-randoms.png
keywords: ["Fibe", "Decision", "decide", "secrets", "and", "randoms"]
tags: ["reference", "decision"]
format: md
---

Use this guide when a Compose definition needs a value that varies between Specs or contains sensitive information.

## Decision table

| Need | Use | Why |
| --- | --- | --- |
| Non-sensitive setting chosen for one Spec | A declared Fibe variable with a `path` or `paths` binding | Makes the configuration explicit and keeps the Compose document reusable. |
| One-time value generated during Compose compilation | A Fibe variable with `random: true` | The compiler can generate a 32-character hexadecimal value when no value was supplied. To keep a value stable across future compiles, store and pass the chosen value with the Spec; `random: true` alone does not make the compiler retain it. |
| Long-lived owner-bound credential | A Secret Vault entry | Values are encrypted at rest and ordinary reads expose metadata rather than plaintext. |
| Credential supplied to a Task, optionally for one Repository | A Job ENV entry, optionally referencing a Vault Secret | Task runs receive eligible values captured at admission; Repository-specific entries can override owner-wide entries. |
| Reusable non-secret environment map for a Spec or Playground | An ENV pack attached to that resource | Packs live in the Library and can be attached to Specs or Playgrounds. |

Flags such as `secret: true` and `sensitive: true` affect supported configuration forms. They do not encrypt a literal in a Compose document or replace Vault storage.

## Generated password for a new database

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: "$$var__DB_PASSWORD"

x-fibe.gg:
  variables:
    DB_PASSWORD:
      name: Database password
      random: true
      secret: true
      path: services.db.environment.POSTGRES_PASSWORD
```

The Compose compiler generates a value if one was not supplied. It uses one generated value for that variable's references within a single compile pass. Save and pass the selected value with the Spec if a later compile must use the same password; changing a database password without updating the database and its clients can make the stored data inaccessible.

## Vault credential used by a Task

Create an owner-bound Secret in the Secret Vault, then create a secret Job ENV entry that references its Secret ID. Scope the entry to a Repository when only that Repository's Tasks should receive it. Native Task admission captures eligible values for the run. Secret entries are withheld from pull-request-triggered Tasks.

The API rejects Job ENV names beginning with `FIBE_`. Use the generated [OpenAPI contract](/native/openapi.json) for the current request fields and scopes.

## ENV pack for reusable application settings

Create an ENV pack in the Library for non-secret values that should be reused. Attach it to the Spec or Playground and select the service names that need those values. Keep credentials in the Secret Vault or Job ENV instead of including them in a broadly attached pack.

## Compose secrets

Compose also defines a `secrets:` mechanism for mounting files into containers. Use it when the application expects a secret file and the Native runtime configuration supplies that secret. This is distinct from the Secret Vault resource.

## Avoid

- Putting provider API keys or passwords in image names, labels, URLs, defaults, or checked-in `.env` files.
- Treating a display hint as encryption or access control.
- Reusing one generated database password across unrelated Specs when each needs a separate credential.
- Exposing a database or other private service to make its credentials easier to pass.

## Related skills

- [recipe-random-and-secrets](recipe-random-and-secrets.md) for detailed examples.
- [reference-template-variables](reference-template-variables.md) for declarations and bindings.
- [fibe-security-access-and-integrations](fibe-security-access-and-integrations.md) for Secret Vault and Job ENV.
