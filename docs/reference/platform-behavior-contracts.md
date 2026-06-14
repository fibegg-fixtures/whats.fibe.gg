---
title: Platform behavior contracts
description: Dense product-facing defaults, limits, lifecycle rules, and operational contracts for Fibe behavior that scripts and operators depend on.
slug: /reference/platform-behavior-contracts
sidebar_position: 7
keywords: [Fibe contracts, limits, defaults, lifecycle, behavior, reference]
---

# Platform behavior contracts

This page is the dense contract reference for Fibe behavior that matters to operators, script authors, and support. Topic pages explain the workflows; this page records the concrete defaults, limits, status rules, and failure behavior in one place.

Values marked as configurable are the shipped defaults. A hosted environment may raise or lower them for a specific account or deployment.

## API Keys, Webhooks, Audit Log, And Backup

### API key scope families and granular restrictions

API keys support 56 scopes across families (marquees, props, playspecs, playgrounds, Genies, secrets, webhooks, etc.) with read/write/delete/manage actions. Some families offer a `manage` scope combining read+write+delete. Granular restrictions allow limiting a scope to specific resource IDs (e.g. `secrets:read` restricted to secrets [42, 99]). Resource ownership is validated at save time — you cannot grant a key access to resources not owned by your account. Scope escalation is blocked: non-admin players cannot create keys with `*` (wildcard) or grant a key access to a team they don't belong to.

### API key token visibility and rotation

Raw API key tokens are shown **only once** at creation and cannot be retrieved later. After creation, keys display a masked token showing the first 14 characters plus asterisks (e.g. `abc123*******...`). Exception: keys marked "For Genies (unencrypted)" store tokens unencrypted and can be revealed via the key card after re-confirming 2FA. Regular keys must be rotated to get a new token — rotation creates a new key with identical scopes/restrictions and immediately expires the old one.

### Webhook HMAC-SHA256 signing and header format

Each webhook payload is HMAC-signed using SHA256 with the endpoint's signing secret (generated at creation, 64 hex chars / 32 bytes). Signature sent in `X-Webhook-Signature` header as `sha256=<hex-digest>`. Also includes `X-Webhook-Event` (event name), `X-Webhook-Delivery` (unique delivery ID for idempotency), `X-Idempotency-Key` (same as delivery ID), `User-Agent: Fibe-Webhook/1.0`, and `Content-Type: application/json`. Request timeout: 5 seconds open + 5 seconds read. Use constant-time comparison when verifying.

### Webhook delivery retry strategy and failure auto-disable

Network-level failures (timeouts, connection refused, socket errors, SSL errors) trigger automatic retries up to 3 attempts with exponential backoff: delay = (attempt^4) + 2 seconds. HTTP 2xx responses mark success; non-2xx (including 4xx client errors) count as permanent failures — **not retried**. After 10 consecutive failures, the endpoint auto-disables. One successful delivery resets the failure counter. Failed deliveries are recorded in delivery history entries with status (pending/retrying/success/failed), response code, and truncated response body (10,000 char limit).

### API key authentication caching and expiry validation

Successfully authenticated API keys are cached for 24 hours. Expired keys fail authentication before cache lookup, and deleting a key or changing whether it is agent-accessible invalidates cached authentication. The visible token prefix is only used to narrow verification; it is not enough to authenticate.

### API key rate limit defaults and tracking

Default API rate limit is 5,000 requests per hour (RPH) per player. This limit is global across all of a player's API keys. The limit window resets hourly on a fixed epoch schedule: clients receive `limit`, `remaining`, and `reset_seconds` (time until next window). Admins can set individual per-player limits. All keys share the player's throttle bucket — one key's usage counts against the player's global quota.

### Audit log immutability and visibility scope

Audit logs are write-once, immutable records — they cannot be modified or deleted once created. Each entry contains action, actor (Player/System/Stripe/Playguard), actor_id, channel (UI/API/System/Webhook), resource type/id/name, timestamp, metadata. Entries are visible to a player only if: the player is the actor, the player owns the resource, the player owns a resource the entry affects, or the entry is a system event for the player. Audit history is kept indefinitely — no retention window or automatic deletion. One successful API call per key generates one audit entry (last_used_at updates are not audited).

### Data export/import structure and exclusions

Exports include: Props, Marquees, Playspecs, Genies, Playgrounds, Templates, Secrets (names/descriptions only — **never values**), Webhook endpoints (URL and subscriptions only — signing secrets **excluded and regenerated on import**). **Excluded from export**: profile settings, API keys, audit logs, artefacts, mutters, conversations. Exports are JSONL files. Default retention: 24 hours before download link expires (configurable). Max import file size: 50 MB (default), max 5,000 records per import. Two conflict strategies: merge (update existing) or skip (create new only). Rollback removes all records created by a completed import.

### Webhook URL validation and SSRF protection

Webhook URLs must be HTTPS in production (configurable via `enforce_webhook_https` runtime capability). At save time, Fibe makes a HEAD/GET request to the URL to validate it resolves to a public IP — private IP addresses are rejected immediately. This SSRF guard prevents storing URLs pointing to internal networks or 127.0.0.1. Non-2xx responses and unreachable hosts don't block save (server may be temporarily down). At delivery time, the delivery-time guard validates private-network destinations again. Test/dev environments may allow HTTP and skip SSRF checks.

### Webhook delivery history retention

Webhook delivery records are kept for 30 days, then automatically pruned. Cleanup removes records older than 30 days in batches of 10,000. Each endpoint stores up to 1,000 delivery records. Oldest deliveries are purged as new ones arrive. This is per-endpoint, not global.

### Webhook event catalog and filter options

73 known event types across Playgrounds, Marquees, Props, Playspecs, Genies, Templates, Artefacts, Feedback, API Keys, Secrets, Webhooks, plus a `webhook.test` event. Endpoints can subscribe to specific events or `*` (everything). Unknown event names are rejected at save time. Granular **event filters** narrow by resource ID (e.g. receive `playground.created` only for specific Playground IDs). Tool filters restrict Genie-related events to specific Genie/tool names. Filters are matched at dispatch time.

