#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '..');
const registryDir = path.join(root, 'registry');
const read = (name) => JSON.parse(fs.readFileSync(path.join(registryDir, name), 'utf8'));
const skillsRegistry = read('skills.json');
const profilesRegistry = read('profiles.json');
const sourcesRegistry = read('sources.json');
const discoveryRegistry = read('discovery.json');
const log = (s = '') => console.log(s);
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function usage() {
  log('ui - intent-driven UI skill resolver');
  log('');
  log('Quick start:');
  log('  npx @geltrax69/ui');
  log('');
  log('Commands:');
  log('  ui                  interactive setup wizard');
  log('  ui detect           inspect the current project');
  log('  ui plan <profile>   preview a skill profile');
  log('  ui inspire <type>   generate design research queries');
  log('  ui component <q>    find relevant component sources');
  log('');
  log('Options: --dry-run, --yes');
}

function detectProject(cwd = process.cwd()) {
  const pkgPath = path.join(cwd, 'package.json');
  let pkg = {};
  if (fs.existsSync(pkgPath)) {
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); }
    catch { throw new Error('package.json exists but is not valid JSON.'); }
  }
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}), ...(pkg.peerDependencies || {}) };
  const files = fs.existsSync(cwd) ? new Set(fs.readdirSync(cwd)) : new Set();
  let framework = 'unknown';
  if (has(deps, 'next')) framework = 'nextjs';
  else if (has(deps, 'react') || has(deps, 'react-dom')) framework = 'react';
  else if (has(deps, 'vue')) framework = 'vue';
  else if (has(deps, 'svelte')) framework = 'svelte';
  else if (has(deps, 'expo') || has(deps, 'react-native')) framework = 'mobile-react-native';
  else if (files.has('index.html')) framework = 'web';
  let packageManager = 'npm';
  if (files.has('pnpm-lock.yaml')) packageManager = 'pnpm';
  else if (files.has('yarn.lock')) packageManager = 'yarn';
  else if (files.has('bun.lockb') || files.has('bun.lock')) packageManager = 'bun';
  const isReact = framework === 'react' || framework === 'nextjs';
  const hasTailwind = has(deps, 'tailwindcss') || files.has('tailwind.config.js') || files.has('tailwind.config.ts');
  const hasShadcn = files.has('components.json');
  return { framework, packageManager, isReact, hasTailwind, hasShadcn, packageName: pkg.name || null };
}

function skillById(id) { return skillsRegistry.skills.find((s) => s.id === id); }
function dedupe(ids) { return [...new Set(ids)]; }

function resolveSkillIds({ projectType, framework, style, motion }) {
  const ids = ['impeccable', 'design-taste-frontend'];
  const profile = profilesRegistry.profiles[projectType] || profilesRegistry.profiles.web;
  ids.push(...(profile.always || []), ...(profile.skills || []));
  if (framework === 'react' || framework === 'nextjs') ids.push('react-doctor');
  if (style === 'animated' || style === 'bold' || style === '3d' || style === 'creative') ids.push('emil-design-eng', 'make-interfaces-feel-better');
  if (motion === 'medium' || motion === 'heavy' || style === 'animated' || style === '3d') ids.push('12-principles-of-animation');
  return dedupe(ids);
}

