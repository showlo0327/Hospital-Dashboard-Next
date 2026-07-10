# ARCHITECTURE

design → docs → frontend/backend

## Frontend (Implemented)

- Vue 3 + TypeScript + Tailwind CSS 4 + Vite 6
- Pinia for state management
- Vue Router 4 (hash history) for navigation
- Design tokens: CSS custom properties + TypeScript constants

## Component Architecture

### Layout Shell
```
DefaultLayout
├── AppHeader (fixed, full-width)
├── AppSidebar (fixed, below header)
├── <main> (scrollable)
│   └── ContentContainer → RouterView → Page
└── InspectorPanel (fixed, right)
```

### Workspace Header Hierarchy
```
BaseWorkspaceHeader (universal, configurable)
├── Props: label, title, subtitle, toggles for search/refresh/filter/viewSwitch/moreMenu
├── Emits: update:view
├── Slots: leading, center, trailing, toolbar, status
└── Specializations:
    ├── WorkspaceHeader (Dashboard: "Operational Workspace" / "Network Workspace")
    ├── (Future) AssetsHeader
    ├── (Future) SnmpHeader
    └── (Future) TopologyHeader
```

### Directory Organization
```
components/
├── layout/          Application shell
├── dashboard/
│   ├── stats/       Statistics system
│   ├── workspace/   Workspace header + container
│   ├── inspector/   Device detail panel
│   └── common/      Shared dashboard utilities
├── devices/         Device display (pending)
├── assets/          Asset management (pending)
├── navigation/      Sidebar navigation
├── shared/          Cross-domain components
└── settings/        Settings (future)
```

## Backend (v2.8.0)

### Three-Layer Architecture
```
FastAPI Router (api/)
    ↓   delegates to
Service Layer (services/)
    ↓   delegates to
Repository Layer (repositories/)
    ↓   reads/writes
data/assets.json
```

**Rule**: Only the Repository layer touches assets.json. No API route accesses the filesystem directly.

### API Endpoints

| Method | Path | Handler |
|---|---|---|
| GET | /api/devices | list_devices |
| GET | /api/devices/{id} | get_device |
| POST | /api/devices | create_device |
| PUT | /api/devices/{id} | update_device |
| DELETE | /api/devices/{id} | delete_device |
| GET | /api/dashboard/statistics | get_statistics |
| GET | /api/system/health | health |

### Shared Enums (models/enums.py)
- DeviceType (16 values)
- DeviceStatus (5 values)
- DeviceCategory (4 values)
- Health (4 values)

### Pending
- Ping Engine: ping3 + ThreadPoolExecutor
- CSV Import: csv_service.py
- SNMP: future

## Route Map

| Route | Page | Header |
|---|---|---|
| / | DashboardPage | WorkspaceHeader |
| /assets | AssetsPage | BaseWorkspaceHeader ("Master Data" / "Assets") |

### Assets Module (v2.8.0)

```
AssetsPage
├── BaseWorkspaceHeader  (label="Master Data", title="Assets", subtitle, refresh, more)
├── AssetsToolbar        (search + filter toggle + import/export)
├── AssetsFilterPanel    (placeholder: Status/Vendor/Building/Floor/Department/Type)
├── AssetsBatchActions   (Tag/Archive/Delete bar, appears on selection)
├── AssetsTable          (12-columns: Name, IP, Vendor, Model, Type, Building, Floor, Dept, Location, Status, Updated, Action)
│   ├── sortable (toggleSort, 12 sort keys)
│   ├── selectable (multi-select, select-all, checkbox column)
│   └── AssetsRowActions (View → ui.selectDevice, Edit, Delete)
├── AssetsPagination     (currentPage v-model, totalPages, "1–20 of 42 assets")
└── AssetsEmptyState     ("Import your first CSV")
```
| /snmp | SnmpPage | BaseWorkspaceHeader (future) |
| /topology | TopologyPage | BaseWorkspaceHeader (future) |
| /inspection | InspectionPage | BaseWorkspaceHeader (future) |
| /alarms | AlarmsPage | BaseWorkspaceHeader (future) |
| /reports | ReportsPage | BaseWorkspaceHeader (future) |
| /settings | SettingsPage | BaseWorkspaceHeader (future) |

## Data Layer

### Mock Data Architecture (v2.7.0)

```
services/mock/
├── types.ts          — DeviceRepository interface, DeviceStatistics type
├── devices.ts        — 43 realistic hospital devices (single source of truth)
├── statistics.ts     — Derived statistics (never hardcoded)
└── repository.ts     — Unified facade (MockDeviceRepository singleton)

stores/devices.ts     — Pinia store consuming deviceRepository
```

