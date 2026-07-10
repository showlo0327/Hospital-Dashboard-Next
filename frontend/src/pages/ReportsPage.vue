<script setup lang="ts">
import { HardDrive, Clock } from 'lucide-vue-next'
</script>

<template>
  <div>
    <p class="text-sm font-semibold text-primary">Analytics</p>
    <h2 class="mt-1 text-[26px] font-bold tracking-[-0.01em]">Reports</h2>

    <div class="mt-12 flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div class="grid size-16 place-items-center rounded-[22px] bg-muted/60 dark:bg-muted/20">
        <HardDrive :size="28" class="text-muted-foreground/50" />
      </div>
      <h3 class="text-[17px] font-semibold">Coming Soon</h3>
      <p class="max-w-[320px] text-[13px] leading-relaxed text-muted-foreground">
        Customizable reports — device inventory, availability, performance trends, and export to PDF/Excel.
      </p>
      <div class="flex items-center gap-1.5 rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-medium text-muted-foreground dark:bg-white/8">
        <Clock :size="12" />
        Planned for v3.4
      </div>
    </div>
  </div>
</template>
