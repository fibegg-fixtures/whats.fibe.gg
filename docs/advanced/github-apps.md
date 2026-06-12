---
title: GitHub Apps
description: Install GitHub Apps for private repo access, CI triggers, and Genie integration.
slug: /advanced/github-apps
sidebar_position: 7
keywords: [GitHub, GitHub Apps, integration, private repos, CI, webhooks]
---

GitHub App installations. Used for private repo access, CI triggers, and direct Genie integration.

## What an installation grants

- **Repo cloning** — Props use the installation to clone private repositories. Fibe mints a short-lived installation token at clone time, reuses it for up to 50 minutes, then refreshes it automatically — nothing to rotate.
- **Webhooks** — push and pull-request events flow into Fibe to fire Tricks, refresh Template versions, and post [commit notifications](/advanced/notifications/).

Public repositories don't need an installation — they clone without one. Private repositories need either an installation that covers them or a [Personal Access Token](/concepts/props/#3-paste-a-personal-access-token-per-prop) on the Prop; Fibe refuses to save a private Prop that has neither.

Fibe doesn't write back to GitHub today — no commit statuses, no PR comments. Trick results live in Fibe and can reach you via [webhooks](/advanced/webhooks/) and notifications.

## Install

1. Open the Advanced → GitHub Apps page.
2. Click **Install GitHub App**. GitHub asks which account or organization and which repos to grant.
3. Pick repos. Return to Fibe; the installation is registered.

Multiple installations supported per account — one per org or per repo set.

## Installation cards

Each installation appears as a card showing the GitHub account or organization it belongs to and when it was installed. Two actions:

- **Configure on GitHub** — opens GitHub's installation settings to change repo selection or permissions; Fibe picks up changes via GitHub's events.
- **Remove** — disconnects the installation from Fibe. Props using it lose access; existing Playgrounds keep running.

## Revoking

Remove from Fibe or uninstall from GitHub — either side disconnects the installation and deletes it from your account. On Props that depended on it:

- Token minting stops immediately. Clones and syncs of private repos fail with an authentication error.
- Push and pull-request events stop arriving — no branch refresh, no push-triggered Tricks, no commit notifications.
- Props on public repos keep cloning. Props with their own Personal Access Token are unaffected.

To recover, reinstall the App and grant the same repos — affected Props resume working without re-configuration — or paste a [Personal Access Token](/concepts/props/#3-paste-a-personal-access-token-per-prop) into each affected Prop.

## Related

- [Props](/concepts/props/) — what consumes installations.
- [Tricks](/concepts/tricks/) — CI consumers.
