---
name: fibe-tool-agents-activity
description: Use when you need the recent activity timeline of an Agent, such as tool calls, status changes and artefacts.
---
# fibe_agents_activity

Lists recent activity entries for one Agent conversation.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `limit` (optional): number of entries.

## Notes

- Prefer `fibe_agents_live_state` for the current status; activity is a history.
