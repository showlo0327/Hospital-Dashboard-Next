# CHANGELOG

## v2.15.0 — Authentication Framework (2026-07-10)

### Added
- **Auth Store** (`stores/auth.ts`): Pinia store with `isAuthenticated`, `user`, `token` state.
  - `login(username, password)` — Temporary auth (admin/admin123), persists to localStorage.
  - `logout()` — Clears state + localStorage.
  - `checkAuth()` — Restores state from localStorage on refresh.
- **Router Guard** (`router.beforeEach`):
  - Unauthenticated → redirect to `/login`.
  - Authenticated at `/login` → redirect to `/` (Dashboard).
  - All routes except `/login` are protected.
- **UserMenu**: Dropdown with username/role display + Logout button.
  - Logout clears auth, redirects to `/login`.

### Changed
- `LoginCard.vue` now calls `authStore.login()` instead of mock timeout.
  - Displays "Invalid username or password." error for wrong credentials.
- `UserAvatar.vue` → full dropdown menu with Logout action.
- `App.vue` login page detection uses route name `'login'`.

## v2.14.0 — Login Page (2026-07-10)

### Added
- **Login Page** — Rebuilt from Figma Make prototype as native Vue 3 components:
  - `LoginPage.vue` — Full-page login with grid background, glass orb decorations, hero section.
  - `LoginCard.vue` — Glass-morphism login card with:
    - Username/password fields with icon decorations
    - Password visibility toggle
    - Remember me checkbox
    - Forgot password link
    - Sign In button with loading spinner + success state
    - "NOC ACCESS" badge
    - Enterprise identity controls footer
  - `BrandMark.vue` — Reusable shield badge (blue gradient + ShieldCheck icon, 3 sizes).
- Route: `/login` → `LoginPage` (full-screen, no layout shell).

### Architecture
- Login page renders outside DefaultLayout (no header/sidebar).
- `App.vue` conditionally renders `RouterView` directly when route is `login`.

## v2.13.0 — Header UX Refinement (2026-07-10)

### Removed
- Global Refresh button from AppHeader (each page has its own refresh).
- Auto Refresh toggle from AppHeader (automatic refresh no longer part of header design).

### Added
- **Global Search** — functional header search across all device fields:
  - Device Name, IP, MAC, Vendor, Model, Building, Floor, Department, Location, Remark, Device Type.
  - Real-time filtering as you type.
  - Floating results panel grouped by device category (Network/Compute/Endpoint/Other).
  - Clicking a result selects the device, opens Dashboard Inspector, and navigates to Dashboard.
  - ESC or outside click closes the panel.
  - Architecture supports future entity registration (SNMP, Alarms, Reports, etc.).

### Changed
- AppHeader now contains only: Logo, Global Search, Current Time, Theme Toggle, User Avatar.

## v2.12.1 — Refresh Behavior Fix (2026-07-10)

### Fixed
- **P4 Refresh**: Every page now has its own working Refresh button with proper loading state.
  - Assets Refresh: reloads backend, preserves search/filter/page, clears batch selection.
  - Dashboard Refresh: reloads backend, preserves search/filter/active card, inspector auto-closes if needed.
  - Refresh button shows spinning animation during reload.

### Changed
- `WorkspaceRefreshButton` accepts `loading` prop for spin animation.
- `BaseWorkspaceHeader` accepts `refreshing` prop passed to Refresh button.
- Each page owns its own `refresh*()` async method (no shared fire-and-forget).

## v2.12.0 — Stabilization Batch 1 (2026-07-10)

### Fixed
- **P1 Import Dialog**: Removed click-outside-close; dialog only closes via X/Cancel/ESC.
- **P2 Assets Toolbar**: Removed redundant Export CSV button.
- **P3 Assets Filter**: Implemented real filter panel (Status/Type/Vendor/Building/Floor/Dept).
- **P4 Refresh**: Wired refresh buttons on Dashboard and Assets to call `fetchAll()`.
- **P5 Assets More Menu**: Removed non-functional More button.
- **P6 Batch Delete**: Implemented batch delete with confirmation dialog.
- **P7 Sidebar Import**: Removed duplicate Import CSV button from sidebar.
- **P8 Sidebar Buildings**: Buildings now read real data from deviceStore (no hardcoded demo).
- **P9 Dashboard Toolbar**: Implemented real search (v-model), filter toggle, sub-filters.
- **P10 Dashboard Sorting**: Online/Warning devices sorted by latency ascending.

### Changed
- Dashboard toolbar search now functional (Name/IP/MAC/Vendor/Model/Dept/Location).
- Dashboard filter dropdown supports Building/Floor/Department/DeviceType.
- WorkspaceRefreshButton emits `refresh` event through entire component chain.

## v2.11.4 — CSV Template Sync & Data Model Consistency (2026-07-10)

### Fixed
- **CSV template missing MAC Address**: Frontend `ImportDialog.vue` `downloadTemplate()` headers were stale.
  - Added `MAC` column between `IP` and `Vendor`.
  - Template now matches backend `CSV_COLUMNS` exactly.

### Consistency Audit (All Layers)

| Layer | Name | IP | MAC | Vendor | Model | Type | Building | Floor | Dept | Location | Remark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CSV Template (backend) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CSV Template (frontend) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CSV Import (backend) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Assets Table | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Add Device Dialog | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Backend Schema | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Frontend Device type | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Dashboard Inspector | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |

All 8 layers use the same field order: Name → IP → MAC → Vendor → Model → Type → Building → Floor → Department → Location → Remark.

---

## v2.11.3 — Schema Fix: Add Device "Extra inputs are not permitted" (2026-07-10)

### Fixed
- **Add Device regression**: Backend `DeviceCreateRequest` was missing the `remark` field.
  - Frontend store sends `remark` in the create payload
  - Backend Pydantic schema uses `extra: "forbid"` → rejected unknown fields with 422
  - Added `remark` to all three Pydantic schemas: CreateRequest, UpdateRequest, DeviceResponse

### Root Cause
After adding the MAC Address field (v2.10.0), the `remark` field was added to the frontend payload but never added to the backend Pydantic schema. The `model_config = {"extra": "forbid"}` setting caused Pydantic to reject any field not explicitly defined.

### Schema Alignment (After Fix)

