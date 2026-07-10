<script setup lang="ts">
/**
 * Workspace subtitle — descriptive text below the title.
 * Supports future dynamic text (e.g. device count, status summary).
 */
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="text-[13px] text-muted-foreground">
    {{ text }}
  </p>
</template>
