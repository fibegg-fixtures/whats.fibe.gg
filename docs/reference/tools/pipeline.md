---
title: "Pipeline"
description: "Use when a task needs several Fibe operations in sequence and you want them run as one pipeline."
slug: /reference/tools/pipeline
sidebar_label: "Pipeline"
image: /img/og/reference-tools-pipeline.png
keywords: ["Fibe", "Tool", "fibe", "tool", "pipeline"]
tags: ["reference", "tool", "tool"]
format: md
---

Runs a declarative pipeline of steps, with variables and iteration.

## Inputs

- `steps`: list of operations.
- `variables` (optional).

## Notes

- Read the pipeline schema with `fibe_schema` first; results are cached for `fibe_pipeline_result`.
