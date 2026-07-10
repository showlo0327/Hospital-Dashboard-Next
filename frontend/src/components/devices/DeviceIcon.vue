<script setup lang="ts">
import {
  Server, Router, Wifi, Database, GlobeLock, Globe,
  Monitor, Cloud, Smartphone, HeartPulse, MonitorPlay, Printer,
  Cpu, HelpCircle,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { DeviceType } from '@/types/device'

/**
 * Device-type icon rendered in a subtle rounded square container.
 *
 * Uses the centralized DEVICE_TYPE_META map — never hardcodes type knowledge.
 * Every DeviceType maps to a Lucide icon via this component's icon map.
 *
 * @prop type  — DeviceType enum value (from centralized system)
 * @prop size  — Icon pixel size (default 18)
 *
 * Design Tokens Used:
 *   --color-muted, --color-muted-foreground, --radius-sm
 *
 * Component Maturity: Production Ready
 * Centralized icon map, no raw strings, single source of truth.
 */
defineProps<{
  type: DeviceType
  size?: number
}>()

/**
 * Maps every DeviceType to a Lucide icon.
 * This is the ONLY place in the application where device-type → icon
 * mapping is defined. New device types: add one line here.
 */
const iconMap: Record<DeviceType, Component> = {
  // Network
  [DeviceType.CoreSwitch]: Server,
  [DeviceType.AggregationSwitch]: Server,
  [DeviceType.AccessSwitch]: Server,
  [DeviceType.Firewall]: GlobeLock,
  [DeviceType.WirelessAP]: Wifi,
  [DeviceType.Internet]: Globe,

  // Compute
  [DeviceType.Server]: Database,
  [DeviceType.VirtualizationPlatform]: Cpu,

  // Endpoint
  [DeviceType.DesktopPC]: Monitor,
  [DeviceType.CloudDesktop]: Cloud,
  [DeviceType.PDA]: Smartphone,
  [DeviceType.MedicalDevice]: HeartPulse,
  [DeviceType.SelfServiceKiosk]: MonitorPlay,
  [DeviceType.Printer]: Printer,

  // Other
  [DeviceType.Unknown]: HelpCircle,
}
</script>

<template>
  <div class="grid size-[42px] shrink-0 place-items-center rounded-[13px] bg-muted/60 dark:bg-muted/20">
    <component :is="iconMap[type]" :size="size ?? 18" class="text-muted-foreground" />
  </div>
</template>
