<script setup lang="ts">
import { List, Grid3X3 } from 'lucide-vue-next'

/**
 * Segmented List/Grid view switch for the workspace.
 * Exclusive layout toggle — the only view switch in the application.
 */
defineProps<{
  modelValue: 'list' | 'grid'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: 'list' | 'grid']
}>()

function select(value: 'list' | 'grid') {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="flex rounded-2xl border border-border bg-white/60 p-1 shadow-sm backdrop-blur-xl dark:bg-white/8"
  >
    <button
      class="seg"
      :class="{ 'seg-on': modelValue === 'list' }"
      @click="select('list')"
    >
      <List :size="15" />
      List
    </button>
    <button
      class="seg"
      :class="{ 'seg-on': modelValue === 'grid' }"
      @click="select('grid')"
    >
      <Grid3X3 :size="15" />
      Grid
    </button>
  </div>
</template>
