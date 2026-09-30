# ui

Intent-driven UI skill resolver for AI coding projects.

## Run without cloning

Use this while you are inside your project:

```bash
npx -y github:Geltrax69/ui
```

The GitHub repository is only the CLI source. It is not cloned into your project.

After publishing the package to npm:

```bash
npx -y @geltrax69/ui
```

## What ui does

```text
Detect project
   ↓
Detect AI/code agents
   ↓
Ask project type
   ↓
Ask visual direction
   ↓
Ask motion level
   ↓
Resolve required skills
   ↓
Install only those skills
```

It does not ask the user to select from dozens of AI agents. It detects common local agents and passes them directly to the Skills CLI with `-a` and `-y`. The Skills CLI supports targeted agent installation with `-a/--agent` and non-interactive installation with `-y/--yes`. citeturn825568search1turn490432search3

## Example

```text
$ npx -y github:Geltrax69/ui

✓ Framework: nextjs
✓ Package manager: pnpm
✓ Agents: codex, cursor

What are you building?
  1. Web app
  2. SaaS / product
  3. Dashboard / admin
  4. Landing / marketing
  5. E-commerce
  6. Creative / experimental
  7. Animation-heavy

Choose visual directions:
  1. Minimal
  2. Product / SaaS
  3. Animated
  4. Bold / Experimental
  5. 3D / Spatial
  6. Glass / Atmospheric

Select: 3,4,6

How much motion?
  1. None
  2. Subtle
  3. Medium
  4. Heavy

Select: 3
```

Multiple choices use comma-separated numbers.

## What gets installed

Foundation:

```text
Impeccable
Design Taste Frontend
```

Conditional skills can include:

```text
Emil Design Engineering
Jakub Krehel / Better UI
React Doctor
Playwright CLI
12 Principles of Animation
```

The resolver does not install React Doctor unless React/Next.js is detected.

## No duplicate agent prompts

Instead of doing this:

```text
npx skills add ...
→ Which agents do you want?
→ 73 agents...
```

ui generates a command like:

```bash
npx -y skills add Leonxlnx/taste-skill --skill design-taste-frontend   -a codex -a cursor -y
```

The exact agent list comes from the machine.

## Impeccable

ui uses the Skills CLI route for Impeccable so it can target the same detected agents:

```bash
npx -y skills add pbakaus/impeccable -a codex -a cursor -y
```

This avoids opening Impeccable's separate provider picker. Impeccable documents both its own installer and the general Skills CLI installation route. citeturn448121search1turn825568search11

## Current upstream fixes

The registry is kept against the current upstream skill names.

Jakub Krehel's repository currently contains `better-ui`, `better-interface`, `better-layout`, `better-typography`, and other skills; `make-interfaces-feel-better` is not an available skill name. citeturn490432search0

The 12 Principles of Animation skill currently installs from `raphaelsalaja/skill`:

```bash
npx skills add https://github.com/raphaelsalaja/skill --skill 12-principles-of-animation
```

citeturn816529search2

## Component libraries

ui does not bulk-download:

- Aceternity UI
- Magic UI
- Motion Primitives
- Skecher UI
- UIAble
- Uiverse
- Space UI
- MicroKit
- and similar libraries

Instead:

```text
Need "animated hero"
       ↓
Find relevant sources
       ↓
Choose exact component
       ↓
Install exact component + dependencies
```

## Inspiration

Use:

```bash
npx -y github:Geltrax69/ui inspire landing
npx -y github:Geltrax69/ui inspire creative
```

The generated queries focus on outcomes, for example:

```text
animated SaaS hero
bento feature section
editorial typography
3D hero composition
scroll storytelling
ambient motion
```

The intended workflow is:

```text
Reference
→ extract principle
→ turn it into a requirement
→ find implementation
→ install exact component
→ verify
```

## Debugging

Preview without installing:

```bash
npx -y github:Geltrax69/ui --dry-run
```

Detect the current project and agents:

```bash
npx -y github:Geltrax69/ui detect
```

## Status

Experimental. The project-aware skill resolver is functional. Exact component resolution and browser-assisted verification are still being expanded.

Repository:

https://github.com/Geltrax69/ui
