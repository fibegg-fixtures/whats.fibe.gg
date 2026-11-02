# Native content review — November 2, 2026

The guide was copied from `~/fibe/whats.fibe.gg` to `whats.fibe.gg/` in the Native
workspace. The original checkout is unchanged. The destination retains the
`fibegg-fixtures/whats.fibe.gg` origin and publishes from canonical `main`.

Every repository file is accounted for in [content-review.json](content-review.json),
with its disposition, current digest and review method. Existing styles, layouts,
icons and brand assets are retained byte-for-byte from the copied checkout.
Files whose content remains valid are explicitly marked retained. The obsolete
tracked local agent-session artifact is removed; private runtime prompts are not
part of the public seed corpus.

## Source boundary and content changes

[content-sources.json](content-sources.json) pins Native API
`2ef6a69f4ce27f1f4a4b637ff0b6d2769c1ebe29`, React
`231ce23d404ded6957adca4a0befc4f8533a0177` and released SDK v0.3.3. The review
covers 55 guide pages, 52 canonical product/authoring skills, 53 public tool seed
guides, and 108 curated/generated reference pages. The follow-up review checks public tool fields against the selected SDK release,
not against seed prose alone. Exact upstream seed text is retained source-only;
all 53 public guides are generated from reviewed released tool schemas.

The content now describes self-hosted Hosts, Specs, Repositories, Teams, Tasks,
Agents, Library, Audit Logs and long-running Playgrounds. It removes hosted
billing/funding assumptions, candidate branches and obsolete product names.
Instructions distinguish accepted work from completed runtime effects and cover
Native setup, operator recovery, quotas, owner scope, browser guards, optional
Git/provider configuration, encrypted Vault/ENV packs/Job ENV and template inputs.
Saved Specs generate and persist random launch values through the Spec lifecycle.
The direct compiler's per-compilation random cache is separate and is not persistent storage.

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
  built mirrors, 53 tool mirrors, search/LLM vocabulary, all linked `llms.txt` targets,
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

## Independent follow-up audit

The first review established file coverage, but missed semantic contradictions.
An independent follow-up found invalid or missing required inputs in 42 of the
53 upstream tool guides. All 53 public guides now come from offline introspection
of the released SDK v0.3.3, captured with an empty isolated configuration and no
API credentials or product-operation calls. The committed schema capture and
reviewed Native notes regenerate the guides, tool catalogue and public
`native/sdk-tool-schemas.json`. Offline freshness checks run during Pages
verification; `--check-source` additionally checks upstream seed provenance.
A future seed import cannot overwrite the reviewed guides with stale prose.

The follow-up also corrects the bounded Agent health/recovery claim, the
switch-template provisioning enum and Host input type, SDK profile resolution,
retry and circuit-breaker behavior, scalar subdomain examples and canonical
deployment-guide repository links. Browser review also caught and fixed malformed
JSON download URLs; every rendered page is checked for that regression. These fixes propagate to reference pages,
raw Markdown, search and every LLM export. Existing FIBE-specific Compose
transformations were checked separately from the latest unhandled-field
pass-through requirement; no blanket unsupported-Compose claim is introduced.

Historical source-only snapshots can contain old wording; they are excluded from
the published build. Current public guidance and reproducible checks are the
publication authority. A complete file inventory is coverage evidence, not a
proof that no future semantic error can be found.

## Third content audit

A further source-traced round corrected security and session flows, Vault and
Job ENV precedence, webhook admission/retry/retention, Library controls, Agent
default inheritance, Repository push authority, API document locations and CLI
examples. Saved Spec random generation and encrypted persistence are distinguished
from the lower-level compiler, including the different defaulting order. The
correction was also applied to the Wiki.js, WordPress and authoring cross-references.
Current Native named-volume identity and deployment restrictions replace older
Compose assumptions. These are content changes; styles and branding are unchanged.

The example sweep parsed 243 standalone YAML fences and reviewed 133 service
examples and 90 namespace examples against the pinned public schema. The remaining
flags are explicitly illustrated shapes, placeholders, intentionally invalid
examples, or the documented Rails continuation; there are no unresolved findings
in that sweep. The Rails continuation was additionally parsed with its shared
anchors in scope. Invalid tabs, a misplaced metadata block, missing anchors and a
missing source working directory were corrected. Parsing and schema checks do not
assert that external example images or providers were executed.

All derived reference pages, raw Markdown, search and LLM documents were rebuilt
after these corrections. The complete catalog gate and its separate source-review
limits are recorded in the capability repository. Third-round local evidence is
kept in ignored `artifacts/round3-*` files; the complete per-file inventory remains
the reproducible coverage record.

During final verification React main advanced by two commits. The final source pin
is `231ce23d404ded6957adca4a0befc4f8533a0177`: GitHub linking uses the native CSRF
client and the obsolete Bridge Agent-list toggle is removed. Neither behavior
requires a public prose correction beyond the source identity; the guide does not
promise that toggle or the replaced HTML authorization form. The delta was checked
before the final publication.
