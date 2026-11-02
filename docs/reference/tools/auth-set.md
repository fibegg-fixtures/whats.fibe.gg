---
title: "Auth Set"
description: "Use when the local MCP session needs a different API key or server profile to talk to Fibe."
slug: /reference/tools/auth-set
sidebar_label: "Auth Set"
image: /img/og/reference-tools-auth-set.png
keywords: ["Fibe", "Tool", "fibe", "tool", "auth", "set"]
tags: ["reference", "tool", "tool"]
format: md
---

Stores an API key for the local profile used by this session. The key is never echoed back.

## Inputs

- `api_key`: key to store.
- `profile` (optional): profile name.
- `server` (optional): server URL.

## Notes

- Ask the user for the key; never invent or print keys.
