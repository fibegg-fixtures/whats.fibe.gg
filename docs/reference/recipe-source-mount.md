---
title: "Source Mount"
description: "Use to set up Fibe live source mounting via `working_dir` plus `fibe.gg/repo_url` and `fibe.gg/production: false`, including framework-specific dev/watch commands and the rules around `node_modules` and build artifacts."
slug: /reference/recipe-source-mount
sidebar_label: "Source Mount"
image: /img/og/reference-recipe-source-mount.png
keywords: ["Fibe", "Recipe", "recipe", "source", "mount"]
tags: ["reference", "recipe"]
format: md
---

`working_dir` tells Fibe to bind-mount the cloned repo into the container at that path. Edits to files in the source tree show up inside the container immediately — the app must run a dev/watch process to react.

## Required fields and labels

| Field | Value |
|---|---|
| `fibe.gg/repo_url` | Git repo URL; marks the service as repository-backed |
| Compose `working_dir` | absolute path inside the container, e.g. `/app` |
| `fibe.gg/production` | `"false"` (the source-mounted mode) |
| `fibe.gg/start_command` | the dev/watch command, NOT a production build |

`working_dir` alone remains ordinary Compose on an image-only service. When
`fibe.gg/repo_url` is present, the validator requires an absolute `working_dir`:
`Service '<n>' must define an absolute working_dir for repository-backed source`.

## Defaults

- Repository-backed services have no `working_dir` default. Set an explicit absolute container path.
- `fibe.gg/production` defaults to unset, which behaves like development for source-mounted setups. Set `"false"` explicitly for clarity, `"true"` to opt out of source mounting and run the built image.

## Checkout and mount semantics

Fibe groups source by normalized repository and exact branch, not by service.
Several services using the same repository and branch share one checkout and one
Git synchronization. Different branches always use separate checkouts, even
when their readable names would collide. The Core-owned source plan is an
in-memory value: standalone Core derives a repository-digest path, while
fibe.gg supplies its established `props/<prop_slug>/<branch>` path to the same
grouping and mount contract. The rendered Compose exposes either consumer-owned
path to local tools through standard build contexts and bind mounts.

For each eligible non-production service, Fibe replaces every existing Compose
mount whose normalized container target exactly equals `working_dir`. Short
syntax, long syntax, anonymous volumes, and interpolated sources are handled.
The replacement is a read-write bind; old mount modes and long-form options at
that exact target do not survive. Mounts at parent, child, and unrelated targets
remain untouched.

## App-side requirements

The app must:

