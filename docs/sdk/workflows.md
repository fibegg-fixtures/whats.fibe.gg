---
title: Common workflows
description: Repo-backed launch, greenfield setup, brownfield transform, multi-step pipelines, live monitoring, CI integration. The end-to-end stories you'll actually use.
slug: /sdk/workflows
sidebar_position: 8
sidebar_label: Common workflows
image: /img/og/sdk-workflows.png
keywords: [launch, greenfield, brownfield, pipeline, monitor, CI, GitHub Actions, fibe_launch_create, fibe_greenfield_create, fibe_playgrounds_transform]
---

End-to-end stories using the [CLI](/sdk/cli-reference/), [Go library](/sdk/go-library/), and [MCP tools](/sdk/tools-catalog/). Pick the workflow that matches what you're doing.

## Launch: existing repo to running Playground

Use this when a GitHub repo already contains a Fibe-compatible `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, or `docker-compose.yaml`.

### Via the CLI

```sh
fibe github apps connect

fibe launch owner/repo --marquee-id 1
fibe launch https://github.com/owner/repo --ref main --file deploy/fibe.yml
```

The GitHub App connection is required even for public repos because Fibe fetches the config server-side. `--ref` selects only the config-file revision; service branch behavior still comes from the template itself. If the repo basename is not the name you want, add `--name`.

### Via MCP

For an AI agent:

```jsonc
// the agent calls:
{
  "tool": "fibe_launch_create",
  "args": {
    "repository_url": "owner/repo",
    "github_ref": "main",
    "config_path": "deploy/fibe.yml",
    "marquee_id_or_name": 1
  }
}
```

See [`fibe_launch_create`](/reference/tools/launch-create/) for the full parameter list.

## Playground create: existing Playspec with launch overrides

Use this when the Playspec already exists and you only need a new Playground with a few launch-specific service settings.

```sh
fibe pg create --name demo --playspec starter --marquee next \
  --service web.subdomain=demo \
  --service web.exposure_port=3000 \
  --service web.exposure_visibility=external \
  --service web.env_vars.RAILS_ENV=production
```

`--playspec` and `--marquee` accept the same IDs or names as `--playspec-id` and `--marquee-id`. Repeated `--service` flags merge into the create payload and win over values loaded from `-f`.

## Greenfield: repo snapshot to app-owned repos

Use this when the repo is a starting template. Fibe reads the selected config once, creates new app-owned destination repo(s), then launches normally.

```sh
fibe greenfield owner/repo --marquee-id 1
fibe greenfield owner/repo@feature/foo --name my-app --github-account me
```

For an AI agent:

```jsonc
{
  "tool": "fibe_greenfield_create",
  "args": {
    "repository_url": "owner/repo@feature/foo",
    "name": "my-app",
    "marquee_id_or_name": 1,
    "git_provider": "github"
  }
}
```

`--github-account` and `--github-installation-id` select the GitHub App installation used to read the source config. `git_provider: "github"` controls where the new destination repos are created and uses the player's GitHub OAuth connection.

See [`fibe_greenfield_create`](/reference/tools/greenfield-create/) for the full parameter list.

## Brownfield transform: rewrite an existing Playground

"I want this Playground but with a different template / new repos / changed services — without losing its ID and URL." That's [`fibe_playgrounds_transform`](/reference/tools/playgrounds-transform/).

```jsonc
{
  "tool": "fibe_playgrounds_transform",
  "args": {
    "id_or_name": 42,
    "mode": "apply",
    "template_body": "<new compose template>",
    "provision_missing_props": "auto",
    "wait": true,
    "confirm": true
  }
}
```

Behind the scenes: provisions the repos the new template references (tune that with `provision_inputs` and `reuse_existing_props`), authors a new template version, switches the Playspec to it, rolls out, and waits. The Playground's ID stays the same — bookmarks and integrations still work.

## Multi-step pipelines

`fibe_pipeline` runs several MCP tool calls in sequence, threading results between them via JSONPath. Useful when the agent wants one atomic operation instead of round-tripping multiple individual calls.

```jsonc
{
  "tool": "fibe_pipeline",
  "args": {
    "steps": [
      {
        "id": "make_pg",
        "tool": "fibe_launch_create",
        "args": {
          "repository_url": "me/auth-service",
          "github_ref": "main",
          "marquee_id_or_name": 1
        }
      },
      {
        "id": "wait_ready",
        "tool": "fibe_playgrounds_wait",
        "args": {
          "id_or_name": "$.make_pg.playground_id",
          "status": "running",
          "timeout": "5m"
        }
      }
    ],
    "return": "$.make_pg"
  }
}
```

Pipelines support `parallel: [...]` blocks for steps that can run concurrently and `for_each: ...` for repeating a sub-pipeline over an array. Results are cached for 5 minutes — `fibe_pipeline_result` looks up a cached run by ID.

For an LLM agent, this is cheaper than separate tool calls because the launch, wait, and return shape live in one plan.

## Live monitoring & alerting

Tail events as they happen:

```sh
fibe monitor follow                         # CLI (filter with --agent, --type, -q)
```

Or, from an agent:

```jsonc
{ "tool": "fibe_monitor_follow", "args": { "type": "message,artefact", "q": "error" } }
```

Events are produced by agents — filter by agent, event type, or text, not by resource family. The agent gets progress notifications as new events arrive. Pair it with `fibe_mutter` to post a note when something interesting happens — that's the basis of "babysitting" workflows where an agent watches a Playground and chimes in on noteworthy events.

## CI integration

Mint a scoped API key, set it as a CI secret, run `fibe` from a workflow. Example: a GitHub Actions job that triggers a Trick on push and waits for the result.

```yaml
name: Deploy to staging
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      FIBE_API_KEY: ${{ secrets.FIBE_API_KEY }}
    steps:
      - name: Install fibe
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          gh release download --repo fibegg/sdk --pattern '*_linux_amd64.tar.gz' --output - | tar xz
          sudo mv fibe /usr/local/bin/

      - name: Pass the branch to the job
        run: fibe job-env set BRANCH=${{ github.ref_name }}

      - name: Trigger deploy trick
        id: deploy
        run: |
          set -e
          OUT=$(fibe tricks trigger --playspec-id 42 -o json)
          ID=$(echo "$OUT" | jq -r '.id')
          echo "trick_id=$ID" >> $GITHUB_OUTPUT

      - name: Wait for completion
        run: fibe wait trick ${{ steps.deploy.outputs.trick_id }} --status completed --timeout 30m

      - name: Get logs on failure
        if: failure()
        run: fibe tricks logs ${{ steps.deploy.outputs.trick_id }}
