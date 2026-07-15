---
title: trick
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Shape — Related

- Execution modes — job mode , schedule, trigger settings.

- Execution modes — job mode , schedule, trigger settings.

## Decide: long-running vs job-mode vs scheduled vs triggered — Pitfalls

- Forgetting metadata.job mode: true — services with job watch may still not enter job lifecycle.

- Forgetting metadata.job mode: true — services with job watch may still not enter job lifecycle. Set both metadata job mode and a watched service label.

## Mode: job-mode templates (Tricks) — Job ENV entries

- Manage via fibe resource mutate(resource: "job env", operation: "create" "update") .

- Manage via fibe resource mutate(resource: "job env", operation: "create" "update") .

## Mode: job-mode templates (Tricks) — Triggering a Trick

- Scheduled: combine with metadata.schedule config (mode-schedule-cron).

- Scheduled: combine with metadata.schedule config (mode-schedule-cron).

## Description

Use to add x-fibe.gg.metadata.schedule config to a job-mode Fibe template - cron expression syntax, marquee id requirement, and the relationship with job mode: true .

Use to add x-fibe.gg.metadata.schedule config to a job-mode Fibe template - cron expression syntax, marquee id requirement, and the relationship with job mode: true .

## Mode: scheduled (cron) job templates — Required pieces

3.

3. x-fibe.gg.metadata.schedule config with enabled , cron , marquee id .

## Mode: scheduled (cron) job templates — Pitfalls

- schedule config without job mode: true — schedule does nothing; long-running templates aren't fireable on schedule.

- schedule config without job mode: true — schedule does nothing; long-running templates aren't fireable on schedule.

## Playbook: scheduled cron job

A complete worked example of a job-mode template with metadata.schedule config .

A complete worked example of a job-mode template with metadata.schedule config . Use as a starting point for any "run this on a schedule" need.

## Playbook: scheduled cron job — Variant: fan-out across props

If you want the same scheduled job to run for several Props (e.g.

If you want the same scheduled job to run for several Props (e.g. backups across multiple Player DBs), create one template per Prop, each with its own schedule config.marquee id and Prop-specific variables. There is no "for each Prop" in schedule config — schedule fires one job at a time.

## Playbook: scheduled cron job — Pitfalls

- Missing job watch — without a watched service the run is "always succeeding" or undefined.

- Missing job watch — without a watched service the run is "always succeeding" or undefined. Always set on the service whose exit defines outcome.

## Reference: x-fibe.gg top-level namespace — job mode

- Complete when all watched services exit.

- Complete when all watched services exit. Non-zero exit on any watched service fails the run.

## Good for — Plain Compose locally

A Trick is a Docker Compose file with Fibe additions on top.

A Trick is a Docker Compose file with Fibe additions on top. docker compose up runs the same file locally for debugging. The only Fibe-specific piece is the watched-service marker.

## Mode: job-mode templates (Tricks) — Watched vs unwatched services

Multiple watched services: all must exit, all must exit 0, for success.

Multiple watched services: all must exit, all must exit 0, for success. If any fails, the run fails.

## Mode: job-mode templates (Tricks) — Pitfalls

- Setting only one of job mode: true / job watch — job watch without job mode : the label is ignored and the template runs long-running.

- Setting only one of job mode: true / job watch — job watch without job mode : the label is ignored and the template runs long-running. job mode without any watched service: validation rejects — unless a service is source-backed, in which case source-backed services are watched by default in job mode (set fibe.gg/job watch: "false" to opt one out).

## Recipe: x-fibe.gg.metadata — Pitfalls

- Root-only job mode / schedule / trigger config — may validate but not launch/import as intended.

- Root-only job mode / schedule / trigger config — may validate but not launch/import as intended. Put execution settings in metadata .

## Shape — schedule config

code example

code example

## Mode: scheduled (cron) job templates — marquee id

code example

code example

## Long-running HTTP — Scheduled (cron)

A Trick that fires on a recurring schedule.

A Trick that fires on a recurring schedule. Add schedule config with enabled , a cron expression, and the target Marquee.

## Good for — Schedules &amp; triggers

Mode Settings Use for Scheduled schedule config — cron expression + target Marquee.

Mode Settings Use for Scheduled schedule config — cron expression + target Marquee. Daily backups, hourly syncs, weekly reports.

## Template validation — Runtime &amp; lifecycle

Message Fix Long-running app reset to one replica and never restarting You accidentally set job mode: true on something that should stay up.

Message Fix Long-running app reset to one replica and never restarting You accidentally set job mode: true on something that should stay up. Remove it.

## What the schema covers — x-fibe.gg namespace

The schema accepts execution settings ( job mode , schedule config , trigger config ) at both the root of x-fibe.gg and under x-fibe.gg.metadata .

The schema accepts execution settings ( job mode , schedule config , trigger config ) at both the root of x-fibe.gg and under x-fibe.gg.metadata . Current launch/import behavior reads them from metadata — keep them there.

## Description

Use to decide whether a template should be a long-running HTTP service, a one-shot job (Trick) with job watch , a scheduled job via schedule config , or a VCS-triggered job via trigger config .

Use to decide whether a template should be a long-running HTTP service, a one-shot job (Trick) with job watch , a scheduled job via schedule config , or a VCS-triggered job via trigger config .

## Decide: long-running vs job-mode vs scheduled vs triggered — The four shapes

Shape Marker Lifecycle Job-mode (Trick) x-fibe.gg.metadata.job mode: true + fibe.gg/job watch: "true" on at least one service Starts, runs, all watched services exit, tear down.

Shape Marker Lifecycle Job-mode (Trick) x-fibe.gg.metadata.job mode: true + fibe.gg/job watch: "true" on at least one service Starts, runs, all watched services exit, tear down.

## Decide: long-running vs job-mode vs scheduled vs triggered — The four shapes

Shape Marker Lifecycle Scheduled job Job-mode + x-fibe.gg.metadata.schedule config Cron-driven launch of a job-mode template.

Shape Marker Lifecycle Scheduled job Job-mode + x-fibe.gg.metadata.schedule config Cron-driven launch of a job-mode template.

## Decide: long-running vs job-mode vs scheduled vs triggered — Pitfalls

- "I want a triggered HTTP preview environment" — use fibe resource mutate(resource: "playground", operation: "create") from a webhook, not the template's trigger config .

- "I want a triggered HTTP preview environment" — use fibe resource mutate(resource: "playground", operation: "create") from a webhook, not the template's trigger config . Trigger config only fires the job-mode template, not arbitrary long-running ones.

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose job mode bool Marks this template as one-shot/job-mode

Field Type Purpose job mode bool Marks this template as one-shot/job-mode

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose schedule config object Cron-driven job launches

Field Type Purpose schedule config object Cron-driven job launches

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose trigger config object VCS-triggered job launches

Field Type Purpose trigger config object VCS-triggered job launches
