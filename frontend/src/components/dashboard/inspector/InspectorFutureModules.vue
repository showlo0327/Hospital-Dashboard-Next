<script setup lang="ts">
import { Cpu, ClipboardCheck, History, Database, Bell, GitBranch } from 'lucide-vue-next'
import InspectorSection from './InspectorSection.vue'

/**
 * Future modules section — placeholder links for upcoming features.
 *
 * No implementation — purely visual placeholders.
 *
 * Component Maturity: Stable
 */

const modules = [
  { icon: Cpu, label: 'SNMP', desc: 'SNMP monitoring & traps' },
  { icon: ClipboardCheck, label: 'Inspection', desc: 'Scheduled inspections' },
  { icon: History, label: 'Maintenance', desc: 'Maintenance history' },
  { icon: Database, label: 'Config Backup', desc: 'Configuration backups' },
  { icon: Bell, label: 'Alarm History', desc: 'Past alarms & events' },
  { icon: GitBranch, label: 'Topology', desc: 'Network topology view' },
]
</script>

<template>
  <InspectorSection title="Future Modules">
    <div class="space-y-1">
      <div
        v-for="mod in modules"
        :key="mod.label"
        class="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-[12.5px] text-muted-foreground/50 transition hover:bg-muted/40 dark:hover:bg-white/[0.04]"
      >
        <component :is="mod.icon" :size="14" class="shrink-0" />
        <div class="min-w-0 flex-1">
          <span class="font-medium">{{ mod.label }}</span>
          <span class="ml-1.5 text-[11px] text-muted-foreground/40">{{ mod.desc }}</span>
        </div>
      </div>
    </div>
  </InspectorSection>
</template>