1. **Bind on `0.0.0.0`**, not localhost.
2. **Run a watch/dev process** (Vite, webpack-dev-server, nodemon, Rails `bin/dev`, `flask --debug run`, `uvicorn --reload`).
3. **Listen on the port from `fibe.gg/port`.**
4. **Allow the public Fibe host** when the framework validates hosts (Vite 6+ needs `server.allowedHosts: true`).
5. **Watch the mounted source path** (some watchers need polling enabled when filesystem events don't cross the bind mount — e.g. `CHOKIDAR_USEPOLLING=true` for Node).
6. **Keep `node_modules` / `__pycache__` / `tmp` / `Gemfile.lock`-derived dirs OUT of the source tree mounted from the repo** — they live in container-only volumes.

## Volumes for dependency dirs

Source-mounted Node templates need `node_modules` to NOT be in the repo (it's gitignored) AND to persist across container starts:

```yaml
services:
  web:
    image: node:24
    working_dir: /app
    volumes:
      - web_node_modules:/app/node_modules
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/start_command: npm run dev -- --host 0.0.0.0
      fibe.gg/port: 5173
      fibe.gg/visibility: external
      fibe.gg/production: "false"

volumes:
  web_node_modules:
```

The named volume sits "on top of" the source-mount at the `node_modules` subdirectory — the container has them, but they don't leak into the repo on disk. (Bind mounts and named volumes layer at distinct paths.)

Similarly for Python:

```yaml
services:
  web:
    image: python:3.12
    working_dir: /app
    volumes:
      - pip_cache:/root/.cache/pip
    labels:
      fibe.gg/repo_url: ...
      fibe.gg/start_command: sh -c "pip install -r requirements.txt && uvicorn app:main --host 0.0.0.0 --reload"
      fibe.gg/port: 8000
      fibe.gg/visibility: external
      fibe.gg/production: "false"
volumes:
  pip_cache:
```

For Ruby/Rails, gems live inside the image (or in a separate volume); never bind-mount Gemfile.lock-derived state.

## Framework cheatsheet

| Framework | `fibe.gg/start_command` |
|---|---|
| Rails dev (with bin/dev) | `bin/dev` (often runs Vite + Puma via Procfile.dev) |
| Rails dev (plain) | `bin/rails server -b 0.0.0.0` |
| Node Express dev | `npm run dev` (with nodemon configured in script) |
| Next.js dev | `npm run dev -- -H 0.0.0.0` |
| Vite SPA | `npm run dev -- --host 0.0.0.0` |
| Django dev | `python manage.py runserver 0.0.0.0:8000` |
| FastAPI uvicorn | `uvicorn app:main --host 0.0.0.0 --reload` |
| Flask dev | `flask run --host 0.0.0.0 --debug` |
| Go (air) | `air -c .air.toml` |
| PHP/Laravel artisan | `php artisan serve --host=0.0.0.0 --port=8000` |

## Vite-specific note

Vite 6+ validates `Host:` headers. Behind Fibe/Traefik you'll see `Invalid Host header` 403 unless:

```js
// vite.config.js
export default {
  server: {
    host: '0.0.0.0',
    allowedHosts: true,         // or: ['my-subdomain.<root-domain>']
  },
};
```

For SPA dev templates this is mandatory.

## Production mode (no source mount)

For zero-downtime production deployments, switch off source mount:

```yaml
services:
  web:
    image: ghcr.io/owner/app:latest    # built image, used as-is
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/dockerfile: Dockerfile
      fibe.gg/production: "true"       # built image; no source mount
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/zerodowntime: "true"
      # ... healthcheck labels ...
```

In production mode Fibe does not generate its source bind. Every user-authored
Compose volume is preserved, including a volume at the `working_dir` target,
so such a volume may still mask the image filesystem.

## Toggling dev/prod via a variable

```yaml
services:
  web:
    image: node:24
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/start_command: npm run dev
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/production: "false"

x-fibe.gg:
  variables:
    REPO_URL:
      name: "Repository URL"
      required: true
      path: services.web.labels.fibe.gg/repo_url
    START_COMMAND:
      name: "Start command"
      default: "npm run dev"
      path: services.web.labels.fibe.gg/start_command
    PRODUCTION:
      name: "Production mode (built image)"
      default: "false"
      path: services.web.labels.fibe.gg/production
```

## Pitfalls

- **`fibe.gg/repo_url` without an absolute `working_dir`** — validator hard error.
- **Committing `node_modules` to the repo** — bloats clone time and is overwritten by the volume anyway. Add to `.gitignore`.
- **`fibe.gg/start_command` that builds and exits** — like `npm run build` — the container exits after build. Use the dev/watch command instead.
- **Running production build under source mount** — works but wastes the live-edit feature; switch to `production: "true"`.
- **Source-mount + `fibe.gg/zerodowntime`** — works but odd: zero-downtime is about rolling builds, not editing source. Use one or the other.
- **Long-running compile-on-save (Rust, Java)** that can't reload at runtime — source mount provides no benefit. Use production mode and run a watcher-and-rebuild loop in a separate job-mode template.

## Related skills

[recipe-build-to-repo-url](recipe-build-to-repo-url.md), [recipe-build-args-and-target](recipe-build-args-and-target.md), [decide-static-vs-dynamic](decide-static-vs-dynamic.md), [playbook-nodejs-dev](playbook-nodejs-dev.md), [playbook-rails-app](playbook-rails-app.md), [reference-fibe-labels](reference-fibe-labels.md).
