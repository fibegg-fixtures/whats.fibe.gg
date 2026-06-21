---
name: fibe-tool-repo-status-check
description: Use when you need to verify Fibe's current accessibility status for multiple GitHub repository URLs in one call.
---

# fibe_repo_status_check

[MODE:DIALOG] Read-only, idempotent. Tier: other.

Bulk repository status query. Up to 50 GitHub URLs at once through `POST /api/repo_status_checks`.

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
      "error": "optional reason when status is invalid or not_accessible",
      "runtime_writable": true,
      "runtime_access_source": "github_app | gitea_connection | stored_github_credentials | none",
      "runtime_access_message": "human-readable readiness guidance",
      "requires_fork": false,
      "fork_url": "optional GitHub fork URL"
    }
  ]
}
```

## Behavior
- Validates each URL, checks existing Props, Player OAuth visibility, GitHub App installation access, and runtime push access, then reports a compact status per input URL.
- `ready` means the repo already maps to one of the player's runtime-writable Props. If `runtime_writable:false` ever appears, treat it as a stale/invalid attachment that must be repaired before launch.
- `attachable` means the player's GitHub App installation can access the repo and it can be attached.
- `needs_fork` means Fibe can read the source but cannot attach it as runtime-writable yet; inspect `fork_url` and `mirrorable`, then attach a writable fork or install the GitHub App on a writable repo.
- `invalid` and `not_accessible` are not usable until the URL or access problem is fixed; inspect `error` when present.
- `requires_fork:true` means a public source should be forked or mirrored before creating a runtime-writable Playspec/Prop from it. Do not launch with read-only public Props.

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
