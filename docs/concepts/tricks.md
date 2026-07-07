---
title: Tricks
description: A Trick runs a task and finishes — tests, migrations, backups, scheduled jobs, CI on push. Plain Compose, with Fibe enforcing one-shot rules.
slug: /concepts/tricks
sidebar_position: 8
image: /img/og/concepts-tricks.png
keywords: [Trick, job mode, scheduled job, cron, VCS trigger, CI, Job ENV, watched service]
---

A **Trick** runs a task and finishes. Same shape as a Playground (Compose, services, logs, terminal) but Fibe treats it as one-shot: one replica per service, no restart on exit, exit code of the watched service decides success.

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

If the task should finish → Trick. If it should stay up → [Playground](/concepts/playgrounds/).

## How a Trick decides success

Mark one service as the **watched service** with `fibe.gg/job_watch: "true"`. Its exit defines the result. Zero = success. Non-zero = failure.

Services connected to a repository are watched automatically in a Trick — you only need the `fibe.gg/job_watch` label on services that run from a plain image, or set it to `"false"` to opt a repository-connected helper out. If more than one service is watched, the Trick succeeds only when every watched service exits 0.

Supporting services (databases, caches, queues) start alongside. When the watched service exits, Fibe stops them.

The containers don't outlive the run, but the result does: status, per-service exit codes, and the last 5,000 log lines of each watched service stay in the run's history. A terminal run status means the lifecycle finished; the saved job result and watched-service exit codes determine whether the Trick passed. The run record itself expires after 1 hour by default — the saved result goes with it.

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
      fibe.gg/source_mount: /app
      fibe.gg/start_command: npm test
      fibe.gg/job_watch: "true"   # ← Trick succeeds/fails based on this
    depends_on:
      db:
        condition: service_healthy

x-fibe.gg:
  metadata:
    job_mode: true                # ← marks the template as a Trick
    description: "Run the test suite against Postgres"
    category: "CI"
```

## What Fibe Applies

Fibe applies one-shot rules. You don't write these:

- Every service set to **one replica**.
- Every service set to `restart: no`.
- Routing and exposure labels removed — a Trick never gets a URL. Fibe's own bookkeeping labels stay on the containers as run metadata.
- Routing labels such as `fibe.gg/port` are stripped before launch — a Trick isn't there to serve traffic.

What you write:

- A service that **actually exits** when done. No idle loops, no `sleep infinity`.
- The watched-service marker on the one whose exit decides the outcome.

## Plain Compose locally

A Trick is a Docker Compose file with Fibe additions on top. `docker compose up` runs the same file locally for debugging. The only Fibe-specific piece is the watched-service marker.

## Schedules & triggers

| Mode | Settings | Use for |
| --- | --- | --- |
| **Manual** | (none) | Click to run. |
| **Scheduled** | `schedule_config` — cron expression + target Marquee. | Daily backups, hourly syncs, weekly reports. |
| **Triggered** | `trigger_config` — event (`push` or `pull_request`), branch, the Prop the repo is connected through, and the target Marquee. | CI on every push, PR test runs. |

Combine both. A Trick can be scheduled and triggered — each event fires its own run.

See [Authoring → Execution modes](/authoring/execution-modes/), [`mode-schedule-cron`](/reference/mode-schedule-cron/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/).

## Job ENV — credentials for Trick runs

Tricks often need credentials the launcher shouldn't supply each time — deploy tokens, API keys, backup passwords.

Store them as **Job ENV entries**. Two scopes:

- **Global Job ENV** — available to every Trick.
- **Prop-scoped Job ENV** — applies only when the Trick is tied to that repository.

Prefer Job ENV over template variables when a credential is reused across many runs. See [Security → Secret Vault & Job ENV](/advanced/secrets/).

:::info Pull-request runs never receive secrets
Runs triggered by a pull request get only **non-secret** Job ENV values — PR code is untrusted, so secret entries are withheld. Push-triggered, scheduled, and manual runs receive both.
:::

Besides your Job ENV entries, every Trick run gets **built-in variables** describing the run: `FIBE_REPOSITORY_URL` / `FIBE_REPOSITORY_OWNER` / `FIBE_REPOSITORY_NAME`, `FIBE_BRANCH`, `FIBE_COMMIT_SHA`, `FIBE_TRIGGER_EVENT`, and ids for the Prop, the Playspec, and the run. For each source-connected service, Compose interpolation can also use `FIBE_SERVICES_<SERVICE_TOKEN>_PATH` — the on-host path of that service's checkout, where the token is the service name uppercased with non-alphanumerics replaced by `_`. Use it in the compose file (for example in a `volumes:` entry), but don't assume it is set as an environment variable inside containers.

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

The AWS credentials don't go through template variables at all: create **Job ENV entries** named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (marked secret) and they're injected into the run's environment directly — nothing secret is written into the template.

## FAQ

<details>
<summary>How long can a Trick run?</summary>

A Trick has a maximum runtime of about **4 hours**. If the watched service hasn't exited by then, the run is marked as an **error** (timed out) and the containers are torn down. On success or failure, the exit codes and logs of the watched service(s) are saved to the Trick's history. Logs of supporting services (databases, caches) are not kept after the run — capture anything you need from them in the watched service's output. A timed-out run is kept in the history as an error — it shows as "Error" rather than "Failed" in the run list — and its container logs are not collected.
</details>

<details>
<summary>Trick takes longer than its schedule period?</summary>

Overlapping runs result — unless the Trick is **Stateful (Persist Volumes)**, in which case runs queue and execute one at a time, oldest first. For stateless Tricks, make the period longer than the max job time or guard with a lock inside the job. Fibe doesn't otherwise deduplicate scheduled runs.
</details>

<details>
<summary>Multiple branches on one Trick?</summary>

No wildcards. One Trick per branch. Explicit configuration is clearer than wildcard surprises.
</details>

<details>
<summary>`push` vs `pull_request`?</summary>

- **push** — fires when the named branch receives a commit.
- **pull_request** — fires when a PR is opened or updated and the PR's **source branch** matches the configured branch. Code under test is the PR head.
</details>

<details>
<summary>Do triggered runs retry?</summary>

Not on their own — one delivered event, one run. Re-deliver the event (push again, or re-send the webhook from your Git host) for a fresh run. By default there's no retry cap; set `max_retries` in `trigger_config` to refuse re-deliveries of the same event past that count.
</details>

<details>
<summary>My trigger turned itself off?</summary>

If the target Marquee is disabled or in an error state when an event arrives, the trigger disables itself rather than queueing runs that can't start. It doesn't re-enable itself — turn it back on once the Marquee is active again.
</details>

<details>
<summary>Genie to debug a Trick?</summary>

Yes. A Genie can fetch a Trick's run logs with its tools and help you debug. For triggered Tricks you can also pick a Genie in the trigger settings — when a run finishes with a failing exit code, its failure logs are sent to that Genie automatically. Runs that time out or fail before the services start don't trigger the notification — check the run's history for those. The Trick itself runs on its own — a Genie isn't part of the watched service.
</details>

## Related

- [Playgrounds](/concepts/playgrounds/) — long-running counterpart.
- [Authoring → Execution modes](/authoring/execution-modes/).
- [Security → Secret Vault & Job ENV](/advanced/secrets/).
- Reference: [`mode-job-trick`](/reference/mode-job-trick/), [`mode-schedule-cron`](/reference/mode-schedule-cron/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/), [`playbook-test-runner`](/reference/playbook-test-runner/), [`playbook-cron-scheduled`](/reference/playbook-cron-scheduled/).
