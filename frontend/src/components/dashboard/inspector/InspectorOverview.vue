<script setup lang="ts">
import type { Device } from '@/types/device'
import { getDeviceDisplayName } from '@/types/device'
import DeviceInfo from '@/components/devices/DeviceInfo.vue'
import InspectorSection from './InspectorSection.vue'

/**
 * Overview section — basic device identification.
 *
 * @prop device — Selected device
 *
 * Component Maturity: Production Ready
 */
defineProps<{ device: Device }>()
</script>

<template>
  <InspectorSection title="Overview">
    <div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
      <DeviceInfo label="Device Name" :value="device.name" />
      <DeviceInfo label="IP Address" :value="device.ip" />
      <DeviceInfo label="MAC Address" :value="device.mac || '—'" />
      <DeviceInfo label="Type" :value="getDeviceDisplayName(device.type)" />
      <DeviceInfo label="Vendor" :value="device.vendor" />
      <DeviceInfo label="Model" :value="device.model" />
      <DeviceInfo label="Building" :value="device.building" />
      <DeviceInfo label="Floor" :value="device.floor" />
      <DeviceInfo label="Department" :value="device.department || '—'" />
      <DeviceInfo label="Location" :value="device.location" wide />
    </div>
  </InspectorSection>
</template>
