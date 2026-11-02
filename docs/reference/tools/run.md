---
title: "Run"
description: "Use when you need to run a command inside a Playground service container."
slug: /reference/tools/run
sidebar_label: "Run"
image: /img/og/reference-tools-run.png
keywords: ["Fibe", "Tool", "fibe", "tool", "run"]
tags: ["reference", "tool", "tool"]
format: md
---

Runs one command in a Playground service and returns its output.

## Inputs

- `playground_id_or_name`: Playground.
- `service`: service name.
- `command`: command to run.

## Notes

- Output is bounded; redirect large output to a file.
