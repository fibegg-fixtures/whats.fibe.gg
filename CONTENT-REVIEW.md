# Native content review — November 2, 2026

The guide was copied from the hosted-product checkout into the Native workspace and
publishes from canonical `main` of `fibegg-fixtures/whats.fibe.gg`.
[content-review.json](content-review.json) accounts for every repository file with
its disposition, digest and review method at that review. Styles, layouts, icons and
brand assets were retained byte-for-byte.

## Source boundary

[content-sources.json](content-sources.json) pins the reviewed Native API and React
commits and the released SDK. Public tool guides are generated from offline
introspection of that SDK release (no credentials, no product calls); exact upstream
seed text stays source-only, and a seed import cannot overwrite the reviewed guides.

Approved removals (hosted billing and funding, obsolete product names, compatibility
metadata) are excluded from pages, navigation, public API projections, search and LLM
exports even when source cleanup is incomplete. Historical tombstones belong to the
capability catalog, not this guide. The API pages render supported operations without
inventing a common response envelope or claiming every route or tool is qualified.

## Verification boundary

The build checks broken links, Native contract digests, built mirrors, tool mirrors,
LLM documents, social cards and canonical routes. YAML examples were parsed and checked
against the pinned public schema; that does not assert external images or providers
were executed. No Native Rust/React, Host, provider, SDK or Agent runtime suite runs
in these checks. A complete file inventory is coverage evidence, not proof that no
future semantic error exists.

## Reproduce

```sh
npm ci
npm run sync-skills
npm run build-llm-skills
DOCUSAURUS_SSR_CONCURRENCY=2 npm run build
npm run check-candidate
npm run check-native-contracts
```

The contract-source check also needs the pinned Native API Git objects beside this
checkout (or `FIBE_API_PATH`). The standard Pages build uses only committed mirrors.
