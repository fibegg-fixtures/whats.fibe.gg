#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DST = path.join(ROOT, 'seed-skills');

const FIBE_REPO = process.env.FIBE_REPO_PATH || path.resolve(ROOT, '..', 'fibe');
const SRC = path.join(FIBE_REPO, 'db', 'seeds', 'fibe_skills');

const SKIP = new Set(['main.md', 'system.md', 'cursor-runtime.mdc']);

if (!fs.existsSync(SRC)) {
  console.error(`[import-seed-skills] Source not found: ${SRC}`);
  console.error('Set FIBE_REPO_PATH or check that the fibe repo is checked out next to this one.');
  process.exit(1);
}

fs.mkdirSync(DST, {recursive: true});

const srcFiles = new Set(
  fs.readdirSync(SRC).filter((f) => f.endsWith('.md') && !SKIP.has(f) && f.startsWith('fibe-tool-'))
);

for (const existing of fs.readdirSync(DST)) {
  if (existing === 'README.md' || existing.startsWith('.')) continue;
  if (!srcFiles.has(existing)) {
    fs.unlinkSync(path.join(DST, existing));
    console.log(`[import-seed-skills] removed stale ${existing}`);
  }
}

let copied = 0;
for (const f of srcFiles) {
  fs.copyFileSync(path.join(SRC, f), path.join(DST, f));
  copied++;
}

const readme = `# seed-skills upstream mirror

This directory mirrors the public tool skills shipped with Fibe agents.

The Fibe platform distributes the upstream source to running Agent containers.

Do not edit these files. Edit \`db/seeds/fibe_skills/\` in the Fibe repository,
then import and rebuild the references:

    npm run import-seed-skills
    npm run sync-skills

## Scope

Only \`fibe-tool-*.md\` files are imported. They document the MCP tools in the
\`fibe\` SDK.

Agent prompts and runtime guidance stay private because the public guide covers
that material separately.

To publish another seed type, widen the filter in
\`scripts/import-seed-skills.mjs\`.
`;
fs.writeFileSync(path.join(DST, 'README.md'), readme);

console.log(`[import-seed-skills] copied ${copied} files from ${SRC}`);
console.log(`[import-seed-skills] destination: ${DST}`);
console.log('[import-seed-skills] next: npm run sync-skills');
