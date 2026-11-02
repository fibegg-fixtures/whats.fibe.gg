---
title: "Status"
description: "Show resource counts, quotas, and rate limits for the account."
slug: /reference/tools/status
sidebar_label: "Status"
image: /img/og/reference-tools-status.png
keywords: ["Fibe", "Tool", "fibe", "tool", "status"]
tags: ["reference", "tool", "tool"]
format: md
---

Show resource counts, quotas, and rate limits for the account.

This guide uses the released SDK **v0.3.3** input contract. The installation’s Native API routes and authorization determine which server operations are available.

## Inputs

This tool takes no input fields.

The [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.

## Notes

- Reads the configured account’s server-reported dashboard information. It does not prove that remote workloads are healthy.

Read-only: **yes**. Destructive: **no**. Idempotent: **yes**. These are the released tool’s annotations; operation-specific guards still apply.
