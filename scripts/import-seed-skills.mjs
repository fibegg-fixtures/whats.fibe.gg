#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = name => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));
const SOURCES = readJson('content-sources.json');
const CAPTURE = readJson('source-contracts/sdk/tool-schemas.json');
const GUIDANCE = readJson('source-contracts/sdk/tool-guidance.json');
const RAW_PATH = 'source-contracts/native/tool-skill-seeds.json';
const SOURCE_DIR = 'crates/fibe-kernel/src/operations/skill_seeds';
const CHECK = process.argv.includes('--check');
const CHECK_SOURCE = process.argv.includes('--check-source');
const API_REPO = process.env.FIBE_API_PATH || path.resolve(ROOT, '..', 'fibe-api');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;

assert.equal(CAPTURE.sdk_release, SOURCES.sdk_release, 'SDK schema capture pin is stale');
assert.equal(GUIDANCE.sdk_release, SOURCES.sdk_release, 'SDK prose review pin is stale');
assert.match(SOURCES.api.revision, /^[a-f0-9]{40}$/);
assert.equal(CAPTURE.tools.length, 53, 'Review the selected public tool set before changing it');
assert.deepEqual(Object.keys(GUIDANCE.notes).sort(), CAPTURE.tools.map(tool => tool.name).sort());

function sourceSeeds() {
  const git = (...args) => execFileSync('git', ['-C', API_REPO, ...args]);
  const paths = git('ls-tree', '-r', '--name-only', SOURCES.api.revision, '--', SOURCE_DIR)
    .toString('utf8').trim().split('\n')
    .filter(name => name.startsWith(`${SOURCE_DIR}/fibe-tool-`) && name.endsWith('.md'));
  return {
    api_revision: SOURCES.api.revision,
    files: paths.map(sourcePath => {
      const bytes = git('cat-file', 'blob', `${SOURCES.api.revision}:${sourcePath}`);
      return {path: sourcePath, sha256: hash(bytes), content: bytes.toString('utf8')};
    }),
  };
}

// Exact upstream seed text is provenance, not the public tool contract: many of
// its parameter names differ from the released SDK. Never copy it over reviewed
// public guidance. --check is deliberately offline for the Pages checkout.
let raw;
if (CHECK || CHECK_SOURCE) {
  raw = readJson(RAW_PATH);
  if (CHECK_SOURCE) assert.deepEqual(raw, sourceSeeds(), 'Pinned Native seed snapshot is stale');
} else {
  raw = sourceSeeds();
  fs.writeFileSync(path.join(ROOT, RAW_PATH), json(raw));
}
assert.equal(raw.api_revision, SOURCES.api.revision);
assert.equal(raw.files.length, CAPTURE.tools.length);
for (const file of raw.files) assert.equal(hash(file.content), file.sha256, `Source seed hash: ${file.path}`);
assert.deepEqual(raw.files.map(file => path.basename(file.path)).sort(),
  CAPTURE.tools.map(tool => `${tool.name.replace(/^fibe_/, 'fibe-tool-').replaceAll('_', '-')}.md`).sort());

function currentDescription(text) {
  return text.replace(/^\[MODE:[^\]]+\]\s*/, '')
    .split(/(?<=\.)\s+/)
    .filter(sentence => !/\bfunded\b|\bunpaid\b|HOST_NOT_FUNDED/i.test(sentence))
    .join(' ')
    .replaceAll('repositories/Repositories', 'repositories and Fibe Repositories');
}

function currentSchema(value) {
  if (Array.isArray(value)) return value.map(currentSchema);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    key === 'description' && typeof item === 'string'
      ? item.replace(' Must be funded.', ' The Host must be reachable and authorized for the operation.')
        .replace('In regex mode, this is a PostgreSQL regex pattern.', 'In regex mode, use the Native server’s supported regular-expression syntax.')
        .replace('Treat query as PostgreSQL regex. Requires a 3+ character literal token so the server can prefilter with indexed text search.', 'Treat query as a Native regular expression. A literal token of at least three characters is required for bounded matching.')
      : currentSchema(item),
  ]));
}

const tools = CAPTURE.tools.map(tool => ({
  name: tool.name,
  description: GUIDANCE.description_overrides[tool.name] || currentDescription(tool.description),
  tier: tool.tier,
  hidden: tool.hidden === true,
  read_only: tool.read_only === true,
  destructive: tool.destructive === true,
  idempotent: tool.idempotent === true,
  input_schema: currentSchema(tool.input_schema),
  notes: GUIDANCE.notes[tool.name],
}));
assert(!/\bfunded\b|\bunpaid\b|HOST_NOT_FUNDED|billing|wallet|ai[_ -]?gateway|\bmuti\b|mutation[_ -]?(?:history|cure)|repository[_ -]?mutations|personal[_ -]?invitation[_ -]?code/i.test(json(tools)),
  'Retired product descriptions must not enter the public tool contract');
