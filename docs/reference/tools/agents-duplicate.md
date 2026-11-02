---
title: "Agents Duplicate"
description: "Use when the user wants a copy of an Agent with the same configuration under a new name."
slug: /reference/tools/agents-duplicate
sidebar_label: "Agents Duplicate"
image: /img/og/reference-tools-agents-duplicate.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "duplicate"]
tags: ["reference", "tool", "tool"]
format: md
---

Duplicates an Agent's configuration, skills and mounted files. Conversations are not copied.

## Inputs

- `agent_id_or_name`: source Agent.
- `name` (optional): name of the copy.

## Notes

- Credentials bound to the source Agent are not copied.
