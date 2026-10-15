---
title: ENV packs
description: Reusable readable ENV values kept in Library, picked per Playground, with ordered grants and applied runtime snapshots.
slug: /concepts/env-packs
sidebar_position: 7
image: /img/og/concepts-env-packs.png
keywords: [ENV pack, environment variables, Library, Playground, scheduled runs, grant, applied snapshot]
---

An ENV pack is a named Personal or Team map of ordinary readable environment values. Every value is a string; an empty string, quote or newline is meaningful. Packs are not a secret vault. Deleting a pack prevents fresh use while keeping its references identifiable.

Packs live in **Library → ENV packs**, listed for the owner selected in the Team pill (the owner column shows Personal or the Team name). There is no separate sidebar item; old `/env_packs` links redirect to Library.

## Picking packs

Pick packs when you create a Playground: the Playground, Template-launch and Greenfield forms each have an ENV pack picker. Each Playground card links to its ENV packs page, where you reorder, detach, target services, renew grants and see desired versus applied state.

A service Spec does not carry packs, and new service Playgrounds never inherit packs from their Spec. Only a job-mode Spec keeps packs, as **ENV packs for scheduled runs** in its Triggers modal (the gear on a `/tasks` row opens it); scheduled, triggered and manual Task runs from that Spec inherit them. Attaching packs to a service Spec is rejected, and a job-mode Spec with packs cannot switch back to service mode until you detach them.

Attachments are ordered. Later attachments win. An attachment applies to all services unless you select service names; an empty selected-service list is invalid. All-service attachments include future services. A missing selected service blocks fresh use.

On creation, omitted or null attachment input attaches nothing from a service Spec and inherits a job-mode Spec's list. On updates, omitted or null preserves existing references. `[]` explicitly detaches or opts out. A supplied list replaces the list. Rerun uses the source Playground references independently of later Spec defaults. Template and Greenfield launch forms take recipient selections separately from the authored template.

## Grants and visibility

The server records the granting person or durable Team service account after checking source access and target authority. Client grantor fields cannot authorize a reference. Reordering retains existing grants; adding, retargeting and renewing require current authority. A Team service account cannot delegate a Personal pack or another Team's pack.

Resource managers can read the granted values in the receiving ENV view. Provenance identifies the pack, version, order, selected services and grant status. Ordinary metadata excludes immutable snapshot values. If a grantor loses access, fresh use fails until an authorized person renews or replaces the reference.

## Runtime behavior

The merge order is repository defaults, ordered packs, global overrides, shared job ENV, Spec system ENV, explicit service overrides, then computed FIBE values. Static services skip repository defaults.

An explicit runtime operation captures a candidate before effects. Its retries reuse that candidate; only confirmed success makes it applied. Saving a pack or reference does not restart containers or copy inherited values into explicit overrides. The ENV editor retains an unchanged inherited baseline.

Automatic repair reuses the last applied values, including after pack deletion or grantor departure. An explicit start/restart/apply checks current grants and captures fresh values. A target that never applied packs has no candidate fallback for repair.

## Clients and portability

Use **Library → ENV packs** (`/library/env_packs`) or the matching candidate `fibe env-packs` commands. The API exposes `/api/env_packs` and ordered attachment endpoints on Playgrounds and job-mode Specs; a non-empty attachment list on a service Spec returns 422 `env_pack_spec_job_mode_required`. Read/write/delete/manage pack scopes and target management authority are checked separately.

Exports include readable definitions and selected-service references. Import creates personal copies with new IDs and grants from the authenticated importer. Exported owner or grantor fields never become authority. Missing definitions remain explicitly unavailable. Applied runtime authority is not imported.
