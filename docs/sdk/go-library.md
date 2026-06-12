---
title: Go library
description: Embed Fibe in your own Go programs. Client construction, resource managers, auto-retry, circuit breaker, idempotency, structured errors.
slug: /sdk/go-library
sidebar_position: 5
sidebar_label: Go library
image: /img/og/sdk-go-library.png
keywords: [fibe Go library, github.com/fibegg/sdk/fibe, retry, circuit breaker, idempotency, rate limit]
---

The Go library at `github.com/fibegg/sdk/fibe` is the same code the CLI uses internally — same retries, same circuit-breaker, same rate-limit handling, same structured errors. Embed it in your own Go programs when you want fine-grained control without shelling out to the CLI.

This page is the orientation. Per-method API docs live at [pkg.go.dev/github.com/fibegg/sdk/fibe](https://pkg.go.dev/github.com/fibegg/sdk/fibe).

## Install the library

```sh
go get github.com/fibegg/sdk/fibe
```

Pin to a tag for reproducible builds. The library follows semver.

## Construct a client

```go
package main

import (
    "context"
    "log"
    "os"
    "github.com/fibegg/sdk/fibe"
)

func main() {
    client := fibe.NewClient(
        fibe.WithAPIKey(os.Getenv("FIBE_API_KEY")),
        // optional:
        fibe.WithDomain("https://fibe.gg"),
        fibe.WithTimeout(30*time.Second),   // 30s is the default
        fibe.WithUserAgent("my-app/1.2"),
    )

    ctx := context.Background()
    me, err := client.APIKeys.Me(ctx)   // or client.Ping(ctx) for a cheap auth check
    if err != nil { log.Fatal(err) }
    log.Printf("logged in as %s", me.Username)
}
```

`NewClient` reads from the same `~/.config/fibe/` profile system the CLI uses when no `WithAPIKey` is supplied. So the same machine, with the same profile active, gives you the same identity.

## Resource managers

Each resource family hangs off the client:

| Manager | Operates on |
| --- | --- |
| `client.Playgrounds` | Playgrounds (long-running environments) |
| `client.Tricks` | One-shot job runs |
| `client.Playspecs` | Launch blueprints |
| `client.Agents` | Genies |
| `client.ImportTemplates` | Catalog templates (plus `client.ImportTemplateVersions` for their versions) |
| `client.Props` | Connected Git repositories |
| `client.Marquees` | Docker hosts |
| `client.Secrets` | Secret Vault entries |
| `client.JobEnv` | Job ENV entries |
| `client.APIKeys` | Your own API keys |
| `client.WebhookEndpoints` | Outbound event subscriptions |
| `client.Artefacts` | Generated outputs |
| `client.Mutters` | Progress notes |
| `client.Feedbacks` | Reviews on artefacts |
| `client.AuditLogs` | Read-only history |
| `client.Monitor` | Live event stream |

The common shape of a manager is:

```go
type PlaygroundsManager interface {
    List(ctx context.Context, params *PlaygroundListParams) (*ListResult[Playground], error)
    Get(ctx context.Context, id int64) (*Playground, error)
    Create(ctx context.Context, params *PlaygroundCreateParams) (*Playground, error)
    Update(ctx context.Context, id int64, params *PlaygroundUpdateParams) (*Playground, error)
    Delete(ctx context.Context, id int64) error

    Rollout(ctx context.Context, id int64) (*Playground, error)
    HardRestart(ctx context.Context, id int64) (*Playground, error)
    Stop(ctx context.Context, id int64) (*Playground, error)
    Start(ctx context.Context, id int64) (*Playground, error)
    Logs(ctx context.Context, id int64, service string, tail *int) (*PlaygroundLogs, error)
    LogsStream(ctx context.Context, id int64, service string, opts *LogsStreamOptions) <-chan LogLine
    WaitForStatus(ctx context.Context, id int64, status string, timeout, interval time.Duration) (*Playground, error)
}
```

(Exact signatures live in godoc. The shape above is the pattern.)

## Built-in robustness

You don't manage retries or backoff yourself:

- **Request timeout** — every request times out after 30 seconds by default; change it with `WithTimeout`.
- **Automatic retry** on transient errors — on by default: up to 3 retries on 429, 500, 502, 503, and 504 responses, with exponential backoff and full jitter (a random fraction of 500 ms × 2^attempt, capped at 30 s); a `Retry-After` header overrides the computed delay. Network timeouts and cancelled contexts are **not** retried — those return to you immediately.
- **Idempotency keys** — for safe re-tries of the same mutation, pass your own key: `ctx = fibe.WithIdempotencyKey(ctx, fibe.NewIdempotencyKey())`; the platform replays the cached response for 24 hours. Without one, each call gets a fresh key — so two separate `Create` calls create two resources.
- **Circuit breaker** (opt-in; off by default in the library, on by default in the [MCP server](/sdk/mcp-server/)) — `fibe.WithCircuitBreaker(fibe.DefaultBreakerConfig)` opens after 5 consecutive failures, so your program doesn't hammer a sick API. After 30s it goes half-open and lets 2 test requests through: a success closes the circuit, any failure reopens it.
- **Rate-limit awareness** — when the server returns a rate-limit header, the client sleeps for the indicated retry-after window.
- **Structured errors** — every error implements an interface that lets you ask `IsNotFound(err)`, `IsRateLimited(err)`, `RequestID(err)`, etc., instead of string-matching.

You can tune these by passing options to `NewClient`. Example: a tighter retry policy for a CI runner that should fail fast:

```go
client := fibe.NewClient(
    fibe.WithAPIKey(key),
    fibe.WithMaxRetries(1),
    fibe.WithRetryDelay(200*time.Millisecond, 2*time.Second),
)
```

## Example — launch a Playground and stream logs

```go
ctx := context.Background()

pg, err := client.Playgrounds.Create(ctx, &fibe.PlaygroundCreateParams{
    Name:              "demo",
    PlayspecID:        42,
    MarqueeIdentifier: "1",
})
if err != nil { log.Fatal(err) }

// Wait until it's reachable (poll every 3s, give up after 5m).
if _, err := client.Playgrounds.WaitForStatus(ctx, pg.ID, "running", 5*time.Minute, 3*time.Second); err != nil {
    log.Fatal(err)
}

// Stream logs.
for line := range client.Playgrounds.LogsStream(ctx, pg.ID, "web", nil) {
    fmt.Println(line.Text)
}
```

## Example — trigger a Trick and report results

```go
trick, err := client.Tricks.Trigger(ctx, &fibe.TrickTriggerParams{
    PlayspecIdentifier: "99",
})
if err != nil { log.Fatal(err) }

// A trick runs as a job-mode playground; wait for its terminal status.
final, err := client.Playgrounds.WaitForStatus(ctx, trick.ID, "completed", 30*time.Minute, 5*time.Second)
if err != nil { log.Fatal(err) }

// Then inspect the job outcome.
if final.ExitCode != nil && *final.ExitCode != 0 {
    log.Fatalf("trick failed: exit %d", *final.ExitCode)
}
log.Printf("job result: %+v", final.JobResult)
```

## Testing with `fibetest`

The `github.com/fibegg/sdk/fibetest` package ships an in-process mock HTTP server with canned responses for the standard endpoints, plus per-route interceptors for table-driven tests. Use it to test code that calls the SDK without touching a real Fibe.

```go
import "github.com/fibegg/sdk/fibetest"

func TestMyFlow(t *testing.T) {
    mock := fibetest.NewMockServer()
    defer mock.Close()
    mock.Interceptors["/api/playgrounds/12"] = func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        io.WriteString(w, `{"id":12,"name":"demo","status":"running"}`)
    }

    client := fibe.NewClient(fibe.WithDomain(mock.Domain()))
    pg, _ := client.Playgrounds.Get(context.Background(), 12)
    if pg.Status != "running" { t.Fatal("expected running") }
}
```

Tests run offline; no network, no Fibe account needed.

## Concurrency

The client is safe to share across goroutines. Each call is independent; the rate limiter and circuit breaker coordinate across goroutines so you don't have to.

For workloads doing many parallel calls, bound the parallelism yourself — e.g. an `errgroup.Group` with `SetLimit` — the client respects context cancellation.

## When the CLI is enough

You don't have to embed the library for every job. If you're doing one-off automation, the CLI with `-o json` and a bit of `jq` is often simpler:

```sh
fibe playgrounds list -o json --only id,status | jq '.Data[] | select(.status=="error")'
```

Reach for the Go library when you need typed responses, structured error handling, or you're embedding Fibe deep in another product.

## Next step

For AI agents that should drive Fibe themselves, [run the MCP server](/sdk/mcp-server/) and let them call typed tools.
