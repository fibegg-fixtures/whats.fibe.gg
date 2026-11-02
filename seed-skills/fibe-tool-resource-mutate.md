---
name: fibe-tool-resource-mutate
description: Use when you need to create or update a Fibe resource that has no dedicated tool.
---
# fibe_resource_mutate

Creates or updates one resource with a JSON payload.

## Inputs

- `resource`: resource type.
- `operation`: create or update.
- `id_or_name` (update only).
- `payload`: JSON object.

## Notes

- Check the operation shape with `fibe_schema` before mutating.
