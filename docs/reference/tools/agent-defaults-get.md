---
title: "Agent Defaults Get"
description: "Use when you need to read the installation or Team default Agent configuration before creating or changing an Agent."
slug: /reference/tools/agent-defaults-get
sidebar_label: "Agent Defaults Get"
image: /img/og/reference-tools-agent-defaults-get.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agent", "defaults", "get"]
tags: ["reference", "tool", "tool"]
format: md
---

Returns the effective default Agent settings: provider, model, enabled skills, mounted files and prompt defaults.

## Inputs

- `scope` (optional): personal or Team owner of the defaults.

## Notes

- Read before `fibe_agent_defaults_update` so an update starts from current values.
