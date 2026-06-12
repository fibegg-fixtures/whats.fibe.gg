---
title: Inbox Notifications
description: Choose which events trigger notifications — in-app toasts and browser push. New notification types are opt-in.
slug: /advanced/notifications
sidebar_position: 10
keywords: [notifications, toasts, inbox, events, push, browser push]
---

Choose which events trigger notifications — in-app toasts, and optionally browser push to your devices. New notification types added by Fibe are disabled until you enable them.

## Groups

Notifications are grouped:

- **Player & Security** — sign-ins, security changes.
- **Playground** — launch, rollout, error, destroy.
- **AI Agents & Apps** — Genie messages, Pokes, Build-in-Public activity.
- **Content & Dev** — Templates, Props, Compose detection.
- **Drift & Playguard** — environment drift, healthcheck flapping.
- **Integrations** — webhooks, GitHub Apps.

Each group has its own list of event types with a per-event toggle.

:::tip
Commit notifications have a second gate on the [Prop](/concepts/props/) itself: each Prop carries a **Notifications** toggle, on by default. Flip it off on the Prop's card to silence commit alerts from that one repository without touching your account-wide toggles.
:::

## Bulk toggles

**Enable all** / **Disable all** buttons at the top of the page flip every notification type at once; within each group you toggle events individually.

## Push to your devices

Besides in-app toasts, Fibe can send **browser push notifications**, so you still hear about Genie replies, Pokes, and Playground events when the Fibe tab is closed.

- Turn push on for the current browser from the notification settings.
- Each browser or device subscribes separately and can be removed individually.
- Installing Fibe as an app on your phone or desktop gives the same notifications there.

Push respects the same per-event toggles as toasts.

## Default state

New notification types arrive disabled. You opt in explicitly. This is intentional — Fibe never enables a new toast for you.

## Related

- [Webhooks](/advanced/webhooks/) — for events that should go to an external system instead of a toast.
- [Props](/concepts/props/) — the per-Prop Notifications toggle that gates commit alerts.
