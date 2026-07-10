<script setup lang="ts">
import DeviceInfo from './DeviceInfo.vue'

/**
 * Vendor display — thin wrapper around DeviceInfo.
 *
 * @prop vendor — Device vendor name (e.g. "Cisco", "HPE", "Huawei")
 */
defineProps<{
  vendor: string
}>()
</script>

<template>
  <DeviceInfo label="Vendor" :value="vendor" />
</template>
