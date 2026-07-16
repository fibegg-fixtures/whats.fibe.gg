---
title: player
generated: true
format: md
---

<!-- GENERATED FROM fibe/requirements; DO NOT EDIT -->

## Per-browser visual effects preference

Players can reduce motion and expensive visual effects on the current browser without changing other devices.

The browser-local visual-effects preference keeps the interface functional while reducing decorative motion and expensive presentation effects for motion-sensitive players or constrained devices.

## Browser-local preference storage

The preference defaults to full effects and is stored only in the current browser.

Fibe stores the choice in browser storage with a cookie mirror. Changing it on one browser does not change the preference on another device.

## Reduced visual-effects behavior

Reduced mode suppresses decorative motion, smooth scrolling, blur, and glow effects while retaining interface functions.

When reduced mode is active, Fibe applies a browser-wide presentation state that removes expensive or motion-heavy effects without disabling the underlying controls and workflows.

## Current visual-effects state

The preferences interface shows whether the current browser is using full or reduced effects.

The switch and its state presentation stay synchronized with the browser-local preference so a player can see which visual-effects mode is active.

## Account-level Teams access

Teams management is enabled per account; players without the flag do not receive the normal Teams navigation or management entry point.

Teams management is enabled per account. Players without the flag do not receive the normal Teams navigation and are redirected away from the Teams list, but they can still accept or decline an invitation and use access granted through an accepted team membership.

## Beta application access

Beta participation is an account-level application-entry flag.

An authenticated account without beta participation is redirected to the external access page instead of entering the Fibe application. Super administrators and impersonated support sessions bypass this entry gate.
