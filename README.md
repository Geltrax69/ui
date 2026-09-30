# ui

**Intent-driven UI skill resolver, design research guide, and component installer.**

ui is a registry-driven CLI for developers and AI coding agents who want the right UI skills and references for a project without installing an entire UI ecosystem.

Instead of copying every library into a project, ui classifies sources by capability, recommends the right skills for the project, generates focused inspiration queries, and resolves individual components or packages only when they are actually needed.

**Core principle: discover broadly, install narrowly.**

## Why this exists

Modern frontend work has two separate problems:

1. How should the interface feel and behave?
2. Which implementation source should be used?

There are many excellent skill and UI resources for these jobs, but they serve different purposes.

- A design-engineering skill teaches an agent how to produce polished interfaces.
- A React quality skill audits an existing React codebase.
- A browser skill validates behavior in a real browser.
- A component registry provides an implementation for one specific UI need.
- An inspiration gallery helps identify visual direction.
- An animation library may be a runtime dependency rather than an agent skill.

ui keeps these categories separate.

## What ui installs

### 1. Foundation skills

These are the project-wide design foundations.

| Skill | Role |
| --- | --- |
| Impeccable | UI review, transformation, visual and UX quality |
| Design Taste Frontend | design direction, anti-generic frontend decisions, aesthetic quality |

Current install commands:

    npx impeccable install
    npx skills add Leonxlnx/taste-skill --skill design-taste-frontend

### 2. Specialist skills

These are installed according to the project profile.

| Skill | Use when |
| --- | --- |
| Emil Design Engineering | interaction polish, frontend craft, motion |
| Make Interfaces Feel Better | micro-interactions, UI polish, motion |
| React Doctor | React quality, performance, correctness |
| Playwright CLI | browser interaction, E2E checks, visual verification |
| 12 Principles of Animation | animation timing, easing, staging, motion thinking |

Example React/SaaS baseline:

    Impeccable
    Design Taste Frontend
    Emil Design Engineering
    Make Interfaces Feel Better
    React Doctor
    Playwright CLI

A highly animated creative project can additionally use:

    12 Principles of Animation

The goal is not to install every skill for every project.

## What ui does not bulk-download

These source ecosystems are intentionally treated as component or reference sources instead of universal dependencies:

- Aceternity UI
- Magic UI
- Motion Primitives
- Skecher UI
- UIArc
- Space UI
- Uiverse
- UIAble
- MicroKit
- Liquid Glass
- Kinetics
- Anime.js
- Designeer

The registry records what each source is useful for, how it should be searched, and whether it should be treated as:

- component registry;
- runtime package;
- reference library;
- inspiration library;
- source library;
- micro-interaction library;
- skill catalog.

This prevents a project from accumulating hundreds of unused components or unnecessary runtime dependencies.

## How the system works

The intended decision pipeline is:

    Project
       |
       v
    Detect framework and package manager
       |
       v
    Identify project type
       |
       +--> Web app
       +--> SaaS
       +--> Dashboard
       +--> Landing / marketing
       +--> E-commerce
       +--> AI application
       +--> Creative / experimental
       +--> Mobile
       |
       v
    Identify visual direction
       |
       +--> Minimal
       +--> Product / SaaS
       +--> Animated
       +--> Bold
       +--> 3D / spatial
       +--> Glass / atmospheric
       |
       v
    Build minimal skill graph
       |
       +--> Foundation skills
       +--> Framework skills
       +--> Quality / QA
       +--> Motion skills
       |
       v
    Discover implementation sources
       |
       v
    Find exact component or package
       |
       v
    Install only what is required
       |
       v
    Verify in the target environment

