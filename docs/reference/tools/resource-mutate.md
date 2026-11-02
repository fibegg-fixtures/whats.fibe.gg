---
title: "Resource Mutate"
description: "Use when you need to create or update a Fibe resource that has no dedicated tool."
slug: /reference/tools/resource-mutate
sidebar_label: "Resource Mutate"
image: /img/og/reference-tools-resource-mutate.png
keywords: ["Fibe", "Tool", "fibe", "tool", "resource", "mutate"]
tags: ["reference", "tool", "tool"]
format: md
---

Creates or updates one resource with a JSON payload.

## Inputs

- `resource`: resource type.
- `operation`: create or update.
- `id_or_name` (update only).
- `payload`: JSON object.

## Notes

- Check the operation shape with `fibe_schema` before mutating.
