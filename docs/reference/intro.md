---
title: Reference (skills)
description: A library of compact, task-focused skill files. Designed to be read by both humans and LLM agents working with Fibe.
slug: /reference/intro
sidebar_label: Overview
sidebar_position: 1
image: /img/og/reference-intro.png
keywords: [Fibe, reference, skills, LLM, authoring, recipes, playbooks]
---

The reference section contains task-focused **skill files** for authoring Native Fibe Compose Specs, using the resource model, and understanding public tool guides. Each topic links to related material.

Two audiences:

- **You, the human author.** Use them as a fast lookup while you're writing or fixing a template. Each file is short on purpose.
- **An LLM agent working with Fibe.** Agents can discover these via [`llms.txt`](https://whats.fibe.gg/llms.txt) and use them as a structured knowledge base. The file naming convention (`recipe-`, `playbook-`, `decide-`, etc.) helps an agent select the right one for a given task.

## How the reference is organized

| Group | What's in it |
| --- | --- |
| **Foundations** | The Native product map, glossary, ownership concepts, and resource lifecycles. |
| **Compose conversion** | Guides for adapting `compose.yaml` into a Fibe Spec, plus validation and troubleshooting. |
| **References** | Authoritative pages for the moving parts: labels, the `x-fibe.gg` block, variables, YAML paths, implied semantics, validation. |
| **Decision guides** | Short, opinionated frameworks for the choices you make while authoring (static vs dynamic, expose external vs internal, zero-downtime on/off, etc.). |
| **Execution modes** | Task configuration, schedules, and Repository triggers. |
| **Recipes** | Copyable Compose patterns for routing, variables, source mounts, volumes, and related configuration. |
| **App playbooks** | Worked examples for Node, Python, databases, and self-hosted applications. |

## How to read a skill file

Each file follows a consistent shape:

1. **Frontmatter** with `description`: a one-line summary the user (or an agent) can match against.
2. **A concise body**: task guidance or exact tool inputs, with examples and cross-links where useful.
3. **Related skills** at the bottom: a small graph you can follow when one skill leads naturally to another.

## How agents use these

The public tool set follows the pinned Native API Skill catalog. Its input names, required fields and enums are generated from the reviewed released SDK schemas, available in [machine-readable form](https://whats.fibe.gg/native/sdk-tool-schemas.json). Agent prompts and installation-specific runtime instructions are not part of this public reference. An assistant can use [`llms.txt`](https://whats.fibe.gg/llms.txt) to find relevant guides, then follow their cross-links for Compose and resource details.

If you're building your own agent that should know Fibe, point it at [`whats.fibe.gg/llms.txt`](https://whats.fibe.gg/llms.txt) for an index, [`whats.fibe.gg/llms-full.txt`](https://whats.fibe.gg/llms-full.txt) for the entire library concatenated, or [`whats.fibe.gg/llm-skills.txt`](https://whats.fibe.gg/llm-skills.txt) for a compact `name: description` table of every skill and tool.

## Where to start

- New to Fibe? Read [`fibe-product-map`](/reference/fibe-product-map/) and [`glossary`](/reference/glossary/).
- Coming with a Compose file in hand? Open [`convert-compose-to-fibe`](/reference/convert-compose-to-fibe/): it tells you which surgical skills to load next.
- Stuck on a specific error? Try [`common-errors-and-fixes`](/reference/common-errors-and-fixes/).
- Publishing your first template? Walk the [`templates-publish-checklist`](/reference/templates-publish-checklist/).
