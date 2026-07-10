<script setup lang="ts">
import { Search, SlidersHorizontal, Upload, Plus } from 'lucide-vue-next'

/**
 * Assets toolbar — add device + search input + filter toggle + import/export.
 *
 * Final button order: + Add Device | Import CSV | Export CSV | Filter | [Search...]
 *
 * @prop searchQuery   — Current search text (v-model)
 * @prop filterOpen    — Whether filter panel is visible
 *
 * @emits update:searchQuery
 * @emits toggleFilter
 * @emits import
 * @emits export
 * @emits add
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  searchQuery: string
  filterOpen: boolean
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  toggleFilter: []
  import: []
  add: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <!-- + Add Device (primary action) -->
    <button
      type="button"
      class="toolbar-primary gap-1.5"
      @click="emit('add')"
    >
      <Plus :size="15" />
      <span class="hidden sm:inline">Add Device</span>
    </button>

    <!-- Import CSV -->
    <button type="button" class="toolbar gap-1.5" @click="emit('import')">
      <Upload :size="14" />
      <span class="hidden sm:inline">Import CSV</span>
    </button>

    <!-- Filter toggle -->
    <button
      type="button"
      class="toolbar gap-1.5"
      :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': filterOpen }"
      @click="emit('toggleFilter')"
    >
      <SlidersHorizontal :size="14" />
      <span class="hidden sm:inline">Filter</span>
    </button>

    <!-- Search -->
    <div class="relative flex-1 min-w-[240px] max-w-[420px]">
      <Search
        :size="15"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
      />
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search devices by name, IP, vendor, model..."
        class="h-9 w-full rounded-[15px] border border-border bg-white/48 pl-9 pr-3 text-[13px] font-medium text-foreground placeholder:text-muted-foreground/40 shadow-sm outline-none transition duration-150 focus:border-primary/30 focus:bg-white/80 focus:shadow-[0_0_0_2px_rgba(0,122,255,0.12)] dark:bg-white/8 dark:hover:bg-white/12 dark:focus:bg-white/12"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
