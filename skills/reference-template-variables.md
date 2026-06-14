---
name: reference-template-variables
description: Use as the definitive reference for Fibe template variable mechanics - declaration shape, `path`/`paths` whole-node binding, last-resort `$$var__NAME` / `$$root_domain` interpolation, validation regex, literal defaults, and random secret generation.
---

# Reference: Template variables

Fibe templates ship parameterizable. The two participating pieces:

1. **Declaration** under `x-fibe.gg.variables.<NAME>`.
2. **Reference** through `path:`/`paths:` whole-node binding, or as a last-resort `$$var__NAME` inline fragment.

Fibe substitutes references with launch-time values; missing required variables fail compilation.

## Declaration shape

```yaml
x-fibe.gg:
  variables:
    APP_NAME:
      name: "App name"
      required: true
      random: false
      default: "demo"
      validation: "/^[a-z0-9-]+$/"
	      path: services.web.environment.APP_NAME
	      paths:
	        - services.web.labels.fibe.gg/subdomain
	        - services.worker.environment.APP_NAME
```

For whole-node paths into dotted label keys such as `services.web.labels.fibe.gg/subdomain`, keep a concrete placeholder label value in the Compose file for local parity. Runtime validation rejects paths aimed at missing `services.<name>` roots, while missing leaves under existing services can be created.

Variable name regex: `^[A-Za-z0-9_]+$`. Reuse the same name for `$$var__` interpolation everywhere it appears.

Field semantics:

| Field | Compile-time effect |
|---|---|
| `name` | If null/empty: validation error `missing_name`. |
| `required: true` | If no user value AND no default AND no random: compile fails with `Variable '<key>' is required`. |
| `random: true` | If no user value is supplied at compile time: generated as a stable 32-character hex value. |
| `default: <value>` | Used when no user value. Must be a literal; `$$var__*`, `$$random__*`, and `$$root_domain` are invalid inside defaults. |
| `validation: "/regex/"` | Pattern must be wrapped in `/.../`. Empty string is allowed (no validation). Compile fails with `fails validation pattern` if value doesn't match. |
| `path` / `paths` | Whole-node replacement after string substitution. See [reference-yaml-paths](reference-yaml-paths.md). |

## Two ways variables are written into the document

### 1. Inline `$$var__NAME`

Pattern: `$$var__([A-Za-z0-9_]+)`. Substituted as plain text before any YAML reparsing. Use it only for fragments inside larger strings. Always write `$$var__NAME`. `$$random__NAME` is only recognized by the declared/unused validation for older templates — it is NOT substituted at compile time, so never author it; the literal text would remain in the compiled file.

```yaml
services:
  web:
    image: ghcr.io/acme/app:$$var__TAG
    environment:
      DATABASE_URL: "postgres://user:$$var__DB_PASSWORD@db:5432/app"
    labels:
      fibe.gg/visibility: external
      fibe.gg/path_rule: PathPrefix(`/$$var__PATH_PREFIX`)
```

Behavior:
- Missing user value AND missing default AND missing random → string substitution falls back to the literal `placeholder` (compiler still flags `is required` if `required: true`).
- Multiple references to the same variable receive the same value. For `random: true`, the same 32-hex value is used everywhere in one compile pass.

### 2. Whole-node `path:` / `paths:`

Replaces an entire YAML node (string, number, boolean) at the named dotted path **after** inline substitution. This is the primary Fibe variable mechanism. Use it for label values, public URLs, replica counts, environment scalars, booleans, integers, and any whole-node replacement.

```yaml
x-fibe.gg:
  variables:
    REPLICAS:
      name: "Web replicas"
      default: 2
      path: services.web.deploy.replicas
    DEBUG:
      name: "Debug mode"
      default: false
      paths:
        - services.web.environment.DEBUG
        - services.worker.environment.DEBUG
    SUBDOMAIN:
      name: "Subdomain"
      default: app
      path: services.web.labels.fibe.gg/subdomain
```

Resulting compiled YAML has `services.web.deploy.replicas: 2` and `services.web.environment.DEBUG: false` (typed as integer/bool, not string, when the source value matches `^[0-9]+$` or `^(?i)(true|false)$`).

Inline vs path: see [recipe-inline-variables](recipe-inline-variables.md) and [recipe-whole-node-paths](recipe-whole-node-paths.md).

## Which form to choose

Use this as a quick map during conversion:

| Variable usage pattern | Best form | Example |
|---|---|---|
| Full scalar value (env var, label value, replica count, path destination) | `path:` / `paths:` | `fibe.gg/port` via `paths: services.web.labels.fibe.gg/port` |
| Part of a larger value (tag, combined command string, prefix/suffix) | `$$var__NAME` inline | `image: registry/app:$$var__TAG` |
| Existing `${VAR}` from input compose and launcher should control the whole node | Keep a local placeholder and add `path:` / `paths:` | `RAILS_ENV: development` + `path: services.web.environment.RAILS_ENV` |
| Mixed fragments in the same logical token | Inline | `PathPrefix('/$$var__PATH_PREFIX')` |

## `$$var__` behavior matrix

| Declaration | Binding style | Compile-time value | What lands in compiled template |
|---|---|---|---|
| `default: "1.2.3"` only | inline | user value -> default -> random -> placeholder | `$$var__` placeholder replaced with `1.2.3` |
| `required: true` + `default` | inline | required check passes when default exists | default always used when launcher omits value |
| `required: true` only | inline | compile error if launcher doesn't provide value | compile fails |
| `random: true` only | inline | generated 32-char hex on each compile call unless persisted | same hex reused if stored |
| No `default`, no `random`, no launcher value | inline | fallback literal `placeholder` | raw `placeholder` appears in output |
| No `default`, no `random`, no launcher value | `path:` / `paths:` | fallback empty string | YAML empty scalar at every bound path |

