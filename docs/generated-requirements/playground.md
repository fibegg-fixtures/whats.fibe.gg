---
title: playground
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Fibe Core — Packs

- packs/builds : complete Core-owned BuildRecord persistence, planning, identity, execution, lifecycle, recovery, events, retention, and cleanup.

## Fibe resource lifecycles — Playground lifecycle

- A temporary Playground can have an expiration.

- A temporary Playground can have an expiration. When it falls due, if the source has uncommitted changes the Playground is parked as has changes and preserved; if it is clean, it is destroyed (containers, named volumes unless persistence is enabled, and the record).

## Fibe resource lifecycles — Automatic recovery

- Stuck launches are recovered automatically — a launch still in progress after 30 minutes is reset and retried — and a temporary infrastructure blip (network or host connectivity) is retried rather than treated as a hard failure.

## Recipe: fibe.gg/env file — Confusing twin: Compose env file

Compose env file: loads a file into the container's environment at runtime:

## Required settings — Result rules

Fibe stores the per-service exit code, completion time, and log tail in the job result so you can inspect the run after runtime containers are cleaned up.

## Cross-Cutting Limits, Flags, And User-Facing Defaults — Build Timeout: 45 Minutes; Stale In-Progress Playgrounds: 30 Minutes

Docker builds that remain in 'building' state for 45+ minutes are marked as failed with a timeout error.

Docker builds that remain in 'building' state for 45+ minutes are marked as failed with a timeout error. Playgrounds stuck in 'in progress' state for 30+ minutes are considered stale and may be auto-recovered by the system.

## Playground Lifecycle — Stale playground creation auto-recovers after 30 minutes

If a playground stays in 'in progress' status for 30+ minutes without progressing to 'running', the Playguard reconciliation job automatically recovers it by transitioning back to 'pending' and re-enqueuing the creation.

If a playground stays in 'in progress' status for 30+ minutes without progressing to 'running', the Playguard reconciliation job automatically recovers it by transitioning back to 'pending' and re-enqueuing the creation. This handles infrastructure stalls during launch.

## Playground Lifecycle — Extend expiration uses maximum of current expiration or now

When extending a playground's expiration, the system uses the maximum of the current expires at timestamp or the current time as the base, then adds the duration.

When extending a playground's expiration, the system uses the maximum of the current expires at timestamp or the current time as the base, then adds the duration. This means extending an already-expired playground adds the duration from now, not from when it expired. Default duration is 8 hours for regular playgrounds, 1 hour for job-mode playgrounds.

## Decide: zero-downtime rollouts — What to REMOVE when enabling

- Raw Compose ports: block when x-fibe.gg.metadata.preserve ports: true is set — Fibe rejects zero-downtime services with preserved host ports.

- Raw Compose ports: block when x-fibe.gg.metadata.preserve ports: true is set — Fibe rejects zero-downtime services with preserved host ports. With the default metadata, raw ports are stripped before launch.

## Decide: static vs dynamic service — The dividing line

Dynamic when fibe.gg/repo url is set on the service.

