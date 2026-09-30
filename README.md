# ui

Intent-driven UI skill resolver and installer.

## Use it

### Right now — no Git clone

Run this from inside your project:

    npx github:Geltrax69/ui

This fetches the CLI package directly from GitHub through npm's runner. You do not need to clone the repository into your project.

### Recommended public npm command

Once the package is published to npm:

    npx @geltrax69/ui

The command exposed by the package is still:

    ui

The bare command:

    npx ui

is not used because the npm package name `ui` is already owned by another package. npm currently lists that package as `ui` 0.2.4 from the old ui.js project. See the npm listing for details.

## What happens when you run it

    $ npx @geltrax69/ui

    ui - UI setup wizard
    Detected framework: nextjs
    Detected package manager: pnpm

    What are you building?
      1. Web app
      2. SaaS / product
      3. Dashboard / admin
      4. Landing / marketing
      5. E-commerce
      6. Creative / experimental
      7. Animation-heavy

    What should it feel like?
      1. Minimal
      2. Product / SaaS
      3. Animated
      4. Bold / Experimental
      5. 3D / Spatial
      6. Glass / Atmospheric

    How much motion?
      1. None
      2. Subtle
      3. Medium
      4. Heavy

Then it resolves the setup.

For example, a Next.js + SaaS + Animated project can resolve to:

    Foundation
      ✓ Impeccable
      ✓ Design Taste Frontend

    Design
      ✓ Emil Design Engineering
      ✓ Make Interfaces Feel Better

    React quality
      ✓ React Doctor

    Browser QA
      ✓ Playwright CLI

    Motion
      ✓ 12 Principles of Animation

Nothing is installed until you confirm.

## How it auto-detects

ui checks the current project for:

- package.json dependencies;
- Next.js / React / Vue / Svelte / React Native / Expo;
- npm / pnpm / yarn / bun lockfiles;
- Tailwind;
- an existing shadcn components.json.

If detection is clear, the framework is selected automatically.

If it is unclear, ui asks you.

## What it installs

### Always

    npx impeccable install
    npx skills add Leonxlnx/taste-skill --skill design-taste-frontend

These are the foundation layer.

### Only when relevant

- Emil Design Engineering
- Make Interfaces Feel Better
- React Doctor
- Playwright CLI
- 12 Principles of Animation

The resolver chooses these from project type, framework, visual direction, and motion level.

## What it does NOT install

ui does not bulk-install UI ecosystems such as:

- Aceternity UI
- Magic UI
- Motion Primitives
- Skecher UI
- UIAble
- Uiverse

Those are registered as component sources.

If you need:

    animated hero

ui searches the registered sources for that capability and tells the agent where to find an exact component.

The intended flow is:

    Need
      ↓
    Search
      ↓
    Select exact component
      ↓
    Install exact component
      ↓
    Install only its dependencies

Not:

    Download the whole library

## Inspiration

Run:

    npx @geltrax69/ui inspire landing

or:

    npx @geltrax69/ui inspire creative

This generates targeted searches such as:

    product landing hero
    bento feature section
    editorial typography
    scroll storytelling
    3D hero composition
    ambient background motion

The agent should study the reference for hierarchy, layout, typography, surfaces, interaction, motion, accessibility, responsiveness, and performance.

Then it converts the observation into an explicit design requirement before choosing an implementation.

## Component discovery

Examples:

    npx @geltrax69/ui component "animated hero"
    npx @geltrax69/ui component "3d card"
    npx @geltrax69/ui component "glass navbar"
    npx @geltrax69/ui component "dashboard table"

This command does not install anything. It identifies relevant sources and their search vocabulary.

## Other commands

    npx @geltrax69/ui detect
    npx @geltrax69/ui plan saas
    npx @geltrax69/ui --dry-run

## Project record

After a successful setup, ui writes:

    .ui/profile.json

This records the selected project type, style, motion level, detected framework, package manager, and resolved skills so later tooling can reuse the same configuration.

## Architecture

    Project
      ↓
    Detect framework
      ↓
    Ask project intent
      ↓
    Ask visual direction
      ↓
    Ask motion level
      ↓
    Resolve minimal skills
      ↓
    Install selected skills
      ↓
    Discover exact components when needed
      ↓
    Verify in the target project

## Status

Early development. The resolver and source registry are being expanded toward full project-aware component resolution and browser verification.

Repository:

https://github.com/Geltrax69/ui
