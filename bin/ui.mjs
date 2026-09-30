#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output, env } from 'node:process';

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
  log('  npx @geltrax69/ui --dry-run');
  log('');
  log('The setup wizard automatically detects your project and AI agent where possible.');
  log('Use comma-separated answers for multi-select questions.');
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
  return { framework, packageManager, isReact, hasTailwind, hasShadcn, packageName: pkg.name || null, deps };
}

function detectAgents(cwd = process.cwd()) {
  const home = env.HOME || '';
  const candidates = [
    ['codex', path.join(home, '.codex')],
    ['claude-code', path.join(home, '.claude')],
    ['cursor', path.join(home, '.cursor')],
    ['windsurf', path.join(home, '.windsurf')],
    ['cline', path.join(home, '.cline')],
    ['gemini-cli', path.join(home, '.gemini')],
    ['github-copilot', path.join(home, '.copilot')],
    ['opencode', path.join(home, '.config', 'opencode')],
  ];
  const found = candidates.filter(([, p]) => fs.existsSync(p)).map(([name]) => name);
  if (process.env.CODEX_HOME && !found.includes('codex')) found.push('codex');
  if (process.env.CLAUDE_CODE && !found.includes('claude-code')) found.push('claude-code');
  if (process.env.CURSOR_AGENT && !found.includes('cursor')) found.push('cursor');
  return found;
}

function skillById(id) { return skillsRegistry.skills.find((s) => s.id === id); }
function dedupe(ids) { return [...new Set(ids)]; }

function resolveSkillIds({ projectType, framework, style, motion }) {
  const ids = ['impeccable', 'design-taste-frontend'];
  const profile = profilesRegistry.profiles[projectType] || profilesRegistry.profiles.web;
  ids.push(...(profile.always || []), ...(profile.skills || []));
  if (framework === 'react' || framework === 'nextjs') ids.push('react-doctor');
  if (style === 'animated' || style === 'bold' || style === '3d' || style === 'creative') {
    ids.push('emil-design-eng', 'jakub-better-ui');
  }
  if (motion === 'medium' || motion === 'heavy' || style === 'animated' || style === '3d') {
    ids.push('12-principles-of-animation');
  }
  return dedupe(ids);
}

function runInstall(command, agents) {
  const agentArgs = agents.length ? agents.map((agent) => ' -a ' + agent).join('') : '';
  const finalCommand = command + agentArgs + ' -y';
  log('\n$ ' + finalCommand + '\n');
  const result = spawnSync(finalCommand, { cwd: process.cwd(), stdio: 'inherit', shell: true });
  if (result.error) return { ok: false, error: result.error.message };
  if (result.status !== 0) return { ok: false, error: 'exit code ' + result.status };
  return { ok: true };
}

async function askOne(rl, question, choices, defaultIndex = 0) {
  log('\n' + question);
  choices.forEach((c, i) => log('  ' + (i + 1) + '. ' + c));
  const answer = (await rl.question('Select [' + (defaultIndex + 1) + ']: ')).trim();
  if (!answer) return choices[defaultIndex];
  const n = Number.parseInt(answer, 10);
  return Number.isFinite(n) && n >= 1 && n <= choices.length ? choices[n - 1] : choices[defaultIndex];
}

async function askMulti(rl, question, choices, defaults = [0]) {
  log('\n' + question);
  choices.forEach((c, i) => log('  ' + (i + 1) + '. ' + c));
  log('  Enter multiple values separated by commas, e.g. 3,4,6');
  const answer = (await rl.question('Select [' + defaults.map((i) => i + 1).join(',') + ']: ')).trim();
  if (!answer) return defaults.map((i) => choices[i]);
  const nums = answer.split(',').map((x) => Number.parseInt(x.trim(), 10)).filter((n) => Number.isFinite(n) && n >= 1 && n <= choices.length);
  return dedupe(nums).map((n) => choices[n - 1]);
}

