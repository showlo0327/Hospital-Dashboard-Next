<script setup lang="ts">
import { DeviceStatus } from '@/types/device'

/**
 * Colored status pill badge for device status display.
 *
 * States: Online (green), Warning (orange), Offline (red),
 *         Maintenance (indigo), Unknown (gray)
 *
 * @prop status — DeviceStatus enum value
 *
 * Design Tokens Used:
 *   --color-chart-2 (#34C759), --color-chart-3 (#FF9500),
 *   --color-chart-5 (#FF3B30), --color-chart-4 (#5E5CE6)
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  status: DeviceStatus
}>()

const statusMap: Record<DeviceStatus, { bg: string; text: string; ring: string; dot: string }> = {
  [DeviceStatus.Online]: {
    bg: 'bg-[#34C759]/10 dark:bg-[#30D158]/12',
    text: 'text-[#1f8b3b] dark:text-[#30D158]',
    ring: 'ring-[#34C759]/30 dark:ring-[#30D158]/30',
    dot: 'bg-[#34C759] dark:bg-[#30D158]',
  },
  [DeviceStatus.Warning]: {
    bg: 'bg-[#FF9500]/10 dark:bg-[#FF9F0A]/12',
    text: 'text-[#a65b00] dark:text-[#FF9F0A]',
    ring: 'ring-[#FF9500]/30 dark:ring-[#FF9F0A]/30',
    dot: 'bg-[#FF9500] dark:bg-[#FF9F0A]',
  },
  [DeviceStatus.Offline]: {
    bg: 'bg-[#FF3B30]/10 dark:bg-[#FF453A]/12',
    text: 'text-[#b42318] dark:text-[#FF453A]',
    ring: 'ring-[#FF3B30]/30 dark:ring-[#FF453A]/30',
    dot: 'bg-[#FF3B30] dark:bg-[#FF453A]',
  },
  [DeviceStatus.Maintenance]: {
    bg: 'bg-[#5E5CE6]/10 dark:bg-[#5E5CE6]/12',
    text: 'text-[#4a47d1] dark:text-[#8b88f0]',
    ring: 'ring-[#5E5CE6]/30 dark:ring-[#5E5CE6]/30',
    dot: 'bg-[#5E5CE6] dark:bg-[#5E5CE6]',
  },
  [DeviceStatus.Unknown]: {
    bg: 'bg-muted/60 dark:bg-muted/20',
    text: 'text-muted-foreground',
    ring: 'ring-muted-foreground/20',
    dot: 'bg-muted-foreground',
  },
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 transition-colors duration-150"
    :class="[statusMap[status].bg, statusMap[status].text, statusMap[status].ring]"
  >
    <span class="size-1.5 shrink-0 rounded-full" :class="statusMap[status].dot" />
    {{ status }}
  </span>
</template>
