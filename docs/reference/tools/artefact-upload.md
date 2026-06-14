---
title: "Artefact Upload"
description: "Use when you need to upload an Artefact (file/report/plan/result) for the current Agent. Persists to Fibe and mirrors into FIBE_WORKSPACE_PATH if set."
slug: /reference/tools/artefact-upload
sidebar_label: "Artefact Upload"
image: /img/og/reference-tools-artefact-upload.png
keywords: ["Fibe", "Tool", "fibe", "tool", "artefact", "upload"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:SIDEEFFECTS] Tier: base. Not idempotent.

Creates an Artefact with attached content for the current or selected Agent through a multipart `POST /api/agents/:agent_id/artefacts`.

When `FIBE_WORKSPACE_PATH` is set, the same content is also written into that directory under `<workspace>/<filename>` so the Player can see it in their local workspace.

## When to use
- Player asks for a deliverable (report, plan, summary doc, generated file).
- Long-form output that doesn't fit a mutter.
- Capturing tool output for later download/review.

## When NOT to use
- Short progress updates — use `fibe_mutter`.
- Persistent data the agent will reuse — that's a Memory (`fibe_memorize`) not an Artefact.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Display name (alias `title`); also used as filename fallback |
| `filename` | string | no | Target filename; defaults to `name` |
| `description` | string | no | Human description |
| `content_base64` | string | no | Base64 file bytes (alias `content`) |
| `content_path` | string | no | Absolute local FS path (local MCP only) |
| `body` | string | no | Inline text/body content |
| `content_text` | string | no | Alias for inline text/body content |
| `agent_id_or_name` | int or string | no | Target Agent override; defaults to `FIBE_AGENT_ID` |
| `playground_id_or_name` | int or string | no | Optional Playground tag |
| `skill` | string | no | Optional skill/source label |
| `skill_enabled` | bool | no | Whether this artefact should be exposed as skill material |

`name` is the only required field. File bytes can come from `content_base64`, `content_path`, `body`, or `content_text`; when no explicit content is provided, the upload is created with the available metadata/body fallback. `agent_id_or_name` takes precedence over `FIBE_AGENT_ID`.

## Output
The created Artefact JSON, including its `id`, attached file URL hint, content type, and `agent_id`.

## Behavior
1. Resolves `agent_id_or_name` or falls back to `FIBE_AGENT_ID`.
2. Picks `filename` (explicit > `name`).
3. Decodes file source (base64 → bytes, `content_path`, or inline `body`/`content_text`).
4. If `FIBE_WORKSPACE_PATH` set:
   - Cleans filename (rejects path traversal / absolute paths).
   - Writes content to `<workspace>/<filename>`.
   - Re-creates the reader from in-memory bytes for the upload.
5. Uploads the file to the artefact endpoint as a multipart request.

## Filename safety
- `..` segments rejected.
- Absolute paths rejected.
- Subdirectories OK (`reports/2026-q1.md` writes under `<workspace>/reports/...`).

## Output download
To later read the file content, use `fibe_resource_get(resource:"artefact_attachment", id_or_name:<artefact_id>)` — returns base64.

## Gotchas
- `FIBE_AGENT_ID` env is required only when `agent_id_or_name` is omitted; missing identity then fails immediately.
- `content_base64` and `content_path` are mutually exclusive in practice (only one is read; base64 wins if both set).
- `body`/`content_text` are useful for report-style artefacts where there is no local file to read.
- Without explicit `filename`, the artefact's filename equals `name` — make `name` filesystem-safe if you rely on this.
- `content_path` only works on local MCP transport — fails on remote-served MCP.
- Workspace writes use `0644`/`0755` permissions; existing files are overwritten silently.

## Related
- `fibe_resource_get(resource:"artefact_attachment")` — download the file.
- `fibe_resource_list(resource:"artefact")` — discover existing artefacts.
- `fibe_mutter` — short-form alternative.
