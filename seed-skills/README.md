# seed-skills upstream mirror

This directory mirrors the public tool skills shipped with Fibe agents.

The Fibe platform distributes the upstream source to running Agent containers.

Do not edit these files. Edit `db/seeds/fibe_skills/` in the Fibe repository,
then import and rebuild the references:

    npm run import-seed-skills
    npm run sync-skills

## Scope

Only `fibe-tool-*.md` files are imported. They document the MCP tools in the
`fibe` SDK.

Agent prompts and runtime guidance stay private because the public guide covers
that material separately.

To publish another seed type, widen the filter in
`scripts/import-seed-skills.mjs`.
