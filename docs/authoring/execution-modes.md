---
title: Execution modes
description: "A template runs in one of four shapes: long-running HTTP, Task, scheduled Task, triggered Task. Decide first; everything else follows."
slug: /authoring/execution-modes
sidebar_position: 8
image: /img/og/authoring-execution-modes.png
keywords: [execution modes, job_mode, schedule, trigger, cron, push, pull_request]
---

A template runs in one of four shapes. Decide first; everything else follows.

## Long-running HTTP

The default. Just expose your services with `fibe.gg/port` and they stay up until you stop them. No special settings needed.

## Task (one-shot)

Required pieces:

- `x-fibe.gg.metadata.job_mode: true`
- A watched service. Dynamic source-backed services are watched by default in job mode unless they set `fibe.gg/job_watch: "false"`; static services need `fibe.gg/job_watch: "true"`.

Task rules Fibe enforces for you:

- Routing labels such as `fibe.gg/port`, `fibe.gg/visibility`, and `fibe.gg/subdomain` are stripped before launch: a Task isn't there to serve traffic.
- Every service is forced to one replica and not to restart.
- Watched services must actually exit (don't run a dev server or sleep loop).
- The Task succeeds when every watched service exits with status zero; non-zero on any watched service fails the run.
- A Task with no watched service, or with watched services that never exit, fails by timing out rather than at template validation time.

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
    description: "Run npm test against the repo"
    category: "CI"
    job_mode: true
```

## Scheduled (cron)

A Task that fires on a recurring schedule. Add `schedule_config` with `enabled`, a cron expression, and the target Host.

| Cron | Meaning |
| --- | --- |
| `0 3 * * *` | daily at 03:00 |
| `*/5 * * * *` | every 5 minutes |
| `0 */2 * * *` | every 2 hours |
| `0 0 1 * *` | first of every month at midnight |
| `30 6 * * 1-5` | 06:30, Mon-Fri |

The `cron` field accepts standard five-field cron and plain-language schedules such as `every day at 9am` or `every 5 minutes`. Invalid expressions are rejected when the template is saved or imported. There is no minimum interval, so a schedule can run every minute.

:::caution Overlap
Jobs can overlap when they run longer than their period. **Stateful (Persist Volumes)** Tasks queue runs and execute them one at a time. Otherwise, use a period longer than the maximum job time or guard the job with a lock. The [Tasks](/concepts/tasks/) page covers runtime limits, result retention, and queueing.
:::

```yaml
x-fibe.gg:
  metadata:
    job_mode: true
    description: "Nightly backup to S3"
    category: "Operations"
    schedule_config:
      enabled: true
      cron: "0 3 * * *"
      host_id: 1
```

## Triggered (push or pull request)

A Task that fires on a Git event. Add `trigger_config` with the event type (`push` or `pull_request`), the repo URL, branch, the Repository the source is connected through, and the target Host.

- **push** fires when the named branch itself receives a commit.
- **pull_request** fires when a PR is opened or updated whose source (head) branch matches `branch`; that head branch is also the code under test. Set `branch` to the branch PRs are made from: matching on the PR's target branch isn't supported.
- Wildcards across many branches aren't supported: make a template per shape.

```yaml
x-fibe.gg:
  metadata:
    job_mode: true
    description: "Run tests on every push to main"
    category: "CI"
    trigger_config:
      enabled: true
      event_type: push
      repo_url: https://github.com/owner/repo
      branch: main
      repository_id: 1
      host_id: 1
```

## You can combine schedules and triggers

A Task can be both scheduled (run every night) and triggered (run on every push). Each event fires its own run.

## Related

- [Tasks & automated jobs](/concepts/tasks/): the concept page.
- Reference: [`mode-job-task`](/reference/mode-job-task/), [`mode-schedule-cron`](/reference/mode-schedule-cron/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/), [`decide-job-mode`](/reference/decide-job-mode/).
