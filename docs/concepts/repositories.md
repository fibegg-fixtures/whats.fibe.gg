---
title: Repositories
description: A Repository is a connected Git repository. Fibe reads branches and files from it, mounts source into containers, and reacts to pushes.
slug: /concepts/repositories
sidebar_position: 5
image: /img/og/concepts-repositories.png
keywords: [Repository, Git repository, GitHub, GitHub App, Gitea, PAT, Personal Access Token, source control, branches, webhook, Compose detection]
---

A **Repository** is a connected Git repository. Fibe clones it for builds, mounts it for dev, triggers Tasks on push.

Without a Repository, a Template can still use static `image:` entries. A Repository adds branches, commits, live source, and push-triggered jobs.

## What a Repository gives you

| Capability | Detail |
| --- | --- |
| **Branch discovery** | Every branch listed for launchers to pick. |
| **Source for builds** | Templates that say `fibe.gg/repo_url: <this repository>` clone at launch. |
| **Live source mount** | Dev services mount the working tree. Edits show up live. |
| **Compose detection** | On connect, Fibe notices `fibe.yml`, `fibe.yaml`, `docker-compose.yml`, or `docker-compose.yaml` at the repo root and `.env.example`. Candidates for new Templates. |
| **Push notifications** | Refresh branch list, fire source-linked Templates that track changed files, trigger listening Tasks. |
| **In-browser git** | Stage, commit, push from the Playground terminal. |
| **Per-commit history** | What landed and when. |

## Supported providers

Two providers, each with its own auth path:

| Provider | URL shape | Auth |
| --- | --- | --- |
| **Gitea** | A Gitea repository reachable by the installation | Use a configured Gitea connection with access to that repository. |
| **GitHub** | `https://github.com/owner/repo` or `ssh://…` | GitHub App installation, or per-Repository Personal Access Token. |

Other providers (GitLab, Bitbucket, and arbitrary Git servers) are not supported by the Repository URL validator. To use code from another host, mirror it into the Fibe Git service when that service is configured for your installation.

## Connect a GitHub repository

Three ways, in order of preference:

### 1. Connect the configured GitHub integration

Best when you have multiple private repos in the same org and want webhooks + CI to work without per-Repository token management.

1. Open **Profile → Advanced Settings → GitHub Apps** (or the Team GitHub settings for a Team-owned Repository).
2. Connect the GitHub identity and installation configured for this Fibe deployment.
3. Grant access to the repository or its organization.
4. Return to Repositories and attach the repository. Check its status if the source cannot be read.

Multiple installations per account are supported (one per org or repo set). Detail: [Advanced → GitHub Apps](/advanced/github-apps/).

### 2. Link your GitHub account

Open **Profile → Advanced Settings → GitHub Apps** and choose **Connect GitHub**. This links the GitHub identity to your Fibe account; it does not grant access to private repositories by itself. Public repositories can be read without an installation. For private repositories, install the configured GitHub App or provide a repository credential.

Registering a GitHub Repository is a separate check: personal owners need a current verified write path, through a connected personal GitHub identity with push access or a per-Repository PAT with push access. A Team-owned Repository must use its verified Team GitHub installation. Public content being readable does not by itself authorize a new Repository registration.

### 3. Paste a Personal Access Token (per-Repository)

Best for one-off integrations or when you can't install the App (no admin rights on the org).

When creating a Repository from the **GitHub Repository** tab:

- **Repo URL**: `https://github.com/owner/repo` (an `ssh://…` URL also works).
- **Default branch**: defaults to the repo default.
- **Credentials (Personal Access Token)**: paste a PAT.
  - **Classic PAT** with the `repo` scope, **or** a **fine-grained PAT** scoped to the specific repo with the relevant permissions (contents read/write, metadata read).
  - Format `ghp_…` (classic) or `github_pat_…` (fine-grained).
  - Stored encrypted on the Repository. Used at clone time and for the API calls the Repository needs (read/write contents, metadata).

PATs are per-Repository and don't share across Repositories. Rotate from the Repository's settings page when the token expires.

When **both** an App installation and a PAT are available, the PAT wins. The Repository uses what's set on its `credentials` field; if blank, it falls back to the App installation token.

## Use the Fibe Git service

Fibe can provide Gitea-backed repositories when the installation administrator has configured the Fibe Git service. This service is an integration, not a second Fibe application bundled in the control-plane image. Provisioning is optional and does not block account creation. If enabled, Fibe provisions an account and credential for the selected owner; the new Repository flow can create a Gitea repository or import a public GitHub repository into the private Fibe Git service.

### Account provisioning

When managed provisioning is enabled, account creation queues Gitea provisioning in the background. Existing accounts may be queued by an installation administrator. Provisioning failures are retried by the server; if it remains pending, use the retry control on the Git service connection page. Account registration itself does not wait for Gitea.

### Where the Gitea credentials live

When credentials are available, **Profile** shows a **Gitea account** card:

- **Username**: same as your Fibe username.
- **Password**: the random one generated at provisioning. Copy it from the card. Hidden by default; click to reveal.
- **Profile**: link to your Gitea profile page.
- **Sign in**: link to the Gitea sign-in page. Gitea uses a separate session from Fibe.

Use these to log into Gitea directly (push from the command line, browse the web UI, etc.).

### Reset credentials

If you lose the password or want to rotate:

