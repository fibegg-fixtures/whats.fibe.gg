---
title: Agents
description: Configured AI assistants (Genies), Build in Public, and the artefacts and activity they leave behind.
slug: /concepts/agents
sidebar_position: 1
image: /img/og/concepts-agents.png
keywords: [Agent, Genie, AI assistant, providers, Claude, Gemini, Antigravity, OpenAI, Cursor, OpenCode, Pokes, conversations, Build in Public, Artefact, Mutter, Feedback]
---

A **Genie** is a configured AI assistant. Keep many — one per job. Each holds many parallel conversations.

Two ways to use one:

- **Standalone chat** — Fibe starts a chat with its own URL on a chosen Marquee.
- **Inside a Playground** — open the Genie as a side panel. It reads logs, runs commands, edits source.

## Configure a Genie

- **Provider** — Gemini, Antigravity, Claude Code, OpenAI Codex, Cursor, OpenCode.
- **Credentials** — provider-specific (OAuth, device code, pasted bundle, API key). Stored securely. Where offered, you can skip provider credentials entirely with ✨ Fibe Mana — the Genie runs through Fibe using your Mana, no personal provider keys needed (not available for every provider; requires Fibe Mana to be set up on your profile).
- **System prompt** — shapes behavior. E.g. "careful refactoring assistant; prefer minimal diffs; explain reasoning".
- **Custom environment values** — env vars the Genie process sees.
- **Model options** — context window, temperature, provider-specific options.
- **Custom tool servers** — additional MCP servers.
- **Mounted files** — docs, prompts, fixtures, scripts in the working tree on every run.
- **Post-init script** — runs once on environment setup. Use for `npm install`, dependency setup, anything pre-work.
- **Agent password** — every Genie's chat URL is password-protected; Fibe generates one automatically, and you can set your own passphrase. Set it before the chat's first start on a Marquee: a chat keeps the password it was first created with there, and changing the passphrase later doesn't update an existing chat's URL. To get a fresh password, start the chat on a different Marquee (or duplicate the Genie).

## Settings cascade

Resolution order (most specific to most generic):

1. This Genie.
2. Your per-provider account default.
3. Your general account default.
4. Platform defaults.
5. Built-in defaults.

Hash-shaped settings (custom env, tool toggles) **merge across all levels** instead of replacing. Change "my default Claude model" once on the account; every Claude-based Genie picks it up.

## Standalone chat

Pick an authenticated Genie and a Marquee. Fibe starts a chat with a protected URL. You can:

- Stop it (preserves history; restart later).
- Clean it up to also delete its working data.

Standalone chats don't expire — a chat keeps running (and is automatically recovered if it becomes unreachable) until you stop or clean it up. No Playground attached. Useful for ideation and docs search.

Starting, restarting, messaging, interrupting, reading live state from, stopping, or cleaning up a Genie runtime requires the selected Marquee to be funded. Unpaid Marquees fail with `MARQUEE_NOT_FUNDED`.

Other delivery failures are explicit too: a Genie that is mid-task returns a *busy* error (you can ask Fibe to queue the message as a queued turn instead), a Genie whose provider credentials need re-authentication returns an *authentication-needed* error, and a chat that isn't running or can't be reached says exactly that. Each comes back as a stable error code, so scripts and agents can branch on it.

### Stop vs. clean up — what happens to a Genie's data

A running Genie keeps a small **workspace** on its Marquee (chat working state and caches). Two actions treat it very differently:

- **Stop** — turns the runtime off but **keeps the workspace**, so restarting resumes where you left off. Safe and reversible — the default.
- **Clean up / purge** — tears the runtime down **and permanently deletes that workspace**. Irreversible. Use it to reclaim space or start a Genie completely fresh.

Your **Agent configuration** — settings, mounted files, credentials, Build-in-Public toggles — lives on the Agent itself, not the runtime, so it survives stop, restart, *and* clean-up. Only the on-Marquee working data is removed by a clean-up.

### Its name and URL

