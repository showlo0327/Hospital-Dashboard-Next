<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Network,
  Activity,
  Database,
  Wrench,
  ShieldAlert,
  HardDrive,
  Settings,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

interface ModuleItem {
  icon: typeof LayoutDashboard
  label: string
  routeName: string
}

const modules: ModuleItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', routeName: 'dashboard' },
  { icon: Network, label: 'SNMP', routeName: 'snmp' },
  { icon: Activity, label: 'Topology', routeName: 'topology' },
  { icon: Database, label: 'Assets', routeName: 'assets' },
  { icon: Wrench, label: 'Inspection', routeName: 'inspection' },
  { icon: ShieldAlert, label: 'Alarm Center', routeName: 'alarms' },
  { icon: HardDrive, label: 'Reports', routeName: 'reports' },
  { icon: Settings, label: 'Settings', routeName: 'settings' },
]

const currentRouteName = computed(() => String(route.name ?? ''))

function navigate(routeName: string) {
  router.push({ name: routeName })
}

defineProps<{
  collapsed: boolean
}>()
</script>

<template>
  <div>
    <p :class="[collapsed ? 'sr-only' : 'sidebar-title']">Modules</p>
    <div class="space-y-1">
      <button
        v-for="{ icon: Icon, label, routeName } in modules"
        :key="routeName"
        :title="collapsed ? label : undefined"
        class="side-row w-full"
        :class="{
          'justify-center px-0': collapsed,
          'bg-primary/10 text-primary': currentRouteName === routeName,
        }"
        @click="navigate(routeName)"
      >
        <component :is="Icon" :size="16" />
        <span v-if="!collapsed">{{ label }}</span>
      </button>
    </div>
  </div>
</template>
