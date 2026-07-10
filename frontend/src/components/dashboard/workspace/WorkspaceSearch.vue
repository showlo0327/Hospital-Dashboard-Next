<script setup lang="ts">
import { Search } from 'lucide-vue-next'

/**
 * Workspace search — reusable search bar for all workspace pages.
 *
 * @prop modelValue — Search query string
 * @prop placeholder — Search placeholder text
 *
 * @emits update:modelValue
 *
 * Search scope:
 *   Device Name, IP Address, MAC, Vendor, Model, Department, Location
 *
 * Design Tokens: --border, --muted-foreground
 *
 * Component Maturity: Production Ready
 */
withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Search devices...',
  },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div
    class="hidden h-9 min-w-[240px] flex-1 items-center gap-2 rounded-[15px] border border-border bg-white/48 px-3 shadow-sm backdrop-blur-xl sm:flex dark:bg-white/8"
  >
    <Search :size="15" class="shrink-0 text-muted-foreground/50" />
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="h-full w-full bg-transparent text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
