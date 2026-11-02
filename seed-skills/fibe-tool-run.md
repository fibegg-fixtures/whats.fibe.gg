---
name: fibe-tool-run
description: Use when you need to run a command inside a Playground service container.
---
# fibe_run

Runs one command in a Playground service and returns its output.

## Inputs

- `playground_id_or_name`: Playground.
- `service`: service name.
- `command`: command to run.

## Notes

- Output is bounded; redirect large output to a file.
