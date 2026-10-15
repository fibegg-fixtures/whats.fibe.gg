---
title: Google sign-in
description: Sign in or sign up with Google. Runes govern admission, domain Runes admit people into a Team, and Google-only accounts set up TOTP.
slug: /advanced/google-sign-in
sidebar_position: 3
image: /img/og/advanced-google-sign-in.png
keywords: [Google sign-in, Google, Rune, domain Rune, Team, TOTP, Security & Sessions]
---

Google sign-in lets you sign in or sign up with any Google account. A Google account alone does not admit you: Runes decide who gets in. The **Sign in with Google** and **Sign up with Google** buttons appear only where a platform administrator has enabled Google sign-in.

This page describes the coordinated staging candidate. Production retains its previous sign-in options until its separate cutover.

## Sign up with a Rune

A new account needs a valid invitation [Rune](/concepts/billing/#runes). Click **Sign up with Google**, enter your Rune and continue to Google. Errors you may see:

| Message | What to do |
| --- | --- |
| A valid invitation rune is required. | Try again with your Rune. |
| This invitation has no seats left. | The Rune reached its redemption limit. Ask for a new Rune. |
| Your Google account's domain does not match this invitation. | Use the invited Google account, or ask for a new Rune. |
| This email already has a FIBE account. | Sign in to that account, then link Google in Security & Sessions. |

Gmail accounts and Google Workspace accounts confirm your mailbox automatically. Any other address gets a **Check your email** page: your account is created only after you confirm the email, and then you sign in with Google again.

## Domain Runes and Teams

Staff can map an exact-domain Rune to a [Team](/concepts/teams/). Signing up with a Google Workspace account from that domain then admits you straight into that Team as a **member**, never an admin. If you already had a pending invitation to the Team, you still accept it explicitly.

A member removed from the Team stays blocked from automatic domain enrollment until a Team admin requests restoration and that member accepts it. If the domain mapping is unavailable, sign-in stops with a message to ask a Team admin to check the domain invitation.

## Link and remove Google identities

An existing account never links to Google just because the email matches. Sign in as usual, then open **Profile → Advanced Settings → [Security & Sessions](/advanced/security/)** and use **Link another Google identity**. You can link more than one. Linking and removing need the confirmation challenge for sensitive actions. Removing an identity signs out its sessions. Before you remove your last Google sign-in, set and verify a password.

## TOTP for Google-only accounts

A Google sign-in never counts as two-factor confirmation and never unlocks sensitive actions on its own. An account that signs in only with Google sets up an authenticator app (TOTP) before its first protected action and saves its recovery codes. Security keys can be added after that. Removing the authenticator needs another verified method, such as a security key or a password, first.

## Related

- [Security & Sessions](/advanced/security/): two-factor, security keys, sessions and the confirmation challenge.
- [Teams](/concepts/teams/): membership, removal and restoration.
- [Billing → Runes](/concepts/billing/#runes): Rune limits and restrictions.
