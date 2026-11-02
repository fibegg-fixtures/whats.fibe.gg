# Reviewed public tool guides

These 53 guides use the released SDK v0.3.3 input schemas and
reviewed Native descriptions. The schema capture and editorial notes live in
`source-contracts/sdk/`; the public schema projection is
`static/native/sdk-tool-schemas.json`.

Exact Native API seed text is retained only in the source-only
`source-contracts/native/tool-skill-seeds.json` at API revision
`2ef6a69f4ce27f1f4a4b637ff0b6d2769c1ebe29`. It does not overwrite public guidance.

Run `npm run import-seed-skills` to refresh pinned source provenance and regenerate
these guides. Run `node scripts/import-seed-skills.mjs --check` for an offline
freshness check; add `--check-source` to compare the exact Native source snapshot
with the sibling API checkout. Regenerate reference pages and LLM mirrors after
changes. Private runtime prompts are excluded. Input-contract inspection is not
proof of a passing Host, provider, Agent, or SDK product workflow.
