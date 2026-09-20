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
- **A Genie that momentarily can't be reached** is left viewable and quietly redeployed if the outage holds; a mid-provisioning SSL handshake shows as "pending," never an error.
- **Trick runs are the exception**: a finished or failed run stays that way. Fibe does not redeploy it. Run the Trick again instead. A launch that stalls before execution still recovers automatically.

## Needs you: act

These are real and won't fix themselves:

- A service that **crashes on startup**: bad image, missing variable, wrong bind address. Check the logs.
- A **validation error** on a Template or Playspec: the message names the fix.
- A genuinely **down or unreachable host**: firewall, disk full, key changed. The Marquee's connection test surfaces it.
- A **Trick that never exits**: the watched service isn't finishing.

See [Common problems & fixes](/operate/common-problems/) for the exact message → smallest-fix table.

## One caveat: funding

Automatic recovery, redeploys, and auto-expiration only run while the **Marquee is funded**. An unfunded Marquee's environments are left exactly as they are until you fund it again: nothing self-heals in the meantime. See [Billing: When your balance runs low](/concepts/billing/#when-your-balance-runs-low).

## See also

- [Common problems & fixes](/operate/common-problems/)
- [What deleting or disabling affects](/operate/cleanup-and-cascades/)
- [Billing: When your balance runs low](/concepts/billing/#when-your-balance-runs-low)
