# seed-skills/ — upstream skill mirror

This directory mirrors the upstream skill files that ship with Fibe agents.

These files are the canonical source for the skills an **Agent container** knows
about at runtime; the platform distributes them to running Agents.

**Do not edit files in this directory.** Edit the upstream source (the Fibe
repository's agent skill seeds), then re-import:

    npm run import-seed-skills

And regenerate the Docusaurus pages:

    npm run sync-skills

## What we import (and what we don't)

Only files matching `fibe-tool-*.md` come into this directory. They document
the MCP tools that ship with the `fibe` SDK, and the SDK section of the docs
site links each tool's detail page back to its file here.

We intentionally skip the agent runtime prompts and runtime guidance files —
the user-facing docs cover that material differently.

If a non-tool seed file ever needs to become public documentation, edit
`scripts/import-seed-skills.mjs` to widen the filter.
