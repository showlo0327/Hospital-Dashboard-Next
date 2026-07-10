<script setup lang="ts">
/**
 * Reusable content container.
 * Provides consistent max-width, padding, vertical rhythm,
 * and scroll behavior for every page in the application.
 */
</script>

<template>
  <div class="mx-auto max-w-[var(--page-max-width)] space-y-4 px-4 pb-7 xl:px-5">
    <slot />
  </div>
</template>
