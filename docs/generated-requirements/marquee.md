---
title: marquee
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## What a Marquee gives you — Related

- Wallet, Mana &amp; Sparks — how you fund a Marquee.

- Wallet, Mana &amp; Sparks — how you fund a Marquee.

## Runtime errors — Scheduled job doesn't fire

Fix: Set enabled: true ; confirm the target Marquee is reachable and funded.

Fix: Set enabled: true ; confirm the target Marquee is reachable and funded.

## Decide: exposure strategy — Step 3 — Pick the subdomain

The subdomain is the leftmost label of the public host.

The subdomain is the leftmost label of the public host. Default: the service name. Override with fibe.gg/subdomain .

## Playbook: nginx static site — Root subdomain

URL becomes https:// / , no leftmost label.

URL becomes https:// / , no leftmost label.

## Recipe: fibe.gg/subdomain — How the URL is generated (Traefik)

3.

3. HTTPS router websecure matches the same Host with ACME TLS.

## Recipe: ports: → fibe.gg/port — Step-by-step

- Keep it when the same file should run locally with docker compose up ; Fibe strips it by default.

- Keep it when the same file should run locally with docker compose up ; Fibe strips it by default.

## Recipe: fibe.gg/path rule — Pitfalls

- Two services with same path rule — only one wins; you'll see flapping.

- Two services with same path rule — only one wins; you'll see flapping. Make the rules disjoint.

## Recipe: fibe.gg/subdomain — Pitfalls

- Same subdomain on multiple services without path rule — Traefik routes only one (first match).

- Same subdomain on multiple services without path rule — Traefik routes only one (first match). Add path rule to disambiguate.

## What a Marquee gives you — Routing &amp; URLs

code example

code example

## Decide: exposure strategy — Step 4 — Decide whether to share a subdomain with path rule

code example

code example

## Playbook: nginx static site — Input

code example

code example

## Playbook: nginx static site — Output (basic)

code example

code example

## Examples — One specific path, one catch-all

code example

code example

## Recipe: fibe.gg/path rule — Pattern: catch-all web + specific ws

code example

code example

## Recipe: fibe.gg/subdomain — When to use @

code example

code example

## Examples — Label fragment

code example

code example

## What a Marquee gives you — Marquee types

Action Available Limit Fix-redeploy Once provisioning has finished or failed; not while a Genie chat is live 10 attempts per 4-hour window

Action Available Limit Fix-redeploy Once provisioning has finished or failed; not while a Genie chat is live 10 attempts per 4-hour window

## What a Marquee gives you — Marquee types

Action Available Limit Reboot Once provisioned — including from error status 3 reboots per 1-hour window

Action Available Limit Reboot Once provisioned — including from error status 3 reboots per 1-hour window

## Decide: exposure strategy — Step 2 — Pick internal vs external

- fibe.gg/visibility: external — public HTTPS route via Traefik on https:// .

- fibe.gg/visibility: external — public HTTPS route via Traefik on https:// . . No additional auth from Fibe. Use for the user-facing app.

## Recipe: fibe.gg/subdomain — How the URL is generated (Traefik)

2.

2. HTTP router web entrypoint matches Host( . ) .

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "3000:3000" 3000 fibe.gg/port: 3000 + fibe.gg/visibility: external

Compose ports: form Container port Fibe label - "3000:3000" 3000 fibe.gg/port: 3000 + fibe.gg/visibility: external

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "5173" 5173 (auto host) fibe.gg/port: 5173 + fibe.gg/visibility: external

Compose ports: form Container port Fibe label - "5173" 5173 (auto host) fibe.gg/port: 5173 + fibe.gg/visibility: external

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "127.0.0.1:8000:8000" (host-loopback only) 8000 fibe.gg/port: 8000 + fibe.gg/visibility: internal (Basic Auth)

Compose ports: form Container port Fibe label - "127.0.0.1:8000:8000" (host-loopback only) 8000 fibe.gg/port: 8000 + fibe.gg/visibility: internal (Basic Auth)

## Recipe: ports: → fibe.gg/port — Mapping

Compose ports: form Container port Fibe label - "9000:9000" for an admin console 9000 fibe.gg/port: 9000 + fibe.gg/visibility: internal

Compose ports: form Container port Fibe label - "9000:9000" for an admin console 9000 fibe.gg/port: 9000 + fibe.gg/visibility: internal