### Data Flow

```
services/mock/repository.ts  (MockDeviceRepository)
    │
    └── stores/devices.ts    (useDeviceStore)
        │
        ├── DashboardStats   (computed statistics)
        ├── DashboardPage    (deviceStore.devices → WorkspaceContainer)
        ├── DeviceList       (devices[] prop)
        ├── DeviceGrid       (devices[] prop)
        └── InspectorPanel   (deviceStore.getById → DeviceInspector)
```

### Future API Replacement

```
services/mock/repository.ts  →  services/api/deviceRepository.ts
MockDeviceRepository          →  ApiDeviceRepository (FastAPI)
```

Zero consumer changes required — repository interface is the contract.

## State Management

### UI Store (`stores/ui.ts`)
```
useUIStore
├── dark: boolean                  → Theme toggle
├── sidebarCollapsed: boolean      → Sidebar state
├── selectedDeviceId: string|null  → Inspector selection
├── toggleDark()
├── toggleSidebar()
├── selectDevice(id)
└── clearSelection()
```

### Selection Flow
```
User clicks DeviceListItem/DeviceCard (future)
    → uiStore.selectDevice(deviceId)
    → DashboardPage passes selectedId to WorkspaceContainer
    → DeviceList/DeviceGrid highlight selected row/card
    → InspectorPanel computed: devices.find(d => d.id === selectedDeviceId)
    → DeviceInspector renders full detail
```

### Centralized Device Type System (v2.3.1)

```
types/device.ts (319 lines — SINGLE SOURCE OF TRUTH)
├── DeviceCategory (enum: Network | Compute | Endpoint | Other)
├── DeviceType      (enum: 16 types, string values)
├── DeviceStatus    (enum: 5 states)
├── DeviceTypeMeta  (interface: icon, displayName, category, badgeColor, description, futureExtensionNotes)
├── DEVICE_TYPE_META (Record: 16 entries with full metadata)
├── getDeviceTypeMeta / getDeviceDisplayName / getDeviceCategory / getDeviceTypesByCategory
└── Device (interface: id, name, ip, type, vendor, model, building, floor, location,
              status, latency, availability, packetLoss, updated, history)
```

### Device Card System (v2.3.1)

```
DeviceCard (glass composite, uses getDeviceDisplayName)
├── Top Row: DeviceIcon + DeviceHeader + DeviceStatusBadge
├── Info Grid (2-col): DeviceInfo("Type") + DeviceVendor + DeviceModel + DeviceLocation
├── Metrics Box (rounded-2xl, bg-muted/45):
│   ├── DeviceLatency + DeviceHealthIndicator (typed DeviceStatus)
│   └── DeviceSparkline (SVG polyline, 34px)
└── Footer (border-t): DeviceUpdatedTime + DeviceActions
```

### Network Workspace (complete)

```
WorkspaceContainer (max-w-[1080px])
├── [list view]  → DeviceList (8 sub-components, 23 devices)
└── [grid view]  → DeviceGrid (DeviceCard × N, responsive 1/2/3 cols)
```

Both views share the same `devices[]` array, `loading` state, and `selectedId`.
Switching via `WorkspaceViewSwitch` — instant, zero layout jumping.

All 25 device components are type-safe, referencing the centralized enum system.
Shared by List View, Grid View, Inspector, Search Results, Assets Preview,
and future SNMP/Alarm modules.

### Device List System (v2.4.0)

```
WorkspaceContainer (max-w-[1080px])
├── [list view]  → DeviceList (rounded-[22px] glass card)
│   ├── DeviceListHeader (sticky, 8 columns, responsive)
│   ├── DeviceListContent (scrollable)
│   │   └── DeviceListItem × N (reuses DeviceIcon, DeviceHeader, StatusBadge, Latency, UpdatedTime)
│   ├── DeviceListEmpty / DeviceListLoading (state-driven)
│   └── DeviceListFooter (count + pagination placeholder)
└── [grid view]  → DeviceGrid (responsive: 1/2/3 cols) → DeviceCard × N
```

DeviceList is the primary data browsing component reused by all future modules.

---

### Ping Engine (v2.9.0)

```
PingWorker (ThreadPoolExecutor, 50 workers, 30s scan interval)
├── StatusCalculator (anti-flap state machine)
│   ├── 5 consecutive failures → Offline
│   ├── 3 consecutive successes → Online (recovery)
│   ├── Any failure during recovery → back to Offline
│   └── 1-4 intermittent failures → Warning
├── HealthCalculator (rolling metrics)
│   ├── Rolling avg latency (last 5 successful pings)
│   ├── Availability % (successful / total × 100)
│   └── Packet loss % (failed / total × 100)
├── DeviceState (per-device runtime, maxlen=20 history deque)
└── StatisticsCache (refreshed per scan cycle)

Ping Router: /api/ping/status/{id}, /api/ping/status, /api/ping/statistics
Lifespan: FastAPI startup → ping_engine.start(), shutdown → ping_engine.stop()
Ping library: ping3 (4.0.8)
Ping timeout: 2s per device
```

