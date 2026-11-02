---
name: fibe-tool-greenfield-create
description: Use when the user wants to start a brand-new project: repository, Spec and Playground in one step.
---
# fibe_greenfield_create

Creates a new repository from a starter, a Spec for it and optionally launches a Playground.

## Inputs

- `name`: project name.
- `provider` (optional): github or gitea.
- `template_id_or_name` (optional): starter Spec.

## Notes

- Gitea greenfield repositories are private by default.
