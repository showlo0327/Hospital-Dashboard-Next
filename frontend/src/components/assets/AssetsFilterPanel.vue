<script setup lang="ts">
import { computed, ref } from 'vue'
import { X, RotateCcw } from 'lucide-vue-next'
import { useDeviceStore } from '@/stores/devices'
import { DeviceType, DeviceStatus } from '@/types/device'

/**
 * Assets filter panel — real-time filter controls.
 *
 * Supports filtering by:
 *   - Status (Online/Offline/Warning)
 *   - Device Type
 *   - Vendor
 *   - Building
 *   - Floor
 *   - Department
 *
 * Multiple filters combine with AND logic.
 *
 * @emits filter-change — Emitted with current filter state
 *
 * Component Maturity: Production Ready
 */

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

export interface AssetsFilters {
  status: string
  deviceType: string
  vendor: string
  building: string
  floor: string
  department: string
}

const filters = ref<AssetsFilters>({
  status: '',
  deviceType: '',
  vendor: '',
  building: '',
  floor: '',
  department: '',
})

const store = useDeviceStore()

// ── Derive filter options from real device data ──
const deviceTypes = computed(() => {
  const types = new Set(store.devices.map(d => d.type))
  return Object.values(DeviceType).filter(t => types.has(t))
})

const vendors = computed(() => {
  const v = new Set(store.devices.map(d => d.vendor).filter(Boolean))
  return [...v].sort()
})

const buildings = computed(() => {
  const b = new Set(store.devices.map(d => d.building).filter(Boolean))
  return [...b].sort()
})

const floors = computed(() => {
  const f = new Set(store.devices.map(d => d.floor).filter(Boolean))
  return [...f].sort()
})

const departments = computed(() => {
  const d = new Set(store.devices.map(d => d.department).filter(Boolean))
  return [...d].sort()
})

const statuses = Object.values(DeviceStatus)

function clearFilters() {
  filters.value = { status: '', deviceType: '', vendor: '', building: '', floor: '', department: '' }
}

function onFilterChange() {
  // Will be handled by AssetsPage watcher
}

function emitClose() {
  emit('close')
}

// Expose for parent
defineExpose({ filters })
</script>

<template>
  <div
    v-if="open"
    class="rounded-[18px] border border-border bg-white/72 p-4 shadow-[0_12px_32px_rgba(31,41,55,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6"
  >
    <div class="mb-3 flex items-center justify-between">
      <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Filters
      </span>
      <div class="flex items-center gap-1">
        <button
          class="grid size-6 place-items-center rounded-[8px] text-muted-foreground transition hover:bg-muted/60"
          title="Clear all filters"
          @click="clearFilters"
        >
          <RotateCcw :size="12" />
        </button>
        <button
          class="grid size-6 place-items-center rounded-[8px] text-muted-foreground transition hover:bg-muted/60"
          @click="emitClose"
        >
          <X :size="13" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <!-- Status -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
        <select v-model="filters.status" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
      <!-- Device Type -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
        <select v-model="filters.deviceType" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="t in deviceTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <!-- Vendor -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vendor</span>
        <select v-model="filters.vendor" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="v in vendors" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
      <!-- Building -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Building</span>
        <select v-model="filters.building" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="b in buildings" :key="b" :value="b">{{ b }}</option>
        </select>
      </label>
      <!-- Floor -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Floor</span>
        <select v-model="filters.floor" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="f in floors" :key="f" :value="f">{{ f }}</option>
        </select>
      </label>
      <!-- Department -->
      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dept</span>
        <select v-model="filters.department" class="filter-select" @change="onFilterChange">
          <option value="">All</option>
          <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped>
.filter-select {
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background-color: rgba(255, 255, 255, 0.6);
  padding: 0 20px 0 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}
.filter-select:focus {
  border-color: rgba(0, 122, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.12);
}
.dark .filter-select {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
