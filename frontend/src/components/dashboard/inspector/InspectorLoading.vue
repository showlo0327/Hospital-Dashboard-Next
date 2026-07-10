<script setup lang="ts">
/**
 * Loading skeleton for inspector panel.
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="animate-pulse space-y-4">
    <!-- Header skeleton -->
    <div class="flex items-start gap-3">
      <div class="size-[42px] shrink-0 rounded-[13px] bg-muted-foreground/10" />
      <div class="min-w-0 flex-1 space-y-1.5">
        <div class="h-4 w-28 rounded-full bg-muted-foreground/12" />
        <div class="h-3 w-20 rounded-full bg-muted-foreground/8" />
      </div>
      <div class="h-5 w-16 rounded-full bg-muted-foreground/10" />
    </div>

    <!-- Sections -->
    <div v-for="s in 4" :key="s" class="space-y-2">
      <div class="h-2.5 w-16 rounded-full bg-muted-foreground/10" />
      <div class="grid grid-cols-2 gap-2">
        <div v-for="f in 4" :key="f" class="space-y-1">
          <div class="h-2 w-10 rounded-full bg-muted-foreground/8" />
          <div class="h-3 w-16 rounded-full bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  </div>
</template>
