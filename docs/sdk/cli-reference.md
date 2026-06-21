---
title: CLI reference
description: Every fibe command grouped by resource family. Playgrounds, Tricks, Agents, Templates, repos, secrets, monitoring, and the lower-level utilities.
slug: /sdk/cli-reference
sidebar_position: 4
sidebar_label: CLI reference
image: /img/og/sdk-cli-reference.png
keywords: [fibe CLI, playgrounds, tricks, agents, templates, marquees, secrets, webhooks, audit logs, JSON output]
---

`fibe` follows a `fibe <resource> <action> [flags]` pattern. This page is the reference for every resource family. For deep workflow stories, see [Common workflows](/sdk/workflows/).

Every command supports `--help` (`fibe playgrounds --help`, `fibe playgrounds create --help`). Use it liberally; this page is the overview.

Commands that launch, restart, inspect, stream from, schedule onto, stop, destroy, clean up, or message a Marquee require that Marquee to be funded. Unpaid Marquees return `MARQUEE_NOT_FUNDED`.

## Global flags

These work on every command:

| Flag | Purpose |
| --- | --- |
| `--api-key <key>` | Override the API key for this call. |
| `--domain <url>` | Override the API domain. |
| `--profile <name>` | Use a specific profile for this call. |
| `--debug` | Verbose logging of HTTP traffic. |
| `-o, --output <fmt>` | Output format: `table` (default), `json`, `yaml`. Env: `FIBE_OUTPUT`. |
| `--only <field,field>` | Filter fields in JSON/YAML output. |
| `--page <n>`, `--per-page <n>` | Pagination on list commands. |
| `-f, --from-file <path>` | Load a JSON or YAML payload from a file or `-` for stdin. |
| `--explain-errors` | Print structured error output (error code, HTTP status, request ID, validation details). |

Exit codes are deliberately simple: `0` on success, `1` on any error — there are no per-failure-type codes. Scripts that need to branch on **why** a call failed should pass `--explain-errors` and parse the structured output instead of the exit code.

## Playgrounds

Long-running environments. Full lifecycle from the command line.

```sh
fibe playgrounds list
fibe playgrounds get <id|name>
fibe playgrounds create --name "demo" --playspec starter --marquee next
fibe pg create --name "demo" --playspec starter --marquee next --service web.subdomain=demo
fibe playgrounds update <id> -f patch.json
fibe playgrounds delete <id>

fibe playgrounds rollout <id>              # apply Playspec edits, minimal disruption
fibe playgrounds hard-restart <id>         # stop/start everything
fibe playgrounds stop <id>
fibe playgrounds start <id>
fibe playgrounds maintenance enable <id>
fibe playgrounds maintenance disable <id>
fibe playgrounds extend <id> --hours 4

fibe playgrounds status <id>
fibe playgrounds compose <id>              # the compiled compose for the running env
fibe playgrounds logs <id> [--service web] [--tail 100] [--follow --duration 10m]
fibe playgrounds env <id>                  # injected env values
fibe playgrounds debug <id>                # comprehensive diagnostics
```

The shorthand `pg` works wherever `playgrounds` does: `fibe pg list`.

For create, `--playspec` and `--marquee` accept IDs or names. `--service SERVICE.FIELD=VALUE` can be repeated to patch launch-time service configuration without writing a JSON file:

```sh
fibe pg create --name demo --playspec starter --marquee next \
  --service web.subdomain=demo \
  --service web.exposure_port=3000 \
  --service web.exposure_visibility=external \
  --service web.env_vars.RAILS_ENV=production
```

Supported service fields are `subdomain`, `exposure_port`, `exposure_visibility`, `path_rule`, `start_command`, `image`, `dockerfile_path`, `env_file_path`, `healthcheck_path`, `env_vars.KEY`, `git_config.branch_name`, `git_config.base_branch_name`, and `git_config.create_branch`. Service names with dots and `port_mappings` are not supported in this flag; use `-f` JSON/YAML for those. When both `-f` and `--service` are present, service flags win.

## Tricks

One-shot jobs.

```sh
fibe tricks list
fibe tricks trigger --playspec 12 [--marquee <id-or-name>] [--name nightly-run] [--env-overrides KEY=value]
fibe tricks get <id>
fibe tricks logs <id>
fibe tricks rerun <id-or-name>
```

