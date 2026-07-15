---
title: genie
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## API reference — Authentication

code example

## API reference — Response shapes

code example

## Per-provider defaults — apply to new Genies of a specific provider (C…

- Per-provider defaults — apply to new Genies of a specific provider (Claude, Gemini, OpenCode, etc.) and override the general default.

## Configure a Genie

- Provider — Gemini, Antigravity, Claude Code, OpenAI Codex, Cursor, OpenCode.

## Artefacts, mutters, feedback — Mutter

- "Healthcheck flapping.

- "Healthcheck flapping. start period is probably too short."

## Description

Account-wide defaults for new Genies — CLI version, system prompt, environment, MCP servers, mounted files, post-init.

## API reference — Response shapes

Parameter Default Maximum Notes per page 25 100 Page size.

## API reference — Response shapes

Conversation, live-state, and queued-turn endpoints that talk to a live Genie return 422 with a code explaining why delivery failed: AGENT RUNTIME NOT RUNNING (the Genie has no running session), AGENT RUNTIME UNREACHABLE (the session can't be reached), or AGENT RUNTIME ERROR (the session returned an unexpected error).

Conversation, live-state, and queued-turn endpoints that talk to a live Genie return 422 with a code explaining why delivery failed: AGENT RUNTIME NOT RUNNING (the Genie has no running session), AGENT RUNTIME UNREACHABLE (the session can't be reached), or AGENT RUNTIME ERROR (the session returned an unexpected error). The details object carries the agent (and conversation) involved.

## API reference — Response shapes

Sending a chat message to a Genie fails with 422 and code AGENT COMMUNICATION FAILED ; the message text gives the reason — AGENT BUSY means the Genie is mid-turn (retry later, or resend with the queue busy policy to add it as a queued turn), NEED AUTH means the Genie's provider credentials need re-authentication.

## Configure a Genie — Credentials and status

- Provider API key or credential bundle — paste provider credentials for that Genie.
