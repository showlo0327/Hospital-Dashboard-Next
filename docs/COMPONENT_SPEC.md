# COMPONENT_SPEC

## Component Hierarchy

```
App
└── DefaultLayout
    ├── AppHeader
    ├── AppSidebar
    │   ├── BuildingTree → BuildingTreeNode
    │   └── ModuleNav
    ├── ContentContainer → RouterView
    │   └── Page (DashboardPage, AssetsPage, ...)
    │       └── WorkspaceHeader (specialization)
    │           └── BaseWorkspaceHeader (universal)
    │               ├── WorkspaceTitle
    │               ├── WorkspaceSubtitle
    │               ├── WorkspaceSearch
    │               └── WorkspaceActionGroup
    │                   ├── WorkspaceRefreshButton
    │                   ├── WorkspaceFilterButton
    │                   ├── WorkspaceViewSwitch
    │                   └── WorkspaceMoreButton
    └── InspectorPanel
```

## Base Component: BaseWorkspaceHeader

Universal workspace header reused by every page.

| Aspect | Detail |
|---|---|
| Props | `label`, `title`, `subtitle`, `searchEnabled`, `searchPlaceholder`, `refreshEnabled`, `filterEnabled`, `viewSwitchEnabled`, `moreMenuEnabled`, `view` |
| Emits | `update:view` |
| Slots | `leading`, `center`, `trailing`, `toolbar`, `status` |
| Specializations | WorkspaceHeader (Dashboard) |

## Component Inventory

### layout/
| Component | Status |
|---|---|
| AppHeader | ✅ |
| AppSidebar | ✅ |
| DefaultLayout | ✅ |
| ContentContainer | ✅ |
| InspectorPanel | ✅ Placeholder |

### dashboard/stats/
| Component | Maturity |
|---|---|
| DashboardStats | Production Ready | Derived from device repository (never hardcoded) |
| StatCard | Production Ready |
| StatIcon | Production Ready |
| StatNumber | Production Ready |
| StatSubtitle | Production Ready |
| TrendBadge | Stable |
| StatSkeleton | Production Ready |

### dashboard/workspace/
| Component | Maturity |
|---|---|
| BaseWorkspaceHeader | Production Ready |
| WorkspaceHeader | Production Ready |
| WorkspaceTitle | Production Ready |
| WorkspaceSubtitle | Production Ready |
| WorkspaceSearch | Stable |
| WorkspaceActionGroup | Production Ready |
| WorkspaceViewSwitch | Production Ready |
| WorkspaceRefreshButton | Stable |
| WorkspaceFilterButton | Stable |
| WorkspaceMoreButton | Stable |
| WorkspaceContainer | Placeholder |
| WorkspacePlaceholder | Skeleton |

### dashboard/inspector/ (Device Inspector System)

| Component | Maturity | Notes |
|---|---|---|
| DeviceInspector | Production Ready | Orchestrator: Header → Divider → 4 Sections → Footer |
| InspectorHeader | Production Ready | DeviceIcon + name/IP + status + more button |
| InspectorSection | Production Ready | Reusable titled section container |
| InspectorDivider | Production Ready | Thin horizontal rule |
| InspectorFooter | Stable | Placeholder for future actions |
| InspectorEmpty | Production Ready | Premium no-selection state |
| InspectorLoading | Production Ready | Pulsing skeleton for inspector |
| InspectorOverview | Production Ready | 8-field grid (name, IP, type, vendor, model, building, floor, location) |
| InspectorRealtime | Production Ready | Status + latency + availability + packet loss + health + updated |
| InspectorPingHistory | Production Ready | Large sparkline (60px) + avg latency summary |
| InspectorFutureModules | Stable | 6 placeholder links for future feature modules |

#### Inspector Hierarchy
```
InspectorPanel (fixed, right, 316px, independent scroll)
└── DeviceInspector
    ├── InspectorLoading               (loading=true)
    ├── InspectorEmpty                 (device=null)
    └── [device detail]
        ├── InspectorHeader            (icon + name + status + more)
        ├── InspectorDivider
        ├── InspectorOverview          (InspectorSection "Overview")
        ├── InspectorDivider
        ├── InspectorRealtime          (InspectorSection "Realtime Status")
        ├── InspectorDivider
        ├── InspectorPingHistory       (InspectorSection "Ping History")
        ├── InspectorDivider
        ├── InspectorFutureModules     (InspectorSection "Future Modules")
        └── InspectorFooter
```

