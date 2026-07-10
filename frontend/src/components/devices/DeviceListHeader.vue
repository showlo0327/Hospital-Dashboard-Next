<script setup lang="ts">
/**
 * Column header row for the Device List table.
 *
 * Pure presentational — no sorting or click logic (future).
 *
 * Design Tokens Used:
 *   --color-muted, --color-muted-foreground, --color-border
 *
 * Component Maturity: Stable
 * Ready for future sort-direction indicators.
 */
</script>

<template>
  <div
    class="sticky top-0 z-10 flex items-center gap-3 rounded-t-[22px] border-b border-border/40 bg-muted/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
  >
    <span class="w-9 shrink-0" />
    <span class="min-w-0 flex-[2]">Device</span>
    <span class="hidden w-[100px] shrink-0 lg:block">Type</span>
    <span class="hidden w-[90px] shrink-0 xl:block">Vendor</span>
    <span class="hidden w-[120px] shrink-0 xl:block">Location</span>
    <span class="w-[72px] shrink-0 text-right">Status</span>
    <span class="w-[68px] shrink-0 text-right">Latency</span>
    <span class="hidden w-[80px] shrink-0 text-right sm:block">Updated</span>
  </div>
</template>
