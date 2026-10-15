---
name: glossary
description: Use as the first reference for the meaning of any core Fibe term - Host, Playground, Spec, Template, Task, Repository, Bazaar, Agent, Mutter, Artefact, Secret, Player, and related concepts.
---

# Glossary of core Fibe concepts

This glossary defines Fibe terms in a simple language.

If another skill needs exact YAML syntax, use the template reference skills. If another skill needs feature behavior, use the product skills.

## Alphabetical index

[Agent](#agent) · [API Key](#api-key) · [Artefact](#artefact) · [Audit Log](#audit-log) · [Bazaar](#bazaar) · [Bridge](#bridge) · [Compose Template](#compose-template) · [Conversation](#conversation) · [Data Transfer](#data-transfer) · [ENV pack](#env-pack) · [Job ENV entry](#job-env-entry) · [Mana and Sparks](#mana-and-sparks) · [Host](#host) · [Mounted File](#mounted-file) · [Mutter](#mutter) · [Muti](#muti) · [Pantry (Templates)](#pantry-templates) · [Player](#player) · [Playground](#playground) · [Spec](#spec) · [Repository](#repository) · [Rune](#rune) · [Schedule config](#schedule-config) · [Library](#library) · [Secret](#secret) · [Source defaults](#source-defaults) · [Team](#team) · [Template](#template) · [Template Version](#template-version) · [Task](#task) · [Trigger config](#trigger-config) · [Variable](#variable) · [Webhook](#webhook)

## Topology at a glance

```
Personal owner (a Player) or a Team
  owns Hosts
  owns Repositories
  owns Templates
  owns Agents
  owns Secrets, API Keys, Webhooks, Job ENV entries, ENV packs

Template Version + launch choices + Host
  becomes a Spec
    becomes a Playground

Job-mode Spec
  becomes a Task
```

## Agent

An AI Agent configuration. An Agent stores provider choice, credentials, prompt/settings, mounted files, and chat preferences. It runs as a standalone chat on a Host.

## API Key

A scoped access token for API, CLI, MCP, and automation workflows. API keys can have broad scopes, narrow scopes, granular resource restrictions, expiry, rate limits, and optional agent accessibility.

## Artefact

A generated file or preview produced by an Agent or workflow. Examples include reports, screenshots, mockups, generated configs, data files, and interactive previews.

## Audit Log

Shown as **Audit Logs** in the app. A read-only event history for important resource and account actions. Audit logs help users understand who or what changed a resource and when.

## Bazaar

The public template marketplace and discovery surface. Users browse, search, fork, and launch public Templates from Bazaar-style views.

## Bridge

The unified Agent workspace. Bridge lets users switch between Agents and active chats, inspect reachability, and work with Agent conversations in one place. Create Agent sits below the Agent list.

## Compose Template

The YAML body of a Fibe Template Version. It is valid Docker Compose plus Fibe-specific labels and optional `x-fibe.gg` metadata. Use "Compose Template" when talking about YAML syntax and "Template" when talking about the reusable Fibe resource.

## Conversation

A chat thread with an Agent. Conversations hold user messages, Agent replies, and related activity so work can be resumed later.

## Data Transfer

An export or import task for moving Fibe configuration between accounts or environments. Data transfers can include repositories, hosts, launch blueprints, running-environment configuration, templates, agents, secrets, webhooks, and related configuration.

## ENV pack

A named map of ordinary readable environment values kept in Library. Pick packs when you create a Playground; only job-mode Specs keep packs, as packs for scheduled runs. Packs are not a secret vault.

## Job ENV entry

An environment variable injected into job-mode runs. Entries can apply globally to all Tasks or only to Tasks tied to a specific Repository.

## Mana and Sparks

User-facing platform credits and accounting concepts used for plan access, resource funding, grants, and usage enforcement. Explain them as account balance and usage concepts unless the user asks for exact billing behavior.

## Host

A Docker-capable host where Fibe runs Playgrounds and standalone Agent chats. A Host has connection settings, one or more domains, TLS/routing behavior, registry credentials, and health status.

## Mounted File

A user-provided file attached to an Agent, Spec, or Playground so it is available inside the target workflow. Use mounted files for docs, prompts, scripts, fixtures, or config blobs that should not live in the application repository.

## Mutter

A short progress, evidence, or issue note produced during Agent or Playground work. Mutters are useful for timelines and status reporting; they should be understandable to users.

## Muti

Fibe's mutation-testing workflow. Muti tracks surviving mutations and can ask an Agent to write or improve tests so the mutation is no longer surviving.

## Pantry (Templates)

The user's personal template collection: private, forked, and source-linked templates live here, including templates the user may later publish.

## Player

A Fibe user account. A Player owns personal resources, sessions, profile settings, API keys, secrets, billing access, and integrations.

## Playground

A running environment created from a Spec on a Host. It has services, URLs, logs, debug terminal access, expiration, lifecycle controls, and optional Agent attachment.

## Spec

The configured blueprint for a launch. A Spec combines a Template Version, launch variables, service settings, mounted files, persistence choices, and automation settings. The Host is chosen at each launch (automation settings name one for scheduled and triggered Task runs).

## Repository

A connected Git repository. Repositories provide source code, branches, Compose files, environment defaults, webhook-triggered updates, build history, and mutation targets.

## Rune

An invitation or access code. Runes can gate signup, beta access, domain/email access, or special onboarding flows. Staff can map an exact-domain Rune to a Team so Google sign-in admits people from that domain into the Team as members.

## Schedule config

The cron-style automation block for a job-mode Template. It tells Fibe when and where to launch a Task repeatedly.

## Library

A searchable workspace of everything your Agents have produced and everything you've written: artefacts, activity, feedback, memories, conversation messages, Pantry templates and ENV packs.

## Secret

An encrypted user-owned credential or value. Use Secrets for long-lived sensitive values that should not be stored in source code or template YAML.

## Source defaults

A Template behavior that lets source-linked launches fill repository and branch information from the selected Repository. This makes one Template reusable across many repositories.

## Team

A shared workspace that owns its own Hosts, Repositories, Specs, Playgrounds, Agents, Library records, Secrets, credentials, quotas and balances. Pick Personal or a Team in the Team pill before creating work; a resource keeps its owner for life. Accepted members operate Team resources; accepted administrators manage members, billing, service accounts and the GitHub installation in Team settings. Team resources stay with the Team when a member leaves.

## Template

A reusable, versioned environment definition. Templates can be private, public, forked, source-linked, CI-tested, and launched into Playgrounds or Tasks.

## Template Version

An immutable snapshot of a Template's YAML, metadata, variables, and automation settings. New edits create new versions; existing launches remain tied to the version they used.

## Task

A job-mode Playground. It starts, runs watched services until they exit, records success or failure, and cleans up. Use Tasks for tests, migrations, backups, cleanup, scheduled tasks, and VCS-triggered jobs.

## Trigger config

The VCS-event automation block for a job-mode Template. It launches a Task when a matching push or pull-request event arrives for a configured repository and branch.

## Variable

A launch-time parameter declared in `x-fibe.gg.variables`. Variables can provide defaults, required input, generated random values, validation, UI hints, and YAML placement through `path`, `paths`, or inline tokens.

## Webhook

An outbound HTTP event subscription. Fibe sends signed callbacks to a user-provided URL when selected resources change.

## Related skills

- [fibe-product-map](fibe-product-map.md) for the platform model.
- [fibe-feature-surface](fibe-feature-surface.md) for feature areas.
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md) for resource behavior over time.
- [convert-compose-to-fibe](convert-compose-to-fibe.md) for template authoring.
