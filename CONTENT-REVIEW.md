# Native content review — November 2, 2026

The guide was copied from `~/fibe/whats.fibe.gg` to `whats.fibe.gg/` in the Native
workspace. The original checkout is unchanged. The destination retains the
`fibegg-fixtures/whats.fibe.gg` origin and is prepared for canonical `main`.

Every repository file is accounted for in [content-review.json](content-review.json),
with its disposition, current digest and review method. Existing styles, layouts,
icons and brand assets are retained byte-for-byte from the copied checkout.
Files whose content remains valid are explicitly marked retained. The obsolete
tracked local agent-session artifact is removed; private runtime prompts are not
part of the public seed corpus.

## Source boundary and content changes

[content-sources.json](content-sources.json) pins Native API
`2ef6a69f4ce27f1f4a4b637ff0b6d2769c1ebe29`, React
`365f0c346a940c450fb256dabe916b854f1edc55` and released SDK v0.3.3. The review
covers 55 guide pages, 52 canonical product/authoring skills, 53 public tool seed
guides, and 108 curated/generated reference pages. Source-path checks resolve all
57 distinct cited API/UI/site paths. All 53 tool guides match their selected
committed Native source bytes.

The content now describes self-hosted Hosts, Specs, Repositories, Teams, Tasks,
Agents, Library, Audit Logs and long-running Playgrounds. It removes hosted
billing/funding assumptions, candidate branches and obsolete product names.
Instructions distinguish accepted work from completed runtime effects and cover
Native setup, operator recovery, quotas, owner scope, browser guards, optional
Git/provider configuration, encrypted Vault/ENV packs/Job ENV and template inputs.
The source compiler's per-compilation random cache is no longer described as
persistent storage.

The API pages render supported Native operations and schemas with readable display
groups. Exact source OpenAPI and route-manifest blobs are kept outside the published
static files. The public projection applies approved scope before publication,
including removal of obsolete compatibility metadata, with both source and public
digests checked. The source identity and Compose schema remain exact mirrors. The root source manifest also has a
public static mirror. The guide does not invent a common response envelope or
claim that every route or released consumer tool is qualified.

## Verification

- Production build passes, including strict broken-link checks for all 163 pages.
- Seven generated-content checks pass: Native contract identity digests, exact
  built mirrors, 53 tool mirrors, search/LLM vocabulary, all 170 `llms.txt` targets,
  163 social cards, canonical routes and current self-hosted content.
- `llms.txt`, `llms-full.txt`, `llm-skills.txt`, 105 raw Markdown mirrors and the
  search index are regenerated from the updated sources. Native source pins and
  links to machine-readable contracts are included in the LLM documents.
- Real-browser review confirms the homepage and Native API reference render with
  current text, an editable installation origin and no browser console errors.
- CSS and branding digests match the original checkout; whitespace checks pass.

The existing CSS animation-minifier warning and dependency peer/Browserslist
warnings remain; dependency and style changes are outside this content update.
No Native Rust/React, Host, provider, SDK or Agent runtime suite is executed by
these guide checks. Catalog checks are recorded in the owning catalog repository.

## Reproduce

```sh
npm ci
npm run sync-skills
npm run build-llm-skills
DOCUSAURUS_SSR_CONCURRENCY=2 npm run build
npm run check-candidate
npm run check-native-contracts
```

The contract-source check additionally needs the pinned Native API Git objects
beside this checkout (or `FIBE_API_PATH`). The standard Pages build uses only
committed mirrors. Individual review scratch files remain ignored locally; the
committed complete inventory is `content-review.json`.

## Public scope correction

Approved removals are excluded from pages, navigation, public API projections,
search and all LLM exports even when their source cleanup is incomplete. The old
`/concepts/billing` route is removed; current operational guidance is published at
`/concepts/self-hosted`. Historical tombstones stay in the capability catalog, not
the public guide. The complete per-file inventory reflects this follow-up.
