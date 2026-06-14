---
title: "Agents Duplicate"
description: "Use when you need to duplicate an existing Agent's provider, auth material, and runtime settings. Overseer tool — operates on managed Agents."
slug: /reference/tools/agents-duplicate
sidebar_label: "Agents Duplicate"
image: /img/og/reference-tools-agents-duplicate.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "duplicate"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:OVERSEER] Idempotent. Tier: overseer.

Creates a copy of an Agent's configuration through `POST /api/agents/:id/copies`.

## When to use
- Cloning a tuned Agent for parallel evaluation.
- Spawning a sibling Agent with different runtime params.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `id_or_name` | int or string | yes | Agent ID or name |

## Output
The new Agent's full JSON, including a fresh `id`/`name` and copied provider/auth/settings data.

## Behavior
- Copies provider, status, credentials, Fibe API key reference, and settings, including mounted-file metadata stored in settings, after removing generated agent password and syscheck state.
- Does NOT copy build-in-public column state, build-in-public Playground links, agent-default cascade state, chat history, mutters, artefacts, feedbacks, or active chat sessions.
- New Agent has inherited auth material from the source Agent, but no running runtime session.

## Gotchas
- The new Agent has no `agent_chats` — `start_chat` first if you want runtime interaction.
- Runtime files represented in copied settings are applied on first chat; verify any referenced uploaded artefacts are still accessible before relying on them.
- Quota counted: counts against the player's max-agents quota.
- The duplicate starts from the generic `Untitled` name; rename it after creation if you need a specific label.

## Related
- `fibe_agents_start_chat` — bring the duplicate online.
- `fibe_resource_get(resource:"agent")` — inspect the original.
- `fibe_resource_mutate(resource:"agent", operation:"create")` — start from scratch only when provider auth is already planned.
