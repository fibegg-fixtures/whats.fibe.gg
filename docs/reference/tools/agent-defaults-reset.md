---
title: "Agent Defaults Reset"
description: "Clear all player agent default overrides so admin defaults apply."
slug: /reference/tools/agent-defaults-reset
sidebar_label: "Agent Defaults Reset"
image: /img/og/reference-tools-agent-defaults-reset.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agent", "defaults", "reset"]
tags: ["reference", "tool", "tool"]
format: md
---

Clear all player agent default overrides so admin defaults apply.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

This tool takes no input fields.

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Clears personal overrides so installation defaults apply. Read the defaults again after resetting.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
