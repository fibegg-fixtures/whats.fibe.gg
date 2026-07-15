---
title: playspec
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## A nine-step path for taking an existing docker-compose.yml and turnin…

A nine-step path for taking an existing docker-compose.yml and turning it into a Fibe template.

A nine-step path for taking an existing docker-compose.yml and turning it into a Fibe template. The result is still valid Docker Compose — you can docker compose up it locally — plus the Fibe additions that make it launchable on a Marquee.

## The nine steps — 1 — Classify each service

Static services: postgres:17 , redis:8 , nginx:alpine .

Static services: postgres:17 , redis:8 , nginx:alpine . Use the image directly.

## The nine steps — 2 — Resolve build

A Compose build: block becomes a dynamic service.

A Compose build: block becomes a dynamic service. Replace it with the fibe.gg/repo url label and any related build settings (Dockerfile path, branch, target stage, build args).

## The nine steps — 4 — Drop incompatible keys

Remove container name to avoid cross-Playground name collisions on the same Marquee.

Remove container name to avoid cross-Playground name collisions on the same Marquee. Fibe strips hostname: automatically. Keep depends on , volumes , environment , healthcheck , networks , and restart as-is.

## Templates — Source-linked Templates — the strongest pattern

- A specific file path (usually docker-compose.yml at the repo root).

## Templates — source defaults

Inside a Template's metadata, set source defaults: true .

Inside a Template's metadata, set source defaults: true . Launching the Template from a Prop then auto-fills the repo URL and branch into dynamic services and any trigger config .

## Conversion steps — Step 2 — Resolve build: into Fibe labels

If the service has a build: block, you have a dynamic service.

If the service has a build: block, you have a dynamic service. Add fibe.gg/repo url + (optional) fibe.gg/dockerfile , fibe.gg/branch , fibe.gg/build target , fibe.gg/build args , fibe.gg/source mount .

## Conversion steps — Step 4 — Strip Compose keys that Fibe forbids or owns

Remove container name and hostname: lines (compiler strips hostname: automatically; container name is surfaced as an error when combined with fibe.gg/zerodowntime ).

Remove container name and hostname: lines (compiler strips hostname: automatically; container name is surfaced as an error when combined with fibe.gg/zerodowntime ). Keep everything else ( depends on , volumes , environment , healthcheck , networks , restart ) — pass-through.

## Hard errors — Always remove container name

Setting a literal container name: blocks replicas, breaks rolling updates, and provides no benefit.

Setting a literal container name: blocks replicas, breaks rolling updates, and provides no benefit. Just remove it.

## Recipe: strip Compose keys Fibe owns or rewrites — Keys that pass through (just stay)

- env file: (a Compose feature, not the same as fibe.gg/env file )

## Recipe: strip Compose keys Fibe owns or rewrites — Keys that pass through (just stay)

- healthcheck: (Compose-level; used for depends on ordering)

## Keys that need adjustment — Host-path bind mounts ( ./local:/in/container )

The exception is fibe.gg/source mount — Fibe injects the source-tree bind mount automatically when fibe.gg/repo url is set.

The exception is fibe.gg/source mount — Fibe injects the source-tree bind mount automatically when fibe.gg/repo url is set. See recipe-source-mount.

## Conversion steps — Step 1 — Classify every service

The signal is the fibe.gg/repo url label.

The signal is the fibe.gg/repo url label. A Compose build: block requires fibe.gg/repo url . So does fibe.gg/source mount .

## Description

Use to know which Compose keys to delete or rewrite when converting to a Fibe template - ports , container name , hostname , host-path bind mounts, and Compose-only directives that conflict with Fibe routing/scaling.

## Keys that need adjustment — build

If present, also add fibe.gg/repo url .

If present, also add fibe.gg/repo url . Fibe replaces runtime build context with the cloned source path for that repo. Optionally remove build: entirely and use only labels:

