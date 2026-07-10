<script setup lang="ts">
import { computed } from 'vue'
import type { Device } from '@/types/device'
import { useUIStore } from '@/stores/ui'
import { DeviceStatus, getDeviceDisplayName } from '@/types/device'
import { formatDeviceLocation } from '@/utils/location'
import DeviceIcon from './DeviceIcon.vue'
import DeviceStatusBadge from './DeviceStatusBadge.vue'
import DeviceInfo from './DeviceInfo.vue'
import DeviceVendor from './DeviceVendor.vue'
import DeviceModel from './DeviceModel.vue'
import DeviceLatency from './DeviceLatency.vue'
import DeviceHealthIndicator from './DeviceHealthIndicator.vue'
import DeviceSparkline from './DeviceSparkline.vue'
import DeviceUpdatedTime from './DeviceUpdatedTime.vue'
import DeviceActions from './DeviceActions.vue'

/**
 * Composed device card — Apple widget style with clear visual hierarchy.
 *
 * Information hierarchy:
 *   Level 1 — Device Name (17px semibold)
 *   Level 2 — IP Address (13px monospace, secondary)
 *   Level 3 — Location Path (12px muted, single line, ellipsis + tooltip)
 *
 * Shared by: Grid View, Search Results, future Assets Preview.
 *
 * @prop device   — Full Device object
 * @prop selected — Whether card is in selected state
 *
 * @slot actions — Inject custom action buttons into DeviceActions
 */
const props = withDefaults(
  defineProps<{
    device: Device
    selected?: boolean
  }>(),
  { selected: false },
)

const ui = useUIStore()

const locationPath = computed(() => formatDeviceLocation(props.device))

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
  <div
    class="group relative min-h-[258px] cursor-pointer rounded-[22px] border p-3.5 shadow-[0_14px_38px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-150"
    @click="ui.openInspector(props.device.id)"
    :class="
      props.selected
        ? 'scale-[1.01] border-primary/40 bg-white/92 shadow-[0_16px_44px_rgba(0,122,255,0.15)] ring-1 ring-primary/30 dark:border-primary/40 dark:bg-white/14 dark:shadow-[0_16px_44px_rgba(10,132,255,0.18)] dark:ring-primary/30'
        : 'border-white/70 bg-white/80 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/8 dark:hover:shadow-[0_20px_55px_rgba(0,0,0,0.35)]'
    "
  >
    <!-- ═══ Row 1: Icon + Name + Badge ═══ -->
    <div class="flex items-start gap-3">
      <DeviceIcon :type="props.device.type" />
      <div class="min-w-0 flex-1">
        <!-- Level 1: Device Name — 17px semibold -->
        <h3 class="truncate text-[17px] font-semibold leading-[1.3]">{{ props.device.name }}</h3>
        <!-- Level 2: IP Address — 13px monospace -->
        <p
          class="mt-0.5 truncate font-mono text-[13px] leading-[1.35] text-muted-foreground"
          style="font-family: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;"
        >{{ props.device.ip }}</p>
        <!-- Level 3: Location Path — 12px muted, up to 2 lines, tooltip -->
        <p
          class="mt-1 line-clamp-2 text-[12px] leading-[1.35] text-muted-foreground/75"
          :title="locationPath"
        >{{ locationPath }}</p>
      </div>
      <DeviceStatusBadge :status="props.device.status" class="shrink-0" />
    </div>

    <!-- ═══ Row 2: Secondary info grid ═══ -->
    <div class="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
      <DeviceInfo label="Type" :value="getDeviceDisplayName(props.device.type)" />
      <DeviceVendor :vendor="props.device.vendor" />
      <DeviceModel :model="props.device.model" />
    </div>

    <!-- ═══ Row 3: Metrics box ═══ -->
    <div class="mt-2 rounded-2xl bg-muted/45 px-2.5 py-2 dark:bg-muted/20">
      <div class="flex items-center justify-between">
        <DeviceLatency :latency="props.device.latency" :status="props.device.status" />
        <DeviceHealthIndicator
          :availability="props.device.availability"
          :status="props.device.status"
        />
      </div>
      <div class="mt-1 h-[34px]">
        <DeviceSparkline
          :values="props.device.history"
          :color="sparklineColor(props.device.status)"
          :height="34"
        />
      </div>
    </div>

    <!-- ═══ Row 4: Footer ═══ -->
    <div class="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
      <DeviceUpdatedTime :time="props.device.updated" />
      <DeviceActions>
        <slot name="actions" />
      </DeviceActions>
    </div>
  </div>
</template>
