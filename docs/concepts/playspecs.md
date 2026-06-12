---
title: Playspecs
description: A Playspec is a launch blueprint. A Template is a reusable recipe many Playspecs can share. Both manage what a launch becomes — from different angles.
slug: /concepts/playspecs
sidebar_position: 6
image: /img/og/concepts-playspecs.png
keywords: [Playspec, blueprint, launch, Template, Template Version, variables, Bazaar, reproducibility, bulk upgrade, fork, publish, source-linked]
---

A **Playspec** is a launch blueprint — one configured launch, ready to fire. A **Template** is a reusable recipe a Playspec is launched from. Many Playspecs can share one Template. Both manage what a launch becomes, from different angles: the Playspec carries the launch-time values; the Template carries the body.

This page covers both, in that order.

## Playspecs

A Playspec points at a Template version, holds variable values, and lists mounted files. Launching it produces a [Playground](/concepts/playgrounds/) on the Marquee you choose at launch.

### What a Playspec stores

| Field | What it holds |
| --- | --- |
| **Template Version** | The frozen Template snapshot to launch from. May be omitted if launched from raw YAML. |
| **Variable values** | Inputs the Template asks for. |
| **Marquee** | Chosen at each launch — not stored on the Playspec. The Playground records which Marquee it runs on. Scheduled and CI-triggered Tricks name their target Marquee in the automation settings. |
| **Mounted files** | Optional uploads attached at launch (e.g. seed data, credentials). |
| **Schedule / triggers** | Optional automation (cron, VCS push). Applies to Tricks. |

Re-launch the same Playspec months later and you get an equivalent environment. The Template Version is frozen; the variables are stored; you pick the Marquee at launch.

### Launching

Pick a Template (or paste raw YAML), pick a Marquee, fill variables, click Launch. The resulting Playspec is saved. Launching is repeatable from the Playspec itself.

### Editing a Playspec

Edits to a Playspec don't touch the running Playground. The Playground keeps running until you apply the change:

- **Rollout** — apply with the least disruption available.
- **Hard restart** — full stop and start.

(If Fibe has to repair the Playground for another reason, the repair also picks up your latest Playspec.)

Prep changes in advance, apply on your schedule.

### Switch to a newer Template version

When a new Template version exists, every Playspec bound to that Template can be switched:

1. Open the Playspec.
2. Fibe surfaces the new version with a diff preview.
3. Apply. The Playspec is bound to the new version and, by default, its running Playgrounds are rolled out immediately. You can choose to roll out a single Playground or none, and apply later with a manual rollout.

Trick (job) Playspecs bound to a Template can be **bulk-upgraded** to a version in one step. Service Playspecs are switched one at a time from the Playspec page.

This control only applies to Playspecs with a source Template Version. A Playspec launched from raw YAML has nothing to switch to.

### Launch without a Template

Paste a Compose file into a new Playspec, set variables, go. Use a Template only when you want reuse, sharing, auto-publish from a [Prop](/concepts/props/) file, or [Bazaar](/concepts/bazaar/) publication.

For a one-off run, skip the Template entirely.

## Templates

A Template is a reusable environment recipe — a Docker Compose file plus a few Fibe additions (labels, optional settings block). Author privately, iterate, keep for yourself or publish to the [Bazaar](/concepts/bazaar/).

Templates keep launches reproducible. Two people launching the same Template version get the same starting environment.

For authoring a Template from scratch — Compose-to-Fibe conversion, label and settings-block reference, recipes, playbooks — see the top-level **[Fibe Templates](/authoring/overview/)** section.

### Lifecycle