#### Selection Architecture
```
useUIStore.selectedDeviceId
    ├── DashboardPage        → WorkspaceContainer → DeviceList/DeviceGrid (visual highlight)
    └── InspectorPanel       → computed selectedDevice → DeviceInspector (detail display)
```

### dashboard/common/
| Component | Status |
|---|---|
| NetworkWorkspace | ⬜ |

### assets/ (Asset Management System)

| Component | Maturity | Notes |
|---|---|---|
| AssetsPage | Production Ready | Orchestrator: Header + Toolbar + Filter + Table + Pagination |
| AssetsTable | Production Ready | 12-column sortable table, multi-select, sticky header |
| AssetsToolbar | Production Ready | Search + filter toggle + import/export |
| AssetsFilterPanel | Stable | 6 placeholder filter chips |
| AssetsBatchActions | Stable | Selected-count bar with Tag/Archive/Delete |
| AssetsRowActions | Stable | View/Edit/Delete per row |
| AssetsPagination | Production Ready | Page nav + item count, v-model currentPage |
| AssetsEmptyState | Production Ready | "Import CSV" premium empty state |
| ImportDialog | ⬜ Future | CSV import dialog |

#### Assets Data Flow
```
useDeviceStore (Pinia, from services/mock/repository)
    │
    └── AssetsPage
        ├── searchQuery (local ref, 8-field filter)
        ├── filteredDevices (computed)
        ├── paginatedDevices (computed, pageSize=20)
        └── AssetsTable
            ├── sortedDevices (computed, 12 sortable columns)
            ├── selectedIds (local Set)
            └── AssetsRowActions × N
```

### navigation/, shared/
(Unchanged from previous report)

### devices/ (Device Card Design System)

All components now use the centralized Device Type System (`types/device.ts`).
No component hardcodes device type strings.

| Component | Maturity | Notes |
|---|---|---|
| DeviceInfo | Production Ready | Base label+value primitive |
| DeviceIcon | Production Ready | Centralized icon map (16 DeviceTypes) |
| DeviceStatusBadge | Production Ready | Enum-keyed statusMap, 5 states |
| DeviceHeader | Production Ready | Name + IP row |
| DeviceVendor | Production Ready | Thin wrapper |
| DeviceModel | Production Ready | Thin wrapper |
| DeviceLocation | Production Ready | Building · Floor · Location |
| DeviceLatency | Production Ready | Typed DeviceStatus comparisons |
| DeviceHealthIndicator | Production Ready | Typed DeviceStatus comparisons |
| DeviceSparkline | Production Ready | 30-point SVG polyline, typed props |
| DeviceUpdatedTime | Stable | Simple display, ready for relative-time composable |
| DeviceActions | Stable | Slot-only, pure composition |
| DeviceSkeleton | Production Ready | Exact dimension match |
| DeviceCard | **Production Ready** | 4 states (Normal/Hover/Selected/Loading), typed, slot-extensible, 15 sub-props |

### Centralized Device Type System

**Location**: `types/device.ts` (319 lines)

| Export | Kind | Purpose |
|---|---|---|
| `DeviceCategory` | Enum | Network, Compute, Endpoint, Other |
| `DeviceType` | Enum | 16 device types with string values |
| `DeviceStatus` | Enum | Online, Warning, Offline, Maintenance, Unknown |
| `DeviceTypeMeta` | Interface | Metadata for every device type |
| `DEVICE_TYPE_META` | Record | Centralized metadata map |
| `getDeviceTypeMeta()` | Function | Retrieve metadata |
| `getDeviceDisplayName()` | Function | Enum → display name |
| `getDeviceCategory()` | Function | Enum → category |
| `getDeviceTypesByCategory()` | Function | Category → types[] |

