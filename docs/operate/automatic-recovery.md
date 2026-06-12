---
title: What Fibe recovers on its own
description: Transient states that aren't problems — a brief outage, a missed healthcheck, TLS still provisioning — and how to tell "just wait" from "you need to act."
slug: /operate/automatic-recovery
sidebar_position: 4
image: /img/og/operate-automatic-recovery.png
keywords: [recovery, self-heal, healthcheck, TLS pending, redeploy, transient, is this normal, resilience]
---

Not every red moment is a problem. Fibe treats your environments as a **resilience contract**: transient blips are absorbed and healed automatically, so a momentary hiccup doesn't drag you in. Here's what clears on its own — and what actually needs you.

## Heals itself — just wait

- **A brief outage** (under a couple of minutes) is ignored. If it *persists*, Fibe automatically **redeploys** the environment to bring it back. To avoid thrashing, automatic redeploys hold off for the first **3 minutes** after an environment is created and for **10 minutes** after each redeploy — detection keeps running the whole time; only the action waits.
- **A reachable app stays viewable** even if a single healthcheck is missed. A missed healthcheck never stops or errors a running environment on its own.
- **"TLS pending" / "HTTPS provisioning"** is a normal state, **not a failure** — a certificate is being issued. It clears on its own, usually within a few minutes of a service first being exposed.
- **A stuck launch** is picked back up automatically — a launch that sits "in progress" for **30 minutes** is re-queued. A temporary infrastructure wobble — a brief network or host-connectivity blip — is **retried**, not treated as a hard failure.
- **A hung build won't spin forever** — a build still running after **45 minutes** is failed with a clear timeout error rather than left in "building" limbo.
- **A Genie that momentarily can't be reached** is left viewable and quietly redeployed if the outage holds; a mid-provisioning SSL handshake shows as "pending," never an error.
- **Trick runs are the exception**: once a run finishes or fails it stays that way — Fibe never redeploys a job run on its own. Re-run the Trick instead. (A launch that stalls before the run gets going is still picked back up automatically.)

## Needs you — act

These are real and won't fix themselves:

- A service that **crashes on startup** — bad image, missing variable, wrong bind address. Check the logs.
- A **validation error** on a Template or Playspec — the message names the fix.
- A genuinely **down or unreachable host** — firewall, disk full, key changed. The Marquee's connection test surfaces it.
- A **Trick that never exits** — the watched service isn't finishing.

See [Common problems & fixes](/operate/common-problems/) for the exact message → smallest-fix table.

## One caveat: funding

Automatic recovery, redeploys, and auto-expiration only run while the **Marquee is funded**. An unfunded Marquee's environments are left exactly as they are until you fund it again — nothing self-heals in the meantime. See [Billing — When your balance runs low](/concepts/billing/#when-your-balance-runs-low).

## See also

- [Common problems & fixes](/operate/common-problems/)
- [What deleting or disabling affects](/operate/cleanup-and-cascades/)
- [Billing — When your balance runs low](/concepts/billing/#when-your-balance-runs-low)
