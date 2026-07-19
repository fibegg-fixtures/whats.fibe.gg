---
title: "Local Playgrounds Info"
description: "Use when you need to get filesystem-level info about one local Playground (name, path, playspec, mounts) without an API call."
slug: /reference/tools/local-playgrounds-info
sidebar_label: "Local Playgrounds Info"
image: /img/og/reference-tools-local-playgrounds-info.png
keywords: ["Fibe", "Tool", "fibe", "tool", "local", "playgrounds", "info"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:BROWNFIELD] Read-only, idempotent. Tier: brownfield.

Returns local Playground names, URLs, source mounts, or full metadata from the local Marquee filesystem. No Fibe API call. Source paths come from the Playground's rendered Compose bind mounts.

## When to use
- Discover local Playgrounds with `view:"names"`.
- Discover service URLs with `view:"urls"`.
- Discover per-service source mount paths with `view:"mounts"`.
- Confirm a local Playground's compose project name / paths.
- Pre-flight before `fibe_local_playgrounds_link` to verify the target.
- Mapping a name to its mount directory for ad-hoc shell debugging.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `view` | string | yes | `names`, `current`, `repos`, `urls`, `mounts`, or `details` |
| `id_or_name` | string | no | Local Playground ID, name, compose project, Playspec, or unique Playspec prefix. Required for `urls`, `mounts`, and `details`; omit for `names`, `current`, and `repos`. |

## Output
Native structured MCP data, not a CLI `stdout` envelope.

`view:"names"`:
```json
[{ "id": "42", "name": "demo-app--42", "playspec": "demo-app", "path": "/opt/fibe/playgrounds/demo-app--42" }]
```

`view:"urls"`:
```json
[{ "service": "web", "url": "https://web.phoenix.test" }]
```

`view:"mounts"`:
```json
[{ "service": "web", "mount": "/opt/fibe/playgrounds/demo-app--42/props/acme--demo-app--91f0c9a8b7/main", "prop": "demo-app", "branch": "main" }]
```

`view:"details"` returns the full local Playground object with the per-service
metadata parsed from rendered Compose. `view:"mounts"` and `details` keep one
entry per service, so services sharing a physical checkout may report the same
host path more than once. The link command deduplicates those identical targets.
The SDK does not expose normalized repository identity and does not allocate the
`/opt/fibe` checkout layout.

## Gotchas
- `names`, `current`, and `repos` do not accept a target selector.
- `urls`, `mounts`, and `details` require one target selector.
- Numeric selectors match the local compose project suffix (`<name>--<id>`), not an API lookup.
- Ambiguous playspec prefixes return an error listing candidates.
- Filesystem-only — local data may be stale if the Playground has been remotely deleted.

## Related
- `fibe_local_playgrounds_link` — symlink for `/app/playground`.