| Field | CreateRequest | UpdateRequest | Response | Frontend Device |
|---|---|---|---|---|
| name | ✓ | ✓ | ✓ | ✓ |
| ip | ✓ | ✓ | ✓ | ✓ |
| mac | ✓ | ✓ | ✓ | ✓ |
| type | ✓ | ✓ | ✓ | ✓ |
| vendor | ✓ | ✓ | ✓ | ✓ |
| model | ✓ | ✓ | ✓ | ✓ |
| building | ✓ | ✓ | ✓ | ✓ |
| floor | ✓ | ✓ | ✓ | ✓ |
| department | ✓ | ✓ | ✓ | ✓ |
| location | ✓ | ✓ | ✓ | ✓ |
| remark | ✓ | ✓ | ✓ | — (optional) |
| status | ✓ | ✓ | ✓ | ✓ |
| latency | ✓ | ✓ | ✓ | ✓ |

---

## v2.11.2 — P0 Bug Fix: Data Integrity & Error Handling (2026-07-10)

### Fixed
- **P0 #1 — Demo data overwrite**: Store no longer eagerly loads mock devices at module init.
  - On startup, store stays EMPTY — no data until `fetchAll()` explicitly determines the source.
  - Backend is always tried FIRST; mock is only a LAST-RESORT fallback.
  - In backend mode: `assets.json` → Repository → API → Store → UI (15 devices, no mock injection).
  - Mock data (43 devices) only loads when backend is confirmed unreachable.

- **P0 #2 — Import dialog `[object Object]` error**: API client now handles FastAPI validation errors properly.
  - FastAPI returns `detail` as array of `{loc, msg, type}` objects for validation errors.
  - `apiClient` now joins array messages with `; ` separator instead of exposing raw objects.
  - Never displays `[object Object]` — always shows human-readable error text.

### Changed
- `stores/devices.ts`: Eager init removed; `fetchAll()` always sets loading state
- `api/client.ts`: Non-string error details serialized to readable messages

---

## v2.11.1 — Location Path Display Optimization (2026-07-10)

### Fixed
- **Location Path truncation**: Changed from `truncate` (single-line, aggressive ellipsis) to `line-clamp-2` (up to 2 lines)
  - Full paths like `门诊楼 › 1F › 急诊科 › 203诊室` now display completely
  - Ellipsis only at the very end when 2 lines are insufficient
  - Tooltip always shows complete path

### Changed
- **Internal spacing optimized** to compensate for potential extra line:
  - Secondary info grid: `gap-y-1` → `gap-y-0.5`
  - Metrics box: `p-2.5 mt-2.5` → `px-2.5 py-2 mt-2`
  - Footer: `mt-2.5` → `mt-2`
- Card height remains stable — content determines natural height

---

## v2.11.0 — Dashboard UI Polish: Device Card Information Hierarchy (2026-07-10)

### Changed
- **DeviceHeader typography**: 3-level hierarchy following Apple HIG
  - Level 1: Device Name — 17px semibold, primary color
  - Level 2: IP Address — 13px JetBrains Mono, secondary color
  - Level 3: Location Path — 12px muted (75% opacity), single line, ellipsis + tooltip
- **DeviceCard layout**: Location Path now appears directly below IP Address
  - Removed Location from the secondary info grid
  - Secondary grid now shows: Type | Vendor | Model only
  - `formatDeviceLocation()` used directly (no intermediate component)
- **Spacing**: Increased vertical rhythm between name/IP/location for breathability
- Card height preserved — no layout jumping

### Removed
- `DeviceLocation.vue` no longer used in DeviceCard (functionality replaced by `formatDeviceLocation()`)
  - Component file kept for future reuse

---

## v2.10.1 — Unified Location Path Standard (2026-07-10)

### Changed
- **Location separator**: Replaced `·` with `›` for hierarchical location display
  - Format: `Building › Floor › Department › Location`
  - Example: `门诊楼 › 1F › 急诊科 › 203诊室`
- **New utility**: `frontend/src/utils/location.ts`
  - `formatLocationPath(parts)` — reusable location formatter
  - `formatDeviceLocation(device)` — convenience wrapper for Device objects
  - `LOCATION_SEPARATOR` — exportable constant
  - Future-proof: supports optional `campus` field for Campus expansion
- **DeviceLocation.vue**: Uses formatter, added `title` tooltip with full path, truncation via CSS
- **DeviceListItem.vue**: Uses `formatDeviceLocation` instead of manual concatenation

### Design
- Single `<span class="truncate" :title="...">` pattern for consistent truncation + tooltip
- No duplicated formatting logic anywhere in the project

---

## v2.10.0 — Data Model Upgrade: MAC Address & Location Format (2026-07-10)

### Added
- **MAC Address field**: Added `mac` to Device data model across entire stack
  - Backend: Pydantic schemas (DeviceCreateRequest, DeviceUpdateRequest, DeviceResponse)
  - Frontend: Device interface, DeviceCreatePayload, API types
  - assets.json: All 15 devices now include MAC address
  - Assets Table: New MAC Address column after IP Address
  - AddDeviceDialog: MAC field with format validation (AA:BB:CC:DD:EE:FF)
  - CSV Import: MAC column in template, parsing, and import workflow
  - Dashboard Inspector: MAC Address displayed in Overview section

### Changed
- **Location format**: Updated from `Building · Floor · Location` to `Building · Floor · Department · Location`
  - DeviceCard: DeviceLocation now displays Department
  - InspectorOverview: Department field added between Floor and Location
  - DeviceLocation component: New `department` prop, consistent format everywhere
- AssetsTable column order: Device Name → IP Address → **MAC Address** → Vendor → Model → Device Type → Building → Floor → Department → Location → Remark
- Backend CSV service: Updated CSV_COLUMNS, example rows, and device_data to include MAC

### Fixed
- AssetsTable Remark column key (was incorrectly bound to `name` key, now uses `remark`)

---

## v2.0.0 — Application Foundation (2026-07-09)

### Added
- **Header**: Full-width glassmorphism header (64px), app title, global search, toolbar buttons
- **Sidebar**: Collapsible sidebar (260px/72px), BuildingTree, ModuleNav with 8 router-linked modules
- **Application Layout**: Permanent shell with Header, Sidebar, ContentContainer, InspectorPanel
- **Design Tokens**: CSS custom properties + TypeScript constants for all layout dimensions
- **Router**: Vue Router 4 with hash history, 8 lazy-loaded routes
- **Dashboard Foundation**: Stats placeholder, WorkspaceHeader, WorkspaceContainer, WorkspacePlaceholder
- **Shared Components**: LayoutSwitch, ThemeToggle, GlobalSearch, RefreshButton, AutoRefreshToggle, FilterButton, CurrentTime, UserAvatar
- **Navigation Components**: BuildingTree, BuildingTreeNode, ModuleNav

