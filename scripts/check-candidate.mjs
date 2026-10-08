#!/usr/bin/env node
/** Check the built candidate's cross-source and generated-output contracts. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rails = process.env.FIBE_REPO_PATH || path.resolve(root, '..', 'fibe');
const read = relative => fs.readFileSync(path.join(root, relative));
const exists = relative => fs.existsSync(path.join(root, relative));
const checks = [];

for (const name of ['hosts', 'specs', 'repositories', 'tasks', 'library', 'agents', 'teams', 'env-packs', 'agent-presets']) {
  assert(exists(`build/concepts/${name}/index.html`), `Missing canonical page ${name}`);
}
for (const name of ['marquees', 'playspecs', 'props', 'tricks', 'scrolls']) {
  assert(!exists(`build/concepts/${name}`), `Stale removed page ${name}`);
}
assert(exists('build/advanced/runtime-configuration/index.html'));
checks.push('Canonical concept/feature pages exist; removed concept routes are absent');

for (const name of ['schema.json', 'schemas/fibe-compose.v1.schema.json']) {
  assert(read(`static/${name}`).equals(fs.readFileSync(path.join(rails, 'public', name))), `Schema mirror differs: ${name}`);
  assert(read(`build/${name}`).equals(read(`static/${name}`)), `Built schema differs: ${name}`);
}
checks.push('Both schema mirrors and built copies equal exact Rails-owned bytes');

const publicSeeds = fs.readdirSync(path.join(rails, 'db/seeds/fibe_skills'))
  .filter(name => name.startsWith('fibe-tool-') && name.endsWith('.md')).sort();
const importedSeeds = fs.readdirSync(path.join(root, 'seed-skills'))
  .filter(name => name.startsWith('fibe-tool-') && name.endsWith('.md')).sort();
assert.deepEqual(importedSeeds, publicSeeds);
for (const name of publicSeeds) {
  assert(read(`seed-skills/${name}`).equals(fs.readFileSync(path.join(rails, 'db/seeds/fibe_skills', name))), `Public seed differs: ${name}`);
  assert(read(`static/seed-skills/${name}`).equals(read(`seed-skills/${name}`)), `Raw mirror differs: ${name}`);
}
for (const name of ['main.md', 'system.md', 'cursor-runtime.mdc']) {
  assert(!exists(`seed-skills/${name}`), `Private runtime prompt copied: ${name}`);
}
checks.push(`${publicSeeds.length} public tool seeds and raw mirrors match; private runtime prompts stay excluded`);

for (const name of ['llms.txt', 'llms-full.txt', 'search-index.json']) {
  assert(read(`build/${name}`).length > 1000, `Missing generated output ${name}`);
}
assert(read('static/llm-skills.txt').includes(Buffer.from('/seed-skills/')));
const removedDomains = /\b(?:marquees?|playspecs?|genies?|tricks?|scrolls|crumbs)\b|\bFIBE_(?:MARQUEE|PLAYSPEC|PROP)_ID\b/i;
for (const name of ['build/llms.txt', 'build/llms-full.txt', 'build/search-index.json', 'static/llm-skills.txt']) {
  assert(!removedDomains.test(read(name).toString()), `Removed domain vocabulary in ${name}`);
}
checks.push('LLM/search outputs are nonempty and contain no removed domain contract');

const categories = ['.', 'concepts', 'advanced', 'authoring', 'operate', 'sdk', 'api', 'reference', 'reference/tools'];
const expectedCards = [];
for (const category of categories) {
  for (const name of fs.readdirSync(path.join(root, 'docs', category))) {
    if (!name.endsWith('.md') && !name.endsWith('.mdx')) continue;
    const prefix = category === '.' ? '' : category.replaceAll('/', '-') + '-';
    expectedCards.push(prefix + name.replace(/\.mdx?$/, '') + '.png');
  }
}
const actualCards = fs.readdirSync(path.join(root, 'build/img/og')).filter(name => name.endsWith('.png')).sort();
assert.deepEqual(actualCards, expectedCards.sort(), 'Per-page artwork is missing or stale');
for (const file of ['static/img/og-default.png', ...actualCards.map(name => `build/img/og/${name}`)]) {
  const bytes = read(file);
  assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Invalid PNG ${file}`);
  assert.equal(bytes.readUInt32BE(16), 1200, `Artwork width ${file}`);
  assert.equal(bytes.readUInt32BE(20), 630, `Artwork height ${file}`);
}
checks.push(`Default and all ${actualCards.length} per-page cards are valid 1200×630 PNGs`);

const icons = read('src/components/FibeIcons.jsx').toString();
assert(icons.includes('(props)') && icons.includes('{...props}'), 'Generic React props were lost');
assert(read('docusaurus.config.js').includes(Buffer.from('Production fibe.gg retains the previous contract')));
checks.push('Generic React props and explicit candidate/production boundary are retained');
console.log(JSON.stringify({checks, passed: checks.length, pages: expectedCards.length, publicSeeds: publicSeeds.length}, null, 2));
