---
name: fibe-tool-playgrounds-wait
description: Use when you must wait until a Playground reaches a state such as running before continuing.
---
# fibe_playgrounds_wait

Waits until the Playground reaches the requested state or the timeout passes.

## Inputs

- `playground_id_or_name`: Playground.
- `status` (optional): defaults to running.
- `timeout` (optional).

## Notes

- On timeout, continue with `fibe_playgrounds_debug`.
