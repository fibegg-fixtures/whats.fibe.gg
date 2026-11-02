---
name: fibe-tool-monitor-follow
description: Use when you need to follow live events, such as Agent messages, activity or artefacts, for a while.
---
# fibe_monitor_follow

Streams monitor events for selected types until a timeout.

## Inputs

- `types` (optional): message, activity, mutter, artefact.
- `timeout` (optional).

## Notes

- Use `fibe_monitor_list` for a snapshot.
