#!/usr/bin/env node
/** Import exact committed Native contract bytes; never build or modify the source. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'content-sources.json'), 'utf8'));
const source = path.resolve(process.env.FIBE_API_PATH || path.join(root, '..', 'fibe-api'));
const revision = sources.api.revision;
assert.match(revision, /^[a-f0-9]{40}$/);
const git = (...args) => execFileSync('git', ['--no-replace-objects', '-C', source, ...args], {
  env: {...process.env, GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0', GIT_ALLOW_PROTOCOL: ''},
  maxBuffer: 16 * 1024 * 1024,
});
const normalize = value => value.trim().replace(/^git@github.com:/, 'https://github.com/').replace(/\.git$/, '');
assert.equal(normalize(git('config', '--get', 'remote.origin.url').toString()), normalize(sources.api.repository));
const files = [
  ['contracts/generated/self-hosted-v1/openapi.json', 'static/native/openapi.json'],
  ['contracts/generated/self-hosted-v1/route-manifest.json', 'static/native/route-manifest.json'],
  ['contracts/generated/self-hosted-v1/identity.json', 'static/native/identity.json'],
  ['crates/fibe-compose/schema/fibe-compose.v1.schema.json', 'static/schema.json'],
  ['crates/fibe-compose/schema/fibe-compose.v1.schema.json', 'static/schemas/fibe-compose.v1.schema.json'],
];
for (const [input, output] of files) {
  const bytes = git('show', `${revision}:${input}`);
  JSON.parse(bytes.toString());
  const destination = path.join(root, output);
  if (process.argv.includes('--check')) {
    assert(fs.readFileSync(destination).equals(bytes), `Stale Native mirror: ${output}`);
  } else {
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, bytes);
  }
}
const manifest = fs.readFileSync(path.join(root, 'content-sources.json'));
if (process.argv.includes('--check')) {
  assert(fs.readFileSync(path.join(root, 'static/content-sources.json')).equals(manifest), 'Stale public provenance');
} else {
  fs.writeFileSync(path.join(root, 'static/content-sources.json'), manifest);
}
console.log(`${process.argv.includes('--check') ? 'Checked' : 'Imported'} ${files.length} Native contract mirrors at ${revision}`);
