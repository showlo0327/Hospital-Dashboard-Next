<script setup lang="ts">
/**
 * WorkspacePlaceholder — visual placeholder for list and grid views.
 * Shows the general layout shape without any business data.
 */

defineProps<{
  variant: 'list' | 'grid'
}>()
</script>

<template>
  <!-- ─── List View Placeholder ─── -->
  <div
    v-if="variant === 'list'"
    class="overflow-hidden rounded-[28px] border border-dashed border-border/60 bg-white/50 p-6 backdrop-blur-xl dark:bg-white/5"
  >
    <div class="space-y-3">
      <!-- Table header placeholder -->
      <div class="flex gap-4 rounded-xl bg-muted/40 px-4 py-3">
        <div
          v-for="i in 6"
          :key="i"
          class="h-3 rounded-full bg-muted-foreground/15"
          :style="{ width: `${60 + i * 20}px` }"
        />
      </div>
      <!-- Row placeholders -->
      <div
        v-for="row in 6"
        :key="row"
        class="flex gap-4 border-t border-border/30 px-4 py-3"
      >
        <div
          v-for="col in 6"
          :key="col"
          class="h-3 rounded-full bg-muted-foreground/8"
          :style="{ width: `${40 + col * 25}px` }"
        />
      </div>
    </div>
  </div>

  <!-- ─── Grid View Placeholder ─── -->
  <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    <div
      v-for="card in 6"
      :key="card"
      class="min-h-[258px] rounded-[22px] border border-dashed border-border/60 bg-white/50 p-3.5 backdrop-blur-xl dark:bg-white/5"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="h-4 w-3/4 rounded-full bg-muted-foreground/15" />
          <div class="h-3 w-1/2 rounded-full bg-muted-foreground/8" />
        </div>
        <div class="h-5 w-16 rounded-full bg-muted-foreground/8" />
      </div>
      <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div
          v-for="i in 4"
          :key="i"
          class="space-y-1"
        >
          <div class="h-2.5 w-10 rounded-full bg-muted-foreground/8" />
          <div class="h-3 w-16 rounded-full bg-muted-foreground/12" />
        </div>
      </div>
      <div class="mt-3 rounded-2xl bg-muted/25 p-2.5">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="i in 2"
            :key="i"
            class="space-y-1"
          >
            <div class="h-2.5 w-8 rounded-full bg-muted-foreground/8" />
            <div class="h-3 w-12 rounded-full bg-muted-foreground/12" />
          </div>
        </div>
      </div>
      <div class="mt-2.5 h-[38px] rounded-xl bg-muted-foreground/5" />
      <div class="mt-2 border-t border-border/30 pt-2">
        <div class="h-2.5 w-24 rounded-full bg-muted-foreground/8" />
      </div>
    </div>
  </div>
</template>
