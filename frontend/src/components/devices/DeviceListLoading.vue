<script setup lang="ts">
/**
 * Loading skeleton for the Device List table.
 *
 * Renders 8 pulsing row placeholders matching DeviceListItem dimensions
 * plus a header skeleton. Identical column layout to real list.
 *
 * Design Tokens Used:
 *   --color-muted-foreground, --color-border
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="animate-pulse">
    <!-- Header skeleton -->
    <div
      class="flex items-center gap-3 rounded-t-[22px] border-b border-border/40 bg-muted/40 px-4 py-2.5"
    >
      <div class="h-3 w-9 rounded-full bg-muted-foreground/12" />
      <div class="h-3 flex-[2] rounded-full bg-muted-foreground/12" />
      <div class="hidden h-3 w-[100px] rounded-full bg-muted-foreground/12 lg:block" />
      <div class="hidden h-3 w-[90px] rounded-full bg-muted-foreground/12 xl:block" />
      <div class="hidden h-3 w-[120px] rounded-full bg-muted-foreground/12 xl:block" />
      <div class="h-3 w-[72px] rounded-full bg-muted-foreground/12" />
      <div class="h-3 w-[68px] rounded-full bg-muted-foreground/12" />
      <div class="hidden h-3 w-[80px] rounded-full bg-muted-foreground/12 sm:block" />
    </div>

    <!-- Row skeletons -->
    <div
      v-for="n in 8"
      :key="n"
      class="flex items-center gap-3 border-b border-border/30 px-4 py-2.5 last:border-b-0"
    >
      <div class="size-[34px] shrink-0 rounded-[11px] bg-muted-foreground/8" />
      <div class="min-w-0 flex-[2] space-y-1.5">
        <div class="h-3.5 w-32 rounded-full bg-muted-foreground/10" />
        <div class="h-2.5 w-20 rounded-full bg-muted-foreground/6" />
      </div>
      <div class="hidden h-3 w-[100px] rounded-full bg-muted-foreground/8 lg:block" />
      <div class="hidden h-3 w-[90px] rounded-full bg-muted-foreground/8 xl:block" />
      <div class="hidden h-3 w-[120px] rounded-full bg-muted-foreground/8 xl:block" />
      <div class="h-5 w-[72px] rounded-full bg-muted-foreground/8" />
      <div class="h-4 w-[68px] rounded-full bg-muted-foreground/8" />
      <div class="hidden h-2.5 w-[80px] rounded-full bg-muted-foreground/6 sm:block" />
    </div>
  </div>
</template>
