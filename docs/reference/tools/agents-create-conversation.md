---
title: "Agents Create Conversation"
description: "Use when you need a new conversation with an existing Agent without sending a message yet."
slug: /reference/tools/agents-create-conversation
sidebar_label: "Agents Create Conversation"
image: /img/og/reference-tools-agents-create-conversation.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "create", "conversation"]
tags: ["reference", "tool", "tool"]
format: md
---

Creates or upserts an Agent conversation and returns its identifier.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `title` (optional): conversation title.

## Notes

- Use `fibe_agents_start_chat` when you also want to send the first message.