The resolver is data-driven. The rules live in registry/*.json, so adding or changing a source does not require rewriting the resolver.

## Source types

Every source belongs to a mode.

### Skill catalog

A source that provides agent skills.

Example:

    UI Skills

The installer should fetch the requested skill, not mirror the whole catalog.

### Component registry

A source that provides installable UI components.

Examples:

    Aceternity UI
    Magic UI
    Motion Primitives
    Skecher UI
    UIAble

Preferred workflow:

    Need
      |
      v
    Find capability
      |
      v
    Find exact component
      |
      v
    Install component
      |
      v
    Install declared dependencies

Not:

    Download the entire library

### Runtime package

A library that should become a project dependency only when its runtime behavior is needed.

Examples:

    Anime.js
    Liquid Glass

These are not agent skills.

### Reference library

A source used primarily for studying patterns.

Examples:

    UIArc
    Kinetics
    Space UI

The agent should inspect them for:

- information hierarchy;
- layout;
- typography;
- interaction patterns;
- motion;
- responsive behavior;
- accessibility states;
- component composition.

It should implement the principle rather than blindly copy a design.

### Inspiration library

Used to establish visual direction before implementation.

Example:

    Designeer

The workflow is:

    Reference
      |
      v
    Observe
      |
      v
    Extract design principle
      |
      v
    Write explicit requirement
      |
      v
    Find implementation source
      |
      v
    Implement

## Inspiration workflow

Use outcome-oriented queries instead of searching only for library names.

Good queries:

    animated SaaS hero
    editorial portfolio typography
    3D product landing page
    dashboard command palette
    mobile onboarding flow
    glass navigation
    scroll driven storytelling

Less useful queries:

    best UI
    cool website
    modern design

The first group describes an interface outcome. That makes the results more actionable.

When studying a reference, inspect these dimensions.

### Information hierarchy

- What is the primary action?
- What information is above the fold?
- What is intentionally de-emphasized?
- How are sections grouped?

### Layout

- grid;
- spacing scale;
- container width;
- alignment;
- responsive behavior;
- density.

### Typography

- type scale;
- font pairing;
- weight hierarchy;
- line height;
- measure;
- emphasis.

### Surfaces

- borders;
- shadows;
- gradients;
- glass;
- cards;
- backgrounds;
- depth.

### Interaction

- hover;
- focus;
- press;
- drag;
- disclosure;
- loading;
- empty;
- error;
- success.

### Motion

- duration;
- easing;
- spring behavior;
- sequencing;
- stagger;
- entrance and exit;
- scroll-linked behavior.

### Quality

- keyboard access;
- reduced motion;
- contrast;
- performance;
- touch behavior;
- content overflow.

The output of research should be an explicit implementation requirement, for example:

    Hero should feel calm and spatial:
    large type, low-density layout, slow entrance motion,
    subtle background depth, one primary CTA.

That requirement can then drive component discovery.

## Component discovery

The component registry is intended to work from capabilities, not vendor names.

Examples:

    node bin/ui.mjs component "animated hero"
    node bin/ui.mjs component "glass navbar"
    node bin/ui.mjs component "3d card"
    node bin/ui.mjs component "dashboard table"
    node bin/ui.mjs component "micro interaction"

The source registry maps capability and search vocabulary to candidate sources.

Example:

    animated hero

    -> Aceternity UI
    -> Magic UI
    -> Motion Primitives
    -> Skecher UI

The exact component should then be selected based on:

1. framework compatibility;
2. capability match;
3. installation quality;
4. accessibility;
5. performance;
6. visual fit.

The resolver should prefer the smallest useful implementation.

## Example project profiles

### SaaS

Typical baseline:

    Impeccable
    Design Taste Frontend
    Emil Design Engineering
    Make Interfaces Feel Better
    React Doctor
    Playwright CLI

Component discovery may include:

    dashboard
    command palette
    settings
    data table
    forms
    authentication
    billing
    empty states

### Dashboard

Typical baseline:

    Impeccable
    Design Taste Frontend
    Make Interfaces Feel Better
    React Doctor
    Playwright CLI

Research vocabulary:

    analytics card hierarchy
    dense data table
    filters and bulk actions
    responsive sidebar
    chart interactions
    empty states

### Landing / marketing

Typical baseline:

    Impeccable
    Design Taste Frontend
    Emil Design Engineering
    Make Interfaces Feel Better
    Playwright CLI

Research vocabulary:

    hero
    bento feature section
    logo wall
    testimonial composition
    pricing hierarchy
    scroll storytelling

### Creative / experimental

Typical baseline:

    Impeccable
    Design Taste Frontend
    Emil Design Engineering
    Make Interfaces Feel Better
    12 Principles of Animation
    Playwright CLI

Potential component sources:

    Motion Primitives
    Aceternity UI
    Magic UI
    Skecher UI
    Space UI
    MicroKit

## CLI

Current v0.2.x exposes the resolver primitives:

    node bin/ui.mjs

    node bin/ui.mjs plan saas

    node bin/ui.mjs inspire landing
    node bin/ui.mjs inspire creative

    node bin/ui.mjs component "animated hero"
    node bin/ui.mjs component "3d card"

    node bin/ui.mjs detect

The interactive questionnaire and full automatic project detection are part of the target architecture, but are not yet implemented as a complete end-to-end wizard in the current CLI.

## Repository structure

    ui/
    ├── bin/
    │   └── ui.mjs
    │
    ├── registry/
    │   ├── skills.json
    │   ├── profiles.json
    │   ├── frameworks.json
    │   ├── sources.json
    │   ├── discovery.json
    │   └── components.json
    │
    ├── docs/
    │   ├── architecture.md
    │   ├── inspiration.md
    │   └── source-adapters.md
    │
    ├── test/
    │   └── smoke.mjs
    │
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    │
    ├── package.json
    ├── CONTRIBUTING.md
    └── LICENSE

## Registry design

The registry is the central part of the project.

A skill entry describes:

    {
      "id": "react-doctor",
      "kind": "quality",
      "install": "npx skills add https://github.com/millionco/react-doctor --skill react-doctor",
      "provides": [
        "react-quality",
        "performance",
        "correctness"
      ],
      "profiles": [
        "react",
        "nextjs",
        "web",
        "saas",
        "dashboard"
      ]
    }

A source entry describes:

    {
      "name": "Aceternity UI",
      "mode": "component-registry",
      "capabilities": [
        "hero",
        "background",
        "card",
        "navigation",
        "3d"
      ],
      "search_terms": [
        "hero",
        "spotlight",
        "3d card",
        "background",
        "text effect",
        "navbar"
      ]
    }

This lets the resolver reason about a source without hard-coding every decision into JavaScript.

## Installation policy

### Rule 1 - Never bulk-download UI ecosystems

Only install the exact skill, component, or package that is required.

### Rule 2 - Keep agent skills separate from runtime dependencies

An agent skill teaches or audits.

A runtime package executes inside the application.

They are not interchangeable.

### Rule 3 - Prefer official installation methods

When a project requires a third-party component, prefer the source's official registry or CLI.

### Rule 4 - Preserve attribution and licensing

Do not silently repackage third-party code as if it were original project code.

### Rule 5 - Research before implementation

Use reference galleries to discover patterns, then implement deliberately.

### Rule 6 - Verify after installation

Web UI should be checked in the actual target environment.

This is where Playwright becomes useful for web projects.

## Design philosophy

ui is not intended to be another giant component library.

It is a decision and discovery layer over the growing frontend ecosystem.

The desired experience is:

    "I need an animated dashboard."

instead of:

    "I need to know which of the 40 UI libraries I should install."

The user describes the goal.

ui narrows the search space.

The agent chooses the implementation.

Only the necessary pieces are installed.

## Roadmap

### v0.2

- registry-driven skill profiles;
- source classification;
- inspiration query generation;
- component-source lookup;
- installation policy;
- smoke tests.

### v0.3

- interactive project questionnaire;
- framework and package-manager detection;
- project-aware resolution;
- dry-run installation plans;
- explicit dependency graph.

### v0.4

- component registry adapters;
- exact component resolution;
- installation command generation;
- package/dependency reconciliation;
- post-install verification.

### v0.5

- browser-assisted reference research;
- visual comparison workflows;
- screenshot-based UI review;
- accessibility checks;
- performance checks;
- learned source ranking from successful installs.

## Contributing

The easiest way to add a new source is to update the registry rather than modifying the resolver logic.

A new source should define:

- name;
- URL;
- source mode;
- capabilities;
- search vocabulary;
- installation strategy;
- framework compatibility;
- licensing and attribution notes where relevant.

See:

- docs/source-adapters.md
- docs/architecture.md
- CONTRIBUTING.md

## Status

**Early development / experimental.**

The registry and resolver primitives are usable, but the full autonomous flow — from a natural-language project brief to component search, exact installation, and browser verification — is still being built.

The project deliberately favors a small, understandable resolver over a large opaque dependency system.

## License

MIT
