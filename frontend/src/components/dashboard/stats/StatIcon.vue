<script setup lang="ts">
import type { Component } from 'vue'

/**
 * Colored icon container for stat cards.
 * Renders a rounded square with a tone-specific background and icon.
 *
 * Design Tokens Used: none (self-contained component)
 *
 * Component Maturity: Production Ready
 */
defineProps<{
  icon: Component
  /** Tailwind classes for text color and background — e.g. "text-primary bg-primary/10" */
  toneClass: string
}>()
</script>

<template>
  <div
    class="grid size-9 shrink-0 place-items-center rounded-[14px]"
    :class="toneClass"
  >
    <component :is="icon" :size="19" />
  </div>
</template>
