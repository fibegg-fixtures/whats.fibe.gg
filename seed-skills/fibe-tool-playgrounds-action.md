---
name: fibe-tool-playgrounds-action
description: Use when a Playground needs a lifecycle action: start, stop, restart, rebuild or destroy.
---
# fibe_playgrounds_action

Performs one lifecycle action on a Playground.

## Inputs

- `playground_id_or_name`: Playground.
- `action`: start, stop, restart, rebuild or destroy.
- `service` (optional).

## Notes

- Destroy needs explicit user confirmation.
