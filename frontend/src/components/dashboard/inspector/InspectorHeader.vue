<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceIcon from '@/components/devices/DeviceIcon.vue'
import DeviceStatusBadge from '@/components/devices/DeviceStatusBadge.vue'
import { MoreHorizontal } from 'lucide-vue-next'

/**
 * Inspector header — device icon, name, status, quick actions.
 *
 * @prop device — Selected device
 *
 * Component Maturity: Production Ready
 */
defineProps<{ device: Device }>()
</script>

<template>
  <div class="flex items-start gap-3">
    <DeviceIcon :type="device.type" />
    <div class="min-w-0 flex-1">
      <h3 class="truncate text-[15px] font-semibold leading-5">{{ device.name }}</h3>
      <p class="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
        {{ device.ip }}
      </p>
    </div>
    <div class="flex shrink-0 items-center gap-1.5">
      <DeviceStatusBadge :status="device.status" />
      <button
        class="grid size-7 place-items-center rounded-[10px] text-muted-foreground transition hover:bg-muted/60"
        aria-label="More actions"
      >
        <MoreHorizontal :size="15" />
      </button>
    </div>
  </div>
</template>
