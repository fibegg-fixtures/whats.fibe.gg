---
title: "Schedule Cron"
description: "Use to add `x-fibe.gg.metadata.schedule_config` to a job-mode Fibe template - cron expression syntax, `marquee_id` requirement, and the relationship with `job_mode: true`."
slug: /reference/mode-schedule-cron
sidebar_label: "Schedule Cron"
image: /img/og/reference-mode-schedule-cron.png
keywords: ["Fibe", "Execution mode", "mode", "schedule", "cron"]
tags: ["reference", "execution-mode"]
format: md
---

A scheduled template is a **job-mode** template that Fibe launches on a cron schedule. The scheduler creates a new Playground each fire; the Playground exits when watched services complete; the result is recorded.

## Required pieces

1. `x-fibe.gg.metadata.job_mode: true`.
2. At least one service with `fibe.gg/job_watch: "true"`.
3. `x-fibe.gg.metadata.schedule_config` with `enabled`, `cron`, `marquee_id`.

```yaml
x-fibe.gg:
  metadata:
    description: "Nightly DB backup"
    category: "Operations"
    job_mode: true
    schedule_config:
      enabled: true
      cron: "0 3 * * *"          # 3:00 daily, UTC by default
      marquee_id: 1
```

## `cron` field

5-field POSIX cron expression:

```
min hour day-of-month month day-of-week
0   3    *            *     *           ← daily at 3:00
*/5 *    *            *     *           ← every 5 minutes
0   */2  *            *     *           ← every 2 hours
0   0    1            *     *           ← first of every month at midnight
30  6    *            *     1-5         ← 06:30 Mon-Fri
```

Schedule is interpreted in **UTC** by default. If the runtime supports per-Marquee timezone overrides, that's a separate config; check current docs.

## `marquee_id`

The Marquee where each fired Playground runs. **Required**. Must be a Marquee you own directly or one shared with you through an accepted team membership (team-shared Marquees behave the same for scheduling). The Marquee must still be funded and launchable. Schema validates shape (positive integer, or `^[1-9][0-9]*$` string); runtime resolves and authorizes.

```yaml
schedule_config:
  enabled: true
  cron: "0 3 * * *"
  marquee_id: 1                   # integer
```

```yaml
schedule_config:
  marquee_id: "1"                 # string form, also valid
```

## `enabled`

Boolean — disable without removing the schedule config by setting `enabled: false`. Useful for templates that ship with a schedule but should not auto-fire until explicitly opted in.

## Combining with `trigger_config`

Same template can fire on schedule AND on VCS triggers — declare both `schedule_config` AND `trigger_config`. Fibe launches independently for each:

```yaml
x-fibe.gg:
  metadata:
    job_mode: true
    schedule_config:
      enabled: true
      cron: "0 3 * * *"
      marquee_id: 1
    trigger_config:
      enabled: true
      event_type: push
      repo_url: https://github.com/owner/repo
      branch: main
      prop_id: 1
      marquee_id: 1
```

## What runtime does

- At each cron fire, creates a new job-mode Playground from the template.
- Forces `restart: "no"` and `deploy.replicas: 1`.
- Runs until watched services exit.
- Records result (success/failure, logs, duration).
- Tears down the Playground after completion.

## Where to find run history

`fibe_resource_list(resource: "trick", params: { ... })` lists past runs of job-mode templates. Filter by the playspec that was created from the template (`playspec_id`) to see only its run history. See platform skill `fibe-tool-resource-list`.

## Worked example: nightly Postgres backup

```yaml
services:
  backup:
    image: postgres:17
    environment:
      PGHOST: db.example.internal
      PGUSER: postgres
      PGPASSWORD: placeholder
      PGDATABASE: app
      S3_BUCKET: backups
      S3_KEY_ID: key-id
      S3_SECRET: placeholder
    command:
      - /bin/bash
      - -ec
      - |
        TS=$$(date -u +%Y%m%dT%H%M%SZ)
        FILE=/tmp/$${PGDATABASE}-$${TS}.sql.gz
        pg_dump --no-owner | gzip > "$$FILE"
        AWS_ACCESS_KEY_ID="$$S3_KEY_ID" AWS_SECRET_ACCESS_KEY="$$S3_SECRET" \
          aws s3 cp "$$FILE" "s3://$$S3_BUCKET/$$(basename "$$FILE")"
    labels:
      fibe.gg/job_watch: "true"
    restart: "no"

x-fibe.gg:
  metadata:
    description: "Nightly Postgres → S3 backup"
    category: "Operations"
    job_mode: true
    schedule_config:
      enabled: true
      cron: "0 3 * * *"
      marquee_id: 1

  variables:
    PG_HOST:
      name: "Postgres host"
      required: true
      path: services.backup.environment.PGHOST
    PG_USER:
      name: "Postgres user"
      required: true
      default: "postgres"
      path: services.backup.environment.PGUSER
    PG_PASS:
      name: "Postgres password"
      required: true
      secret: true
      sensitive: true
      path: services.backup.environment.PGPASSWORD
    PG_DB:
      name: "Postgres database"
      required: true
      path: services.backup.environment.PGDATABASE
    S3_BUCKET:
      name: "S3 bucket"
      required: true
      path: services.backup.environment.S3_BUCKET
    S3_KEY_ID:
      name: "S3 access key ID"
      required: true
      secret: true
      path: services.backup.environment.S3_KEY_ID
    S3_SECRET:
      name: "S3 secret access key"
      required: true
      secret: true
      sensitive: true
      path: services.backup.environment.S3_SECRET
```

## Pitfalls

- **`schedule_config` without `job_mode: true`** — schedule does nothing; long-running templates aren't fireable on schedule.
- **Missing `marquee_id`** — schema accepts (no marquee_id is technically `additionalProperties: true`), but runtime requires it. Always set.
- **Invalid cron expression** — rejected when the schedule is saved or imported (error: `invalid schedule format`). Test the cron with an external tool first if unsure.
- **Cron fires while previous run is still active** — typically Fibe just spawns another Playground (parallel runs). If your job is non-idempotent (e.g. modifying a shared DB), guard with a lock or change the cadence.
- **Long-running tasks with tight crontab** — `*/1 * * * *` for a job that takes 90 seconds = unbounded growth. Make the period > max job duration.
- **Mistaking schedule UTC for local time** — verify by sending a one-off Mutter with a timestamp at fire.

## Related skills

[mode-job-trick](mode-job-trick.md), [mode-trigger-vcs](mode-trigger-vcs.md), [decide-job-mode](decide-job-mode.md), [reference-x-fibe-gg-namespace](reference-x-fibe-gg-namespace.md), [playbook-cron-scheduled](playbook-cron-scheduled.md).
