# ui

> ## Status: 🟡 In Progress
>
> <progress value="60" max="100"></progress>
> **Progress: 60%** — the CLI resolver itself works (`plan`, `inspire`, `component`, `detect` all verified against the registry), but the repo's own test and CI files are corrupted with escaped `\n` sequences, so `npm test` fails and CI is red on every push.

<p align="center">
  <img src="docs/banner.webp" alt="ui banner" width="100%" />
</p>

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/badge/npm-%40geltrax69%2Fui-CB3837?style=flat-square&logo=npm)](https://www.npmjs.com/package/@geltrax69/ui)

## What it is

`ui` is a zero-dependency Node.js CLI that helps AI coding agents set up frontend UI tooling. It detects your project's framework and AI agent, resolves which UI design skills to install from a curated JSON registry, and searches a component-source registry by intent (e.g. "animated hero") so the agent installs the smallest exact component instead of bulk-downloading whole libraries. It also ships an interactive setup wizard and research prompts for design inspiration.

## What works (verified)

- ✅ `node bin/ui.mjs plan web` — prints an install plan of 5 skills (impeccable, design-taste-frontend, emil-design-eng, jakub-better-ui, playwright-cli)
- ✅ `node bin/ui.mjs component "animated hero"` — ranked search across the 258-entry sources registry (Magic UI, Aceternity UI, …)
- ✅ `node bin/ui.mjs inspire` — research prompts for web layouts
- ✅ `node bin/ui.mjs detect` — detects framework, package manager, and AI agents in the current project (verified inside this repo: found `npm`, `codex`)
- ✅ All registry JSON files (`skills`, `profiles`, `frameworks`, `components`, `sources`, `discovery`) parse as valid JSON
- ❌ `npm test` does NOT work — `test/smoke.mjs` is corrupted (literal `\n` escapes make the whole file one line → `SyntaxError`)
- ❌ CI does NOT pass — `.github/workflows/ci.yml` has the same corruption (single-line YAML), so all 5 recorded runs failed
- ❌ Top-level `--dry-run` is advertised in the usage text but not parsed — `node bin/ui.mjs --dry-run` just prints usage; the flag only works inside the interactive wizard

## Tech stack

| Layer | Technology |
|---|---|
| CLI runtime | Node.js ≥ 20, ESM, zero dependencies |
| Data | JSON registries: skills, profiles, frameworks, components, sources, discovery |
| Docs | `docs/architecture.md`, `docs/inspiration.md`, `docs/source-adapters.md` |

## How to run

All commands below were tested (Node v24).

```bash
# inside any project — no install needed
node bin/ui.mjs plan web
node bin/ui.mjs component "animated hero"
node bin/ui.mjs inspire
node bin/ui.mjs detect

# interactive setup wizard (requires a TTY; writes .ui/profile.json)
npx @geltrax69/ui
```

Do NOT run `npm test` expecting a pass — the smoke test file is corrupted (see above).

## Screenshots

None — this is a CLI tool. The banner above is the visual.

## What you can add more

- [ ] Fix `test/smoke.mjs` — replace the literal `\n` escapes with real newlines so `npm test` passes
- [ ] Fix `.github/workflows/ci.yml` — same corruption; CI stays red on every push until repaired
- [ ] Parse `--dry-run` as a top-level flag — usage advertises it, but only the interactive wizard honors it today
- [ ] Extend test coverage — the smoke test only checks that registry files exist and parse; add assertions for the `plan`/`component`/`detect` subcommands

## Project structure

```
bin/ui.mjs            the CLI: project/agent detection, skill profiles, component search,
                      inspiration prompts, interactive wizard
registry/             JSON registries: skills.json, profiles.json, frameworks.json,
                      components.json, sources.json (258 entries), discovery.json
docs/                 architecture.md, inspiration.md, source-adapters.md (+ banner)
test/smoke.mjs        registry smoke test (currently broken — literal \n escapes)
scripts/publish.sh    publish helper
CONTRIBUTING.md       contributor notes
```

---
*README written after code audit on 2026-10-08.*
