---
name: fibe-tool-launch
description: Use when launching from exactly one existing source - template, template version, playspec, Fibe-compatible Compose YAML, local YAML file, or GitHub repository config - without creating new source repos first.
---

# fibe_launch

[MODE:GREENFIELD] Tier: greenfield. Not idempotent.

Creates a Playspec and optionally deploys a Playground from exactly one source: Import Template, exact TemplateVersion, existing Playspec, Docker Compose/Fibe YAML, or GitHub repository config. This is the MCP equivalent of the CLI `fibe launch`.

If the call deploys a Playground or Trick, the target Marquee must be funded. Unpaid Marquees fail with `MARQUEE_NOT_FUNDED` before deployment starts.

Use this for existing templates, Playspecs, repositories, or Compose bodies. Use `fibe_greenfield_create` when the caller wants Fibe to create new app-owned repository/Prop destinations from a snapshot template.

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
| `version` | number | no | Template version number for `template_id_or_name`; omitted means latest. CLI flag: `--version` |
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
| `services` | object | no | Sparse per-service Playground overrides; omitted fields inherit from the Playspec |
| `prop_mappings` | object | no | Map private repository URLs to Prop ids or names |

The `services` object records instance-specific intent, not a replacement
Compose file. Fibe applies it over the selected Playspec whenever runtime
Compose is generated. The generated Compose includes platform routing, resolved
environment, build images, and host paths and is therefore an output, not an
accepted source configuration.

## CLI source selection
The CLI accepts either one explicit source flag or one bare positional source:

```sh
fibe launch --template billing-app --marquee next
fibe launch --template-version 912 --name branch-a --marquee next
fibe launch --playspec starter --name demo --marquee next
fibe launch --compose @docker-compose.yml --name demo --marquee next
fibe launch owner/repo@main --name demo --marquee next
```

Bare sources resolve as follows:

- `owner/repo`, full `http(s)` URLs, and `.git`-looking values are repository sources.
- Non-numeric names are looked up as a template name and as a Playspec name. If both match, use `--template` or `--playspec`.
- Bare numeric sources are rejected as ambiguous; use `--template 42`, `--playspec 42`, or `--template-version 42`.
- `--template`, `--template-version`, `--playspec`, `--compose`, and `--repo` are mutually exclusive.

When `--marquee` is omitted, the CLI uses `FIBE_MARQUEE_ID` or infers the only launchable Marquee. If multiple launchable Marquees exist, pass `--marquee`.

Use `--service SERVICE.FIELD=VALUE`, `--env KEY=VALUE`, and `--subdomain SERVICE=SUBDOMAIN` for launch-time runtime overrides. They affect the created Playground config; they do not edit the stored Compose YAML, TemplateVersion, or Playspec.

## Repository config behavior
- GitHub App installation is required even for public repositories because Fibe fetches files server-side.
- If exactly one installation is connected, Fibe uses it.
- If multiple installations are connected, pass `github_account` or `github_installation_id`.
- If `config_path` is omitted, discovery order is `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, `docker-compose.yaml`.
- `owner/repo@ref` shorthand is accepted only for short repo syntax. For full URLs, pass `github_ref`.
- `github_ref` selects only the config file revision. Branches/commits for individual services must be declared inside the YAML.

## Deployment and compilation behavior
- For Compose/repo API calls, `create_playground` defaults to true when a Marquee is supplied and false when no Marquee is supplied.
- For Compose/repo CLI calls, `--create-playground` and `--no-create-playground` force the same API choice.
- The SDK CLI/MCP wrappers may resolve the Marquee from `--marquee` / `marquee_id_or_name`, `FIBE_MARQUEE_ID`, or the only launchable Marquee before calling the API.
- Template variables, declared defaults, `$$var__*`, and `$$root_domain` are compiled before import. Compilation needs a Marquee because the root domain comes from the selected Marquee.
- `persist_volumes` is optional. If omitted, Fibe enables volume persistence when the compiled Compose declares named volumes; pass `false` / `--persist-volumes=false` to force stateless behavior.

## Output
The response shape depends on the selected source:

- Template, Compose, and repository launches usually return IDs:

```json
{
  "playspec_id": 123,
  "playground_id": 456,
  "props_created": []
}
```

`playground_id` is `0` when no Marquee was supplied or `create_playground:false` skipped deployment.

- Exact `template_version_id` launches return the richer greenfield-style result with `template`, `playspec`, `playground`, `props`, and `service_urls`.
- Existing `playspec_id_or_name` launches return the created Playground object.

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