#### Device Card Hierarchy
```
DeviceCard
├── DeviceIcon
├── DeviceHeader
├── DeviceStatusBadge
├── DeviceInfo (×1 — Type)
├── DeviceVendor → DeviceInfo
├── DeviceModel → DeviceInfo
├── DeviceLocation → DeviceInfo
├── DeviceLatency
├── DeviceHealthIndicator
├── DeviceSparkline
├── DeviceUpdatedTime
└── DeviceActions (slot-based)

#### DeviceCard States

| State | Visual |
|---|---|
| Normal | Glass card, subtle shadow, white/80% bg |
| Hover | 150ms lift (-0.5px Y), elevated shadow |
| Selected | Blue ring (primary/30), scale(1.01), elevated bg, blue shadow |
| Loading | Replaced by `DeviceSkeleton` — same dimensions, pulsing animation |

#### DeviceCard Props

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `device` | `Device` | required | Full device data |
| `selected` | `boolean` | `false` | Visual selected state (no logic) |

### devices/list/ (Device List System)

| Component | Maturity | Notes |
|---|---|---|
| DeviceList | Production Ready | Orchestrator — Header + Content + Footer |
| DeviceListHeader | Stable | Sticky column headers, ready for sort indicators |
| DeviceListItem | Production Ready | Table row composing 5 atomic sub-components |
| DeviceListContent | Production Ready | Scrollable body, ready for virtual-list swap |
| DeviceListEmpty | Production Ready | Zero-results state |
| DeviceListLoading | Production Ready | 8-row pulsing skeleton |
| DeviceListFooter | Stable | Device count + pagination placeholder |
| DeviceListVirtualPlaceholder | Experimental | Architecture anchor for future virtualization |

### devices/grid/ (Device Grid System)

| Component | Maturity | Notes |
|---|---|---|
| DeviceGrid | Production Ready | Responsive grid composing DeviceCard instances |
| DeviceGridSkeleton | Production Ready | 6-card skeleton grid delegating to DeviceSkeleton |

#### DeviceGrid Contract

```typescript
// Props
devices: Device[]        // required
loading?: boolean        // default: false
selectedId?: string      // default: undefined

// Slots
#empty                   // override default empty state
```

#### Grid Responsive Breakpoints

| Breakpoint | Columns | Card Width |
|---|---|---|
| < md | 1 | Full width |
| ≥ md (tablet) | 2 | ~528px each |
| ≥ xl (desktop) | 3 | ~348px each |

#### Device Grid Hierarchy
```
DeviceGrid
├── DeviceGridSkeleton           (loading: true, 6 × DeviceSkeleton)
├── [empty container]            (devices.length === 0)
└── DeviceCard × N               (responsive grid, gap-3)
```

#### DeviceList Contract

```typescript
// Props
devices: Device[]        // required
loading?: boolean        // default: false
selectedId?: string      // default: undefined

// Slots
#empty                   // override default empty state
```

#### Device List Hierarchy
```
DeviceList (orchestrator)
├── DeviceListVirtualPlaceholder  (future anchor)
├── DeviceListHeader              (sticky column headers)
├── DeviceListContent             (scrollable body)
│   └── DeviceListItem × N        (reuses DeviceIcon, DeviceHeader, StatusBadge, Latency, UpdatedTime)
├── DeviceListEmpty               (when devices.length === 0)
├── DeviceListLoading             (when loading === true)
└── DeviceListFooter              (count + pagination)
```

#### DeviceListItem Column Map

| Column | Width | Responsive | Component |
|---|---|---|---|
| Icon | 36px | Always | DeviceIcon (size 16) |
| Device | flex-[2] | Always | DeviceHeader (name + IP) |
| Type | 100px | ≥lg | getDeviceDisplayName() |
| Vendor | 90px | ≥xl | device.vendor |
| Location | 120px | ≥xl | building · floor |
| Status | 72px | Always | DeviceStatusBadge |
| Latency | 68px | Always | DeviceLatency |
| Updated | 80px | ≥sm | DeviceUpdatedTime |

#### DeviceCard Slots

| Slot | Purpose |
|---|---|
| `actions` | Inject custom action buttons into DeviceActions
```