### Changed
- Reorganized components into scalable architecture (dashboard/{stats,workspace,inspector,common}, navigation/, settings/)
- All hardcoded dimensions replaced with design tokens

## v2.1.0 — Dashboard Statistics (2026-07-09)

### Added
- **StatIcon**: Colored icon container with toneClass binding
- **StatNumber**: Large value display with CountUp-ready slot
- **StatSubtitle**: Meta text below stat value
- **TrendBadge**: Directional trend indicator (up/down/neutral)
- **StatCard**: Glass card composing StatIcon + label + StatNumber + StatSubtitle, 150ms hover lift
- **StatSkeleton**: Pulsing loading placeholder matching StatCard dimensions
- **DashboardStats**: 5 production StatCards in responsive grid, typed mock data

## v2.2.0 — Workspace Header (2026-07-09)

### Added
- **WorkspaceTitle**: Reusable page label + heading (any workspace page)
- **WorkspaceSubtitle**: Descriptive meta text below title
- **WorkspaceSearch**: Placeholder for future global device search (Name, IP, Vendor, Model, Building, Floor, Location, Type, SN, Remarks)
- **WorkspaceActionGroup**: Slot-based button container with consistent spacing
- **WorkspaceViewSwitch**: Segmented List/Grid toggle (the exclusive layout switch)
- **WorkspaceRefreshButton**: Toolbar button with RefreshCw icon, mock click animation
- **WorkspaceFilterButton**: Placeholder for future filter popup (Status, Vendor, Building, Floor, Type)
- **WorkspaceMoreButton**: Ellipsis button placeholder (Export, Import, Bulk Ops, Settings)

### Changed
- **WorkspaceHeader**: Decomposed into 8 atomic sub-components with three-zone layout (Left | Center | Right)
- Removed duplicate LayoutSwitch usage — WorkspaceViewSwitch is now the exclusive view toggle

## v2.2.1 — Workspace Header Architecture (2026-07-09)

### Added
- **BaseWorkspaceHeader**: Universal configurable header — props (label, title, subtitle, 5 boolean toggles), emits (update:view), slots (leading, center, trailing, toolbar, status)
- **Reusable Component Contract**: Every reusable component now documents props, emits, slots, accessibility, design tokens, and extension notes

### Changed
- **WorkspaceHeader**: Refactored into thin specialization of BaseWorkspaceHeader (Dashboard-specific defaults)
- **WorkspaceSearch**: Now accepts configurable `placeholder` prop (default: "Search workspace...")
- **CODING_RULES.md**: Added Reusable Component Contract section
- **COMPONENT_SPEC.md**: Updated hierarchy to show BaseWorkspaceHeader → specializations
- **ARCHITECTURE.md**: Added Workspace Header Hierarchy diagram

### Impact
- Zero visual change — identical rendering verified
- All 8 future pages (Assets, SNMP, Topology, etc.) can now use BaseWorkspaceHeader with custom props
- Slots enable page-specific custom controls without forking the header

## v2.3.0 — Device Card Design System (2026-07-09)

### Added
- **DeviceInfo**: Base label + value primitive with wide/col-span-2 option
- **DeviceIcon**: Device-type icon container with Lucide icon map (15 DeviceTypes)
- **DeviceStatusBadge**: Status pill with dot indicator — 5 states (Online/Warning/Offline/Maintenance/Unknown)
- **DeviceHeader**: Name (15px semibold) + IP (11px mono) row
- **DeviceVendor**: Thin wrapper around DeviceInfo
- **DeviceModel**: Thin wrapper around DeviceInfo
- **DeviceLocation**: Formatted building · floor · location (wide col-span-2)
- **DeviceLatency**: Color-coded latency with traffic-light thresholds
- **DeviceHealthIndicator**: Availability % with colored dot
- **DeviceSparkline**: SVG polyline sparkline (30 points, no axes, status-colored)
- **DeviceUpdatedTime**: "Updated {time}" muted text
- **DeviceActions**: Slot-based action button container
- **DeviceSkeleton**: Pulsing loading placeholder matching DeviceCard dimensions
- **DeviceCard**: Glass composite card composing all 13 sub-components
- **Device types**: Full `Device`, `DeviceType`, `DeviceStatus` TypeScript definitions

### Changed
- `types/device.ts` — Populated with complete device data model
- `types/index.ts` — Added device type exports

## v2.3.1 — Centralized Device Type System (2026-07-09)

### Added
- **`DeviceCategory` enum**: Network, Compute, Endpoint, Other
- **`DeviceType` enum**: 16 strongly-typed device types (replaces raw strings)
- **`DeviceTypeMeta` interface**: Per-type metadata (displayName, category, badgeColor, description, futureExtensionNotes)
- **`DEVICE_TYPE_META` record**: Centralized metadata map with full entries for every type
- **Helper functions**: `getDeviceTypeMeta()`, `getDeviceDisplayName()`, `getDeviceCategory()`, `getDeviceTypesByCategory()`

### Changed
- **`DeviceType`**: Converted from string union to enum (was `'Core Switch' | ...`, now `DeviceType.CoreSwitch`)
- **`DeviceStatus`**: Converted from string union to enum
- **`DeviceIcon.vue`**: Icon map now references `DeviceType` enum keys (exhaustive: covers all 16 types)
- **`DeviceCard.vue`**: Uses `getDeviceDisplayName()` for type display
- **`DeviceLatency.vue`**: Status comparisons now use `DeviceStatus` enum
- **`DeviceHealthIndicator.vue`**: Status comparisons now use `DeviceStatus` enum

### Impact
- **No visual changes** — all display names unchanged
- **Breaking**: Old string-type devices (e.g. `type: 'Core Switch'`) must migrate to enum (`type: DeviceType.CoreSwitch`)
- All new device types require 1 line in `DEVICE_TYPE_META` + 1 line in `DeviceIcon.vue` icon map

## v2.3.2 — Device Card Finalization (2026-07-09)

### Added
- **Selected state**: Blue ring (primary/30), scale(1.01), elevated blue shadow
- **Mock data**: 16 devices covering all DeviceTypes in `composables/useDevices.ts`
- **DeviceCard props**: `selected` boolean (default false, visual-only, no selection logic)

### Changed
- **`sparklineColor()`**: Now uses `DeviceStatus` enum (was raw strings)
- **`DeviceStatusBadge.statusMap`**: Now keyed by `DeviceStatus` enum (was raw strings)
- **DeviceCard maturity**: Stable → **Production Ready**

### Fixed
- All type comparisons now use enum values, eliminating magic strings

## v2.4.0 — Device List System (2026-07-09)

