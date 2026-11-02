---
name: fibe-tool-logs-follow
description: Use when you need to stream logs of a Playground service while reproducing a problem.
---
# fibe_logs_follow

Streams service logs until the timeout or line limit is reached.

## Inputs

- `playground_id_or_name`: Playground.
- `service` (optional): service name.
- `timeout` (optional).

## Notes

- Prefer `fibe_playgrounds_logs` for a one-off tail.
