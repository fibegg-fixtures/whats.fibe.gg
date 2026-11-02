---
name: fibe-tool-agents-live-state
description: Use when you need the current status of an Agent: idle, running, waiting for input or failed.
---
# fibe_agents_live_state

Returns the live state of an Agent and its current run.

## Inputs

- `agent_id_or_name`: Agent ID or name.

## Notes

- Poll sparingly; prefer `fibe_monitor_follow` for streams.
