---
title: Security & Sessions
description: Two-factor authentication, security keys, recovery codes, re-authentication for sensitive actions, active sessions.
slug: /advanced/security
sidebar_position: 2
keywords: [security, 2FA, two-factor, TOTP, WebAuthn, security keys, recovery codes, sudo, sessions]
---

Authenticator codes, hardware keys, recovery codes, sensitive-action re-auth, active session management.

## Authenticator app codes (TOTP)

Scan a QR code with your authenticator app (1Password, Authy, Google Authenticator). Verify once. Each future login asks for a current code. Codes tolerate a small clock drift (±30 seconds), and each code works only once — a code that's already been used can't be replayed.

Baseline. Set this up first.

## Security keys

Register hardware keys (FIDO2 / WebAuthn) as a stronger alternative to TOTP. Phishing-resistant in a way TOTP isn't.

Once registered, use a key to:

- Sign in.
- Confirm sensitive actions.
- Restore trust on a session the platform flagged.

Multiple keys can be registered. Any one satisfies the second factor. Register a primary plus a backup (e.g. one at home, one in a safe).

## Recovery codes

A set of 10 single-use codes generated in advance. **Save them somewhere safe.** Without them, losing both phone and security key means account recovery via support.

- Each code works exactly once.
- Regenerating invalidates the old set.
- Print, password manager, or both.

## Re-authentication for sensitive actions

Some operations require re-confirmation of the second factor: managing API keys, secrets, webhooks, security keys, revoking all sessions.

The confirmation lasts 15 minutes. Subsequent sensitive actions inside the window go through without re-prompting.

## Removing 2FA

Disabling 2FA or removing a registered security key requires confirmation first. A leaked session can't quietly weaken your account's protection.

## Active sessions

Lists every active session: device type, browser and OS, last activity, and the IP address it last used.

Sign out a single session or all other sessions. Useful after losing a device or finishing work on a shared computer.

Sessions also expire on their own: after 24 hours without activity, and after 30 days regardless of activity.

Sign-ins from a different IP address or browser within 30 minutes of each other are treated as suspicious. Every session involved loses trusted status until the second factor is confirmed again, and a sign-in notice email goes out.

## Timeouts & protections

| Protection | Behavior |
|---|---|
| Passwords | 8–72 characters, no composition rules. Checked at signup and on every change; passwords that show up repeatedly in known data breaches are rejected. |
| Failed sign-ins | 10 failed attempts lock the account for 30 minutes. An email with an unlock link goes out; a successful sign-in resets the counter. |
| Password reset links | Expire after 2 hours. |
| Signup confirmation links | Expire after 24 hours. |
| Email change | Takes effect immediately — no re-verification of the new address. A notice goes to the old address, so a silent takeover can't pass unnoticed. |
| Usernames | 5–39 characters. Letters and digits; dots, hyphens, and underscores allowed in the middle. Must start and end with a letter or digit. Some names (`admin`, `api`, `login`, …) are reserved. |

## FAQ

<details>
<summary>Lost phone and recovery codes?</summary>

Contact Fibe support. Identity verification required. Slow. Avoid this by saving recovery codes durably at 2FA setup.
</details>

<details>
<summary>Does the Fibe API ask for 2FA?</summary>

No. The API authenticates via API keys, which are themselves protected by 2FA at creation time. See [API Keys](/advanced/api-keys/).
</details>

## Related

- [API Keys](/advanced/api-keys/) — managing them requires 2FA confirmation.
- [Secret Vault](/advanced/secrets/) — creating, deleting, or revealing entries requires confirmation.
- [Audit log](/advanced/audit-log/) — sign-in and security events appear there.
- Reference: [`fibe-security-access-and-integrations`](/reference/fibe-security-access-and-integrations/).
