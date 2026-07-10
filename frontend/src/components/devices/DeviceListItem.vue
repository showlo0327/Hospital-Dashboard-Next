<script setup lang="ts">
import type { Device } from '@/types/device'
import { useUIStore } from '@/stores/ui'
import { DeviceStatus, getDeviceDisplayName } from '@/types/device'
import DeviceIcon from './DeviceIcon.vue'
import DeviceHeader from './DeviceHeader.vue'
import DeviceStatusBadge from './DeviceStatusBadge.vue'
import DeviceLatency from './DeviceLatency.vue'
import DeviceUpdatedTime from './DeviceUpdatedTime.vue'
import { formatDeviceLocation } from '@/utils/location'

/**
 * Single row in the Device List table.
 *
 * Composes atomic device sub-components horizontally (NOT wrapped in DeviceCard).
 * Reuses: DeviceIcon, DeviceHeader, DeviceStatusBadge, DeviceLatency, DeviceUpdatedTime.
 *
 * @prop device   — Full Device object
 * @prop selected — Visual selected state (default false)
 *
 * Design Tokens Used:
 *   --color-border, --color-muted, --color-primary
 *
 * Component Maturity: Production Ready
 */
const ui = useUIStore()

withDefaults(
  defineProps<{
    device: Device
    selected?: boolean
  }>(),
  { selected: false },
)
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-3 border-b border-border/30 px-4 py-2.5 transition duration-150 last:border-b-0" @click="ui.openInspector(device.id)"
    :class="
      selected
        ? 'bg-primary/[0.06] dark:bg-primary/[0.10]'
        : 'hover:bg-muted/30 dark:hover:bg-white/[0.03]'
    "
  >
    <!-- Icon -->
    <div class="w-9 shrink-0">
      <DeviceIcon :type="device.type" :size="16" />
    </div>

    <!-- Device name + IP (flex-2) -->
    <div class="min-w-0 flex-[2]">
      <DeviceHeader :name="device.name" :ip="device.ip" />
    </div>

    <!-- Type (hidden on small) -->
    <span
      class="hidden w-[100px] shrink-0 truncate text-[12px] font-semibold text-muted-foreground lg:block"
    >
      {{ getDeviceDisplayName(device.type) }}
    </span>

    <!-- Vendor (hidden on small) -->
    <span class="hidden w-[90px] shrink-0 truncate text-[12px] xl:block">
      {{ device.vendor }}
    </span>

    <!-- Location (hidden on small) -->
    <span class="hidden w-[120px] shrink-0 truncate text-[12px] xl:block">
      {{ formatDeviceLocation(device) }}
    </span>

    <!-- Status -->
    <div class="w-[72px] shrink-0 text-right">
      <DeviceStatusBadge :status="device.status" />
    </div>

    <!-- Latency -->
    <div class="w-[68px] shrink-0 text-right">
      <DeviceLatency :latency="device.latency" :status="device.status" />
    </div>

    <!-- Updated (hidden on small) -->
    <div class="hidden w-[80px] shrink-0 text-right sm:block">
      <DeviceUpdatedTime :time="device.updated" />
    </div>
  </div>
</template>
