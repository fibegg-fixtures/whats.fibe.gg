#!/usr/bin/env node
/** Renders the social card using the retained local brand assets. */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Resvg} from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'static', 'img');
const SRC = path.join(IMG, '_source');

// Retain this site's existing brand assets. Content refreshes never pull Rails assets.
const FIBE_IMAGES = IMG;
// Fibe has no upstream social card, so this site owns its SVG source.
const OG_SVG = path.join(SRC, 'og-default.svg');
if (!fs.existsSync(OG_SVG)) {
  console.error(`[build-brand-assets] Missing OG source SVG: ${OG_SVG}`);
  process.exit(1);
}
let ogSvg = fs.readFileSync(OG_SVG, 'utf8');

const iconBytes = fs.readFileSync(path.join(FIBE_IMAGES, 'icon-192.png'));
const iconB64 = iconBytes.toString('base64');
if (!ogSvg.includes('__ICON_BASE64__')) {
  console.error('[build-brand-assets] og-default.svg is missing the __ICON_BASE64__ placeholder.');
  process.exit(1);
}
ogSvg = ogSvg.replace('__ICON_BASE64__', iconB64);

const ogPng = new Resvg(ogSvg, {
  fitTo: {mode: 'width', value: 1200},
  background: 'rgba(0,0,0,0)',
}).render().asPng();
fs.writeFileSync(path.join(IMG, 'og-default.png'), ogPng);

const report = (name) => {
  const p = path.join(IMG, name);
  if (!fs.existsSync(p)) return;
  const sz = fs.statSync(p).size;
  console.log(`  ${name.padEnd(22)} ${sz.toString().padStart(7)} bytes`);
};
console.log(`[build-brand-assets] from upstream (${FIBE_IMAGES}):`);

console.log('[build-brand-assets] generated:');
report('og-default.png');
