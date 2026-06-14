---
title: "Repo Status Check"
description: "Use when you need to verify Fibe's current accessibility status for multiple GitHub repository URLs in one call."
slug: /reference/tools/repo-status-check
sidebar_label: "Repo Status Check"
image: /img/og/reference-tools-repo-status-check.png
keywords: ["Fibe", "Tool", "fibe", "tool", "repo", "status", "check"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:DIALOG] Read-only, idempotent. Tier: other.

Bulk repository status query. Up to 50 GitHub URLs at once through `POST /api/repo_status`.

## When to use
- Pre-flight before `prop.attach` for a list of repos.
- Diagnosing why a Prop sync fails (repo inaccessible, invalid URL, or installation no longer covers it).
- Bulk audit: "do I still have access to all my Props' repos?"

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `github_urls` | array of string | yes | Up to 50 URLs; extras truncated |

## Output
```json
{
  "repos": [
    {
      "url": "https://github.com/org/repo",
      "status": "invalid | ready | attachable | needs_fork | mirrorable | not_accessible",
      "error": "optional reason when status is invalid or not_accessible"
    }
  ]
}
```

## Behavior
- Validates each URL, checks existing Props and GitHub App access, and reports a compact status per input URL.
- `ready` means the repo already maps to one of the player's Props.
- `attachable` means the player's GitHub App installation can access the repo and it can be attached.
- `mirrorable` means no installation is available, but the source repo is public and can be mirrored.
- `needs_fork` means an installation exists but does not currently cover the source; inspect `fork_url` and `mirrorable`.
- `invalid` and `not_accessible` are not usable until the URL or access problem is fixed; inspect `error` when present.

## Gotchas
- Maximum 50 URLs — extras are dropped silently. Pre-chunk if you have more.
- The result's order matches the input order.
- Empty `github_urls` returns `{repos: []}`.
- This is read-only — does not mint tokens or modify state.
- URLs must be GitHub URLs; Gitea URLs are rejected.

## Related
- `fibe_find_github_repos` — discovery.
- `fibe_get_github_token` — once you've confirmed access.
- `fibe_resource_mutate(resource:"prop", operation:"sync")` — fix accessible-but-stale repos.
