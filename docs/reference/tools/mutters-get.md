---
title: "Mutters Get"
description: "Use when you need to retrieve one Agent's mutter stream — the \"thinking out loud\" feed of progress, info, warning, error, and success notes — with optional query/status/severity/playground filters."
slug: /reference/tools/mutters-get
sidebar_label: "Mutters Get"
image: /img/og/reference-tools-mutters-get.png
keywords: ["Fibe", "Tool", "fibe", "tool", "mutters", "get"]
tags: ["reference", "tool", "tool"]
format: md
---

[MODE:OVERSEER] Read-only, idempotent. Tier: overseer.

Returns the mutter feed for one Agent through `GET /api/agents/:id/mutter`, with optional Playground filtering.

## When to use
- Reviewing an Agent's recent reasoning/progress.
- Filtering mutters by `playground_id_or_name` while triaging a specific work item.
- After major milestones — Player feedback often references specific mutters.

## When NOT to use
- Cross-Agent search — use `fibe_monitor_list/follow`.
- You only need the latest event ASAP — `fibe_monitor_follow` with `type:"mutter"`.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `id_or_name` | int or string | yes | Agent ID or name |
| `playground_id_or_name` | int or string | no | Filter to mutters tagged with this Playground |
| `query` | string | no | Substring match across all string fields in each item |
| `status` | string | no | Filter by item's `status` field |
| `severity` | string | no | Filter by item's `severity` field |
| `page` | int | no | 1-based; default 1 |
| `per_page` | int | no | Default per server config |

## Output
```json
{
  "data": [
    { "type":"success", "body":"...", "created_at":"...", "status":"...", "severity":"..." },
    ...
  ],
  "meta": { "page": 1, "per_page": 25, "total": 137 },
  "id": <mutter_record_id>,
  "id_or_name": 42,
  "playground_id_or_name": 7,
  "created_at": "...",
  "updated_at": "..."
}
```

The top-level fields describe the mutter record; `data` is the filtered, paginated `items` array.

## Filter semantics
- `query` lowercase-matches against any string value in each item.
- `status`/`severity` are case-insensitive exact match on the item's field of that name.
- All filters are AND-combined.

## Gotchas
- A 404 means the Agent has no mutter record — they haven't posted any mutter yet.
- `total` is the count after filtering; the underlying record may have far more items.
- Items are typed by their `type` field (`info`, `warning`, `error`, `success`, or another free-form string) — the same field used by `fibe_mutter` when creating.
- Pagination operates on the in-memory filtered array — large mutter histories work but each request loads the entire JSONB.
- `playground_id_or_name` resolves names too (e.g., "demo-app").

## Related
- `fibe_mutter` — create new mutter items.
- `fibe_monitor_list` / `fibe_monitor_follow` — broader event stream.
- `fibe_feedbacks_list` — Player comments on specific mutters/artefacts.
