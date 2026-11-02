---
name: fibe-tool-agent-defaults-update
description: Use when the user wants to change default provider, model, skills or mounted files for new Agents.
---
# fibe_agent_defaults_update

Patches the default Agent configuration. Only supplied fields change.

## Inputs

- `patch`: object of default fields to change.
- `expected_revision` (optional): reject the change if defaults moved meanwhile.

## Notes

- Existing Agents keep their own settings; defaults apply to Agents created afterwards.
