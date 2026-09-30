# ui

**One command to configure the UI skills and resources your project needs.**

## Quick start

Run this inside your project:

~~~bash
npx ui
~~~

`ui` asks a few questions, inspects your project, then builds a minimal UI setup.

## What it asks

### 1. What are you building?

~~~text
? Project type

❯ Web app
  SaaS
  Dashboard / Admin
  Landing / Marketing
  E-commerce
  AI app
  Portfolio
  Creative / Experimental
  Mobile app
  Other
~~~

### 2. What should it feel like?

~~~text
? Visual direction

❯ Minimal
  Product / SaaS
  Animated
  Bold / Experimental
  3D / Spatial
  Glass / Atmospheric
  Not sure
~~~

### 3. How much motion?

~~~text
? Motion level

❯ None
  Subtle
  Medium
  Heavy
~~~

### 4. Framework

`ui` tries to detect this automatically.

~~~text
Detected:
  Framework: Next.js
  UI: React
  Package manager: pnpm

Use detected setup? Yes
~~~

You only need to answer this manually when detection is ambiguous.

## What it automatically configures

`ui` creates a plan instead of installing everything.

For a React + SaaS + animated project, the plan could be:

~~~text
Foundation
  ✓ Impeccable
  ✓ Design Taste Frontend

Design engineering
  ✓ Emil Design Engineering
  ✓ Make Interfaces Feel Better

React quality
  ✓ React Doctor

Browser QA
  ✓ Playwright CLI

Motion
  ✓ 12 Principles of Animation
~~~

Then it installs the selected skills using their upstream install commands.

## It does NOT install every UI library

Libraries such as:

- Aceternity UI
- Magic UI
- Motion Primitives
- Skecher UI
- UIAble
- Uiverse

are treated as **component sources**.

For example, if your project needs an animated hero:

~~~text
Need: animated hero
        ↓
Search relevant registered sources
        ↓
Find exact component
        ↓
Install only that component
~~~

It does **not** download the whole library.

## Inspiration mode

You can also ask `ui` for targeted design research:

~~~bash
npx ui inspire landing
~~~

It generates useful searches such as:

~~~text
product landing hero
bento feature section
editorial typography
pricing hierarchy
scroll storytelling
~~~

The goal is:

~~~text
Find inspiration
    ↓
Extract the design idea
    ↓
Turn it into a requirement
    ↓
Find an implementation
    ↓
Install only what is needed
~~~

## Useful commands

~~~bash
# Configure a project
npx ui

# Preview a profile
npx ui plan saas

# Generate inspiration searches
npx ui inspire landing

# Find component sources
npx ui component "animated hero"

# Detect the current project
npx ui detect
~~~

## Core rule

~~~text
Project intent
      ↓
Framework detection
      ↓
Visual direction
      ↓
Minimal skill set
      ↓
Targeted component discovery
      ↓
Install only what is needed
~~~

**`ui` is a resolver, not another giant UI library.**
