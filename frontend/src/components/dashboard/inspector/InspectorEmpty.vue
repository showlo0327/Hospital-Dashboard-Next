<script setup lang="ts">
import { Monitor } from 'lucide-vue-next'

/**
 * Premium empty state — shown when no device is selected.
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div
      class="grid size-[72px] place-items-center rounded-[24px] bg-muted/60 shadow-inner dark:bg-white/5"
    >
      <Monitor :size="32" class="text-muted-foreground/40" />
    </div>
    <p class="mt-5 text-[15px] font-semibold">No device selected</p>
    <p class="mt-1.5 max-w-[220px] text-[13px] leading-5 text-muted-foreground">
      Select a device from the list or grid to view detailed information.
    </p>
  </div>
</template>
