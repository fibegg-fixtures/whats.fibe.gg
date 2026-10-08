---
title: Welcome to Fibe
description: Fibe runs Docker environments on your hosts from a browser. Add a Host, connect a Repository, launch a Playground.
slug: /intro
sidebar_position: 1
sidebar_label: Welcome
image: /img/og/intro.png
keywords: [Fibe, getting started, Docker environments, dev environments, AI agent, Agent]
---

Fibe runs Git-backed Docker environments on your hosts. Launch from a browser, share a URL, attach an AI assistant, then stop or extend the environment as needed.

:::info Release scope
[fibe.gg](https://fibe.gg) is the production service. [next.fibe.live](https://next.fibe.live)
is the staging environment for the maintained v1.5 work. A change described as
staging-only is not yet a production guarantee. The separate v2/Core extraction
and mini-fibe-os work are postponed.
:::

## The shortest path

1. Add a [Host](/concepts/hosts/), the host that runs containers.
2. Connect a [Repository](/concepts/repositories/), your Git repository.
3. Pick or write a [Template](/concepts/specs/#templates), a Compose file with Fibe labels.
4. Launch a [Playground](/concepts/playgrounds/) from a [Spec](/concepts/specs/) and open its URL.

## Two shapes of work

| | What it is | When |
| --- | --- | --- |
| **[Playground](/concepts/playgrounds/)** | Long-running environment. URLs, logs, terminal. | Web apps, dashboards, dev servers. |
| **[Task](/concepts/tasks/)** | One-shot run. Records pass/fail, cleans up. | Tests, migrations, backups, cron, CI. |

If the task should finish, use a Task. If it should stay up, use a Playground.

## Bring an Agent

A [Agent](/concepts/agents/) is a configured AI assistant. Run it alone or attach it to a Playground. It can read logs, edit source, run commands, and commit changes.

Keep separate Agents for jobs such as refactoring, tests, or docs. Each supports several conversations.

## What's next

- **New here?** [Hosts](/concepts/hosts/) → [Repositories](/concepts/repositories/) → [Templates](/concepts/specs/#templates) → [Specs](/concepts/specs/) → [Playgrounds](/concepts/playgrounds/).
- **Authoring a Template?** [Compose → Fibe](/authoring/compose-to-fibe/).
- **Driving from a script or CI?** [Fibe SDK](/sdk/intro/) ships the `fibe` CLI and a Go library.
- **Wiring an AI agent that should know Fibe?** [`llms.txt`](https://whats.fibe.gg/llms.txt), [`llm-skills.txt`](https://whats.fibe.gg/llm-skills.txt), [reference library](/reference/intro/). For agents that should act, run the [MCP server](/sdk/mcp-server/).

Fibe supports English and Ukrainian. The UI and emails use your account language.