### Resource quotas and per-parent caps

Default quotas per account: 20 API keys, 20 webhook endpoints, 1,000 webhook deliveries per endpoint, 100 versions per template, 100 artefacts per Genie, 5 mounted files per Genie, 10 MB mounted file size per Genie, etc. Admins can override quotas per player. Super-admins have unlimited quotas. Rolling-cap pruning silently enforces per-parent limits (oldest items deleted as new ones exceed quota). One active data transfer task per player at a time. All quotas shown on the Limits & Quotas dashboard with usage/limit/status (OK/warning at 80%/exceeded).

## Bazaar, Publishing, And Scrolls

### Publishing requires both public flag AND approved flag for system templates

User-published template versions need only the public flag to appear in Bazaar for their author. Fibe-maintained system template versions require public, approved, and source-mirror-ready status. Approving a player-owned template version for the maintained catalog converts it into a Fibe-maintained listing.

### Template publishing is version-gated, not template-wide

You don't publish a template — you publish individual versions. Each version can independently toggle its public flag without affecting the template or other versions. This means you can have private draft versions alongside published public ones, and unpublishing a version doesn't remove the template.

### Approved vs Public are separate flags; approved requires public first

Public and approved are independent flags on template versions. The validation rule: you cannot approve a version that is not public. Clearing approval is always allowed. Only admins can toggle approval; authors toggle public visibility.

### System templates require additional approval and source mirror readiness

Only system templates (marked by admins) appear in Bazaar results to non-owners. A system template version must be: (1) public, (2) approved (separate flag), and (3) have all referenced upstream sources mirrored in Gitea. Non-system templates only need public flag. The approval gate prevents unapproved system versions from appearing.

### Templates have strict quota limits per player

Default limits: 20 templates per player, 100 versions per template, 100,000 characters per template body. Super admins have unlimited quotas. Admins can set per-player overrides. Exceeding version limit blocks new version creation; exceeding body char limit blocks version save with validation error.

### Template images are limited to 500KB and specific formats only

Template cover images must be JPEG, PNG, SVG, or WebP. Default max size is 500KB and can be changed by operators. Exceeding size or format rejects the upload. Images are optional but improve Bazaar discoverability.

### Template search uses full-text, similarity ranking, and regex with constraints

Bazaar search matches on name/description via PostgreSQL full-text, name similarity (threshold 0.2), and optional regex. Regex queries are limited to 160 characters max, must include at least 3+ literal character tokens (up to 8 tokens), and invalid regex raises error. Search returns max 10 results; if query matches nothing, falls back to 5 random verified system templates.

## Billing, Wallet, Plans, And Limits

### Grace period duration and max incidents

When a Marquee cannot pay its daily fee, a grace period begins lasting 3 days by default. Players can incur a maximum of 2 unpaid incidents (grace incidents) per account before the system automatically suspends the Marquee instead of opening a new grace period. Operators can change both values; the stated defaults apply when they are not overridden.

### Tutorial marquee destruction retention window

A suspended, unpaid tutorial platform-managed Marquee is scheduled for destruction 7 days after suspension if still unpaid. After that window elapses, the Marquee, its Playgrounds, Tricks, and all data are permanently deleted with no recovery option. Self-hosted Marquees are never deleted by Fibe; they are only disabled and suspended. Operators can change the 7-day window.

### Daily marquee funding is per-service-day with service-day-end timing

Each Marquee is funded once per day. A service day runs from UTC midnight to UTC midnight, and a Marquee is considered paid for a day only if it is funded through that day's end. Funding checks run daily; if the wallet cannot cover the day's charge, a grace incident is opened. Monthly intervals count as 30 service days and annual intervals as 365 service days and used for plan calculations and retention windows.

### Grace debt repayment happens automatically on wallet credit

Whenever a wallet is credited (purchase, grant, referral reward), any outstanding grace incidents (unpaid days) for that player and currency are automatically repaid from the new credit in FIFO order (oldest incident first). The repayment is idempotent and atomic; if multiple incidents exist, they are settled sequentially until the available credit is exhausted. This happens before the player can re-enable a suspended marquee.

### Mana to Sparks conversion is one-way and irreversible

Mana can be converted to Sparks at a fixed rate ; the default is 100 Sparks per 1 Mana. The conversion happens immediately and atomically: the debit from Mana and credit to Sparks are a single transaction. Sparks cannot be converted back to Mana. Once converted, Sparks can only be spent on standard self-hosted Marquee daily costs.

### Plan-level marquee limits are not subscription-gated

Tutorial plan holders get 1 Marquee, Single plan holders get 1, and Multiplayer plan holders get 10, but those are plan-level suggestions rather than the hard create gate. The hard limit is controlled by admin-configurable per-player quotas. Subscriptions recharge wallets; they do not directly grant Marquee allowance. Defaults are 100 standard Marquees and 1 tutorial Marquee per player, overridable per player.

### Subscription cancellation takes effect immediately

When a player cancels a subscription via the UI, the Fibe immediately cancels on the provider (Stripe/Creem/Paddle). The cancellation does not wait for the current billing period to end; it is effective immediately. Wallets already credited remain intact; no refunds are issued for the remainder of the period. Cancelling a subscription does not stop any running marquees or playgrounds—it only stops future recharge transactions.

### Tutorial marquees are disabled at grace start, not at suspension

When grace begins (a daily charge fails on a tutorial marquee), the marquee is immediately marked disabled status and provisioning state remains provisioned. This blocks all runtime actions (launch, rollout, restart, etc.) with a `MARQUEE_NOT_FUNDED` error. However, the marquee itself is not removed from Fibe yet. If grace passes unpaid, the status moves to suspended but the marquee is not deleted until the retention window elapses. Standard (self-hosted) marquees are never disabled—only blocked from runtime actions until the debt is repaid.

