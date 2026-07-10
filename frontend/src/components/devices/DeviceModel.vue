<script setup lang="ts">
import DeviceInfo from './DeviceInfo.vue'

/**
 * Model display — thin wrapper around DeviceInfo.
 *
 * @prop model — Device model (e.g. "Catalyst 9500X")
 */
defineProps<{
  model: string
}>()
</script>

<template>
  <DeviceInfo label="Model" :value="model" />
</template>
