---
title: Billing
description: Plans, Wallet, Mana, Sparks, top-ups, subscriptions, referrals, Runes. Everything that goes through Profile → Billing.
slug: /concepts/billing
sidebar_position: 9
image: /img/og/concepts-billing.png
keywords: [Billing, Wallet, Mana, Sparks, plan, subscription, top-up, referral, Rune]
---

Everything financial — plans, balance, subscriptions, referrals — lives in **Profile → Billing**. Fibe doesn't push monthly subscriptions on you. You hold a balance in two currencies and spend on action.

## Wallet

The Wallet holds your account balance. It's the page you'll see most often under Billing.

### What the Wallet page shows

- **Current balance** in each of the two currencies (see below).
- **History** — every credit and debit, with a description and a link to the resource that triggered it. Every entry is labeled (top-up, grant, referral reward, conversion), so you can see where each credit came from.
- **Debt** — unpaid days show up as a debt on the affected Marquee (and in the emails Fibe sends); the debt settles automatically out of your next credit.

### Top up

From the Wallet page:

1. Pick an amount, or pick a top-up pack (bundles at a small discount).
2. Pay via the billing provider shown in the checkout flow.
3. Balance credited — usually immediately, sometimes after the provider clears the transaction.

Purchase amounts are bounded: by default the minimum Mana checkout is $10 and the maximum is 100,000 Mana, in multiples of 10 Mana — amounts outside those bounds are rejected at checkout.

