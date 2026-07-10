<script setup lang="ts">
import { computed } from 'vue'
import { formatLocationPath } from '@/utils/location'
import DeviceInfo from './DeviceInfo.vue'

/**
 * Location display — formats building + floor + department + location.
 *
 * Uses the centralized formatLocationPath utility.
 * Separator: › (hierarchy arrow)
 *
 * @prop building    — Building name
 * @prop floor       — Floor identifier
 * @prop department  — Department name (optional)
 * @prop location    — Room / area description (optional)
 */
const props = defineProps<{
  building: string
  floor: string
  department?: string
  location?: string
}>()

const locationPath = computed(() =>
  formatLocationPath({
    building: props.building,
    floor: props.floor,
    department: props.department,
    location: props.location,
  }),
)
</script>

<template>
  <DeviceInfo label="Location" wide>
    <span
      class="truncate"
      :title="locationPath"
    >{{ locationPath }}</span>
  </DeviceInfo>
</template>
