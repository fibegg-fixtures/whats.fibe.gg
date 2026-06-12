---
title: Teams
description: Share a Marquee with other people. Owners invite members; members launch on the shared host. What's shared, what isn't, and what happens when sharing ends.
slug: /concepts/teams
sidebar_position: 10
image: /img/og/concepts-teams.png
keywords: [Team, Marquee sharing, invitations, members, owner, collaboration, shared host]
---

A **Team** lets you share a [Marquee](/concepts/marquees/) with other people. The owner shares a host; accepted members launch on it as if it were their own.

Team management is **web-only** today — create and manage teams from the Teams page in the app. There is no API, CLI, or MCP surface.

Creating teams may need collaboration enabled on your account first — see [Feature Preferences](/advanced/features/#teams-collaboration). Accepting an invitation and using a Marquee shared with you work without it.

## Roles

- **Owner** — creates the team, invites and removes members, transfers leadership, shares and unshares Marquees.
- **Member** — accepts the invitation, uses shared Marquees, can leave the team.

Only the owner can share resources into the team.

The creator is the owner, and the owner cannot leave the team — transfer leadership to another accepted member first, which makes them the new owner. A team can be deleted only after every other member has left or been removed.

## Invitations

The owner invites people by **username or GitHub handle**. An invitation stays **pending** until the person accepts or declines it. You can invite someone who hasn't signed up yet — the invitation attaches to their account when they register. If someone declines, you can invite them again — a declined invitation doesn't block a new one.

## What sharing a Marquee means

Sharing is **manage-level** — there is no read-only grant. A shared Marquee appears alongside a member's own and works everywhere a Marquee is selectable: launching Playgrounds, templates, CI and schedules.

- **Playgrounds on a shared Marquee are shared in practice.** Everyone who can manage the Marquee can see and manage the Playgrounds running on it — the host is shared capacity, not isolated per member.
- **Other resources are not implicitly shared.** Members still need their own Playspecs, Props, Agents, and Secrets. A shared Marquee doesn't expose the owner's private resources, and a member's Genie chats stay theirs.
- **Names collide across members.** Subdomains are unique per Marquee across everyone's Playgrounds. Raw Docker host ports collide only when a template explicitly opts into preserving Compose `ports:` or when a launch provides explicit port mappings; by default Fibe strips local-only Compose host bindings.

## Funding

There is no team wallet. The owner funds the Marquee, and funding rules apply to everyone equally: an unfunded Marquee blocks owner and members alike (`MARQUEE_NOT_FUNDED`) — see [Billing → When your balance runs low](/concepts/billing/#when-your-balance-runs-low).

## When sharing ends

When the owner unshares the Marquee, you leave or are removed from the team, or the owner leaves:

- Your **Playgrounds on that Marquee are destroyed**.
- Your **live Genie chats on it are stopped**.

You keep everything you own: leaving a team only ends access to what was shared — your own Marquees and other resources are untouched.

Move any work you need **before** sharing ends.

## FAQ

<details>
<summary>Can members share their own Marquees into the team?</summary>

No. Sharing is owner-only today — members use what the owner shares.
</details>

<details>
<summary>Can I share anything other than a Marquee?</summary>

Not today. Marquees are the only team-shareable resource; everything else stays personal. There are no team-scoped Secrets, API keys, or audit logs — those stay per-account, and team membership doesn't change them.
</details>

<details>
<summary>Does a shared Marquee let members see my Genies or Props?</summary>

No. Marquee access alone doesn't grant access to your other resources. Members see and manage the Playgrounds running on the shared host, but your Genies, their chats, your Props, and your Secrets stay private.
</details>

<details>
<summary>What happens to my teams when I delete my account?</summary>

You automatically leave every team you're a member of. Teams you own are not cleaned up automatically — transfer leadership or delete the team first.
</details>

## Related

- [Marquees](/concepts/marquees/) — the resource being shared.
- [Playgrounds](/concepts/playgrounds/) — visible to everyone who can manage the shared Marquee.
- [Wallet, Mana & Sparks](/concepts/billing/) — funding stays with the owner.
- [Feature Preferences](/advanced/features/) — enabling collaboration on your account.
