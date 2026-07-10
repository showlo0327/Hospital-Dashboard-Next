<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceList from '@/components/devices/DeviceList.vue'
import DeviceGrid from '@/components/devices/DeviceGrid.vue'

/**
 * WorkspaceContainer — main workspace area.
 * Switches between DeviceList (list view) and DeviceGrid (grid view).
 *
 * Both views share the same devices[], loading state, and selectedId.
 *
 * @prop view       — Current view mode (list/grid)
 * @prop devices    — Device array shared by both views
 * @prop loading    — Loading state forwarded to both views
 * @prop selectedId — Selected device id for visual highlighting
 *
 * Component Maturity: Production Ready
 */
withDefaults(
  defineProps<{
    view: 'list' | 'grid'
    devices?: Device[]
    loading?: boolean
    selectedId?: string
  }>(),
  { devices: () => [], loading: false, selectedId: undefined },
)
</script>

<template>
  <div class="mx-auto w-full max-w-[1080px]">
    <DeviceList
      v-if="view === 'list'"
      :devices="devices"
      :loading="loading"
      :selected-id="selectedId"
    />
    <DeviceGrid
      v-else
      :devices="devices"
      :loading="loading"
      :selected-id="selectedId"
    />
  </div>
</template>
