# Architecture

`ui` is an intent-driven resolver. It separates core skills, conditional skills, component registries, runtime packages, and inspiration libraries. The resolver should detect framework and project intent, build a minimal dependency graph, and install only the smallest relevant set.
