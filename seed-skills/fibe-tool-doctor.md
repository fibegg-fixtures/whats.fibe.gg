---
name: fibe-tool-doctor
description: "Run self-diagnostic checks: verify API key, connectivity, and display user profile"
---
# fibe_doctor

Run self-diagnostic checks: verify API key, connectivity, and display user profile

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

This tool takes no input fields.

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Inspects the configured client environment and API connectivity. Run it against your own installation origin.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
