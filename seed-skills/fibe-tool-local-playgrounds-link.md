---
name: fibe-tool-local-playgrounds-link
description: Use when you need to symlink a local Playground's mounts into a working directory (default /app/playground) so the Agent has direct file access. Brownfield handshake.
---

# fibe_local_playgrounds_link

[MODE:BROWNFIELD] Tier: brownfield. Idempotent.

Creates symlinks from `/opt/fibe/playgrounds/<name>/...` (or `MARQUEE_ROOT`) into `link_dir` so the Agent container can edit Playground files directly. Wraps `fibe local playgrounds link <id-or-name> [--link-dir DIR]`.

## When to use
- After `fibe_greenfield_create` (called automatically — manually re-run only when the auto-link failed).
- Switching between Playgrounds within one Agent session.
- Recovering after `/app/playground` symlinks went stale (Playground recreated, paths changed).

## Inputs
| Field | Type | Required | Notes |
|---|---|---|---|
| `id_or_name` | string | no | Local Playground ID, name, compose project, Playspec, or unique Playspec prefix |
| `link_dir` | string | no | Target directory; default `/app/playground` |

## Output
CLI-run envelope. `stdout` typically lists the created symlinks. The link command also writes canonical state to `<link_dir>/.current_playground.json`.

## Behavior
1. Resolves the target Playground locally (discover candidates with `fibe_local_playgrounds_info(view:"names")`).
2. Removes prior symlinks under `link_dir` that pointed to a different Playground.
3. Reads the rendered Compose bind sources under `/opt/fibe/playgrounds/<name>/props/...` and deduplicates services that point to the same physical checkout.
4. Names a one-branch checkout after its repository/Prop; when the Playground uses more than one branch anywhere, every checkout name includes its branch. Ambiguous link names that point to different checkouts are rejected.
5. Writes `.current_playground.json` with Playground identity, URLs including scheme, mounts, and repo entries. Use it through `fibe_local_playgrounds_info(view:"current"|"repos"|"urls"|"mounts")`.

## Gotchas
- If the Playground was recreated, paths under `/opt/fibe/playgrounds/<name>` may have changed; re-link to refresh.
- `link_dir` must be writable by the Agent process — `/app/playground` is the standard mount and works in default Agent images.
- Files written through `link_dir` land in the real Marquee filesystem and become visible to the Playground's containers immediately (live-reload territory). Load the `fibe-live-reload` skill.
- Linking a Playground that doesn't exist locally errors; pre-flight with `fibe_local_playgrounds_info(view:"names")`.
- Multiple repos may be linked. Before git operations, call `fibe_local_playgrounds_info(view:"repos", link_dir:"/app/playground")`, choose the intended `repo_root`, then run normal shell git such as `git -C <repo_root> status`. Do not use guessed first-repo behavior.
- The SDK consumes rendered Compose; it does not read Core control-plane state or calculate checkout locations.
- Local development URLs may be HTTP or HTTPS depending on the Marquee/dev configuration. Use `view:"urls"` or `.current_playground.json`; do not rewrite schemes.

## Related
- `fibe_local_playgrounds_info(view:"names")` — find target names.
- `fibe_local_playgrounds_info(view:"current")` — inspect canonical current Playground state.
- `fibe_local_playgrounds_info(view:"repos")` — list linked repos and exact repo roots for `git -C`.
- `fibe_local_playgrounds_info(view:"mounts")` — confirm source paths.
- `fibe-live-reload` skill — live editing semantics.
- `fibe_greenfield_create` — auto-links on success.
