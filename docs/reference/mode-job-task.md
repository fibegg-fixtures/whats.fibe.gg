---
title: "Job Task"
description: "Use to convert a Docker Compose template into a Fibe job-mode template (Task) with `fibe.gg/job_watch`, `x-fibe.gg.metadata.job_mode: true`, and the runtime constraints around restart, replicas, and exposure."
slug: /reference/mode-job-task
sidebar_label: "Job Task"
image: /img/og/reference-mode-job-task.png
keywords: ["Fibe", "Execution mode", "mode", "job", "task"]
tags: ["reference", "execution-mode"]
format: md
---

A Task is a job-mode Playground: it starts, runs the watched service(s) to completion, and tears itself down. Use for CI test runs, migrations, scheduled backups, one-shot data jobs.

## Required pieces

1. **Metadata job flag**: `x-fibe.gg.metadata.job_mode: true`.
2. **Watched service**: `fibe.gg/job_watch: "true"` on at least one service. Its exit code decides success/failure.

Optional but recommended:
- `x-fibe.gg.metadata.description`, `category`: for clarity.
- Source defaults: `metadata.source_defaults: true` if the template is imported from a Repository.

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

- **Removes routing/exposure labels**: no public routes are created for job services; platform bookkeeping labels remain on the containers. The platform has already used the source labels to set up clones and mounts.
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

The `migrate` service is **not** watched: it's a setup step. Only `test` defines success.

## Run-context variables

Job services receive Native Fibe run-context values, and source-backed service paths are available to Compose interpolation. Use [reference-fibe-managed-env](reference-fibe-managed-env.md) for the variables supplied by Fibe. Supply application credentials through the credential mechanism configured for the installation; do not place them in the Spec's Compose text.

## Job ENV entries

Job ENV provides named values to Task services. An entry can store an encrypted value directly or reference an owner-bound Secret Vault entry. It may apply to the owner generally or be scoped to a Repository. When a Task is admitted, Fibe captures the eligible values for that run; edits affect later runs.

For Repository-triggered Tasks, Repository-specific entries override owner-wide entries, and secret entries override plain entries with the same key. Secret entries are withheld from pull-request-triggered runs. Job ENV keys cannot begin with `FIBE_` because those names are reserved for Fibe's run context.

Use Job ENV for credentials such as package registry tokens that a Task needs. Use an ENV pack for reusable non-secret environment settings attached to a Spec or Playground. See [security and integrations](fibe-security-access-and-integrations.md) for Vault and ENV pack details.

## When not to use job mode

- Long-running HTTP services. Use long-running templates.
- Scheduled HTTP work: use a long-running service that does work internally. Job mode means "exit when done".
- Services that need exposed ports. Job mode strips routing labels, so they won't get public URLs.

## Triggering a Task

- Manually: `fibe_resource_mutate(resource: "task", operation: "trigger", payload: {...})`.
- Re-run last: `fibe_resource_mutate(resource: "task", operation: "rerun", payload: { id_or_name: <run id or name> })`.
- Scheduled: combine with `metadata.schedule_config` ([mode-schedule-cron](mode-schedule-cron.md)).
- VCS-triggered: combine with `metadata.trigger_config` ([mode-trigger-vcs](mode-trigger-vcs.md)).

## Validation

Specifically validate with `target_type: "task"`:

```
fibe_schema(
  resource: "compose",
  operation: "validate",
  payload: {
    "compose_yaml": "...",
    "target_type": "task",
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

- **Setting only one of `job_mode: true` / `job_watch`**: without `job_mode`, the `job_watch` label is ignored and the template stays long-running. Without an explicit watched service, source-backed services are watched by default; validation rejects templates with nothing to watch. Set `fibe.gg/job_watch: "false"` to exclude a source-backed service.
- **Watched service that doesn't exit** (e.g. starts a dev server): job never finishes. Watched services MUST exit.
- **Setting `fibe.gg/port` on a job service**: no public route is created; the label is stripped before launch. Remove it for clarity.
- **`container_name:`, `ports:`, `restart: always`**: silently overridden, but misleading. Remove for clarity.
- **No `setup`/`migrate` waiting**: if the test service runs before migrations finish, you get false-fail. Use `depends_on: service_completed_successfully`.

## Related skills

[decide-job-mode](decide-job-mode.md), [mode-schedule-cron](mode-schedule-cron.md), [mode-trigger-vcs](mode-trigger-vcs.md), [recipe-depends-on](recipe-depends-on.md), [playbook-test-runner](playbook-test-runner.md), [playbook-cron-scheduled](playbook-cron-scheduled.md).
