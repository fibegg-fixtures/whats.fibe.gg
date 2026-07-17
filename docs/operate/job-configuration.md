---
title: Job configuration
description: Runtime rules for one-shot Tricks, watched services, job results, and the default job Playground lifetime.
slug: /operate/job-configuration
sidebar_position: 4
image: /img/og/operate-job-configuration.png
keywords: [job_mode, trick, watched service, job result, ttl]
---

Job-mode templates run as one-shot Tricks. Use them for tests, backups, data syncs, migrations, report generation, and other work that should finish.

## Required settings

A job-mode template needs both pieces:

- `x-fibe.gg.metadata.job_mode: true`
- `fibe.gg/job_watch: "true"` on at least one service

The watched service is the service whose exit status defines the result. Use a command that exits when the work is done. Do not watch a dev server, `sleep` loop, or process supervisor.

## Result rules

Fibe polls watched services until they finish:

- exit code `0` means that watched service succeeded
- a non-zero exit code means that watched service failed
- success requires every watched service to finish with exit code `0`
- if any watched service fails, the job result is failed immediately

Fibe stores the per-service exit code, completion time, and log tail in the job result so you can inspect the run after runtime containers are cleaned up.

## Runtime behavior

For job-mode templates, Fibe applies runtime-safe defaults:

- services are treated as one-shot work, not public traffic
- services are not exposed
- each service runs as a single replica
- restart behavior is disabled
- source mounts can be used for CI-style work against repository code

Unwatched helper services can still support the watched service. For example, a test runner can depend on a database or browser service. The helper should not carry `fibe.gg/job_watch: "true"` unless its exit code is part of the result.

## Lifetime

New Job Playgrounds default to **Never Expire**, just like regular Playgrounds. If a job expiration is enabled without an explicit deadline, Fibe uses the operator-configured `job_playground_ttl_hours` fallback (1 hour by default). The same fallback is used when extending a job without supplying a duration.

Expiration is separate from job completion: a successful job completes when all watched services exit `0`, and a failed job fails as soon as any watched service exits non-zero. Completion cleans up the runtime containers while retaining the Trick record and its captured result; deleting or expiring the Trick removes that saved result.

## Minimal example

```yaml
services:
  test:
    image: node:22
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/source_mount: /app
      fibe.gg/start_command: npm test
      fibe.gg/job_watch: "true"
      fibe.gg/production: "false"

x-fibe.gg:
  metadata:
    job_mode: true
    description: "Run npm test"
    category: "CI"
```

## Related

- [Execution modes](/authoring/execution-modes/)
- [Tricks](/concepts/tricks/)
- [Common problems](/operate/common-problems/)
