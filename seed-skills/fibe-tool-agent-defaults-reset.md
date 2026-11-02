---
name: fibe-tool-agent-defaults-reset
description: "Clear all player agent default overrides so admin defaults apply."
---
# fibe_agent_defaults_reset

Clear all player agent default overrides so admin defaults apply.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

This tool takes no input fields.

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Clears personal overrides so installation defaults apply. Read the defaults again after resetting.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
