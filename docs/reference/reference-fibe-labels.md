---
title: "Fibe Labels"
description: "Use as the definitive reference for every supported `fibe.gg/*` Docker Compose label - exact value regexes, defaults, required-when rules, and what runtime/schema each enforces."
slug: /reference/reference-fibe-labels
sidebar_label: "Fibe Labels"
image: /img/og/reference-reference-fibe-labels.png
keywords: ["Fibe", "Reference", "reference", "fibe", "labels"]
tags: ["reference", "reference"]
format: md
---

The label prefix is `fibe.gg/` (the prefix can be changed in self-hosted installations, but `fibe.gg/` is what every public template uses). Unknown `fibe.gg/*` labels FAIL parsing. Non-`fibe.gg/` labels pass through to Docker.

## All 19 supported labels

| Label | Value | Default | Required when |
|---|---|---|---|
| `fibe.gg/repo_url` | HTTP(S) URL, full `ssh://` URL, SCP-style SSH URL, or `$$var__NAME` | — | service is dynamic/source-backed; plain HTTP warns |
| `fibe.gg/dockerfile` | Path relative to repo root | `Dockerfile` | non-default Dockerfile location |
| `fibe.gg/branch` | Git ref name | repo default branch | pin to non-default branch |
| `fibe.gg/start_command` | shell command string | image `CMD` | overriding runtime command |
| `fibe.gg/env_file` | path relative to repo root | `.env.example` | non-default env example |
| `fibe.gg/port` | port number (`1..65535`) or `$$var__NAME` | not exposed | service must serve HTTP to humans |
| `fibe.gg/visibility` | `external`, `internal`, or `$$var__NAME` | `external` | only valid when `fibe.gg/port` is also set |
| `fibe.gg/subdomain` | `@` (root), or `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$` | service name | non-default routing host |
| `fibe.gg/path_rule` | Traefik path matcher (`Path`, `PathPrefix`, `PathRegexp` only) | `/` | multiple services share one subdomain |
| `fibe.gg/production` | `true` / `false` (string or boolean) | unset | distinguish built-image vs mounted-source dev |
| `fibe.gg/zerodowntime` | `true` / `false` | unset (single instance, restart-style rollout) | want rolling updates |
| `fibe.gg/healthcheck_path` | HTTP path beginning with `/` | `/up` when zero-downtime generates a healthcheck | custom zero-downtime readiness path |
| `fibe.gg/healthcheck_interval` | duration `Nms` / `Ns` / `Nm` | `10s` when zero-downtime generates a healthcheck | custom zero-downtime timing |
| `fibe.gg/healthcheck_timeout` | duration | `5s` when zero-downtime generates a healthcheck | custom zero-downtime timing |
| `fibe.gg/healthcheck_retries` | positive integer (`[1-9][0-9]*`) | `3` when zero-downtime generates a healthcheck | custom zero-downtime timing |
| `fibe.gg/healthcheck_start_period` | duration | `30s` when zero-downtime generates a healthcheck | custom zero-downtime timing |
| `fibe.gg/build_target` | Dockerfile stage name | unset | multi-stage build |
| `fibe.gg/build_args` | comma-separated `KEY=value` pairs | unset | build needs `--build-arg` |
| `fibe.gg/job_watch` | `true` / `false` | `false` | watched-exit job-mode service |

Any of the above values may contain a `$$var__NAME` interpolation, but use inline syntax only for fragments. If the whole label value is launch-time variable driven, keep a concrete local placeholder and bind the variable through `x-fibe.gg.variables.<NAME>.path`. See [reference-template-variables](reference-template-variables.md).

Repository-backed services also require the standard service-level Compose
`working_dir` field with an absolute container path. It is not a Fibe label and
does not make a service dynamic by itself. Core uses it as the generated
non-production source-bind target; production keeps the field but receives no
generated bind.

## Value rules

### Booleans

Allowed: `true`, `false`, YAML booleans (in map form), empty string. NOT allowed: `yes`/`no`/`on`/`off`/`1`/`0`. Quoted strings are recommended for forward-compat with YAML 1.1 truthy parsing:

