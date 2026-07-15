---
title: marquee
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## What a Marquee gives you — Related

- Wallet, Mana &amp; Sparks — how you fund a Marquee.

## Runtime errors — Scheduled job doesn't fire

Fix: Set enabled: true ; confirm the target Marquee is reachable and funded.

## Runtime errors — Long-running template gets restart: "no" and replicas: 1

You accidentally set job mode: true on a long-running template.

You accidentally set job mode: true on a long-running template. The runtime forces these on job-mode.

## Runtime errors — Long-running template gets restart: "no" and replicas: 1

Fix: Remove job mode: true from x-fibe.gg.metadata , and from any root-level mirror if present.

## Recipe: ports: → fibe.gg/port — Step-by-step

- Keep it when the same file should run locally with docker compose up ; Fibe strips it by default.

## Recipe: fibe.gg/path rule — Pitfalls

- Two services with same path rule — only one wins; you'll see flapping.

- Two services with same path rule — only one wins; you'll see flapping. Make the rules disjoint.

## Recipe: fibe.gg/subdomain — Pitfalls

- Same subdomain on multiple services without path rule — Traefik routes only one (first match).

- Same subdomain on multiple services without path rule — Traefik routes only one (first match). Add path rule to disambiguate.

## What a Marquee gives you — Routing &amp; URLs

code example

## Decide: exposure strategy — Step 4 — Decide whether to share a subdomain with path rule

code example

## Playbook: nginx static site — Input

code example

## Playbook: nginx static site — Output (basic)

code example

## Examples — One specific path, one catch-all

code example

## Recipe: fibe.gg/path rule — Pattern: catch-all web + specific ws

code example

## Recipe: fibe.gg/subdomain — When to use @

code example

## Recipe: fibe.gg/subdomain — Sharing a subdomain with path rule

code example

## Examples — Label fragment

code example

## What a Marquee gives you — Marquee types

Action Available Limit Fix-redeploy Once provisioning has finished or failed; not while a Genie chat is live 10 attempts per 4-hour window

## What a Marquee gives you — Marquee types

Action Available Limit Reboot Once provisioned — including from error status 3 reboots per 1-hour window

## Schema and label-parser errors — Service ' ': invalid path rule ' ' — must contain a valid Traefik path matcher

path rule must contain at least one of Path( , PathPrefix( , PathRegexp( .

## Decide: exposure strategy — Step 2 — Pick internal vs external

- fibe.gg/visibility: external — public HTTPS route via Traefik on https:// .

- fibe.gg/visibility: external — public HTTPS route via Traefik on https:// . . No additional auth from Fibe. Use for the user-facing app.

## Recipe: fibe.gg/subdomain — How the URL is generated (Traefik)

2. HTTP router web entrypoint matches Host( . ) .

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "3000:3000" 3000 fibe.gg/port: 3000 + fibe.gg/visibility: external

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "8080:80" 80 fibe.gg/port: 80 + fibe.gg/visibility: external

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "5173" 5173 (auto host) fibe.gg/port: 5173 + fibe.gg/visibility: external

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "127.0.0.1:8000:8000" (host-loopback only) 8000 fibe.gg/port: 8000 + fibe.gg/visibility: internal (Basic Auth)

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "9000:9000" for an admin console 9000 fibe.gg/port: 9000 + fibe.gg/visibility: internal
