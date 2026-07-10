<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceListHeader from './DeviceListHeader.vue'
import DeviceListContent from './DeviceListContent.vue'
import DeviceListEmpty from './DeviceListEmpty.vue'
import DeviceListLoading from './DeviceListLoading.vue'
import DeviceListFooter from './DeviceListFooter.vue'
import DeviceListVirtualPlaceholder from './DeviceListVirtualPlaceholder.vue'

/**
 * Device List — primary data browsing component.
 *
 * Orchestrates: Header, Content (or Empty/Loading), Footer.
 * Does NOT own device data — receives it via props.
 *
 * Layout: rounded-[22px] glass container, matching DeviceCard radius.
 *
 * @prop devices    — Array of Device objects
 * @prop loading    — Show loading skeleton (default false)
 * @prop selectedId — Currently selected device id (visual only)
 *
 * @slot empty — Override the default empty state
 *
 * Design Tokens Used:
 *   --color-card, --color-border, --radius-lg
 *
 * Component Maturity: Production Ready
 * Reusable by Dashboard, Search Results, SNMP, Inspection, Alarm Center, Topology.
 */
withDefaults(
  defineProps<{
    devices: Device[]
    loading?: boolean
    selectedId?: string
  }>(),
  { loading: false, selectedId: undefined },
)

defineSlots<{
  empty?(): unknown
}>()
</script>

<template>
  <div
    class="overflow-hidden rounded-[22px] border border-white/70 bg-white/72 shadow-[0_12px_32px_rgba(31,41,55,0.055)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8"
  >
    <!-- Virtual list anchor (future) -->
    <DeviceListVirtualPlaceholder />

    <!-- Loading state -->
    <DeviceListLoading v-if="loading" />

    <!-- Empty state -->
    <div v-else-if="devices.length === 0">
      <slot name="empty">
        <DeviceListEmpty />
      </slot>
    </div>

    <!-- Normal state -->
    <template v-else>
      <DeviceListHeader />
      <DeviceListContent :devices="devices" :selected-id="selectedId" />
      <DeviceListFooter :total="devices.length" />
    </template>
  </div>
</template>
