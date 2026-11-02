---
title: Native Fibe Compose JSON Schema
description: The versioned JSON Schema used to describe Native Fibe Compose Specs, labels, and variables.
slug: /reference/json-schema
sidebar_label: JSON Schema
sidebar_position: 99
image: /img/og/reference-json-schema.png
keywords: [Fibe, Native, JSON Schema, Compose, validation, autocomplete]
tags: [reference, schema, compose]
format: md
---

The Native Compose schema describes the Compose shape and Fibe-specific configuration accepted for Specs, including `fibe.gg/*` labels, the `x-fibe.gg` block, and variables. Use it for editor assistance and early validation. Runtime checks can still depend on a Host, Repository, or other resource.

## Download the schema

- [Versioned Fibe Compose schema](https://whats.fibe.gg/schemas/fibe-compose.v1.schema.json)
- [Schema alias](https://whats.fibe.gg/schema.json)
- [Native OpenAPI contract](https://whats.fibe.gg/native/openapi.json)

The published schema is copied from the pinned Native API source. Refer to the versioned file when a project needs a stable schema URL.

## Use it in an editor

For VS Code with the YAML extension, map the schema to Compose files in `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "https://whats.fibe.gg/schemas/fibe-compose.v1.schema.json": [
      "compose.yml",
      "compose.yaml",
      "docker-compose.yml",
      "docker-compose.yaml"
    ]
  }
}
```

For an individual file, add the YAML language-server directive:

```yaml
# yaml-language-server: $schema=https://whats.fibe.gg/schemas/fibe-compose.v1.schema.json
services:
  web:
    image: nginx:alpine
    labels:
      fibe.gg/port: 80
      fibe.gg/visibility: external
```

## Validate in CI

Use any JSON Schema validator that supports the schema dialect declared by the file. For example, with `check-jsonschema`:

```sh
pipx run check-jsonschema \
  --schemafile https://whats.fibe.gg/schemas/fibe-compose.v1.schema.json \
  compose.yaml
```

Schema validation catches malformed Compose shape and invalid Fibe-specific values. It does not establish that a Repository is accessible, a Host is ready, or a runtime operation will succeed. Use the Native interface or API validation operation for those checks.

## Supported label set

The Native Compose label parser recognizes 21 Fibe labels:

`repo_url`, `source_mount`, `job_watch`, `dockerfile`, `env_file`, `start_command`, `port`, `visibility`, `production`, `zerodowntime`, `branch`, `subdomain`, `path_rule`, `build_target`, `build_args`, `healthcheck_path`, `healthcheck_interval`, `healthcheck_timeout`, `healthcheck_retries`, and `healthcheck_start_period`.

For meanings, defaults, and examples, see [Fibe labels](/reference/reference-fibe-labels). The schema file remains authoritative for accepted field shapes.

## Variables

Variables are declared under `x-fibe.gg.variables` and can provide values to Compose paths:

```yaml
services:
  web:
    image: nginx:alpine
    labels:
      fibe.gg/port: 80
      fibe.gg/subdomain: app

x-fibe.gg:
  variables:
    SUBDOMAIN:
      name: Public subdomain
      default: app
      path: services.web.labels.fibe.gg/subdomain
```

See [template variables](/reference/reference-template-variables) for declarations, interpolation, defaults, and path bindings.

## Schema limits

The schema validates document shape and declared constraints. It cannot prove that a Host or Repository identifier is available to the current owner, that source access works, or that a generated runtime plan will start successfully. Consult the [validation pipeline](/reference/reference-validation-pipeline) for the stages after schema validation.
