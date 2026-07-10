<script setup lang="ts">
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

/**
 * Optional trend indicator badge.
 * Shows direction and value change for future integration with live data.
 */
defineProps<{
  value: string
  trend: 'up' | 'down' | 'neutral'
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1 text-[11px] font-semibold">
    <TrendingUp v-if="trend === 'up'" :size="12" class="text-chart-2" />
    <TrendingDown v-else-if="trend === 'down'" :size="12" class="text-chart-5" />
    <Minus v-else :size="12" class="text-muted-foreground" />
    {{ value }}
  </span>
</template>
