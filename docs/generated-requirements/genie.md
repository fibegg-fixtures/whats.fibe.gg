---
title: genie
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## - Per-provider defaults — apply to new Genies of a specific provider…

- Per-provider defaults — apply to new Genies of a specific provider (Claude, Gemini, OpenCode, etc.) and override the general default.

- Per-provider defaults — apply to new Genies of a specific provider (Claude, Gemini, OpenCode, etc.) and override the general default.

## Configure a Genie

- Provider — Gemini, Antigravity, Claude Code, OpenAI Codex, Cursor, OpenCode.

- Provider — Gemini, Antigravity, Claude Code, OpenAI Codex, Cursor, OpenCode.

## Artefacts, mutters, feedback — Mutter

- "Healthcheck flapping.

- "Healthcheck flapping. start period is probably too short."

## fibe agent defaults update — Input Schema

code example

code example

## fibe agents activity — Input Schema

code example

code example

## fibe agents create conversation — Input Schema

code example

code example

## fibe agents delete conversation — Input Schema

code example

code example

## fibe agents send message — Input Schema

code example

code example

## API reference — Authentication

code example

code example

## API reference — Response shapes

code example

code example

## API reference — Response shapes

code example

code example

## fibe agent defaults get — Description

[MODE:DIALOG] Read the authenticated player's agent default overrides.

[MODE:DIALOG] Read the authenticated player's agent default overrides.

## fibe agent defaults reset — Description

[MODE:SIDEEFFECTS] Clear all player agent default overrides so admin defaults apply.

[MODE:SIDEEFFECTS] Clear all player agent default overrides so admin defaults apply.

## fibe agent defaults update — Description

[MODE:SIDEEFFECTS] Replace the authenticated player's agent default overrides.

[MODE:SIDEEFFECTS] Replace the authenticated player's agent default overrides. Use the same agent defaults JSON shape as the profile UI.

## fibe agents live state — Description

[MODE:OVERSEER] Check conversation-scoped agent live stream state.

[MODE:OVERSEER] Check conversation-scoped agent live stream state.

## fibe agents messages — Description

[MODE:OVERSEER] Read agent messages, optionally scoped to a conversation.

[MODE:OVERSEER] Read agent messages, optionally scoped to a conversation.

## fibe auth set — Description

[MODE:SIDEEFFECTS] Configure session-scoped authentication credentials for multi-tenant setups in case you have to work with multiple FIBE API KEY+FIBE DOMAIN combinations

[MODE:SIDEEFFECTS] Configure session-scoped authentication credentials for multi-tenant setups in case you have to work with multiple FIBE API KEY+FIBE DOMAIN combinations

## fibe resource get — Description

[MODE:DIALOG] Get a supported Fibe resource by ID, name, or key where supported.

[MODE:DIALOG] Get a supported Fibe resource by ID, name, or key where supported. Playground reads include service urls and service runtime status. Use artefact attachment or agent attachment to download attached runtime file content.

## Description

Account-wide defaults for new Genies — CLI version, system prompt, environment, MCP servers, mounted files, post-init.

Account-wide defaults for new Genies — CLI version, system prompt, environment, MCP servers, mounted files, post-init.

## API reference — Authentication

GET /api/me returns the current API identity and the scopes attached to the token.

GET /api/me returns the current API identity and the scopes attached to the token.

## API reference — Response shapes

Parameter Default Maximum Notes per page 25 100 Page size.

Parameter Default Maximum Notes per page 25 100 Page size.

## API reference — Response shapes

Conversation, live-state, and queued-turn endpoints that talk to a live Genie return 422 with a code explaining why delivery failed: AGENT RUNTIME NOT RUNNING (the Genie has no running session), AGENT RUNTIME UNREACHABLE (the session can't be reached), or AGENT RUNTIME ERROR (the session returned an unexpected error).

Conversation, live-state, and queued-turn endpoints that talk to a live Genie return 422 with a code explaining why delivery failed: AGENT RUNTIME NOT RUNNING (the Genie has no running session), AGENT RUNTIME UNREACHABLE (the session can't be reached), or AGENT RUNTIME ERROR (the session returned an unexpected error). The details object carries the agent (and conversation) involved.

## API reference — Response shapes

Sending a chat message to a Genie fails with 422 and code AGENT COMMUNICATION FAILED ; the message text gives the reason — AGENT BUSY means the Genie is mid-turn (retry later, or resend with the queue busy policy to add it as a queued turn), NEED AUTH means the Genie's provider credentials need re-authentication.

Sending a chat message to a Genie fails with 422 and code AGENT COMMUNICATION FAILED ; the message text gives the reason — AGENT BUSY means the Genie is mid-turn (retry later, or resend with the queue busy policy to add it as a queued turn), NEED AUTH means the Genie's provider credentials need re-authentication.

## Configure a Genie — Credentials and status

- Provider API key or credential bundle — paste provider credentials for that Genie.

- Provider API key or credential bundle — paste provider credentials for that Genie.