## The nine steps — 3 — Route HTTP with fibe.gg/port

code example

## Convert any docker-compose.yml into a Fibe Compose template — Minimum viable conversion

code example

## Recipe: fibe.gg/build args and fibe.gg/build target — fibe.gg/build args

code example

## Recipe: fibe.gg/build args and fibe.gg/build target — Variable interpolation

code example

## Recipe: fibe.gg/build args and fibe.gg/build target — Pitfalls

code example

## Keys that need adjustment — Host-path bind mounts ( ./local:/in/container )

code example

## Recipe: strip Compose keys Fibe owns or rewrites — Worked example

code example

## The nine steps — 3 — Route HTTP with fibe.gg/port

For services that need a URL, add fibe.gg/port .

For services that need a URL, add fibe.gg/port . Fibe handles HTTPS routing and gives you a clean URL. Compose ports: may stay in the file for local docker compose up ; Fibe strips raw host bindings by default before launch.

## The nine steps — 7 — Pick the execution mode

Shape Add this Trick fibe.gg/job watch: "true" on the watched service + x-fibe.gg.metadata.job mode: true .

## The nine steps — 7 — Pick the execution mode

Shape Add this Scheduled (Trick settings) + metadata.schedule config .

## The nine steps — 7 — Pick the execution mode

Shape Add this Triggered (Trick settings) + metadata.trigger config .

## Pick the shape first — Quick cheatsheet

Intent Add these labels / settings Build from your repository fibe.gg/repo url (optionally fibe.gg/dockerfile , fibe.gg/branch )

## Pick the shape first — Quick cheatsheet

Intent Add these labels / settings Live-edit dev mode fibe.gg/repo url + fibe.gg/source mount: /app + fibe.gg/start command + fibe.gg/production: "false"

## Pick the shape first — Quick cheatsheet

Intent Add these labels / settings One-shot Trick fibe.gg/job watch: "true" on the watched service + x-fibe.gg.metadata.job mode: true

## Conversion steps — Step 3 — Route HTTP with fibe.gg/port

User-facing HTTP is always fibe.gg/port .

User-facing HTTP is always fibe.gg/port . Compose ports: may remain for local docker compose up , but Fibe strips raw host bindings by default and does not use them for public traffic. Traefik routing comes from the label.

## Convert any docker-compose.yml into a Fibe Compose template — Minimum viable conversion

That gives you a public HTTP route under the Marquee root domain at subdomain web (the default — service name).

That gives you a public HTTP route under the Marquee root domain at subdomain web (the default — service name). Add fibe.gg/subdomain to override.

## Convert any docker-compose.yml into a Fibe Compose template — "Just give me the labels I need" cheatsheet

Intent Add these labels Build from my repo fibe.gg/repo url , optional fibe.gg/dockerfile , fibe.gg/branch

## Convert any docker-compose.yml into a Fibe Compose template — "Just give me the labels I need" cheatsheet

Intent Add these labels Live-edit dev mode fibe.gg/repo url , fibe.gg/source mount: /app , fibe.gg/start command , fibe.gg/production: "false"

## Convert any docker-compose.yml into a Fibe Compose template — "Just give me the labels I need" cheatsheet

Intent Add these labels One-shot job that defines success fibe.gg/job watch: "true" on the watched service + x-fibe.gg.metadata.job mode: true

## Convert any docker-compose.yml into a Fibe Compose template — After conversion

- Run fibe schema(resource: "compose", operation: "validate", payload: "compose yaml": "..." ) from MCP.

- Run fibe schema(resource: "compose", operation: "validate", payload: "compose yaml": "..." ) from MCP. Always validate authored YAML this way — never infer labels from old playgrounds or remembered examples; unknown fibe.gg/ labels fail.

## Recipe: strip Compose keys Fibe owns or rewrites — Hard errors

Compose key Status Why container name: rejected when paired with fibe.gg/zerodowntime: "true" Container names must be unique across replicas
