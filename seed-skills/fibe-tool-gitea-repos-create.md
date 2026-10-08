---
name: fibe-tool-gitea-repos-create
description: Use when you need to create a new repo on the Player's connected Gitea (managed or external) and atomically register it as a Fibe Repository.
---

# fibe_gitea_repos_create

[MODE:GREENFIELD] Tier: greenfield. Not idempotent.

Creates a Gitea repository AND a Repository pointing at it through `POST /api/gitea_repositories`. Default greenfield git provider (used by `fibe_greenfield_create` when `git_provider` is unset).

## When to use
- Default flow for Greenfield: GitHub OAuth not required.
- Player wants a repo on the platform's managed Gitea.
- Need a fresh Repository bound to that repo immediately (vs `fibe_github_repos_create` which leaves Repository creation to a follow-up).
- Brownfield switch-template flows where a new source-mounted service needs real files before first rollout. For multiple new services, call this through `fibe_pipeline` so repos are created in one round-trip, then seed/commit/push all new repos before `fibe_playgrounds_switch_template`.

## When NOT to use
- Player explicitly wants GitHub: use `fibe_github_repos_create` + `repository.attach`.
- Already have an external repo: use `repository.mirror` or `repository.attach`.
- You only need empty repos for switch-template and do not need to write source before rollout: let `fibe_playgrounds_switch_template` provision missing Gitea Repositories with `provision_inputs` instead.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Repository name |
| `private` | bool | no | Default `false` |
| `auto_init` | bool | no | Init with README |
| `description` | string | no | Repo description |

## Auth
Requires a Gitea connection on the Player's account with a non-empty access token. Fibe returns `GITEA_CONNECTION_REQUIRED` if missing.

## Output
```json
{
  "name": "demo",
  "full_name": "fibegg/demo",
  "html_url": "https://gitea.fibegg.local/fibegg/demo",
  "clone_url": "...",
  "default_branch": "main",
  "private": false,
  "repo": { ... },           // alias for the same structure
  "repository": { "id": 17, "name":"demo", "repository_url":"...", "provider":"gitea", ... },
  "repository_id": 17
}
```

## Behavior
1. Create repo via Gitea API.
2. Normalize the URL and check if a Repository already exists for it.
3. If exists: return existing Repository (de-dup).
4. Otherwise create a new Repository owned by the current player and link via `player_resources`.

## Gotchas
- Idempotency-Key supported. A retry with the same key returns the cached prior response, even on failure.
- Name collision returns `VALIDATION_FAILED`.
- Gitea API errors surface as `GITEA_API_ERROR` with the upstream message.
- The Repository is owned by the Player who triggered creation, not the Gitea owner: they may differ when a player has external Gitea credentials.
- Cannot re-target an existing Repository: if a duplicate URL exists, the existing Repository is returned untouched.

## Related
- `fibe_github_repos_create`: GitHub variant (no atomic Repository creation).
- `fibe_resource_mutate(resource:"repository", ...)`: attach/mirror/sync existing repos.
- `fibe_greenfield_create`: calls this internally as default `git_provider`.