### Added
- **DeviceList**: Orchestrator — Header + Content/Empty/Loading + Footer
- **DeviceListHeader**: Sticky column headers (8 columns), responsive visibility
- **DeviceListItem**: Table row composing 5 atomic sub-components (DeviceIcon, DeviceHeader, DeviceStatusBadge, DeviceLatency, DeviceUpdatedTime)
- **DeviceListContent**: Scrollable list body, ready for virtual-list swap
- **DeviceListEmpty**: Zero-results state with icon + message
- **DeviceListLoading**: 8-row pulsing skeleton matching exact column layout
- **DeviceListFooter**: Device count + pagination placeholder
- **DeviceListVirtualPlaceholder**: Architecture anchor for future virtual scrolling
- **Expanded mock data**: 23 devices (was 16), all DeviceTypes covered

### Changed
- **WorkspaceContainer**: Now renders real DeviceList in list view (was WorkspacePlaceholder)
- **DashboardPage**: Wires mock devices from `useDevices()` into WorkspaceContainer
- **useDevices**: Expanded from 16 to 23 devices (+7 Endpoint/Network/Other)

### Architecture
- DeviceList reuses atomic sub-components — zero UI duplication
- DeviceCard is reserved for Grid View (next module)
- 8-column responsive layout: columns hide progressively (lg → xl → sm breakpoints)
- `selectedId` prop enables visual highlighting without selection logic

## v2.5.0 — Device Grid System (2026-07-09)

### Added
- **DeviceGrid**: Responsive grid composing DeviceCard instances (1/2/3 columns)
- **DeviceGridSkeleton**: 6-card skeleton grid delegating to DeviceSkeleton
- **Grid empty state**: Reuses same visual language as list empty state

### Changed
- **WorkspaceContainer**: Grid view now renders real DeviceGrid (was WorkspacePlaceholder)
- **Workspace View Switch**: List ↔ Grid switching now fully functional with live data

### Architecture
- Network Workspace presentation layer complete — both List and Grid views live
- DeviceCard reused unchanged across grid — zero forking
- DeviceGridSkeleton delegates to DeviceSkeleton — zero duplicated skeleton logic
- Same `devices[]` array drives both views simultaneously

## v2.6.0 — Device Inspector System (2026-07-09)

### Added
- **DeviceInspector**: Full detail panel orchestrator (12 sub-components)
- **InspectorHeader**: DeviceIcon + name/IP + status badge + more button
- **InspectorSection**: Reusable collapsible section container
- **InspectorDivider**: Thin horizontal rule
- **InspectorFooter**: Placeholder for future actions
- **InspectorEmpty**: Premium no-selection state with centered icon
- **InspectorLoading**: Pulsing skeleton for inspector panel
- **InspectorOverview**: 8-field grid with all device identification
- **InspectorRealtime**: Live metrics (status, latency, availability, packet loss, health, updated)
- **InspectorPingHistory**: Large 60px sparkline + avg latency summary
- **InspectorFutureModules**: 6 placeholder links for future feature modules
- **`selectedDeviceId`** in UI store
- **Mock selection**: First device auto-selected on Dashboard mount

### Changed
- **InspectorPanel**: Rewritten — now hosts DeviceInspector with real device data
- **DashboardPage**: Passes `selectedId` through to WorkspaceContainer
- **UI store**: Added `selectedDeviceId`, `selectDevice()`, `clearSelection()`

### Architecture
- Inspector scrolls independently from workspace
- Selection flows through Pinia store → DashboardPage → WorkspaceContainer → DeviceList/DeviceGrid
- Same `Device` type drives inspector as list/grid — zero type duplication
- Inspector reuses DeviceIcon, DeviceStatusBadge, DeviceLatency, DeviceHealthIndicator, DeviceSparkline, DeviceInfo

## v2.7.0 — Mock Data Integration Layer (2026-07-09)

### Added
- **`services/mock/`**: Centralized mock data layer (4 files, 43 devices)
- **`types.ts`**: `DeviceRepository` interface, `DeviceStatistics` type
- **`devices.ts`**: 43 realistic hospital devices across 4 campuses (Main Campus 20, Emergency 5, Outpatient 6, Branch A 4, Branch B 4, Branch C 3)
- **`statistics.ts`**: Derived statistics — total, online, offline, warning, average latency (computed, never hardcoded)
- **`repository.ts`**: `MockDeviceRepository` singleton implementing `DeviceRepository` interface
- **`stores/devices.ts`**: Pinia store consuming repository (computed devices + statistics + getById)

### Changed
- **DashboardStats**: Now derives from `useDeviceStore().statistics` (was hardcoded)
- **DashboardPage**: Consumes `useDeviceStore().devices` (was `useDevices()` composable)
- **InspectorPanel**: Uses `useDeviceStore().getById()` (was `useDevices()` composable)

### Removed
- **`composables/useDevices.ts`**: Replaced by `services/mock/` + `stores/devices.ts`

### Architecture
- Single source of truth: `services/mock/devices.ts`
- Repository pattern: `MockDeviceRepository` → future `ApiDeviceRepository` (zero consumer changes)
- Derived data: dashboard statistics computed from device list, never manual
- All 3 consumers (Stats, List/Grid, Inspector) share one Pinia store

## v2.8.0 — Assets Module (2026-07-09)

### Added
- **AssetsPage**: Full master data page — orchestrates Header + Toolbar + Filter + Batch Actions + Table + Pagination
- **AssetsTable**: 12-column sortable table with multi-select, select-all, sticky header, 12 sort keys
- **AssetsToolbar**: Search input (8-field filter) + filter toggle + import/export buttons
- **AssetsFilterPanel**: Placeholder filter chips (Status, Vendor, Building, Floor, Department, Type)
- **AssetsBatchActions**: Selection bar with Tag/Archive/Delete/Clear
- **AssetsRowActions**: View (→ Inspector), Edit, Delete per-row buttons
- **AssetsPagination**: Reusable pagination with page nav + item count display
- **AssetsEmptyState**: "Import CSV" premium empty state

### Architecture
- Assets consumes centralized device repository (useDeviceStore) — zero duplicate data
- Client-side search filters 8 fields (name, IP, vendor, model, building, floor, department, location)
- Client-side sort supports 12 keys (via computed)
- Client-side pagination (pageSize=20)
- View action calls ui.selectDevice() → Inspector integration
- Reuses BaseWorkspaceHeader with custom label/title/subtitle

## v2.8.0 — Backend API Layer (2026-07-09)

