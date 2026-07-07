---
title: Common problems & fixes
description: What the message means, and the smallest change that resolves it. Template validation, variables, triggers, runtime — every common error.
slug: /operate/common-problems
sidebar_position: 1
image: /img/og/operate-common-problems.png
keywords: [errors, troubleshooting, validation, healthcheck, 502, Invalid Host header, Vite, container binding]
---

What the message means, and the smallest change that resolves it.

## Template validation

| Message | Fix |
| --- | --- |
| **Unknown `fibe.gg/` label** | You typed something Fibe doesn't recognize. Remove it or fix the spelling. Labels not under the `fibe.gg/` prefix pass through untouched. |
| **Service has a build directive but no `fibe.gg/repo_url`** | Add the repo URL, or remove the Compose `build:` block. |
| **`source_mount` without a `repo_url`** | Same fix; live mount needs to know where the source is. |
| **Zero-downtime services must have `fibe.gg/port` set** | Rolling updates are for routed services; add `fibe.gg/port`. |
| **Zero-downtime service has a `container_name`** | A pinned container name blocks scaling to multiple replicas, so it's always rejected. Drop `container_name`. |
| **Zero-downtime service keeps published `ports:`** | Raw host `ports:` are normally stripped automatically; the explicit rejection only fires when the template opts to preserve published ports. Route public HTTP through `fibe.gg/port` instead of raw `ports:`. |
| **Invalid repo URL** | Use `https://github.com/<owner>/<repo>`, a full `ssh://` URL, or a URL on a configured Gitea host. The short `git@host:path` form and arbitrary GitHub-like HTTPS hosts aren't accepted. |
| **Invalid exposure visibility** | Only the lowercase strings `internal` and `external` work. `External:3000` (uppercase E) is wrong. |
| **Invalid exposure port** | Must be a real port between 1 and 65535. |
| **Invalid subdomain** | Lowercase letters, digits, hyphens; no leading or trailing hyphen; or the special `@` for the root domain. |
| **Invalid path rule** | Only path matchers (`Path`, `PathPrefix`, `PathRegexp`) are allowed. Host, header, method, query, and client-IP matchers belong to Fibe and aren't authoring-side. |
| **Invalid healthcheck duration** | Use values like `30s`, `500ms`, or `1m`; hours and days aren't accepted. |
| **Boolean label not recognized** | Quote it as `"true"` or `"false"`; don't use `yes`, `no`, `on`, `off`, `1`, or `0`. |

## Variables

| Message | Fix |
| --- | --- |
| **Variable referenced but not declared** | You wrote `$$var__NAME` somewhere but never declared `NAME` under `variables:`. |
| **Variable declared but never used** | Either reference it inline somewhere, give it a `path:`/`paths:` binding, or remove the declaration. |
| **Variable missing a name** | Every variable needs a non-empty `name:` for the launcher UI. |
| **Validation pattern not wrapped in slashes** | Write the regex inside slashes, like `"/^[a-z]+$/"`. |
| **Validation pattern doesn't parse** | Fix the expression itself; the pattern is invalid regex. |
| **Required variable is missing** | Supply a value at launch, add a default, or set `random: true`. |
| **Value fails the validation pattern** | Fix the value, loosen the pattern, or remove it. |
| **Variable default must be a literal value** | A variable's `default:` contains template syntax like `$$var__OTHER`, `$$random__OTHER`, or `$$root_domain`. Defaults aren't expanded recursively. Put a literal value in `default:`; for a value derived from another variable, declare a separate `path:`/`paths:`-bound variable instead. |

## Triggers & schedules

| Message | Fix |
| --- | --- |
| **Trigger doesn't fire** | Check that the trigger is enabled, the Prop has a working git webhook, and the event type matches what you're actually doing (pull request vs. push to that branch). |
| **Trigger stopped firing after a Marquee problem** | When the target Marquee leaves the active state, Fibe disables the trigger so events don't pile up against a dead target. Bring the Marquee back, then re-enable the trigger yourself — it doesn't re-enable on its own. |
| **Scheduled job doesn't fire** | Check enabled status, verify the cron expression with a quick external tool, and confirm the target Marquee is up. |
| **Resource ID not found** | The Prop or Marquee referenced in trigger/schedule settings doesn't exist or isn't owned by you anymore. Re-pick a current one. |

## Runtime & lifecycle

| Message | Fix |
| --- | --- |
| **Compose `${VAR}` left in the output** | Fibe doesn't fill these from the launcher. Convert to `$$var__VAR` and declare it. Exception: in Trick runs, `${VAR}` *is* filled from your Job ENV entries and the built-in `FIBE_*` run variables — if that's what you meant, define the Job ENV entry instead of converting. |
| **Trick runs forever** | Your watched service started a dev server, an idle loop, or a long-poll. Replace it with a command that exits when the work is done. |
| **Job timed out waiting for watched services to complete** | The run hit the 4-hour ceiling without the watched service exiting. Fibe checks watched services every 10 seconds by default, up to 1,440 checks; operators can change those defaults. On timeout, the job errors and its containers are torn down. Same root cause as a run that never exits: make the watched command finish when the work is done, or split the work into shorter runs. |
| **Build timed out: stuck in building state for over 45 minutes** | Builds have a 45-minute ceiling. Usually a slow base-image pull or a heavy build on a slow network — switch to a smaller base image, trim the build context, then relaunch. |
| **Long-running app reset to one replica and never restarting** | You accidentally set `job_mode: true` on something that should stay up. Remove it. |
| **502 from the public URL but works inside the container** | Your app is binding to `localhost`. Switch to `0.0.0.0`. See the table below. |
| **Vite says "Invalid Host header"** | Vite 6+ rejects unknown hosts. Set `server.allowedHosts: true` in your Vite config. |
| **Healthcheck returns 200 too early** | The new replica is being marked ready before the app actually is. Tighten the check so it reflects real readiness. |
| **Image upgrade broke the volume** | A floating tag like `:latest` rolled across a major version and the on-disk format changed. Pin the image to a specific minor version. |

## Subtle behaviors worth knowing

- Mark a template as a Trick and Fibe **forces every service to one replica and no automatic restart** — even ones you didn't list as the watched service.
- **Hostnames in the template are stripped at compile time**; service-to-service traffic uses Compose's built-in DNS by service name.
- When the **same variable is both inlined and path-bound**, the path write is the final word.
- The `fibe.gg/*` **labels are read before the container starts**. You can't configure them with environment values that only exist inside the running container.

## Where the app should bind

| Framework | Correct bind |
| --- | --- |
| Rails | `bin/rails server -b 0.0.0.0` |
| Node / Express | `app.listen(PORT, '0.0.0.0')` |
| Next.js | `next dev -H 0.0.0.0` |
| Vite | `vite --host 0.0.0.0` |
| Django dev server | `python manage.py runserver 0.0.0.0:8000` |
| FastAPI / uvicorn | `uvicorn app:main --host 0.0.0.0` |
| Flask dev | `flask run --host 0.0.0.0` |

## Related

- Reference: [`common-errors-and-fixes`](/reference/common-errors-and-fixes/) — the skill version of this same content.
- [Authoring → Service labels](/authoring/service-labels/) — label rules and conflicts.