`fibe tricks trigger` takes `--playspec` (required), `--marquee`, `--name`, `--env-overrides`, `--only-service`, and `--except-service`. The trick's behavior comes from the job-mode Playspec; job credentials come from Job ENV. Use `--explain-errors` if a trigger fails — the error typically points at a missing variable or an unreachable repo.

## Agents (Genies)

```sh
fibe agents list
fibe agents get <id|name>
fibe agents create --name "sys-op" --provider claude-code
fibe agents update <id> -f patch.json
fibe agents delete <id>
fibe agents duplicate <id>                   # clone with a new name

fibe agent chat <id|name> "Hello"            # one-shot message
fibe agent chat <id|name> - < prompt.md      # read message from stdin
fibe agents send-message <id|name> --text "Hello"  # compatibility alias
fibe agents start-chat <id>                  # establish a long-lived session
fibe agents restart-chat <id>
fibe agents purge-chat <id>
fibe agents runtime-status <id>              # reachability, queue depth, last activity
fibe agents watch <id>                       # follow messages in real time

fibe agents upload-attachment <id> --file context.zip
fibe agents download-attachment <id> <name> --to ./context.zip

fibe agents add-mounted-file <id> --file ./style.md --mount-path docs/style.md
                                             # or --artefact-id <id> to snapshot an artefact
fibe agents update-mounted-file <id> --filename style.md --mount-path docs/style.md
fibe agents remove-mounted-file <id> --filename style.md

fibe agents pokes list <id>                  # list pokes attached
fibe agents messages <id>                    # message history
fibe agents activity <id>                    # event timeline
fibe agents defaults get                     # per-Player defaults for new agents
fibe agents gitea-token <id>                 # mint a short-lived Gitea token
fibe agents authenticate <id>                # device-code re-auth for an agent
```

The shorthands `agent` and `ag` work wherever `agents` does. `chat` is the primary message command; `send-message` remains as an alias for existing scripts. Use either a positional message or `--text`, not both.

## Playspecs, Props, Marquees, Templates

The bookkeeping resources around a launch.

```sh
fibe playspecs list
fibe playspecs get <id>
fibe playspecs create -f playspec.json

fibe props list
fibe props get <id>
fibe props create --url https://github.com/owner/repo
fibe props delete <id>

fibe marquees list
fibe marquees get <id>
fibe marquees update <id> -f patch.json

fibe templates list
fibe templates get <id>
fibe templates search --query "Rails"
fibe launch --template <id|name> --marquee <id-or-name> [--name my-playground] [--version 3]
fibe launch --template-version <id> --name branch-a --marquee <id-or-name>
fibe launch --playspec <id|name> --name demo --marquee <id-or-name>
fibe launch --compose @docker-compose.yml --name demo --marquee <id-or-name>
fibe launch owner/repo@main --name demo --marquee <id-or-name>
fibe templates update <id> -f patch.json     # update template metadata
fibe templates versions create <id>          # publish a new template version
fibe playspecs switch-template <id>          # move a Playspec to another template version
```

`fibe launch` is the one-shot path from one existing source: a catalog template, exact template version, existing Playspec, raw Compose YAML, or GitHub repo config. Bare positional sources resolve as repositories when they look like `owner/repo`, a URL, or `.git`; otherwise the CLI looks for a template or Playspec by name. Use explicit flags for numeric IDs because a bare number is ambiguous.

Template launch, greenfield, tricks, agent chat, and playground commands all require the selected Marquee to be funded.

## Repos & installations

GitHub and Gitea integration.

```sh
fibe github-repos create --name new-repo [--private]
fibe gitea-repos create  --name new-repo [--private]

fibe github apps connect                     # print the GitHub App install URL
fibe installations list                      # GitHub Apps installed on your account
fibe repo-status check --url <repo-url>      # repeat --url to check many repos
```

There's no `--owner` flag — the repo owner is determined by your connected GitHub App installation (or your Gitea account). Use `fibe installations list` to see which installations you have.

## Secrets, Job ENV, API keys, Webhooks

The credentials and event-subscription surfaces.

```sh
fibe secrets list
fibe secrets create --key OPENAI_API_KEY --value "$(pbpaste)"
fibe secrets update <id> -f patch.json
fibe secrets delete <id>

fibe job-env list
fibe job-env set DEPLOY_KEY="$(pbpaste)" [--prop my-repo] [--secret]   # global scope is the default

fibe api-keys list
fibe api-keys create --label "ci-deploy" --scope launch:write --expires-at 2026-01-01T00:00:00Z
fibe api-keys delete <id>

fibe webhooks list
fibe webhooks create -f webhook.json
fibe webhooks test <id>
fibe webhooks delete <id>
```

