<script setup lang="ts">
import { ServerCrash } from 'lucide-vue-next'

/**
 * Empty state — shown when device list has zero results.
 *
 * Future: dynamic message based on filter/search context.
 *
 * Design Tokens Used:
 *   --color-muted, --color-muted-foreground
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="grid size-16 place-items-center rounded-[20px] bg-muted/60 dark:bg-muted/20">
      <ServerCrash :size="28" class="text-muted-foreground/50" />
    </div>
    <p class="mt-4 text-[15px] font-semibold">No devices found</p>
    <p class="mt-1 text-[13px] text-muted-foreground">
      Try adjusting your search or filter criteria.
    </p>
  </div>
</template>
