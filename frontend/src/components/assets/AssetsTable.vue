<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Device } from '@/types/device'
import { getDeviceDisplayName } from '@/types/device'
import AssetsRowActions from './AssetsRowActions.vue'

/**
 * Assets master table — sortable, selectable, 10 data columns.
 *
 * Columns: Device Name, IP, Vendor, Model, Type, Building, Floor, Department, Location, Remark
 * Actions: Edit, Delete
 *
 * @prop devices — Filtered device array
 *
 * @emits edit, delete, selection-change
 *
 * Component Maturity: Production Ready
 */
const props = defineProps<{ devices: Device[] }>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  'selection-change': [ids: string[]]
}>()

// ── Sorting ──
type SortKey = keyof Device | 'displayType'
const sortKey = ref<SortKey>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function sortIndicator(key: SortKey): string {
  if (sortKey.value !== key) return ''
  return sortDir.value === 'asc' ? ' ↑' : ' ↓'
}

const sortedDevices = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.devices].sort((a, b) => {
    let va: unknown
    let vb: unknown
    if (sortKey.value === 'displayType') {
      va = getDeviceDisplayName(a.type)
      vb = getDeviceDisplayName(b.type)
    } else {
      va = a[sortKey.value as keyof Device]
      vb = b[sortKey.value as keyof Device]
    }
    if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb) * dir
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return 0
  })
})

// ── Selection ──
const selectedIds = ref<Set<string>>(new Set())
const allSelected = computed(() =>
  props.devices.length > 0 && selectedIds.value.size === props.devices.length,
)

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(props.devices.map((d) => d.id))
  }
  emitSelection()
}

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
  emitSelection()
}

function emitSelection() {
  emit('selection-change', [...selectedIds.value])
}

function clearSelection() {
  selectedIds.value = new Set()
  emitSelection()
}

defineExpose({ clearSelection })

// ── Column definitions ──
interface Column {
  key: SortKey
  label: string
  sortable: boolean
  class: string
}
const columns: Column[] = [
  { key: 'name', label: 'Device Name', sortable: true, class: 'min-w-[180px]' },
  { key: 'ip', label: 'IP Address', sortable: true, class: 'min-w-[130px]' },
  { key: 'mac', label: 'MAC Address', sortable: true, class: 'w-[140px]' },
  { key: 'vendor', label: 'Vendor', sortable: true, class: 'w-[100px]' },
  { key: 'model', label: 'Model', sortable: true, class: 'w-[140px]' },
  { key: 'displayType', label: 'Type', sortable: true, class: 'w-[110px]' },
  { key: 'building', label: 'Building', sortable: true, class: 'w-[120px]' },
  { key: 'floor', label: 'Floor', sortable: true, class: 'w-[70px]' },
  { key: 'department', label: 'Department', sortable: true, class: 'w-[120px]' },
  { key: 'location', label: 'Location', sortable: true, class: 'w-[140px]' },
  { key: 'remark', label: 'Remark', sortable: false, class: 'min-w-[140px]' },
  { key: 'name', label: 'Actions', sortable: false, class: 'w-[80px]' },
]
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="sticky top-0 z-10">
        <tr class="border-b border-border/40 bg-muted/40">
          <th class="w-10 px-3 py-2.5">
            <input
              type="checkbox"
              :checked="allSelected"
              class="size-3.5 rounded-[4px] accent-primary"
              @change="toggleSelectAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key + col.label"
            :class="[
              col.class,
              'px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.11em] text-muted-foreground',
              col.sortable ? 'cursor-pointer select-none hover:text-foreground' : '',
            ]"
            @click="col.sortable && toggleSort(col.key)"
          >
            {{ col.label }}<span v-if="col.sortable" class="ml-0.5 text-[9px]">{{ sortIndicator(col.key) }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="device in sortedDevices"
          :key="device.id"
          class="border-b border-border/20 transition duration-100"
          :class="
            selectedIds.has(device.id)
              ? 'bg-primary/[0.05] dark:bg-primary/[0.08]'
              : 'hover:bg-muted/20 dark:hover:bg-white/[0.02]'
          "
        >
          <td class="px-3 py-2.5">
            <input
              type="checkbox"
              :checked="selectedIds.has(device.id)"
              class="size-3.5 rounded-[4px] accent-primary"
              @change="toggleSelect(device.id)"
            />
          </td>
          <td class="px-3 py-2.5">
            <div>
              <p class="text-[13px] font-semibold leading-5">{{ device.name }}</p>
              <p class="text-[11px] font-mono text-muted-foreground">{{ device.ip }}</p>
            </div>
          </td>
          <td class="px-3 py-2.5 text-[12.5px] font-mono">{{ device.ip }}</td>
          <td class="px-3 py-2.5 text-[12px] font-mono text-muted-foreground">{{ device.mac || '—' }}</td>
          <td class="px-3 py-2.5 text-[12.5px]">{{ device.vendor }}</td>
          <td class="px-3 py-2.5 text-[12.5px] text-muted-foreground">{{ device.model }}</td>
          <td class="px-3 py-2.5 text-[12.5px]">{{ getDeviceDisplayName(device.type) }}</td>
          <td class="px-3 py-2.5 text-[12.5px]">{{ device.building }}</td>
          <td class="px-3 py-2.5 text-[12.5px]">{{ device.floor }}</td>
          <td class="px-3 py-2.5 text-[12.5px] text-muted-foreground">{{ device.department }}</td>
          <td class="px-3 py-2.5 text-[12.5px] text-muted-foreground">{{ device.location }}</td>
          <td class="px-3 py-2.5 text-[12px] text-muted-foreground max-w-[200px] truncate">{{ device.remark || '—' }}</td>
          <td class="px-3 py-2.5">
            <AssetsRowActions
              :device-id="device.id"
              @edit="emit('edit', $event)"
              @delete="emit('delete', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
