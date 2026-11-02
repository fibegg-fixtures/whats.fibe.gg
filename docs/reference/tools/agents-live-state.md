---
title: "Agents Live State"
description: "Use when you need the current status of an Agent: idle, running, waiting for input or failed."
slug: /reference/tools/agents-live-state
sidebar_label: "Agents Live State"
image: /img/og/reference-tools-agents-live-state.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "live", "state"]
tags: ["reference", "tool", "tool"]
format: md
---

Returns the live state of an Agent and its current run.

## Inputs

- `agent_id_or_name`: Agent ID or name.

## Notes

- Poll sparingly; prefer `fibe_monitor_follow` for streams.
