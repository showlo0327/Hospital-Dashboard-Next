# CLAUDE.md

Implement the approved prototype only.
Never redesign UI.
Use Vue3 + TS + Tailwind + FastAPI.
Do not use exported React directly.

## Current Implementation State

- Layout shell: Complete (Header, Sidebar, DefaultLayout, InspectorPanel)
- Dashboard foundation: Complete (Stats placeholder, WorkspaceHeader, WorkspaceContainer)
- Routing: 8 routes configured (dashboard, assets, snmp, topology, inspection, alarms, reports, settings)
- Navigation: BuildingTree, ModuleNav with router-linked active states
- Components: organized into layout/, dashboard/{stats,workspace,inspector,common}, devices/, assets/, navigation/, shared/
- CSS: Design tokens in theme.css, constants in utils/constants.ts

## Rules

1. One feature per implementation cycle
2. Generate Development Report after every module
3. Pixel-perfect match to prototype
4. All dimensions via design tokens, never hardcoded
5. Wait for approval before next module
