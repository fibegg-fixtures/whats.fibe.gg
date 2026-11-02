---
title: GitHub Apps
description: Install GitHub Apps for private repo access, CI triggers, and Agent integration.
slug: /advanced/github-apps
sidebar_position: 7
keywords: [GitHub, GitHub Apps, integration, private repos, CI, webhooks]
---

GitHub App installations. Used for private repo access, CI triggers, and direct Agent integration.

## What an installation grants

- **Repo cloning**: Repositories use the installation to clone private repositories. Fibe mints a short-lived installation token at clone time, reuses it for up to 50 minutes, then refreshes it automatically: nothing to rotate.
- **Webhooks**: push and pull-request events flow into Fibe to fire Tasks, refresh Template versions, and post [commit notifications](/advanced/notifications/).

Public repositories don't need an installation: they clone without one. Private repositories need one valid credential path: a GitHub App installation that covers the repo, a [Personal Access Token](/concepts/repositories/#3-paste-a-personal-access-token-per-repository) on the Repository, or the matching Gitea connection token for Gitea-backed Repositories. Fibe refuses to save a private Repository that has none of those.

Runtime Git operations can push code through an attached installation. Repository creation also needs write access. Task results live in Fibe and can reach you via [webhooks](/advanced/webhooks/) and notifications.

## Install

1. Connect the GitHub identity that can access the repository or organization, then open Advanced → GitHub Apps. Your Fibe username can differ from that GitHub identity.
2. Click **Install GitHub App**. GitHub asks which account or organization and which repos to grant.
3. Pick repos. Return to Fibe; the installation is registered.

Multiple installations supported per account: one per org or per repo set.

Each Fibe installation has its own GitHub App configuration. Repository selection matters: an installation on a personal account does not cover repositories owned by another organization. Repository status distinguishes a connected installation from access to a particular repository.

If GitHub says the App is installed but Fibe cannot verify it, reconnect the GitHub identity that has access. Fibe retains the pending installation in that browser session and retries linking after OAuth. Expired authorizations saved before renewal support need one reconnect; their missing refresh token cannot be recovered. New authorizations retain encrypted refresh tokens and renew before expiry. GitHub describes the rotation protocol in [Refreshing user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens).

## Permissions

Cloning and reading source require repository contents read plus GitHub's mandatory metadata permission. Runtime pushes require contents write; creating repositories requires administration write. The configured GitHub App may request permissions beyond repository reads. Those permissions come from the GitHub App configuration, so review the consent screen and limit access to what your installation needs.

## Installation cards

Each installation appears as a card showing the GitHub account or organization it belongs to and when it was installed. Two actions:

- **Configure on GitHub**: opens GitHub's installation settings to change repo selection or permissions; Fibe picks up changes via GitHub's events.
- **Remove**: disconnects the installation from Fibe. Repositories using it lose access; existing Playgrounds keep running.

## Revoking

Remove from Fibe or uninstall from GitHub: either side disconnects the installation and deletes it from your account. If you uninstall from GitHub, Fibe removes every connection for that installation and clears it as the default installation for affected accounts. On Repositories that depended on it:

- Token minting stops immediately. Clones and syncs of private repos fail with an authentication error.
- Push and pull-request events stop arriving: no branch refresh, no push-triggered Tasks, no commit notifications.
- Repositories on public repos keep cloning. Repositories with their own Personal Access Token are unaffected.

To recover, reinstall the App and grant the same repositories. Affected Repositories resume without reconfiguration. You can instead paste a [Personal Access Token](/concepts/repositories/#3-paste-a-personal-access-token-per-repository) into each Repository.

## Related

- [Repositories](/concepts/repositories/): what consumes installations.
- [Tasks](/concepts/tasks/): CI consumers.
