<script setup lang="ts">
import { computed } from 'vue'
import { Server, CheckCircle2, WifiOff, ShieldAlert, Heart } from 'lucide-vue-next'
import type { Component } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { DeviceStatus } from '@/types/device'
import StatCard from './StatCard.vue'

export type DashboardFilter = 'all' | 'online' | 'offline' | 'warning' | 'healthy'

/**
 * Dashboard statistics — interactive filter cards.
 *
 * Each card doubles as a workspace filter:
 *   Total Devices  → show all (default)
 *   Online         → filter by Online status
 *   Offline        → filter by Offline status
 *   Warning        → filter by Warning status
 *   Healthy        → filter by Online + not Warning + not Offline
 *
 * Active filter is visually highlighted (primary border, darker bg).
 * Only one filter active at a time.
 *
 * @prop activeFilter — Currently selected filter
 *
 * @emits select — Fired with the selected DashboardFilter
 *
 * Component Maturity: Production Ready
 */
const props = withDefaults(
  defineProps<{ activeFilter?: DashboardFilter }>(),
  { activeFilter: 'all' },
)
const emit = defineEmits<{ select: [filter: DashboardFilter] }>()

const store = useDeviceStore()

interface StatItem {
  key: DashboardFilter
  label: string
  value: string | number
  meta: string
  icon: Component
  toneClass: string
}

const stats = computed<StatItem[]>(() => {
  const s = store.statistics
  const all = store.devices
  const healthy = all.filter(d =>
    d.status === DeviceStatus.Online &&
    d.status !== DeviceStatus.Warning &&
    d.status !== DeviceStatus.Offline,
  ).length
  return [
    {
      key: 'all',
      label: 'Total Devices',
      value: s.total,
      meta: `${s.onlinePercentage}% healthy`,
      icon: Server,
      toneClass: 'text-primary bg-primary/10',
    },
    {
      key: 'online',
      label: 'Online',
      value: s.online,
      meta: `${s.onlinePercentage}% healthy`,
      icon: CheckCircle2,
      toneClass: 'text-[#1f8b3b] bg-[#34C759]/10',
    },
    {
      key: 'offline',
      label: 'Offline',
      value: s.offline,
      meta: 'requires dispatch',
      icon: WifiOff,
      toneClass: 'text-[#b42318] bg-[#FF3B30]/10',
    },
    {
      key: 'warning',
      label: 'Warning',
      value: s.warning,
      meta: 'latency / packet loss',
      icon: ShieldAlert,
      toneClass: 'text-[#a65b00] bg-[#FF9500]/12',
    },
    {
      key: 'healthy',
      label: 'Healthy Devices',
      value: healthy,
      meta: 'online + no issues',
      icon: Heart,
      toneClass: 'text-[#30D158] bg-[#30D158]/10',
    },
  ]
})
</script>

<template>
  <section class="grid grid-cols-2 gap-3 xl:grid-cols-5">
    <StatCard
      v-for="stat in stats"
      :key="stat.key"
      :label="stat.label"
      :value="stat.value"
      :meta="stat.meta"
      :icon="stat.icon"
      :tone-class="stat.toneClass"
      :active="activeFilter === stat.key"
      @select="emit('select', stat.key)"
    />
  </section>
</template>