for (const tool of tools) {
  const properties = tool.input_schema.properties || {};
  for (const name of tool.input_schema.required || []) assert(name in properties, `${tool.name}: missing required property ${name}`);
  assert(tool.description.length > 0, `${tool.name}: empty reviewed description`);
}

const mdText = text => String(text).replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('{', '&#123;').replaceAll('}', '&#125;').replaceAll('|', '\\|').replace(/\s*\n\s*/g, ' ');
const code = value => `\`${String(value).replaceAll('`', '')}\``;
function typeName(schema) {
  if (schema.oneOf || schema.anyOf) return (schema.oneOf || schema.anyOf).map(typeName).join(' or ');
  if (schema.type === 'array') return `array of ${typeName(schema.items || {})}`;
  return Array.isArray(schema.type) ? schema.type.join(' or ') : schema.type || 'value';
}
function fieldDescription(schema) {
  const parts = [schema.description ? mdText(schema.description) : ''];
  if (schema.enum) parts.push(`Allowed: ${schema.enum.map(code).join(', ')}.`);
  if (Object.hasOwn(schema, 'default')) parts.push(`Default: ${code(JSON.stringify(schema.default))}.`);
  if (Object.hasOwn(schema, 'minimum')) parts.push(`Minimum: ${schema.minimum}.`);
  if (Object.hasOwn(schema, 'maximum')) parts.push(`Maximum: ${schema.maximum}.`);
  if (Object.hasOwn(schema, 'minLength')) parts.push(`Minimum length: ${schema.minLength}.`);
  if (Object.hasOwn(schema, 'minItems')) parts.push(`Minimum items: ${schema.minItems}.`);
  if (schema.pattern) parts.push(`Pattern: ${code(schema.pattern)}.`);
  if (schema.properties || schema.items?.properties) parts.push('Nested fields are defined in the linked JSON schema.');
  return parts.filter(Boolean).join(' ');
}
function guide(tool) {
  const properties = tool.input_schema.properties || {};
  const required = new Set(tool.input_schema.required || []);
  const ordered = Object.keys(properties).sort((a, b) => Number(required.has(b)) - Number(required.has(a)) || a.localeCompare(b));
  const inputs = ordered.length
    ? ['| Input | Required | Type | Meaning |', '| --- | --- | --- | --- |',
      ...ordered.map(name => `| ${code(name)} | ${required.has(name) ? 'Yes' : 'No'} | ${typeName(properties[name])} | ${fieldDescription(properties[name])} |`)].join('\n')
    : 'This tool takes no input fields.';
  const annotations = `Read-only: **${tool.read_only ? 'yes' : 'no'}**. Destructive: **${tool.destructive ? 'yes' : 'no'}**. Idempotent: **${tool.idempotent ? 'yes' : 'no'}**. These are the released tool’s annotations; operation-specific guards still apply.`;
  return `---\nname: ${tool.name.replace(/^fibe_/, 'fibe-tool-').replaceAll('_', '-')}\ndescription: ${JSON.stringify(tool.description)}\n---\n# ${tool.name}\n\n${mdText(tool.description)}\n\nThis guide uses the released SDK **${SOURCES.sdk_release}** input contract. The installation’s Native API routes and authorization determine which server operations are available.\n\n## Inputs\n\n${inputs}\n\nThe [complete tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) include nested fields and constraints. Fields marked optional can still be required by a particular resource, mode, or source selection.\n\n## Notes\n\n${tool.notes.map(note => `- ${note}`).join('\n')}\n\n${annotations}\n`;
}

const publicSchema = {
  schema_version: 1,
  sdk_release: SOURCES.sdk_release,
  reviewed_at: GUIDANCE.reviewed_at,
  api_revision: SOURCES.api.revision,
  release_archive_sha256: CAPTURE.release_archive_sha256,
  source_schema_snapshot_sha256: hash(fs.readFileSync(path.join(ROOT, 'source-contracts/sdk/tool-schemas.json'))),
  qualification: 'Input schemas captured offline from the released SDK, with reviewed Native product descriptions. No product-operation execution is implied.',
  tools,
};