```

The API key here is narrowly scoped: `launch:write` + `playgrounds:read` (tricks are job-mode playgrounds), with a granular restriction to the one Playspec (`--granular-scope playspecs:read=42`). If it leaks, the blast radius is one Trick.

Tricks take no per-run flags — values like the branch go into Job ENV (the `job-env set` step above) or get baked into the job-mode Playspec.

## Babysit a long-running Trick

For a CI workflow that waits but also reports progress, use `--follow` semantics:

```sh
fibe tricks trigger --playspec-id 42 -o json | jq -r '.id' | xargs -I {} sh -c '
  fibe tricks logs {} --follow &
  fibe wait trick {} --status completed --timeout 1h
'
```

Or, from a Go program with the library: spawn the trick, then range over `client.Tricks.LogsStream(ctx, id, "", nil)` in one goroutine while waiting for the terminal status in another (or just shell out to `fibe wait trick`). Cancel one when the other returns.

## Webhook-driven automation

Subscribe a webhook to "Trick completed" events; let the receiver decide what's next (post to Slack, file a ticket, kick off another Trick). The CLI manages webhook subscriptions:

```sh
fibe webhooks create -f - <<'JSON'
{
  "url": "https://relay.example.com/fibe-trick-done",
  "events": ["playground.completed"],
  "secret": "rotate-this-monthly"
}
JSON
```

Tricks emit `playground.*` events (they're job-mode playgrounds). Use `event_filters` to pin an event to specific resource IDs, and `fibe webhooks event-types` to list every event. See [Webhooks](/advanced/webhooks/) for the full subscription model.

## Switching environments (staging ↔ production)

Maintain two profiles and switch with one command:

```sh
fibe auth login --profile staging --domain https://fibe.staging.example.com
fibe auth login --profile prod    --domain https://fibe.gg

fibe auth use staging
fibe playgrounds list             # against staging

fibe --profile prod playgrounds list   # one-off against prod, doesn't change active
```

Combined with environment-specific API keys, this is the cleanest way to keep both worlds reachable from one machine.

## Build something custom

The Go library is the right answer when you need to build something Fibe doesn't have a CLI command for: a custom dashboard, a Slack bot that surfaces Playground status, a backup tool, a synthetic-traffic generator. See [Go library](/sdk/go-library/).

## Next step

When things go sideways, [Troubleshooting](/sdk/troubleshooting/) covers what to look at.
