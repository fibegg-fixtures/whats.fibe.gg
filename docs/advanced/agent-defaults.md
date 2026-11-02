---
title: Agent Defaults
description: "Personal Agent defaults for provider CLI, system prompt, environment, MCP servers, mounted files and post-init."
slug: /advanced/agent-defaults
sidebar_position: 8
keywords: [agent defaults, Agent defaults, system prompt, MCP, mounted files, CLI version]
---

Personal defaults are inherited by new Agents and by existing Agents where a value is still inherited. Most runtime settings are resolved from the current defaults when Fibe starts, restarts or redeploys an Agent; changing defaults does not update an already-running chat. **Sync to Fibe** and **Build in Public** are captured when an Agent is created; changing those defaults does not update existing Agents. Agent Presets keep a snapshot of authored settings and inherit only a small allowlist of runtime values, including image, CLI and resource settings. Team Agents use Team defaults where configured.

There are two personal-default levels:

- **General defaults**: shared across your providers unless a provider-specific value takes precedence.
- **Per-provider defaults**: override General defaults for Agents using that provider (Claude, Gemini, OpenCode, etc.).

The settings cascade for an Agent is: per-Agent → per-provider default → general default → platform default → built-in default. See [Agents → Settings cascade](/concepts/agents/#settings-cascade).

## Configurable fields

| Field | What it controls |
| --- | --- |
| **CLI version** | Pin a provider CLI version (e.g. `v0.12.3`). Blank = latest. |
| **Image tag** | Docker image tag. Blank = provider default. |
| **CPU limit** | Container CPU (e.g. `1.5` or `2`). |
| **Memory limit** | Container memory limit for Agents that inherit this value. |
| **Build in public** | Creation-time default visibility; changing the default does not change existing Agents. |
| **Sync to Fibe** | Creation-time message/activity sync default; changing the default does not change existing Agents. |
| **MCP JSON** | Custom MCP server configuration. At each defaults level, the more specific nonblank configuration replaces the less-specific MCP JSON; Fibe-provided servers are added separately. |
| **Custom environment** | KEY=VALUE pairs, one per line. Values merge with admin defaults; Agent-level entries override matching keys. |
| **Agent rules** | Rules file content (e.g. `CLAUDE.md`, `GEMINI.md`). Synced to the Agent workspace. |
| **System prompt** | Default system prompt for Agents that inherit it. |
| **Mounted files** | Files auto-mounted into the Agent's workspace. |
| **Post-init script** | Runs once when the Agent environment is set up. |
| **CLI arguments** | Extra provider CLI flags for Agents that inherit them. Unsafe flags are ignored. |
| **Skills** | Choose which built-in skills are synced into Agent workspaces; unchecked skills are not mounted. |

## Content modes

For the System Prompt and Agent Rules fields, three modes control how your text relates to an upstream value (per-provider, platform, or built-in default):

- **Use default**: inherit verbatim.
- **Append**: extend the upstream value.
- **Override**: replace entirely.

Append extends the upstream value. Override replaces it.

## Per-provider page

Click a provider to open its defaults. Provider values take precedence over General defaults for that provider. Existing non-snapshot Agents with inherited runtime fields use the updated values the next time Fibe starts, restarts or redeploys them; values already set on an Agent still take precedence. **Sync to Fibe** and **Build in Public** remain as captured when that Agent was created.

## Reset

Each field has a reset action: drop the account value and fall back to the next level in the cascade.

## Related

- [Your Agents](/concepts/agents/): per-Agent configuration.
- [MCP server](/sdk/mcp-server/): what custom MCP JSON points at.