### Raw Mana checkout minimum and maximum enforce purchase bounds

One-time and recurring Mana top-ups must be within configured bounds. The default minimum is $10, the default maximum is 100,000 Mana, and amounts must be a whole multiple of 10 Mana. Checkout requests outside those bounds are rejected before payment provider checkout starts.

### Referral codes enforce one-referral-per-invitee uniqueness

A player can only be referred once. If the same player attempts to sign up or purchase again using a different referral code, the second attempt is not recorded as a referral. Self-referral (an inviter referring themselves) is explicitly blocked with a validation error. Referral rewards are earned in Sparks and posted to the inviter's wallet after the invitee's first qualifying purchase with the code.

### Rune invite codes have hard redemption caps

A Rune invite code has a hard redemption cap; once that many players have signed up using the code, it becomes non-redeemable. A Rune can be scoped to a specific email address or to an email domain, but not both simultaneously. Player-owned runes are bound to the player who created them. Admin runes have no player owner. Rune codes are 8-character alphanumeric when auto-generated, or the domain name itself for domain-shaped runes.

## Cross-Cutting Limits, Flags, And User-Facing Defaults

### Standard Resource Quotas: Playgrounds=1000, Props=1000, Playspecs=1000, Genies=10, API Keys=20, Webhooks=20

Default quotas per player: 1,000 Playgrounds, 1,000 Props, 1,000 Playspecs, 10 Genies, 20 API keys, 20 webhooks, 20 import templates, 500 scroll artefacts, 100 secrets, and 200 Job ENV entries. Marquee quotas are separate: 100 standard Marquees and 1 tutorial Marquee by default. Admins can override quotas per player. Super-admins have unlimited quotas.

### API Rate Limit: 5000 Requests Per Hour (Default, Per-Player Overridable)

API calls are rate-limited to 5,000 requests per hour per authenticated player by default. Admins can override the platform default or set a per-player override. Rate period resets hourly. Limit applies to all API endpoints.

### Account Lockout After 10 Failed Login Attempts

After 10 consecutive failed login attempts, the account is automatically locked for 30 minutes. Users receive an email notification with an unlock link during lockout. Successful login resets the failure counter.

### Data Export Retention: 24 Hours Default (Admin-Configurable)

Exported data files (backup/export function) are retained for 24 hours by default, after which they expire and download links become unavailable. The file is purged from storage. Operators can change the retention duration. Users receive email with download link when export completes.

### Email Confirmation Links Expire in 24 Hours

Signup confirmation tokens are encrypted and signed with a 24-hour expiration window. Users who don't confirm their email within this timeframe must restart the signup process. The token includes username, email, password digest, avatar URL, rune code, and locale.

### Feature Flags: Hunks (Git History Analysis), Teams, Beta Access

Three feature flags exist for players: Hunks (account-wide git diff analysis, disabled by default), Teams (workspace collaboration, disabled by default), and Beta (early-access participation). Hunks must be enabled for hunk ingestion jobs to run. Teams enable team membership and shared resource management. 

### Password Reset Links Expire in 2 Hours

Password reset tokens are valid for 2 hours from the time the reset email is sent. After 2 hours, users must request a new password reset link. The reset token is stored hashed.

### Playground Default TTL: 8 Hours; Jobs: 1 Hour (Configurable)

Interactive Playgrounds expire after 8 hours by default. Job Playgrounds (Tricks) expire after 1 hour by default. Operators can change the job-Playground default. Users can extend expiration before deadline or the playground auto-destroys.

### Session Timeouts: 24-Hour Idle + 30-Day Absolute

Browser sessions expire after 24 hours of inactivity (last_accessed_at) OR 30 days from creation (absolute), whichever comes first. Users must re-authenticate after timeout. Sessions are invalidated immediately when 2FA is enabled.

### Username Constraints: 5-39 Characters, Alphanumeric with Dashes/Underscores

Usernames must be 5-39 characters, start and end with alphanumeric, allow dashes and underscores in the middle. Reserved list includes 'admin', 'api', 'docs', 'help', 'login', 'org', 'root', 'settings', 'support', and 50+ others. Email disposability checked; passwords validated against HaveIBeenPwned breach database.

### Avatar Upload Limit: 2MB, PNG/JPEG/GIF/WebP Only

Player avatars must be under 2MB and in PNG, JPEG, GIF, or WebP format. Invalid file types or oversized images are rejected at validation time. Genie avatars have the same 2MB limit.

### Build Timeout: 45 Minutes; Stale In-Progress Playgrounds: 30 Minutes

Docker builds that remain in 'building' state for 45+ minutes are marked as failed with a timeout error. Playgrounds stuck in 'in_progress' state for 30+ minutes are considered stale and may be auto-recovered by the system.

### Multi-Language Support: English + Ukrainian

Platform supports English by default and Ukrainian as an additional locale. All user-facing strings are translatable. Platform detects user's signup locale and stores it per player. Users can switch locale per-session via the current locale. Emails respect the player's stored locale preference.

## Genies, Conversations, Pokes, And Artefacts

### Genie authentication statuses and usability checks

A Genie has five discrete statuses: pending (not yet authenticated), authenticated (credentials valid and working), expired (authentication token expired), revoked (credentials manually revoked and cleared), and deleting. A Genie is usable only when authenticated and not expired. Revoked Genies cannot send messages until re-authenticated.

### Provider authentication modes and Fibe Mana gating

Genies support three authentication modes: oauth (provider-native OAuth), provider-api-key (user supplies raw API key), and fibe-mana (Fibe-hosted credentials). Cursor and Antigravity are excluded from fibe-mana mode (provider exclusion list). When provider auth fails mid-run, the Genie status moves to expired/revoked and running chats cannot send further messages. If a linked API key is broken or expired, the Genie falls back to its stored provider credentials when available.

### Genie credential size limits

Genie stored credential payloads are each limited to 64 KB. Attempting to authenticate with a larger payload fails validation with a too-large error. This applies to any stored provider authentication credentials.