Balance can also arrive without a checkout: a **[referral](#referrals)** reward, or an occasional **grant** the platform issues directly.

### Auto-recharge

Auto-recharge is a recurring top-up, not a balance watcher: enable it on the Mana purchase form (a bundle checkout turns it on automatically) and the chosen amount is bought on a schedule — every 30 or 365 days, matching the billing interval you picked. It doesn't react to the balance level, so size it above your daily burn.

Use auto-recharge for production setups where you don't want a Marquee blocked because the balance hit zero — a correctly sized recharge keeps Marquees funded.

## Mana

Mana is the **primary** currency. Use it for anything persistent.

### What Mana pays for

- **Tutorial (platform-managed) Marquees** — their daily running cost is debited from Mana.
- **Conversion into Sparks** — one-way; Sparks are what standard (self-hosted) Marquees burn each day. Bundle checkouts convert automatically.

### Bundles

Buy bundles from the Billing page. Each Marquee's own page shows its daily cost, whether your balance covers it, and a **"Fund until"** date you control — Fibe debits one day at a time while that window is open.

## Sparks

Sparks are the **second** currency: they pay the daily running cost of standard (self-hosted) Marquees.

### What Sparks pay for

Sparks pay the **daily running cost of standard (self-hosted) Marquees**. You get Sparks by converting Mana — bundle checkouts do this automatically, or convert manually from the Wallet page.

### Mana → Sparks conversion

Convert Mana to Sparks at a fixed rate from the Wallet page. One-way: Sparks can't be converted back to Mana.

## Subscriptions

If you're on a plan that includes recurring entitlements — a managed Marquee, a feature bundle, anything else billed on a cycle — those show up in the **Active Subscriptions** section of the Billing page.

Per-subscription columns:

- **Plan** — what's being subscribed to.
- **Provider** — the billing provider (e.g. card on file, third-party processor).
- **Period** — current billing cycle dates.
- **Status** — active, past due, cancelled, etc.

If your subscription row shows a Cancel action, use it; otherwise contact support to cancel. Cancellation takes effect immediately — not at the end of the billing period — and stops future recharges only: balance already credited stays in your Wallet. To change plans, buy a different bundle from the Billing page.

## Referrals

Share your **referral code** with people who'd benefit from Fibe. Your code gives the new player a discount at checkout, and your reward (in Sparks) posts to your Wallet after their first qualifying purchase with the code. Each referred account is rewarded once, ever — a player who has already been referred can't be claimed again with a different code, and referring yourself doesn't count.

The Billing page shows:

- **Your Code** — the referral code unique to your account.
- **Referrals desc** — a short description of the program (terms, payout, current promotion).
- **Referred** — how many accounts have signed up using your code.

## Runes

A **Rune** is an invite code. The Billing page shows your own Rune — share it to invite people to Fibe. Each Rune carries a hard redemption cap: once that many sign-ups have used it, the code stops working. A Rune can also be bound to a specific email address **or** to an email domain — one or the other, never both — and only matching addresses can redeem it.

The page shows:

- **Rune** — your code.
- **Used** — how many of its invites have been redeemed.

## What's free

You don't need to spend anything to:

- Sign up.
- Author Templates privately.
- Browse the [Bazaar](/concepts/bazaar/).

You start spending when you fund your first Marquee — tutorial Marquees are billed daily in Mana (bought as the Tutorial bundle), and Genie chats need a funded Marquee to run on.

## When your balance runs low

A funded Marquee is charged once per day — tutorial Marquees from your **Mana** balance, standard Marquees from your **Sparks** balance. Days are **service days**: fixed midnight-to-midnight windows in UTC, and a day counts as paid only when it's funded through to that day's end (billing intervals count 30 service days per month, 365 per year). Every Marquee has a **"Fund until"** date on its page: Fibe debits one day at a time while that window is open, and the page shows the daily rate and the projected cost to your chosen date. If a day's charge can't be covered, the Marquee winds down on a predictable, recoverable path — it doesn't vanish without warning.

### 1 · Runtime blocked, grace period starts

The moment a daily charge fails, runtime actions on the Marquee are blocked and a **grace period** begins (3 days by default — the exact deadline is in the email you receive when grace starts):

- **New runtime actions are blocked.** Launching, rolling out, restarting, refreshing diagnostics, and pulling logs return a **`MARQUEE_NOT_FUNDED`** message. Read-only views and your Billing pages keep working.
- **What's already running keeps running**, but Fibe stops actively managing it. On a **self-hosted** Marquee, running Playgrounds stay up — they just won't auto-recover, auto-expire, or pick up edits until you fund again. On a **platform-managed** (tutorial) Marquee, the Marquee is taken out of service: its Playgrounds are flagged as not funded and can no longer be used or managed, and its Genie chats are stopped — stored data is kept until the removal step.

Nothing is deleted yet; the unpaid amount is tracked as a debt on the Marquee.

### 2 · Grace ends → suspended

If grace passes and the balance still can't cover the Marquee, it moves to **suspended** — and repeated funding failures get there sooner: after 2 grace incidents, the next failed charge suspends the Marquee immediately, with no new grace period. It stays off and the debt stands. You'll have been emailed along the way.

### 3 · Suspended too long → removed (managed Marquees only)

A suspended, still-unpaid **platform-managed** Marquee that passes its retention window (7 days after suspension by default) can be scheduled for removal and eventually **destroyed — and a destroyed Marquee takes its Playgrounds, Tricks, and their data with it.** That's the point of no return, which is why grace and emails come first.

A **self-hosted** Marquee — your own server — is **never deleted by Fibe**. Left unpaid it's disabled and suspended, but your machine and its data stay yours; you simply lose Fibe's management until you re-enable it.

### Getting back to normal

- **Top up** before removal. As soon as the credit lands, outstanding charges settle first, then the Marquee can be re-enabled: a self-hosted Marquee's apps were never touched, and on a managed Marquee your Playgrounds and Genie chats can be started again.
- **Turn on [auto-recharge](#auto-recharge)** sized above your daily burn — the balance is then replenished on a schedule, so a correctly sized recharge keeps Marquees funded.

:::warning Grace is a safety net, not a plan
For any Marquee running real work, keep a buffer or enable auto-recharge. A removed managed Marquee takes its data with it.
:::

## FAQ

<details>
<summary>Do credits expire?</summary>

No — Mana and Sparks balances don't expire, whether purchased or granted.
</details>

<details>
<summary>Refunds?</summary>

Unused balance is refundable within a reasonable window after purchase. Specific items follow standard SaaS conventions. The checkout flow shows the policy.
</details>

<details>
<summary>Cheapest way to start?</summary>

The Tutorial bundle — a platform-managed Marquee billed daily in Mana, no server of your own needed. Move to your own host when ready for real work.
</details>

<details>
<summary>Sparks needed but I only have Mana?</summary>

Convert on the Wallet page at the fixed rate. Immediate. One-way.
</details>

<details>
<summary>What happens if my balance hits zero?</summary>

Runtime actions on the affected Marquee are **blocked** and a grace period starts — a platform-managed Marquee is also switched to Disabled, while a self-hosted one keeps its status but every runtime action returns `MARQUEE_NOT_FUNDED`. What's already running on a **self-hosted** Marquee keeps running — just unmanaged until you fund again. If it stays unpaid through grace it's **suspended**, and a **platform-managed** Marquee can eventually be **removed**, taking its environments with it. A self-hosted Marquee is never deleted by Fibe; your host machine stays yours. Full path: [When your balance runs low](#when-your-balance-runs-low). Auto-recharge avoids the whole thing.
</details>

<details>
<summary>Where do I see the invoice for a top-up?</summary>

The Wallet history shows the order reference for each purchase; the invoice/receipt comes from the billing provider (check the email from checkout).
</details>

## Related

- [Marquees](/concepts/marquees/) — the daily spender (Mana for tutorial hosts, Sparks for standard ones).
- [Agents](/concepts/agents/) — run on funded Marquees.
- [Advanced → Limits & Quotas](/advanced/limits/) — what your plan-level quotas are.
- [Advanced → Data Backup](/advanced/backup/) — covered by your plan, not a Sparks spend.
