<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown, ChevronRight, Building2 } from 'lucide-vue-next'
import { useDeviceStore } from '@/stores/devices'
import BuildingTreeNode from './BuildingTreeNode.vue'

const props = defineProps<{ collapsed: boolean }>()

const store = useDeviceStore()

interface Building {
  building: string
  floors: string[]
}

const buildings = computed<Building[]>(() => {
  const map = new Map<string, Set<string>>()
  for (const d of store.devices) {
    const b = d.building || 'Unknown'
    const f = d.floor || 'Unknown'
    if (!map.has(b)) map.set(b, new Set())
    map.get(b)!.add(f)
  }
  return [...map.entries()]
    .map(([building, floors]) => ({ building, floors: [...floors].sort() }))
    .sort((a, b) => a.building.localeCompare(b.building))
})

const openBuildings = ref<Record<string, boolean>>({})

// Initialize and update open state
watch(() => buildings.value, (newBuildings) => {
  const next: Record<string, boolean> = {}
  for (const { building } of newBuildings) {
    next[building] = openBuildings.value[building] ?? true
  }
  openBuildings.value = next
}, { immediate: true })

// When sidebar collapses, close all
watch(() => props.collapsed, (collapsed) => {
  if (collapsed) {
    for (const key of Object.keys(openBuildings.value)) {
      openBuildings.value[key] = false
    }
  }
})

function toggleBuilding(name: string) {
  openBuildings.value[name] = !openBuildings.value[name]
}
</script>

<template>
  <div class="mb-5">
    <p :class="[collapsed ? 'sr-only' : 'sidebar-title']">Buildings</p>
    <div v-if="buildings.length === 0 && !collapsed" class="py-3 text-center text-[12px] text-muted-foreground/50">
      No buildings yet
    </div>
    <div class="space-y-0.5 text-sm">
      <div v-for="{ building, floors } in buildings" :key="building">
        <!-- Building row -->
        <button
          :title="collapsed ? building : undefined"
          class="side-row w-full"
          :class="{
            'justify-center px-0': collapsed,
            'font-semibold': !collapsed,
          }"
          @click="toggleBuilding(building)"
        >
          <ChevronDown
            v-if="!collapsed && openBuildings[building]"
            :size="13"
          />
          <ChevronRight
            v-else-if="!collapsed && !openBuildings[building]"
            :size="13"
          />
          <Building2 :size="15" />
          <span v-if="!collapsed" class="truncate">{{ building }}</span>
        </button>

        <!-- Floor children -->
        <div
          v-if="!collapsed && openBuildings[building]"
          class="mt-0.5 space-y-0.5 border-l border-border/60 pl-4 ml-4"
        >
          <BuildingTreeNode
            v-for="floor in floors"
            :key="`${building}-${floor}`"
            :floor="floor"
          />
        </div>
      </div>
    </div>
  </div>
</template>
