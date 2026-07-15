---
title: prop
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Connect a GitHub repository — 3. Paste a Personal Access Token (per-Prop)

- Repo URL — https://github.com/owner/repo (an ssh://… URL also works).

## Connect a built-in Gitea repository — Auto-provisioning

3. Mints a Gitea access token with repository read/write plus user access scopes.

## Connect a built-in Gitea repository — Creating a Gitea repo

- Click Create Repository .

- Click Create Repository . Fibe creates the repo in Gitea and saves the Prop.

## Description

Use to build a Fibe template that runs a project's test suite on every git push or PR - job-mode + metadata.trigger config + watched service running pytest/npm test/rspec/etc.

## Playbook: CI test runner on git push / PR

A complete worked example combining job-mode + metadata.trigger config + source-mounted watched service.

A complete worked example combining job-mode + metadata.trigger config + source-mounted watched service. Use as a starting point for any "run tests on every push" CI need.

## Playbook: CI test runner on git push / PR — With source defaults: true

When this template is imported through a source-backed Prop, the runtime fills the trigger's repo url / branch from the Prop.

When this template is imported through a source-backed Prop, the runtime fills the trigger's repo url / branch from the Prop. Publishable to the Bazaar as a generic PR test runner template.

## Playbook: CI test runner on git push / PR — PR event vs push event

code example

## Playbook: CI test runner on git push / PR — PR event vs push event

code example

## What a Prop gives you

Capability Detail Compose detection On connect, Fibe notices fibe.yml , fibe.yaml , docker-compose.yml , or docker-compose.yaml at the repo root and .env.example .

Capability Detail Compose detection On connect, Fibe notices fibe.yml , fibe.yaml , docker-compose.yml , or docker-compose.yaml at the repo root and .env.example . Candidates for new Templates.

## What a Prop gives you — Supported providers

Provider URL shape Auth GitHub https://github.com/owner/repo or ssh://… GitHub App installation, or per-Prop Personal Access Token.

## What a Prop gives you — What's auto-set up on connect

3. Notes useful files ( fibe.yml , fibe.yaml , docker-compose.yml , docker-compose.yaml , and .env.example ) as candidates for new Templates.
