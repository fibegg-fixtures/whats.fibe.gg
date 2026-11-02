---
title: "Agents Runtime Status"
description: "Use when you need to know whether an Agent's runtime is provisioned and healthy on its Host."
slug: /reference/tools/agents-runtime-status
sidebar_label: "Agents Runtime Status"
image: /img/og/reference-tools-agents-runtime-status.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "runtime", "status"]
tags: ["reference", "tool", "tool"]
format: md
---

Returns runtime provisioning and health information for an Agent.

## Inputs

- `agent_id_or_name`: Agent ID or name.

## Notes

- A failed runtime usually needs `fibe_doctor` or a Host check, not a new message.
