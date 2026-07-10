<script setup lang="ts">
/**
 * Workspace title — label + heading.
 * Reusable for any workspace page (Dashboard, SNMP, Topology, etc.).
 */
defineProps<{
  label: string
  title: string
}>()
</script>

<template>
  <div>
    <p class="text-[13px] font-semibold text-primary">
      {{ label }}
    </p>
    <h2 class="text-[26px] font-bold tracking-[-0.005em]">
      {{ title }}
    </h2>
  </div>
</template>
