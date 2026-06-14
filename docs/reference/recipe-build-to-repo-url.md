---
title: "Build To Repo Url"
description: "Use to convert a Compose `build:` block into Fibe dynamic-service labels (`fibe.gg/repo_url`, `fibe.gg/dockerfile`, `fibe.gg/branch`) so Fibe clones, builds, and rolls out the service."
slug: /reference/recipe-build-to-repo-url
sidebar_label: "Build To Repo Url"
image: /img/og/reference-recipe-build-to-repo-url.png
keywords: ["Fibe", "Recipe", "recipe", "build", "to", "repo", "url"]
tags: ["reference", "recipe"]
format: md
---

When the input Compose has a `build:` block, the service is built from source. Fibe's runtime owns clone + build. Drop most of `build:` and lift the relevant fields into `fibe.gg/*` labels.

## Mapping

| Compose `build:` field | Fibe label / behavior |
|---|---|
| `build:` exists | **Add** `fibe.gg/repo_url: <repo>` (REQUIRED — schema validator rejects build without it) |
| `build: .` or `context: .` | Runtime build context becomes the cloned repo path |
| `context: subdir/` | Not preserved as the runtime context — use `fibe.gg/dockerfile: subdir/Dockerfile` and ensure the Dockerfile works from the repo root, or restructure |
| `dockerfile: Dockerfile.dev` | `fibe.gg/dockerfile: Dockerfile.dev` |
| `target: production` | `fibe.gg/build_target: production` |
| `args: { KEY: value, K2: v2 }` | `fibe.gg/build_args: "KEY=value,K2=v2"` (comma-separated string) |

After conversion, the `build:` block can be **kept for templates that must also run with local `docker compose up`**. Fibe strips or rewrites the runtime build context to the cloned repo path and uses the Fibe labels for Dockerfile/target/args.

Only delete `build:` when the template is Fibe-only or when the service is source-only and should not trigger a build workflow. Do not replace a real buildable app service with an `image:` placeholder just to make the template shorter.

## Step-by-step

1. **Identify the repo** (`https://github.com/owner/repo`, a configured Gitea URL, or a full `ssh://` URL).
2. **Add `fibe.gg/repo_url`** with that URL. If the launcher should choose, use `$$var__REPO_URL` and declare the variable.
3. **Pin Dockerfile** if it isn't at repo root: `fibe.gg/dockerfile: <path>`.
4. **Pin branch** if you don't want the default: `fibe.gg/branch: <ref>`. Default branch is the repo default.
5. **Move build target** if multi-stage: `fibe.gg/build_target: <stage>`.
6. **Move build args** to comma-separated string: `fibe.gg/build_args: "K=v,..."`.
7. **Keep `build:` when local Docker Compose parity matters.** It must point at a buildable local context.
8. **Delete `build:` only for Fibe-only templates or source-only services.**
9. **Add `image:` only when the service needs a base runtime image without a build workflow** (for example, source-mounted dev mode or source-only helper services). Avoid using `image:` as a substitute for an app service that should be built.

## Before / after

### Simple `build:` → labels

```yaml
# BEFORE
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      RAILS_ENV: development

# AFTER (local + Fibe compatible)
services:
  web:
    build: .
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/port: 3000
      fibe.gg/visibility: external
      fibe.gg/production: "false"
      fibe.gg/start_command: bin/rails server -b 0.0.0.0
    environment:
      RAILS_ENV: development
```

### Multi-stage build with args

```yaml
# BEFORE
services:
  api:
    build:
      context: .
      dockerfile: deploy/Dockerfile
      target: production
      args:
        NODE_VERSION: "20"
        BUILD_ENV: production

# AFTER
services:
  api:
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/dockerfile: deploy/Dockerfile
      fibe.gg/build_target: production
      fibe.gg/build_args: "NODE_VERSION=20,BUILD_ENV=production"
      fibe.gg/port: 8080
      fibe.gg/visibility: external
      fibe.gg/production: "true"
```

### Launch-time configurable

```yaml
services:
  web:
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/branch: main
      fibe.gg/dockerfile: Dockerfile
      fibe.gg/port: 3000
      fibe.gg/visibility: external

x-fibe.gg:
  variables:
    REPO_URL:
      name: "Repository URL"
      required: true
      default: "https://github.com/owner/repo"
      path: services.web.labels.fibe.gg/repo_url
    BRANCH:
      name: "Branch"
      required: true
      default: "main"
      path: services.web.labels.fibe.gg/branch
```

Use this pattern when the launcher should choose the repository and branch.

## Subdirectory builds (monorepo-style)

If the project is in a monorepo and the Dockerfile assumes a subdirectory context, restructure or adjust `COPY` paths for a repo-root build context. The `fibe.gg/dockerfile` value can point into a subdirectory (`apps/web/Dockerfile`), but the Dockerfile must be self-sufficient relative to the cloned repo root.

## `image:` on dynamic services

Compose allows both `image:` and `build:`. With Fibe:

- In `production: "false"` (dev) mode without `build:`, `image:` is what runs while source is mounted into `fibe.gg/source_mount`. Pick something with the language runtime: `node:24-slim`, `python:3.12`, `ruby:3.3`, `golang:1.23`, or a tiny runner such as `alpine:3.21` for source-only helpers. Avoid `:latest`.
- In `production: "true"` mode, `image:` is a placeholder; Fibe builds a fresh image from the Dockerfile and replaces it.

## Source-only helpers are not build services

If a service exists only to make a repository available via `fibe.gg/source_mount`, use `image:` and omit `build:`:

```yaml
services:
  dependency-source:
    image: alpine:3.21
    command: ["sh", "-c", "true"]
    labels:
      fibe.gg/repo_url: https://github.com/owner/dependency
      fibe.gg/source_mount: /source/dependency
      fibe.gg/production: "false"
```

`fibe.gg/repo_url` makes the service dynamic. Adding `build:` would switch it into a build workflow and can make Fibe build a repository that should only be cloned and mounted.

## Pitfalls

- **Forgetting `fibe.gg/repo_url`** — schema/runtime hard error: `Service '<n>' has a build directive but lacks a fibe.gg/repo_url label`.
- **Using scp-style SSH** — `git@github.com:owner/repo.git` fails. Use `https://github.com/...`, a configured Gitea URL, or a full `ssh://` URL.
- **Pointing Dockerfile outside the repo** — paths are interpreted relative to the cloned repo root.
- **Trying to build from a local directory** — not supported. Fibe is not `docker compose build`; the source must be a remote VCS URL the platform can clone.

## Related skills

[recipe-build-args-and-target](recipe-build-args-and-target.md), [recipe-source-mount](recipe-source-mount.md), [recipe-strip-incompatible-keys](recipe-strip-incompatible-keys.md), [decide-static-vs-dynamic](decide-static-vs-dynamic.md), [playbook-rails-app](playbook-rails-app.md), [playbook-nodejs-dev](playbook-nodejs-dev.md), [reference-fibe-labels](reference-fibe-labels.md).
