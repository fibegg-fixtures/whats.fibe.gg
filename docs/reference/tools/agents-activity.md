---
title: "Agents Activity"
description: "Use when you need the recent activity timeline of an Agent, such as tool calls, status changes and artefacts."
slug: /reference/tools/agents-activity
sidebar_label: "Agents Activity"
image: /img/og/reference-tools-agents-activity.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "activity"]
tags: ["reference", "tool", "tool"]
format: md
---

Lists recent activity entries for one Agent conversation.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `limit` (optional): number of entries.

## Notes

- Prefer `fibe_agents_live_state` for the current status; activity is a history.
