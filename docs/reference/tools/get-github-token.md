---
title: "Get Github Token"
description: "Use only when a git operation inside a Playground needs a short-lived GitHub token for a connected repository."
slug: /reference/tools/get-github-token
sidebar_label: "Get Github Token"
image: /img/og/reference-tools-get-github-token.png
keywords: ["Fibe", "Tool", "fibe", "tool", "get", "github", "token"]
tags: ["reference", "tool", "tool"]
format: md
---

Returns a short-lived, repository-scoped token for git operations.

## Inputs

- `repository`: owner/repo.

## Notes

- Never print, log or commit the token; use it only for the immediate git command.
