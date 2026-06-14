---
name: fibe-tool-launch
description: Use when deploying an existing Fibe-compatible Compose config from inline YAML, a local file, or a GitHub repository config file without creating new source repos first.
---

# fibe_launch

[MODE:GREENFIELD] Tier: greenfield. Not idempotent.

Creates a Playspec and optionally deploys a Playground from exactly one source: Import Template, exact TemplateVersion, existing Playspec, Docker Compose/Fibe YAML, or GitHub repository config. This is the MCP equivalent of the CLI `fibe launch`.

If the call deploys a Playground or Trick, the target Marquee must be funded. Unpaid Marquees fail with `MARQUEE_NOT_FUNDED` before deployment starts.

Use this for existing repositories or existing Compose bodies. Use `fibe_greenfield_create` when the caller wants Fibe to create new app-owned repository/Prop destinations from a snapshot template.

## When to use
- Player says "launch this template", "launch this playspec", "launch this repo", or gives `owner/repo` / `https://github.com/owner/repo`.
- Player already has a Fibe-compatible `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, or `docker-compose.yaml`.
- Player wants a one-shot Playspec/Playground from inline YAML without creating new source repos.

## When NOT to use
- Player wants a brand-new app-owned repo scaffolded from a template snapshot — use `fibe_greenfield_create`.
- Player wants to mutate an existing Playground in place — use `fibe_playgrounds_switch_template`.
- The Compose file is arbitrary and not Fibe-compatible yet — convert/validate it first.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `template_id_or_name` | string/number | no | Existing Import Template selector; mutually exclusive with other source fields. Uses latest version when `version` is omitted |
| `template_version_id` | number | no | Exact Import Template version ID; mutually exclusive with other source fields |
| `playspec_id_or_name` | string/number | no | Existing Playspec selector; creates a Playground directly |
| `name` | string | no | Launch/Playspec name. Required for inline YAML, inferred from `repository_url` basename when omitted |
| `compose_yaml` | string | no | Docker Compose or Fibe YAML content; mutually exclusive with `repository_url` |
| `compose_yaml_path` | string | no | Local filesystem path to YAML (local MCP only); mutually exclusive with `repository_url` |
| `repository_url` | string | no | GitHub repo as `owner/repo`, `owner/repo@ref`, or `https://github.com/owner/repo`; mutually exclusive with Compose body inputs |
| `config_path` | string | no | Config file path inside the repo. If omitted, Fibe tries `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, `docker-compose.yaml` |
| `github_ref` | string | no | Branch, tag, or commit for the config file. Only the config file revision; service refs stay in YAML |
| `github_account` | string | no | Friendly GitHub App installation owner alias when multiple installations exist |
| `github_installation_id` | number | no | Exact GitHub App installation selector for automation or duplicate account names |
| `marquee_id_or_name` | string/number | no | Target Marquee. Without it, Fibe creates only the Playspec |
| `create_playground` | bool | no | Force or skip Playground creation. Defaults to true when a Marquee is set |
| `job_mode` | bool | no | Create as a Trick/job. Requires `marquee_id_or_name` |
| `persist_volumes` | bool | no | Persist Docker volumes for compose/repo/template launches |
| `variables` | object | no | Template variables for Fibe template compilation |
| `env_overrides` | object | no | Runtime Playground environment overrides |
| `service_subdomains` | object | no | Service-to-subdomain runtime overrides |
| `services` | object | no | Per-service runtime Playground configuration |
| `prop_mappings` | object | no | Map private repository URLs to Prop ids or names |

## Repository config behavior
- GitHub App installation is required even for public repositories because Fibe fetches files server-side.
- If exactly one installation is connected, Fibe uses it.
- If multiple installations are connected, pass `github_account` or `github_installation_id`.
- If `config_path` is omitted, discovery order is `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, `docker-compose.yaml`.
- `owner/repo@ref` shorthand is accepted only for short repo syntax. For full URLs, pass `github_ref`.
- `github_ref` selects only the config file revision. Branches/commits for individual services must be declared inside the YAML.

## Output
Returns the launch result, usually including:

```json
{
  "playspec_id": 123,
  "playground_id": 456,
  "props_created": []
}
```

`playground_id` is `0` when no Marquee was supplied or `create_playground:false` skipped deployment.

## Gotchas
- Plain Compose is not auto-converted. Services with `build:` or `fibe.gg/source_mount` must already include the required Fibe labels/metadata.
- Provide exactly one source field.
- `job_mode:true` requires `marquee_id_or_name`.
- A duplicate `name` follows normal backend conflict/validation behavior. Pass `name` explicitly to override repo-name inference.
- Missing GitHub App access, missing config files, unsupported providers, and ambiguous installations return actionable validation errors.

## Related
- `fibe_greenfield_create` — snapshot source, create app-owned repo(s), launch.
- `fibe_tools_catalog` with `include_schema:true` — inspect the live MCP input schema.
- `fibe_help` with `path:"launch"` — CLI flag reference for the same flow.
