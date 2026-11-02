#!/usr/bin/env node
/** Check the built Native guide and generated content contracts. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {isRetiredName, publicContract} from './public-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'content-sources.json'), 'utf8'));
const read = relative => fs.readFileSync(path.join(root, relative));
const exists = relative => fs.existsSync(path.join(root, relative));
const checks = [];

for (const name of ['hosts', 'specs', 'repositories', 'tasks', 'library', 'agents', 'teams', 'env-packs', 'agent-presets']) {
  assert(exists(`build/concepts/${name}/index.html`), `Missing canonical page ${name}`);
}
for (const name of ['marquees', 'playspecs', 'props', 'tricks', 'scrolls', 'billing']) {
  assert(!exists(`build/concepts/${name}`), `Stale removed page ${name}`);
}
assert(exists('build/advanced/runtime-configuration/index.html'));
checks.push('Canonical concept/feature pages exist; removed concept routes are absent');

for (const name of ['content-sources.json', 'schema.json', 'schemas/fibe-compose.v1.schema.json', 'native/openapi.json', 'native/route-manifest.json', 'native/identity.json', 'native/public-contract.json']) {
  assert(read(`build/${name}`).equals(read(`static/${name}`)), `Built contract differs: ${name}`);
}
assert(read('static/schema.json').equals(read('static/schemas/fibe-compose.v1.schema.json')));
const identity = JSON.parse(read('static/native/identity.json'));
const projection = JSON.parse(read('static/native/public-contract.json'));
for (const [file, digest] of [['openapi.json', identity.openapi_sha256], ['route-manifest.json', identity.route_manifest_sha256]]) {
  const sourceBytes = read(`source-contracts/native/${file}`);
  assert.equal(createHash('sha256').update(sourceBytes).digest('hex'), digest, `Native source identity digest: ${file}`);
  assert.deepEqual(JSON.parse(read(`static/native/${file}`)), publicContract(JSON.parse(sourceBytes)), `Public scope differs: ${file}`);
  const field = file === 'openapi.json' ? 'openapi' : 'route_manifest';
  assert.equal(createHash('sha256').update(read(`static/native/${file}`)).digest('hex'), projection[`public_${field}_sha256`]);
}
assert.match(sources.api.revision, /^[a-f0-9]{40}$/);
assert.match(sources.ui.revision, /^[a-f0-9]{40}$/);
assert(!isRetiredName('AgentMountMutationInput'), 'Generic Agent mount updates must remain available');
assert(isRetiredName('billing_runtime_active') && isRetiredName('/api/repository_mutations'));
checks.push('Native source identity and public-scope contract digests match; generic resource updates remain available');

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
const removedFeatures = /\bbilling\b|\bwallet\b|\b(?:Mana|Sparks|Muti)\b|\bAI Gateway\b|\btutorial\b|mutation[-_ ](?:history|cure)|mutations:(?:read|write)|personal invitation codes?/i;
for (const name of ['build/llms.txt', 'build/llms-full.txt', 'build/search-index.json', 'static/llm-skills.txt']) {
  assert(!removedDomains.test(read(name).toString()), `Removed domain vocabulary in ${name}`);
  assert(!removedFeatures.test(read(name).toString()), `Removed feature in public content: ${name}`);
}
for (const name of ['openapi.json', 'route-manifest.json']) assert(!isRetiredName(read(`static/native/${name}`).toString()), `Retired contract content: ${name}`);
assert(!exists('build/source-contracts'), 'Exact source-only contracts must not be published');
function checkPublicPages(dir) {
  for (const entry of fs.readdirSync(path.join(root, dir), {withFileTypes: true})) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) checkPublicPages(file);
    else if (entry.name.endsWith('.html')) assert(!removedFeatures.test(read(file).toString()), `Removed feature in rendered page: ${file}`);
  }
}
checkPublicPages('build');
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
