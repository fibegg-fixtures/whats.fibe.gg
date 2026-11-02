---
title: "Agent Defaults Update"
description: "Use when the user wants to change default provider, model, skills or mounted files for new Agents."
slug: /reference/tools/agent-defaults-update
sidebar_label: "Agent Defaults Update"
image: /img/og/reference-tools-agent-defaults-update.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agent", "defaults", "update"]
tags: ["reference", "tool", "tool"]
format: md
---

Patches the default Agent configuration. Only supplied fields change.

## Inputs

- `patch`: object of default fields to change.
- `expected_revision` (optional): reject the change if defaults moved meanwhile.

## Notes

- Existing Agents keep their own settings; defaults apply to Agents created afterwards.
