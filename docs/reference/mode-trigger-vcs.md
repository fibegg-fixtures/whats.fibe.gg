---
title: "Trigger Vcs"
description: "Use to add `x-fibe.gg.metadata.trigger_config` to a job-mode template - `event_type: push|pull_request`, repo URL, branch, prop/marquee binding, and `source_defaults` auto-fill."
slug: /reference/mode-trigger-vcs
sidebar_label: "Trigger Vcs"
image: /img/og/reference-mode-trigger-vcs.png
keywords: ["Fibe", "Execution mode", "mode", "trigger", "vcs"]
tags: ["reference", "execution-mode"]
format: md
---

A VCS-triggered template runs each time the configured VCS event fires (push to a branch, or pull request). Fibe webhook handlers receive the event, match it to active triggers, launch a job-mode Playground.

## Required pieces

1. `x-fibe.gg.metadata.job_mode: true`.
2. At least one service with `fibe.gg/job_watch: "true"`.
3. `x-fibe.gg.metadata.trigger_config` with:
   - `enabled` (bool)
   - `event_type` enum (`push` | `pull_request`) — optional, defaults to `push`; pull-request triggers match the PR source/head branch
   - `repo_url` (string) or `prop_id` (positive integer or string form) — provide either; `repo_url` is resolved to your repository connection at import
   - `branch` (string)
   - `marquee_id` (positive integer or string form)
   - optional: `agent_id`, `max_retries`, `prompt_template` — attach an agent that retries fixing a failed run

```yaml
x-fibe.gg:
  metadata:
    description: "Run tests on every push to main"
    category: "CI"
    source_defaults: true
    job_mode: true
    trigger_config:
      enabled: true
      event_type: push
      repo_url: https://github.com/owner/repo
      branch: main
      prop_id: 1
      marquee_id: 1
```

## `event_type`

Enum: `push` (commits pushed to `branch`) or `pull_request` (PR opened/synchronized/reopened whose source/head branch is `branch`).

Optional — defaults to `push`. Pull-request triggers run for opened, synchronized, and reopened PRs when the PR source/head branch matches the configured branch.

Schema enforces: `enum: ["push", "pull_request"]`. Other values rejected.

## `source_defaults: true`

When `metadata.source_defaults: true`, Fibe auto-fills `trigger_config.repo_url` and `trigger_config.branch` from the source Prop (if the template is imported via a source-backed mechanism). This means the same template can be reused across repos:

```yaml
x-fibe.gg:
  metadata:
    description: "CI test runner"
    category: "CI"
    source_defaults: true
    job_mode: true
    trigger_config:
      enabled: true
      event_type: push
      # repo_url and branch auto-fill from the source Prop
      prop_id: 1
      marquee_id: 1
```

For private templates tied to one repo, hardcode `repo_url`/`branch`.

## `prop_id`

The Prop resource that wires the repo. Props are Fibe's representation of a Git repo connection. The `prop_id` must reference a Prop the Player owns and has VCS access to.

## `marquee_id`

The Marquee where each triggered Playground launches. Must be a Marquee you own or one shared with you through an accepted team membership. Note: team sharing covers Marquees only — the Prop (and optional agent) must still be yours.

## What runtime does on each event

1. Webhook arrives (GitHub, Gitea).
2. Fibe matches the event to active `trigger_config`s.
3. For each match, creates a new job-mode Playground from the template, on `marquee_id`.
4. Forces `restart: "no"` and `deploy.replicas: 1`.
5. Runs to completion.
6. Records the run result (success or failure, logs, duration) in the run history; you can list past runs and receive notifications inside Fibe. No commit status check is posted back to GitHub or Gitea.

## Worked example: PR test runner

```yaml
services:
  test:
    image: node:22
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/branch: main
      fibe.gg/start_command: npm ci && npm test
      fibe.gg/job_watch: "true"
      fibe.gg/production: "false"

x-fibe.gg:
  variables:
    REPO_URL:
      name: "Repository URL"
      required: true
      path: services.test.labels.fibe.gg/repo_url
    BRANCH:
      name: "Branch"
      required: true
      default: "main"
      path: services.test.labels.fibe.gg/branch

  metadata:
    description: "Run npm test on every PR opened from develop"
    category: "CI"
    source_defaults: true
    job_mode: true
    trigger_config:
      enabled: true
      event_type: pull_request
      branch: develop   # the PR's source (head) branch
      prop_id: 1
      marquee_id: 1
```

When `source_defaults: true` is set and the template is imported from a source-backed mechanism, `REPO_URL` and `BRANCH` variables can be populated from the Prop — but for explicit Prop-bound triggers, you usually hardcode or use launcher input.

## Branch for `event_type: push` vs `pull_request`

- `push`: trigger fires when `branch` itself receives a commit.
- `pull_request`: the trigger fires when a PR is opened, synchronized, or reopened and the PR's **source (head) branch** equals `branch`. Matching is on the PR's source branch — a trigger with `branch: main` does not fire for PRs that merely target main.

## Permissions

Runtime validation will reject a `trigger_config` whose `prop_id` you don't have access to, or whose webhook integration isn't installed. Failure surfaces at template create/update time.

## Combining with schedule

A template can have BOTH `trigger_config` and `schedule_config`. Each fires independently. Useful for CI templates that should also run nightly even without commits.

## Pitfalls

- **`event_type` typo** — must be exactly `push` or `pull_request`. `pr`, `merge`, `tag` are rejected.
- **`source_defaults: true` AND hardcoded `repo_url`** — works; hardcoded wins. The auto-fill only applies when fields are absent.
- **`branch: "*"` for "any branch"** — not supported. Use multiple trigger configs in separate templates if needed.
- **Trigger fires while previous run is in progress** — parallel runs. If non-idempotent, gate in the job script.
- **PR triggers re-firing on every push to the PR** — `synchronize` event. Filter in the job script if you only want to run on PR open.

## Related skills

[mode-job-trick](mode-job-trick.md), [mode-schedule-cron](mode-schedule-cron.md), [decide-job-mode](decide-job-mode.md), [recipe-add-metadata](recipe-add-metadata.md), [reference-x-fibe-gg-namespace](reference-x-fibe-gg-namespace.md), [playbook-test-runner](playbook-test-runner.md).
