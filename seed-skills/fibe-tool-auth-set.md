---
name: fibe-tool-auth-set
description: Use when the local MCP session needs a different API key or server profile to talk to Fibe.
---
# fibe_auth_set

Stores an API key for the local profile used by this session. The key is never echoed back.

## Inputs

- `api_key`: key to store.
- `profile` (optional): profile name.
- `server` (optional): server URL.

## Notes

- Ask the user for the key; never invent or print keys.
