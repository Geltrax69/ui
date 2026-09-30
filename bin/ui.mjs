#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const registryDir = path.join(root, 'registry');
const read = (name) => JSON.parse(fs.readFileSync(path.join(registryDir, name), 'utf8'));

const skills = read('skills.json');
const profiles = read('profiles.json');
const sources = read('sources.json');
const discovery = read('discovery.json');

function usage() {
  console.log(`ui — intent-driven UI skill resolver\n\nCommands:\n  ui                    interactive planner\n  ui detect             inspect the current project\n  ui inspire <type>     generate targeted research queries\n  ui component <query> find relevant component sources\n  ui plan <profile>     show the resolved skill plan\n`);
}
function plan(profile) {
  const ids = new Set([...(profiles.profiles[profile]?.always || [])]);
  for (const id of (profiles.profiles[profile]?.skills || [])) ids.add(id);
  return [...ids].map(id => skills.skills.find(s => s.id === id)).filter(Boolean);
}
function showProfile(profile) {
  console.log(`\\nProfile: ${profile}`);
  for (const s of plan(profile)) console.log(`  ✓ ${s.id} — ${s.install}`);
}
function inspire(type='web') {
  const q = discovery.discovery_queries[type] || discovery.discovery_queries.web;
  console.log(`Research prompts for ${type}:\\n`);
  for (const item of q) console.log(`  ${item}`);
}
function component(query='') {
  const q = query.toLowerCase();
  const hits = sources.sources.filter(s => (s.capabilities || []).some(c => q.includes(c) || c.includes(q)) || (s.search_terms || []).some(t => q.includes(t) || t.includes(q)));
  console.log(`Component search: ${query}\\n`);
  for (const s of hits.slice(0, 8)) console.log(`  ${s.name}\n    ${s.url}\n    Search: ${(s.search_terms || []).join(', ')}`);
}
const args = process.argv.slice(2);
if (!args.length) { usage(); console.log('\\nDefault foundation: impeccable + design-taste-frontend'); process.exit(0); }
if (args[0] === 'plan') showProfile(args[1] || 'web');
else if (args[0] === 'inspire') inspire(args[1]);
else if (args[0] === 'component') component(args.slice(1).join(' '));
else if (args[0] === 'detect') { console.log('Project detection is data-driven; run `ui plan <profile>` to preview a profile.'); }
else usage();
