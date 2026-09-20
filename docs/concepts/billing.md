---
title: Billing
description: Plans, Wallet, Mana, Sparks, top-ups, subscriptions, referrals, Runes. Everything that goes through Profile → Billing.
slug: /concepts/billing
sidebar_position: 9
image: /img/og/concepts-billing.png
keywords: [Billing, Wallet, Mana, Sparks, plan, subscription, top-up, referral, Rune]
---

Manage plans, balances, subscriptions, and referrals under **Profile → Billing**. Fibe uses two currencies and charges for usage.

## Wallet

The Wallet holds your account balance.

### What the Wallet page shows

- **Current balance** in both currencies.
- **History:** labeled credits and debits, with descriptions and links to the resources that caused them.
- **Debt:** unpaid Marquee days, also reported by email. New credit settles the debt first.

### Top up

From the Wallet page:

1. Pick an amount or discounted pack.
2. Pay via the billing provider shown in the checkout flow.
3. Receive the balance, usually immediately or after the provider clears the payment.

By default, Mana purchases range from $10 to 100,000 Mana in multiples of 10 Mana. Checkout rejects other amounts.

Balance can also arrive without a checkout: a **[referral](#referrals)** reward, or an occasional **grant** the platform issues directly.

### Auto-recharge

Auto-recharge buys a fixed amount every 30 or 365 days. Enable it on the Mana purchase form; bundle checkout enables it automatically. It does not react to your balance, so choose an amount above your daily use.

Use a sufficient auto-recharge to keep production Marquees funded.

## Mana

Mana is the **primary** currency. Use it for anything persistent.

### What Mana pays for

- **Tutorial Marquees:** their daily cost is charged in Mana.
- **Sparks:** a one-way conversion used to fund standard, self-hosted Marquees. Bundle checkout converts automatically.

### Bundles

Buy bundles from Billing. Each Marquee shows its daily cost, available balance, and a **Fund until** date. Fibe charges one day at a time through that date.

## Sparks

Sparks are the **second** currency: they pay the daily running cost of standard (self-hosted) Marquees.

### What Sparks pay for

Sparks pay the daily cost of standard, self-hosted Marquees. Convert Mana manually in the Wallet or automatically through bundle checkout.

### Mana → Sparks conversion

Convert Mana to Sparks at a fixed rate from the Wallet page. One-way: Sparks can't be converted back to Mana.

## Subscriptions

Recurring plans appear under **Active Subscriptions** in Billing.

Per-subscription columns:

- **Plan:** the subscribed product.
- **Provider:** the billing provider.
- **Period:** current billing cycle.
- **Status:** active, past due, cancelled, or another provider state.

Use the Cancel action when shown; otherwise contact support. Cancellation is immediate and stops future recharges. Existing Wallet credit remains. Buy another bundle to change plans.

## Referrals

Your **referral code** gives a new player a checkout discount. Their first qualifying purchase adds a Sparks reward to your Wallet. Each account can be referred once, and self-referrals do not count.

The Billing page shows:

- **Your Code:** your referral code.
- **Referrals desc:** current terms, payout, and promotion.
- **Referred:** number of accounts registered with your code.

## Runes

A **Rune** is an invite code with a redemption limit. It stops working at that limit. A Rune may be restricted to one email address or one email domain, but not both.

The page shows:

- **Rune:** your code.
- **Used:** redeemed invites.

## What's free

You don't need to spend anything to:

- Sign up.
- Author Templates privately.
- Browse the [Bazaar](/concepts/bazaar/).

Spending starts when you fund a Marquee. Tutorial Marquees charge Mana daily, and Genie chats require a funded Marquee.

:::info Staging update: 13 September 2026
On [next.fibe.live](https://next.fibe.live), delayed or repeated subscription
cancellation jobs recheck the server's current funding and entitlement. They follow
normal billing grace and retention instead of deleting playground records or
storage immediately. Renewed funding is checked again before retention cleanup,
and a failed infrastructure removal request does not mark the server as removed.
This correction has not yet been promoted to fibe.gg. Retention still applies;
this is not a promise of indefinite hosting or storage without payment.
:::

## When your balance runs low

A funded Marquee is charged daily: Mana for tutorial Marquees and Sparks for standard ones. A service day runs from midnight to midnight UTC and is paid only when funded through its end. Billing intervals contain 30 service days per month or 365 per year. Each Marquee shows its daily rate, projected cost, and **Fund until** date. If a charge fails, the Marquee enters the recovery process below.

### 1. Runtime blocked, grace starts

When a daily charge fails, runtime actions are blocked and a grace period begins. The default is three days; the grace email gives the deadline.

- **New runtime actions are blocked.** Launching, rolling out, restarting, refreshing diagnostics, and pulling logs return a **`MARQUEE_NOT_FUNDED`** message. Read-only views and your Billing pages keep working.
- **Self-hosted workloads keep running** without automatic recovery, expiration, or updates. A tutorial Marquee goes out of service: Playgrounds become unavailable and Genie chats stop. Stored data remains until removal.

Nothing is deleted yet; the unpaid amount is tracked as a debt on the Marquee.

### 2. Grace ends and suspension begins

If the balance still cannot cover the Marquee after grace, it becomes **suspended**. After two grace incidents, the next failed charge suspends it immediately. The Marquee stays off and keeps its debt. Fibe sends email during this process.

### 3. Managed Marquee removal

An unpaid platform-managed Marquee may be removed after its retention window, seven days after suspension by default. Destruction permanently removes its Playgrounds, Tricks, and their data.

Fibe never deletes a self-hosted server. An unpaid one becomes disabled and suspended, but its machine and data remain yours. Fibe management resumes after re-enabling it.

### Getting back to normal

- **Top up** before removal. As soon as the credit lands, outstanding charges settle first, then the Marquee can be re-enabled: a self-hosted Marquee's apps were never touched, and on a managed Marquee your Playgrounds and Genie chats can be started again.
- **Enable [auto-recharge](#auto-recharge)** with enough credit to cover daily use.

:::warning Grace is a safety net, not a plan
For any Marquee running real work, keep a buffer or enable auto-recharge. A removed managed Marquee takes its data with it.
:::

## FAQ

<details>
<summary>Do credits expire?</summary>

No. Purchased and granted Mana and Sparks do not expire.
</details>

<details>
<summary>Refunds?</summary>

Unused balance is refundable within a reasonable window after purchase. Specific items follow standard SaaS conventions. The checkout flow shows the policy.
</details>

<details>
<summary>Cheapest way to start?</summary>

The Tutorial bundle provides a managed Marquee billed daily in Mana, with no server required.
</details>

<details>
<summary>Sparks needed but I only have Mana?</summary>

Convert on the Wallet page at the fixed rate. Immediate. One-way.
</details>

<details>
<summary>What happens if my balance hits zero?</summary>

Runtime actions return `MARQUEE_NOT_FUNDED` and grace begins. A managed Marquee becomes disabled. Workloads on a self-hosted Marquee keep running without Fibe management. Continued nonpayment causes suspension and may eventually remove a managed Marquee and its environments. Fibe never deletes a self-hosted server. See [When your balance runs low](#when-your-balance-runs-low).
</details>

<details>
<summary>Where do I see the invoice for a top-up?</summary>

The Wallet history shows the order reference for each purchase; the invoice/receipt comes from the billing provider (check the email from checkout).
</details>

## Related

- [Marquees](/concepts/marquees/): daily charges in Mana or Sparks.
- [Agents](/concepts/agents/): run on funded Marquees.
- [Advanced → Limits & Quotas](/advanced/limits/): plan quotas.
- [Advanced → Data Backup](/advanced/backup/): included with plans rather than charged in Sparks.