These operations need an API key with the matching scopes (e.g. `secrets:write`, `keys:manage`, `webhooks:write`). The CLI never prompts for 2FA — re-auth challenges only exist in the web app.

## Artefacts, Mutters, Feedback

The trail your work leaves behind.

```sh
fibe artefacts list
fibe artefacts get <id>                     # show artefact metadata
fibe artefacts download <agent> <artefact> --to ./report.pdf   # download (use --to - for stdout)

fibe mutters get <agent>                    # read an agent's mutters
fibe mutters create <agent> --type observation --playground 12 \
    --body "Healthcheck flapping; investigating."

fibe feedbacks list
fibe feedbacks get <id>
```

## Monitoring, audit log, status

```sh
fibe monitor follow                         # stream agent events live (filter with --agent, --type, -q)
fibe monitor list                           # one-shot page of recent events
fibe monitor logs <playground-or-trick>     # stream playground or trick logs

fibe audit-logs list                        # filterable; there is no per-entry get

fibe status                                 # account dashboard
fibe server-info                            # API version, server-side build info
fibe wait playground 12 --status running --timeout 5m
fibe wait trick 99 --status completed --timeout 1h
```

## Greenfield & launch shortcuts

Launch one existing source, or use a repo config as a greenfield snapshot template.

```sh
fibe github apps connect

fibe launch --template billing-app --version 3 --name billing-staging --marquee next
fibe launch --playspec starter --name demo --marquee next
fibe launch --compose @docker-compose.yml --name demo --marquee next
fibe launch owner/repo --marquee 12
fibe launch https://github.com/owner/repo --ref main --file deploy/fibe.yml

fibe greenfield owner/repo --marquee 12
fibe greenfield owner/repo@feature/foo --name custom-name
```

For repo sources, both commands discover config files in this order: `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, `docker-compose.yaml`. `--name` is optional and inferred from the repo basename after slug normalization; pass it explicitly when you want a stable custom name. If your account has multiple GitHub App installations, add `--github-account <owner>` or `--github-installation-id <id>`.

When `--marquee` is omitted, launch and greenfield use `FIBE_MARQUEE_ID` or infer the only launchable Marquee. Compose/repo launch can force a Playspec-only import with `--no-create-playground`; volume persistence defaults on when the compiled Compose declares named volumes and can be overridden with `--persist-volumes=false`.

## Local playground inspection

If you're running a Marquee locally and want to peek at `/opt/fibe/playgrounds`:

```sh
fibe local playgrounds info
fibe local playgrounds link <id>            # symlink into the current directory
```

## Schema introspection

For agents (or you) who want to know what fields a resource has:

```sh
fibe schema --list                          # discover resource names and operations
fibe schema playground                      # JSON schema for one resource
fibe schema playground create               # schema for one operation's payload
```

## Config & utility

```sh
fibe config                                 # show the current profiles + config (read-only)
fibe doctor                                 # self-check
fibe version
fibe docs                                   # print the full CLI help for every command
```

To change the default output format, set `FIBE_OUTPUT=yaml` in the environment or pass `-o` per call.

## Output formats

For scripts, switch to JSON:

```sh
fibe playgrounds list -o json | jq '.Data[].id'

# Filter to specific fields (inside Data)
fibe playgrounds list -o json --only id,name,status
```

List commands emit an envelope with `Data` (the items) and `Meta` (pagination) keys — reach into `.Data`, not a bare array.

Combine with `jq` for ad-hoc analysis, or pipe `-o yaml` to `yq` for richer queries.

## Reading commands from a file

The `-f` flag accepts a file path or `-` for stdin. (A few specific string flags additionally accept `@file` to read their value from a file, such as `--compose @compose.yml`.) Useful when you've assembled a payload from another tool:

```sh
echo '{"name":"demo","playspec_id":5,"marquee_id":"next"}' | fibe playgrounds create -f -
fibe agents update sys-op -f /tmp/sys-op-patch.yaml
```

## Next step

For programmatic access, the [Go library](/sdk/go-library/) gives you the same surface in Go. For AI agents, the [MCP server](/sdk/mcp-server/) exposes the same surface as typed MCP tools — see the [Tools catalog](/sdk/tools-catalog/).
