---
title: The Fibe SDK
description: Released SDK v0.3.3 CLI, Go library, and MCP client entry points for self-hosted Fibe installations.
slug: /sdk/intro
sidebar_position: 1
sidebar_label: Overview
image: /img/og/sdk-intro.png
keywords: [Fibe SDK, fibe CLI, MCP server, Go library, automation, AI agent]
---

The released Fibe SDK v0.3.3 provides a Go binary with CLI, library, and MCP entry points. Its available operations are defined by that release; the native server OpenAPI document is the authoritative inventory of server endpoints.

- **CLI**: you, at a terminal. `fibe playgrounds list`, `fibe agent chat`, `fibe tasks trigger`.
- **Go library**: programs you write in Go that embed Fibe directly. Automate deployments, build a custom dashboard, write a control plane.
- **MCP server**: AI agents (Claude Code, Cursor, Antigravity, anything that speaks the Model Context Protocol). Agents call `fibe_*` tools and Fibe responds.

The CLI, library, and MCP server are entry points to the released client. Their operation set and behavior are versioned with SDK v0.3.3 and are not a guarantee that every native server workflow is available.

## When to use which mode

| You are… | Use… |
| --- | --- |
| At a terminal | The **CLI**: `fibe ...` |
| A Go program that needs to drive Fibe | The released **Go library** at `github.com/fibegg/sdk/fibe` |
| An LLM agent (Claude Code, Cursor, Codex, etc.) | The **MCP server**: `fibe mcp serve`, when available in the installed client |
| Writing a one-off shell script | The **CLI** with `-o json` for parseable output |
| Automating a self-hosted installation | The CLI or Go library with a scoped API key |

:::info Released client scope
The SDK v0.3.3 release is a separate API consumer. A command or MCP tool existing in the client does not mean the corresponding native server workflow is available or qualified. Check the server OpenAPI contract and use `fibe --help` for the released command set.
:::

## The 60-second tour

```sh


# First-time setup
fibe login                # check `fibe login --help` for supported auth modes
fibe doctor               # check connectivity + auth

# Daily use
fibe playgrounds list
fibe agents --help
fibe playgrounds --help
fibe tasks --help

# Run an MCP server for your AI agent
fibe mcp serve
fibe mcp install --client claude-code
```

Check `fibe --help` and the installation's OpenAPI document before relying on a specific command or workflow.

## What it talks to

The SDK is a **client** to the Fibe API. It doesn't run anything itself; it tells the platform what to do. On the other end is Fibe, which orchestrates [Hosts](/concepts/hosts/) (your Docker hosts), [Repositories](/concepts/repositories/) (your Git repos), [Templates](/concepts/specs/#templates), [Playgrounds](/concepts/playgrounds/), [Tasks](/concepts/tasks/), and [Agents](/concepts/agents/).

So the SDK is what gets you those resources from a script, an agent, or a CI job: same as the web UI gets them from a browser.

## The three modes in detail

### CLI

```sh
fibe <resource> <action> [flags]
```

The released command tree is versioned with SDK v0.3.3. Run `fibe --help` or `fibe <resource> --help` to see its actual commands and options; do not infer server support from the command name alone.

Read on: [Install the CLI](/sdk/install/), [Authentication](/sdk/authentication/), [CLI reference](/sdk/cli-reference/).

### Go library

```go
import "github.com/fibegg/sdk/fibe"

client := fibe.NewClient(fibe.WithAPIKey(os.Getenv("FIBE_API_KEY")))
pg, _ := client.Playgrounds.Create(ctx, &fibe.PlaygroundCreateParams{Name: "demo", SpecIdentifier: "5"})
```

The package exposes typed client methods for the resources included in SDK v0.3.3. Exact signatures and behavior are release-specific; see the package documentation and compare each operation with the native OpenAPI contract.

Read on: [Go library](/sdk/go-library/).

### MCP server

```sh
fibe mcp serve                       # see the installed client help for transport options
fibe mcp install --client claude-code
```

The released binary can also serve MCP. Its exact transport and tool surface are defined by SDK v0.3.3. See the [Tools catalog](/sdk/tools-catalog/) and verify server-side support in the installation OpenAPI document.

Read on: [MCP server](/sdk/mcp-server/), [Tools catalog](/sdk/tools-catalog/).

## What's next

- [Install the CLI](/sdk/install/): Homebrew, Go install, release binaries.
- [Authentication](/sdk/authentication/): login flows, profiles, env vars.
- [CLI reference](/sdk/cli-reference/): every command grouped by resource.
- [Go library](/sdk/go-library/): embedding the SDK in your own programs.
- [MCP server](/sdk/mcp-server/): running it for your AI agent.
- [Tools catalog](/sdk/tools-catalog/): every MCP tool, in one place.
- [Common workflows](/sdk/workflows/): greenfield, brownfield, pipelines, CI.
- [Troubleshooting](/sdk/troubleshooting/): debug, common errors, schema introspection.
