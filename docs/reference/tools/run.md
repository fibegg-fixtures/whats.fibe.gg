---
title: "Run"
description: "Last-resort escape hatch: invoke an arbitrary Fibe CLI command when no dedicated MCP tool fits. Use sparingly."
slug: /reference/tools/run
sidebar_label: "Run"
image: /img/og/reference-tools-run.png
keywords: ["Fibe", "Tool", "fibe", "tool", "run"]
tags: ["reference", "tool", "tool"]
format: md
---

Last-resort escape hatch: invoke an arbitrary Fibe CLI command when no dedicated MCP tool fits. Use sparingly.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `args` | Yes | array of string | Command args as if typed after `fibe`. Scalar items (string, number, boolean) are accepted and stringified into CLI tokens in-order. |
| `confirm` | No | boolean | Required for destructive CLI commands unless server runs with --yolo. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |
| `timeout_ms` | No | number | Optional per-call timeout in milliseconds. Recommended for risky escape-hatch calls. Minimum: 1. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Runs the Fibe CLI using the supplied `args` tokens. It is an escape hatch for CLI operations, not a shell command inside a Playground.
- Prefer a dedicated tool when available. Destructive CLI operations retain the confirmation gate.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
