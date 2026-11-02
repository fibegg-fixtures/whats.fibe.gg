#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DST = path.join(ROOT, 'seed-skills');

// Public tool guides are part of the native API's built-in Skill catalog.
// Keep imports reproducible: never read an arbitrary sibling checkout or a
// released SDK source tree. The reviewed source manifest owns the revision pin.
const SOURCES = JSON.parse(fs.readFileSync(path.join(ROOT, 'content-sources.json'), 'utf8'));
const API_COMMIT = SOURCES.api?.revision;
const API_REPO = process.env.FIBE_API_PATH || path.resolve(ROOT, '..', 'fibe-api');
const SOURCE_DIR = 'crates/fibe-kernel/src/operations/skill_seeds';
const SOURCE_PREFIX = `${SOURCE_DIR}/fibe-tool-`;

function git(...args) {
  return execFileSync('git', ['-C', API_REPO, ...args], {encoding: 'utf8'}).trimEnd();
}

function gitBytes(...args) {
  return execFileSync('git', ['-C', API_REPO, ...args], {encoding: null});
}

if (!/^[a-f0-9]{40}$/.test(API_COMMIT || '')) {
  console.error('[import-seed-skills] content-sources.json must pin a full API commit SHA.');
  process.exit(1);
}

if (!fs.existsSync(path.join(API_REPO, '.git'))) {
  console.error(`[import-seed-skills] Native API repository not found: ${API_REPO}`);
  console.error('Set FIBE_API_PATH to the workspace fibe-api checkout.');
  process.exit(1);
}

let paths;
try {
  paths = git('ls-tree', '-r', '--name-only', API_COMMIT, '--', SOURCE_DIR)
    .split('\n')
    .filter((name) => name.startsWith(SOURCE_PREFIX) && name.endsWith('.md'));
} catch (error) {
  console.error(`[import-seed-skills] Cannot read pinned Native API source ${API_COMMIT}: ${error.message}`);
  process.exit(1);
}

if (!paths.length) {
  console.error(`[import-seed-skills] No public tool guides found at ${API_COMMIT}:${SOURCE_DIR}`);
  process.exit(1);
}

fs.mkdirSync(DST, {recursive: true});
const sourceFiles = new Set(paths.map((name) => path.basename(name)));

// These are the only public tool guides selected from the API seed catalog.
// Runtime prompts and installation-specific content are deliberately excluded.
for (const existing of fs.readdirSync(DST)) {
  if (existing === 'README.md' || existing.startsWith('.')) continue;
  if (!sourceFiles.has(existing)) {
    fs.unlinkSync(path.join(DST, existing));
    console.log(`[import-seed-skills] removed stale ${existing}`);
  }
}

for (const sourcePath of paths) {
  const content = gitBytes('cat-file', 'blob', `${API_COMMIT}:${sourcePath}`);
  fs.writeFileSync(path.join(DST, path.basename(sourcePath)), content);
}

const readme = `# Native public tool Skill mirror

This directory mirrors the public \`fibe-tool-*.md\` guides registered in the
Native API's built-in Skill catalog. The import is pinned to API commit
\`${API_COMMIT}\` so a refresh cannot silently switch to an unrelated checkout.

After updating the source pin or these guides, regenerate the website reference
pages with:

    npm run import-seed-skills
    npm run sync-skills

Only the public tool guides are imported. Private agent prompts and runtime
instructions such as \`main.md\`, \`system.md\`, and \`cursor-runtime.mdc\` are not
published here.

These are guide documents from the Native API seed catalog. Their presence does
not prove that a tool operation has passed compatibility checks with the
released SDK; the consumer release pin is tracked separately in
\`content-sources.json\`.
`;
fs.writeFileSync(path.join(DST, 'README.md'), readme);

console.log(`[import-seed-skills] copied ${paths.length} public tool guides from ${API_COMMIT}`);
console.log(`[import-seed-skills] destination: ${DST}`);
console.log('[import-seed-skills] next: npm run sync-skills');