1. Open **Profile → Advanced Settings → GitHub Apps** and choose **Reset Git credentials** on the Fibe Git service card.
2. Confirm the sensitive action with your second factor.
3. Fibe generates a new password and a new access token for your Gitea account; reset tokens carry `write:repository`, `read:repository`, `write:user`, and `read:user` access. The new password appears on the card, and all your Gitea Repositories pick up the new token automatically. (A token you pasted into a specific Repository's Credentials field is not touched.)

### Creating a Gitea repo

In **Repositories → New Repository**, choose the **New Repository** tab:

- **Repo name**: letters, digits, dashes, underscores, or dots; must be unique in your Gitea account (e.g. `my-new-app`).
- **Private**: toggle.
- Click **Create Repository**. Fibe creates the repo in Gitea and saves the Repository.

The repo is owned by your Gitea user. You can push to it via HTTPS using your Gitea credentials or access token. The configured Fibe Git service does not offer SSH access.

### Provisioning failures

The server retries provisioning failures with bounded backoff and periodically admits eligible accounts again. While an account is pending, open **Profile → Advanced Settings → GitHub Apps** and choose **Retry connection** on the Fibe Git service card. An uncertain provider mutation is held for operator review rather than blindly repeated.

## What's auto-set up on connect

Whatever the provider and auth path, on creation Fibe:

1. Resolves the repo URL. Validates the format.
2. Discovers branches.
3. Notes useful files (`fibe.yml`, `fibe.yaml`, `docker-compose.yml`, `docker-compose.yaml`, and `.env.example`) as candidates for new Templates.
4. Configures push notifications. The configured Fibe Git service delivers events for its own repositories. GitHub push and pull-request events require the Fibe GitHub App; a Repository with only a PAT does not receive GitHub push events.

## Pushes

On commit, Fibe:

1. Refreshes the branch list.
2. Auto-publishes new Template versions for any source-linked Template tracking a changed file.
3. Fires Tasks configured for that push or PR.
4. Posts a commit notification when the Repository's **Notifications** toggle is on. See [Inbox Notifications](/advanced/notifications/).
5. Pulls the commit into running Playgrounds on the same branch without a rollout. Fibe skips any service where pulling would overwrite local changes. Updates depend on the Host being reachable and the workload being eligible for source maintenance; one-shot Tasks are not updated as live development work.

The configured Fibe Git service delivers its push events; the Fibe GitHub App delivers GitHub push and pull-request events.

Branch and commit state is read from the connected Git provider during synchronization.

## Editing source from a Playground

Playground terminal has full git tooling. The UI exposes a diff view, commit message field, push button.

Commits go back to the Repository. The push notification fires. Source-linked Templates and Tasks react.

## Repositories are owner-scoped

Each Personal or Team owner has its own Repository record and provider authority. Two owners can connect the same upstream URL independently. Team resources use Team-owned connections where configured.

If you fork a Template that points at someone else's Repository, your fork doesn't get access to their repository. Connect your own Repository (or a fork of theirs).

## Source-linked Templates

A Template can point to a Repository file, usually the root Compose file. This has two effects:

1. **Auto-publish on file change.** New commits touching the file → new Template version. Body is the file at that commit.
2. **CI Task.** Enable CI on the Template and Fibe creates a Task that runs against the latest version on push or PR.

See [Specs → Source-linked Templates](/concepts/specs/#source-linked-templates-the-strongest-pattern) for details.

## FAQ

<details>
<summary>Which is better: GitHub App or PAT?</summary>

App, when you can install it: installation tokens are short-lived, scoped per-installation, and webhook delivery is managed centrally. PATs are convenient when you can't install the App (no org admin rights) or for one-off Repositories.
</details>

<details>
<summary>Can I use a PAT for an arbitrary git host (GitLab, Bitbucket, self-hosted)?</summary>

No. The `credentials` field works only for GitHub URLs. The URL validator rejects other hosts. To bring code in from elsewhere, push or import a mirror into the configured Fibe Git service.
</details>

<details>
<summary>Fine-grained vs classic PAT?</summary>

Both work. Prefer a fine-grained PAT scoped to one repository. A classic PAT with `repo` scope covers all repositories.
</details>

<details>
<summary>What happens when a PAT expires?</summary>

Clones and the Repository's API calls fail. The Repository surfaces an authentication error on the next sync. Paste a fresh PAT into the Repository's Credentials field to fix.
</details>

<details>
<summary>Rotate credentials on a Repository?</summary>

Yes. Re-authenticate or paste a new PAT in Repository settings, then revoke the old token on GitHub.
</details>

<details>
<summary>Where's my Gitea password if I never saved it?</summary>

Open **Profile** and reveal the password on the Gitea account card. If the password isn't visible ("Password is not saved for this account"), click **Reset credentials** to mint a new one.
</details>

<details>
<summary>Can I SSH into Gitea?</summary>

No. The configured Fibe Git service uses HTTPS. Clone and push with the credentials shown on your profile or Git connections page.
</details>

<details>
<summary>Are repos created through Fibe public or private?</summary>

Choose with the **Private** toggle. New Fibe Git service repositories default to private. The form lets you choose privacy when creating a repository; GitHub repositories retain the upstream visibility. See the SDK [greenfield flow](/sdk/workflows/).
</details>

<details>
<summary>Deleted Repository?</summary>

You cannot delete a Repository referenced by a Spec. The error names each blocker; remove or repoint them first.
</details>

## Related

- [Advanced → GitHub Apps](/advanced/github-apps/): install and manage GitHub App installations.
- [Hosts](/concepts/hosts/): where source runs.
- [Specs](/concepts/specs/): Templates and the launches they produce.
- [Tasks](/concepts/tasks/): what fires on pushes.
- Reference: [`recipe-build-to-repo-url`](/reference/recipe-build-to-repo-url/), [`recipe-source-mount`](/reference/recipe-source-mount/), [`mode-trigger-vcs`](/reference/mode-trigger-vcs/).
