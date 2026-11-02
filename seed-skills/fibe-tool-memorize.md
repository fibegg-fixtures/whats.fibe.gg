---
name: fibe-tool-memorize
description: Use when you learn a durable fact about the user's project that future Agent runs should know.
---
# fibe_memorize

Stores a memory entry with tags and optional groundings.

## Inputs

- `content`: the fact.
- `tags` (optional).
- `idempotency_key` (optional).

## Notes

- Never store secrets as memories.
