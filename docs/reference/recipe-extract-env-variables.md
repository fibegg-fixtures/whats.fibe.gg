---
title: "Extract Env Variables"
description: "Use to lift `${VAR}` / `${VAR:-default}` Compose interpolations into `x-fibe.gg.variables` so the launcher can configure them, with optional defaults, validation, and path bindings."
slug: /reference/recipe-extract-env-variables
sidebar_label: "Extract Env Variables"
image: /img/og/reference-recipe-extract-env-variables.png
keywords: ["Fibe", "Recipe", "recipe", "extract", "env", "variables"]
tags: ["reference", "recipe"]
format: md
---

Compose supports environment-variable interpolation: `${VAR}`, `${VAR:-default}`, `${VAR:?error}`. On a developer laptop, these come from a local `.env` file. On Fibe, launch-time variables replace them — but through template compilation (`$$var__` markers or `path:` bindings), not through Compose's env interpolation.

The conversion is mostly mechanical: for every `${VAR...}` in the input compose, declare a corresponding entry in `x-fibe.gg.variables`. Prefer keeping a concrete local placeholder and adding a `path:`/`paths:` binding so the launch value overwrites that whole node at compile time. Rewrite to `$$var__VAR` only when the value is a fragment inside a larger string.

## Two forms

| Style | Where the substitution happens | When to use |
|---|---|---|
| `${VAR:-default}` | Docker Compose engine at start — launch variables are NOT in that environment | Only for local `docker compose up` compatibility, and only together with a `path:`/`paths:` binding |
| `$$var__VAR` | Fibe template compiler before Compose sees it | Fragment-only last resort; integrates with `x-fibe.gg` validation but breaks local Compose parity when used as the whole value |

Launch variables are NOT passed to Compose's `${VAR}` interpolation. On Fibe, `${VAR:-default}` resolves to the literal default (or empty) at deploy. If you keep `${VAR}` placeholders so the same file also runs cleanly with plain `docker compose up`, you must also add a `path:`/`paths:` binding so the launch value overwrites that node at compile time.

## Mapping table

| Compose | Fibe variable declaration | Inline only when it is a fragment |
|---|---|---|
| `${PORT}` | `PORT: { name: Port, required: true }` | `$$var__PORT` |
| `${PORT:-3000}` | `PORT: { name: Port, default: "3000" }` | `$$var__PORT` |
| `${PORT:?required}` | `PORT: { name: Port, required: true }` | `$$var__PORT` |
| `${RAILS_ENV:-development}` in multiple services | declare once with `paths:` array | OR `$$var__RAILS_ENV` everywhere |

## Step-by-step

1. **Grep the input compose** for `\$\{[A-Z_][A-Z_0-9]*[-:?]?[^}]*\}`. List every variable name.
2. For each variable, decide:
   - **Should the launcher set this?** (Yes for app config, secrets, hostnames. No for static infrastructure like fixed POOL_MODE.)
   - **Is there a sensible default?**
   - **Is it sensitive?**
3. For each "yes", add an entry to `x-fibe.gg.variables`.
4. Choose binding style:
   - If the value is the whole node (an env var, a label value, a replica count, a public URL) → use `path:` / `paths:` (primary route).
   - If the value is part of a larger string (image tag, connection string, path-rule fragment) → use inline `$$var__NAME`.
5. Keep / rewrite the original occurrences according to style chosen.

## Whole-node `path` binding (preferred)

```yaml
# BEFORE
services:
  web:
    environment:
      RAILS_ENV: ${RAILS_ENV:-development}
      DB_PASSWORD: ${DB_PASSWORD}

# AFTER
services:
  web:
    environment:
      RAILS_ENV: development         # placeholder; overridden by path binding
      DB_PASSWORD: ""                # placeholder

x-fibe.gg:
  variables:
    RAILS_ENV:
      name: "Rails environment"
      required: true
      default: "development"
      paths:
        - services.web.environment.RAILS_ENV
    DB_PASSWORD:
      name: "Database password"
      required: true
      random: true
      paths:
        - services.web.environment.DB_PASSWORD
        - services.db.environment.POSTGRES_PASSWORD
```

