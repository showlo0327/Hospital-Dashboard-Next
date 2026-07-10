<script setup lang="ts">
import type { Device } from '@/types/device'
import InspectorHeader from './InspectorHeader.vue'
import InspectorSection from './InspectorSection.vue'
import InspectorDivider from './InspectorDivider.vue'
import InspectorFooter from './InspectorFooter.vue'
import InspectorOverview from './InspectorOverview.vue'
import InspectorRealtime from './InspectorRealtime.vue'
import InspectorPingHistory from './InspectorPingHistory.vue'
import InspectorFutureModules from './InspectorFutureModules.vue'
import InspectorEmpty from './InspectorEmpty.vue'
import InspectorLoading from './InspectorLoading.vue'

/**
 * Device Inspector — full detail panel for a selected device.
 *
 * Layout: Header → Divider → Overview → Realtime → Ping History → Future Modules → Footer
 *
 * @prop device  — Selected device (null = empty state)
 * @prop loading — Show loading skeleton
 *
 * Component Maturity: Production Ready
 * Reusable by Dashboard, Search Results, SNMP, Inspection, Alarm Center, Topology.
 */
defineProps<{
  device: Device | null
  loading?: boolean
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <InspectorLoading v-if="loading" />

    <!-- Empty state -->
    <InspectorEmpty v-else-if="!device" />

    <!-- Device detail -->
    <template v-else>
      <InspectorHeader :device="device" />
      <InspectorDivider />
      <InspectorOverview :device="device" />
      <InspectorDivider />
      <InspectorRealtime :device="device" />
      <InspectorDivider />
      <InspectorPingHistory :device="device" />
      <InspectorDivider />
      <InspectorFutureModules />
      <InspectorFooter />
    </template>
  </div>
</template>