```yaml
labels:
  fibe.gg/production: "true"
  fibe.gg/zerodowntime: "false"
```

Only the literal value `true` (string or YAML boolean) is treated as true; anything else is read as false.

### `fibe.gg/port`

Schema allows the empty string, a numeric string/integer, or `$$var__NAME`. Runtime requires `1 ≤ PORT ≤ 65535`.

- `3000` — route traffic to container port 3000.
- Variable-driven port — keep a local placeholder such as `3000` and bind `x-fibe.gg.variables.PORT.path: services.web.labels.fibe.gg/port`.

### `fibe.gg/visibility`

Schema allows the empty string, `external`, `internal`, or `$$var__NAME`. Runtime defaults omitted visibility to `external`.

- `external` — public HTTPS route via Traefik.
- `internal` — same routing, but the route is protected with Basic Auth using the Playground's internal access credentials (a per-service password override is possible).

### `fibe.gg/subdomain`

Allowed values:
- `@` — bind the route at the root of the Marquee domain.
- lowercase alnum/hyphen, no leading/trailing hyphen: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$`.
- empty string — fall back to the default (service name).
- Variable-driven subdomain via `path`/`paths` binding.

Scalar values are coerced to strings before validation (`true`/`false`/integer become `"true"`/`"false"`/`"123"`), then validated by the slug regex.

Examples:

```yaml
services:
  api:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      # valid:
      fibe.gg/subdomain: api
      fibe.gg/subdomain: "@"
      fibe.gg/subdomain: ""   # fallback to service name
      # variable-driven values should use path-bound placeholders:
      fibe.gg/subdomain: demo
      # invalid in runtime validation:
      fibe.gg/subdomain: 42
      fibe.gg/subdomain: true
      fibe.gg/subdomain: "bad-subdomain-"
