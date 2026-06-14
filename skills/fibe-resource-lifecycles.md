---
name: fibe-resource-lifecycles
description: Use to explain how Fibe resources are created, updated, launched, shared, stopped, completed, upgraded, or retired from a user-facing perspective.
---

# Fibe resource lifecycles

Use this skill when a task depends on resource state, launch order, updates, cleanup, or safe user-facing behavior.

## Marquee lifecycle

A Marquee starts as a host connection or a platform-managed tutorial request.

Typical lifecycle:

1. User adds or receives a Marquee.
2. Fibe stores connection settings and root-domain information.
3. User tests connection.
4. Marquee becomes available for Playgrounds and standalone Genie chats.
5. User may update display name, domains, TLS settings, registry credentials, or status.
6. If disabled or failing, new launches should avoid it.
7. If deleted, dependent running environments must be stopped or moved first.

Tutorial Marquees add provisioning progress, stricter cleanup, and fix-redeploy controls.

Funding and unfunded behavior:

- A paid Marquee is charged once per day from your balance — Mana for platform-managed tutorial Marquees, Sparks for self-hosted ones.
- If a charge cannot be covered, the Marquee is disabled and a grace period begins. While unfunded, runtime actions (launch, rollout, restart, diagnostics refresh, logs) fail with `MARQUEE_NOT_FUNDED`; read-only and billing views still work.
- On a self-hosted Marquee, already-running Playgrounds keep running but are no longer actively monitored, recovered, or auto-expired until funded again. On a platform-managed (tutorial) Marquee, the runtime is paused — its Playgrounds are stopped and its Genie chats are set aside, with stored data kept.
- If grace ends while still unpaid, the Marquee is suspended. A suspended, still-unpaid platform-managed Marquee can eventually be removed, and removal takes its Playgrounds, Tricks, and their data with it. A self-hosted Marquee is never deleted by Fibe; its host machine and data are untouched.
- Funding the balance (or auto-recharge) before removal settles the debt and re-enables the Marquee.

## Prop lifecycle

A Prop starts when the user creates or connects a repository.

Typical lifecycle:

1. User creates a built-in repository or imports an existing GitHub repository.
2. Fibe discovers branches and repository metadata.
3. Fibe detects useful files such as Docker Compose and example environment files.
4. Templates and dynamic services can use the Prop as source.
5. Push events refresh branches, build records, notifications, source-linked templates, and job triggers.
6. Users may commit Playground changes back to the repository from the UI.
7. Disabled or errored Props should not be used for new source-backed launches until fixed.

Props are user-scoped. Two users can connect the same repository independently.

## Template lifecycle

A Template is the reusable definition. A Template Version is the immutable launch body.

Typical lifecycle:

1. User creates, imports, forks, or discovers a Template.
2. User publishes a new Template Version with YAML, variables, metadata, and optional automation settings.
3. New launches default to the latest suitable version.
4. Existing Playspecs keep their original version until the user upgrades or switches them.
5. Source-linked Templates can publish a new version when the tracked source file changes.
6. Public versions can appear in a marketplace; private versions stay in the user's templates.
7. Forks are independent copies for customization.

Changes become new versions.

## Playspec lifecycle

A Playspec is a launch blueprint derived from a Template Version plus launch choices.

Typical lifecycle:

1. User chooses a Template, target Marquee, branch/source settings, variables, mounted files, service settings, and persistence options.
2. Fibe validates and compiles the template into a runnable environment plan.
3. The Playspec can create a Playground or Trick.
4. Playspec edits are allowed, but changes affect running Playgrounds only after rollout, restart, deploy, or reconciliation.
5. If a Playspec uses persistent volumes, warn before renaming services or volume keys because volume names tie data to service shape.
6. A Playspec can switch to another Template Version, with preview or bulk upgrade flows when available.

A Playspec that persists volumes allows only one active Playground at a time; a second concurrent launch from the same stateful Playspec is rejected so two instances cannot share the same named data.

## Playground lifecycle

A Playground is a running environment.

Common statuses:

| Status | User-facing meaning |
| --- | --- |
| `pending` | Launch was requested and is waiting to start. |
| `in_progress` | Fibe is preparing source, images, routing, and services. Image builds time out after 45 minutes by default. |
| `running` | Services are up and the Playground can be used. |
| `error` | Launch or runtime setup failed. Inspect logs and retry after fixing. |
| `has_changes` | Linked source has changed and a rollout or restart may be needed. |
| `completed` | A job-mode Playground finished. |
| `stopping` | Stop is in progress. |
| `stopped` | Services are stopped but the Playground record remains restartable. |
| `destroying` | Cleanup is in progress. |

Main actions:

- Rollout: apply changes with minimal disruption; unchanged services usually stay running.
- Restart: stop and start the whole environment; use for corrupted state or major shape changes.
- Stop: stop services while preserving the resource record.
- Destroy: remove the Playground.
- Extend expiration: keep a temporary environment alive longer.
- Retry: re-run failed creation after fixing configuration or infrastructure.
- Attach or detach Agent: add or remove Genie support.

Data safety:

