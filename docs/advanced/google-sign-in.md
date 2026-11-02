---
title: Google sign-in
description: Configure Google identity for sign-in and link it safely to an existing Fibe account.
slug: /advanced/google-sign-in
sidebar_position: 3
image: /img/og/advanced-google-sign-in.png
keywords: [Google sign-in, Google, Team invitation, TOTP, Security & Sessions]
---

Google sign-in is available when an installation administrator configures the Google identity integration. Account admission still follows the installation's signup and invitation policy; possession of a Google account does not grant access to an installation or Team by itself.

## Sign in or create an account

Use the Google button on the Fibe sign-in or signup page when it is enabled. If registration is restricted, first use the invitation provided by your installation administrator. A Team invitation is not accepted until the invitee completes its acceptance flow.

If the Google identity belongs to an existing Fibe account, sign in to that account using its existing method and link Google from **Profile → Security & Sessions**. Fibe does not link accounts solely because their email addresses match.

## Team membership

Google authentication does not make someone a Team member or administrator. A Team administrator invites members from Team settings. The invitee must accept the invitation; removing a member ends their Team authority.

## Link or remove an identity

1. Sign in to the account you want to keep.
2. Open **Profile → Security & Sessions**.
3. Choose the Google identity action and complete the verification flow.

Sensitive account changes may require a recent-authentication challenge. Before removing a sign-in method, make sure another usable method is configured so you can continue to access the account.

## Two-factor authentication

Google sign-in is an identity provider, not a second factor for Fibe's protected actions. Configure TOTP, recovery codes, or a security key from **Security & Sessions** when required by the installation's security policy.

## Related

- [Security & Sessions](/advanced/security/): sessions, MFA, and protected actions.
- [Teams](/concepts/teams/): membership and invitations.
