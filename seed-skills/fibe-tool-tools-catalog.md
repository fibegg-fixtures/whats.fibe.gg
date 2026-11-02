---
name: fibe-tool-tools-catalog
description: "List every registered Fibe MCP tool, including hidden tools that cannot all be advertised directly."
---
# fibe_tools_catalog

List every registered Fibe MCP tool, including hidden tools that cannot all be advertised directly.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `include_schema` | No | boolean | Include input schemas (larger response) |
| `name_pattern` | No | string | Substring to match in tool name or description |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `tier` | No | string | Filter by named tool tier or shortcut. core means meta, base, greenfield, and brownfield; full/all means every tier. Allowed: `meta`, `base`, `greenfield`, `brownfield`, `overseer`, `local`, `other`, `core`, `full`, `all`. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Set `include_schema: true` to return exact input contracts, including hidden tools. `tier` and `name_pattern` narrow the results.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