#### Design Tokens Used
- `--radius-lg` (rounded-[22px] on card)
- `--color-card`, `--color-card-foreground`
- `--color-border`, `--color-muted`, `--color-muted-foreground`
- Status colors: `#34C759` (Online), `#FF9500` (Warning), `#FF3B30` (Offline), `#5E5CE6` (Maintenance)

#### Animation
- Card hover: 150ms, -translate-y-0.5, shadow elevation
- No entrance animations

---

## API Integration Layer (v2.11.0)

### Data Flow Architecture

```
DashboardPage.vue
├── useDeviceStore (Pinia)
│   ├── devices: Ref<Device[]>
│   ├── statistics: Computed<DeviceStatistics>
│   ├── loading: Ref<boolean>
│   ├── error: Ref<string | null>
│   ├── fetchAll(): Promise<void>
│   └── getById(id): Device | undefined
│
├── useDashboardStore (Pinia)
│   ├── statistics: Ref<DashboardStatisticsResponse | null>
│   ├── loading: Ref<boolean>
│   └── fetchStatistics(): Promise<void>
│
├── useSystemStore (Pinia)
│   ├── health: Ref<SystemHealthResponse | null>
│   └── checkHealth(): Promise<void>
│
└── useUIStore (Pinia)
    ├── selectedDeviceId: Ref<string | null>
    ├── sidebarCollapsed: Ref<boolean>
    └── dark: Ref<boolean>
```

### Mode Switching

| Env Var | `VITE_DATA_MODE` |
|---|---|
| `mock` | Uses mock repository (no backend required) |
| `backend` | Uses FastAPI backend at `VITE_API_BASE_URL` |

Set in `.env` or `.env.local`:
```
VITE_DATA_MODE=mock
VITE_API_BASE_URL=http://localhost:8000/api
```

### Component Maturity

| Component | Status |
|---|---|
| `apiClient` | Production Ready — timeout, error handling, envelope unwrapping |
| `deviceService` | Production Ready — mirrors backend API contract |
| `dashboardService` | Production Ready |
| `systemService` | Production Ready |
| `useDeviceStore` | Production Ready — dual-mode (mock/backend) |
| `useDashboardStore` | Production Ready |
| `useSystemStore` | Production Ready |
| `useAssetsStore` | Production Ready — search, filter, pagination, selection |
| `useAssets` composable | Production Ready — CRUD operations |
| `useDeviceSelection` composable | Production Ready |

---

## AddDeviceDialog (v3.1.0)

**Path**: `components/assets/AddDeviceDialog.vue`
**Maturity**: Production Ready

### Purpose
Manual single-device creation modal for daily hospital maintenance. Complement to bulk CSV Import.

### Props
None (self-contained, communicates via emits).

### Emits
- `close` — dialog dismissed
- `created(device: Device)` — device created successfully, parent handles refresh

### Fields
| Field | Required | Type | Validation |
|---|---|---|---|
| Device Name | Yes | text | Non-empty |
| IP Address | Yes | text | IPv4 regex + duplicate check |
| Device Type | Yes | select | Must not be Unknown |
| Vendor | No | text | — |
| Model | No | text | — |
| Building | No | text | — |
| Floor | No | text | — |
| Department | No | text | — |
| Location | No | text | — |
| Remark | No | textarea | — |

### States
- **Default**: Empty form with grouped device type selector
- **Validation**: Inline red borders + error messages on blur for required fields
- **Saving**: Loading spinner on submit button, button disabled
- **Error**: Red banner with error message
- **Success**: Emits `created`, parent closes dialog

### Design Tokens Used
- `.toolbar-primary` for the parent trigger button
- Consistent border-radius (15px/22px/28px)
- Shadow hierarchy matching ImportDialog

### Architecture Notes
- Calls `deviceStore.createDevice()` — follows the centralized data flow
- Mock mode: generates ID `D{maxId+1}`, sets status to Unknown, zeros for metrics
- Backend mode: calls `POST /api/devices`, then refreshes store
- No direct API calls — always through store
