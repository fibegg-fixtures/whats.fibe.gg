---
title: Library
description: "Search artefacts, notes, messages, provider traces, memories, reusable templates and ENV packs."
slug: /concepts/library
sidebar_position: 3
image: /img/og/concepts-library.png
keywords: [Library, artefacts, mutters, memories, Templates, ENV packs, provider traces, raw logs]
---

**Library** collects your artefacts, mutters, messages, feedback, activity, conversations, provider traces, memories, reusable templates and ENV packs. Browse by section and use the search and filters available for that content. Several activity sections can be narrowed by Agent.

Open Library for notes and files, inspect raw provider logs when an AI session needs debugging, or open **Templates** to reuse a configuration.

## What lives in Library

| Item | What it is |
| --- | --- |
| **Artefacts** | Files and notes produced during work: reports, screenshots, mockups, CSVs, snippets, interactive previews. |
| **Mutters** | Short progress notes: what was tried, where things broke, what's left. |
| **Feedback** | Ratings and reviews of Agent output. |
| **Messages** | Conversation messages worth surfacing outside the chat. |
| **Conversations** | Transcripts of your chats with Agents. |
| **Activity** | Higher-level events: messages sent, Tasks run, rollouts. |
| **Raw provider traces** | Captured provider request, response and metadata for debugging an AI session. |
| **Memories** | Persistent notes the Agent or the user marked as worth remembering. |
| **Templates** | Your saved reusable Templates. |
| **ENV packs** | Named maps of readable environment values that you pick when creating a Playground. |

The Agent filter is available in Artefacts, Mutters, Feedback, Messages, Activity and Raw provider traces. It is not a universal Library filter.

## Authoring artefacts

Create an artefact directly in the Artefacts section:

- **Title**: your reference.
- **Description**: short summary (optional).
- **Body**: Markdown content. The editor surfaces a body placeholder until you start writing.

Agent-created artefacts appear in the same library and carry a creator badge. Their content is read-only. While the Agent still exists, you can toggle the artefact's skill and skill-enabled flags; downloads are also available where a file is attached.

## Raw provider traces

The Library shows captured provider requests, responses and metadata. Depending on the Agent's capture settings, a trace may redact or truncate values or omit request or response bodies. Use traces to investigate wrong answers, refused tool calls and context-window failures.

Treat available traces as sensitive because they can contain prompts, replies and other session data.

<span id="pantry" />

## Templates

Open **Library → Templates** to manage templates for your personal workspace or the selected Team. Select a template to work with it.

- Edit its name, description, image, or category.
- Create a version when the template body changes. Each version is an immutable snapshot.
- Import a version into a Spec at launch time.

## ENV packs

The ENV packs section lists the packs of the owner selected in the Team pill, with an owner column showing Personal or the Team name. Create, edit and delete packs here, then pick them when you create a Playground, or as packs for scheduled runs on a job-mode Spec. Packs are readable values, not a secret vault. See [ENV packs](/concepts/env-packs/).

## Memories

A memory is a tagged note available to future conversations, such as a project fact, preference, or lasting decision.

Memories are written explicitly: either by the user adding a note, or by the Agent storing a fact when instructed.

## Search

Use the search and filter controls available in each section. The Agent filter is available in Artefacts, Mutters, Feedback, Messages, Activity and Raw provider traces, but not in Memories, Templates or ENV packs. The search box on the Library home page searches Artefacts.

## FAQ

<details>
<summary>Library vs Conversations?</summary>

A Conversation is a chat thread with an Agent. Library is your account's library, collecting the outputs of work across all your Conversations and Agents: including messages worth surfacing outside the chat. Conversations focus on dialogue; Library collects what the work produced.
</details>

<details>
<summary>Where do artefacts live?</summary>

Artefacts live in your account's library. Use the Agent filter to narrow the list to the Agent that produced them.
</details>

<details>
<summary>Are Library templates public?</summary>

Templates are private to their workspace until you publish a version. Publishing a version puts that version in the [Bazaar](/concepts/bazaar/); the rest of the template stays private.
</details>

## Related

- [Agents](/concepts/agents/): where most of the library's content originates.
- [Bazaar](/concepts/bazaar/): browse published template versions.
- [ENV packs](/concepts/env-packs/): picking packs per Playground and grants.
- [Specs & Templates](/concepts/specs/): create a template in the Library and publish a version to the Bazaar.