### Backend Architecture (v2.8.0)

```
FastAPI Router (/api/*)
├── Devices    (GET/POST/PUT/DELETE)
├── Dashboard  (GET statistics)
├── System     (GET health)
└── Ping       (GET status, statistics)

Service Layer
├── device_service.py
├── dashboard_service.py
└── ping_engine.py (background thread)

Repository Layer
└── device_repository.py → assets.json (singleton, thread-safe)
```

---

### Centralized Configuration System (v2.10.0)

```
system_config.json (single source of truth)
├── ping  → PingConfig   (history_size, thresholds, workers, intervals, timeout, ttl, enabled)
├── csv   → CsvConfig    (max_file_size, encodings, default_encoding)
├── snmp  → SnmpConfig   (enabled, port, community, timeout, retries, scan_interval)
└── ui    → UiConfig     (auto_refresh, default_view)

config.py
├── SystemConfig (singleton)
│   ├── load()          — reads system_config.json
│   ├── reload()        — dynamic re-read at runtime
│   └── to_dict()       — full config for API responses
├── PingConfig  (dataclass, 9 fields)
├── CsvConfig   (dataclass, 3 fields)
├── SnmpConfig  (dataclass, 6 fields)
└── UiConfig    (dataclass, 3 fields)

PingWorker
├── __init__()         — reads system_config.ping
├── _refresh_config()  — re-reads config each scan cycle (dynamic updates)
└── _run_loop()        — calls _refresh_config() before every scan
```

All future modules (CSV Import, SNMP) read from the same `system_config` singleton.
A future Settings page updates `system_config.json` via the Backend API.

---

### Frontend API Integration (v2.11.0)

```
┌──────────────────────────────────────────────────────────────┐
│                     VUE COMPONENTS                           │
│  DashboardPage  AssetsPage  DeviceList  DeviceGrid  Inspector│
└─────────────┬────────────────────────────────────────────────┘
              │ useDeviceStore / useDashboardStore / useSystemStore
              ▼
┌──────────────────────────────────────────────────────────────┐
│                     PINIA STORES                             │
│  devices.ts     dashboard.ts     system.ts     ui.ts         │
│  (ref<Device[]>, (statistics,   (health,      (sidebar,     │
│   loading,      loading,         loading,       theme,       │
│   error)        error)           error)         selection)   │
└──────┬──────────────────────┬────────────────────────────────┘
       │  DATA_MODE='backend' │  DATA_MODE='mock'
       ▼                      ▼
┌──────────────────┐  ┌──────────────────────┐
│  SERVICE LAYER   │  │   MOCK REPOSITORY    │
│ deviceService.ts │  │ mock/repository.ts   │
│ dashboardService │  │ mock/devices.ts      │
│ systemService.ts │  │ mock/statistics.ts   │
└────────┬─────────┘  └──────────────────────┘
         │
         ▼
┌──────────────────┐
│   API CLIENT     │
│ api/client.ts    │
│ (fetch, timeout, │
│  error handling) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ FASTAPI BACKEND  │
│ /api/devices     │
│ /api/dashboard   │
│ /api/ping        │
│ /api/system      │
└──────────────────┘
```

**Data mode switch**: `VITE_DATA_MODE` env var or `types/api.ts` → `DATA_MODE`.
Components never know which data source they consume.

---

### CSV Import System (v3.0.0)

```
User uploads CSV
       │
       ▼
┌──────────────────────────────────────┐
│ ImportDialog (5-step workflow)       │
│ Upload → Validate → Preview → Import │
│ → Result → Refresh                   │
└──────────────┬───────────────────────┘
               │ csvService.validate() / .importCsv()
               ▼
┌──────────────────────────────────────┐
│ Backend CSV Service                  │
│ ├── parse_csv()   — utf-8/gbk/sig   │
│ ├── validate_rows() — per-row check │
│ └── import_devices() — idempotent   │
└──────────────┬───────────────────────┘
               │ device_repository.create() / update()
               ▼
┌──────────────────────────────────────┐
│ assets.json (single source of truth) │
└──────────────────────────────────────┘
```

**Idempotency guarantee**: Duplicates detected by IP address.
Same CSV imported twice → first import creates devices, second import skips all.
`replace` mode updates existing devices in-place.
