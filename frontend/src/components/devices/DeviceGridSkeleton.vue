<script setup lang="ts">
import DeviceSkeleton from './DeviceSkeleton.vue'

/**
 * Grid loading skeleton — reuses DeviceSkeleton in a responsive grid.
 *
 * Renders 6 skeleton cards matching the grid layout.
 * Zero duplicated skeleton logic — delegates entirely to DeviceSkeleton.
 *
 * Component Maturity: Production Ready
 */
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    <DeviceSkeleton v-for="n in 6" :key="n" />
  </div>
</template>
