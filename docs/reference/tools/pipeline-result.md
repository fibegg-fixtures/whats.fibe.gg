---
title: "Pipeline Result"
description: "Look up a cached result from an earlier pipeline execution."
slug: /reference/tools/pipeline-result
sidebar_label: "Pipeline Result"
image: /img/og/reference-tools-pipeline-result.png
keywords: ["Fibe", "Tool", "fibe", "tool", "pipeline", "result"]
tags: ["reference", "tool", "tool"]
format: md
---

Look up a cached result from an earlier pipeline execution.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `pipeline_id` | Yes | string | ID returned by a prior fibe_pipeline call |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `path` | No | string | Optional JSONPath. Rooted at step bindings; falls back to full response for "$.status" / "$.error" etc. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Use the returned `pipeline_id` to read a cached result; the release’s pipeline cache has a five-minute result TTL. `path` can select part of that result.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