const readme = `# Reviewed public tool guides\n\nThese 53 guides use the released SDK ${SOURCES.sdk_release} input schemas and\nreviewed Native descriptions. The schema capture and editorial notes live in\n\`source-contracts/sdk/\`; the public schema projection is\n\`static/native/sdk-tool-schemas.json\`.\n\nExact Native API seed text is retained only in the source-only\n\`source-contracts/native/tool-skill-seeds.json\` at API revision\n\`${SOURCES.api.revision}\`. It does not overwrite public guidance.\n\nRun \`npm run import-seed-skills\` to refresh pinned source provenance and regenerate\nthese guides. Run \`node scripts/import-seed-skills.mjs --check\` for an offline\nfreshness check; add \`--check-source\` to compare the exact Native source snapshot\nwith the sibling API checkout. Regenerate reference pages and LLM mirrors after\nchanges. Private runtime prompts are excluded. Input-contract inspection is not\nproof of a passing Host, provider, Agent, or SDK product workflow.\n`;

const groupNames = {meta: 'Discovery and orchestration', base: 'Resources and account settings', greenfield: 'Launch and repository creation', brownfield: 'Playground operations', overseer: 'Agent observation and conversations', local: 'Local filesystem tools', other: 'Repository credentials'};
function catalogPage() {
  const sections = Object.entries(groupNames).map(([tier, title]) => {
    const selected = tools.filter(tool => tool.tier === tier);
    if (!selected.length) return '';
    return `## ${title}\n\n| Tool | Purpose |\n| --- | --- |\n${selected.map(tool => `| [${code(tool.name)}](/reference/tools/${tool.name.replace(/^fibe_/, '').replaceAll('_', '-')}/) | ${mdText(tool.description)}${tool.hidden ? ' Hidden advanced tool; invoke through `fibe_call`.' : ''} |`).join('\n')}`;
  }).filter(Boolean);
  return `---\ntitle: Tools catalog\ndescription: Reviewed public tool guides and exact input schemas for the released SDK ${SOURCES.sdk_release}.\nslug: /sdk/tools-catalog\nsidebar_position: 7\nsidebar_label: Tools catalog\nimage: /img/og/sdk-tools-catalog.png\nkeywords: [MCP tools, fibe tools, tool catalog, resource_mutate, greenfield_create, pipeline]\n---\n\nThese **53 public tool guides** describe the released SDK **${SOURCES.sdk_release}** input contracts. Their parameter names, required fields, enums, and nested schemas are generated from an offline inspection of that release. Reviewed descriptions follow the current Native product scope. Server availability and permissions still depend on your installation.\n\nUse the [complete JSON tool schemas](https://whats.fibe.gg/native/sdk-tool-schemas.json) for machine-readable contracts. To discover every registered tool on your running MCP server, including tools without a guide here, call \`fibe_tools_catalog\` with \`include_schema: true\`. A hidden tool can be reached with \`fibe_call\` using its \`tool\` and \`args\` fields.\n\n${sections.join('\n\n')}\n\n## Input and confirmation rules\n\nEach guide lists the actual input fields. Resource-specific identifiers and filters may belong inside a payload or \`params\` object rather than at the top level. Consult \`fibe_schema\` for resource-operation payloads.\n\nDestructive tools require explicit confirmation unless the MCP confirmation gate has been disabled. Where a release’s advertised tool schema omits the confirmation field, use \`fibe_call\` with top-level \`confirm: true\` to forward confirmation. The read-only, destructive, and idempotent annotations describe the tool; they do not grant authority or establish a successful remote result.\n\nSee [Common workflows](/sdk/workflows/) for launch, template switching, pipelines, and monitoring examples.\n`;
}

const outputs = new Map([
  ['static/native/sdk-tool-schemas.json', json(publicSchema)],
  ['seed-skills/README.md', readme],
  ['docs/sdk/tools-catalog.md', catalogPage()],
  ...tools.map(tool => [`seed-skills/${tool.name.replace(/^fibe_/, 'fibe-tool-').replaceAll('_', '-')}.md`, guide(tool)]),
]);
const expected = new Set(tools.map(tool => `${tool.name.replace(/^fibe_/, 'fibe-tool-').replaceAll('_', '-')}.md`));
for (const file of fs.readdirSync(path.join(ROOT, 'seed-skills'))) {
  if (!file.startsWith('fibe-tool-') || expected.has(file)) continue;
  assert(!CHECK && !CHECK_SOURCE, `Unexpected public tool guide: ${file}`);
  fs.unlinkSync(path.join(ROOT, 'seed-skills', file));
}
for (const [name, content] of outputs) {
  const destination = path.join(ROOT, name);
  if (CHECK || CHECK_SOURCE) assert.equal(fs.readFileSync(destination, 'utf8'), content, `Stale generated tool guide: ${name}`);
  else fs.writeFileSync(destination, content);
}
console.log(`[import-seed-skills] ${CHECK || CHECK_SOURCE ? 'verified' : 'generated'} ${tools.length} reviewed SDK ${SOURCES.sdk_release} public tool guides and schemas`);
