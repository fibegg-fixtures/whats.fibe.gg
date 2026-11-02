---
title: "Agents Send Message"
description: "Use when you need to send a message to an existing Agent conversation."
slug: /reference/tools/agents-send-message
sidebar_label: "Agents Send Message"
image: /img/og/reference-tools-agents-send-message.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "send", "message"]
tags: ["reference", "tool", "tool"]
format: md
---

Sends one user message to an Agent conversation and returns the accepted message.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `message`: text to send.
- `conversation_id` (optional).
- `attachment_paths` (optional): files to attach.

## Notes

- The reply arrives asynchronously; read it with `fibe_agents_messages`.
