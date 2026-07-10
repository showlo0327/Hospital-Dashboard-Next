<script setup lang="ts">
import type { Device } from '@/types/device'
import { DeviceStatus } from '@/types/device'
import DeviceSparkline from '@/components/devices/DeviceSparkline.vue'
import InspectorSection from './InspectorSection.vue'

/**
 * Ping history section — large sparkline with summary stats.
 *
 * @prop device — Selected device
 *
 * Future: API will deliver 30-point history in real time via Ping Engine.
 *
 * Component Maturity: Production Ready
 */
defineProps<{ device: Device }>()

function sparklineColor(status: DeviceStatus): string {
  switch (status) {
    case DeviceStatus.Online:
      return 'text-[#34C759] dark:text-[#30D158]'
    case DeviceStatus.Warning:
      return 'text-[#FF9500] dark:text-[#FF9F0A]'
    default:
      return 'text-muted-foreground/40'
  }
}
</script>

<template>
  <InspectorSection title="Ping History">
    <div class="rounded-2xl bg-muted/45 p-3 dark:bg-muted/20">
      <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span>Last 30 pings</span>
        <span>{{ device.latency }}ms avg</span>
      </div>
      <div class="mt-2 h-[60px] w-full">
        <DeviceSparkline
          :values="device.history"
          :color="sparklineColor(device.status)"
          :height="60"
        />
      </div>
      <div class="mt-2 flex justify-between text-[10px] text-muted-foreground/60">
        <span>30s ago</span>
        <span>now</span>
      </div>
    </div>
  </InspectorSection>
</template>
