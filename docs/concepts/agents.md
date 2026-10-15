---
title: Agents
description: Configured AI assistants (Agents), Build in Public, and the artefacts and activity they leave behind.
slug: /concepts/agents
sidebar_position: 1
image: /img/og/concepts-agents.png
keywords: [Agent, Agent, AI assistant, providers, Claude, Gemini, Antigravity, OpenAI, Cursor, OpenCode, Pokes, conversations, Build in Public, Artefact, Mutter, Feedback]
---

A **Agent** is a configured AI assistant. You can keep one per job and run several conversations in each.

Two ways to use one:

- **Standalone chat:** Fibe starts a chat with its own URL on a chosen Host.
- **Inside a Playground:** open the Agent in a side panel to read logs, run commands, and edit source.

## Create an Agent

Open Bridge and click **Create Agent**, the row below your Agent list. With no Agents yet, Bridge shows "No agents yet" and the same Create Agent action. A new Agent that still needs credentials shows **Authenticate** in its pane.

For a guided first run through Hosts, Specs, Playgrounds and Agents, open **Profile → Advanced Settings → Setup guide** and click **Start setup wizard** (`/wizard`). The wizard runs on its own page; **Exit** returns you to the Setup guide, and its last step opens the new Agent in Bridge.

## Configure an Agent

- **Provider:** Gemini, Antigravity, Claude Code, OpenAI Codex, Cursor, or OpenCode.
- **Credentials:** OAuth, a device code, a credential bundle, an API key, or Fibe Mana where supported. Mana runs the provider through Fibe without personal provider keys and must be enabled on your profile. Cursor and Antigravity do not support it.
- **System prompt:** instructions that shape behavior.
- **Environment values:** variables available to the Agent process.
- **Model options:** context window, temperature, and provider settings.
- **Tool servers:** additional MCP servers.
- **Mounted files:** docs, prompts, fixtures, and scripts added to every working tree.
- **Post-init script:** setup such as `npm install`, run once when the environment starts.
- **Agent password:** protects the chat URL. Set a custom passphrase before the chat first starts on a Host. Existing chats keep their original password. Start on another Host or duplicate the Agent to get a new one.

## Credentials and status

A Agent can authenticate in three ways:

- **OAuth or device flow:** connect through the provider's browser flow.
- **API key or credential bundle:** store provider credentials on the Agent.
- **Fibe Mana:** Fibe runs the provider and bills Mana. Cursor and Antigravity do not support this mode.

If a linked Fibe API key stops working but provider credentials are still stored on the Agent, Fibe falls back to those provider credentials. If neither path works, the Agent needs re-authentication before it can run.

Agents move through five authentication statuses:

| Status | Meaning |
| --- | --- |
| **pending** | Created but not authenticated yet. |
| **authenticated** | Ready to run, as long as any expiration time is still in the future. |
| **expired** | Credential expired; re-authenticate before starting work. |
| **revoked** | Credentials and linked API key were cleared. |
| **deleting** | Cleanup is in progress. |

A Agent is usable only when it is **authenticated** and not expired.

## Settings cascade

Resolution order (most specific to most generic):

1. This Agent.
2. Your per-provider account default.
3. Your general account default.
4. Platform defaults.
5. Built-in defaults.

Map settings, including custom environment values and tool toggles, merge across levels. Account-level provider defaults apply to every matching Agent.

## Standalone chat

Pick an authenticated Agent and a Host. Fibe starts a chat with a protected URL. You can:

- Stop it (preserves history; restart later).
- Clean it up to also delete its working data.

Standalone chats do not expire. They run and recover automatically until stopped or cleaned up. They have no Playground.

Starting, restarting, messaging, interrupting, reading live state from, stopping, or cleaning up an Agent runtime requires the selected Host to be funded. Unpaid Hosts fail with `HOST_NOT_FUNDED`.

Other failures return stable codes. A busy Agent can queue the message. Invalid provider credentials require authentication. Stopped or unreachable chats report their state.

### Stop or clean up

A running Agent keeps chat state and caches in a Host workspace.

- **Stop:** turn off the runtime and keep its workspace. Restarting resumes it.
- **Clean up / purge:** remove the runtime and permanently delete its workspace. Use this to reclaim space or start fresh.

Agent settings, mounted files, credentials, and Build-in-Public options survive both actions. Cleanup removes only the Host workspace.

### Its name and URL

Each chat gets a stable subdomain such as `gandalf.<your-host-domain>`, covered by the Host's wildcard HTTPS certificate. A Agent has at most one live chat. Restarting it on the same Host reuses the address; starting it elsewhere assigns another stable address.

## Inside a Playground

Open an Agent in the side panel with access to the run's logs, terminal, source, and environment. It can:

- Debug failing services.
- Edit source.
- Run terminal commands.
- Generate artefacts (reports, diffs, mockups).
- Commit changes via in-browser git.
- Stay open while you work in other panes.

Switch Agents inside a Playground anytime.

## Conversations

Every chat is a **Conversation**: messages, replies, related activity stored together. A Agent holds many Conversations in parallel. Resume any later.

The **Inbox** collects activity outside a conversation, including notifications, Pokes, and broadcasts.

## Scheduled prompts

A **Poke** sends a prompt to a Conversation on a schedule. For example:

- Morning summary of new commits.
- Hourly deploy-log check.
- Weekly roadmap draft from open issues.

Each Poke has:

- A **cron schedule** (5-field POSIX).
- A **prompt body**.
- An optional **target Conversation**. The Inbox cannot be selected explicitly; leave the target empty to use it.