### Artefact (skill) size limits

Artefacts have two size constraints: file attachments max 10MB, and inline body text max 10MB. Skills must be text files. Attempting to exceed either limit fails validation. Genie-owned artefacts are immutable (audit-guaranteed) and can only have skill and skill flags modified; player-owned artefacts are freely editable.

### Conversation management and multi-conversation support

Genies support multiple named conversations. The default conversation id is `default`. The `inbox` conversation is system-reserved and read-only. External conversation IDs must match pattern [A-Za-z0-9][A-Za-z0-9._:-]{0,127} (max 128 chars). Each conversation has its own message and activity stores persisted separately. Conversation metadata such as title, creation time, last-message time, and message count is tracked. Unknown conversation IDs on WebSocket upgrade are rejected with close code 4004.

### File upload limits in Genie chat API

The Genie runtime limits multipart file uploads to 20 MB per file. This is a hard limit on the upload handler and applies to runtime API uploads. Exceeding it returns HTTP 413 Payload Too Large.

### WebSocket message rate limiting and connection limits

The Genie runtime enforces two WebSocket limits: 60 messages per minute per connection, with excess messages silently dropped, and 5 concurrent WebSocket connections per Genie runtime by default. Operators or Genie settings can change the connection limit. When the limit is reached, the oldest session is evicted with the session-taken-over close code. Clients must read the incoming `conversation_id` message after connecting.

### Genie name version tracking and rename history

Genies track up to 100 prior name changes. Each entry records the previous name, new name, change time, and, when the rename happened during an active chat, the related conversation. Older entries beyond 100 are dropped. Rename history is audit-tracked but not shown in normal rename operations.

### Genie runtime deployment timeouts and reachability

Genie container deployment times out after 600 seconds in production and 1,800 seconds in development. After the container reports healthy, the runtime must also be externally routable: production checks reachability up to 45 times with 2-second delays, while development checks up to 180 times. If a running Genie becomes unreachable after it has been running for more than 2 minutes, Fibe triggers automatic redeploy.

### Avatar upload restrictions

Genie avatars must be one of: PNG, JPEG, GIF, WebP, or SVG+XML. Max file size is 2MB. Oversized or invalid-format uploads fail with validation avatar invalid-type or too-large validation errors. If no custom avatar is set, the Genie is assigned a deterministic robot avatar (100 options, based on its id).

### Default memory and CPU limits for Genies

Genie containers default to 2G memory and 1.5 CPU. These apply to any Genie unless overridden at the player defaults level (account or platform defaults) or per-Genie level. Tutorial marquees enforce stricter limits: 1G memory, 1.0 CPU. Can be overridden via effective_memory_limit and effective_cpu_limit which cascade through per-Genie → team default → platform default → built-in default.

### OCR conversion size limits in Genie runtime

The Genie runtime can limit OCR conversion input and output sizes. Default input limit is 10MB (default OCR input limit), output limit is 25MB (default OCR output limit). These can be overridden per-Genie via ocr_conversion_max_bytes and ocr_conversion_max_output_bytes settings, or globally via FIBE_OCR_CONVERSION_MAX_BYTES and FIBE_OCR_CONVERSION_MAX_OUTPUT_BYTES env vars. If null, the default applies.

### Poke (scheduled Genie) minimum interval and cron scheduling

Genie Pokes (scheduled prompts) have a minimum interval constraint: schedule must not run more than every 5 minutes (MINIMUM_INTERVAL=5.minutes). The schedule is validated as cron-like syntax (via cron parser). If schedule is invalid or runs more frequently, validation fails with error 'must be a valid cron-like schedule' or 'must not run more often than every 5 minutes'. Pokes cannot target the INBOX conversation.

## Marquees, Networking, And Runtime Funding

### Marquee offline behavior and Genie chat stopping

When a Marquee goes offline (status changes to 'error' or 'disabled'), live Genie chats automatically stop with a message indicating the Marquee became unavailable. Genie chats in 'pending' or 'running' status are quiesced. Playgrounds remain on the Marquee but become unreachable. No automatic failover occurs. Connection checks determine if a Marquee is reachable; if checks fail, the Marquee moves to error status.

### Marquee statuses and billing funding requirements

Marquees have three status values: 'active', 'disabled', or 'error'. A Marquee must be funded (funded through the current time) to perform runtime actions like launching, restarting, building, streaming logs, SSH access, or sending Genie messages. If unpaid, actions return `MARQUEE_NOT_FUNDED`. Billing and funding screens remain accessible even when unpaid. Super admins bypass funding checks.

### Playground launching restrictions based on Marquee state

Playgrounds can only be launched on Marquees that are: (1) active status, (2) funded, (3) SSH-accessible, and (4) have a root domain set. Marquees that are provisioning, destroying, destroyed, or failed cannot launch Playgrounds. Attempting to launch on an invalid Marquee returns the current validation failure for the missing readiness condition.

### Domain and subdomain rules

Marquee root domains must use normal domain syntax: alphanumeric labels, hyphens, and a standard TLD. For non-routable TLDs (.test, .local, .localhost, .example, .invalid), HTTPS is automatically disabled. Subdomains are validated alphanumeric + hyphen format, max 63 chars. The platform-provided tutorial domain must be included in the domain list. Service subdomains default to service name, override with fibe.gg/subdomain label (supports @ for root domain binding).

### Marquee DNS providers and ACME certificate configuration

Standard Marquees support 7 DNS providers for ACME challenge: Cloudflare, AWS Route53, DigitalOcean, Hetzner, OVH, Google Cloud DNS, and manual acme-dns CNAME. Tutorial Marquees use platform-managed acme-dns. HTTPS is mandatory for tutorial Marquees. For provided certificates (not ACME), both the certificate and private key are required, validated as valid OpenSSL certificates.

### Marquee SSH and connectivity validation

