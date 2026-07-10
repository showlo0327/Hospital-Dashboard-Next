<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceLatency from '@/components/devices/DeviceLatency.vue'
import DeviceHealthIndicator from '@/components/devices/DeviceHealthIndicator.vue'
import DeviceInfo from '@/components/devices/DeviceInfo.vue'
import InspectorSection from './InspectorSection.vue'

/**
 * Realtime status section — live metrics from ping engine.
 *
 * @prop device — Selected device
 *
 * Component Maturity: Production Ready
 */
defineProps<{ device: Device }>()
</script>

<template>
  <InspectorSection title="Realtime Status">
    <div class="grid grid-cols-2 gap-x-2 gap-y-1.5">
      <DeviceInfo label="Status">
        <span
          class="text-[12.5px] font-semibold"
          :class="{
            'text-[#1f8b3b] dark:text-[#30D158]': device.status === 'Online',
            'text-[#a65b00] dark:text-[#FF9F0A]': device.status === 'Warning',
            'text-[#b42318] dark:text-[#FF453A]': device.status === 'Offline',
          }"
        >
          {{ device.status }}
        </span>
      </DeviceInfo>
      <DeviceInfo label="Latency">
        <DeviceLatency :latency="device.latency" :status="device.status" />
      </DeviceInfo>
      <DeviceInfo label="Availability">
        <DeviceHealthIndicator :availability="device.availability" :status="device.status" />
      </DeviceInfo>
      <DeviceInfo label="Packet Loss" :value="`${device.packetLoss}%`" />
      <DeviceInfo label="Health" value="Good" wide />
      <DeviceInfo label="Last Updated" :value="device.updated" />
    </div>
  </InspectorSection>
</template>