async function interactive() {
  const detected = detectProject();
  const agents = detectAgents();
  const rl = createInterface({ input, output });
  try {
    log('ui - UI setup wizard');
    log('───────────────────');
    log('Detected framework: ' + detected.framework);
    log('Detected package manager: ' + detected.packageManager);
    if (detected.packageName) log('Project: ' + detected.packageName);
    log('Detected AI/code agents: ' + (agents.length ? agents.join(', ') : 'none detected'));

    const projectTypes = ['web', 'saas', 'dashboard', 'landing', 'ecommerce', 'creative', 'animation'];
    const projectLabels = ['Web app', 'SaaS / product', 'Dashboard / admin', 'Landing / marketing', 'E-commerce', 'Creative / experimental', 'Animation-heavy'];
    const projectType = projectTypes[projectLabels.indexOf(await askOne(rl, 'What are you building?', projectLabels, 0))];

    const styles = ['minimal', 'product', 'animated', 'bold', '3d', 'glass'];
    const styleLabels = ['Minimal', 'Product / SaaS', 'Animated', 'Bold / Experimental', '3D / Spatial', 'Glass / Atmospheric'];
    const selectedStyles = await askMulti(rl, 'Choose visual directions (you can select multiple):', styleLabels, [0]);
    const selectedStyleValues = selectedStyles.map((x) => styles[styleLabels.indexOf(x)]);
    const primaryStyle = selectedStyleValues.includes('3d') ? '3d' : selectedStyleValues.includes('animated') ? 'animated' : selectedStyleValues[0];

    const motionLabels = ['None', 'Subtle', 'Medium', 'Heavy'];
    const motion = motionLabels.indexOf(await askOne(rl, 'How much motion?', motionLabels, primaryStyle === 'animated' || primaryStyle === '3d' ? 2 : 1));
    const motionValue = ['none', 'subtle', 'medium', 'heavy'][motion];

    const framework = detected.framework;
    const skillIds = resolveSkillIds({ projectType, framework, style: primaryStyle, motion: motionValue });
    const webLike = ['web', 'react', 'nextjs'].includes(framework);
    const effectiveSkillIds = webLike || projectType === 'web' || projectType === 'saas' || projectType === 'dashboard' || projectType === 'landing' || projectType === 'ecommerce'
      ? skillIds
      : skillIds.filter((id) => id !== 'playwright-cli');
    const selected = effectiveSkillIds.map(skillById).filter(Boolean);

    log('\nResolved setup:');
    log('  Project:   ' + projectType);
    log('  Style:     ' + selectedStyles.join(', '));
    log('  Motion:    ' + motionValue);
    log('  Framework: ' + framework);
    log('  Package:   ' + detected.packageManager);
    log('  Agents:    ' + (agents.length ? agents.join(', ') : 'none detected'));
    log('\nSkills to install:');
    selected.forEach((s) => { log('  ✓ ' + s.name); log('    ' + s.install); });

    if (process.argv.includes('--dry-run')) {
      log('\nDry run - nothing installed.');
      return;
    }

    const yes = process.argv.includes('--yes') || process.argv.includes('--non-interactive');
    const confirmation = yes ? 'y' : (await rl.question('\nInstall this setup? [Y/n] ')).trim().toLowerCase();
    if (confirmation && confirmation !== 'y' && confirmation !== 'yes') {
      log('Cancelled. Nothing was installed.');
      return;
    }

    const failed = [];
    for (const skill of selected) {
      const result = runInstall(skill.install, agents);
      if (!result.ok) {
        log('⚠ Could not install ' + skill.name + ' (' + result.error + '). Continuing with the rest.');
        failed.push({ id: skill.id, error: result.error });
      }
    }

    const uiDir = path.join(process.cwd(), '.ui');
    fs.mkdirSync(uiDir, { recursive: true });
    fs.writeFileSync(path.join(uiDir, 'profile.json'), JSON.stringify({
      version: 2,
      projectType,
      styles: selectedStyleValues,
      motion: motionValue,
      framework,
      packageManager: detected.packageManager,
      detectedAgents: agents,
      installedSkills: selected.filter((s) => !failed.some((f) => f.id === s.id)).map((s) => s.id),
      failedSkills: failed,
    }, null, 2) + '\n');

    log('\n✓ UI setup finished.');
    if (failed.length) log('⚠ ' + failed.length + ' optional skill(s) could not be installed. The rest of the setup completed.');
    log('✓ Saved .ui/profile.json');
    log('Next: ui component "animated hero" to discover an exact component source.');
  } finally {
    rl.close();
  }
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
  scored.slice(0, 8).forEach(({ s }) => {
    log(s.name);
    log('  ' + s.url);
    log('  Search: ' + (s.search_terms || []).join(', '));
    log('  Mode: ' + s.mode + '\n');
  });
}

const args = process.argv.slice(2);
if (!args.length) await interactive();
else if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') usage();
else if (args[0] === 'plan') showProfile(args[1] || 'web');
else if (args[0] === 'inspire') inspire(args[1]);
else if (args[0] === 'component') component(args.slice(1).join(' '));
else if (args[0] === 'detect') {
  log(JSON.stringify({ project: detectProject(), agents: detectAgents() }, null, 2));
}
else usage();