### Added
- **Three-layer architecture**: Router → Service → Repository → assets.json
- **`core/config.py`**: Centralized config (host, port, CORS, data paths)
- **`models/enums.py`**: Shared enums — DeviceType, DeviceStatus, DeviceCategory, Health
- **`schemas/device.py`**: Pydantic models — DeviceCreateRequest, DeviceUpdateRequest, DeviceResponse, DeviceListResponse
- **`schemas/dashboard.py`**: DeviceStatisticsResponse, DashboardResponse
- **`schemas/common.py`**: APIResponse wrapper, ErrorResponse, HealthResponse
- **`repositories/device_repository.py`**: Thread-safe JSON file repository (sole reader/writer of assets.json)
- **`services/device_service.py`**: Business logic — CRUD + auto ID generation
- **`services/dashboard_service.py`**: Derived statistics — computed, never hardcoded
- **`api/devices.py`**: GET/POST/PUT/DELETE /api/devices
- **`api/dashboard.py`**: GET /api/dashboard/statistics
- **`api/system.py`**: GET /api/system/health
- **`api/router.py`**: Aggregates all sub-routers under /api
- **`main.py`**: FastAPI app entry point with CORS + global error handler
- **`data/assets.json`**: 15 production devices

### Architecture
```
Router (api/)         — HTTP handlers, no business logic
    ↓
Service (services/)   — Business logic, validation
    ↓
Repository (repositories/) — Data access, only layer touching assets.json
    ↓
assets.json           — Flat-file device storage
```

No direct file access outside Repository. No business logic in routers.

## v2.9.0 — Ping Engine (2026-07-09)

### Added
- **PingWorker**: Background ping engine with ThreadPoolExecutor (50 workers, 30s scan interval, 2s timeout)
- **StatusCalculator**: Anti-flap state machine (5 failures → Offline, 3 successes → recovery, no flapping)
- **HealthCalculator**: Rolling average latency (last 5 successful pings), availability%, packet loss%
- **DeviceState**: Per-device runtime state with 20-result history deque
- **StatisticsCache**: Aggregated stats refreshed per scan cycle
- **Ping Schemas** (`schemas/ping.py`): `PingResultResponse`, `DevicePingStateResponse`, `PingStatisticsResponse`, `PingStatusListResponse`
- **Ping API** (`api/ping.py`): `GET /api/ping/status/{id}`, `GET /api/ping/status`, `GET /api/ping/statistics`
- **FastAPI lifespan**: ping_engine.start() on startup, ping_engine.stop() on shutdown
- **ping3** added to requirements.txt (4.0.8)

### Fixed
- Singleton instantiation bug: `PingEngine()` → `PingWorker()` (class name mismatch)

### Changed
- main.py: migrated from `@app.on_event` to `@asynccontextmanager` lifespan (modern FastAPI pattern)
- api/router.py: added ping router
- Version bumped to 2.9.0

### Architecture
- Three-layer backend: Router → Service (PingWorker) → Repository → assets.json
- "Recovering" is a runtime-only state (not a DeviceStatus enum value)
- All status transitions are anti-flap: no false Online/Offline toggling

## v2.10.0 — Centralized Configuration System (2026-07-09)

### Added
- **system_config.json**: Single source of truth for all operational parameters (ping, csv, snmp, ui)
- **SystemConfig class** (`core/config.py`): Typed dataclass hierarchy — `PingConfig`, `CsvConfig`, `SnmpConfig`, `UiConfig`
- **Dynamic config reload**: `PingWorker._refresh_config()` re-reads config at start of every scan cycle
- **Config defaults**: Hard fallback constants for every parameter — works even if system_config.json is missing

### Changed
- **PingWorker**: All parameters now read from `system_config.ping` — zero hardcoded constants
- **StatusCalculator.compute**: Now accepts `offline_threshold` and `recovery_threshold` as parameters
- **HealthCalculator.compute**: Now accepts `latency_window` as a parameter
- **DeviceState**: History deque maxlen set dynamically from config at creation time

### Removed
- Module-level constants block in `ping_engine.py` (HISTORY_SIZE, LATENCY_WINDOW, OFFLINE_THRESHOLD, etc.)

### Architecture
- Future Settings page can update `system_config.json` via the Backend API — Ping Engine picks up changes on next scan cycle
- All future modules (CSV, SNMP, UI) configured through the same centralized system

## v2.11.0 — Frontend API Integration (2026-07-09)

### Added
- **API Client** (`api/client.ts`): Centralized fetch-based HTTP client — base URL, timeout (10s), JSON serialization, error unwrapping, `ApiClientError` class, AbortController support
- **API Endpoints** (`api/endpoints.ts`): Single source of truth for all backend route paths (devices, dashboard, ping, system)
- **Device Service** (`services/deviceService.ts`): `getAll()`, `getById()`, `create()`, `update()`, `remove()`
- **Dashboard Service** (`services/dashboardService.ts`): `getStatistics()`
- **System Service** (`services/systemService.ts`): `getHealth()`
- **Dashboard Store** (`stores/dashboard.ts`): Cached statistics with mock/backend mode switch
- **System Store** (`stores/system.ts`): Health check with mock/backend mode switch
- **Assets Store** (`stores/assets.ts`): Search, filter, pagination, batch selection state
- **useAssets composable** (`composables/useAssets.ts`): Device CRUD operations — `createDevice()`, `updateDevice()`, `deleteDevice()`
- **useDeviceSelection composable** (`composables/useDeviceSelection.ts`): Selected device reactive state
- **API types** (`types/api.ts`): `APIResponse<T>`, `DeviceCreatePayload`, `DeviceUpdatePayload`, `DashboardStatisticsResponse`, `SystemHealthResponse`, `DATA_MODE` flag
- **Environment variable**: `VITE_DATA_MODE` ('mock' | 'backend') and `VITE_API_BASE_URL`

### Changed
- **devices store** (`stores/devices.ts`): Refactored from synchronous `computed` to reactive `ref` + `fetchAll()`; supports both mock (eager init) and backend (async fetch) modes
- **Mock repository** (`services/mock/repository.ts`): Added `create()`, `update()`, `delete()` methods; `getById()` now uses in-memory lookup
- **Mock types** (`services/mock/types.ts`): `DeviceRepository` interface extended with `create`, `update`, `delete`
- **types/index.ts**: Now exports all API types alongside device types

### Architecture
```
Vue Component → Pinia Store → Service Layer → API Client → FastAPI Backend
                                                    ↓ (DATA_MODE='mock')
                                              Mock Repository
```
DATA_MODE switch in `types/api.ts` controls the entire data pipeline.
Components remain unchanged — they consume the same store API regardless of mode.

## v2.11.1 — UI Bug Fixes (2026-07-09)

