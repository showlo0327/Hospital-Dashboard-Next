<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Device } from '@/types/device'
import { DeviceStatus } from '@/types/device'
import { useDeviceStore } from '@/stores/devices'
import { useUIStore } from '@/stores/ui'
import { DATA_MODE } from '@/types/api'
import DashboardStats from '@/components/dashboard/stats/DashboardStats.vue'
import type { DashboardFilter } from '@/components/dashboard/stats/DashboardStats.vue'
import WorkspaceHeader from '@/components/dashboard/workspace/WorkspaceHeader.vue'
import WorkspaceContainer from '@/components/dashboard/workspace/WorkspaceContainer.vue'
import { onUnmounted } from 'vue'
import { WifiOff, RefreshCw } from 'lucide-vue-next'

// ── Data Source Audit ──
const AUDIT_TAG = '[DataAudit:DashboardPage]'

const view = ref<'list' | 'grid'>('list')
const deviceStore = useDeviceStore()
const ui = useUIStore()

onMounted(async () => {
  console.log(AUDIT_TAG, 'mount → DATA_MODE =', DATA_MODE, '| store has', deviceStore.devices.length, 'devices')
  // fetchAll auto-detects backend availability and switches data source if needed
  await deviceStore.fetchAll()
  deviceStore.startPolling()
  console.log(AUDIT_TAG, 'mount → after fetchAll:', deviceStore.devices.length, 'devices')
})

onUnmounted(() => {
  deviceStore.stopPolling()
})

// ── Dashboard Filter ──
const searchQuery = ref('')
const filterOpen = ref(false)
const refreshing = ref(false)
const activeFilter = ref<DashboardFilter>('all')

// ── Dashboard filter state ──
const dashFilter = ref({ building: '', floor: '', department: '', deviceType: '' })
const dashBuildings = computed(() => [...new Set(deviceStore.devices.map(d => d.building).filter(Boolean))].sort())
const dashFloors = computed(() => [...new Set(deviceStore.devices.map(d => d.floor).filter(Boolean))].sort())
const dashDepts = computed(() => [...new Set(deviceStore.devices.map(d => d.department).filter(Boolean))].sort())
const dashTypes = computed(() => [...new Set(deviceStore.devices.map(d => d.type).filter(Boolean))].sort())

const filteredDevices = computed<Device[]>(() => {
  let all = deviceStore.devices
  // Search filter
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    all = all.filter(d =>
      d.name.toLowerCase().includes(q) || d.ip.includes(q) ||
      d.vendor.toLowerCase().includes(q) || d.model.toLowerCase().includes(q) ||
      d.building.toLowerCase().includes(q) || d.floor.toLowerCase().includes(q) ||
      (d.department ?? '').toLowerCase().includes(q) || d.location.toLowerCase().includes(q) ||
      (d.mac ?? '').toLowerCase().includes(q),
    )
  }
  // Dashboard sub-filter
  const df = dashFilter.value
  if (df.building) all = all.filter(d => d.building === df.building)
  if (df.floor) all = all.filter(d => d.floor === df.floor)
  if (df.department) all = all.filter(d => d.department === df.department)
  if (df.deviceType) all = all.filter(d => d.type === df.deviceType)
  // Dashboard card filter
  let result: Device[]
  switch (activeFilter.value) {
    case 'online':
      result = all.filter(d => d.status === DeviceStatus.Online); break
    case 'offline':
      result = all.filter(d => d.status === DeviceStatus.Offline); break
    case 'warning':
      result = all.filter(d => d.status === DeviceStatus.Warning); break
    case 'healthy':
      result = all.filter(d =>
        d.status === DeviceStatus.Online &&
        d.status !== DeviceStatus.Warning &&
        d.status !== DeviceStatus.Offline,
      ); break
    default:
      result = all
  }
  // Sort: Online ascending by latency, Warning ascending by latency
  const online = result.filter(d => d.status === DeviceStatus.Online).sort((a, b) => a.latency - b.latency)
  const warning = result.filter(d => d.status === DeviceStatus.Warning).sort((a, b) => a.latency - b.latency)
  const others = result.filter(d => d.status !== DeviceStatus.Online && d.status !== DeviceStatus.Warning)
  return [...online, ...warning, ...others]
})

