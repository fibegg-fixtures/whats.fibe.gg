---
name: fibe-tool-agents-duplicate
description: Use when the user wants a copy of an Agent with the same configuration under a new name.
---
# fibe_agents_duplicate

Duplicates an Agent's configuration, skills and mounted files. Conversations are not copied.

## Inputs

- `agent_id_or_name`: source Agent.
- `name` (optional): name of the copy.

## Notes

- Credentials bound to the source Agent are not copied.