### Fixed

**Bug #1 — Sidebar scroll isolation**
- Sidebar refactored to `flex-col` layout: scrollable nav area + pinned Import CSV button
- `overflow-y-auto` on sidebar with `overscroll-contain` prevents body scroll bleed
- Thin scrollbar (4px) appears on hover for discoverability
- Header, Sidebar, Main Content, and Inspector each scroll independently — no cross-contamination

**Bug #2 — Collapse button works consistently**
- Button calls `ui.toggleSidebar()` which toggles `sidebarCollapsed` ref
- Sidebar width transitions from 260px ↔ 72px with `duration-200 ease-in-out`
- Main content `padding-left` responds to `sidebarCollapsed` — no layout jump

**Bug #3 — Collapse button redesign**
- Replaced full-width "Collapse" button with VS Code-style circular button
- Positioned at `-right-3 top-[10px]` — overlaps the sidebar right edge
- `h-8 w-8` (32×32px) with `rounded-full`, glass background, shadow
- Hamburger icon (`Menu`) when collapsed, `ChevronLeft` when expanded
- `title` attribute on button shows tooltip text in both states

**Bug #4 — Stat icon sizes**
- `StatIcon` container increased from `size-8` (32px) to `size-9` (36px) — 12.5% increase
- Icon `size` increased from `15` to `19` — 27% increase
- Icons now have stronger visual presence while keeping card height unchanged

### Changed
- `DefaultLayout.vue`: Added `ease-in-out` to main content padding transition
- `InspectorPanel.vue`: Added `overscroll-contain`, matched 200ms transition
- `AppSidebar.vue`: Complete refactor — flex layout, VS Code collapse button, scroll isolation
- `StatIcon.vue`: Larger icon container and icon size

## v3.0.0 — CSV Import System (2026-07-09)

### Added
- **CSV Import Service** (`backend/app/services/csv_service.py`): Full workflow — parse, validate, duplicate detection, idempotent import
- **CSV Schemas** (`backend/app/schemas/csv.py`): `CsvRowValidation`, `CsvValidationResponse`, `CsvImportRequest`, `CsvImportSummary`, `CsvTemplateInfo`
- **CSV API** (`backend/app/api/csv.py`): `POST /api/csv/validate`, `POST /api/csv/import`, `GET /api/csv/template`, `GET /api/csv/template/info`
- **CSV Template**: Downloadable CSV with headers and 5 example rows covering CoreSwitch, Server, Firewall, WirelessAP, DesktopPC
- **ImportDialog** (`frontend/src/components/assets/ImportDialog.vue`): 5-step workflow — Upload → Validate → Preview → Import → Result
- **CSV Service** (`frontend/src/services/csvService.ts`): Frontend API layer with mock fallback
- **CSV Types** (`frontend/src/types/csv.ts`): TypeScript interfaces for validation/import

### Idempotency
- Duplicate detection by IP address (case-insensitive)
- `skip` mode: existing IPs are skipped (never creates duplicates)
- `replace` mode: existing IPs are updated in-place
- Repeated imports produce consistent results

### Validation
- Missing Name / IP → error
- Invalid IPv4 → error
- Duplicate IP within CSV → error
- Unknown DeviceType → warning
- IP already in system → warning
- Multiple encoding support: utf-8, utf-8-sig, gbk

### Changed
- `AssetsPage.vue`: Wired Import button to ImportDialog
- `backend/app/api/router.py`: Added CSV router
- Bumped version to 3.0.0 (major feature milestone)

### Post-Import
- Auto-refresh device store → Dashboard, Device List/Grid, Inspector update
- Ping engine picks up new devices on next scan cycle (30s)

## v3.0.1 — Project Review & Stabilization (2026-07-09)

### Fixed
- **Stale import**: Removed unused `getDeviceById` import from `mock/repository.ts`
- **Stale type exports**: Removed no-op `export type {} from './asset'` and `'./building'` from `types/index.ts`
- **Accessibility**: Added `aria-label="Import CSV"` to the pinned Import button in AppSidebar (was missing in expanded state)

### Identified for Cleanup (manual)
- **10 dead frontend components**: `DeviceListRow`, `MiniPingChart`, 5 `Detail*` inspector variants, `NetworkWorkspace`, `StatsCards`, `DeviceDetailPanel` — empty placeholders, never imported
- **11 dead backend files**: `api/assets.py`, `api/buildings.py`, `api/stats.py`, `core/database.py`, `models/asset.py`, `models/building.py`, `models/device.py`, `schemas/asset.py`, `services/asset_service.py`, `services/building_service.py`, `services/seed_data.py` — scaffolding never implemented
- **6 dead utilities/composables**: `useBuildings.ts`, `usePingRefresh.ts`, `useTheme.ts`, `cn.ts`, `formatters.ts`, `services/api.ts` — empty files from initial scaffolding

### Architecture
- All existing components verified: no bypass of store layer, no direct fetch(), no duplicated logic
- Ping engine properly manages ThreadPoolExecutor lifecycle via FastAPI lifespan
- No `setInterval` without `clearInterval` — no memory leak risk
- All scroll zones are independent (Header, Sidebar, Content, Inspector)

## v3.0.2 — Feature Wiring (2026-07-09)

### Fixed
- **Sidebar Import CSV button**: Now wired to navigate to Assets and auto-open the Import dialog
- **Placeholder pages**: All 6 unimplemented pages now use consistent "Coming Soon" design with icon + description + planned version badge

### Changed
- `stores/ui.ts`: Added `importDialogRequested` flag + `requestImportDialog()` / `clearImportDialogRequest()` actions
- `components/layout/AppSidebar.vue`: Import CSV button now triggers `router.push('assets')` + opens dialog
- `pages/AssetsPage.vue`: Watches `importDialogRequested` flag, opens ImportDialog on Sidebar trigger
- `pages/SnmpPage.vue`, `TopologyPage.vue`, `InspectionPage.vue`, `AlarmsPage.vue`, `ReportsPage.vue`, `SettingsPage.vue`: Upgraded "Coming Soon" placeholders

### Verified
- All 8 routes wired correctly
- ModuleNav → Router name mapping verified (dashboard, snmp, topology, assets, inspection, alarms, reports, settings)
- All pages render inside DefaultLayout (Header + Sidebar + Inspector)
- Import CSV workflow: Sidebar button → Assets page → Dialog open → full workflow
- No blank pages, no dead buttons

## v3.0.3 — Critical Bug Fix (2026-07-09)

