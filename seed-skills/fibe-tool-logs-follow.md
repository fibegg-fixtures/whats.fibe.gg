---
name: fibe-tool-logs-follow
description: Use when you need to stream a Playground service's live logs as MCP progress notifications until duration elapses or max_lines reached. For waiting on a specific log pattern.
---

# fibe_logs_follow

[MODE:BROWNFIELD] Tier: brownfield. Read-only API but emits progress events.

Following live logs requires a funded Marquee and returns `MARQUEE_NOT_FUNDED` when unpaid.

Streams service logs line-by-line as MCP progress notifications, returning a final aggregate when bounded by duration/max_lines. It can follow either playground or trick logs.

## When to use
- "Wait until I see 'listening on :8080'."
- Watching a slow boot to confirm a service settled.
- Tailing a worker after triggering a job.

## When NOT to use
- One-shot snapshot — use `fibe_playgrounds_logs`.
- Need cross-service context — use `fibe_playgrounds_debug` with `logs_tail`.

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `id_or_name` | string/number | yes | Playground or trick ID/name |
| `target` | string | no | `playground` or `trick`; defaults to `playground` |
| `service` | string | no | Compose service name; omit for all services |
| `tail` | number | no | Initial lines from history (default 50) |
| `duration` | string | no | Go duration; default `30s`, max constrained by transport timeout |
| `max_lines` | number | no | Stop after N new lines (default 500) |

## Output (final)
```json
{
  "id_or_name": 42,
  "target": "playground",
  "service": "web",
  "events": [ ... ],
  "lines": [
    { "text": "...", "source": "stdout|stderr", "service": "web" },
    ...
  ],
  "line_count": 257,
  "count": 260
}
```

`count` is the total number of returned events, including non-log status events. `line_count` is the number of log lines. While streaming, each line is also delivered as an MCP `notifications/progress` event tagged with the request's `progressToken` (when the client provided one). Hosts that surface progress (Claude Desktop, etc.) display lines in real time.

## Bounds
The stream stops when:
- `duration` elapses, OR
- `max_lines` are observed, OR
- The client cancels the call, OR
- The server-side stream closes (container exits, network drops).

Whichever comes first.

## Gotchas
- Named identifiers are accepted through `id_or_name`.
- `duration` strings: `"30s"`, `"5m"`. Bare integers are interpreted as seconds.
- Some MCP clients drop progress notifications between request and final result — even then you still get the aggregated `lines` array at the end.
- If the underlying Marquee SSH connection drops, the stream just stops; reconnect and re-call to resume.
- This is the right primitive for "verify the service is up" but `fibe_playgrounds_wait(status:"running")` is usually simpler when the signal is the Playground status flip.

## Related
- `fibe_playgrounds_logs` — bounded snapshot.
- `fibe_playgrounds_wait` — wait for status transitions instead.
- `fibe_playgrounds_debug` — get service names before following.
