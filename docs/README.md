# Hospital Dashboard v2

Premium local-first hospital network operations workspace.

**Status**: Foundation Phase — Layout, Navigation, Dashboard Shell complete.

## Source of Truth

- `design/` — Visual Source of Truth (Figma prototype)
- `docs/` — Product Source of Truth (specifications)
- `frontend/` — Vue 3 + TypeScript + Tailwind CSS implementation
- `backend/` — FastAPI (Python) implementation (pending)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 + TypeScript + Tailwind CSS 4 + Vite 6 |
| State | Pinia |
| Routing | Vue Router 4 (hash history) |
| Icons | Lucide Vue Next |
| Backend | FastAPI (pending) |
| Ping Engine | ping3 + ThreadPoolExecutor (pending) |

## Completed Modules

- [x] Header (glassmorphism, app title, search, toolbar)
- [x] Sidebar (collapsible, building tree, module nav, import button)
- [x] Application Layout (tokens, scroll zones, inspector panel, router)
- [x] Dashboard Foundation (stats placeholder, workspace header, list/grid switch)
- [ ] Dashboard Cards
- [ ] Device List / Grid
- [ ] Device Detail
- [ ] Assets Page
- [ ] CSV Import / Export
- [ ] Ping Engine
- [ ] Backend API
- [ ] SNMP
- [ ] Topology
- [ ] Inspection

## Architecture

```
App.vue
└── DefaultLayout (permanent shell)
    ├── AppHeader        (fixed, full-width)
    ├── AppSidebar       (fixed, 260px/72px)
    ├── <main>           (scrollable, token-based padding)
    │   └── ContentContainer
    │       └── RouterView → Page
    └── InspectorPanel   (fixed, 316px, right)
```
