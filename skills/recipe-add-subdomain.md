---
name: recipe-add-subdomain
description: Use to set the public hostname leftmost label via `fibe.gg/subdomain` - including the root `@`, defaults, allowed character set, and variable interpolation.
---

# Recipe: `fibe.gg/subdomain`

The public URL of an exposed service is `https://<subdomain>.<marquee-root-domain>`. The Marquee owns its `root_domain` (e.g. `next.fibe.live`); the template owns the subdomain via `fibe.gg/subdomain`.

## Allowed values

| Value | Effect | Notes |
|---|---|---|
| omitted | Default — uses **service name** as subdomain | Service `web` → `web.<root>` |
| `<name>` | Use `<name>` as subdomain | Lowercase alnum + hyphens, no leading/trailing hyphen |
| `@` | Bind the route at the **root** of the Marquee | `<root>` |
| empty string | Treated as default | Same as omitting |
| variable-driven | Bind with `x-fibe.gg.variables.<NAME>.path` | Keeps a local placeholder and resolves at launch |
| integer | Numeric string | E.g. `1234` |

Regex (schema): `^(?:|@|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$`. Single-character labels `a` through `z` and `0` through `9` are allowed.

## Examples

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      # no subdomain → web.<root>

  api:
    labels:
      fibe.gg/port: 8080
      fibe.gg/visibility: external
      fibe.gg/subdomain: api               # api.<root>

  docs:
    labels:
      fibe.gg/port: 80
      fibe.gg/visibility: external
      fibe.gg/subdomain: documentation     # documentation.<root>

  front_door:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: "@"               # the root itself
```

## Variable-driven

Parameterize the subdomain at launch:

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: demo

x-fibe.gg:
  variables:
    SUBDOMAIN:
      name: "Subdomain"
      required: true
      default: "demo"
      validation: "/^[a-z0-9][a-z0-9-]*[a-z0-9]$/"
      path: services.web.labels.fibe.gg/subdomain
```

Inline `$$var__SUBDOMAIN` is accepted by the schema, but do not use it for the whole subdomain label in new templates. Whole-label values should use `path: services.web.labels.fibe.gg/subdomain` so the same Compose file still has a concrete local value. See [recipe-whole-node-paths](recipe-whole-node-paths.md).

## When to use `@`

Use `@` for the **front door** — the service users hit by typing the Marquee root domain itself (no subdomain prefix). A given Marquee can only have one service at `@` (for a given path rule).

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: "@"
```

Useful when:
- The template is THE app on this Marquee.
- You want a clean public URL (`https://my-app.example.com` instead of `https://web.my-app.example.com`).

Note the quotes around `@` to keep YAML from interpreting it as a YAML directive marker.

## Sharing a subdomain with `path_rule`

Two services can share one subdomain by routing on path. The "catch-all" service should omit `fibe.gg/path_rule`; the "specific" service should set `fibe.gg/path_rule`. See [recipe-add-path-rule](recipe-add-path-rule.md).

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: demo
      # catch-all — no path_rule

  ws:
    labels:
      fibe.gg/port: 8081
      fibe.gg/visibility: external
      fibe.gg/subdomain: demo
      fibe.gg/path_rule: Path(`/cable`) || Path(`/health`)
x-fibe.gg:
  variables:
    SUBDOMAIN:
      name: Subdomain
      default: demo
      paths:
        - services.web.labels.fibe.gg/subdomain
        - services.ws.labels.fibe.gg/subdomain
```

Same subdomain, different paths.

## How the URL is generated (Traefik)

For an exposed service:

1. Fibe sets `traefik.enable=true` and Traefik joins `{COMPOSE_PROJECT_NAME}_default` network automatically
2. HTTP router `web` entrypoint matches `Host(`<subdomain>.<root>`)`.
3. HTTPS router `websecure` matches the same Host with ACME TLS.
4. Internal services additionally get a Basic Auth prompt using the Playground's internal-access credentials (shown in the Playground's details).
5. Optional `fibe.gg/path_rule` ANDs into the matcher.

See [reference-fibe-labels](reference-fibe-labels.md) for the schema rules.

## Pitfalls

- **Uppercase subdomain** — `MyApp` fails the regex. Use lowercase.
- **Leading/trailing hyphen** — `-staging` or `staging-` fails. Use `staging`.
- **Underscore** — not allowed in DNS labels. Use hyphens.
- **Subdomain longer than DNS label limit** — DNS labels should stay within 63 characters. Fibe's current template validation does not flag this length for you, so keep it short yourself.
- **Same subdomain on multiple services without `path_rule`** — Traefik routes only one (first match). Add `path_rule` to disambiguate.
- **`@` without quoting** — YAML may misparse. Always quote: `fibe.gg/subdomain: "@"`.

## Related skills

[recipe-add-path-rule](recipe-add-path-rule.md), [decide-exposure-strategy](decide-exposure-strategy.md), [recipe-inline-variables](recipe-inline-variables.md), [recipe-whole-node-paths](recipe-whole-node-paths.md), [reference-fibe-labels](reference-fibe-labels.md).
