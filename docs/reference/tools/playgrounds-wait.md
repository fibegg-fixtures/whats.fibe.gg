---
title: "Playgrounds Wait"
description: "Use when you must wait until a Playground reaches a state such as running before continuing."
slug: /reference/tools/playgrounds-wait
sidebar_label: "Playgrounds Wait"
image: /img/og/reference-tools-playgrounds-wait.png
keywords: ["Fibe", "Tool", "fibe", "tool", "playgrounds", "wait"]
tags: ["reference", "tool", "tool"]
format: md
---

Waits until the Playground reaches the requested state or the timeout passes.

## Inputs

- `playground_id_or_name`: Playground.
- `status` (optional): defaults to running.
- `timeout` (optional).

## Notes

- On timeout, continue with `fibe_playgrounds_debug`.
