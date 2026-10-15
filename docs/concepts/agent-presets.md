---
title: Agent Presets
description: Personal authored starter configurations and independent recipient agents.
slug: /concepts/agent-presets
sidebar_position: 9
image: /img/og/concepts-agent-presets.png
keywords: [Agent Preset, revision, capture, recipient, setup]
---

An Agent Preset is a personal reusable starter configuration in Bazaar and Library. Save a private immutable revision, review it, then publish the selected revision. The web provides capture, history, publish/unpublish, remix and recipient creation.

Capture includes authored provider/model settings, prompts/options and explicitly selected file/skill bytes. It excludes provider credentials, keys, Vault references, conversations, checkouts, runtime images, volumes, ENV-pack materialization and prior completion output. Review deliberate prose and assets before publication; structural validation cannot find every secret an author types into prose.

Recipients provide required inputs and their own authentication. Secret inputs may bind only to ENV or MCP authentication. Scripts receive explicit `FIBE_PRESET_INPUT_<NAME>` environment values; input values are not interpolated into shell source. Vault selectors must belong to the recipient context and are copied once into separately encrypted bindings.

A recipient may create an independent Personal or Team Agent after authority, quotas and authentication checks. The copy keeps concrete authored values, including empty strings/maps and false flags, independently of later author/default edits. Platform-managed images, limits, entitlement and recipient resource authority remain live. ENV-pack selections stay separate from the authored preset.

Unpublishing revokes public revision/asset access without removing an independent copy. Republishing starts a new publication epoch with only the explicitly selected revision. Retrying a create request reuses its scoped idempotency result; conflicting reuse fails.

Setup reports pending, running, succeeded or failed. A failed or timed-out script remains failed. Retry runs the preserved recipient script under a new fenced attempt. No script means no setup is required. Setup output is not part of the preset capture.

The authoring API is `/api/agent_presets` with read/write scopes. Recipient creation uses `/api/agents` with a preset revision, declared input/authentication bindings and a scoped idempotency key. V1 preset authorship is personal; Team service accounts may create recipient Agents from public sources.