### Fixed
- **Bug #1 — Assets page blank**: `AssetsTable.vue` was using `defineProps<{...}>()` without assigning to `const props`. This caused `[...props.devices].sort()` to throw `TypeError: Cannot read properties of undefined (reading 'devices')` at runtime. Fixed by adding `const props =` assignment on line 20.
- **Bug #2 — Import CSV button unresponsive**: Caused by the same `AssetsTable` crash — even though the watcher in `AssetsPage` fired correctly, the table error caused the page to fail to render. Fixed by Bug #1 resolution.
- **Bug #3 — Pages blank after navigation**: Caused by `AssetsTable` throwing during component setup when navigated to, making the page appear blank. Other pages were unaffected — the perceived "spreading blank" was the user seeing the broken page state. Fixed by Bug #1 resolution.

### Root Cause Analysis
- **Single root cause**: `AssetsTable.vue:20` — `defineProps<{ devices: Device[] }>()` was not assigned to a variable, but the script section referenced `props.devices` at lines 50, 69, 76.
- **Why vue-tsc missed it**: TypeScript only checked template bindings where props are auto-available by name. The script section is plain JavaScript where `props` is a free variable.
- **Verified no other components affected**: Full scan of all 42+ `defineProps` usages confirmed only `AssetsTable.vue` had this bug.

### Verified
- `vue-tsc --noEmit`: 0 errors ✓
- `vite build`: clean ✓
- Full scan: no other `props.` usage without `const props =` assignment ✓

## v3.1.0 — Bug Fix & Add Device (2026-07-09)

### Fixed
- **CSV Template Download**: Replaced `window.open()` with client-side blob-based download (`Blob` + `URL.createObjectURL`). Template now downloads as a proper `.csv` file on any platform.
- **Import Dialog Close Button**: Added explicit `type="button"` attribute to the header close button to prevent any default browser form behavior.
- **All Import Dialog buttons**: Verified event bindings — Close button only closes the dialog and never triggers download/upload/validation/import.

### Added
- **AddDeviceDialog**: New production-ready modal dialog for manual single-device creation with 10 fields, grouped device type selector by category, inline IPv4 validation, duplicate IP detection, and touch-based field validation.
- **AssetsToolbar "+ Add Device"**: New primary action button (blue/`toolbar-primary` style) as the first button in the Assets toolbar.
- **Device Store `createDevice`**: New async action supporting both mock and backend modes — auto-generates sequential IDs (D041, D042...) in mock mode, refreshes device list after creation.
- **`toolbar-primary` CSS class**: New design token-level button variant for primary actions in toolbars.

### Changed
- `components/assets/ImportDialog.vue`: `downloadTemplate()` now uses blob-based download; close button has `type="button"`.
- `components/assets/AssetsToolbar.vue`: Reordered buttons — Add Device | Import CSV | Export CSV | Filter | Search. Added `add` emit.
- `stores/devices.ts`: Added `createDevice` action with mock/backend mode support.
- `pages/AssetsPage.vue`: Wired `AddDeviceDialog` with `addDialogOpen` state.
- `styles/theme.css`: Added `.toolbar-primary` button variant.

### Architecture Impact
- New device creation now flows through the centralized store (`deviceStore.createDevice`) — same architecture for both mock and backend modes.
- Ping engine notification: `deviceStore.createDevice` refreshes the full device list, which the Ping Engine reads on each scan cycle. No separate notification channel needed.
- Future: backend `POST /api/devices` already exists and is consumed by `deviceService.create()`.

## v3.1.1 — Data Flow & Event Binding Fix (2026-07-10)

### Critical Fixes

**#1 — Assets as Single Source of Truth**
- `DATA_MODE` default changed from `'mock'` to `'backend'` — all operations now flow through FastAPI → assets.json by default.
- Backend repository (`device_repository.py`) already writes to `assets.json` on create/update/delete — confirmed working.

**#2 — Data Persistence**
- Mock mode now persists to `localStorage` (`hospital_devices_mock` key) so data survives page refresh.
- Backend mode writes to `assets.json` (already implemented) — data survives backend restart.
- Mock repository: `_loadFromStorage()` on init, `_saveToStorage()` on every mutation.

**#3 — Dashboard Synchronization**
- Verified: `DashboardStats` derives from `store.statistics` (computed from `devices` ref).
- Verified: No component maintains independent device arrays — all go through `useDeviceStore()`.
- When `createDevice` replaces `devices.value`, reactivity propagates to all consumers.

**#4 — Import Dialog Event Binding**
- Root cause: File input had `absolute inset-0` but its parent drop-zone div lacked `relative` positioning.
- The file input was positioned relative to the dialog container, covering the entire dialog.
- Every click inside the dialog triggered the file input's `@change` handler.
- Fix: Added `relative` to the drop zone div — file input is now scoped correctly.

**#5 — Import Dialog UX**
- Added `@click.self="emit('close')"` to overlay — clicking outside the dialog now closes it.
- All buttons have independent event handlers — download, validate, import, close, cancel are separate.
- Close (X) button has `type="button"` — no accidental form submissions.

### Changed
- `types/api.ts`: `DATA_MODE` default → `'backend'`
- `services/mock/repository.ts`: Added localStorage persistence (`_loadFromStorage`, `_saveToStorage`)
- `components/assets/ImportDialog.vue`: Drop zone `relative` fix, overlay close handler

### Architecture Impact
- Frontend now defaults to backend mode — all data flows through the three-layer architecture.
- Mock mode is a development fallback with localStorage persistence.
- Clear distinction: `DATA_MODE='backend'` for production, `VITE_DATA_MODE=mock` for dev without backend.

## v3.2.0 — Assets UX & CRUD (2026-07-10)

### Added
- **Ping Engine auto-reload**: `POST /api/ping/reload` endpoint + `reload_inventory()` on PingWorker. Called after every Create/Edit/Delete/Import to immediately register new devices. Removes stale device states on delete.
- **Inspector UX overhaul**: Hidden by default, slides in from right with 250ms animation on View click. Close (X) button in header. Uses `Teleport` for proper z-index stacking.
- **Edit Device**: Click Edit → pre-fills AddDeviceDialog with current values → Save → calls `updateDevice()` → refreshes store + notifies Ping Engine.
- **Delete Device**: Click Delete → confirmation dialog → `deleteDevice()` → removes from store + assets.json → closes Inspector if deleted device was shown → notifies Ping Engine.
- **ConfirmDialog**: Reusable confirmation modal (title, message, confirm/cancel, loading state).

