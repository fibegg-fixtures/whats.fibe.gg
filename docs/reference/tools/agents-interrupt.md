---
title: "Agents Interrupt"
description: "Use when an Agent run must stop, for example when it is looping or the user changed their mind."
slug: /reference/tools/agents-interrupt
sidebar_label: "Agents Interrupt"
image: /img/og/reference-tools-agents-interrupt.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "interrupt"]
tags: ["reference", "tool", "tool"]
format: md
---

Interrupts the active run of an Agent conversation.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `conversation_id` (optional): conversation to interrupt.

## Notes

- The conversation stays available; send a new message to continue.