```

If omitted, the public host is `<service-name>.<marquee-root-domain>`.

### `fibe.gg/path_rule`

Allowed matchers in the value: `Path`, `PathPrefix`, `PathRegexp`. The value must contain at least one of these (`Path|PathPrefix|PathRegexp\s*\(` regex check).

**Forbidden** matchers — Fibe owns the host, you cannot override it: `Host`, `HostRegexp`, `HostSNI`, `HostSNIRegexp`, `Headers`, `HeadersRegexp`, `Method`, `Query`, `ClientIP`.

Multiple matchers can be combined with `&&` / `||`:

```yaml
fibe.gg/path_rule: Path(`/cable`) || Path(`/health`)
```

### `fibe.gg/healthcheck_interval` / `_timeout` / `_start_period`

Duration regex: `^[0-9]+(?:ms|s|m)$`. Examples: `500ms`, `10s`, `1m`. Bigger units (`h`, `d`) are not accepted.

### `fibe.gg/healthcheck_retries`

Positive integer (or its string form). `^[1-9][0-9]*$`.

### `fibe.gg/build_args`

Comma-separated `KEY=value` pairs. Whitespace tolerated:

```yaml
fibe.gg/build_args: "RAILS_ENV=production, NODE_VERSION=20"
```

Parsed into a key→value map.

### `fibe.gg/repo_url`

Core accepts HTTP(S) URLs, full `ssh://` URLs, and scp-style SSH URLs such as `git@host:owner/repo.git`. Equivalent transport spellings normalize to one repository identity. A credential-free `https://github.com/...` URL uses standalone Core's optional host-wide `GITHUB_TOKEN`; Enterprise instead resolves the Player's Prop/provider credentials. Explicit HTTP(S) URL credentials take precedence and are supported for generic Git access, but they remain in the authored template, rendered Compose, Git origin, and backups, so prefer the deployment's managed credential path. SSH uses the server's mounted SSH configuration and normal host-key verification. Inline `$$var__NAME` interpolation is allowed and bypasses validation until compile time.

## Two forms accepted

**Map form (preferred — easier to target with `path:` bindings):**

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: api
      traefik.enable: "true"   # non-fibe labels are pass-through
```

**Array form (legacy Compose):**

```yaml
services:
  worker:
    labels:
      - fibe.gg/job_watch=true
      - com.example.owner=team
```

In array form each item is `<name>=<value>`. The schema applies the same `fibeLabelString` regex per item.

## Cross-label semantics

These are enforced by the **runtime parser**, not the JSON Schema:

- Compose `build:` requires `fibe.gg/repo_url`.
- A service with `fibe.gg/repo_url` requires an absolute Compose `working_dir`; `working_dir` without the label is ordinary Compose.
- `fibe.gg/visibility` requires `fibe.gg/port` — setting visibility on a service without a port fails parsing. With a port and no visibility, the route defaults to `external`.
- `fibe.gg/zerodowntime: "true"` requires:
  - `fibe.gg/port` set,
  - service does **not** define `container_name`,
  - service does **not** define Compose `ports:` when `x-fibe.gg.metadata.preserve_ports: true` is set. Without that metadata opt-in, raw ports are stripped before launch.
- `fibe.gg/healthcheck_*` labels are optional zero-downtime overrides. When they are omitted, Fibe generates rollout healthcheck settings from defaults.
- An unknown `fibe.gg/*` key is a hard error: `Service '<name>': unknown label '<key>'`.

## Inline variable interpolation

Any of the labels above may contain `$$var__NAME` inline. The schema's `templatedFibeLabelString` pattern accepts it, but inline label variables should be a last resort for fragments. Whole-label variable values should use `path`/`paths`:

```yaml
services:
  web:
    labels:
      fibe.gg/port: "3000"
      fibe.gg/visibility: external
      fibe.gg/subdomain: demo
x-fibe.gg:
  variables:
    PORT:
      name: Port
      default: "3000"
      path: services.web.labels.fibe.gg/port
    SUBDOMAIN:
      name: Subdomain
      default: demo
      path: services.web.labels.fibe.gg/subdomain
```

Inline remains appropriate for fragments, for example `fibe.gg/path_rule: PathPrefix(\`/$$var__PATH_PREFIX\`)`. The variable must be declared in `x-fibe.gg.variables`. See [recipe-inline-variables](recipe-inline-variables.md).

## Defaults applied at runtime

If unset, the runtime fills:

- `fibe.gg/dockerfile` → `Dockerfile`
- `fibe.gg/env_file` → `.env.example`
- `fibe.gg/branch` → repo default branch

`working_dir` is deliberately absent from that list. It has no default:
omitting it creates no generated bind. Repository-backed builds still use the
Core source checkout as their build context.

## Source defaults (auto-fill for source-backed templates)

When a template imports from a source Prop and `x-fibe.gg.metadata.source_defaults: true`, the runtime fills:

- `fibe.gg/repo_url` on services that have `build:`, an explicit `working_dir`, or already declare repository/branch metadata — with the source Prop's URL. Outside an explicitly tracked `source_defaults` template, `working_dir` remains ordinary Compose.
- `fibe.gg/branch` similarly with the source ref.
- `trigger_config.repo_url` / `branch` if the template is `job_mode: true` and a `trigger_config` exists.

See [recipe-source-mount](recipe-source-mount.md) for source-mount specifics and [mode-trigger-vcs](mode-trigger-vcs.md) for trigger defaults.

## Related skills

[recipe-ports-to-expose](recipe-ports-to-expose.md), [recipe-add-subdomain](recipe-add-subdomain.md), [recipe-add-path-rule](recipe-add-path-rule.md), [recipe-zero-downtime-healthcheck](recipe-zero-downtime-healthcheck.md), [recipe-build-to-repo-url](recipe-build-to-repo-url.md), [recipe-build-args-and-target](recipe-build-args-and-target.md), [recipe-strip-incompatible-keys](recipe-strip-incompatible-keys.md), [reference-template-variables](reference-template-variables.md), [reference-validation-pipeline](reference-validation-pipeline.md).
