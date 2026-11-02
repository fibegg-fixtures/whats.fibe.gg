---
name: fibe-tool-agent-defaults-get
description: "Read the authenticated player's agent default overrides."
---
# fibe_agent_defaults_get

Read the authenticated player's agent default overrides.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

This tool takes no input fields.

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Reads the authenticated account’s personal overrides; it does not select a Team scope.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
