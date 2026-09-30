# ui

**One command to set up the UI skills your project actually needs.**

## Run it

From the root of any project:

```bash
npx github:Geltrax69/ui
```

No clone is required.

Once `@geltrax69/ui` is published to npm, the shorter command will be:

```bash
npx @geltrax69/ui
```

## What happens

```text
1. Detect project
2. Detect installed AI/code agents
3. Ask project type
4. Ask visual direction
5. Ask motion level
6. Resolve the smallest useful skill set
7. Install directly into the detected agent(s)
```

The user should not have to answer which AI tool they use.

## Example

```text
✓ Framework: unknown
✓ Package manager: npm
✓ Agents: codex, claude-code, cursor, cline, gemini-cli, github-copilot, opencode

What are you building?
  1. Web app
  2. SaaS / product
  3. Dashboard / admin
  4. Landing / marketing
  5. E-commerce
  6. Creative / experimental
  7. Animation-heavy

Choose visual directions (multiple):
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

Multiple selections are written as comma-separated numbers.

## Automatic agent installation

ui calls the Skills CLI with the detected targets instead of opening the Skills CLI agent picker.

For example:

```bash
npx -y skills add LEONX/skill --skill name -a codex -a cursor -a claude-code -y
```

The exact agent list is generated from the machine.

Supported target identifiers include `codex`, `claude-code`, `cursor`, `cline`, `gemini-cli`, `github-copilot`, `windsurf`, and `opencode`. The Skills CLI documents `-a/--agent` and `-y/--yes` for targeted, non-interactive installs. 

This removes the 73-agent picker seen in the previous version.

## Impeccable

ui does **not** run the old bare:

```bash
npx impeccable install
```

Instead it uses the shared Skills installer and targets the detected agents:

```bash
npx -y skills add pbakaus/impeccable -a <detected-agent> -y
```

This avoids handing control back to Impeccable's provider picker. Impeccable also documents the Skills CLI route as a supported installation method. 

## Skill selection

Two foundation skills are always considered:

```text
Impeccable
Design Taste Frontend
```

Then ui adds specialists only when their capabilities match the project:

```text
Emil Design Engineering
Jakub Krehel / Better UI
React Doctor
Playwright CLI
12 Principles of Animation
```

For example:

```text
Creative + Bold + Glass + Medium motion

→ Impeccable
→ Design Taste Frontend
→ Emil Design Engineering
→ Jakub Better UI
→ 12 Principles of Animation
```

React Doctor is added only when React/Next.js is detected.

## No bulk UI-library downloads

Aceternity, Magic UI, Motion Primitives, Skecher UI, UIAble, Uiverse and similar sources are treated as component sources.

ui does not download their entire libraries.

Use:

```bash
npx @geltrax69/ui component "animated hero"
```

The resolver identifies relevant sources and their search vocabulary. The next step is to install the exact component you need.

## Inspiration

Use:

```bash
npx @geltrax69/ui inspire landing
npx @geltrax69/ui inspire creative
```

The output is focused on outcomes such as:

```text
animated SaaS hero
editorial typography
bento feature section
3D hero composition
scroll storytelling
ambient motion
```

The workflow is:

```text
Reference
→ extract design principle
→ turn it into a requirement
→ find implementation
→ install exact component
→ verify
```

## Safe defaults

ui aims to be:

- project-local by default;
- agent-aware;
- non-interactive inside downstream installers;
- tolerant of optional skill failures;
- minimal rather than "install everything".

Every run writes:

```text
.ui/profile.json
```

so the resolved setup can be inspected and reused.

## Debugging

Preview without installing:

```bash
npx github:Geltrax69/ui --dry-run
```

Detect the current project:

```bash
npx github:Geltrax69/ui detect
```

## Current status

Experimental. The project-aware skill resolver is working; component-level automatic selection and browser-assisted visual verification are still being expanded.

Repository: https://github.com/Geltrax69/ui
