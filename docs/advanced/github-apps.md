---
title: GitHub Apps
description: Install GitHub Apps for private repo access, CI triggers, and Genie integration.
slug: /advanced/github-apps
sidebar_position: 7
keywords: [GitHub, GitHub Apps, integration, private repos, CI, webhooks]
---

GitHub App installations. Used for private repo access, CI triggers, and direct Genie integration.

## What an installation grants

- **Repo cloning**: Props use the installation to clone private repositories. Fibe mints a short-lived installation token at clone time, reuses it for up to 50 minutes, then refreshes it automatically: nothing to rotate.
- **Webhooks**: push and pull-request events flow into Fibe to fire Tricks, refresh Template versions, and post [commit notifications](/advanced/notifications/).

Public repositories don't need an installation: they clone without one. Private repositories need one valid credential path: a GitHub App installation that covers the repo, a [Personal Access Token](/concepts/props/#3-paste-a-personal-access-token-per-prop) on the Prop, or the matching Gitea connection token for Gitea-backed Props. Fibe refuses to save a private Prop that has none of those.

Runtime Git operations can push code through an attached installation. Repository creation also needs write access. Trick results live in Fibe and can reach you via [webhooks](/advanced/webhooks/) and notifications.

## Install

1. Connect the GitHub identity that can access the repository or organization, then open Advanced → GitHub Apps. Your Fibe username can differ from that GitHub identity.
2. Click **Install GitHub App**. GitHub asks which account or organization and which repos to grant.
3. Pick repos. Return to Fibe; the installation is registered.

Multiple installations supported per account: one per org or per repo set.

Production and staging use separate GitHub Apps. An installation on `fibe.gg` does not connect `next.fibe.live`. Repository selection also matters: an installation on a personal account does not cover repositories owned by another organization. Repository status reports both `github_app_installed` (any connected installation) and `github_app_installed_for_repo` (the repository's runtime access).

If GitHub says the App is installed but Fibe cannot verify it, reconnect the GitHub identity that has access. Fibe retains the pending installation in that browser session and retries linking after OAuth. Expired authorizations saved before renewal support need one reconnect; their missing refresh token cannot be recovered. New authorizations retain encrypted refresh tokens and renew before expiry. GitHub describes the rotation protocol in [Refreshing user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens).

## Permissions

Cloning and reading source require repository contents read plus GitHub's mandatory metadata permission. Runtime pushes require contents write; creating repositories requires administration write. The hosted Apps currently also request email read and organization administration write. Those additional permissions come from the App's GitHub configuration. Changing Ruby or CLI code does not change the installation consent screen. Review that configuration separately before requesting broader organization access; keep existing repository creation and write workflows working when reducing permissions.

## Installation cards

Each installation appears as a card showing the GitHub account or organization it belongs to and when it was installed. Two actions:

- **Configure on GitHub**: opens GitHub's installation settings to change repo selection or permissions; Fibe picks up changes via GitHub's events.
- **Remove**: disconnects the installation from Fibe. Props using it lose access; existing Playgrounds keep running.

## Revoking

Remove from Fibe or uninstall from GitHub: either side disconnects the installation and deletes it from your account. If you uninstall from GitHub, Fibe removes every connection for that installation and clears it as the default installation for affected accounts. On Props that depended on it:

- Token minting stops immediately. Clones and syncs of private repos fail with an authentication error.
- Push and pull-request events stop arriving: no branch refresh, no push-triggered Tricks, no commit notifications.
- Props on public repos keep cloning. Props with their own Personal Access Token are unaffected.

To recover, reinstall the App and grant the same repositories. Affected Props resume without reconfiguration. You can instead paste a [Personal Access Token](/concepts/props/#3-paste-a-personal-access-token-per-prop) into each Prop.

## Related

- [Props](/concepts/props/): what consumes installations.
- [Tricks](/concepts/tricks/): CI consumers.
