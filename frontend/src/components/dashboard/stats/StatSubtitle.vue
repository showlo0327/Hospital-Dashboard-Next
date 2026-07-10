<script setup lang="ts">
/**
 * Small meta text below the stat value.
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="mt-1.5 text-[11px] text-muted-foreground">
    {{ text }}
  </p>
</template>
