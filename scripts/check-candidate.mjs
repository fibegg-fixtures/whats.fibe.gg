#!/usr/bin/env node
/** Check the built Native guide and generated content contracts. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'content-sources.json'), 'utf8'));
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

for (const name of ['content-sources.json', 'schema.json', 'schemas/fibe-compose.v1.schema.json', 'native/openapi.json', 'native/route-manifest.json', 'native/identity.json']) {
  assert(read(`build/${name}`).equals(read(`static/${name}`)), `Built contract differs: ${name}`);
}
assert(read('static/schema.json').equals(read('static/schemas/fibe-compose.v1.schema.json')));
const identity = JSON.parse(read('static/native/identity.json'));
for (const [file, digest] of [['openapi.json', identity.openapi_sha256], ['route-manifest.json', identity.route_manifest_sha256]]) {
  assert.equal(createHash('sha256').update(read(`static/native/${file}`)).digest('hex'), digest, `Native identity digest: ${file}`);
}
assert.match(sources.api.revision, /^[a-f0-9]{40}$/);
assert.match(sources.ui.revision, /^[a-f0-9]{40}$/);
checks.push('Built Native contract mirrors preserve bytes and match the generated identity');

const publicSeeds = fs.readdirSync(path.join(root, 'seed-skills'))
  .filter(name => name.startsWith('fibe-tool-') && name.endsWith('.md')).sort();
assert.equal(publicSeeds.length, 53, 'Review the selected Native public tool corpus when changing its inventory');
for (const name of publicSeeds) {
  assert(read(`static/seed-skills/${name}`).equals(read(`seed-skills/${name}`)), `Raw mirror differs: ${name}`);
  assert(exists(`build/reference/tools/${name.replace('fibe-tool-', '').replace('.md', '')}/index.html`));
}
for (const name of ['main.md', 'system.md', 'cursor-runtime.mdc']) {
  assert(!exists(`seed-skills/${name}`), `Private runtime prompt copied: ${name}`);
}
checks.push(`${publicSeeds.length} public tool guides and raw mirrors match; private runtime prompts stay excluded`);

for (const name of ['llms.txt', 'llms-full.txt', 'search-index.json']) {
  assert(read(`build/${name}`).length > 1000, `Missing generated output ${name}`);
}
assert(read('static/llm-skills.txt').includes(Buffer.from('/seed-skills/')));
const removedDomains = /\b(?:marquees?|playspecs?|genies?|tricks?|scrolls|crumbs)\b|\bFIBE_(?:MARQUEE|PLAYSPEC|PROP)_ID\b/i;
for (const name of ['build/llms.txt', 'build/llms-full.txt', 'build/search-index.json', 'static/llm-skills.txt']) {
  assert(!removedDomains.test(read(name).toString()), `Removed domain vocabulary in ${name}`);
}
checks.push('LLM/search outputs are nonempty and contain no removed domain contract');

const llmLinks = [...read('build/llms.txt').toString().matchAll(/\]\((https:\/\/whats\.fibe\.gg[^)]+)\)/g)];
for (const [, href] of llmLinks) {
  const pathname = decodeURIComponent(new URL(href).pathname).replace(/^\//, '');
  assert(exists(`build/${pathname}`) || exists(`build/${pathname}/index.html`), `Broken LLM index target: ${href}`);
}
assert(read('build/llms.txt').includes(Buffer.from(sources.api.revision)), 'LLM index source pin missing');
assert(read('build/llms-full.txt').includes(Buffer.from(sources.ui.revision)), 'Full LLM document source pin missing');
checks.push(`${llmLinks.length} LLM index links resolve to built files; source pins are current`);

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
assert(read('docusaurus.config.js').includes(Buffer.from('Native FIBE guide: self-hosted Rust + React.')));
assert(!read('src/data/apiReference.js').includes(Buffer.from('HOST_NOT_FUNDED')));
assert(!read('src/components/FeatureGrid.jsx').includes(Buffer.from('Mana & Sparks')));
checks.push('React props and current self-hosted content are retained');
console.log(JSON.stringify({checks, passed: checks.length, pages: expectedCards.length, publicSeeds: publicSeeds.length}, null, 2));
