---
name: fibe-tool-agents-create-conversation
description: Use when you need a new conversation with an existing Agent without sending a message yet.
---
# fibe_agents_create_conversation

Creates or upserts an Agent conversation and returns its identifier.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `title` (optional): conversation title.

## Notes

- Use `fibe_agents_start_chat` when you also want to send the first message.
