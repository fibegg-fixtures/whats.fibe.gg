---
name: fibe-tool-pipeline
description: "Execute multiple tool calls in one round trip and pass results between them with JSONPath bindings. Use it to reduce round trips when creating and waiting for jobs."
---
# fibe_pipeline

Execute multiple tool calls in one round trip and pass results between them with JSONPath bindings. Use it to reduce round trips when creating and waiting for jobs.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `steps` | Yes | array of object | Ordered list of steps to execute. Each step is one of: &#123;"id": "&lt;step_id&gt;", "tool": "&lt;tool_name&gt;", "args": &#123;...&#125;&#125;              (single tool call) &#123;"parallel": [&lt;step&gt;, &lt;step&gt;, ...]&#125;                                   (independent concurrent steps) &#123;"id": "&lt;step_id&gt;", "for_each": "$.list", "as": "item", "steps": [&lt;step&gt;, ...], "collect": "$.something"&#125;                   (fanout) Args may contain JSONPath references starting with "$.", resolved against the map of prior step outputs. Nested fields are defined in the linked JSON schema. |
| `cache` | No | boolean | Set to false to skip caching this pipeline's result (default: true) |
| `dry_run` | No | boolean | Validate refs + schemas without executing |
| `idempotency_key` | No | string | Optional key threaded through destructive steps for retry safety |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `return` | No | string | Optional JSONPath or object spec to project the final return |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Steps can call tools, group independent steps with `parallel`, or iterate with `for_each`. References beginning with `$.` resolve against prior step outputs.
- Use `dry_run` to validate references and schemas. Each actual tool invocation retains its authorization and confirmation requirements.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
