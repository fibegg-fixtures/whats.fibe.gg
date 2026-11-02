---
title: "Agents Send Message"
description: "Send one text message to an agent chat."
slug: /reference/tools/agents-send-message
sidebar_label: "Agents Send Message"
image: /img/og/reference-tools-agents-send-message.png
keywords: ["Fibe", "Tool", "fibe", "tool", "agents", "send", "message"]
tags: ["reference", "tool", "tool"]
format: md
---

Send one text message to an agent chat.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `id_or_name` | Yes | integer or string | Agent ID or name. |
| `text` | Yes | string | Text to send to the agent. Minimum length: 1. |
| `attachment_filenames` | No | array of string | Runtime attachment filenames returned by a previous upload. Optional. |
| `attachment_paths` | No | array of string | Local file paths to upload before sending. Optional. |
| `busy_policy` | No | string | Runtime busy behavior, e.g. queue. Optional. |
| `conversation_id` | No | string | Specific conversation/thread ID. Optional. |
| `images` | No | array of string | Image payloads to send to the runtime, such as data URLs. Optional. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `output_path` | No | string | JSONPath into the tool result, not a filesystem path. Example: "$.conversations[0].uuid" returns the first UUID; "$.conversations" returns only the array. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Send text with `text` and identify the Agent with `id_or_name`. Local `attachment_paths` are uploaded before the chat request; already uploaded files use `attachment_filenames`.
- Message acceptance is asynchronous. Read messages or live state to observe the reply.

Read-only: **no**. Destructive: **no**. Idempotent: **no**. These are the released tool’s annotations; operation-specific guards still apply.
