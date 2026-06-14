---
title: "Exposure Strategy"
description: "Use to decide how a service should be reachable - external public HTTPS via subdomain, internal Basic-Auth-protected HTTPS, sharing a subdomain via path rule, root subdomain, or not exposed at all."
slug: /reference/decide-exposure-strategy
sidebar_label: "Exposure Strategy"
image: /img/og/reference-decide-exposure-strategy.png
keywords: ["Fibe", "Decision", "decide", "exposure", "strategy"]
tags: ["reference", "decision"]
format: md
---

The output of this decision is `fibe.gg/port`, optional `fibe.gg/visibility`, plus optionally `fibe.gg/subdomain` and `fibe.gg/path_rule`.

## Step 1 — Should this service be reachable at all?

| Service kind | Reachable? |
|---|---|
| Public web app | yes — `fibe.gg/port: PORT` and `fibe.gg/visibility: external` |
| Internal admin / metrics / status page | yes — `fibe.gg/port: PORT` and `fibe.gg/visibility: internal` |
| Background worker (Sidekiq, RQ, Celery) | no — omit `fibe.gg/port` |
| Database / cache / queue | no — omit `fibe.gg/port` (they communicate inside the Compose network) |
| Auxiliary build-time service (setup, migrate, notify) | no |
| AnyCable/WebSocket server (talked-to from a public web service) | no |

Internal services talk over the Compose `default` network using their service name as DNS (`db`, `redis`, `web-for-anycable`). Do not expose them externally just because the app needs to reach them.

## Step 2 — Pick internal vs external

- **`fibe.gg/visibility: external`** — public HTTPS route via Traefik on `https://<subdomain>.<marquee-root-domain>`. No additional auth from Fibe. Use for the user-facing app.
- **`fibe.gg/visibility: internal`** — same routing, but Fibe protects the route with Basic Auth using the Playground's internal access credentials (shown on the Playground page). Use for admin consoles (Sidekiq Dashboard, RailsAdmin, Grafana, pgAdmin) that shouldn't be public but you still want a browser URL.

If you want no public surface at all (only reachable from other containers in the network), do NOT set `fibe.gg/port`. The service is then only reachable inside Compose's network.

## Step 3 — Pick the subdomain

The subdomain is the leftmost label of the public host. Default: the service name. Override with `fibe.gg/subdomain`.

| `fibe.gg/subdomain` value | Resulting host |
|---|---|
| omitted | `<service-name>.<marquee-root-domain>` |
| `api` | `api.<marquee-root-domain>` |
| `@` | `<marquee-root-domain>` (the root) |
| `$$var__SUBDOMAIN` | configured at launch |

Subdomain regex: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$`. Lowercase alphanumeric and hyphens, cannot start or end with hyphen.

Use `@` when this service should answer at the root of the Marquee — typically the "front door" web app. At most one service per Marquee can use `@` for a given path; conflicts surface at launch.

## Step 4 — Decide whether to share a subdomain with `path_rule`

Sometimes two services share one host but differ by URL path. The classic case is a Rails web app + an AnyCable WebSocket server: both at `next.fibe.live`, but `/cable` and `/health` route to the WebSocket service.

```yaml
services:
  web:
    labels:
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/subdomain: app
      # no path_rule → catch-all
  ws:
    labels:
      fibe.gg/port: 8081
      fibe.gg/visibility: external
      fibe.gg/subdomain: app
      fibe.gg/path_rule: Path(`/cable`) || Path(`/health`)

x-fibe.gg:
  variables:
    SUBDOMAIN:
      name: "Subdomain"
      default: "next"
      paths:
        - services.web.labels.fibe.gg/subdomain
        - services.ws.labels.fibe.gg/subdomain
```

Both services must use the same subdomain value. Use one `SUBDOMAIN` variable with `paths:` to update both labels. Compose-style `${VAR:-default}` is not valid inside `fibe.gg/*` labels, and inline `$$var__SUBDOMAIN` should not be used for whole-label values.

Path rule allowed matchers only: `Path`, `PathPrefix`, `PathRegexp`. Forbidden: Host, HostRegexp, HostSNI, HostSNIRegexp, Headers, HeadersRegexp, Method, Query, ClientIP — Fibe owns those.

See [recipe-add-path-rule](recipe-add-path-rule.md).

## Step 5 — Pick the port

`fibe.gg/port: PORT` is the **container** port the service listens on, not a host port. Set `fibe.gg/visibility` separately when you need `internal`; otherwise visibility defaults to `external`. Fibe owns host port allocation.

The PORT must be `1..65535`. Omitting `fibe.gg/visibility` defaults to `external`.

```yaml
fibe.gg/port: 80      # nginx static
fibe.gg/visibility: external
fibe.gg/port: 3000    # rails / node
fibe.gg/visibility: external
fibe.gg/port: 5173    # vite dev
fibe.gg/visibility: external
fibe.gg/port: 8000    # python
fibe.gg/visibility: external
fibe.gg/port: 9000    # admin console
fibe.gg/visibility: internal
fibe.gg/port: "8080"  # template uses launcher's port choice via path binding
fibe.gg/visibility: external
```

## Step 6 — Verify the app listens on `0.0.0.0`

A service exposed via Fibe must bind `0.0.0.0` inside the container. `localhost`/`127.0.0.1` is not reachable from the Compose network. Common one-off fixes:

| App | Correct bind |
|---|---|
| Rails | `bin/rails server -b 0.0.0.0` |
| Node/Express | `app.listen(PORT, '0.0.0.0')` |
| Next.js | `next dev -H 0.0.0.0` |
| Vite | `vite --host 0.0.0.0` |
| Django dev server | `python manage.py runserver 0.0.0.0:8000` |
| FastAPI/uvicorn | `uvicorn app:main --host 0.0.0.0` |
| Flask dev | `flask run --host 0.0.0.0` |

Vite 6+ additionally needs `server.allowedHosts: true` or the explicit Fibe host in config — otherwise the browser gets `Invalid Host header`.

## Step 7 — Do not route with Compose `ports:`

Compose `ports:` exposes a host port directly. Fibe strips those bindings by default, so they are fine as local-only development convenience but they do not create a public route. If preserved explicitly, they bypass Traefik:

- doesn't get TLS,
- doesn't get a public URL via the Marquee root domain,
- conflicts with `fibe.gg/zerodowntime: "true"` (validator rejects when `preserve_ports: true`).

Always add `fibe.gg/port` for routed HTTP. See [recipe-ports-to-expose](recipe-ports-to-expose.md).

## Decision tree summary

```
Should service be reachable?
├─ No  → omit fibe.gg/port entirely
└─ Yes
   ├─ Public user-facing       → fibe.gg/port: PORT and fibe.gg/visibility: external
   │  ├─ Default service-name routing? → no extra labels
   │  ├─ Different subdomain?         → fibe.gg/subdomain: <name>
   │  ├─ At root of Marquee?          → fibe.gg/subdomain: "@"
   │  └─ Sharing subdomain with another service? → fibe.gg/path_rule + same subdomain
   └─ Admin / staff only       → fibe.gg/port: PORT and fibe.gg/visibility: internal
      (Basic Auth with the Playground's credentials is applied automatically)
```

## Related skills

[recipe-ports-to-expose](recipe-ports-to-expose.md), [recipe-add-subdomain](recipe-add-subdomain.md), [recipe-add-path-rule](recipe-add-path-rule.md), [decide-zero-downtime](decide-zero-downtime.md), [recipe-strip-incompatible-keys](recipe-strip-incompatible-keys.md), [reference-fibe-labels](reference-fibe-labels.md).
