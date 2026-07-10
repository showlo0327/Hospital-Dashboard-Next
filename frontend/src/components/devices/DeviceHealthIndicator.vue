<script setup lang="ts">
import { DeviceStatus } from '@/types/device'

/**
 * Availability percentage display with color-coded ring.
 *
 * Thresholds:
 *   ≥ 99.9% → Green
 *   ≥ 99.0% → Orange
 *   < 99.0% → Red
 *
 * @prop availability — Uptime percentage (0-100)
 * @prop status       — DeviceStatus enum (Offline shows muted state)
 *
 * Design Tokens Used:
 *   --color-chart-2, --color-chart-3, --color-chart-5
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  availability: number
  status: DeviceStatus
}>()
</script>

<template>
  <div class="flex items-center gap-1.5">
    <span
      class="inline-block size-2 shrink-0 rounded-full"
      :class="{
        'bg-[#34C759] dark:bg-[#30D158]':
          status !== DeviceStatus.Offline && availability >= 99.9,
        'bg-[#FF9500] dark:bg-[#FF9F0A]':
          status !== DeviceStatus.Offline &&
          availability >= 99.0 &&
          availability < 99.9,
        'bg-[#FF3B30] dark:bg-[#FF453A]':
          status !== DeviceStatus.Offline && availability < 99.0,
        'bg-muted-foreground/40': status === DeviceStatus.Offline,
      }"
    />
    <span class="text-[12px] font-semibold tabular-nums">
      {{ status === DeviceStatus.Offline ? '—' : availability.toFixed(2) }}%
    </span>
  </div>
</template>
