---
name: fibe-tool-agents-delete-conversation
description: Use only when the user explicitly asks to delete an Agent conversation.
---
# fibe_agents_delete_conversation

Deletes one conversation and its stored messages.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `conversation_id`: conversation to delete.
- `confirm`: must be true.

## Notes

- Deletion cannot be undone.