Marquee hosts must be reachable via SSH and have Docker installed and running. Connection tests check: (1) SSH login succeeds, (2) Docker is available with a working daemon, (3) the base directory exists or is writable. SSH key type must be ed25519. For non-tutorial Marquees, host safety validation prevents connecting to private/internal IP ranges (unless the owner is a super admin).

### Marquee rate limits: Fix-Redeploy and Reboot

Tutorial Marquees have two recovery rate limits: 10 fix-redeploy attempts per 4 hours, and 3 reboots per 1 hour. Both limits reset when their windows expire. Users see error messages with timing information when limits are reached. Fix-redeploys are only available after provisioning has either succeeded or failed.

### Playground TTL defaults and job mode differences

Standard Playgrounds have a default TTL of 8 hours. Trick/job-mode Playgrounds default to 1 hour, and operators can change that job default. Playgrounds in `in_progress` status longer than 30 minutes are considered stale. All runtime actions (start, stop, destroy, extend) require the Marquee to be funded.

### Tutorial provisioning timeout and steps

Tutorial Marquee provisioning has a 30-minute timeout. The process moves through queued, VM creating, VM ready, SSH configured, TLS provisioning, and deploying states. SSH becomes accessible once SSH is configured. Playgrounds cannot launch on a Marquee while it is provisioning, destroying, destroyed, or failed.

### Genie chat connectivity lock during modifications

When live Genie chats are running on a Marquee, host, port, SSH user, SSH key, domains, and platform-provided domain cannot be modified. Attempting to change them returns a validation error. This prevents disrupting active Genie sessions mid-conversation.

### SSH port default and host/port uniqueness

Default SSH port is 22. Host and port combinations must be globally unique across active Marquees; terminal provisioning states such as destroying, destroyed, and failed do not reserve a pair forever. Duplicate host/port pairs are rejected at validation time. Host IP addresses for non-tutorial Marquees undergo private-network safety checks to prevent connecting to private/loopback ranges.

### Tutorial Marquee field immutability and control-plane availability protection

Tutorial Marquees cannot have SSH credentials, host, port, or user fields changed after creation (these are system-managed). The system preserves tutorial Marquee availability during control-plane changes if live Genie chats are running, preventing accidental shutdown of chat-hosting infrastructure. Tutorial Marquees must be created by the platform (users cannot manually create them).

## Playground Lifecycle

### Default expiration times differ by playground mode

Regular playgrounds expire after 8 hours by default. Job-mode (Trick) playgrounds expire after 1 hour by default. Operators can change the job-mode default TTL. These are the base TTLs used when extending expiration without specifying a duration.

### Stale playground creation auto-recovers after 30 minutes

If a playground stays in 'in_progress' status for 30+ minutes without progressing to 'running', the Playguard reconciliation job automatically recovers it by transitioning back to 'pending' and re-enqueuing the creation. This handles infrastructure stalls during launch.

### Volume persistence depends on Playspec configuration and action type

When a playground expires and gets torn down, or when manually destroyed, volumes are only preserved if the parent Playspec has persist_volumes=true. On stop (graceful shutdown), volumes are always kept regardless of this setting. On destroy, volumes are removed unless persistence is explicitly enabled. Rollout and restart actions preserve volumes in all cases.

### Extend expiration uses maximum of current expiration or now

When extending a playground's expiration, the system uses the maximum of the current expires_at timestamp or the current time as the base, then adds the duration. This means extending an already-expired playground adds the duration from now, not from when it expired. Default duration is 8 hours for regular playgrounds, 1 hour for job-mode playgrounds.

### Job completion captures last 5000 log lines per service

When a job-mode playground completes, only the last 5,000 log lines are captured per service by default. Older logs are discarded. Each service's exit code is recorded, and success is determined by whether all watched services exited with code 0.

### Playground state machine is strict — not all transitions are allowed

Playgrounds follow a strict state machine: pending/in_progress/running/error/has_changes/completed/destroying/stopping/stopped. From 'completed' state, only 'destroying' is allowed (job-mode only). From 'destroying', no transitions are possible (terminal). This prevents invalid state changes and ensures data consistency.

### Playguard auto-recovery has grace period and cooldown

Automatic rollouts for drift detection are blocked for 3 minutes after playground creation (grace period) and for 10 minutes after a rollout (cooldown). These prevent thrashing when services are starting up or in transition. Drift is still detected and logged during cooldown, just not acted upon automatically.

### SSH debug terminal sessions expire after 4 hours

Each SSH terminal session connected to a Marquee has a 4-hour session TTL. After 4 hours of session registration, the session becomes invalid and cannot be reconnected. Additionally, only 3 concurrent SSH terminal sessions are allowed per Marquee — attempting a 4th will fail until one of the existing three closes.

## Props, Git Providers, And Source Control

### GitHub App installation deletion cascades to connections

When a GitHub App installation is uninstalled/deleted, all GitProviderConnection records with that installation_id are destroyed, and the player's github_app_installation_id is nullified. Props that relied on this installation lose automatic token generation and become inaccessible if they have no explicit credentials.

### Private repos require credentials or installation token

Private Props must have either: (1) explicit credentials in the Prop record, (2) a GitHub App installation token (for GitHub), or (3) a Gitea connection token. Attempting to create/save a private Prop without any of these fails validation with credentials-required validation error.

### Branch deletion via webhook cascades to PropBranch records

When a branch is deleted in the remote repository (GitHub/Gitea), a webhook fires and all corresponding PropBranch records for that Prop are automatically destroyed. This is not reversible without re-pushing the branch.

### GitHub App installation token TTL

GitHub App installation tokens expire after 50 minutes and are cached. Tokens are automatically refreshed on expiry when creating installations or during Prop operations. This is transparent to the user and requires no manual action.

### Gitea repos default to private in greenfield creation

When creating a new repository via greenfield for Gitea, the default is private=true. For GitHub, the default is private=false. Users can override with repo_private parameter.

### Commit notifications are opt-in per Prop

Webhook events (push, branch creation) trigger commit notifications in Fibe only if notifications_enabled is true on the Prop. Users must explicitly enable notifications to receive commit alerts.

