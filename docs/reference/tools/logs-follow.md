---
title: "Logs Follow"
description: "Use when you need to stream logs of a Playground service while reproducing a problem."
slug: /reference/tools/logs-follow
sidebar_label: "Logs Follow"
image: /img/og/reference-tools-logs-follow.png
keywords: ["Fibe", "Tool", "fibe", "tool", "logs", "follow"]
tags: ["reference", "tool", "tool"]
format: md
---

Streams service logs until the timeout or line limit is reached.

## Inputs

- `playground_id_or_name`: Playground.
- `service` (optional): service name.
- `timeout` (optional).

## Notes

- Prefer `fibe_playgrounds_logs` for a one-off tail.
