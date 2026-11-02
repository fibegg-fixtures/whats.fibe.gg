---
name: fibe-tool-local-playgrounds-info
description: "Inspect local playground names, current link state, repo roots, URLs, mounts, or details from /opt/fibe/playgrounds or HOST_ROOT."
---
# fibe_local_playgrounds_info

Inspect local playground names, current link state, repo roots, URLs, mounts, or details from /opt/fibe/playgrounds or HOST_ROOT.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `view` | Yes | string | Output view: names, current, repos, urls, mounts, or details. Allowed: `names`, `current`, `repos`, `urls`, `mounts`, `details`. |
| `id_or_name` | No | string | Local playground ID, name, compose project, spec, or unique spec prefix. Omit for view=names. |
| `link_dir` | No | string | Current-link directory for view=current or view=repos (default: PLAYGROUNDS_DIR, then /app/playground). |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- This reads local Host files rather than querying a remote Host. Select the required `view`; local filesystem access must be enabled for the transport.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
