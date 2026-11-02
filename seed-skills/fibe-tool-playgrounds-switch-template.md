---
name: fibe-tool-playgrounds-switch-template
description: Use when an existing deployed Playground must move to a different Spec or Spec version, for example after changing its services.
---
# fibe_playgrounds_switch_template

Switches an existing deployed Playground to another Spec or Spec version and redeploys it in place. This is the normal tool for changing the stack or service/source shape of a running environment.

## When to use

- Adding, removing or renaming services.
- Changing labels, images, build settings or volumes of an existing Playground.
- Moving a Playground to a newer version of its Spec.

## Inputs

- `playground_id_or_name`: Playground ID or name of the deployed Playground.
- One of `template_id_or_name`, `template_version_id`, `template_body` or `repository_url`: the target Spec.
- `variables` (optional): values for template variables.
- `changelog` (optional): note stored on a newly created Spec version.

When the target uses repositories that do not exist yet, the switch provisions private Gitea repos for them, so the Playground keeps working source.

## Notes

- Volumes are kept unless the new Spec removes them.
- Use `fibe_playgrounds_wait` afterwards, then `fibe_playgrounds_debug` if services fail.
- To start a new environment instead, use `fibe_launch`.