// ── Refresh ──
async function refreshDashboard() {
  refreshing.value = true
  try {
    await deviceStore.fetchAll()
  } catch {
    // error is set by store
  } finally {
    refreshing.value = false
  }
}

function onFilterSelect(filter: DashboardFilter) {
  activeFilter.value = filter
}

// ── Inspector sync: close if selected device is filtered out ──
watch(activeFilter, () => {
  if (ui.selectedDeviceId) {
    const stillVisible = filteredDevices.value.some(d => d.id === ui.selectedDeviceId)
    if (!stillVisible) ui.clearSelection()
  }
})
</script>

<style scoped>
.filter-select {
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.6);
  padding: 0 20px 0 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}
.dark .filter-select {
  background-color: rgba(255,255,255,0.08);
}
</style>

<template>
  <div>
    <div
      v-if="deviceStore.error"
      class="mb-4 flex items-center gap-3 rounded-[22px] border border-red-300/60 bg-red-50/80 px-5 py-4 text-sm text-red-800 backdrop-blur-xl dark:border-red-800/40 dark:bg-red-950/40 dark:text-red-300"
    >
      <WifiOff class="h-5 w-5 shrink-0 text-red-500" />
      <span class="flex-1">{{ deviceStore.error }}</span>
      <button
        class="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
        @click="deviceStore.fetchAll()"
      >
        <RefreshCw class="h-3.5 w-3.5" /> Retry
      </button>
    </div>

    <template v-if="deviceStore.loading && deviceStore.devices.length === 0">
      <DashboardStats :active-filter="activeFilter" @select="onFilterSelect" />
      <WorkspaceHeader v-model:view="view" :search-query="searchQuery" :filter-active="filterOpen" @update:search-query="searchQuery = $event" @toggle-filter="filterOpen = !filterOpen" :refreshing="refreshing"
      @refresh="refreshDashboard" />
      <!-- Dashboard filter panel -->
      <div v-if="filterOpen" class="mt-2 rounded-[18px] border border-border bg-white/72 p-4 shadow-[0_12px_32px_rgba(31,41,55,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
        <div class="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Filters</div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Building</span>
            <select v-model="dashFilter.building" class="filter-select">
              <option value="">All</option>
              <option v-for="b in dashBuildings" :key="b" :value="b">{{ b }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Floor</span>
            <select v-model="dashFilter.floor" class="filter-select">
              <option value="">All</option>
              <option v-for="f in dashFloors" :key="f" :value="f">{{ f }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dept</span>
            <select v-model="dashFilter.department" class="filter-select">
              <option value="">All</option>
              <option v-for="d in dashDepts" :key="d" :value="d">{{ d }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
            <select v-model="dashFilter.deviceType" class="filter-select">
              <option value="">All</option>
              <option v-for="t in dashTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
        </div>
      </div>
      <WorkspaceContainer :view="view" :devices="[]" :loading="true" />
    </template>

    <template v-else>
      <DashboardStats :active-filter="activeFilter" @select="onFilterSelect" />
      <WorkspaceHeader v-model:view="view" :search-query="searchQuery" :filter-active="filterOpen" @update:search-query="searchQuery = $event" @toggle-filter="filterOpen = !filterOpen" :refreshing="refreshing"
      @refresh="refreshDashboard" />
      <!-- Dashboard filter panel -->
      <div v-if="filterOpen" class="mt-2 rounded-[18px] border border-border bg-white/72 p-4 shadow-[0_12px_32px_rgba(31,41,55,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
        <div class="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Filters</div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Building</span>
            <select v-model="dashFilter.building" class="filter-select">
              <option value="">All</option>
              <option v-for="b in dashBuildings" :key="b" :value="b">{{ b }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Floor</span>
            <select v-model="dashFilter.floor" class="filter-select">
              <option value="">All</option>
              <option v-for="f in dashFloors" :key="f" :value="f">{{ f }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dept</span>
            <select v-model="dashFilter.department" class="filter-select">
              <option value="">All</option>
              <option v-for="d in dashDepts" :key="d" :value="d">{{ d }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
            <select v-model="dashFilter.deviceType" class="filter-select">
              <option value="">All</option>
              <option v-for="t in dashTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
        </div>
      </div>
      <WorkspaceContainer
        :view="view"
        :devices="filteredDevices"
        :loading="deviceStore.loading"
        :selected-id="ui.selectedDeviceId ?? undefined"
      />
    </template>
  </div>
</template>
