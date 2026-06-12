---
title: Scrolls
description: Your account's library — one searchable place for everything you and your Genies produce, from artefacts and mutters to provider traces, memories, and Pantry templates.
slug: /concepts/scrolls
sidebar_position: 3
image: /img/og/concepts-scrolls.png
keywords: [Scrolls, artefacts, mutters, memories, Pantry, provider traces, raw logs]
---

**Scrolls** is your account's library — one searchable place collecting everything you and your Genies produce: artefacts, mutters, messages, feedback, activity, conversation transcripts, raw provider traces, memories, and your Pantry of Templates. Browse by section and filter any section down to a single Genie.

Open Scrolls for notes and files, inspect raw provider logs when an AI session needs debugging, or pull a reusable template out of the Pantry.

## What lives in Scrolls

| Item | What it is |
| --- | --- |
| **Artefacts** | Files and notes produced during work — reports, screenshots, mockups, CSVs, snippets, interactive previews. |
| **Mutters** | Short progress notes — what was tried, where things broke, what's left. |
| **Feedback** | Ratings and reviews of Genie output. |
| **Messages** | Conversation messages worth surfacing outside the chat. |
| **Conversations** | Transcripts of your chats with Genies. |
| **Activity** | Higher-level events — messages sent, Tricks run, rollouts. |
| **Raw provider traces** | The exact request/response logs from a Genie's provider. For debugging an AI session. |
| **Memories** | Persistent notes the Genie or the user marked as worth remembering. |
| **Pantry templates** | Your saved reusable Templates. |

Each section is searchable, and any section can be narrowed to a single Genie with the Genie filter.

## Authoring artefacts

Create an artefact directly in the Artefacts section:

- **Title** — your reference.
- **Description** — short summary (optional).
- **Body** — Markdown content. The editor surfaces a body placeholder until you start writing.

Artefacts can also be produced automatically by a Genie's work. Either way they land in the same library. A badge shows whether a Genie or you created each artefact — Genie-created artefacts are read-only (you can still download them or toggle their skill flag).

## Raw provider traces

When a Genie talks to its underlying provider (Claude, Gemini, OpenAI, etc.), the request and response payloads are captured. Open the trace to see exactly what the provider was sent and what it returned. Useful for debugging a wrong answer, a refused tool call, or a context-window failure.

Traces are sensitive — they contain prompts and replies verbatim. Treat them like the data they contain.

## Pantry

The Pantry is your account's collection of reusable Templates. Use it when a Template is too specialized for the public [Bazaar](/concepts/bazaar/) but still worth keeping handy across multiple launches.

Pantry templates can be:

- Edited in place (name, description, image, category).
- Versioned — publish a new version whenever you want to change the body; each version is an immutable snapshot, and editing the template's name or description doesn't create one.
- Imported into a Playspec at launch time.

## Memories

A memory is a tagged note the Genie can refer back to in future conversations. Useful for facts about the project, user preferences, or decisions that should persist across sessions.

Memories are written explicitly — either by the user adding a note, or by the Genie storing a fact when instructed.

## Search

Each section has its own search box — search artefacts in Artefacts, memories in Memories, and so on. The search box on the Scrolls home page searches your artefacts. Narrow any section to a single Genie with the Genie filter.

## FAQ

<details>
<summary>Scrolls vs Conversations?</summary>

A Conversation is a chat thread with a Genie. Scrolls is your account's library, collecting the outputs of work across all your Conversations and Genies — including messages worth surfacing outside the chat. Conversations focus on dialogue; Scrolls collects what the work produced.
</details>

<details>
<summary>Where do artefacts live?</summary>

Artefacts live in your account's library. Use the Genie filter to narrow the list to the Genie that produced them.
</details>

<details>
<summary>Are Pantry templates public?</summary>

No. Pantry templates are private to your account until you publish a version. Publishing a version puts that version in the [Bazaar](/concepts/bazaar/); the rest of the template stays private.
</details>

## Related

- [Agents](/concepts/agents/) — where most of the library's content originates.
- [Bazaar](/concepts/bazaar/) — public counterpart to private Pantry.
- [Playspecs & Templates](/concepts/playspecs/) — Templates can be authored into the Pantry first, then promoted to the Bazaar.
