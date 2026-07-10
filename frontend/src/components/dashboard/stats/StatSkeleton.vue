<script setup lang="ts">
/**
 * Loading skeleton for StatCard.
 * Matches the exact dimensions of a stat card with pulsing placeholder shapes.
 */
</script>

<template>
  <div
    class="animate-pulse rounded-[20px] border border-white/50 bg-white/40 p-3.5 backdrop-blur-xl dark:border-white/5 dark:bg-white/4"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="h-3 w-20 rounded-full bg-muted-foreground/15" />
      <div class="size-8 rounded-[14px] bg-muted-foreground/10" />
    </div>
    <div class="mt-1.5 h-7 w-14 rounded-lg bg-muted-foreground/12" />
    <div class="mt-1.5 h-3 w-24 rounded-full bg-muted-foreground/10" />
  </div>
</template>
