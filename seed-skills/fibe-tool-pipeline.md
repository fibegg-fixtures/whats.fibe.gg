---
name: fibe-tool-pipeline
description: Use when a task needs several Fibe operations in sequence and you want them run as one pipeline.
---
# fibe_pipeline

Runs a declarative pipeline of steps, with variables and iteration.

## Inputs

- `steps`: list of operations.
- `variables` (optional).

## Notes

- Read the pipeline schema with `fibe_schema` first; results are cached for `fibe_pipeline_result`.
