---
title: Tricks
description: "A Trick runs a task and finishes: tests, migrations, backups, scheduled jobs, CI on push. Plain Compose, with Fibe enforcing one-shot rules."
slug: /concepts/tricks
sidebar_position: 8
image: /img/og/concepts-tricks.png
keywords: [Trick, job mode, scheduled job, cron, VCS trigger, CI, Job ENV, watched service]
---

A **Trick** is a one-shot Compose run with services, logs, and a terminal. Each service gets one replica, does not restart after exit, and watched-service exit codes decide success.

Use Tricks for **work that should finish**: tests, migrations, backups, scheduled jobs, CI.

## Good for

- Test suites, lint checks.
- Migrations, schema setup.
- Backups, exports.
- Data syncs, cleanups, doc builds.
- Cron jobs.
- CI on push or PR.

## Not for

- Web apps that stay reachable.
- Background workers that loop.
- Hot-reload dev servers.
- Anything that watches and never exits.

Use a Trick for finite work and a [Playground](/concepts/playgrounds/) for long-running services.

## How a Trick decides success

Mark one service as the **watched service** with `fibe.gg/job_watch: "true"`. Its exit defines the result. Zero = success. Non-zero = failure.

Repository-backed services are watched automatically. Add `fibe.gg/job_watch` to plain-image services or set it to `"false"` to exclude a repository-backed helper. Every watched service must exit 0.

Supporting services (databases, caches, queues) start alongside. When the watched service exits, Fibe stops them.

After cleanup, the Trick record keeps its status, watched-service exit codes, and the last 5,000 log lines from each watched service. Terminal lifecycle status alone does not mean success; the saved result and exit codes decide it. Removing or expiring the Trick also removes this record.

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: placeholder
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      timeout: 3s
      retries: 15
  test:
    image: node:20
    working_dir: /app
    labels:
      fibe.gg/repo_url: https://github.com/owner/repo
      fibe.gg/start_command: npm test
      fibe.gg/job_watch: "true"
    depends_on:
      db:
        condition: service_healthy

x-fibe.gg:
  metadata:
    job_mode: true
    description: "Run the test suite against Postgres"
    category: "CI"
```

## What Fibe applies

Fibe applies one-shot rules. You don't write these:

- Every service set to **one replica**.
- Every service set to `restart: no`.
- Routing and exposure labels removed: a Trick never gets a URL. Fibe's own bookkeeping labels stay on the containers as run metadata.
- Routing labels such as `fibe.gg/port` are stripped before launch.

What you write:

- A service that **actually exits** when done. No idle loops, no `sleep infinity`.
- The watched-service marker on the one whose exit decides the outcome.

## Plain Compose locally

A Trick is a Docker Compose file with Fibe additions on top. `docker compose up` runs the same file locally for debugging. The only Fibe-specific piece is the watched-service marker.

## Schedules & triggers

| Mode | Settings | Use for |
| --- | --- | --- |
| **Manual** | (none) | Click to run. |
| **Scheduled** | `schedule_config`: cron expression and target Marquee. | Daily backups, hourly syncs, weekly reports. |
| **Triggered** | `trigger_config`: event, branch, Prop, and target Marquee. | CI on push or pull request. |

A Trick can use both; every event starts a separate run.

See [Authoring → Execution modes](/authoring/execution-modes/), [`mode-schedule-cron`](/reference/mode-schedule-cron/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/).

## Job ENV: credentials for Trick runs

Tricks often need reusable credentials such as deploy tokens, API keys, and backup passwords.

Store them as **Job ENV entries**. Two scopes:

- **Global Job ENV**: available to every Trick.
- **Prop-scoped Job ENV**: applies only when the Trick is tied to that repository.

Prefer Job ENV over template variables when a credential is reused across many runs. See [Security → Secret Vault & Job ENV](/advanced/secrets/).

:::info Pull-request runs never receive secrets
Pull-request runs receive only non-secret Job ENV values because the code is untrusted. Push, scheduled, and manual runs receive both.
:::

Besides your Job ENV entries, every Trick run gets **built-in variables** describing the run: `FIBE_REPOSITORY_URL` / `FIBE_REPOSITORY_OWNER` / `FIBE_REPOSITORY_NAME`, `FIBE_BRANCH`, `FIBE_COMMIT_SHA`, `FIBE_TRIGGER_EVENT`, and ids for the Prop, the Playspec, and the run. For each source-connected service, Compose interpolation can also use `FIBE_SERVICES_<SERVICE_TOKEN>_PATH`: the on-host path of that service's checkout, where the token is the service name uppercased with non-alphanumerics replaced by `_`. Use it in the compose file (for example in a `volumes:` entry), but don't assume it is set as an environment variable inside containers.

## Example: nightly backup

Scheduled Trick that dumps a database at 03:00 UTC:

```yaml
services:
  backup:
    image: my-org/backup-tool:1.4
    environment:
      DB_URL: postgres://user:pass@db.example.com:5432/app
      S3_BUCKET: backups.example.com
    command: ["./backup-now.sh"]
    labels:
      fibe.gg/job_watch: "true"

x-fibe.gg:
  variables:
    DB_URL: {name: "Database URL", required: true, path: services.backup.environment.DB_URL}
  metadata:
    job_mode: true
    description: "Nightly database backup to S3"
    category: "Operations"
    schedule_config:
      enabled: true
      cron: "0 3 * * *"
      marquee_id: 1
```

Store `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as secret Job ENV entries. Fibe injects them without writing secrets into the Template.

## FAQ

<details>
<summary>How long can a Trick run?</summary>

A Trick can run for about four hours. At timeout, Fibe marks it Error, removes its containers, and does not collect container logs. Completed runs keep watched-service logs and exit codes; supporting-service logs are discarded.
</details>

<details>
<summary>Trick takes longer than its schedule period?</summary>

Stateless runs may overlap. Stateful runs with persisted volumes queue oldest first. Use a longer interval or an application lock when stateless runs must not overlap.
</details>

<details>
<summary>Multiple branches on one Trick?</summary>

No wildcards. One Trick per branch. Explicit configuration is clearer than wildcard surprises.
</details>

<details>
<summary>`push` vs `pull_request`?</summary>

- **push**: fires when the named branch receives a commit.
- **pull_request**: fires when a PR is opened or updated and the PR's **source branch** matches the configured branch. Code under test is the PR head.
</details>

<details>
<summary>Do triggered runs retry?</summary>

No. Each delivered event starts one run. Redeliver it for another run. Set `max_retries` in `trigger_config` to cap repeated deliveries of the same event.
</details>

<details>
<summary>My trigger turned itself off?</summary>

If the target Marquee is disabled or in error, the trigger disables itself instead of queuing a run. Re-enable it after the Marquee recovers.
</details>

<details>
<summary>Genie to debug a Trick?</summary>

Yes. A Genie can fetch run logs. Trigger settings can also send failed-exit logs to a chosen Genie. Timeouts and failures before service start do not send them; check run history instead. The Genie is not part of the watched service.
</details>

## Related

- [Playgrounds](/concepts/playgrounds/): long-running counterpart.
- [Authoring → Execution modes](/authoring/execution-modes/).
- [Security → Secret Vault & Job ENV](/advanced/secrets/).
- Reference: [`mode-job-trick`](/reference/mode-job-trick/), [`mode-schedule-cron`](/reference/mode-schedule-cron/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/), [`playbook-test-runner`](/reference/playbook-test-runner/), [`playbook-cron-scheduled`](/reference/playbook-cron-scheduled/).
