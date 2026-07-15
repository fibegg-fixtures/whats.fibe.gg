---
title: prop
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Connect a GitHub repository — 3. Paste a Personal Access Token (per-Prop)

- Repo URL — https://github.com/owner/repo (an ssh://… URL also works).

- Repo URL — https://github.com/owner/repo (an ssh://… URL also works).

## Connect a built-in Gitea repository — Creating a Gitea repo

- Click Create Repository .

- Click Create Repository . Fibe creates the repo in Gitea and saves the Prop.

## Fibe product map — Hints

- Props are source repositories; dynamic services point at Props or repository URLs.

- Props are source repositories; dynamic services point at Props or repository URLs.

## Description

Use to build a Fibe template that runs a project's test suite on every git push or PR - job-mode + metadata.trigger config + watched service running pytest/npm test/rspec/etc.

Use to build a Fibe template that runs a project's test suite on every git push or PR - job-mode + metadata.trigger config + watched service running pytest/npm test/rspec/etc.

## Playbook: CI test runner on git push / PR — With source defaults: true

When this template is imported through a source-backed Prop, the runtime fills the trigger's repo url / branch from the Prop.

When this template is imported through a source-backed Prop, the runtime fills the trigger's repo url / branch from the Prop. Publishable to the Bazaar as a generic PR test runner template.

## What a Prop gives you — Supported providers

Provider URL shape Auth GitHub https://github.com/owner/repo or ssh://… GitHub App installation, or per-Prop Personal Access Token.

Provider URL shape Auth GitHub https://github.com/owner/repo or ssh://… GitHub App installation, or per-Prop Personal Access Token.
