---
title: Data Backup
description: Export your account data or import from a backup file.
slug: /advanced/backup
sidebar_position: 11
keywords: [backup, export, import, data portability]
---

Export account data or import from a backup file.

## Export

You choose which resource types to include. The export can cover:

- Props (definitions, not the repos themselves).
- Marquees (definitions, not the host content).
- Playspecs (the blueprints).
- Genies with their configuration.
- Playgrounds (the records, not running containers or volumes).
- Templates with their versions.
- Secrets (names and descriptions only — values are never exported, so there is no passphrase).
- Webhook endpoints (URL and event subscriptions; signing secrets are excluded and regenerated on import).

What's **not** in the export: profile settings, API keys, and the audit log. Logs, artefacts, mutters, and conversations aren't included either.

The export is a single JSONL file you download when ready — optionally get an email when it's done.

## Import

Import validates the file and your quotas, then applies changes while showing live progress — there is no dry-run preview. Two conflict strategies:

- **Update existing records** — matching resources are updated from the file.
- **Skip existing records** — only resources that don't exist yet are created. Existing ones untouched.

Nothing is wiped. If the result isn't what you wanted, use **Rollback** — a completed import can be rolled back, which removes everything that import created.

## Running an export

Exports run on demand from the Data Backup page. Tick **"Email me when the export is ready"** if you don't want to wait, then download the file from the task history while the download is available — 24 hours by default, after which the link expires and the file is purged.

## Related

- [Audit log](/advanced/audit-log/) — not part of the export; use the dashboard filters to investigate history.
- [Secret Vault](/advanced/secrets/) — names and descriptions export; values never do.
