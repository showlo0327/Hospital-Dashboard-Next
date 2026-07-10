<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceCard from './DeviceCard.vue'
import DeviceGridSkeleton from './DeviceGridSkeleton.vue'
import { ServerCrash } from 'lucide-vue-next'

/**
 * Device Grid — responsive grid layout composing DeviceCard instances.
 *
 * Reuses DeviceCard unchanged — zero UI duplication.
 *
 * Layout:
 *   Desktop (≥xl): 3 columns
 *   Tablet (≥md):  2 columns
 *   Mobile:        1 column
 *
 * @prop devices    — Array of Device objects
 * @prop loading    — Show skeleton grid (default false)
 * @prop selectedId — Currently selected device id (visual only)
 *
 * @slot empty — Override the default empty state
 *
 * Design Tokens Used:
 *   --radius-lg, --color-muted, --color-muted-foreground
 *
 * Component Maturity: Production Ready
 * Reusable by Dashboard, Search Results, Assets Preview, future modules.
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
  <!-- Loading: skeleton grid -->
  <DeviceGridSkeleton v-if="loading" />

  <!-- Empty state -->
  <div
    v-else-if="devices.length === 0"
    class="flex flex-col items-center justify-center rounded-[22px] border border-white/70 bg-white/72 py-20 shadow-[0_12px_32px_rgba(31,41,55,0.055)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8"
  >
    <slot name="empty">
      <div class="grid size-16 place-items-center rounded-[20px] bg-muted/60 dark:bg-muted/20">
        <ServerCrash :size="28" class="text-muted-foreground/50" />
      </div>
      <p class="mt-4 text-[15px] font-semibold">No devices found</p>
      <p class="mt-1 text-[13px] text-muted-foreground">
        Try adjusting your search or filter criteria.
      </p>
    </slot>
  </div>

  <!-- Normal: responsive grid -->
  <div
    v-else
    class="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
  >
    <DeviceCard
      v-for="device in devices"
      :key="device.id"
      :device="device"
      :selected="device.id === selectedId"
    />
  </div>
</template>
