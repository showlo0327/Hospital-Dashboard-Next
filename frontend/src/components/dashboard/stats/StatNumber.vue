<script setup lang="ts">
/**
 * Large numeric display for stat cards.
 * Extensible: slot allows future CountUp animated number replacement.
 */
defineProps<{
  value: string | number
}>()
</script>

<template>
  <div class="mt-1.5 text-[22px] font-bold leading-none tracking-[-0.005em]">
    <slot>
      {{ value }}
    </slot>
  </div>
</template>