### Credentials field max size is 64 kilobytes

Prop credentials are encrypted and stored in the database with a maximum size of 64 kilobytes. Attempting to save credentials larger than this fails with 'credentials_too_large' validation error.

### Gitea connection is limited to one per player

Each player can have only one Gitea connection registered. Attempting to add a second Gitea connection fails with 'provider: taken'. GitHub supports multiple connections (e.g., multiple app installations).

### Prop lifecycle allows only specific state transitions

Props have three states: active, disabled, error. Valid transitions are: active→disabled|error, disabled→active, error→active. Attempting invalid transitions (e.g., disabled→error directly) raises InvalidTransition error.

### Repository URL and default_branch length limits

Prop repository_url has a max length of 2048 characters. Default_branch field has a max length of 255 characters. Both are required fields and cannot be blank.

## SDK, CLI, And MCP

### Auth profiles stored in ~/.config/fibe/ with precedence order

The CLI reads credentials from ~/.config/fibe/config.json (profile metadata) and credentials.json (API keys). The priority chain is: --api-key flag → --profile flag (reads from config.json/credentials.json) → FIBE_API_KEY env var → FIBE_DOMAIN env var → default profile 'default' with domain fibe.gg. Once any profile is configured, env vars are ignored. Both files must be readable by the process; permissions recommended to 0o700 and 0o644.

### API key scopes and granular_scopes restrict resource access; agent_accessible flag needed for Genie exposure

API keys have Scopes (broad: launch:write, secrets:write, keys:manage) and optional GranularScopes (resource-specific: prop_id=[1,2], playspec_id=[5]). An API key marked agent_accessible=false is NOT visible to Genies (Genies) even if they know the key ID. Default is agent_accessible=false for human-created keys. Tokens are returned only at creation time; on updates, only the masked_token is visible.

### Circuit breaker: opens after 5 consecutive failures, re-probes after 30 seconds

When enabled (via WithCircuitBreaker), the breaker opens once it records 5 failures. The open state persists for 30 seconds, at which point it enters half-open and allows 2 test requests. Success in half-open closes the circuit; any failure reopens it. The circuit breaker is NOT enabled by default in the SDK but IS enabled by default in the MCP server.

### Default timeout is 30 seconds per request

All HTTP requests have a 30-second timeout. This is configurable via WithTimeout() in the Go library or applies to the CLI globally. Long-running operations like log streaming don't count the entire duration against this timeout; they issue fresh requests for each page of output.

### MCP server in stdio mode redirects stdout→stderr to protect JSON-RPC pipe

When fibe mcp serve runs in stdio mode (default), it captures os.Stdout, replaces it with os.Stderr, and hands the original stdout to the MCP wire protocol. Any stray write to os.Stdout (fmt.Println, log output, panic trace) corrupts the JSON-RPC stream with parse errors like 'invalid message version tag'. The tool sets log output to stderr and redirects stdio writes; Genie code must not write directly to stdout.

### Retry policy: max 3 attempts, exponential backoff with jitter, retries on 429/5xx

Client retries transient failures (HTTP 429, 500, 502, 503, 504) up to 3 times by default using exponential backoff. Delay calculation: base_delay × 2^attempt × random(0,1), capped at max_delay (30s). Retry-After header is honored if present. Network timeouts and context cancellation are NOT retried. Applications can customize via WithMaxRetries() and WithRetryDelay().

### CLI exits with code 1 on any error; structured errors available via --explain-errors

The fibe CLI exits with code 1 on any error, 0 on success. There are no nuanced exit codes per failure type. However, when --explain-errors is passed, the CLI emits structured error output (error code, HTTP status, request ID, validation details) to stdout before exiting, which downstream scripts can parse. MCP tool calls never call os.Exit; they return errors to the session.

### Credential file permissions: config.json should be 0o644, credentials.json should be 0o700

The CLI creates ~/.config/fibe/config.json (profile metadata) with mode 0o644 (readable by all) and credentials.json (API keys) is written but the exact permissions depend on system umask. These files are sensitive; credentials.json should never be committed. Go library and CLI read the same files when run on the same machine, enabling shared state across tools and scripts.

### Device code flow expires after ~10 minutes (see ExpiresIn in response)

The browser device-code login flow returns ExpiresIn (seconds) and Interval (poll frequency). Once initiated, the device code is valid for that window. If the user doesn't approve within the deadline, the code expires and the user must restart login. Polling interval is capped at minimum 3 seconds if the server returns less.

## Security, Sessions, 2FA, And Account Access

### Account lockout threshold and duration

After 10 failed login attempts, the account locks for 30 minutes. A lockout email with an unlock token is sent to the account owner. The unlock token expires after the lockout window unless redeemed.

### Concurrent sign-in detection and de-trusting

When a user signs in, the system checks for sign-ins from different IP or user-Genie within the last 30 minutes. If detected, all concurrent sessions are marked untrusted (requiring 2FA re-verification), and a notification email is sent. This prevents silent session hijacking.

### Password length and character constraints

Passwords must be 8–72 characters. No character-type restrictions (uppercase, lowercase, symbols, numbers not enforced). All passwords are checked against the Have I Been Pwned breach database; if a password appears in 6 or more breaches it is rejected during signup and password change.

### Password reset token validity window

Password reset tokens sent via email are valid for exactly 2 hours from generation. After expiration, the user must request a new reset link; expired tokens are silently rejected.

### Session idle and absolute timeout windows

Browser sessions expire after 24 hours of inactivity OR 30 days absolute, whichever comes first. After idle timeout, the session is revoked and the player must sign in again. After absolute timeout, even an active session becomes invalid.

### Sign-up confirmation token expiry

Email confirmation tokens sent during registration expire after 24 hours. The token payload is encrypted and signed; after expiration users must start registration again.

### Sudo-mode duration for sensitive actions

