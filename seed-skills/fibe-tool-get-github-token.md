---
name: fibe-tool-get-github-token
description: Use when you need the server-provided GitHub credential for a specific repository. Enterprise resolves an App installation; standalone Core returns its configured credential.
---

# fibe_get_github_token

[MODE:SIDEEFFECTS] Tier: other. Idempotent within the returned refresh lease.

Returns the server-provided GitHub credential for `<owner>/<repo>` through `GET /api/github_token?repo=<owner/repo>`. Enterprise resolves the current Player's matching GitHub App installation and returns a short-lived installation token. Standalone Core returns its single configured `GITHUB_TOKEN`.

## When to use
- Need to clone or push a repository using the credential selected by the connected Fibe server.
- Issuing a one-off `git push` outside of the SDK's flow.
- GitHub API access permitted by the returned credential.

## When NOT to use
- You need a specific credential kind. Enterprise returns an App token; Core returns its configured stable token.
- Pure Fibe API access — that's `FIBE_API_KEY`, not a GitHub token.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `repo` | string | yes | Full repo name `owner/name` |

## Output
```json
{
  "token": "...",
  "expires_in": 3000
}
```

## Behavior
1. Validates the `owner/repository` input.
2. Enterprise looks up the current Player's matching GitHub App installation and mints or reuses its short-lived token.
3. Standalone Core returns its configured process credential without contacting GitHub. `expires_in` is a client refresh lease; repeated requests may return the same token.

## Gotchas
- Re-fetch before `expires_in`; do not infer the underlying token's expiry from this lease.
- Enterprise installation tokens have App-defined permissions and are not the Player's OAuth token.
- Core has no installation or player scope. Any holder of its administrative `FIBE_API_KEY` can retrieve the host-wide token, and rotation requires replacing the Core container with updated ENV.
- Enterprise can return `GITHUB_INSTALLATION_NOT_FOUND` or `GITHUB_TOKEN_ERROR`. Core returns `GITHUB_TOKEN_NOT_CONFIGURED` when its ENV credential is blank.

## Related
- `fibe_find_github_repos` — Enterprise repository discovery; unsupported in standalone Core.
- `fibe_repo_status_check` — verify access without minting a token.
- `fibe_github_repos_create` — create new repo (OAuth path, different mechanism).
