---
name: fibe-tool-agents-interrupt
description: Use when an Agent run must stop, for example when it is looping or the user changed their mind.
---
# fibe_agents_interrupt

Interrupts the active run of an Agent conversation.

## Inputs

- `agent_id_or_name`: Agent ID or name.
- `conversation_id` (optional): conversation to interrupt.

## Notes

- The conversation stays available; send a new message to continue.
