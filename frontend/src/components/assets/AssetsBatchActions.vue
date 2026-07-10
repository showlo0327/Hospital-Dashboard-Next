<script setup lang="ts">
import { Trash2, Tag, Archive } from 'lucide-vue-next'

/**
 * Batch action bar — appears when rows are selected.
 *
 * @prop selectedCount — Number of selected rows
 *
 * @emits clear   — Deselect all
 * @emits delete  — Batch delete selected
 *
 * Component Maturity: Production Ready
 */
defineProps<{ selectedCount: number }>()
const emit = defineEmits<{ clear: []; delete: [] }>()
</script>

<template>
  <div
    v-if="selectedCount > 0"
    class="flex items-center gap-2 rounded-[15px] border border-primary/20 bg-primary/[0.06] px-3 py-2 dark:bg-primary/[0.10]"
  >
    <span class="text-[13px] font-semibold text-primary">
      {{ selectedCount }} selected
    </span>
    <div class="h-5 w-px bg-primary/20" />
    <button class="toolbar gap-1.5 text-[12px]">
      <Tag :size="13" />
      <span class="hidden sm:inline">Tag</span>
    </button>
    <button class="toolbar gap-1.5 text-[12px]">
      <Archive :size="13" />
      <span class="hidden sm:inline">Archive</span>
    </button>
    <button class="toolbar gap-1.5 text-[12px] text-destructive" @click="emit('delete')">
      <Trash2 :size="13" />
      <span class="hidden sm:inline">Delete</span>
    </button>
    <button
      class="ml-auto text-[12px] text-muted-foreground transition hover:text-foreground"
      @click="emit('clear')"
    >
      Clear
    </button>
  </div>
</template>
