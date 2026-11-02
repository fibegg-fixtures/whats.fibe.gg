---
title: Security & Sessions
description: Two-factor authentication, passkeys, recovery codes, protected actions, and active sessions.
slug: /advanced/security
sidebar_position: 2
keywords: [security, 2FA, two-factor, TOTP, WebAuthn, security keys, recovery codes, sudo, sessions]
---

Fibe supports authenticator codes (TOTP), recovery codes, and passkeys for account security. Password sign-in uses an authenticator or an unused recovery code when TOTP is enabled. Passkeys are used from an existing signed-in session to restore trust or confirm protected actions; they are not a password sign-in method.

## First administrator setup

On a fresh installation, create the initial setup token locally with `docker compose exec fibe fibe-api --data-dir /data setup token`, then open `/setup` on the installation and paste the token.

## Authenticator app codes (TOTP)

Scan the QR code with your authenticator app and verify it to enable TOTP. Future password sign-ins require a current authenticator code or an unused recovery code. Codes are checked against a short time window, and a used code cannot be replayed.

Baseline. Set this up first.

## Security keys

Register a passkey or hardware security key (FIDO2 / WebAuthn) from **Profile → Security & Sessions**. It does not replace the authenticator code at password sign-in.

Once registered, use a key to:

- Confirm protected actions that ask for recent authentication.
- Restore trust on a session that needs another security check.

You can register multiple keys. Keep a backup authentication method available before removing a key.

## Recovery codes

A set of 10 single-use codes is generated when you enable TOTP. **Save them somewhere safe.** They are shown once during setup; the display must be confirmed within 10 minutes. If you lose both your authenticator and all recovery codes, ask the installation operator to use the local account recovery procedure.

- Each code works exactly once.
- Print, password manager, or both.

## Re-authentication for sensitive actions

Some protected account operations require recent authentication. If TOTP or a passkey is configured, the prompt asks for one of those factors; password-only accounts confirm with their password. The check stays valid for 15 minutes.

Google sign-in alone is not a Fibe security-factor check. Google-only accounts can configure TOTP or a passkey to complete protected actions; a passkey can also restore session trust.

## Removing 2FA

Disabling TOTP requires confirmation with the account password and authenticator code for password accounts. Google-only accounts must verify a replacement native security method first. Removing a passkey requires recent authentication.

## Active sessions

Lists active sessions with available device, browser, operating-system, activity, and IP details.

Sign out a single session or all other sessions. Useful after losing a device or finishing work on a shared computer.

By default, sessions expire after 24 hours without activity or 30 days total. An installation can set `sessions.duration_hours`; when set, that configured lifetime replaces the default session and idle limits.

If Fibe detects an unexpected change in network context, it can ask you to restore trust by confirming a security factor. Use the authenticator, a recovery code, or a registered passkey.

## Timeouts & protections

| Protection | Behavior |
|---|---|
| Passwords | 8 to 72 characters. The installation can optionally enable screening against a known-breach password service; it is off by default. |
| Failed password sign-ins | 10 failed attempts lock the account for 30 minutes. Fibe sends an unlock link when email delivery is configured. A successful sign-in clears the failure count. |
| Password reset links | Expire after 2 hours. |

## FAQ

<details>
<summary>Lost phone and recovery codes?</summary>

Ask the installation operator to issue a single-use local recovery token with `fibe-api --data-dir /data operator recover --email <email> --reset-factors`. The token expires after 30 minutes and must be redeemed in the browser with a new password. Resetting factors removes existing TOTP and passkeys, and signs out all sessions. The operator can also omit `--reset-factors` when the factors should remain. This command runs against the local installation; it does not contact a hosted support service.
</details>

<details>
<summary>Does the Fibe API ask for 2FA?</summary>

API requests authenticate with API keys. Browser account security checks and API authentication are separate; see [API Keys](/advanced/api-keys/) for creating and managing keys.
</details>

## Related

- [Google sign-in](/advanced/google-sign-in/): linking and removing a Google identity.
- [API Keys](/advanced/api-keys/): creating and managing API keys.
- [Secret Vault](/advanced/secrets/): storing and managing secrets.
- [Audit log](/advanced/audit-log/): sign-in and security events appear there.
- Reference: [`fibe-security-access-and-integrations`](/reference/fibe-security-access-and-integrations/).
