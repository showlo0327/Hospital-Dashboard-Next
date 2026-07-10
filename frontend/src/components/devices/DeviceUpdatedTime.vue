<script setup lang="ts">
/**
 * "Updated {time}" display — small muted timestamp.
 *
 * @prop time — Human-readable relative time string (e.g. "12 sec ago")
 *
 * Future: Will accept ISO 8601 and compute relative time via composable.
 *
 * Design Tokens Used:
 *   --color-muted-foreground
 */
defineProps<{
  time: string
}>()
</script>

<template>
  <p class="text-[11px] text-muted-foreground">
    Updated {{ time }}
  </p>
</template>
