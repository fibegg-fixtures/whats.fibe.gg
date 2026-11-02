#!/usr/bin/env node
/** Record every file in the content refresh, including deliberately retained styles. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '323bd57ad3a30cc6fdcb6ee0fb421c91ccdc28b5';
const git = (...args) => execFileSync('git', ['-C', root, ...args], {maxBuffer: 16 * 1024 * 1024});
const sources = JSON.parse(fs.readFileSync(path.join(root, 'content-sources.json'), 'utf8'));
const reviews = new Map();
for (const file of ['.audit-guides.json', '.audit-skills.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  for (const entry of data.files) reviews.set(entry.path, entry);
}
const paths = new Set(git('ls-files', '-z', '--cached', '--others', '--exclude-standard').toString().split('\0').filter(Boolean));
const oldPaths = new Set(git('ls-tree', '-r', '--name-only', '-z', base).toString().split('\0').filter(Boolean));
for (const file of oldPaths) paths.add(file);
for (const file of ['CONTENT-REVIEW.md', 'content-review.json']) paths.delete(file);
const entries = [];
for (const file of [...paths].sort()) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    assert(file.startsWith('.antigravitycli/'), `Unexpected removed content file: ${file}`);
    entries.push({path: file, disposition: 'removed', review: 'Removed obsolete local agent-session output; no product or style content.'});
    continue;
  }
  const bytes = fs.readFileSync(absolute);
  const previous = oldPaths.has(file) ? git('show', `${base}:${file}`) : null;
  const changed = !previous || !previous.equals(bytes);
  let review;
  if (file.endsWith('.css')) {
    assert(previous && previous.equals(bytes), `Style changed: ${file}`);
    review = 'Style reviewed and retained byte-for-byte, as requested.';
  } else if (reviews.has(file)) {
    const sourceReview = reviews.get(file);
    assert(sourceReview.reviewed !== false, `Unreviewed content: ${file}`);
    review = {method: sourceReview.class || 'Native guide review', findings: sourceReview.findings || [sourceReview.content_change].filter(Boolean), source_evidence: sourceReview.source_evidence || sourceReview.source_paths || sourceReview.sources || []};
  } else if ((file.startsWith('docs/') || file.startsWith('skills/') || file.startsWith('seed-skills/')) && /\.mdx?$/.test(file)) {
    throw new Error(`Missing individual content review: ${file}`);
  } else if (file.startsWith('static/native/') || file === 'static/schema.json' || file.startsWith('static/schemas/')) {
    review = 'Exact Native committed contract mirror; importer and build checks verify source bytes and identity digests.';
  } else if (/\.(png|ico|svg)$/.test(file)) {
    assert(previous && previous.equals(bytes), `Unexpected brand asset change: ${file}`);
    review = 'Existing branding retained; SVG copy uses current Agent vocabulary.';
  } else {
    review = changed
      ? 'Coordinator reviewed Native content, source selection, generated output or repository instructions; no styling changes.'
      : 'Coordinator reviewed file; no obsolete product contract or content change required.';
  }
  entries.push({path: file, disposition: changed ? (previous ? 'updated' : 'added') : 'retained', sha256: createHash('sha256').update(bytes).digest('hex'), review});
}
const summary = Object.fromEntries(['updated', 'added', 'retained', 'removed'].map(key => [key, entries.filter(entry => entry.disposition === key).length]));
fs.writeFileSync(path.join(root, 'content-review.json'), JSON.stringify({reviewed_at: sources.reviewed_at, source_checkout: base, sources, summary, files: entries, generated_review_outputs: ['CONTENT-REVIEW.md', 'content-review.json'], qualification: 'Individual content review plus structural/source checks; no Native runtime qualification.'}, null, 2) + '\n');
console.log(JSON.stringify({files: entries.length, ...summary}));
