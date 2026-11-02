# Native public tool Skill mirror

This directory mirrors the public `fibe-tool-*.md` guides registered in the
Native API's built-in Skill catalog. The import is pinned to API commit
`2ef6a69f4ce27f1f4a4b637ff0b6d2769c1ebe29` so a refresh cannot silently switch to an unrelated checkout.

After updating the source pin or these guides, regenerate the website reference
pages with:

    npm run import-seed-skills
    npm run sync-skills

Only the public tool guides are imported. Private agent prompts and runtime
instructions such as `main.md`, `system.md`, and `cursor-runtime.mdc` are not
published here.

These are guide documents from the Native API seed catalog. Their presence does
not prove that a tool operation has passed compatibility checks with the
released SDK; the consumer release pin is tracked separately in
`content-sources.json`.
