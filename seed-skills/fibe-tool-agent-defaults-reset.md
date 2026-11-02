---
name: fibe-tool-agent-defaults-reset
description: Use only when the user asks to discard customised Agent defaults and return to the shipped defaults.
---
# fibe_agent_defaults_reset

Resets Agent defaults for the selected owner to the installation baseline.

## Inputs

- `scope` (optional): personal or Team owner of the defaults.
- `confirm`: must be true.

## Notes

- This is destructive for customised defaults; confirm with the user first.
