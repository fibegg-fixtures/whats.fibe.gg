---
title: "Job Trick"
description: "Use to convert a Docker Compose template into a Fibe job-mode template (Trick) with `fibe.gg/job_watch`, `x-fibe.gg.metadata.job_mode: true`, and the runtime constraints around restart, replicas, and exposure."
slug: /reference/mode-job-trick
sidebar_label: "Job Trick"
image: /img/og/reference-mode-job-trick.png
keywords: ["Fibe", "Execution mode", "mode", "job", "trick"]
tags: ["reference", "execution-mode"]
format: md
---

A Trick is a job-mode Playground: it starts, runs the watched service(s) to completion, and tears itself down. Use for CI test runs, migrations, scheduled backups, one-shot data jobs.

## Required pieces

1. **Metadata job flag**: `x-fibe.gg.metadata.job_mode: true`.
2. **Watched service**: `fibe.gg/job_watch: "true"` on at least one service. Its exit code decides success/failure.

Optional but recommended:
- `x-fibe.gg.metadata.description`, `category` — for clarity.
- Source defaults: `metadata.source_defaults: true` if the template is imported from a Prop.

## Minimum example

```yaml
services:
  test:
    image: node:22
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/start_command: npm test
      fibe.gg/job_watch: "true"
      fibe.gg/production: "false"

x-fibe.gg:
  metadata:
    description: "Run npm test against the source repo"
    category: "CI"
    job_mode: true
```

## What runtime does to a job-mode template

- **Removes routing/exposure labels** — no public routes are created for job services; platform bookkeeping labels remain on the containers. The platform has already used the source labels to set up clones and mounts.
- **Forces `restart: "no"`** on every service. Restarts would fight job lifecycle.
- **Forces `deploy.replicas: 1`** on every service. Replicas would multiply work.
- **Strips `fibe.gg/port`, visibility, subdomain, expose, and Traefik routing labels** before launch. Job services aren't user-facing.
- **Completes when all watched services exit.** Unwatched services (DB, queue) are torn down with the job.
- **Fails the run** if any watched service exits non-zero.

## Watched vs unwatched services

```yaml
services:
  test:
    labels:
      fibe.gg/job_watch: "true"          # WATCHED — defines pass/fail
  db:
    image: postgres:17                    # unwatched — supports the test
  cache:
    image: redis:8-alpine                 # unwatched — supports the test
```

The `test` service runs `npm test`, exits 0 or non-zero. The job completes; `db` and `cache` are torn down.

Multiple watched services: all must exit, all must exit 0, for success. If any fails, the run fails.

## Order watched services with `depends_on`

```yaml
services:
  test:
    labels:
      fibe.gg/job_watch: "true"
    depends_on:
      db:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    command: pytest
  migrate:
    image: my-app
    command: bin/rails db:migrate
    restart: "no"
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:17
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
```

The `migrate` service is **not** watched — it's a setup step. Only `test` defines success.

## Job ENV entries

Job-mode templates can pull launcher-level env vars from **Job ENV entries** (Player-scoped or Prop-scoped). They're injected at run time:

- Manage via `fibe_resource_mutate(resource: "job_env", operation: "create"|"update")`.
- Global Job ENV applies to every Player job.
- Prop-scoped Job ENV applies only when the job uses that Prop.

This is the right home for CI credentials (`NPM_TOKEN`, `STRIPE_SECRET_KEY`) — values not in the template but injected per Player/Prop scope.

Entries marked secret are NOT injected into runs triggered by `pull_request` events (protection against untrusted PR code). They are available on push-triggered, scheduled, and manual runs. If a PR test needs a credential, it must come from a non-secret entry or the template itself — understand the exposure risk first.

### Built-in run-context variables

Job services receive Fibe-managed run context env, and source-backed service paths are available to Compose interpolation. Use [reference-fibe-managed-env](reference-fibe-managed-env.md) for the complete variable list, scope, and ownership rules before adding any platform-looking `FIBE_*` key to a template.

## When NOT to use job mode

- Long-running HTTP services. Use long-running templates.
- Scheduled HTTP work — use a long-running service that does work internally. Job mode means "exit when done".
- Services that need exposed ports. Job mode strips routing labels, so they won't get public URLs.

## Triggering a Trick

- Manually: `fibe_resource_mutate(resource: "trick", operation: "trigger", payload: {...})`.
- Re-run last: `fibe_resource_mutate(resource: "trick", operation: "rerun", payload: { id_or_name: <run id or name> })`.
- Scheduled: combine with `metadata.schedule_config` ([mode-schedule-cron](mode-schedule-cron.md)).
- VCS-triggered: combine with `metadata.trigger_config` ([mode-trigger-vcs](mode-trigger-vcs.md)).

## Validation

Specifically validate with `target_type: "trick"`:

```
fibe_schema(
  resource: "compose",
  operation: "validate",
  payload: {
    "compose_yaml": "...",
    "target_type": "trick",
    "job_mode": true
  }
)
```

## Common patterns

### Test runner (see [playbook-test-runner](playbook-test-runner.md))

```yaml
services:
  test:
    image: node:22
    working_dir: /app
    labels:
      fibe.gg/repo_url: ...
      fibe.gg/start_command: npm ci && npm test
      fibe.gg/job_watch: "true"
```

### Database migration

```yaml
services:
  migrate:
    image: my-app:latest
    command: bin/rails db:migrate
    environment:
      DATABASE_URL: "..."
    labels:
      fibe.gg/job_watch: "true"
```

(Static image; no `fibe.gg/repo_url` needed if you build the image elsewhere and just pin a tag.)

### Backup job

```yaml
services:
  backup:
    image: postgres:17
    environment:
      PGHOST: db.prod.internal
      PGUSER: backup_role
      PGPASSWORD: placeholder
    command: >
      pg_dump --no-owner | gzip | aws s3 cp - s3://my-backups/db.gz
    labels:
      fibe.gg/job_watch: "true"
```

## Pitfalls

- **Setting only one of `job_mode: true` / `job_watch`** — `job_watch` without `job_mode`: the label is ignored and the template runs long-running. `job_mode` without any watched service: validation rejects — unless a service is source-backed, in which case source-backed services are watched by default in job mode (set `fibe.gg/job_watch: "false"` to opt one out).
- **Watched service that doesn't exit** (e.g. starts a dev server) — job never finishes. Watched services MUST exit.
- **Setting `fibe.gg/port` on a job service** — no public route is created; the label is stripped before launch. Remove it for clarity.
- **`container_name:`, `ports:`, `restart: always`** — silently overridden, but misleading. Remove for clarity.
- **No `setup`/`migrate` waiting** — if the test service runs before migrations finish, you get false-fail. Use `depends_on: service_completed_successfully`.

## Related skills

[decide-job-mode](decide-job-mode.md), [mode-schedule-cron](mode-schedule-cron.md), [mode-trigger-vcs](mode-trigger-vcs.md), [recipe-depends-on](recipe-depends-on.md), [playbook-test-runner](playbook-test-runner.md), [playbook-cron-scheduled](playbook-cron-scheduled.md).
