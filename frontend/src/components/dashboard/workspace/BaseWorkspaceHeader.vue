<script setup lang="ts">
/**
 * BaseWorkspaceHeader — Universal workspace header.
 *
 * Foundation for every page in the application. All workspace pages
 * (Dashboard, Assets, SNMP, Topology, Inspection, Alarms, Reports,
 * Settings) must reuse this component.
 *
 * @prop label              — Section label (e.g. "Operational Workspace")
 * @prop title              — Page title (e.g. "Network Workspace")
 * @prop subtitle           — Optional description text
 * @prop searchEnabled          — Show workspace search (default: false)
 * @prop searchPlaceholder      — Search input placeholder text
 * @prop refreshEnabled         — Show refresh button (default: false)
 * @prop filterEnabled          — Show filter button (default: false)
 * @prop viewSwitchEnabled      — Show list/grid toggle (default: false)
 * @prop moreMenuEnabled        — Show more actions button (default: false)
 * @prop view                   — Current view mode for view switch
 *
 * @slot leading   — Before the title in the left area
 * @slot center    — Replaces the search area entirely
 * @slot trailing  — After action buttons in the right area
 * @slot toolbar   — Additional row above the header
 * @slot status    — Status bar below the header
 *
 * Design Tokens Used:
 *   --primary, --muted-foreground, --border
 *   .toolbar, .seg, .seg-on
 *
 * Accessibility:
 *   All interactive elements use semantic <button> tags.
 *   Labels are visible or hidden via responsive classes.
 *
 * Future Extension:
 *   - breadcrumb slot via #toolbar
 *   - status bar via #status
 *   - custom actions via #trailing
 */

import WorkspaceTitle from './WorkspaceTitle.vue'
import WorkspaceSubtitle from './WorkspaceSubtitle.vue'
import WorkspaceSearch from './WorkspaceSearch.vue'
import WorkspaceActionGroup from './WorkspaceActionGroup.vue'
import WorkspaceRefreshButton from './WorkspaceRefreshButton.vue'
import WorkspaceFilterButton from './WorkspaceFilterButton.vue'
import WorkspaceViewSwitch from './WorkspaceViewSwitch.vue'
import WorkspaceMoreButton from './WorkspaceMoreButton.vue'

// ── Props ────────────────────────────────────────────
withDefaults(
  defineProps<{
    label: string
    title: string
    subtitle?: string
    searchEnabled?: boolean
    searchPlaceholder?: string
    searchQuery?: string
    refreshEnabled?: boolean
    filterEnabled?: boolean
    filterActive?: boolean
    refreshing?: boolean
    viewSwitchEnabled?: boolean
    moreMenuEnabled?: boolean
    view?: 'list' | 'grid'
  }>(),
  {
    subtitle: '',
    searchEnabled: false,
    searchPlaceholder: 'Search workspace...',
    searchQuery: '',
    refreshEnabled: false,
    filterEnabled: false,
    filterActive: false,
    refreshing: false,
    viewSwitchEnabled: false,
    moreMenuEnabled: false,
    view: 'list',
  },
)

// ── Emits ────────────────────────────────────────────
const emit = defineEmits<{
  'update:view': [value: 'list' | 'grid']
  'update:searchQuery': [value: string]
  'toggleFilter': []
  refresh: []
}>()

function onViewChange(value: 'list' | 'grid') {
  emit('update:view', value)
}
function onRefresh() {
  emit('refresh')
}
</script>

<template>
  <section class="space-y-3">
    <!-- ═══ Toolbar Slot (above main row) ═══ -->
    <slot name="toolbar" />

    <!-- ═══ Main Row: Left | Center | Right ═══ -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <!-- Left Area -->
      <div>
        <slot name="leading" />
        <WorkspaceTitle :label="label" :title="title" />
        <WorkspaceSubtitle v-if="subtitle" :text="subtitle" />
      </div>

      <!-- Center Area -->
      <slot v-if="$slots.center" name="center" />
      <WorkspaceSearch
        v-else-if="searchEnabled"
        :model-value="searchQuery"
        :placeholder="searchPlaceholder"
        @update:model-value="emit('update:searchQuery', $event)"
      />

      <!-- Right Area -->
      <WorkspaceActionGroup
        v-if="refreshEnabled || filterEnabled || viewSwitchEnabled || moreMenuEnabled || $slots.trailing"
      >
        <WorkspaceRefreshButton v-if="refreshEnabled" :loading="refreshing" @refresh="onRefresh" />
        <WorkspaceFilterButton v-if="filterEnabled" :active="filterActive" @toggle="emit('toggleFilter')" />
        <WorkspaceViewSwitch
          v-if="viewSwitchEnabled"
          :model-value="view!"
          @update:model-value="onViewChange"
        />
        <WorkspaceMoreButton v-if="moreMenuEnabled" />
        <slot name="trailing" />
      </WorkspaceActionGroup>
    </div>

    <!-- ═══ Status Slot (below main row) ═══ -->
    <slot name="status" />
  </section>
</template>
