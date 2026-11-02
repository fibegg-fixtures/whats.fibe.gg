---
name: fibe-tool-templates-change
description: Use only when you must edit Spec versions directly without touching any deployed Playground.
---
# fibe_templates_change

Hidden advanced primitive. Edits a Spec by creating a new version from patch edits or a full body. It does not redeploy anything.

Normal existing deployed Playground stack/source/service changes do not belong here: use `fibe_playgrounds_switch_template` with the Playground, which creates the version and redeploys in one step.

## Inputs

- `template_id_or_name`: Spec to change.
- `edits` or `template_body`: patch edits to apply, or the complete new body.
- `changelog` (optional): human-readable note for the new version.

## Notes

- Validate the body against the `fibe-template-schema-json` skill first.
- Existing Playgrounds keep running their current version until switched.