1. **Create.** Paste a Compose file, import from a connected [Prop](/concepts/props/), fork an existing Template, or take one from the [Bazaar](/concepts/bazaar/).
2. **Publish a Version.** A frozen snapshot of body + variables + metadata + automation settings. New launches default to the latest suitable version.
3. **Existing Playspecs** keep the version they launched from. Switching is explicit — see [Switch to a newer Template version](#switch-to-a-newer-template-version) above.
4. **Source-linked Templates** auto-publish a new version when the linked file changes.
5. **Fork any time.** Forks are independent. They don't track the source.

### Versions are frozen

Published versions can't change. Edits become a new Version with a new ID. This is what makes a Playspec reproducible — it always knows the exact Version it came from.

### Source-linked Templates — the strongest pattern

A Template can point at a file in a [Prop](/concepts/props/). The environment recipe lives in source control alongside your code.

When creating a Template, point it at:

- A specific **Prop**.
- A specific **file path** (usually `docker-compose.yml` at the repo root).
- Optionally a specific **branch** (defaults to the repo default).

Then:

- New commits touching that file **auto-publish a new Template version**. The body is the file at that commit.
- Flip the **CI** toggle and Fibe creates a dedicated Trick that runs against the latest version on push or pull request.

This keeps Templates editable in normal source control — PRs, code review, branch protection — and Fibe stays in sync without pasting.

### `source_defaults`

Inside a Template's metadata, set `source_defaults: true`. Launching the Template from a Prop then auto-fills the repo URL and branch into dynamic services and any `trigger_config`.

File-linking and `source_defaults` are distinct:

- **File-linking** — *where the Template body lives* (in a Prop's file).
- **`source_defaults`** — *how launch-time values are populated* (from the importing Prop).

Use either, both, or neither. See [Fibe Templates → Settings block](/authoring/settings-block/).

### Test before sharing

Before publishing to the [Bazaar](/concepts/bazaar/):

- Real test launch from a fresh setup. No leftover state.
- Confirm variables are honest. No hidden hardcoded values.
- Capture screenshots in the launch's mutters.
- Walk the [publishing checklist](/operate/publishing/).

## FAQ

<details>
<summary>Template vs Playspec?</summary>

A **Template** is a reusable recipe. A **Playspec** is one configured launch — picks a Template Version, fills variables, picks a Marquee, mounts files. Many Playspecs can derive from the same Template.
</details>

<details>
<summary>Can two Playspecs share the same launch values?</summary>

Yes. Both can point at the same Template Version with the same variables. They produce equivalent Playgrounds. Each Playground runs independently.
</details>

<details>
<summary>Two Playgrounds from one stateful template?</summary>

Not from the same Playspec. A Playspec that **persists volumes** allows only **one active Playground** at a time, so two instances can't fight over the same named data. Launch a second Playspec from the same Template (each keeps its own data), or stop or destroy the first.
</details>

<details>
<summary>How do I delete a Playspec?</summary>

Destroy the Playground first, then delete the Playspec.
</details>

<details>
<summary>How do I delete a Template?</summary>

You can delete a Template at any time. Playspecs launched from it keep their body and keep running, but lose the link — no more version suggestions, switching, or upgrades. If you want to keep that lineage, keep the Template.
</details>

<details>
<summary>Template vs Compose file in the repo?</summary>

If the Template is source-linked, the repo file *is* the body. Edits become new Template versions automatically. If not source-linked, the body lives in Fibe. Edit it in the UI.
</details>

## Related

- [Props](/concepts/props/) — where source-linked Template bodies live.
- [Playgrounds](/concepts/playgrounds/) — what a Playspec produces when launched.
- [Marquees](/concepts/marquees/) — where Playgrounds run.
- [Bazaar](/concepts/bazaar/) — public Template marketplace.
- [Tricks](/concepts/tricks/) — Playspecs run as one-shot jobs.
- **[Fibe Templates](/authoring/overview/)** — full authoring guide: Compose-to-Fibe, labels, settings block, recipes, playbooks.
- Reference: [`fibe-resource-lifecycles`](/reference/fibe-resource-lifecycles/), [`convert-compose-to-fibe`](/reference/convert-compose-to-fibe/), [`recipe-add-metadata`](/reference/recipe-add-metadata/).