After 2FA re-authentication for sensitive actions (API keys, secrets, webhooks, security keys), a 'sudo' window remains active for 15 minutes. Subsequent sensitive operations in that window skip re-authentication; after 15 minutes they require re-verification.

### TOTP time window and drift tolerance

TOTP codes are verified with a drift tolerance of 30 seconds before and after the current 30-second window (60 seconds total). Each code can only be used once; repeated use within the same time window is rejected.

### Device authorization (CLI/OAuth device flow) expiry

Device authorization codes (used by CLI sign-in) expire after 15 minutes. User codes (XXXX-XXXX format from 36^8 space) must be approved within that window. Old device authorizations are cleaned up after 1 hour past expiry.

### Email change notification (no verification required)

When a user changes their email address, a notification email is sent to the OLD email address. The new email becomes active immediately without a verification step. Users cannot change email to a disposable domain if that validation is enabled.

### Username constraints and reserved names

Usernames must be 5–39 characters, start and end with alphanumeric, and contain only [a-zA-Z0-9._-]. 68 reserved names are blocked (admin, api, login, logout, root, system, etc.). Usernames are case-insensitive unique.

### WebAuthn credential registration and signing

WebAuthn credentials store external ID, public key, and signature counter. Multiple credentials can be registered per user; any one can authenticate. Registration is gated behind 2FA. Signature counter is incremented on each assertion to detect cloned authenticators.

## Teams And Sharing

### Account deletion auto-leaves all teams (except as leader); leader teams are problematic

When a player deletes their account, the account deletion flow iterates all accepted team memberships and calls the team departure flow on each one (except where the player is the team leader). If a player is the leader of any team, the departure call is skipped with a warning logged, and the team remains orphaned with a an orphaned owner reference. This means deleting a leader account does not clean up their teams or transfer leadership — the team becomes inaccessible.

### Only owner and admin can invite members; only owner and admin can manage team

Regular members (role="member") can only read team data; they cannot invite others, manage members, or change settings. Only users with role="owner" or role="admin" can manage team membership records. When inviting members, only the non-owner roles ("member", "admin") can be assigned — the contract explicitly restricts this. Changing a member's role is limited to these two roles, not owner.

### Team creator is always the owner and cannot be changed

The player who creates a team automatically becomes the team owner (role="owner", immutable). When a team is created, an owner membership record is created automatically with the creator. The owner role can ONLY be assigned to the team creator via validation (owner_role_matches_creator). The owner cannot be demoted or changed — they can only transfer the owner role to another accepted member, which promotes them to owner and demotes the current owner to admin.

### Team invitations are username-based and auto-resolve on signup

Teams invite members by GitHub username, not email. Invitations can be pending before the invited person has signed up. When a new player signs up with that username, pending invites automatically attach to the account and remain pending for the player to accept or decline. If a player is invited before signup, they must create a Fibe account with that exact username for the invite to resolve. Pending invitations do not expire automatically.

### Team leader cannot leave; must transfer leadership first

The team owner/leader (creator) cannot leave or be removed from the team. Attempting to call the team departure flow on the leader raises a departure error with message "Team leader must transfer leadership before leaving. Use transfer_leadership! first." The owner must explicitly transfer the owner role to another accepted member before departing.

### Departing members lose access to shared resources but retain personal ownership

When a member leaves a team (non-leader), all TeamResource records contributed by that member are destroyed (revoked from the team). However, the underlying PlayerResource records (personal ownership) remain intact — they own those resources individually. Playgrounds running on team-shared Marquees are terminated (set to "destroying" status) when the member departs, and their PlayerResource entry for the playground is removed. The contributing player keeps their personal Marquee resources but the team no longer has access.

### Members can read shared resources but cannot edit or delete them

When a Marquee (runtime container) is shared with a team at "manage" permission level, all accepted members get read access to it. Non-owner/admin members cannot destroy, update, or modify shared Marquees or their Props/Playspecs — only the owner/admin can manage those. Shared resources appear in the member's accessible list but are read-only. Team members can contribute (share) their own Marquees to the team, but those are also then subject to member visibility restrictions.

### No team-scoped secrets, API keys, or audit logs — only resource sharing

Teams do not provide team-scoped secrets, API keys, webhooks, or audit logs. Teams only share Marquee resources with access control. Secrets, API keys, webhook endpoints, and audit logs remain player-scoped. When a member leaves a team, they retain all their personal secrets and keys — team membership has no effect on those resources. Team members cannot see each other's personal secrets or audit logs.

### Only Marquees (container runtimes) can be shared; read-only permission is "manage"

Only Marquee resources can be shared with teams (SHAREABLE_RESOURCE_TYPE="Marquee"). The only permission level is "manage" — there is no read-only or restricted sharing option. When a Marquee is contributed to a team at permission_level="manage", all team members get full access to run and interact with it (read/execute semantics, despite the name). Each resource can only belong to one team globally — a Marquee shared with one team cannot be re-shared to another.

### Teams feature is optional and gated behind a feature flag

Teams are an optional collaboration feature that must be enabled per player, except for super-admin accounts. Without the feature enabled, a player cannot create teams, manage memberships, or use team-based authorization rules. Accepted team Marquee access can still be honored where the product explicitly allows it.

### Pending invitations are cleaned up when user declines, allowing re-invite

When a team member declines an invitation, re-inviting them creates a fresh pending invitation. Accepted and currently pending invitations prevent duplicate re-invites for the same team.

### Team deletion requires no other accepted members; owner can delete their solo team

A team is deletable (deletable? returns true) only when there is 1 or fewer accepted members remaining. When a team has multiple accepted members, it cannot be deleted. The creator/owner can delete an empty team (just themselves as the only accepted member). Once a team has any accepted member besides the owner, deletion is blocked until all non-owner members leave or are removed.

### Team names must be unique only within a slug; slug format is strict

