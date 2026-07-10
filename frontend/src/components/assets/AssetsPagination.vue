<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * Reusable pagination component.
 *
 * @prop currentPage — 1-based current page
 * @prop totalPages  — Total number of pages
 * @prop totalItems  — Total item count
 * @prop pageSize    — Items per page
 *
 * @emits update:currentPage
 *
 * Component Maturity: Production Ready
 * Ready for backend pagination — no UI changes needed.
 */
defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>

<template>
  <div class="flex items-center justify-between border-t border-border/40 px-4 py-2.5">
    <p class="text-[11px] text-muted-foreground">
      {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, totalItems) }}
      of {{ totalItems }} assets
    </p>
    <div class="flex items-center gap-1">
      <button
        class="grid size-7 place-items-center rounded-[9px] text-muted-foreground transition hover:bg-muted/60 disabled:opacity-30"
        :disabled="currentPage <= 1"
        @click="emit('update:currentPage', currentPage - 1)"
      >
        <ChevronLeft :size="15" />
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        class="grid size-7 cursor-pointer place-items-center rounded-[9px] text-[12px] font-semibold transition"
        :class="
          page === currentPage
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-muted/60'
        "
        @click="emit('update:currentPage', page)"
      >
        {{ page }}
      </span>
      <button
        class="grid size-7 place-items-center rounded-[9px] text-muted-foreground transition hover:bg-muted/60 disabled:opacity-30"
        :disabled="currentPage >= totalPages"
        @click="emit('update:currentPage', currentPage + 1)"
      >
        <ChevronRight :size="15" />
      </button>
    </div>
  </div>
</template>