Dynamic when fibe.gg/repo url is set on the service. The label alone makes the service source-backed — even when it also names an image: and has no Compose build: block. (The repository the label points to is checked against your connected repositories in a later validation step. A repo url that can't be resolved fails that check, not the static/dynamic classification.)

## When to pick which — Choose static when

- The image already contains the runtime command (or you override via Compose command: ).

## Decide: static vs dynamic service — What about Compose build

If the input compose has build: .

If the input compose has build: . or build: context: ..., dockerfile: ... , you have a dynamic service. Convert it:

## Decide: static vs dynamic service — Common mistakes

- Setting fibe.gg/source mount without fibe.gg/repo url .

- Setting fibe.gg/source mount without fibe.gg/repo url . Validator rejects.

## Decide: static vs dynamic service — Common mistakes

- Leaving Compose build: while also setting fibe.gg/repo url — fine, but the build.context is ignored.

- Leaving Compose build: while also setting fibe.gg/repo url — fine, but the build.context is ignored. Either remove build: entirely or keep it as documentation.

## Recipe: depends on for startup ordering

depends on: controls the order Compose starts services.

depends on: controls the order Compose starts services. Fibe passes it through unchanged. Use it to:

## Recipe: depends on for startup ordering — Setup/migration pattern

A common pattern: a one-shot service that runs migrations, then exits.

A common pattern: a one-shot service that runs migrations, then exits. Other services wait for it:

## Recipe: depends on for startup ordering — Job-mode and depends on

In job-mode templates, depends on works as in Compose.

In job-mode templates, depends on works as in Compose. Watched services ( fibe.gg/job watch: "true" ) should NOT depend on each other's service completed successfully if they should run in parallel.

## Recipe: depends on for startup ordering — Pitfalls

- Compose v2 vs v3 syntax — long-form depends on works on both.

- Compose v2 vs v3 syntax — long-form depends on works on both. Avoid the v3 deprecation of the short form.

## Recipe: depends on for startup ordering — Pitfalls

- Depending on a service that has been removed from the template — Compose error.

- Depending on a service that has been removed from the template — Compose error. Audit depends on keys.

## Recipe: fibe.gg/source mount for live dev — Required labels

If fibe.gg/source mount is set but fibe.gg/repo url is missing, the validator rejects: Service ' ' has source mount but no repo url .

## Recipe: fibe.gg/source mount for live dev — Pitfalls

- fibe.gg/source mount without fibe.gg/repo url — validator hard error.

## Reference: template signals that imply runtime behavior — Dynamic source/build mode is inferred and validated

Conversely, a fibe.gg/repo url (or bare repo url ) label on its own marks a service as dynamic (source-backed), even when it specifies an image: and has no build: context or source mount — repo url is the dynamic signal.

## Marquees, Networking, And Runtime Funding — Playground TTL defaults and job mode differences

Standard Playgrounds have a default TTL of 8 hours.

Standard Playgrounds have a default TTL of 8 hours. Trick/job-mode Playgrounds default to 1 hour, and operators can change that job default. Playgrounds in in progress status longer than 30 minutes are considered stale. All runtime actions (start, stop, destroy, extend) require the Marquee to be funded.

## Decide: static vs dynamic service — The dividing line

These signals require fibe.gg/repo url and are errors without it:

## When to pick which — Choose dynamic when

- The service exists only to expose a source tree to other services.

- The service exists only to expose a source tree to other services. This is still dynamic because it has fibe.gg/repo url / fibe.gg/source mount , but it should usually use a tiny runner image and no Compose build: so it does not become a build-workflow service.

## Decide: static vs dynamic service — Source-only dynamic services

Do not add build: to this pattern just to make it "dynamic".

Do not add build: to this pattern just to make it "dynamic". fibe.gg/repo url already makes it dynamic; build: changes the workflow to build and can make Fibe try to build a repository that is only meant to be mounted.

## Recipe: depends on for startup ordering — Pitfalls

- Depending on a static service from a dynamic service's build — depends on is runtime ordering only; build happens before any runtime services exist.

## Reference: template signals that imply runtime behavior — One-off setup services (migrations/tests/maintenance)

When a template runs as a job ( x-fibe.gg.metadata.job mode: true and at least one fibe.gg/job watch: "true" service), Fibe treats the run as one-shot and applies runtime overrides:

## Reference: template signals that imply runtime behavior — Runtime-owned / stripped semantics

- Service-level ports: lines are removed from compiled output by default.

- Service-level ports: lines are removed from compiled output by default. Add them for local docker compose up if useful; they survive only when x-fibe.gg.metadata.preserve ports: true .

## Recipe: fibe.gg/env file — Confusing twin: Compose env file

code example

## Recipe: depends on for startup ordering — Three conditions

code example

## Recipe: depends on for startup ordering — DRY with anchors

code example

## Reference: template signals that imply runtime behavior — One-off setup services (migrations/tests/maintenance)

code example

## Reference: template signals that imply runtime behavior — Dynamic source/build mode is inferred and validated

code example

## Practical paths you will write — Environment scalar

code example

## Practical paths you will write — An array element

code example

## Lifecycle states

State Meaning in progress Images pulling, containers starting, healthchecks settling.

## Tricks, Jobs, Schedules, And Automation — Tricks list paginated at 20 per page; no configurable limit

The Tricks list view uses page-size limit of 20.

The Tricks list view uses page-size limit of 20. Jobs are sorted by created at descending, showing newest first. No API flag to change page size for UI views.

## Fibe resource lifecycles — Playground lifecycle

Status User-facing meaning in progress Fibe is preparing source, images, routing, and services.

Status User-facing meaning in progress Fibe is preparing source, images, routing, and services. Image builds time out after 45 minutes by default.

## Fibe resource lifecycles — Playground lifecycle

Status User-facing meaning has changes Linked source has changed and a rollout or restart may be needed.

## Fibe resource lifecycles — Agent lifecycle

Status User-facing meaning authenticated Credentials are available and valid.

## Decide: static vs dynamic service — What labels to add to a dynamic service

Concern Label Live source mount fibe.gg/source mount: /app (default)

## Recipe: depends on for startup ordering — Three conditions

Condition Means service completed successfully The dependent service has exited with status 0 (one-shot jobs)

## Recipe: fibe.gg/source mount for live dev — Required labels

Label Value fibe.gg/repo url Git repo URL (required — source mount cannot exist without a repo)

## Recipe: fibe.gg/source mount for live dev — Required labels

Label Value fibe.gg/source mount absolute path inside the container, e.g.

Label Value fibe.gg/source mount absolute path inside the container, e.g. /app

## Recipe: fibe.gg/source mount for live dev — Required labels

Label Value fibe.gg/start command the dev/watch command, NOT a production build

## Recipe: fibe.gg/source mount for live dev — Framework cheatsheet

Framework fibe.gg/start command Rails dev (plain) bin/rails server -b 0.0.0.0

## Reference: YAML path syntax for path / paths bindings — When the path does not exist

To be safe, ensure every path's parent already exists in the static portion of your template (declare the env block as an empty object if you need: environment: ).
