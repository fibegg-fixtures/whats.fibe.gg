---
title: Runtime configuration
description: Atomic configuration groups, explicit inheritance and safe live integration changes.
slug: /advanced/runtime-configuration
image: /img/og/advanced-runtime-configuration.png
keywords: [runtime configuration, integration, inherit, clear, disabled]
---

The candidate super-admin settings page saves configuration by group. It displays saved/effective values, their sources, permanent ENV pins, readiness, revision and propagation. Save validates configuration without calling a provider. Read-only connection tests are explicit separate actions.

Precedence is process ENV, an explicit shared Value or Clear, eligible legacy encrypted credentials, then the code default. Inherit removes the shared override. Clear blocks lower fallback. Empty, false and zero values remain present. A process ENV pin requires a restart to change.

Groups may inherit, be enabled or be disabled. Stored credentials do not re-enable a disabled group. New optional integration work checks mode and readiness; existing cancellation, callback, download and cleanup obligations may retain valid existing credentials without authorizing new work.

Secrets are masked in ordinary responses. A blank secret field preserves its value; Replace, Clear and Inherit are explicit choices. Reveal requires an authenticated audited action and its browser display expires. Do not paste revealed values into reports or logs.

Each request, job or delivery captures an immutable configuration snapshot. Later edits apply to future operations, while retries remain bound to the admitted operation. A conflicting revision retains your draft for review. The saved database result may report pending propagation rather than undoing a successful save.

Public origin changes require a short-lived HTTPS verification bound to the candidate policy. Prepare routing, DNS and certificates first. Editing the draft or advancing its revision invalidates that verification. Already issued identity challenges retain their own origin and expiry.

Minimal setup uses local attachment storage and does not require optional S3. Disabled/unconfigured email is reported before registration, password-reset delivery or invitation state can claim success. An independent security change can succeed while its notification is explicitly reported unavailable.