Each chat gets a **stable, friendly subdomain** on its Marquee (something like `gandalf.<your-marquee-domain>`), and **HTTPS just works** — the Marquee's wildcard certificate already covers it, with no per-chat setup. A Genie has **at most one live chat at a time**. Each Marquee reserves a stable name and URL for it: restarting on the same Marquee reuses the same address, and after you stop the chat you can start it on a different Marquee, where it gets its own name and URL.

## Inside a Playground

Open a Genie as a side panel. It gets the run's context — logs, terminal, source, environment — and can:

- Debug failing services.
- Edit source.
- Run terminal commands.
- Generate artefacts (reports, diffs, mockups).
- Commit changes via in-browser git.
- Stay open while you work in other panes.

Switch Genies inside a Playground anytime.

## Conversations

Every chat is a **Conversation**: messages, replies, related activity stored together. A Genie holds many Conversations in parallel. Resume any later.

The special **Inbox** conversation collects general activity outside any thread — notifications, pokes, broadcasts.

## Pokes — scheduled prompts

A **Poke** sends a prompt to a Conversation on a recurring schedule. Useful for:

- Morning summary of new commits.
- Hourly deploy-log check.
- Weekly roadmap draft from open issues.

Each Poke has:

- A **cron schedule** (5-field POSIX).
- A **prompt body**.
- An optional **target Conversation**. Explicitly picking the Inbox is refused at validation; if you leave the target empty, runs land in the Inbox.

Minimum interval: **five minutes**. Pause/resume from the Genie's settings. If the target Conversation is deleted, the Poke keeps its schedule but every run is recorded as failed (target missing) until you pause it or point it at another Conversation.

Scheduled Pokes claim and reschedule normally, but delivery to a Genie is blocked when the backing Marquee is unpaid.

## Notifications on activity

When a Genie sends a message:

- **In-app notification** surfaces immediately.
- Entry in the **FAB** (floating-action-button area).
- **Browser web-push** if enabled.

Audit-log entries don't notify. See [Audit log](/advanced/audit-log/).

## Genie example

```yaml
# Conceptual — set in the UI, not YAML
name: Refactorer
provider: Claude Code
system_prompt: |
  Careful refactoring assistant. Prefer the smallest possible diff. Run
  the relevant tests before claiming a change is done. Quote the test
  output back to me.
mounted_files:
  - ARCHITECTURE.md
  - STYLE_GUIDE.md
post_init: npm install --silent
custom_env:
  NODE_ENV: test
```

Opened in a Playground, the Genie has the docs, the env vars, and a clean install before you say a word.

## Build in Public

Opt selected Genies into your public profile. Visitors browse what you're working on without a Fibe account.

### Per-Genie toggle

The opt-in is per Genie: flip the toggle in a Genie's settings and that Genie appears on your public profile (which itself must be switched on in account settings). Other Genies stay private.

Use cases:

- Public main side project, private client work.
- Experimental Genie kept private until interesting.
- Public-facing demo Genie alongside private day-to-day Genies.

### Feature a Playground

With the toggle on, pick one of your Playgrounds to feature — typically a live demo. Visitors land on the Genie's page and see that Playground.

Rules:

- Only Playgrounds you can access are eligible.
- Turning Build in Public off clears the featured Playground.
- Featuring does **not** auto-publish the Playground. Public visibility of the Playground is separate.

### What visitors see

Public profile lists your build-in-public Genies. Visitors browse them. They can't sign in as you or modify anything. Account-level data (settings, Wallet, other Genies) stays private.

Each public Genie page shows:

- Name and short description.
- Featured Playground (if set) with its public URL.
- A timeline of that Genie's activity — artefact names, mutter activity (the note text itself stays hidden), feedback comments, rollout events for the featured Playground, **and your recent prompts to that Genie**.

:::warning Opting in publishes the Genie's whole activity trail
A Build-in-Public Genie's page includes the text of your recent messages to it. Don't opt a Genie in if its conversations contain anything you wouldn't share — keep private work on Genies that stay out of Build in Public.
:::

### Typical setup