The "placeholder" values in `environment:` will be replaced by the path binding before final compose generation.

## Inline `$$var__` binding

```yaml
# BEFORE
services:
  web:
    image: ghcr.io/owner/app:${TAG:-latest}
    environment:
      DATABASE_URL: postgres://user:${DB_PASSWORD}@db:5432/app

# AFTER
services:
  web:
    image: ghcr.io/owner/app:$$var__TAG
    environment:
      DATABASE_URL: postgres://user:$$var__DB_PASSWORD@db:5432/app

x-fibe.gg:
  variables:
    TAG:
      name: "Image tag"
      default: "latest"
      validation: "/^[A-Za-z0-9_.-]+$/"
    DB_PASSWORD:
      name: "Database password"
      required: true
      random: true
```

Inline is required here because `DATABASE_URL` is built from multiple parts, and `image:` has the tag embedded in a colon-separated value. For whole values, use `path`/`paths` even when it requires duplicate variables for slightly different labels and env nodes.

## Mixed style

Inside one variable declaration you can have BOTH inline references AND `path:` — the compiler runs inline substitution first, then path writes. Be careful: the path write happens to a node that may already have been substituted, so it overwrites. Pick one style per variable usage to avoid confusion.

## Required + default + random — common combinations

```yaml
# Required, must be supplied by launcher
APP_NAME:
  name: "App name"
  required: true

# Required, has a default — never blocks launch
APP_NAME:
  name: "App name"
  required: true
  default: "demo"

# Optional, supplied or empty
APP_NAME:
  name: "App name"

# Required-but-generated (random secret)
DB_PASSWORD:
  name: "DB password"
  required: true
  random: true
  path: services.db.environment.POSTGRES_PASSWORD
```

See [recipe-random-and-secrets](recipe-random-and-secrets.md).

## Validation regex

Constrain user input to avoid runtime failures:

```yaml
SUBDOMAIN:
  name: "Subdomain"
  required: true
  default: "demo"
  validation: "/^[a-z0-9][a-z0-9-]*[a-z0-9]$/"

PORT:
  name: "Port"
  default: "3000"
  validation: "/^[0-9]+$/"

EMAIL:
  name: "Admin email"
  required: true
  validation: "/^[^@]+@[^@]+\\.[a-z]{2,}$/"
```

## Variables you should NOT extract

- Static infrastructure values that don't change across launches (`POOL_MODE: transaction`, `POSTGRES_HOST_AUTH_METHOD: trust`).
- Internal service hostnames inside the Compose network (`db`, `redis`, `pgbouncer`) — these are fixed by Compose service names.
- Constants the app needs (`RAILS_LOG_TO_STDOUT: "1"`).

Just hardcode these.

## Pitfalls

- **Forgetting to declare** — `$$var__X` without `x-fibe.gg.variables.X` → `undeclared_var` error.
- **Declaring but never using** — declared without `path`/`paths` and never referenced inline → `unused_var`.
- **Variable name mismatched between inline and `paths`** — they don't auto-link by spelling, but they MUST resolve through the same declared key.
- **Compose-style default `${VAR:-default}`** + Fibe variable declared with a different default → confusion. Pick one source.
- **Nested Fibe defaults** — `default: "$$var__OTHER.$$root_domain"` is invalid. Defaults are literals; use explicit path-bound variables for derived public values.

## Related skills

[recipe-inline-variables](recipe-inline-variables.md), [recipe-whole-node-paths](recipe-whole-node-paths.md), [recipe-random-and-secrets](recipe-random-and-secrets.md), [decide-secrets-and-randoms](decide-secrets-and-randoms.md), [reference-template-variables](reference-template-variables.md), [reference-yaml-paths](reference-yaml-paths.md).