- Named volumes always survive stop, start, restart, and rollout. Destroy and expiration teardown keep them only when the Playspec is stateful ("Stateful (Persist Volumes)"); otherwise they are removed.
- Restart may pull fresh images for floating tags.
- Rollout is safer for stateful support services because unchanged containers can remain running.
- Container-local files are disposable unless backed by a volume, repository, artefact, or mounted file.

Expiration:

- Default expiration is 8 hours for a regular Playground and 1 hour for a job-mode run; both defaults can be configured.
- A temporary Playground can have an expiration. When it falls due, if the source has uncommitted changes the Playground is parked as `has_changes` and preserved; if it is clean, it is destroyed (containers, named volumes unless persistence is enabled, and the record).
- Extend adds the duration to whichever is later — the current expiry or now — so extending an already-expired record counts from now. The default extension equals the mode's default expiration (8 hours regular, 1 hour job mode).
- Expiration and automatic recovery only run while the Marquee is funded.

## Trick lifecycle

A Trick is a job-mode Playground.

Typical lifecycle:

1. User launches manually, schedule fires, or VCS trigger matches.
2. Fibe starts services with job-mode constraints.
3. Watched services run until they exit.
4. If every watched service exits successfully, the Trick succeeds.
5. If any watched service exits non-zero, the Trick fails.
6. Logs and result information are captured.
7. Services are cleaned up automatically.

Use Tricks for tasks that finish. Do not use Tricks for web apps, dashboards, dev servers, or watchers that should stay alive.

Constraints and limits:

- Job-mode services run one replica with no automatic restart. Public exposure does not happen because `fibe.gg/port` and other routing labels are stripped before launch.
- A Trick has a maximum runtime of about 4 hours; if the watched service has not exited by then, the run is marked failed (timed out) and cleaned up.
- Logs and the result are kept on the Trick after success, failure, or timeout. Log capture keeps the last 5000 lines per service by default, and the result survives after the run's environment expires (1 hour by default) or is destroyed.

## Agent lifecycle

An Agent is a stored Genie configuration.

Common statuses:

| Status | User-facing meaning |
| --- | --- |
| `pending` | Created but not ready to use. |
| `authenticated` | Credentials are available and valid. |
| `expired` | Credentials need refresh. |
| `revoked` | Credentials were removed or invalidated. |
| `deleting` | Removal is in progress and the Agent should not be used for new work. |

Agents can be duplicated, configured, given mounted files, used for standalone chat and shown in Bridge.

Runtime data and naming:

- A running Genie keeps an on-Marquee workspace (chat working state and caches). Stop keeps the workspace (restart resumes); clean-up or purge permanently deletes it. Agent configuration — settings, mounted files, credentials, toggles — lives on the Agent itself and survives stop, restart, and clean-up.
- Each chat gets a stable, friendly subdomain on its Marquee, with automatic HTTPS from the Marquee's wildcard certificate. There is one live chat per Genie per Marquee; restarting reuses the same name and URL.

## Webhook lifecycle

Webhook endpoints are created with a URL, event selection, optional filters, and a signing secret. They can be tested, enabled, disabled, updated, or deleted.

Delivery attempts are recorded. Repeated failures can disable an endpoint until the user fixes the receiver.

## Secret and Job ENV lifecycle

Secrets are long-lived encrypted values. Create them for credentials that Genies or workflows need without putting values in source code or templates.

Job ENV entries apply to job-mode runs. Use global entries for every Trick and Prop-scoped entries for one repository's job runs.

## Cleanup and cascades

What deleting or disabling one resource does to others:

- Disable a Marquee: existing Playgrounds keep running (self-hosted) or are paused (platform-managed); live Genie chats are paused with their data kept; no new actions until re-enabled.
- Delete a Marquee: blocked while Playgrounds or Tricks are still attached — move or remove them first. A self-hosted Marquee's host machine is never touched.
- Delete an Agent: its Genie chats are cleaned up; Playgrounds it was attached to survive and simply lose the Agent link.
- Rotate or revoke an API key a Genie uses: running Genies that depend on it redeploy to pick up the change.
- Disable a Prop: does not stop Playgrounds, builds, or jobs already using it; it only blocks new source-backed launches until re-enabled.
- Delete a Prop: blocked while a Playspec still references it. A source-linked Template does not block deletion — it simply loses its source link.
- Cancel a subscription: a platform-managed Marquee tied to it survives as long as it stays funded.

## Automatic recovery

Fibe self-heals transient problems so users are not interrupted by blips:

- A brief outage (under a couple of minutes) is ignored; a sustained one triggers an automatic redeploy.
- A reachable environment stays viewable even if a single health check is missed; a missed health check never stops or errors a running environment.
- TLS/HTTPS provisioning surfaces a pending state, not a failure, and clears once the certificate is issued.
- Stuck launches are recovered automatically — a launch still `in_progress` after 30 minutes is reset and retried — and a temporary infrastructure blip (network or host connectivity) is retried rather than treated as a hard failure.
- Automatic recovery and expiration run only while the Marquee is funded.

## Related skills

- [fibe-product-map](fibe-product-map.md)
- [fibe-agents-and-automation](fibe-agents-and-automation.md)
- [decide-job-mode](decide-job-mode.md)
- [decide-zero-downtime](decide-zero-downtime.md)
- [recipe-named-volumes](recipe-named-volumes.md)
