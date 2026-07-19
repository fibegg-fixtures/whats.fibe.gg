---
title: Before you publish
description: A checklist for templates that will appear in the Bazaar. Walk it once before you click publish; re-walk it on major updates.
slug: /operate/publishing
sidebar_position: 2
image: /img/og/operate-publishing.png
keywords: [publish, Bazaar, checklist, quality, template review, security]
---

A checklist for templates that will appear in the [Bazaar](/concepts/playspecs/#templates). Walk it once before you click publish; re-walk it on major updates.

The goal is to make sure that someone clicking your Template in the Bazaar gets a successful launch — first try — without having to read your mind.

:::tip Publishing is per-version
Each version has its own **Make public** toggle: drafts stay private next to published versions, and unpublishing one version leaves the rest alone. A public version is live for everyone immediately — no review queue — which is why this checklist comes first. Details: [Publish to the Bazaar](/concepts/bazaar/#publish-to-the-bazaar).
:::

## Personal vs Fibe-maintained listings

For a Template you own, publishing a version means setting that version public. The public version is visible to you and launchable by others immediately.

Fibe-maintained catalog entries have an extra gate: the version must be public, approved, and backed by source mirrors that are ready to launch. When Fibe staff approve a player-owned Template for the maintained catalog, that approved version becomes a Fibe-maintained listing instead of staying attached to the original player account.

## The basics

- The YAML parses cleanly.
- The root has a `services:` map.
- The template validates and a preview launch succeeds.
- The template would start on a plain Docker host if you supplied equivalent env values yourself.

## Service modeling

- Static services use `image:` only.
- Dynamic services declare `fibe.gg/repo_url`.
- Repository-backed services have a sensible absolute `working_dir`.
- Databases, caches, and queues use named volumes — never host paths.
- Use `depends_on` wherever startup order matters, but expect the app to retry transient failures.
- No fixed `container_name`, especially on services with rolling updates.

## Labels & routing

- No unrecognized `fibe.gg/` labels.
- Boolean labels written as quoted `"true"` / `"false"`.
- Exposure values are lowercase; ports in valid range or supplied via a variable.
- Public HTTP goes through `fibe.gg/port`, never Compose `ports:`.
- Custom subdomain only when the default isn't right.
- Path rules use only path matchers — no host, header, method, query, or client-IP rules.
- Internal-only services use `fibe.gg/visibility: internal` with `fibe.gg/port: PORT` for Basic Auth protection.

## Rolling updates (only if eligible)

- The service is exposed.
- It speaks HTTP and supports multi-replica concurrency.
- It has a real HTTP healthcheck endpoint.
- No fixed container name, no Compose `ports:`.
- Realistic healthcheck values — timeout shorter than interval, start period long enough for actual boot.

## Variables

- Every variable has a clear display name.
- Defaults are safe — pasteable into a fresh launch as-is.
- Validation patterns are slash-wrapped.
- Whole-value bindings use `path:` or `paths:`; inline is for fragments only.
- No real secrets in `default:`. Use `random: true` for generated values; use the Secret Vault for external credentials.
- No hardcoded passwords anywhere — in environment values, config files, or scripts.
- Every `$$var__` reference has a declaration; no unused declarations.

## Metadata

- The description explains what the template launches and who it's for.
- The category is broad enough to be discoverable.
- The cover image (optional, but it helps discovery) is JPEG, PNG, SVG, or WebP and under 500 KB by default — see [Limits & Quotas](/advanced/limits/).
- Execution settings (`job_mode`, schedule, trigger) only appear when they apply.
- For triggered templates, the event type is `push` or `pull_request`.

## Runtime quality

- Web services bind to `0.0.0.0` inside the container.
- Dev templates use watch / dev commands — and the description says so.
- Production templates avoid source mounts unless intentional.
- Required env values come from defaults, variables, env files, or platform secrets — never from "the launcher knows".
- Migrations and one-time setup are explicit (a dedicated `setup` service or built into the app's command).
- Healthchecks don't depend on external internet.
- Images pinned to a stable tag — no `:latest` in production templates.

## Security rejects

:::caution Don't publish a template that…
- Publicly exposes admin consoles without authentication. Use `fibe.gg/visibility: internal` with `fibe.gg/port: PORT` if there's no built-in auth.
- Hardcodes real secrets, customer-specific paths, or private URLs.
- Mounts the Docker socket.
- Runs privileged containers without a documented reason.
- Requires non-generic host paths like `/data/...` or `/mnt/...`.
- Publishes non-HTTP ports for external access — Fibe routing is HTTPS.
:::

## Frequent slip-ups

- Compose `ports:` left in instead of `fibe.gg/port`.
- An uppercase `External` in the exposure value.
- `yes` / `on` / `1` used in place of `"true"`.
- A host matcher inside a path rule.
- Variables referenced but never declared, or declared and never used.
- Expecting container env values to drive labels — labels are read before the container starts.
- Rolling updates enabled on a stateful singleton like Postgres.

## After you publish

- Test a launch from a clean account with a fresh Marquee. Required variables should be honest about what the launcher must provide.
- Capture screenshots as artefacts (with a mutter noting the result) so collaborators browsing the timeline can see what success looks like.
- Plan a refresh cadence — pinned image tags drift, and a template that worked a year ago may need a touch-up.

## Related

- [Templates](/concepts/playspecs/#templates) — Template versioning + how publishing works.
- [Authoring → Service labels](/authoring/service-labels/) — the rules being checked.
- [Common problems](/operate/common-problems/) — what to do when something fails.
- [`fibe templates` CLI](/sdk/cli-reference/) — managing templates from the command line.
- [`fibe greenfield`](/sdk/workflows/) — one-call automation for full-stack setup.
- Reference: [`templates-publish-checklist`](/reference/templates-publish-checklist/) — the skill version of this checklist.
