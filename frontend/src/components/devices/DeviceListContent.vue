<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceListItem from './DeviceListItem.vue'

/**
 * Scrollable list body rendering DeviceListItem for each device.
 *
 * No pagination or virtualization — all items rendered.
 * Architecture ready for future <VirtualList> swap.
 *
 * @prop devices  — Array of Device objects
 * @prop selectedId — Currently selected device id (visual only)
 *
 * Design Tokens Used:
 *   --color-border
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  devices: Device[]
  selectedId?: string
}>()
</script>

<template>
  <div class="divide-y-0">
    <DeviceListItem
      v-for="device in devices"
      :key="device.id"
      :device="device"
      :selected="device.id === selectedId"
    />
  </div>
</template>
