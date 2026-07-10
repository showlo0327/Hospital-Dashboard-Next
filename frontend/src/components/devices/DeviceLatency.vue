<script setup lang="ts">
import { DeviceStatus } from '@/types/device'

/**
 * Latency display with traffic-light color coding.
 *
 * Thresholds:
 *   < 20ms  → Green (healthy)
 *   20-100ms → Orange (degraded)
 *   > 100ms → Red (critical)
 *   Offline  → Gray (no data)
 *
 * @prop latency — Round-trip time in milliseconds
 * @prop status  — DeviceStatus enum (Offline shows muted state)
 *
 * Design Tokens Used:
 *   --color-chart-2 (#34C759), --color-chart-3 (#FF9500),
 *   --color-chart-5 (#FF3B30), --color-muted-foreground
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  latency: number
  status: DeviceStatus
}>()
</script>

<template>
  <div class="flex items-baseline gap-1">
    <span
      class="text-[19px] font-bold leading-none tracking-[-0.005em] transition-colors duration-200"
      :class="{
        'text-[#1f8b3b] dark:text-[#30D158]':
          status === DeviceStatus.Online && latency < 20,
        'text-[#a65b00] dark:text-[#FF9F0A]':
          status !== DeviceStatus.Offline && latency >= 20 && latency <= 100,
        'text-[#b42318] dark:text-[#FF453A]':
          status !== DeviceStatus.Offline && latency > 100,
        'text-muted-foreground': status === DeviceStatus.Offline,
      }"
    >
      {{ status === DeviceStatus.Offline ? '—' : latency }}
    </span>
    <span class="text-[11px] text-muted-foreground">ms</span>
  </div>
</template>
