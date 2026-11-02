---
title: "Memorize"
description: "Create or update agent-generated memories grounded in one local source conversation."
slug: /reference/tools/memorize
sidebar_label: "Memorize"
image: /img/og/reference-tools-memorize.png
keywords: ["Fibe", "Tool", "fibe", "tool", "memorize"]
tags: ["reference", "tool", "tool"]
format: md
---

Create or update agent-generated memories grounded in one local source conversation.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

| Input | Required | Type | Meaning |
| --- | --- | --- | --- |
| `content` | Yes | string | Durable memory text. Minimum length: 1. |
| `conversation_id` | Yes | string | Stable local source conversation UUID. This is not a server database ID. Minimum length: 1. |
| `agent_id_or_name` | No | integer or string | Optional Fibe Agent ID or name that created the memory. fibe_memorize fills this from FIBE_AGENT_ID when available. |
| `confidence` | No | number | Confidence from 0 to 1. Minimum: 0. Maximum: 1. |
| `groundings` | No | array of object | Proof references into normalized messages or raw provider events. Nested fields are defined in the linked JSON schema. |
| `memory_key` | No | string | Optional exact idempotency key. Omit this and the server computes one from content, tags, conversation_id, and groundings. |
| `metadata` | No | object | Optional memory metadata. |
| `only` | No | array of string | Fields to keep in each result item. Example: ["uuid","title","project"]. Envelope metadata remains. |
| `tags` | No | array of string | Memory tags. The server normalizes tags to lowercase slug-like strings. |

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- `conversation_id` is the local source conversation UUID, not a server row ID. The SDK reads that conversation locally and attaches its archive.
- Use `memory_key` for an explicit memory identity; `groundings` can link the memory to normalized messages or raw events.

Read-only: **no**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