1. Create a Genie tuned to your project — and dedicated to public work.
2. Run a dev Playground with a public URL.
3. Feature the Playground on the Genie.
4. Capture milestones as artefacts and mutters — they appear on the public timeline.
5. Share your public profile URL.

## Artefacts, mutters, feedback

The trail your work leaves behind.

### Artefact

A generated output worth keeping — report, screenshot, mockup, CSV, config snippet, interactive preview. Attaches to the Playground or Genie that produced it.

Use when:

- A Genie generates a useful file.
- A Playground produces a build output (logs, report, diagram).
- You want to mark a moment.

If the owning Genie is opted into Build in Public, its artefacts appear on the public timeline — there is no per-artefact visibility switch. Keep private outputs on Genies that stay out of Build in Public.

### Mutter

A short progress, evidence, or issue note. Capture a "here's what I tried" or "here's where it broke", with screenshots optional.

Mutters describe **what happened**, not how. Good:

- "Migration on a fresh DB ran in 12s."
- "Healthcheck flapping. `start_period` is probably too short."
- "Pushed v2 of the auth flow. Preview at &lt;url&gt;."

Bad:

- "ERROR: connection refused." Paste the log into an artefact instead.
- "Refactored to use new ORM." Vague — what changed, why, what's left?

### Feedback

Rate or review a Genie's output. Feeds back into how you judge an assistant for a given task.

Use when:

- A response was particularly useful or particularly off.
- You want to remember which Genie was good at which task.
- You're evaluating providers or system prompts.

### Activity timelines

Artefacts, mutters, feedback, plus higher-level events (Genie sent a message, Trick failed, Playground rolled out) roll up into per-Playground and per-Genie timelines. Chronological order.

With Build in Public on, that Genie's timeline appears on your public profile.

## FAQ

<details>
<summary>How many Genies can I have?</summary>

Each account has a Genie limit (10 by default; it can be raised on request). Creating a Genie past the limit fails with a clear error. Usage shows up on your Wallet, not per Genie.
</details>

<details>
<summary>Two Genies share a Conversation?</summary>

No. Each Conversation belongs to one Genie. Switch Genies (new Conversation) or copy context across.
</details>

<details>
<summary>Does a Genie see my code?</summary>

In a Playground: yes — files mounted there. Standalone chat: only what you give in prompts plus mounted files. Mounted files don't leak across Genies.
</details>

<details>
<summary>Pokes and the Wallet?</summary>

Each Poke run costs the underlying model call. Poke settings show the last run's status and error, plus how many times the Poke has been sent.
</details>

<details>
<summary>Can visitors chat with my public Genie?</summary>

No. Conversations belong to you. Visitors only read the profile page and its timeline — they can't send messages or modify anything.
</details>

<details>
<summary>Turning Build in Public off?</summary>

The Genie disappears from the public profile. Old URLs return 404. Re-enable to restore.
</details>

<details>
<summary>Profile public without opt-in Genies?</summary>

Your profile page is private by default. Turn the public profile on in your account settings; visitors then see your Build-in-Public Genies there. Both switches matter: the account-level profile *and* the per-Genie opt-in.
</details>

<details>
<summary>Artefacts stored forever?</summary>

Artefacts a Genie produced are kept as an immutable record — they can't be edited or deleted, and they stay in your account-level artefact list even after the producing Playground or Genie is gone. Artefacts you created yourself in the artefact library can be edited or deleted anytime.

This matters for Build in Public: the only way to take a Genie's artefacts off your public timeline is to turn that Genie's opt-in off.
</details>

<details>
<summary>Artefact vs file in a Prop?</summary>

A **Prop file** is source code in git. An **artefact** is a produced output — result of running something, snapshot of a state.
</details>

## Related

- [Playgrounds](/concepts/playgrounds/) — where Genies attach.
- [Run the MCP server](/sdk/mcp-server/) — Genies (and external agents) call Fibe directly. Conversation tools come from this server.
- [Advanced → Agent Defaults](/advanced/agent-defaults/) — account-wide defaults for new Genies.
- Reference: [`fibe-agents-and-automation`](/reference/fibe-agents-and-automation/).
