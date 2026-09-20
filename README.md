# FIBE public user guide

Source for the [Fibe user guide](https://whats.fibe.gg) and its machine-readable skill library.

Two things live here:

1. **User guide:** a Docusaurus site covering the Fibe product.
2. **LLM skills:** focused Markdown guides for product questions, workflows, and converting Docker Compose files to Fibe templates.

GitHub Pages publishes both to `whats.fibe.gg`.

## Local development

Requires Node.js 20+.

```sh
nvm use            # picks up Node 20 from .nvmrc
npm install
npm start          # http://localhost:3000 with live reload
```

The development server reloads after changes under `docs/`, `src/`, or static configuration.

## Build & preview

```sh
npm run build      # production build into ./build/
npm run serve      # preview the built site at http://localhost:3000
```

Run `npm run build` before opening a PR. It reports broken links (`onBrokenLinks: 'warn'`) and generates references, Open Graph cards, and the site output.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`, which builds and publishes the site to GitHub Pages. `static/CNAME` sets the custom domain.

## Repository structure

```
whats.fibe.gg/
├── docusaurus.config.js   # site config (URL, navbar, footer, plugins)
├── sidebars.js            # manual sidebar hierarchy
├── docs/                  # the user-facing guide content (Markdown)
│   ├── intro.md
│   ├── concepts/          # Product concepts
│   ├── advanced/          # Security, API keys, Secret Vault, webhooks, limits, and account settings
│   ├── authoring/         # Compose → Fibe authoring guides
│   ├── operate/           # Problems, recovery, cleanup, and publishing
│   ├── sdk/               # CLI, Go library, MCP server, and workflows
│   ├── api/               # Public REST API reference
│   └── reference/         # Generated skill/tool pages plus curated behavior references
├── skills/                # Canonical skill sources (mirrored into docs/reference/)
├── plugins/
│   ├── plugin-llms-txt.js # Emits /llms.txt and /llms-full.txt at build
│   └── plugin-og-images.js# Emits one OG card per page at build
├── src/
│   ├── pages/index.js     # Native React homepage
│   ├── theme/Footer/      # Custom footer (social icons + legal links)
│   ├── css/custom.css     # Dark-mode violet palette
│   └── components/        # Hero, FeatureGrid
├── static/
│   ├── CNAME              # whats.fibe.gg
│   ├── robots.txt
│   ├── site.webmanifest
│   └── img/               # Favicons, OG fallback, logos
└── .github/workflows/
    └── deploy.yml         # Build + publish to GitHub Pages
```

## The homepage

- `/`: React homepage with a hero, feature grid, and footer.
- `/intro/`: guide entry point.

## Release scope and workspace skills

This repository publishes the public product guide and skills. The private
`viktorvsk/fibe-skills` repository owns contributor workspace procedures. Do not
import its operational references or credentials here.

Production `fibe.gg` follows Rails `main`; `next.fibe.live` follows `unstable`.
Label staging-only behavior and verify it in production before removing that
label. Older standalone Ruby Core and v2 requirements are design material, not
evidence for v1.5. Existing pages may not have been checked against both releases.

Before refreshing seeds, choose a source checkout and verify its branch and
revision. Do not run the historical `../fibe` import against a nearby v2 checkout.
Regenerate from canonical skills instead of editing generated reference pages.

## Editing content

- **Guide pages** live under `docs/<area>/<page>.md`. They use Docusaurus frontmatter (`title`, `description`, `sidebar_position`, `keywords`) and Markdown or MDX admonitions (`:::tip`, `:::caution`, `:::info`, `:::details`).
- **Skill reference pages** live under `docs/reference/` and `docs/reference/tools/`. Most are generated from these canonical sources:
  - `skills/`: authoring source for recipes, playbooks, decisions, and foundations.
  - `seed-skills/`: mirror of public MCP tool guides from `db/seeds/fibe_skills/` in the selected Rails checkout. Edit the Rails source, then run `npm run import-seed-skills`.
- Curated pages such as `docs/reference/intro.md`, `docs/reference/json-schema.md`, and `docs/reference/platform-behavior-contracts.md` are maintained directly and are not overwritten by the skill sync.
- **Open Graph cards** are generated at build time from each page title and description.
- **llms.txt** and **llms-full.txt** are generated from the same content.

### Regenerating reference pages

There are two collections to refresh:

```sh
npm run import-seed-skills   # pull the latest seed-skills/ from ../fibe/db/seeds/fibe_skills/
npm run sync-skills          # regenerate docs/reference/ from both skills/ and seed-skills/
# Or both in one shot:
npm run refresh-skills
```

The sync routes files like this:

- `skills/<name>.md` → `docs/reference/<name>.md`
- `seed-skills/fibe-tool-<rest>.md` → `docs/reference/tools/<rest>.md`
- `seed-skills/fibe-<rest>.md` (not tool) → `docs/reference/foundation-<rest>.md`
- Other seed files → `docs/reference/<name>.md`

Agent runtime prompts (`main.md`, `system.md`, `cursor-runtime.mdc`) are excluded.

## SEO and discoverability

- `sitemap.xml` is generated automatically by the classic preset and listed in `robots.txt`.
- Each page emits per-page Open Graph + Twitter Card meta from its frontmatter.
- `llms.txt` and `llms-full.txt` make the entire site indexable by LLM agents per [llmstxt.org](https://llmstxt.org).
- `llm-skills.txt` is a deterministic `<name>: <description>` index of every skill and tool. `npm run build-llm-skills` generates it and `prebuild` runs it automatically. The same inputs produce the same bytes.
- `robots.txt` follows the standard at [robotstxt.org](https://www.robotstxt.org).

## License

© fibe.gg. All rights reserved for the published site. File headers define the license for LLM tools that consume `skills/`.