## Example matrix

```yaml
x-fibe.gg:
  variables:
    TAG:
      name: Image tag
      required: true
      default: latest
    SUBDOMAIN:
      name: Subdomain
      required: true
      random: true
      path: services.web.labels.fibe.gg/subdomain
    PATH_PREFIX:
      name: URL path prefix
      default: ""
    APP_PORT:
      name: App port
      default: "3000"
      path: services.web.labels.fibe.gg/port
    PUBLIC_URL:
      name: Public URL
      default: https://app.example.com
      path: services.web.environment.PUBLIC_URL
    REPLICAS:
      name: Web replicas
      required: false
      default: "4"

services:
  web:
    image: ghcr.io/acme/app:$$var__TAG
    environment:
      PUBLIC_URL: https://app.example.com
      APP_PORT: "3000"
    deploy:
      replicas: 1
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: app
      fibe.gg/path_rule: PathPrefix(`/$$var__PATH_PREFIX`)
```

```yaml
x-fibe.gg:
  variables:
    TAG:
      name: Image tag
      required: true
      default: latest
    PATH_PREFIX:
      name: URL path prefix
      required: false
      path: services.web.environment.PATH_PREFIX
    REPLICAS:
      name: Web replicas
      default: "4"
      path: services.web.deploy.replicas

services:
  web:
    image: ghcr.io/acme/app:$$var__TAG
    environment:
      PATH_PREFIX: placeholder
    deploy:
      replicas: 2
    labels:
      fibe.gg/path_rule: PathPrefix(`/$$var__PATH_PREFIX`)   # inline path fragment
```

In this variant, `PATH_PREFIX` is path-bound, so it is written by the `path:` pass after inline substitution.  
Using both inline + path for the same variable is valid, but path writes are the final value at their destination node.

## `$$root_domain`

Special, **not** declared in `variables`. Always replaced at compile time with the launching Marquee's `root_domain` (e.g. `next.fibe.live`). Use it only as an inline fragment where a fully-qualified public host cannot be represented with explicit `path`/`paths` variables. Prefer explicit public URL variables with literal defaults for app ENV:

```yaml
x-fibe.gg:
  variables:
    PUBLIC_URL:
      name: Public URL
      default: https://app.example.com
      path: services.web.environment.PUBLIC_URL
```

## Random values

`random: true` declares a generated value. Behavior:

- Compile-time fresh value if no user value is supplied: 32 lowercase hex characters.
- Once persisted for the launch, the value is reused on subsequent compiles unless template-author tooling explicitly regenerates it.
- For values with `random: true` AND `required: true`, the random generation runs **before** the required check, so missing inputs do not error.
- `secret: true` / `sensitive: true` are launcher UI hints; use Fibe Secrets for long-lived credential storage.

```yaml
x-fibe.gg:
  variables:
    DB_PASSWORD:
      name: "Database password"
      required: true
      random: true
      path: services.db.environment.POSTGRES_PASSWORD
    JWT_SECRET:
      name: "JWT signing secret"
      random: true
      paths:
        - services.web.environment.JWT_SECRET
        - services.worker.environment.JWT_SECRET
```

## Validation regex

Pattern wrapper is enforced: `validation:` must be empty string OR begin and end with `/`.

Examples:

```yaml
validation: ""                                # no validation
validation: "/^[a-z][a-z0-9-]*$/"             # slug-like
validation: "/^[0-9]+$/"                      # integer-as-string
validation: "/^[A-Za-z0-9_.-]+$/"             # image tag
validation: "/^(?=.*\\d).{10,}$/"             # 10+ chars with a digit
```

Validation runs **after** default/random resolution. An empty/blank value skips validation.

## Default literals only

Defaults are not recursively expanded. Do not write `default: "api-$$var__SUBDOMAIN"` or `default: "https://$$root_domain"`. Validation rejects `$$var__*`, `$$random__*`, and `$$root_domain` inside defaults. Use separate explicit variables with `path`/`paths` for derived public URLs or related label/env values, even when that creates duplicate-looking launch inputs.

## Unused-variable rule

A declared variable is "unused" if:
- It is never referenced via `$$var__NAME` or `$$random__NAME` AND
- It has no `path` / `paths` binding.

Runtime emits `unused_var` for these. So either reference inline, bind via path, or remove.

## Undeclared-reference rule

Any `$$var__NAME` / `$$random__NAME` occurrence whose `NAME` does not appear in `x-fibe.gg.variables` is `undeclared_var`.

## Defaulting and override order

For each declared variable, Fibe picks the value in this order:

1. User-supplied value from launch input or stored launch values.
2. `default` field (if non-empty).
3. `random: true` generated value.
4. (If none and `required: true`) → compile error.
5. Otherwise empty string for path binding; literal `placeholder` for inline substitution.

## `hostname:` is not stable template behavior

Do not rely on Compose `hostname:` in Fibe templates. Use Compose service-name DNS for service-to-service traffic and Fibe routing labels for user-facing URLs.

## Related skills

[reference-x-fibe-gg-namespace](reference-x-fibe-gg-namespace.md), [reference-yaml-paths](reference-yaml-paths.md), [recipe-inline-variables](recipe-inline-variables.md), [recipe-whole-node-paths](recipe-whole-node-paths.md), [recipe-extract-env-variables](recipe-extract-env-variables.md), [recipe-random-and-secrets](recipe-random-and-secrets.md), [decide-secrets-and-randoms](decide-secrets-and-randoms.md).
