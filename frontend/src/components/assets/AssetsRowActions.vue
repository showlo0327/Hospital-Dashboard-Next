<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'

/**
 * Per-row action buttons — Edit, Delete (asset management only).
 *
 * @prop deviceId — Device identifier
 *
 * @emits edit, delete
 *
 * Component Maturity: Production Ready
 */
defineProps<{ deviceId: string }>()
const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div class="flex items-center gap-0.5">
    <button
      class="grid size-7 place-items-center rounded-[9px] text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
      title="Edit"
      @click="emit('edit', deviceId)"
    >
      <Pencil :size="13" />
    </button>
    <button
      class="grid size-7 place-items-center rounded-[9px] text-muted-foreground transition hover:bg-muted/60 hover:text-destructive"
      title="Delete"
      @click="emit('delete', deviceId)"
    >
      <Trash2 :size="13" />
    </button>
  </div>
</template>
