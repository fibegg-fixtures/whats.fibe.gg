---
title: "Gitea Repos Create"
description: "Use when the user wants a new private Gitea repository managed by Fibe."
slug: /reference/tools/gitea-repos-create
sidebar_label: "Gitea Repos Create"
image: /img/og/reference-tools-gitea-repos-create.png
keywords: ["Fibe", "Tool", "fibe", "tool", "gitea", "repos", "create"]
tags: ["reference", "tool", "tool"]
format: md
---

Creates a Gitea repository on the Fibe-managed git server.

## Inputs

- `name`: repository name.
- `private` (optional): defaults to true.

## Notes

- Prefer `fibe_greenfield_create` when you also want a Playground.
