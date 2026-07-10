<script setup lang="ts">
/**
 * Device list footer — shows device count and pagination placeholder.
 *
 * @prop total — Total number of devices in the list
 *
 * Future: pagination controls, page-size selector.
 *
 * Design Tokens Used:
 *   --color-muted-foreground, --color-border
 *
 * Component Maturity: Stable
 */
defineProps<{
  total: number
}>()
</script>

<template>
  <div
    class="flex items-center justify-between rounded-b-[22px] border-t border-border/40 bg-muted/20 px-4 py-2"
  >
    <p class="text-[11px] text-muted-foreground">
      {{ total }} device{{ total !== 1 ? 's' : '' }}
    </p>
    <!-- Pagination placeholder — future -->
    <div class="flex items-center gap-1">
      <span class="text-[11px] text-muted-foreground/60">Page 1 of 1</span>
    </div>
  </div>
</template>