function runInstall(command) {
  log('\n$ ' + command + '\n');
  const result = spawnSync(command, { cwd: process.cwd(), stdio: 'inherit', shell: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Command failed with exit code ' + result.status + ': ' + command);
}

async function ask(rl, question, choices, defaultIndex = 0) {
  log('\n' + question);
  choices.forEach((c, i) => log('  ' + (i + 1) + '. ' + c));
  const answer = await rl.question('Select [' + (defaultIndex + 1) + ']: ');
  const n = Number.parseInt(answer.trim(), 10);
  return choices[(Number.isFinite(n) && n >= 1 && n <= choices.length) ? n - 1 : defaultIndex];
}

async function interactive() {
  const detected = detectProject();
  const rl = createInterface({ input, output });
  try {
    log('ui - UI setup wizard');
    log('Detected framework: ' + detected.framework);
    log('Detected package manager: ' + detected.packageManager);
    if (detected.packageName) log('Project: ' + detected.packageName);

    const projectTypes = ['web', 'saas', 'dashboard', 'landing', 'ecommerce', 'creative', 'animation'];
    const projectLabels = ['Web app', 'SaaS / product', 'Dashboard / admin', 'Landing / marketing', 'E-commerce', 'Creative / experimental', 'Animation-heavy'];
    const typeIndex = await ask(rl, 'What are you building?', projectLabels, 0);
    const projectType = projectTypes[typeIndex];

    const styleLabels = ['Minimal', 'Product / SaaS', 'Animated', 'Bold / Experimental', '3D / Spatial', 'Glass / Atmospheric'];
    const styleValues = ['minimal', 'product', 'animated', 'bold', '3d', 'glass'];
    const styleIndex = await ask(rl, 'What should it feel like?', styleLabels, projectType === 'creative' ? 2 : 0);
    const style = styleValues[styleIndex];

    const motionLabels = ['None', 'Subtle', 'Medium', 'Heavy'];
    const motionValues = ['none', 'subtle', 'medium', 'heavy'];
    const motionIndex = await ask(rl, 'How much motion?', motionLabels, style === 'animated' || style === '3d' ? 2 : 1);
    const motion = motionValues[motionIndex];

    let framework = detected.framework;
    if (framework === 'unknown') {
      const frameworkValues = ['nextjs', 'react', 'vue', 'svelte', 'mobile-react-native', 'unknown'];
      const frameworkLabels = ['Next.js', 'React', 'Vue', 'Svelte', 'React Native / Expo', 'Not sure'];
      framework = frameworkValues[await ask(rl, 'Which framework are you using?', frameworkLabels, 0)];
    }

    const ids = resolveSkillIds({ projectType, framework, style, motion });
    const selected = ids.map(skillById).filter(Boolean);
    log('\nResolved setup:');
    log('  Project:   ' + projectLabels[typeIndex]);
    log('  Style:     ' + styleLabels[styleIndex]);
    log('  Motion:    ' + motion);
    log('  Framework: ' + framework);
    log('  Package:   ' + detected.packageManager);
    log('\nSkills to install:');
    selected.forEach((s) => { log('  ✓ ' + s.name); log('    ' + s.install); });
    log('\nComponent libraries are not bulk-installed. Use the component command to discover an exact component when you need one.');

    if (process.argv.includes('--dry-run')) { log('\nDry run - nothing installed.'); return; }
    const yes = process.argv.includes('--yes') || process.argv.includes('-y');
    const confirmation = yes ? 'y' : (await rl.question('\nInstall this setup? [Y/n] ')).trim().toLowerCase();
    if (confirmation && confirmation !== 'y' && confirmation !== 'yes') { log('Cancelled. Nothing was installed.'); return; }
    selected.forEach((s) => runInstall(s.install));

    const uiDir = path.join(process.cwd(), '.ui');
    fs.mkdirSync(uiDir, { recursive: true });
    fs.writeFileSync(path.join(uiDir, 'profile.json'), JSON.stringify({ version: 1, projectType, style, motion, framework, packageManager: detected.packageManager, skills: ids }, null, 2) + '\n');
    log('\n✓ UI setup complete.');
    log('✓ Saved .ui/profile.json');
  } finally { rl.close(); }
}

function showProfile(profile) {
  const p = profilesRegistry.profiles[profile];
  if (!p) { log('Unknown profile: ' + profile); process.exitCode = 1; return; }
  const ids = dedupe([...(p.always || []), ...(p.skills || [])]);
  log('Profile: ' + profile + '\n');
  ids.map(skillById).filter(Boolean).forEach((s) => log('  ✓ ' + s.id + ' — ' + s.install));
}

function inspire(type = 'web') {
  const queries = discoveryRegistry.discovery_queries[type] || discoveryRegistry.discovery_queries.web;
  log('Research prompts for ' + type + ':\n');
  queries.forEach((q) => log('  • ' + q));
}

function component(query = '') {
  const q = query.toLowerCase().trim();
  if (!q) { log('Give a component need, e.g. ui component "animated hero".'); process.exitCode = 1; return; }
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = sourcesRegistry.sources.map((s) => {
    const haystack = [...(s.capabilities || []), ...(s.search_terms || []), s.name].map((x) => x.toLowerCase());
    let score = 0;
    terms.forEach((term) => { if (haystack.some((h) => h.includes(term))) score += 1; });
    return { s, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name));
  log('Component search: ' + query + '\n');
  scored.slice(0, 8).forEach(({ s }) => { log(s.name); log('  ' + s.url); log('  Search: ' + (s.search_terms || []).join(', ')); log('  Mode: ' + s.mode + '\n'); });
}

const args = process.argv.slice(2);
if (!args.length) await interactive();
else if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') usage();
else if (args[0] === 'plan') showProfile(args[1] || 'web');
else if (args[0] === 'inspire') inspire(args[1]);
else if (args[0] === 'component') component(args.slice(1).join(' '));
else if (args[0] === 'detect') log(JSON.stringify(detectProject(), null, 2));
else usage();
