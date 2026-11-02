---
name: fibe-tool-resource-delete
description: Use only when the user explicitly asks to delete a Fibe resource.
---
# fibe_resource_delete

Deletes one resource by type and identifier.

## Inputs

- `resource`: resource type.
- `id_or_name`: resource identifier.
- `confirm`: must be true.

## Notes

- Deletion may be irreversible; confirm first.
