---
title: trick
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Shape — Related

- Execution modes — job mode , schedule, trigger settings.

## Decide: long-running vs job-mode vs scheduled vs triggered — Scheduled (cron)

Add schedule config under x-fibe.gg.metadata :

## Decide: long-running vs job-mode vs scheduled vs triggered — Pitfalls

- Forgetting metadata.job mode: true — services with job watch may still not enter job lifecycle.

- Forgetting metadata.job mode: true — services with job watch may still not enter job lifecycle. Set both metadata job mode and a watched service label.

## Mode: job-mode templates (Tricks) — Job ENV entries

- Manage via fibe resource mutate(resource: "job env", operation: "create" "update") .

## Mode: job-mode templates (Tricks) — Triggering a Trick

- Scheduled: combine with metadata.schedule config (mode-schedule-cron).

## Mode: job-mode templates (Tricks) — Triggering a Trick

- VCS-triggered: combine with metadata.trigger config (mode-trigger-vcs).

## Description

Use to add x-fibe.gg.metadata.schedule config to a job-mode Fibe template - cron expression syntax, marquee id requirement, and the relationship with job mode: true .

## Mode: scheduled (cron) job templates — Required pieces

3. x-fibe.gg.metadata.schedule config with enabled , cron , marquee id .

## Mode: scheduled (cron) job templates — Combining with trigger config

Same template can fire on schedule AND on VCS triggers — declare both schedule config AND trigger config .

Same template can fire on schedule AND on VCS triggers — declare both schedule config AND trigger config . Fibe launches independently for each:

## Mode: scheduled (cron) job templates — Pitfalls

- schedule config without job mode: true — schedule does nothing; long-running templates aren't fireable on schedule.

## Mode: VCS-triggered job templates — Required pieces

3. x-fibe.gg.metadata.trigger config with:

## Mode: VCS-triggered job templates — What runtime does on each event

2. Fibe matches the event to active trigger config s.

## Mode: VCS-triggered job templates — What runtime does on each event

3. For each match, creates a new job-mode Playground from the template, on marquee id .

## Mode: VCS-triggered job templates — Combining with schedule

A template can have BOTH trigger config and schedule config .

A template can have BOTH trigger config and schedule config . Each fires independently. Useful for CI templates that should also run nightly even without commits.

## Description

Use to build a Fibe template for a scheduled cron job - daily DB backup, periodic data sync, log cleanup.

Use to build a Fibe template for a scheduled cron job - daily DB backup, periodic data sync, log cleanup. Combines metadata.job mode: true + metadata.schedule config + watched service.

## Playbook: scheduled cron job

A complete worked example of a job-mode template with metadata.schedule config .

A complete worked example of a job-mode template with metadata.schedule config . Use as a starting point for any "run this on a schedule" need.

## Playbook: scheduled cron job — Variant: fan-out across props

