---
name: fibe-tool-agent-defaults-get
description: Use when you need to read the installation or Team default Agent configuration before creating or changing an Agent.
---
# fibe_agent_defaults_get

Returns the effective default Agent settings: provider, model, enabled skills, mounted files and prompt defaults.

## Inputs

- `scope` (optional): personal or Team owner of the defaults.

## Notes

- Read before `fibe_agent_defaults_update` so an update starts from current values.
