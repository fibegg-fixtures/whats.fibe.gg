---
title: "Agents Start Chat"
description: "Use when you need to start (or reconnect) an Agent chat session on the current Host. First step before sending messages."
slug: /reference/tools/agents-start-chat
sidebar_label: "Agents Start Chat"
image: /img/og/reference-tools-agents-start-chat.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "start", "chat"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:SIDEEFFECTS] Tier: overseer. Not idempotent.

Starts an Agent chat container on the Host through `POST /api/agents/:id/chats`.

The Host must be funded. Unpaid Hosts return `HOST_NOT_FUNDED`.

## When to use
- Initial bring-up of a new Agent.
- After Host was unreachable and chats fell over: reconnects to existing session when possible.
- Following `fibe_agents_runtime_status` returning `status:"missing"`.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `id_or_name` | int or string | yes | Agent ID or name |

`host_id` is read from `FIBE_HOST_ID` env: failing fast if unset.

## Output
HTTP 202 envelope describing the chat session (`pending` initially, transitions to `running` once background provisioning finishes).

## Behavior
1. Validates the Agent and its target Host.
2. Refuses if Host is not `chat_launchable` (returns `HOST_NOT_READY`).
3. Reuses an existing chat record where possible (idempotent reconnect for the same Host).
4. Enqueues background deployment when the chat is `pending`.
5. Deployment recreates the runtime with `--pull always`, so starts and restarts pick up the latest configured Agent image.

## Gotchas
- `FIBE_HOST_ID` is **required** in the Agent's environment: without it the SDK errors before sending a request.
- Host not `running` → `HOST_NOT_READY`. Unpaid Host → `HOST_NOT_FUNDED`. Bring the Host up and fund it first (`fibe_resource_mutate(resource:"host", operation:"test_connection")` then status check).
- Existing chats on a different Host are preserved; new deployment goes on the requested Host.
- Status flips async: expect `pending` during start/restart and call `fibe_agents_runtime_status` to confirm `running`.
- Authentication state is separate; the Agent may need `authenticate` before processing messages even when chat is `running`.

## Related
- `fibe_agents_runtime_status`: health check after start.
- `fibe_agents_send_message`: first-message after bring-up.
- `fibe_resource_mutate(resource:"agent", operation:"restart_chat")`: marks an existing chat `pending`, redeploys it, and replaces the old runtime when healthy.