Team display name can have duplicates across teams. However, team slug must be globally unique and follow format `/\A[a-z0-9]([a-z0-9-]*[a-z0-9])?\z/` (lowercase alphanumeric with optional internal hyphens). Slugs are auto-generated from the name by parameterizing it; if the slug already exists, a counter is appended (e.g., `my-team-2`). Slugs cannot start/end with hyphens and are case-insensitive.

## Template Runtime Semantics

### Traefik loadbalancer healthcheck uses different defaults than Docker healthcheck

When `fibe.gg/zerodowntime: true` is set, Fibe injects TWO separate healthchecks: (1) Docker healthcheck on container (interval 10s, timeout 5s, retries 3, start_period 30s) and (2) Traefik loadbalancer healthcheck via labels (interval 2s, timeout 1s). The Traefik probe uses a different interval and timeout than the Docker probe. Users may expect them to be the same but the platform explicitly uses tighter Traefik timing for faster failover. The `fibe.gg/healthcheck_path` is shared by both, defaulting to `/up`.

### Variable names must match `^[A-Za-z0-9_]+$`; `$$var__NAME` and `$$random__NAME` refer to same declared variable

Template variables are declared in `x-fibe.gg.variables` with keys matching the alphanumeric pattern. When referencing, both `$$var__MYVAR` and `$$random__MYVAR` syntax refer to the same declared variable `MYVAR`. The `random` marker is semantic only (tells launcher to generate a stable 32-char hex if no value supplied); both syntaxes validate against the same declaration. Unknown variable references are caught as `undeclared_var` errors.

### Template YAML size has two separate limits: source length and expanded size

Template body has a 1,000,000 character limit (read-only validation). Additionally, YAML parsing enforces a 2,097,152 byte limit on expanded/processed YAML after parsing (checked in safe_yaml). These are separate constraints: the source can be smaller but still fail if expansion exceeds 2MB (e.g., through aliases/anchors). Users cannot see the 2MB limit from validation alone.

### Template version numbers are auto-assigned and immutable; body is read-only after creation

Version numbers are assigned sequentially at creation time (read-only :version). Once a version is created, its template body cannot be edited (read-only :template body). Users must create a new version to make changes. There is a per-template version limit enforced by player quota (template versions_per_template), so versions are not unlimited.

### YAML aliases/anchors are expanded but counted toward 2MB limit, not source-size limit

Templates can use YAML anchors and aliases for DRY composition. The source-file size is capped at 1MB, but after parsing YAML (which expands aliases), the result is checked against a 2MB limit. A compact template with heavy alias expansion can hit the 2MB limit even if the source is small. Users must be aware that alias chains increase the effective size for safety purposes.

## Tricks, Jobs, Schedules, And Automation

### Job completion polling timeout and max attempts

Jobs poll watched services every 10 seconds by default. The default maximum is 1,440 polls, yielding a maximum 4-hour job runtime. When this limit is exceeded, the job is marked errored with message 'Job timed out waiting for watched services to complete' and containers are torn down.

### Job expiration window defaults to 1 hour

Job-mode Playgrounds (Tricks) auto-expire after 1 hour by default. Non-job playgrounds default to 8 hours. Expired playgrounds are automatically cleaned up and their containers removed.

### Watched services determine job success/failure via exit codes

Services marked with job_watch: true (or fibe.gg/job_watch label) are watched. Job succeeds if all watched services exit with code 0; fails if any watched service exits with non-zero code. Exit codes and last 5000 log lines per service are persisted in the job result after completion. Services with exit code -1 indicate never-started (dependency failure) or still-running (sibling failure) states.

### CI trigger default max retries is unlimited; only checked at invocation

Trigger playspecs can specify max_retries count (per push event). If max_retries=3, the trigger worker refuses to create playground on retry_count >= 3. Default (nil) means unlimited retries. Retries only happen via explicit webhook re-fires or manual job re-queuing—no automatic exponential backoff or retry scheduling built in.

### Job results persisted indefinitely; playground destroyed after 1 hour

A job result containing service exit codes and log tails is created once and never destroyed—it survives playground expiration and deletion. Playground itself is auto-deleted after 1 hour, but the associated job result remains accessible via API and UI indefinitely (no retention policy enforced).

### Schedule syntax accepts cron and human-readable schedules

Schedule configuration supports cron expressions (e.g., '0 9 * * *') and human-readable formats (e.g., 'every day at 9am', 'every 5 minutes'). Invalid formats are rejected at playspec validation time. There is no minimum interval enforcement for scheduled Tricks, so very frequent schedules should be used carefully.

### Scheduled jobs do not overlap—single instance per playspec

The schedule worker re-enqueues itself for the next cron tick only after the current run completes. If a job takes longer than the scheduled interval, the next scheduled run is skipped (no queue-stacking). No concurrency control or 'missed run' recovery exists.

### Trigger disabled automatically when target Marquee becomes inactive

If a trigger's configured Marquee is marked 'disabled' or 'inactive' status, the trigger worker disables the trigger (updates trigger configuration enabled to false) and logs a warning. Manual re-enable required; trigger does not auto-recover when Marquee restored to 'active'.

### Trigger event filter supports push and pull_request; defaults to push

Trigger config event_type field accepts 'push' or 'pull_request' (defined in supported event list). Missing event_type defaults to 'push'. Branch filter is required and exact-matched. Both push and PR webhooks fire independently from VCS; if both are enabled and both fire on same SHA, two playground creations may occur.

### Job failure triggers optional Genie notification for CI-triggered jobs

When a triggered (CI) job completes with failure (exit code != 0) and a configured Genie id is set, a failure notification is queued to notify the Genie. Success jobs skip notification. This is opt-in per playspec and does not affect job status or result storage.

### Log tail collection limited to 5000 lines per service

The job completion worker collects only the last 5000 log lines per service by default for inclusion in job result. Logs exceeding this are truncated; full logs may still exist on the Marquee temporarily before container teardown.

### Tricks list paginated at 20 per page; no configurable limit

The Tricks list view uses page-size limit of 20. Jobs are sorted by created_at descending, showing newest first. No API flag to change page size for UI views.
