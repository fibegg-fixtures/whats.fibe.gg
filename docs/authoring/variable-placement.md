---
title: Variable placement (paths)
description: When you bind a variable to a location with path or paths, the location is a dotted reference into the template body.
slug: /authoring/variable-placement
sidebar_position: 6
image: /img/og/authoring-variable-placement.png
keywords: [path, paths, YAML path, dotted notation, array index, fibe.gg/port]
---

When you bind a variable to a location with `path:` or `paths:`, the location is a dotted reference into the template body.

## Typical paths

```text
services.web.environment.RAILS_ENV
services.web.deploy.replicas
services.web.labels.fibe.gg/port
services.web.labels.fibe.gg/subdomain
x-fibe.gg.metadata.description
services.web.environment.[0]
services.web.command.[2]
```

Write the array index as its own dot-separated segment: `services.web.environment.[0]` and `services.web.command.[2]` (or plain `.0` / `.2`). A bracket attached to the key name, like `command[2]`, is treated as a literal key named `command[2]`, not an index.

Dotted label keys such as `fibe.gg/port` are matched as single keys only when that label already exists under `labels:`. If a path binding is meant to set a `fibe.gg/*` label, put the label in the template first, even with an empty or placeholder value, then bind the variable to it; otherwise the path writer treats the dots as nested map segments instead of inventing a single dotted label key.

## Same value, many destinations

```yaml
DB_PASSWORD:
  name: "Database password"
  required: true
  random: true
  paths:
    - services.postgres.environment.POSTGRES_PASSWORD
    - services.pgbouncer.environment.DB_PASSWORD
    - services.web.environment.FIBE_DB_PASS
    - services.jobs.environment.FIBE_DB_PASS
```

One random value, four destinations. All four read the same value at launch time.

## How writes are typed

Fibe infers the type of the written value:

- All-digit strings → integers.
- `true` / `false` in any letter case → booleans.
- Anything else → strings.

If you need a literal `"3"`, supply the value with quotes via a different mechanism — a path write of `3` will become an integer.

## Useful behaviors

- **Path writes happen after any inline substitution.** If both target the same value, the path write wins.
- **Missing intermediate maps are created for you**, but they are ordinary nested maps. They don't invent new dotted label keys under `labels:`.
- **A path that doesn't match the document's shape never fails the compile** — but it may write the value under an unexpected literal key instead of where you intended. Always double-check paths against the template's actual YAML structure.

## Related

- [Launch variables](/authoring/variables/) — what's in a variable definition.
- Reference: [`reference-yaml-paths`](/reference/reference-yaml-paths/).
