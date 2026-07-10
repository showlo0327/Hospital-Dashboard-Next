<script setup lang="ts">
/**
 * WorkspaceHeader — Dashboard specialization of BaseWorkspaceHeader.
 *
 * Pre-configured for the Network Workspace dashboard page:
 *   - Label: "Operational Workspace"
 *   - Title: "Network Workspace"
 *   - Subtitle: "Monitor and manage all network devices."
 *   - Search, Refresh, Filter, ViewSwitch, MoreMenu all enabled.
 *
 * For other pages, use BaseWorkspaceHeader directly with custom props.
 */
import BaseWorkspaceHeader from './BaseWorkspaceHeader.vue'

defineProps<{
  view: 'list' | 'grid'
  searchQuery?: string
  filterActive?: boolean
  refreshing?: boolean
}>()

const emit = defineEmits<{
  'update:view': [value: 'list' | 'grid']
  'update:searchQuery': [value: string]
  toggleFilter: []
  refresh: []
}>()
</script>

<template>
  <BaseWorkspaceHeader
    label="Operational Workspace"
    title="Network Workspace"
    subtitle="Monitor and manage all network devices."
    :search-enabled="true"
    :refresh-enabled="true"
    :filter-enabled="true"
    :view-switch-enabled="true"
    :more-menu-enabled="true"
    :view="view"
    @update:view="emit('update:view', $event)"
    @refresh="emit('refresh')"
    @update:search-query="emit('update:searchQuery', $event)"
    :refreshing="refreshing"
    @toggle-filter="emit('toggleFilter')"
  />
</template>
