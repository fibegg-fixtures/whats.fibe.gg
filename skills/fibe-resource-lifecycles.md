---
name: fibe-resource-lifecycles
description: Use to explain how Native Fibe resources relate, change, run, and are removed.
---

# Fibe resource lifecycles

Use this guide to explain the basic relationships between Native Fibe resources. Consult the current API contract for exact status names, action preconditions, and deletion effects; these can be more specific than the conceptual lifecycle below.

## Host

A Host is configured as a runtime destination for Fibe workloads. The operator supplies and maintains the machine and its Docker environment. Confirm that a Host is available before starting a Playground or Task, and consider its workloads and data before changing or removing its configuration.

The Native API exposes Host connection tests and Host runtime operations. Use the connection test after changing access settings; inspect the Host's runtime state when a workload cannot start.

## Repository

A Repository connects source to Fibe. It may supply Compose files, application code, or build inputs for a Spec. If source access changes, check the Repository connection and the Spec that refers to it before retrying a run.

## Spec

A Spec describes an environment and the choices used to run it. Review its Compose document, variables, source, and target Host before starting a workload. A change to the Spec describes future or reapplied configuration; it does not by itself prove that a running Playground has adopted the change.

Specs can also hold mounted files, registry credentials, schedule settings, and ENV pack attachments. Keep these values aligned with the Team or personal owner of the Spec.

## Playground

A Playground is a long-running environment created from a Spec on a Host. Use its status, service information, and logs to understand runtime behavior. Apply configuration changes through the available Playground action and verify the resulting state afterward.

The Native API provides Playground status, logs, debug information, runtime operations, and lifecycle actions. Read the operation result and current status after a change; a request being accepted does not by itself prove that the services are ready.

Before deleting a Playground or changing its Spec, check whether persistent volumes or other external storage contain data that must be retained. Container-local files are not a durable storage plan.

## Task

A Task represents work expected to finish. A Task run is useful for checks or other finite operations. Inspect its outcome and logs after completion, and make sure its Compose command exits when the work is done. A continuously running server is a Playground workload, not a completed Task.

Task records expose run status and logs, and support rerun or cancellation actions where applicable. Repository-triggered runs can capture Job ENV values at admission; edits to those entries affect later runs. See [job mode](mode-job-task.md) and [the managed environment reference](reference-fibe-managed-env.md).

## Team ownership

A Team can own shared resources. Access to those resources follows the Native application's current Team membership and authorization rules. Check the resource owner before using an identifier in an operation, and review Audit Logs when you need to understand a recorded change.

## Agent and Library

Agent configuration and Library records are workspace resources. An Agent can have authentication, configuration, mounted files, conversations, and runtime state; inspect its current state before changing credentials or restarting it. The Library includes reusable Templates and ENV packs. ENV pack attachments can belong to a Spec or Playground, and removing an attachment changes future configuration without turning the pack into public data. Preserve any required configuration before removing a record.

## Safe change sequence

1. Identify the owner and current state of the resource.
2. Check which Repository, Spec, Host, or Team it depends on.
3. Review any persistent data and credentials that may be affected.
4. Apply the intended change using the Native interface or API operation.
5. Read the resource again and verify the resulting state.

## Related skills

- [fibe-product-map](fibe-product-map.md) for resource relationships.
- [fibe-security-access-and-integrations](fibe-security-access-and-integrations.md) for ownership and data handling.
- [common-errors-and-fixes](common-errors-and-fixes.md) for Compose and runtime troubleshooting.
