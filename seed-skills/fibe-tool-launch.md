---
name: fibe-tool-launch
description: Use when the user wants to launch a new Playground from a Spec, a repository or a Compose document.
---
# fibe_launch

Launches a new Playground from a Spec, a repository URL or Compose YAML.

## Inputs

- `template_id_or_name` or `repository_url` or `template_body`.
- `name` (optional).
- `host_id_or_name` (optional).
- `variables` (optional).

## Notes

- For an existing Playground use `fibe_playgrounds_switch_template` instead of launching again.
