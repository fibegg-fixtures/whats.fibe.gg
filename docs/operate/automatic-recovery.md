---
title: What Fibe recovers on its own
description: "Transient states that aren't problems: a brief outage, a missed healthcheck, TLS still provisioning, and how to tell \"just wait\" from \"you need to act.\""
slug: /operate/automatic-recovery
sidebar_position: 4
image: /img/og/operate-automatic-recovery.png
keywords: [recovery, self-heal, healthcheck, TLS pending, redeploy, transient, is this normal, resilience]
---

Fibe recovers from several transient failures automatically. This page separates states that clear on their own from failures that need action.

## Heals itself: just wait

- **A brief outage** (under a couple of minutes) is ignored. If it *persists*, Fibe automatically **redeploys** the environment to bring it back. To avoid thrashing, automatic redeploys hold off for the first **3 minutes** after an environment is created and for **10 minutes** after each redeploy: detection keeps running the whole time; only the action waits.
- **A reachable app stays viewable** even if a single healthcheck is missed. A missed healthcheck never stops or errors a running environment on its own.
- **"TLS pending" / "HTTPS provisioning"** is a normal state, **not a failure**: a certificate is being issued. It clears on its own, usually within a few minutes of a service first being exposed.
- **A stuck launch** is picked back up automatically: a launch that sits "in progress" for **30 minutes** is re-queued. A temporary infrastructure wobble, a brief network or host-connectivity blip, is **retried**, not treated as a hard failure.
- A build still running after **45 minutes** fails with a timeout.
- **Agent chat recovery is bounded and observation-based.** A Host cycle can queue one repair for an eligible stored-running chat after a positive HTTP 404 health response, under the chat's captured start authority. Timeouts and unknown observations do not queue repair. An explicit health probe reports a TLS handshake failure as `ssl_pending` without queueing a redeploy. This is not a general promise that an Agent redeploys after any sustained outage. See [Agents](/concepts/agents/) and the current API contract for the installed build.
- **Task runs are the exception**: a finished or failed run stays that way. Fibe does not redeploy it. Run the Task again instead. A launch that stalls before execution still recovers automatically.

## Needs you: act

These are real and won't fix themselves:

- A service that **crashes on startup**: bad image, missing variable, wrong bind address. Check the logs.
- A **validation error** on a Template or Spec: the message names the fix.
- A genuinely **down or unreachable host**: firewall, disk full, key changed. The Host's connection test surfaces it.
- A **Task that never exits**: the watched service isn't finishing.

See [Common problems & fixes](/operate/common-problems/) for the exact message → smallest-fix table.

## Host availability

Recovery requires the Host and its Docker runtime to be reachable. If a Host is down or disabled, Fibe cannot perform remote repair until the installation can reach it again. Inspect the Host runtime status and pending operation before retrying.

## See also

- [Common problems & fixes](/operate/common-problems/)
- [What deleting or disabling affects](/operate/cleanup-and-cascades/)
- [Hosts](/concepts/hosts/): connection and runtime status.
