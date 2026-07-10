<script setup lang="ts">
import { Filter } from 'lucide-vue-next'

/**
 * Workspace filter button — toggles dashboard filter panel.
 *
 * @prop active — whether filter panel is open
 *
 * @emits toggle
 *
 * Component Maturity: Production Ready
 */
defineProps<{ active?: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="toolbar"
    :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': active }"
    @click="emit('toggle')"
  >
    <Filter :size="15" />
    <span class="hidden sm:inline">Filter</span>
  </button>
</template>
