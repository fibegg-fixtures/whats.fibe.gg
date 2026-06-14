---
name: fibe-tool-mutter
description: Use when you need to post one short progress/info/warning/error/success note as the current Agent. The dedicated Agent progress channel.
---

# fibe_mutter

[MODE:SIDEEFFECTS] Tier: base. Not idempotent.

Appends one item to the current Agent's mutter stream through `POST /api/agents/:agent_id/mutter`. Items are stored on the Agent's mutter feed.

## When to use
- Continuous progress signals (every meaningful step in `system.md`).
- Reporting verified outcomes (`type:"success"`).
- Surfacing unexpected issues (`type:"warning"` or `type:"error"`).
- Hard stop, need Player input (`type:"error"`).
- General milestones or progress (`type:"info"`).

This is the canonical agent-progress channel. Players see mutters in the UI; they can leave Feedback on them.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | yes | Common values: `info`, `warning`, `error`, `success`; extensible |
| `body` | string | yes | The note's body text |
| `playground_id_or_name` | int or string | no | Tag to a specific Playground/Trick (auto-resolved from name) |

`agent_id` is **NOT** an input — read from `FIBE_AGENT_ID` env. Without it, the tool errors before sending a request.

## Output
The full mutter JSON envelope, including the new item appended to `content.items`. Successful creates return HTTP `201 Created`.

## Behavior
1. Resolves `agent_id` from env.
2. Validates payload via `mutter.create` schema (`fibe_schema(resource:"mutter", operation:"create")`).
3. Finds-or-builds the mutter record (one per Agent, one per (Agent, Playground) pair).
4. Appends `{ type, body, created_at }` to `content.items`.
5. Saves with idempotency-key middleware — same key replays cached prior response.

## Gotchas
- `playground_id_or_name` resolves names too; an unknown playground returns the standard `RESOURCE_NOT_FOUND`.
- The mutter record is JSONB; very long histories get expensive to read — paginate with `fibe_mutters_get`.
- The body is whatever string you send; no markdown rendering on the API side, but UIs typically render it.
- `type` is free-form, but UIs render known types specially. Stick to `info`, `warning`, `error`, or `success` unless you have a reason.
- Items persist until the mutter record is destroyed (i.e., never, in normal operation).

## Recipes
- Verified deployment: `{ "type":"success", "body":"Deploy success: https://demo-app.fibe.live", "playground_id_or_name":42 }`.
- Hard block: `{ "type":"error", "body":"Need Player to authorize webhook secret rotation." }`.
- Tracking step: `{ "type":"info", "body":"Investigating slow query in /products endpoint." }`.

## Related
- `fibe_mutters_get` — read existing items.
- `fibe_artefact_upload` — for longer-lived deliverables (reports, plans, files).
- `fibe_feedbacks_list` — see Player responses.
