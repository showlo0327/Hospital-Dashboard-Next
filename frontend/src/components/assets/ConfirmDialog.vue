<script setup lang="ts">
import { AlertTriangle, Trash2, Loader2 } from 'lucide-vue-next'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="emit('cancel')">
    <div class="relative w-full max-w-[400px] overflow-hidden rounded-[28px] border border-white/70 bg-white/92 shadow-[0_24px_64px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141820]/94">
      <div class="flex flex-col items-center gap-4 p-6 pt-8 text-center">
        <div class="grid size-14 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle :size="26" />
        </div>
        <div>
          <h3 class="text-[16px] font-semibold">{{ title }}</h3>
          <p class="mt-1 text-[13px] text-muted-foreground">{{ message }}</p>
        </div>
      </div>
      <div class="flex gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          class="flex-1 rounded-2xl border border-border bg-white/60 py-2.5 text-[14px] font-semibold transition hover:bg-white dark:bg-white/8 dark:hover:bg-white/12"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-40"
          :disabled="loading"
          @click="emit('confirm')"
        >
          <Loader2 v-if="loading" :size="16" class="animate-spin" />
          <Trash2 v-else :size="16" />
          {{ confirmLabel || 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>
