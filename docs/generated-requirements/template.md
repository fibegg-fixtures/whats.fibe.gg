---
title: template
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## The two ingredients

- A settings block at the root under x-fibe.gg: .

- A settings block at the root under x-fibe.gg: . Holds launch-time variables and template metadata. Optional, but you'll want it once you have anything customizable.

## The shortest path

2. Connect a Prop. A Git repo.

## The shortest path

4. Launch a Playground from a Playspec. Open the URL.

## Two ways variables are written into the document — 1. Inline $$var NAME

Behavior: - Missing user value AND missing default AND missing random → string substitution falls back to the literal placeholder (compiler still flags is required if required: true ).

Behavior: - Missing user value AND missing default AND missing random → string substitution falls back to the literal placeholder (compiler still flags is required if required: true ). - Multiple references to the same variable receive the same value. For random: true , the same 32-hex value is used everywhere in one compile pass.

## Reference: Template variables — Validation regex

Validation runs after default/random resolution.

Validation runs after default/random resolution. An empty/blank value skips validation.

## Reference: Template variables — Unused-variable rule

Runtime emits unused var for these.

Runtime emits unused var for these. So either reference inline, bind via path, or remove.

## Reference: Template variables — Undeclared-reference rule

Any $$var NAME / $$random NAME occurrence whose NAME does not appear in x-fibe.gg.variables is undeclared var .

## Reference: Template variables — Defaulting and override order

4. (If none and required: true ) → compile error.

## Reference: Template variables — $$root domain

Special, not declared in variables .

Special, not declared in variables . Always replaced at compile time with the launching Marquee's root domain (e.g. next.fibe.live ). Use it only as an inline fragment where a fully-qualified public host cannot be represented with explicit path / paths variables. Prefer explicit public URL variables with literal defaults for app ENV:

## Typical paths

code example

## Optional enhancements — Add zero-downtime for the wiki service

code example

## Playbook: Wiki.js — Validate

code example

## Description

Use YAML anchors ( &amp;name ) and aliases ( name ) to share depends on , environment , build , healthcheck, or label blocks across multiple Fibe services without copy-paste.

## Reference: Template variables — Declaration shape

Field Compile-time effect default: Used when no user value.

Field Compile-time effect default: Used when no user value. Must be a literal; $$var , $$random , and $$root domain are invalid inside defaults.
