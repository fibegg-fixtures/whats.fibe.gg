---
title: Launch variables
description: Use path/paths for whole-node launch variables and inline $$var__ only as a last-resort fragment tool.
slug: /authoring/variables
sidebar_position: 5
image: /img/og/authoring-variables.png
keywords: [variables, $$var__, path, paths, random, default, validation, secret]
---

Use **`path`/`paths` whole-node replacement** as the normal route for launch variables. Use **inline `$$var__NAME`** only when the variable must be a fragment inside a larger string.

## Inline: `$$var__NAME`

Use it inside a larger string, such as an image tag or connection string. Do not use it as the whole value of an env entry or label value.

```yaml
services:
  web:
    image: ghcr.io/acme/app:$$var__TAG
    environment:
      DATABASE_URL: "postgres://user:$$var__DB_PASSWORD@db:5432/app"
    labels:
      fibe.gg/visibility: external
      fibe.gg/path_rule: PathPrefix(`/$$var__PATH_PREFIX`)
```

`$$root_domain` is special — Fibe always replaces it with the launching Marquee's root domain. You don't need to declare it.

Every declared variable must be used. Either reference it inline with `$$var__NAME`, or bind it with `path:` / `paths:`. A variable declared for later but not used anywhere fails validation with `unused_var` ("declared but never used").

## Whole-node: `path:` / `paths:`

Bind a variable to a specific location inside the template. The whole value at that location is replaced.

```yaml
x-fibe.gg:
  variables:
    REPLICAS:
      name: "Web replicas"
      default: 2
      path: services.web.deploy.replicas
    DEBUG:
      name: "Debug mode"
      default: false
      paths:
        - services.web.environment.DEBUG
        - services.worker.environment.DEBUG
```

See [Variable placement](/authoring/variable-placement/) for the path syntax.

## Which form to choose

| Usage | Best form |
| --- | --- |
| Whole scalar value (env entry, replica count, label value) | `path:` / `paths:` |
| Fragment inside a larger string (image tag, connection string, path prefix) | `$$var__NAME` |
| Replacing an existing Compose `${VAR}` whole-node reference | Concrete placeholder plus `path:` / `paths:` |
| Same value in many places | `paths:` with an array |

## Defaulting

When the launcher doesn't supply a value, Fibe uses:

1. The variable's `default`, if set.
2. A generated value if `random: true`.
3. Otherwise, an error if the variable is `required: true`.

Defaults are literal values only. Do not put `$$var__*`, `$$random__*`, or `$$root_domain` inside `default`; validation rejects nested defaults. For derived public URLs, create explicit variables and bind them through `path`/`paths`.

## Random values

- Set `random: true` and the launcher doesn't have to supply anything.
- The generated value is **persisted with the launch** and reused on subsequent compiles — your database password doesn't reset every time.
- Mark a variable `secret` or `sensitive` to nudge the launcher UI to mask the value.

## Validation patterns

Constrain what a launcher can type. The validation is a regular expression wrapped in slashes:

```yaml
validation: "/^[a-z][a-z0-9-]*$/"     # slug-like
validation: "/^[0-9]+$/"               # integer-as-string
validation: "/^[A-Za-z0-9_.-]+$/"      # image tag
```

Leave it empty or omit it when any value is fine.

## An example

```yaml
x-fibe.gg:
  variables:
    APP_NAME:
      name: "Application name"
      required: true
      default: "myapp"
      validation: "/^[a-z][a-z0-9-]*$/"
      paths:
        - services.web.environment.APP_NAME
        - services.worker.environment.APP_NAME

	    SUBDOMAIN:
	      name: "Subdomain"
	      default: "demo"
	      validation: "/^[a-z][a-z0-9-]*$/"
	      path: services.web.labels.fibe.gg/subdomain

    DB_PASSWORD:
      name: "Database password"
      required: true
      random: true
      secret: true
      paths:
        - services.web.environment.DB_PASS
        - services.db.environment.POSTGRES_PASSWORD

    REPLICAS:
      name: "Web replicas"
      default: 2
      path: services.web.deploy.replicas

	    DEBUG:
	      name: "Debug mode"
	      default: false
	      paths:
	        - services.web.environment.DEBUG
```

When a `path:` targets a dotted label key such as `services.web.labels.fibe.gg/subdomain`, keep that label key in the Compose file with a concrete local placeholder. Runtime validation rejects paths aimed at missing `services.<name>` roots, while missing leaves under an existing service can be created. See [Variable placement](/authoring/variable-placement/).

## Related

- [Variable placement](/authoring/variable-placement/) — what goes in `path:` / `paths:`.
- [Settings block](/authoring/settings-block/) — where `variables:` lives.
- Reference: [`reference-template-variables`](/reference/reference-template-variables/), [`recipe-random-and-secrets`](/reference/recipe-random-and-secrets/).
