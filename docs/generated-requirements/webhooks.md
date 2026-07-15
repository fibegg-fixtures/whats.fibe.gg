---
title: webhooks
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Subscribing to event families — Event types (examples)

- webhook.test

## Subscribing to event families — Event types (examples)

- playground.created , playground.creation.completed , playground.creation.failed

## Subscribing to event families — Delivery model

- Each delivery also carries X-Webhook-Event (the event name) and X-Webhook-Delivery / X-Idempotency-Key (the unique delivery id — use it for idempotency).

## Subscribing to event families — Delivery model

- The signature is sent in the X-Webhook-Signature header as sha256= , an HMAC-SHA256 over the raw request body using your signing secret.
