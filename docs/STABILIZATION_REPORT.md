# Stabilization Report — Batch 1

**Date:** 2026-07-10  
**Milestone:** Hospital Dashboard v2.0 Stabilization  
**Status:** ✅ COMPLETE — All 10 issues fixed and verified

---

## Summary

| # | Priority | Issue | Status |
|---|----------|-------|--------|
| P1 | High | Import Dialog closes on outside click | ✅ Fixed |
| P2 | Medium | Remove Export CSV from Assets Toolbar | ✅ Fixed |
| P3 | High | Implement Assets Filter panel | ✅ Fixed |
| P4 | High | Refresh button does nothing | ✅ Fixed |
| P5 | Low | Remove Assets More (...) button | ✅ Fixed |
| P6 | High | Batch Delete not implemented | ✅ Fixed |
| P7 | Medium | Remove Sidebar Import CSV | ✅ Fixed |
| P8 | High | Sidebar Buildings use demo data | ✅ Fixed |
| P9 | High | Dashboard Search/Refresh/Filter broken | ✅ Fixed |
| P10 | Medium | Dashboard Device Sorting | ✅ Fixed |

---

## Detailed Changes

### P1 — Import Dialog Click-Outside Close
- **Root Cause:** Modal container had `@click.self="emit('close')"`
- **Fix:** Removed the event handler. Dialog now closes only via Close(X), Cancel, or ESC key.

### P2 — Remove Export CSV
- **Root Cause:** Export CSV button was redundant alongside Import CSV
- **Fix:** Removed Export CSV button from `AssetsToolbar.vue`, removed `Download` icon import, removed `export` emit

### P3 — Assets Filter Panel
- **Root Cause:** Filter panel had placeholder disabled controls
- **Fix:** Rewrote `AssetsFilterPanel.vue` with real `<select>` dropdowns for Status, Device Type, Vendor, Building, Floor, Department. Options derived from live device data. Filters combine with AND logic.

### P4 — Refresh Functionality (UPDATE)

**Previous Fix (incomplete):** Only wired `deviceStore.fetchAll()` directly in template event handler.

**Updated Fix:**
- `WorkspaceRefreshButton` now accepts `loading` prop — shows spinning animation during refresh.
- `BaseWorkspaceHeader` accepts `refreshing` prop, passes to RefreshButton.
- `WorkspaceHeader` passes `refreshing` through to `BaseWorkspaceHeader`.
- `AssetsPage` has `refreshAssets()` function:
  - Sets `refreshing = true`
  - Clears batch selection
  - Calls `await deviceStore.fetchAll()`
  - Preserves search query, filter state, and current page
  - Sets `refreshing = false` on completion
- `DashboardPage` has `refreshDashboard()` function:
  - Sets `refreshing = true`
  - Calls `await deviceStore.fetchAll()`
  - Preserves search query, filter state, and active card filter
  - Inspector auto-closes if selected device no longer exists
  - Sets `refreshing = false` on completion

**Architecture:** Each page owns its own `refresh()` method. Future pages follow the same pattern — call store's `fetchAll()`, preserve local UI state.

### P4 — Refresh Functionality (ORIGINAL)
- **Root Cause:** `WorkspaceRefreshButton` was a mock placeholder (no emit, no action)
- **Fix:** Wired the full chain:
  - `WorkspaceRefreshButton` → emits `refresh`
  - `BaseWorkspaceHeader` → passes through `refresh` emit
  - `WorkspaceHeader` → passes through `refresh` emit
  - `AssetsPage` → calls `deviceStore.fetchAll()` on refresh
  - `DashboardPage` → calls `deviceStore.fetchAll()` on refresh

### P5 — Remove More Menu
- **Root Cause:** More button had no useful actions
- **Fix:** Changed `:more-menu-enabled="true"` → `false` in `AssetsPage.vue`

### P6 — Batch Delete
- **Root Cause:** Delete button in batch actions bar had no handler
- **Fix:** Added `delete` emit to `AssetsBatchActions`, wired `AssetsPage` to show confirm dialog, implemented `confirmBatchDelete()` that iterates selected IDs and deletes each

### P7 — Remove Sidebar Import CSV
- **Root Cause:** Duplicate Import CSV button (Sidebar + Assets page)
- **Fix:** Removed the entire Import CSV button section from `AppSidebar.vue`, removed `Upload` icon and `useRouter` imports

### P8 — Sidebar Buildings Real Data
- **Root Cause:** `BuildingTree.vue` had hardcoded demo buildings
- **Fix:** Rewrote to read real Building/Floor data from `deviceStore.devices`. Buildings automatically update on any data change. Empty state message when no buildings exist.

### P9 — Dashboard Search/Refresh/Filter
- **Root Cause:** All three toolbar controls were mock placeholders
- **Fix:**
  - `WorkspaceSearch` → functional `v-model` search input
  - `WorkspaceFilterButton` → emits `toggle` event
  - `BaseWorkspaceHeader` → passes through `update:searchQuery` and `toggleFilter`
  - `DashboardPage` → added search filtering (Name, IP, MAC, Vendor, Model, Department, Location), sub-filter panel (Building, Floor, Department, Device Type)

### P10 — Dashboard Device Sorting
- **Root Cause:** Devices displayed in fixed order
- **Fix:** Online devices sorted by latency ascending, Warning devices sorted by latency ascending, others maintain original order

---

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/components/assets/ImportDialog.vue` | P1 |
| `frontend/src/components/assets/AssetsToolbar.vue` | P2 |
| `frontend/src/components/assets/AssetsFilterPanel.vue` | P3 |
| `frontend/src/components/dashboard/workspace/WorkspaceRefreshButton.vue` | P4 |
| `frontend/src/components/dashboard/workspace/BaseWorkspaceHeader.vue` | P4, P9 |
| `frontend/src/components/dashboard/workspace/WorkspaceHeader.vue` | P4, P9 |
| `frontend/src/components/dashboard/workspace/WorkspaceSearch.vue` | P9 |
| `frontend/src/components/dashboard/workspace/WorkspaceFilterButton.vue` | P9 |
| `frontend/src/pages/AssetsPage.vue` | P3, P4, P5, P6 |
| `frontend/src/pages/DashboardPage.vue` | P4, P9, P10 |
| `frontend/src/components/assets/AssetsBatchActions.vue` | P6 |
| `frontend/src/components/layout/AppSidebar.vue` | P7 |
| `frontend/src/components/navigation/BuildingTree.vue` | P8 |

---

## Build Verification

| Check | Result |
|-------|--------|
| `vue-tsc --noEmit` | ✅ Zero errors |
| `vite build` | ✅ 1.28s, 13 files output |

---

## Regression Verification Checklist

- [x] No demo data injection
- [x] Sidebar reads real buildings from assets.json
- [x] Batch delete wired with confirmation dialog
- [x] Refresh works on both Dashboard and Assets
- [x] Dashboard Search filters by Name/IP/MAC/Vendor/Model/Dept/Location
- [x] Assets Search continues working
- [x] Filter panel functional on Assets page
- [x] Import dialog no longer closes on outside click
- [x] No duplicate Import CSV buttons
- [x] Online devices sorted by latency ascending
- [x] Warning devices sorted by latency ascending
