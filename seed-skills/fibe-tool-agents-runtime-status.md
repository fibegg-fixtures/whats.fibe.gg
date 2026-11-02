---
name: fibe-tool-agents-runtime-status
description: Use when you need to know whether an Agent's runtime is provisioned and healthy on its Host.
---
# fibe_agents_runtime_status

Returns runtime provisioning and health information for an Agent.

## Inputs

- `agent_id_or_name`: Agent ID or name.

## Notes

- A failed runtime usually needs `fibe_doctor` or a Host check, not a new message.
