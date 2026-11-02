---
title: "Launch"
description: "Use when the user wants to launch a new Playground from a Spec, a repository or a Compose document."
slug: /reference/tools/launch
sidebar_label: "Launch"
image: /img/og/reference-tools-launch.png
keywords: ["Fibe", "Tool", "fibe", "tool", "launch"]
tags: ["reference", "tool", "tool"]
format: md
---

Launches a new Playground from a Spec, a repository URL or Compose YAML.

## Inputs

- `template_id_or_name` or `repository_url` or `template_body`.
- `name` (optional).
- `host_id_or_name` (optional).
- `variables` (optional).

## Notes

- For an existing Playground use `fibe_playgrounds_switch_template` instead of launching again.
