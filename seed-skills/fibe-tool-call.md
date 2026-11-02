---
name: fibe-tool-call
description: Use when no dedicated tool exists and you need to call one Fibe operation directly by name.
---
# fibe_call

Calls one named Fibe operation with JSON arguments and returns its result.

## Inputs

- `operation`: operation name from `fibe_tools_catalog`.
- `arguments`: JSON object.

## Notes

- Check the operation shape with `fibe_schema` first.
