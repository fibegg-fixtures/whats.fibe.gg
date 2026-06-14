---
name: fibe-tool-resource-delete
description: Use when you need to permanently delete a Fibe resource by id (or name for playgrounds/tricks/playspecs/props/marquees/agents). Destructive — requires confirm:true.
---

# fibe_resource_delete

[MODE:SIDEEFFECTS] Destructive, idempotent. Tier: base.

Generic delete. Routes to the matching `DELETE /api/<plural>/:id` endpoint. Related resources may be deleted depending on the resource type.

## When to use
- Cleaning up a Playground after a Trick/Job has finished.
- Removing dead Props after a repo migration.
- Pruning unused Secrets/Webhooks/Templates.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `resource` | string (enum) | yes | Canonical or alias |
| `id` | number | one of | Numeric ID |
| `id_or_name` | string | one of | Numeric ID or name for named resources |
| `id_or_key` | string | one of | Numeric ID or key for secrets |
| `confirm` | bool | yes (unless `--yolo`) | Must be `true` |

## Output
```json
{
  "resource": "playground",
  "id_or_name": "my-app",
  "id": 42,
  "deleted": true
}
```

## Behavior — Playground
Playground deletion does not block until every container is gone. Fibe marks the Playground `destroying`, returns 202 immediately, and finishes cleanup asynchronously on the Marquee. Use `fibe_playgrounds_wait(status:"destroyed")` if you need to be sure it's gone.

If the playground is already in `destroying`, the call is idempotent — no second job is queued.

## Behavior — others
| Resource | Notes |
|---|---|
| `prop` | Cascade-detaches related Playspecs/Templates referencing it; the underlying Git repo is NOT deleted (you handle that separately). |
| `playspec` | Refuses if a non-destroyed Playground still references it. |
| `template` | Deletes versions; refuses if linked Playspecs still exist. Use `template_version` to delete a single version. |
| `secret` | Plaintext gone forever — irreversible. |
| `webhook` | Stops future deliveries; past delivery logs persist. |
| `agent` | Stops chats, removes mounts; artefacts/feedbacks/mutters cascade. |
| `template_source` | Clears Source attachment from a template (special semantics — alias for "set source to null"). |
| `audit_log` / `memory` | Self-delete only; admin-only for cross-player. |

## Gotchas
- `confirm:true` is enforced server-side (in the SDK) when not in `--yolo`. Without it you get a `confirmRequiredError` and no API call is made.
- Named-resource deletion of an in-flight Playground may race with `destroying` transition; you'll see `INVALID_STATE` if you retry against an already-destroying record.
- Fibe returns 202/204 on success; the SDK normalizes to a `deleted: true` envelope.
- Deletion is **not** reversible. There is no soft-delete restore for Playgrounds, Props, Secrets.
- `secret` deletion does NOT remove the Secret from running Playground envs that already mounted it; rolling out a new compose is required to fully evict.

## Related
- `fibe_resource_get` — confirm what you're about to delete.
- `fibe_playgrounds_action` — `stop` first if you want graceful shutdown.
- `fibe_playgrounds_wait` — confirm async destruction.
