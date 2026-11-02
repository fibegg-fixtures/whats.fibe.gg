---
name: fibe-tool-artefact-upload
description: Use when you need to publish a file produced during work, such as a report, screenshot or build output, as an artefact.
---
# fibe_artefact_upload

Uploads a file as an artefact owned by the current Agent or user.

## Inputs

- `file_path` or content: the file to upload.
- `name` (optional): display name.
- `agent_id_or_name` (optional).

## Notes

- Never upload secrets or credential files.