If you want the same scheduled job to run for several Props (e.g.

If you want the same scheduled job to run for several Props (e.g. backups across multiple Player DBs), create one template per Prop, each with its own schedule config.marquee id and Prop-specific variables. There is no "for each Prop" in schedule config — schedule fires one job at a time.

## Playbook: scheduled cron job — Pitfalls

- Missing job watch — without a watched service the run is "always succeeding" or undefined.

- Missing job watch — without a watched service the run is "always succeeding" or undefined. Always set on the service whose exit defines outcome.

## Description

Use to fill in x-fibe.gg.metadata.description , category , source defaults , and execution settings such as job mode , schedule config , and trigger config .

## Recipe: x-fibe.gg.metadata — source defaults: true

- trigger config.repo url / branch if the template has a trigger config and job mode: true .

## Reference: x-fibe.gg top-level namespace — job mode

- Complete when all watched services exit.

- Complete when all watched services exit. Non-zero exit on any watched service fails the run.

## Mode: job-mode templates (Tricks) — Watched vs unwatched services

Multiple watched services: all must exit, all must exit 0, for success.

Multiple watched services: all must exit, all must exit 0, for success. If any fails, the run fails.

## Mode: job-mode templates (Tricks) — Pitfalls

- Setting only one of job mode: true / job watch — job watch without job mode : the label is ignored and the template runs long-running.

- Setting only one of job mode: true / job watch — job watch without job mode : the label is ignored and the template runs long-running. job mode without any watched service: validation rejects — unless a service is source-backed, in which case source-backed services are watched by default in job mode (set fibe.gg/job watch: "false" to opt one out).

## Recipe: x-fibe.gg.metadata — Pitfalls

- Root-only job mode / schedule / trigger config — may validate but not launch/import as intended.

- Root-only job mode / schedule / trigger config — may validate but not launch/import as intended. Put execution settings in metadata .

## Long-running HTTP — Scheduled (cron)

code example

## Shape — schedule config

code example

## Good for — Example: nightly backup

code example

## What the schema covers — x-fibe.gg namespace

code example

## Mode: scheduled (cron) job templates — Required pieces

code example

## Mode: scheduled (cron) job templates — marquee id

code example

## Mode: VCS-triggered job templates — Worked example: PR test runner

code example

## Reference: x-fibe.gg top-level namespace — schedule config

code example

## Long-running HTTP — Scheduled (cron)

A Trick that fires on a recurring schedule.

A Trick that fires on a recurring schedule. Add schedule config with enabled , a cron expression, and the target Marquee.

## Shape

Execution settings ( job mode , schedule config , trigger config ) must live under metadata .

Execution settings ( job mode , schedule config , trigger config ) must live under metadata . Copies at the root of x-fibe.gg are accepted by the schema for compatibility but have no effect — Fibe only reads the metadata versions.

## Shape — schedule config

Combined with job mode: true .

Combined with job mode: true . Cron is a standard 5-field expression. Fibe resolves marquee id to a Marquee you can manage — one you own, or one shared with your team.

## Good for — Schedules &amp; triggers

Mode Settings Use for Scheduled schedule config — cron expression + target Marquee.

Mode Settings Use for Scheduled schedule config — cron expression + target Marquee. Daily backups, hourly syncs, weekly reports.

## Template validation — Runtime &amp; lifecycle

Message Fix Long-running app reset to one replica and never restarting You accidentally set job mode: true on something that should stay up.

Message Fix Long-running app reset to one replica and never restarting You accidentally set job mode: true on something that should stay up. Remove it.

## What the schema covers — x-fibe.gg namespace

The schema accepts execution settings ( job mode , schedule config , trigger config ) at both the root of x-fibe.gg and under x-fibe.gg.metadata .

The schema accepts execution settings ( job mode , schedule config , trigger config ) at both the root of x-fibe.gg and under x-fibe.gg.metadata . Current launch/import behavior reads them from metadata — keep them there.

## Where it lives — What the schema does not cover

- Reachability of resources.

- Reachability of resources. marquee id: 1 is valid JSON-Schema-wise but fails at runtime if you don't own Marquee 1.

## Description

Use to decide whether a template should be a long-running HTTP service, a one-shot job (Trick) with job watch , a scheduled job via schedule config , or a VCS-triggered job via trigger config .

## Decide: long-running vs job-mode vs scheduled vs triggered — The four shapes

Shape Marker Lifecycle Job-mode (Trick) x-fibe.gg.metadata.job mode: true + fibe.gg/job watch: "true" on at least one service Starts, runs, all watched services exit, tear down.

## Decide: long-running vs job-mode vs scheduled vs triggered — The four shapes

Shape Marker Lifecycle Scheduled job Job-mode + x-fibe.gg.metadata.schedule config Cron-driven launch of a job-mode template.

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose job mode bool Marks this template as one-shot/job-mode

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose schedule config object Cron-driven job launches

## Recipe: x-fibe.gg.metadata — All recognized fields

Field Type Purpose trigger config object VCS-triggered job launches

## Reference: x-fibe.gg top-level namespace

Schema accepts job mode , schedule config , and trigger config both at x-fibe.gg.

Schema accepts job mode , schedule config , and trigger config both at x-fibe.gg. and under x-fibe.gg.metadata. . For current launch/import behavior, put execution settings under metadata ; a root-level copy can be kept as a compatibility mirror, but do not rely on root-only execution settings.
