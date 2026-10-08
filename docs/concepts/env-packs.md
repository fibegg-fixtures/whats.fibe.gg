---
title: ENV packs
description: Reusable readable ENV values, ordered grants and applied runtime snapshots.
slug: /concepts/env-packs
sidebar_position: 7
image: /img/og/concepts-env-packs.png
keywords: [ENV pack, environment variables, grant, applied snapshot]
---

An ENV pack is a named personal or company map of ordinary readable environment values. Every value is a string; an empty string, quote or newline is meaningful. Packs are not a secret vault. Deleting a pack prevents fresh use while keeping its references identifiable.

Attach packs to a Spec or Playground in order. Later attachments win. An attachment applies to all services unless you select service names; an empty selected-service list is invalid. All-service attachments include future services. A missing selected service blocks fresh use.

Omitted or null attachment input preserves defaults/existing references. `[]` explicitly detaches or opts out. A supplied list replaces the list. Rerun uses the source Playground references independently of later Spec defaults. Template and Greenfield launch forms take recipient selections separately from the authored template.

## Grants and visibility

The server records the granting person or durable company principal after checking source access and target authority. Client grantor fields cannot authorize a reference. Reordering retains existing grants; adding, retargeting and renewing require current authority. A company principal cannot delegate a personal or another company's pack.

Resource managers can read the granted values in the receiving ENV view. Provenance identifies the pack, version, order, selected services and grant status. Ordinary metadata excludes immutable snapshot values. If a grantor loses access, fresh use fails until an authorized person renews or replaces the reference.

## Runtime behavior

The merge order is repository defaults, ordered packs, global overrides, shared job ENV, Spec system ENV, explicit service overrides, then computed FIBE values. Static services skip repository defaults.

An explicit runtime operation captures a candidate before effects. Its retries reuse that candidate; only confirmed success makes it applied. Saving a pack or reference does not restart containers or copy inherited values into explicit overrides. The ENV editor retains an unchanged inherited baseline.

Automatic repair reuses the last applied values, including after pack deletion or grantor departure. An explicit start/restart/apply checks current grants and captures fresh values. A target that never applied packs has no candidate fallback for repair.

## Clients and portability

Use `/env_packs` or the matching candidate `fibe env-packs` commands. The API exposes `/api/env_packs` and ordered attachment endpoints on Specs/Playgrounds. Read/write/delete/manage pack scopes and target management authority are checked separately.

Exports include readable definitions and selected-service references. Import creates personal copies with new IDs and grants from the authenticated importer. Exported owner or grantor fields never become authority. Missing definitions remain explicitly unavailable. Applied runtime authority is not imported.
