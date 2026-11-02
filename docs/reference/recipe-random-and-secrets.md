---
title: "Random And Secrets"
description: "Use to generate random values during Compose compilation, bind Vault Secrets into Tasks with Job ENV, and handle credentials safely."
slug: /reference/recipe-random-and-secrets
sidebar_label: "Random And Secrets"
image: /img/og/reference-recipe-random-and-secrets.png
keywords: ["Fibe", "Recipe", "recipe", "random", "and", "secrets"]
tags: ["reference", "recipe"]
format: md
---

Fibe variables can declare `random: true` to generate a value during Compose compilation. Spec workflows generate missing values once and store them encrypted with the Spec, then reuse them on later compiles and template-version switches. A direct lower-level compiler call does not retain the generated value across calls, so supply it yourself when using that path.

## `random: true` semantics

When a variable has `random: true`:

1. Saved Spec imports, launches and template-version switches reuse a supplied or stored value. If the random variable is absent, null or an empty string, they generate 32 lowercase hexadecimal characters before the compiler considers its declared `default`, then store the generated value encrypted with the Spec.
2. A direct lower-level compiler call tries the supplied value, then a non-empty `default`, then random generation. It does not retain a generated value for another call.
3. The same variable's inline references and `path`/`paths` bindings receive one resolved value within that compile pass.
4. Combined with `required: true`, random generation runs **before** the required check, so compilation has a value to validate. Supply the selected value again when using direct compiler calls that must remain stable.

```yaml
DB_PASSWORD:
  name: "Database password"
  required: true
  random: true
  path: services.db.environment.POSTGRES_PASSWORD
```

## Sharing one random across multiple services

```yaml
x-fibe.gg:
  variables:
    PGPASSWORD:
      name: "Postgres password"
      required: true
      random: true
      paths:
        - services.postgres.environment.POSTGRES_PASSWORD
        - services.pgbouncer.environment.DB_PASSWORD
        - services.setup.environment.DB_PASSWORD
        - services.web.environment.DB_PASSWORD
        - services.jobs.environment.DB_PASSWORD
```

Same hex value lands in every listed path. Use this pattern whenever one generated secret must be shared by multiple services.

## Inline random

Same variable can be referenced inline anywhere:

```yaml
services:
  app:
    environment:
      DATABASE_URL: "postgres://postgres:$$var__PGPASSWORD@pgbouncer:5432/app"

x-fibe.gg:
  variables:
    PGPASSWORD:
      name: "Postgres password"
      required: true
      random: true
      paths:
        - services.postgres.environment.POSTGRES_PASSWORD
        - services.pgbouncer.environment.DB_PASSWORD
```

The inline reference and the `paths:` writes all receive the same 32-hex value within one compile pass.

## Display hints

Some configuration forms interpret these optional flags:

- `secret: true`: request that the form mask the value.
- `sensitive: true`: mark the value as sensitive for supported handling.

These are metadata hints, not encryption or access control. Never commit a credential to the Compose document just because the variable is marked secret.

Example:

```yaml
slack_webhook_url:
  name: "Slack Incoming Webhook URL"
  required: false
  secret: true
  sensitive: true
  default: ""
  paths:
    - services.slack-notify-awaken.environment.SLACK_WEBHOOK_URL
    - services.slack-notify-coming.environment.SLACK_WEBHOOK_URL
    - services.slack-notify.environment.SLACK_WEBHOOK_URL
```

The default empty string + `required: false` + `secret: true` makes this an optional masked configuration value.

## Random value, Secret Vault, ENV pack, and Job ENV

| Need | Native Fibe feature |
|---|---|
| New generated configuration value | `random: true` variable; saved Spec workflows retain it, while direct compiler calls require the selected value again |
| Long-lived owner-bound credential | Secret Vault; encrypted at rest and returned as metadata in ordinary reads |
| Credential for Task runs | Job ENV entry, optionally referring to a Vault Secret; Secret entries override plain entries; within that class, Repository-specific entries override owner-wide entries |
| Reusable non-secret environment map for a Spec or Playground | ENV pack attached from the Library |

Secret Job ENV entries are withheld from pull-request-triggered Task runs. The Native API rejects Job ENV keys beginning with `FIBE_`.

## Rotating a random value

To rotate a password, choose and save a replacement value in the Spec, then coordinate the change with the database and every service that connects to it. Changing a database password without updating both sides may make the stored data inaccessible.

## When NOT to use `random: true`

- **Already-shared values**: if a Postgres password is also needed elsewhere, store it in the Secret Vault and use an explicit supported reference for each consumer.
- **Truly sensitive long-lived credentials**: store them in the Secret Vault, then supply them through a supported Secret Vault reference or Job ENV entry.
- **Values the user wants to choose**: declare a regular variable and bind it with `path` or `paths`; do not expect `random: true` to create a user-chosen value.

## Patterns for common secrets

### Database password

```yaml
DB_PASSWORD:
  name: "Database password"
  required: true
  random: true
  secret: true
  sensitive: true
  paths:
    - services.db.environment.POSTGRES_PASSWORD
    - services.app.environment.DATABASE_PASSWORD
```

### Framework/application master key (long-lived, should not be generated)

```yaml
RAILS_MASTER_KEY:
  name: "Application master key"
  required: true
  secret: true
  sensitive: true
  paths:
    - services.setup.environment.RAILS_MASTER_KEY
    - services.web.environment.RAILS_MASTER_KEY
    - services.jobs.environment.RAILS_MASTER_KEY
```

(No `random: true`: this must match the value the application already uses to decrypt credentials. Supply it through the installation's supported configuration mechanism.)

### Webhook URL (optional, sensitive, no default)

```yaml
SLACK_WEBHOOK_URL:
  name: "Slack webhook URL"
  required: false
  secret: true
  sensitive: true
  default: ""
  paths:
    - services.notify.environment.SLACK_WEBHOOK_URL
```

### Generated signing secret used by app only

```yaml
JWT_SECRET:
  name: "JWT signing secret"
  required: true
  random: true
  secret: true
  paths:
    - services.web.environment.JWT_SECRET
    - services.worker.environment.JWT_SECRET
```

## Pitfalls

- **Regenerating a stored random value during a template switch**: the switch operation can explicitly regenerate selected random variables. Do that only when the dependent application data is ready for the credential change; otherwise retain the stored value.
- **Using `random` for values the app can't accept**: e.g. an app expects a 64-char Base64 secret, but `random` gives 32 hex chars. Either change the app's spec to accept hex, or supply manually.
- **Treating `secret: true` as encryption**: it is a display hint, not at-rest encryption. Use the Secret Vault for owner-bound credentials.
- **Not listing the variable in `paths:`**: if you only use `$$var__NAME` inline AND don't declare `paths:`, the variable is "used" by inline reference; that's fine. But if you list NO inline use AND no path, it's `unused_var`.

## Related skills

[decide-secrets-and-randoms](decide-secrets-and-randoms.md), [recipe-extract-env-variables](recipe-extract-env-variables.md), [recipe-whole-node-paths](recipe-whole-node-paths.md), [recipe-inline-variables](recipe-inline-variables.md), [reference-template-variables](reference-template-variables.md).