The minimum interval is five minutes. Pause or resume a Poke in Agent settings. If its target is deleted, scheduled runs fail until you pause it or choose another Conversation.

An unpaid Host blocks Poke delivery.

Each account has a Poke limit (20 by default). Creating a Poke past the limit fails with a clear quota error.

## Notifications on activity

When an Agent sends a message:

- An immediate in-app notification.
- An entry in the floating action button.
- A browser push notification, if enabled.

Audit-log entries don't notify. See [Audit log](/advanced/audit-log/).

## Agent example

```yaml
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

In a Playground, this Agent starts with the files, environment values, and installed dependencies.

## Build in Public

Opt selected Agents into your public profile. Visitors browse what you're working on without a Fibe account.

### Per-Agent toggle

The opt-in is per Agent: flip the toggle in an Agent's settings and that Agent appears on your public profile (which itself must be switched on in account settings). Other Agents stay private.

Examples:

- Public main side project, private client work.
- Experimental Agent kept private until it is ready.
- Public-facing demo Agent alongside private day-to-day Agents.

### Feature a Playground

With the toggle on, choose a Playground to feature, such as a live demo.

Rules:

- Only Playgrounds you can access are eligible.
- Turning Build in Public off clears the featured Playground.
- Featuring does **not** auto-publish the Playground. Public visibility of the Playground is separate.

### What visitors see

Public profile lists your build-in-public Agents. Visitors browse them. They can't sign in as you or modify anything. Account-level data (settings, Wallet, other Agents) stays private.

Each public Agent page shows:

- Name and short description.
- Featured Playground (if set) with its public URL.
- A timeline with artefact names, Mutter activity without note text, feedback, featured Playground rollouts, and your recent prompts to the Agent.

:::warning Opting in publishes the Agent's whole activity trail
A Build-in-Public page includes your recent messages to the Agent. Keep any Agent with private conversations out of Build in Public.
:::

### Typical setup

1. Create an Agent dedicated to the project's public work.
2. Run a dev Playground with a public URL.
3. Feature the Playground on the Agent.
4. Capture milestones as artefacts and Mutters for the public timeline.
5. Share your public profile URL.

## Artefacts, mutters, feedback

The trail your work leaves behind.

### Artefact

An output worth keeping, such as a report, screenshot, mockup, CSV, configuration, or preview. It attaches to the Playground or Agent that produced it.

Use when:

- A Agent generates a useful file.
- A Playground produces a build output (logs, report, diagram).
- You want to mark a moment.

All artefacts from a Build-in-Public Agent appear on its public timeline. There is no per-artefact visibility setting.

### Mutter

A short note about progress, evidence, or a problem, with optional screenshots.

Mutters describe **what happened**, not how. Good:

- "Migration on a fresh DB ran in 12s."
- "Healthcheck flapping. `start_period` is probably too short."
- "Pushed v2 of the auth flow. Preview at &lt;url&gt;."

Bad:

- "ERROR: connection refused." Paste the log into an artefact instead.
- "Refactored to use new ORM." This does not say what changed, why, or what remains.

### Feedback

Rate or review an Agent's output. Feeds back into how you judge an assistant for a given task.

Use when:

- A response was particularly useful or particularly off.
- You want to remember which Agent was good at which task.
- You're evaluating providers or system prompts.

### Activity timelines

Artefacts, Mutters, feedback, messages, failed Tasks, and rollouts appear chronologically in Playground and Agent timelines.

With Build in Public on, that Agent's timeline appears on your public profile.

## FAQ

<details>
<summary>How many Agents can I have?</summary>

Each account has an Agent limit (10 by default; it can be raised on request). Creating an Agent past the limit fails with a clear error. Usage shows up on your Wallet, not per Agent.
</details>

<details>
<summary>Two Agents share a Conversation?</summary>

No. Each Conversation belongs to one Agent. Switch Agents (new Conversation) or copy context across.
</details>

<details>
<summary>Does an Agent see my code?</summary>

In a Playground, it sees mounted files. In standalone chat, it sees prompts and files mounted on that Agent. Files do not leak across Agents.
</details>

<details>
<summary>Pokes and the Wallet?</summary>

Each Poke run costs the underlying model call. Poke settings show the last run's status and error, plus how many times the Poke has been sent.
</details>

<details>
<summary>Can visitors chat with my public Agent?</summary>

No. Visitors can only read the profile and timeline. They cannot send messages or change anything.
</details>

<details>
<summary>Turning Build in Public off?</summary>

The Agent disappears from the public profile. Old URLs return 404. Re-enable to restore.
</details>

<details>
<summary>Profile public without opt-in Agents?</summary>

Your profile page is private by default. Turn the public profile on in your account settings; visitors then see your Build-in-Public Agents there. Both switches matter: the account-level profile *and* the per-Agent opt-in.
</details>

<details>
<summary>Artefacts stored forever?</summary>

Agent artefacts are immutable. They remain in your account after the Playground or Agent is deleted. You can edit or delete artefacts created manually in the library.

This matters for Build in Public: the only way to take an Agent's artefacts off your public timeline is to turn that Agent's opt-in off.
</details>

<details>
<summary>Artefact vs file in a Repository?</summary>

A **Repository file** is source code in Git. An **artefact** is an output or snapshot.
</details>

## Related

- [Playgrounds](/concepts/playgrounds/): where Agents attach.
- [Run the MCP server](/sdk/mcp-server/): how Agents and external agents call Fibe.
- [Advanced → Agent Defaults](/advanced/agent-defaults/): account defaults for new Agents.
- Reference: [`fibe-agents-and-automation`](/reference/fibe-agents-and-automation/).
