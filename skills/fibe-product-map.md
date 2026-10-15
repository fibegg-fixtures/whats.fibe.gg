---
name: fibe-product-map
description: Use to understand Fibe's user-facing product model, core nouns, topology, and normal path from code repository to running Playground without relying on source code details.
---

# Fibe product map

Fibe is a Docker-based development environment platform. Users connect compute hosts, connect source repositories, define reusable environment templates, launch isolated Playgrounds, and work with AI Agents inside or beside those environments.

## Mental model

```
Player
  owns Hosts                 # places where environments run
  owns Repositories                    # source repositories
  owns Templates                # reusable environment definitions
  owns Agents                   # AI Agent configurations
  owns Secrets, API Keys, Webhooks, Job ENV entries

Template Version + launch values + Host
  becomes a Spec
    becomes a Playground
      exposes services, logs, terminals, URLs, lifecycle controls

Job-mode Template
  launches a Task
    runs watched services to completion, records result, then cleans up
```

A selected Team owner provides the same resource families with independent defaults, credentials, quotas and finance. The creator is attribution, not a fallback owner. Tasks remain job-mode Playgrounds, with no separate Task storage table.

## Core resources

| Resource | User-facing meaning |
| --- | --- |
| Player | A Fibe account. Owns resources, sessions, profile, plan access, and personal integrations. |
| Host | A Docker host where Playgrounds and Agent chats run. Can be user-managed or platform-managed for tutorials. |
| Repository | A connected Git repository. Repositories provide branches, source code, Compose files, build inputs, webhooks, and code-change history. |
| Template | A reusable environment definition. It is versioned, forkable, publishable, launchable, and may be linked to a source file in a Repository. |
| Template Version | An immutable snapshot of a Template's YAML and metadata. Launches bind to a specific version for reproducibility. |
| Spec | A launch blueprint created from a Template version, variable values, service configuration, mounted files, and a target Host. |
| Playground | A running environment created from a Spec. It has services, URLs, logs, terminal access, lifecycle actions, expiration, and optional Agent attachment. |
| Task | A job-mode Playground. It runs watched services until they exit, records pass/fail results, and cleans itself up. |
| Agent | A persistent AI assistant configuration. It can run standalone chat sessions or attach to Playgrounds. |
| Secret | Encrypted user-owned key/value data for credentials that should not live in source code or template YAML. |
| Job ENV entry | Environment data injected into job-mode runs globally or for one Repository. |
| API Key | Scoped programmatic access for API, CLI, MCP, and agent workflows. |
| Webhook | Outbound event delivery to external systems when Fibe resources change. |
| Audit Log | Read-only history of important actions and resource changes. |

## Normal user journey

1. Create an account and complete onboarding.
2. Add a Host or use a platform-managed tutorial Host.
3. Connect or create a Repository for source code.
4. Import, write, fork, or discover a Template.
5. Choose launch variables, branch, service settings, and target Host.
6. Launch a Playground or Task.
7. Use service URLs, logs, debug terminal, rollout, hard restart, stop, retry, or expiration controls.
8. Attach an Agent, start Bridge chat, upload mounted files, produce artefacts, or record progress.
9. Publish or fork Templates and automate jobs with schedules or VCS triggers.

## Hints

- Templates are reusable; Playgrounds are running instances.
- Template Versions are immutable; changes create a new version.
- Specs "remember" the Template Version and launch values they came from.
- Hosts are the execution target; a Playground runs on exactly one Host.
- Repositories are source repositories; dynamic services point at Repositories or repository URLs.
- Long-running Playgrounds are for services that should stay up.
- Tasks are for tasks that should finish.
- Public service access is configured through Fibe routing, not host port publishing.
- Internal routes require Fibe-mediated access; external routes are public.
- Durable data belongs in named volumes or external services, not disposable container filesystems.
- Sensitive credentials belong in Secret Vault, Job ENV, or launch-time secret variables depending on who needs them and when.

## Related skills

- [glossary](glossary.md) for one-paragraph definitions.
- [fibe-feature-surface](fibe-feature-surface.md) for feature areas.
- [fibe-resource-lifecycles](fibe-resource-lifecycles.md) for resource states and transitions.
- [convert-compose-to-fibe](convert-compose-to-fibe.md) for template authoring.