### Changed
- `stores/devices.ts`: Added `updateDevice()`, `deleteDevice()`, `_refreshFromRepo()`, `_notifyPingEngine()` helper
- `stores/ui.ts`: Added `inspectorOpen`, `openInspector()`, `closeInspector()`. `selectDevice()` now auto-opens inspector.
- `components/layout/InspectorPanel.vue`: Complete rewrite — `Teleport`, `v-if="ui.inspectorOpen"`, slide-in animation, close button
- `components/layout/DefaultLayout.vue`: Removed `MAIN_RIGHT_RESERVED` padding — inspector floats over content
- `components/assets/AddDeviceDialog.vue`: Added edit mode — `device` prop pre-fills form, calls `updateDevice()` instead of `createDevice()`
- `pages/AssetsPage.vue`: Wired View→openInspector, Edit→editDialog, Delete→confirmDialog. Full CRUD workflow.

### Backend
- `backend/app/services/ping_engine.py`: Added `reload_inventory()` — reconciles internal states with repository, adds new devices, removes stale ones
- `backend/app/api/ping.py`: Added `POST /api/ping/reload` — triggers inventory reload, returns new device count

### New Components
- `components/assets/ConfirmDialog.vue` — Reusable confirmation modal — Production Ready

### Architecture Impact
- CRUD now flows: UI → store → repository/service → assets.json → Ping Engine reload
- Inspector is now demand-driven (View click) instead of always-visible
- Frontend calls `/api/ping/reload` after every mutation — non-blocking (best-effort)

## v3.2.1 — Assets UI Simplification (2026-07-10)

### Changed
- **Product positioning**: Assets is now strictly an Asset Management page (metadata CRUD). Monitoring belongs to Dashboard.
- **Removed Inspector** from Assets page — table uses full available width.
- **Removed View (eye) button** from `AssetsRowActions` — only Edit and Delete remain.
- **Removed Status column** from `AssetsTable` — realtime status is Dashboard responsibility.
- **Removed Updated column** from `AssetsTable` — not useful for asset management.
- **Added Remark column** to `AssetsTable` — 10 data columns: Name, IP, Vendor, Model, Type, Building, Floor, Department, Location, Remark.

### Files
- `components/assets/AssetsRowActions.vue` — Removed View button
- `components/assets/AssetsTable.vue` — Removed Status/Updated, added Remark, removed @view emit
- `pages/AssetsPage.vue` — Removed onView handler, @view listener

## v3.2.2 — Dashboard Workspace UX (2026-07-10)

### Changed
- **Assets Table Width**: Table now uses full workspace width (no inspector reservation on Assets page). Removed all hardcoded min-w constraints that forced horizontal scroll.
- **Dashboard Inspector Selection**: Removed auto-select of first device on mount. Dashboard starts with Inspector closed, no device selected.
- **Dashboard Layout Animation**: 200ms synchronized workspace resize when Inspector opens/closes. Main content smoothly shifts left (padding transition), Inspector slides in from right — both animate simultaneously via `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Device Card/Li click**: Clicking any Device Card (grid view) or Device List Item (list view) now calls `ui.openInspector(device.id)` — Inspector opens with the clicked device. Clicking another device immediately switches Inspector content.
- **Inspector Close**: Close (X) button triggers 200ms slide-out animation. Workspace smoothly expands back to full width. Selected device kept internally but Inspector hidden.
- **Inspector Transition**: Migrated from CSS `animation` on `v-if` to Vue `<Transition>` component — proper enter/leave animations on both mount and unmount.

### Files Modified
- `components/layout/DefaultLayout.vue` — Dynamic `paddingRight` based on `ui.inspectorOpen` (0px ↔ 316px) with `transition-all`
- `components/layout/InspectorPanel.vue` — Wrapped in `<Transition name="inspector">` with `slideIn`/`slideOut` keyframes
- `pages/DashboardPage.vue` — Removed auto-select first device
- `components/devices/DeviceListItem.vue` — Added `@click="ui.openInspector(device.id)"` + `cursor-pointer`
- `components/devices/DeviceCard.vue` — Added `@click="ui.openInspector(device.id)"` + `cursor-pointer`

## v3.3.0 — Interactive Dashboard Filters (2026-07-10)

### Added
- **Interactive filter cards**: Dashboard stat cards are now clickable workspace filters — Total, Online, Offline, Warning, Healthy.
- **Healthy Devices card**: Replaces the old "Average Latency" card. Healthy = Online + no Warning + no Offline status. Uses Heart icon.
- **Active filter state**: Selected card shows primary border, darker background, subtle scale — Apple-style interaction. Only one filter active at a time.
- **Workspace synchronization**: Filtering immediately updates Device List, Device Grid, and workspace count.
- **Inspector auto-close**: If selected device is filtered out, Inspector automatically closes.

### Changed
- `components/dashboard/stats/StatCard.vue` — Added `active` + `clickable` props, `@select` emit, 160ms active transition
- `components/dashboard/stats/DashboardStats.vue` — Replaced Latency → Healthy, added `activeFilter` prop + `@select` emit, exports `DashboardFilter` type
- `pages/DashboardPage.vue` — Added `activeFilter` ref, `filteredDevices` computed, `onFilterSelect` handler, `watch(activeFilter)` to sync inspector

### Removed
- "Average Latency" card — replaced by "Healthy Devices"

## v3.4.0 — Real Ping Workflow & Polling (2026-07-10)

### Changed
- **DATA_MODE default**: Changed from `'mock'` to `'backend'` — production mode uses FastAPI + Ping Engine by default. Set `VITE_DATA_MODE=mock` for development.
- **Auto-polling**: Added `startPolling()` / `stopPolling()` to device store. Dashboard and Assets pages auto-refresh every 10 seconds in backend mode, picking up the latest Ping Engine status/latency/health data.
- **Real device data**: All Dashboard devices now originate from `assets.json` → Backend API → Ping Engine. No mock devices in production mode.
- **Real status/latency/health**: Status, latency, and health metrics are calculated by the Ping Engine (not randomly generated). Persisted to `assets.json` after each scan cycle.

### Added
- `stores/devices.ts`: `startPolling()`, `stopPolling()` — 10s interval auto-refresh (backend mode only)
- `pages/DashboardPage.vue`: `startPolling()` on mount, `stopPolling()` on unmount
- `pages/AssetsPage.vue`: `startPolling()` on mount, `stopPolling()` on unmount

### Architecture
```
Ping Engine (30s scan) → updates assets.json
  ↓
Frontend polling (10s) → deviceService.getAll() → GET /api/devices
  ↓
devices ref updates → statistics recompute → UI re-renders
  ↓
Dashboard Stats, Device List, Device Grid, Inspector all reactive
```
