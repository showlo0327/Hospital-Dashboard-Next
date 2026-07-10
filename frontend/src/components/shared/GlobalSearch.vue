<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Server, Monitor, Wifi, Shield, X } from 'lucide-vue-next'
import { useDeviceStore } from '@/stores/devices'
import { useUIStore } from '@/stores/ui'
import { getDeviceTypeMeta, type Device } from '@/types/device'
import { formatDeviceLocation } from '@/utils/location'

const router = useRouter()
const deviceStore = useDeviceStore()
const ui = useUIStore()

const query = ref('')
const open = ref(false)
const searchRef = ref<HTMLDivElement | null>(null)

// ── Search across all device fields ──
const searchResults = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q || q.length < 1) return []
  const results = deviceStore.devices.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.ip.includes(q) ||
    (d.mac ?? '').toLowerCase().includes(q) ||
    d.vendor.toLowerCase().includes(q) ||
    d.model.toLowerCase().includes(q) ||
    d.building.toLowerCase().includes(q) ||
    d.floor.toLowerCase().includes(q) ||
    (d.department ?? '').toLowerCase().includes(q) ||
    d.location.toLowerCase().includes(q) ||
    (d.remark ?? '').toLowerCase().includes(q) ||
    getDeviceTypeMeta(d.type).displayName.toLowerCase().includes(q)
  )
  return results.slice(0, 15) // max 15 results
})

// ── Group results by device category ──
const groupedResults = computed(() => {
  const groups: Record<string, Device[]> = {}
  for (const d of searchResults.value) {
    const cat = getDeviceTypeMeta(d.type).category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(d)
  }
  return Object.entries(groups)
})

// ── Click handler: navigate to appropriate page ──
function selectResult(device: Device) {
  open.value = false
  query.value = ''
  // Select device and open inspector, then navigate to Dashboard
  ui.selectDevice(device.id)
  router.push({ name: 'dashboard' })
}

// ── Close on Escape ──
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { open.value = false; (e.target as HTMLElement)?.blur() }
}

// ── Close on outside click ──
function onClickOutside(e: MouseEvent) {
  if (searchRef.value && !searchRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// ── Category icon helper ──
const categoryIcons: Record<string, typeof Server> = {
  Network: Wifi,
  Compute: Server,
  Endpoint: Monitor,
  Other: Shield,
}
</script>

<template>
  <div ref="searchRef" class="relative hidden h-9 min-w-[280px] flex-1 lg:block">
    <!-- Search input -->
    <div
      class="flex h-full items-center gap-2 rounded-[15px] border border-border bg-white/58 px-3 text-muted-foreground shadow-inner transition dark:bg-white/8"
      :class="{ 'rounded-b-none border-primary/30 bg-white/90 shadow-[0_0_0_2px_rgba(0,122,255,0.12)] dark:bg-white/12': open && query }"
    >
      <Search :size="15" />
      <input
        v-model="query"
        class="w-full bg-transparent text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
        placeholder="Search devices, IP, MAC, vendor, model, building..."
        @focus="open = true"
        @keydown="onKeydown"
      />
      <button
        v-if="query"
        class="grid size-5 place-items-center rounded-full text-muted-foreground/60 hover:bg-muted/60 hover:text-foreground"
        @click="query = ''; open = false"
      >
        <X :size="12" />
      </button>
    </div>

    <!-- Floating results panel -->
    <div
      v-if="open && query.length >= 1"
      class="absolute inset-x-0 top-full z-50 mt-0 max-h-[420px] overflow-hidden rounded-b-[15px] border border-t-0 border-primary/20 bg-white/94 shadow-[0_16px_48px_rgba(15,23,42,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141820]/96"
    >
      <!-- No results -->
      <div v-if="searchResults.length === 0" class="px-4 py-6 text-center text-[13px] text-muted-foreground">
        No devices found matching "{{ query }}"
      </div>

      <!-- Grouped results -->
      <div v-else class="max-h-[420px] overflow-y-auto overscroll-contain py-1">
        <template v-for="[category, devices] in groupedResults" :key="category">
          <div class="px-3 py-1.5 pt-2">
            <span class="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">{{ category }}</span>
          </div>
          <button
            v-for="device in devices"
            :key="device.id"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-primary/6"
            @click="selectResult(device)"
          >
            <!-- Device type icon -->
            <div class="grid size-7 shrink-0 place-items-center rounded-[8px] bg-muted/50 text-muted-foreground">
              <component :is="categoryIcons[category] ?? Shield" :size="14" />
            </div>
            <!-- Device info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[13px] font-semibold text-foreground truncate">{{ device.name }}</span>
                <span class="shrink-0 rounded-[5px] border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{{ getDeviceTypeMeta(device.type).displayName }}</span>
              </div>
              <div class="flex items-center gap-2 text-[12px] text-muted-foreground">
                <span class="font-mono text-[11px]">{{ device.ip }}</span>
                <span class="opacity-40">·</span>
                <span class="truncate">{{ formatDeviceLocation(device) }}</span>
              </div>
            </div>
            <!-- Enter hint -->
            <span class="shrink-0 text-[10px] text-muted-foreground/40">⏎</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
