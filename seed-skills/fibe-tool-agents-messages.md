---
name: fibe-tool-agents-messages
description: Use when you need to read the messages of an Agent conversation.
---
# fibe_agents_messages

Lists messages of one conversation, newest last.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `conversation_id` (optional): defaults to the latest.
- `limit` (optional).

## Notes

- Message content may be long; request a small limit first.
