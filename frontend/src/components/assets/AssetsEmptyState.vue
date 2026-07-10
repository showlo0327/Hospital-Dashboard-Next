<script setup lang="ts">
import { Upload } from 'lucide-vue-next'

/**
 * Premium empty state for Assets page.
 * Shown when no devices match search/filter criteria.
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="grid size-[72px] place-items-center rounded-[24px] bg-muted/60 shadow-inner dark:bg-white/5">
      <Upload :size="32" class="text-muted-foreground/40" />
    </div>
    <p class="mt-5 text-[15px] font-semibold">No Assets</p>
    <p class="mt-1.5 max-w-[280px] text-center text-[13px] leading-5 text-muted-foreground">
      Import your first CSV to begin managing hospital network assets.
    </p>
  </div>
</template>
