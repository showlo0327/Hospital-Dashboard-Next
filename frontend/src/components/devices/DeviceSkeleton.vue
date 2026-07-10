<script setup lang="ts">
/**
 * Loading skeleton matching DeviceCard dimensions exactly.
 * Pulsing animation with placeholder shapes for all card sections.
 *
 * Design Tokens Used:
 *   --color-muted-foreground, --color-border, --radius-lg
 */
</script>

<template>
  <div
    class="animate-pulse rounded-[22px] border border-white/50 bg-white/40 p-3.5 backdrop-blur-xl dark:border-white/5 dark:bg-white/4"
  >
    <!-- Header row: icon + name/IP + badge -->
    <div class="flex items-start gap-3">
      <div class="size-[42px] shrink-0 rounded-[13px] bg-muted-foreground/10" />
      <div class="min-w-0 flex-1">
        <div class="h-4 w-28 rounded-full bg-muted-foreground/12" />
        <div class="mt-1.5 h-3 w-20 rounded-full bg-muted-foreground/8" />
      </div>
      <div class="h-5 w-16 rounded-full bg-muted-foreground/10" />
    </div>

    <!-- Info grid: 2 columns -->
    <div class="mt-3 grid grid-cols-2 gap-2">
      <div v-for="_ in 4" :key="_" class="space-y-1">
        <div class="h-2.5 w-12 rounded-full bg-muted-foreground/10" />
        <div class="h-3 w-20 rounded-full bg-muted-foreground/12" />
      </div>
    </div>

    <!-- Metrics box -->
    <div class="mt-2.5 rounded-2xl bg-muted-foreground/5 p-2.5">
      <div class="flex items-center justify-between gap-3">
        <div class="h-6 w-16 rounded-lg bg-muted-foreground/10" />
        <div class="h-4 w-14 rounded-full bg-muted-foreground/8" />
      </div>
      <div class="mt-2 h-[34px] w-full rounded-lg bg-muted-foreground/6" />
    </div>

    <!-- Updated time -->
    <div class="mt-2.5 border-t border-border/50 pt-2">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/8" />
    </div>
  </div>
</template>
