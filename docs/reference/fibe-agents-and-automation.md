---
title: "Agents And Automation"
description: "Use to explain Native Agents, Tasks, and supported scheduled or repository-triggered workflows."
slug: /reference/fibe-agents-and-automation
sidebar_label: "Agents And Automation"
image: /img/og/reference-fibe-agents-and-automation.png
keywords: ["Fibe", "Foundation", "fibe", "agents", "and", "automation"]
tags: ["reference", "foundation"]
format: md
---

Use this guide when a workflow involves an Agent or work that should run without remaining as a long-lived Playground. Exact Agent providers, credential methods, and automation options depend on the installed Native API and its configuration; check the current interface and API contract before prescribing a specific integration.

## Agents

An Agent is an assistant configuration used in supported Fibe workflows. An Agent can be associated with work around a Playground or a conversation, depending on the configuration available in the installation. Keep provider credentials in the installation's supported credential storage. Do not put API keys or credential bundles in Compose files, Repository content, or logs.

## Tasks

Use a Task for finite work such as tests, checks, or a scheduled operation. A Task's command should exit when its work is complete so the run can record its result. Use a Playground for an application or development environment that should continue running.

Compose job configuration and the watched service behavior determine how a task run completes. See [job mode](mode-job-task.md) for the Compose pattern and limits described by the current schema.

## Scheduled and repository-triggered work

Where enabled in the Native installation, a schedule or Repository event can start a Task. Confirm the Repository, event or schedule configuration, target Host, and Task Spec before enabling automation. Check the Task run's status and logs to diagnose failures.

Automation runs with the access of its configured owner and credentials. Keep those credentials scoped to the required Repository and task, and review recorded changes through Audit Logs.

## Related skills

- [fibe-product-map](fibe-product-map.md) for the core resource model.
- [mode-job-task](mode-job-task.md) for finite Task configuration.
- [mode-schedule-cron](mode-schedule-cron.md) for scheduled Tasks.
- [mode-trigger-vcs](mode-trigger-vcs.md) for Repository-triggered Tasks.
- [fibe-security-access-and-integrations](fibe-security-access-and-integrations.md) for credential handling.
